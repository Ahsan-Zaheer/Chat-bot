// index.js
import weaviate from 'weaviate-ts-client';
import dotenv from 'dotenv';

dotenv.config();

export const client = weaviate.client({
  scheme: 'https',
  host: 'xbcf7zntqbittvuwdzyshw.c0.asia-southeast1.gcp.weaviate.cloud',
  // Uncomment below if your cluster requires an API key
  apiKey: new weaviate.ApiKey('WGF1RUxPc0tBRGM3MmhxRF9RRUV4blE3c3pJYktrM0lPcUNCL3ZTR0dPZmpzK1BCVVlCK0RxSzhtajFRPV92MjAw'),
});


