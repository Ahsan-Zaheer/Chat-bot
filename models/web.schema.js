import { client } from '../config/db.js'; // adjust path if needed

async function createWebContentSchema() {
  try {
    await client.schema
      .classCreator()
      .withClass({
        class: 'WebContent',
        description: 'Web page text chunks for RAG processing',
        vectorizer: 'none', // because you're manually embedding via OpenAI
        properties: [
          {
            name: 'text',
            dataType: ['text'],
          },
        ],
      })
      .do();

    console.log('✅ WebContent schema created');
  } catch (error) {
    console.error('❌ Failed to create WebContent schema:', error.message);
  }
}

createWebContentSchema();
