import express from 'express';
import { PuppeteerWebBaseLoader } from '@langchain/community/document_loaders/web/puppeteer';
import * as puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';
import { OpenAIEmbeddings } from '@langchain/openai';
import pc from '../config/pinecone.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

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

    const loader = new PuppeteerWebBaseLoader(url, {
      launchOptions: { headless: true },
      async evaluate(page, browser) {
        try {
          await page.goto(url);
          const textContent = await page.evaluate(() => {
            const bodyElement = document.querySelector('body');
            return bodyElement ? bodyElement.textContent : '';
          });
          await browser.close();
          return textContent || '';
        } catch (error) {
          console.error('Error occurred while loading the page: ', error);
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
      apiKey: process.env.OPEN_AI_KEY,
      model: 'text-embedding-3-large',
    });

    const index = pc.index('ai-customer-support');

    const vectorContent = await Promise.all(
      splitContent.map(async (doc) => {
        const vectors = await embeddings.embedDocuments([doc.pageContent]);
        const uniqueId = uuidv4();
        await index.upsert([
          { id: uniqueId, values: vectors[0], metadata: { text: doc.pageContent } },
        ]);
        return uniqueId;
      })
    );

    return res.json({ message: 'Successful', content: vectorContent });
  } catch (error) {
    console.error('Error in POST /api/rag:', error);
    return res.status(500).json({ message: 'Failed to scrape the website', error: error.message });
  }
});

export default router;
