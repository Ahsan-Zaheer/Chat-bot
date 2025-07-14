// index.js
import weaviate from 'weaviate-ts-client';

export const client = weaviate.client({
  scheme: 'https',
  host: 'qtpcyernquleegozqv5ca.c0.us-west3.gcp.weaviate.cloud',
  // Uncomment below if your cluster requires an API key
  // apiKey: new weaviate.ApiKey('YOUR_API_KEY'),
});

