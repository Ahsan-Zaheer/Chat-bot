import { client } from "../config/db";

async function createSchema() {
  await client.schema
    .classCreator()
    .withClass({
      class: 'Message',
      description: 'User contact form messages',
      vectorizer: 'none', // optional; change to 'none' if you don't want automatic embeddings
      properties: [
        {
          name: 'name',
          dataType: ['text'],
        },
        {
          name: 'email',
          dataType: ['text'],
        },
        {
          name: 'info',
          dataType: ['text'],
        },
        {
          name: 'message',
          dataType: ['text'],
        },
        {
          name: 'createdAt',
          dataType: ['date'],
        },
        {
          name: 'updatedAt',
          dataType: ['date'],
        }

      ],
    })
    .do();

  console.log('✅ Schema created');
}

createSchema().catch(console.error);
