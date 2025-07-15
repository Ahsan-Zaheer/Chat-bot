import { client } from "../config/db";

async function createSchema() {
  await client.schema
    .classCreator()
    .withClass({
      class: 'Chat',
      description: 'Conversation history between user and bot',
      vectorizer: 'none',
      properties: [
        { name: 'name', dataType: ['text'] },
        { name: 'email', dataType: ['text'] },
        { name: 'info', dataType: ['text'] },
        { name: 'conversation', dataType: ['text'] },
        { name: 'createdAt', dataType: ['date'] },
      ],
    })
    .do();

  console.log('✅ Chat schema created');
}

createSchema().catch(console.error);
