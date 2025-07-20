  // routers/rag.route.js
  import express from 'express';
  import { PuppeteerWebBaseLoader } from '@langchain/community/document_loaders/web/puppeteer';
  import * as cheerio from 'cheerio';
  import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
  import { Document } from 'langchain/document';
  import { OpenAIEmbeddings } from '@langchain/openai';
  import { v4 as uuidv4 } from 'uuid';
  import { client } from '../config/db.js';

  const router = express.Router();

  // Clean up HTML content
  const dataCleanUp = (pageContent) => {
    const $ = cheerio.load(pageContent);
    $('script, style').remove();
    const cleanedData = $.text();
    return cleanedData.replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim();
  };

  router.post('/', async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ message: 'url is required' });
      }


    console.log("Launching Puppeteer with args:", ['--no-sandbox', '--disable-setuid-sandbox']);


    const loader = new PuppeteerWebBaseLoader(url, {
      
      launchOptions: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
      async evaluate(page, browser) {
        try {
          await page.goto(url, { waitUntil: 'domcontentloaded' });
          const textContent = await page.evaluate(() => {
            const bodyElement = document.querySelector('body');
            return bodyElement ? bodyElement.textContent : '';
          });
          await browser.close();
          return textContent || '';
        } catch (error) {
          console.error('Error occurred while loading the page:', error);
          await browser.close();
          return '';
        }
      },
    });


      const docs = await loader.load();
      const pageContent = docs[0].pageContent;
      const cleanContent = dataCleanUp(pageContent);

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 50,
      });

      const splitContent = await splitter.splitDocuments([
        new Document({ pageContent: cleanContent }),
      ]);

      const embeddings = new OpenAIEmbeddings({
        apiKey: process.env.OPEN_AI_KEY, // Replace with your OpenAI API Key
        model: 'text-embedding-3-large',
      });

      const vectorContent = await Promise.all(
        splitContent.map(async (doc) => {
          const [embedding] = await embeddings.embedDocuments([doc.pageContent]);
          const id = uuidv4();

          await client.data
            .creator()
            .withClassName('WebContent') // Ensure this class exists in Weaviate
            .withId(id)
            .withProperties({
              text: doc.pageContent,
            })
            .withVector(embedding)
            .do();

          return id;
        })
      );

      return res.json({ message: 'Successful', content: vectorContent, text: cleanContent });
    } catch (error) {
      console.error('Error in POST /api/rag:', error);
      return res.status(500).json({ message: 'Failed to scrape the website', error: error.message });
    }
  });

  export default router;
