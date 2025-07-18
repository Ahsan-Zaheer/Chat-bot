import weaviate from 'weaviate-ts-client';
import dotenv from 'dotenv';

dotenv.config();

// export const client = weaviate.client({
//   scheme: 'https',
//   // host: 'qtpcyernquleegozqv5ca.c0.us-west3.gcp.weaviate.cloud',
//   host: 'xbcf7zntqbittvuwdzyshw.c0.asia-southeast1.gcp.weaviate.cloud',
//   // Uncomment below if your cluster requires an API key
//   // apiKey: new weaviate.ApiKey('SUtuVTFsSUhzaFQxa1BhV19LUjk0UUpzbGVIV0ZtRisyTFlhSEI5S3FPZHpmL0dVTzZKQVJodDQrYWNVPV92MjAw'),
//   apiKey: new weaviate.ApiKey('WGF1RUxPc0tBRGM3MmhxRF9RRUV4blE3c3pJYktrM0lPcUNCL3ZTR0dPZmpzK1BCVVlCK0RxSzhtajFRPV92MjAw'),
// });



//Client key


export const client = weaviate.client({
  scheme: 'https',
  host: 'qtpcyernquleegozqv5ca.c0.us-west3.gcp.weaviate.cloud',
  apiKey: new weaviate.ApiKey('SUtuVTFsSUhzaFQxa1BhV19LUjk0UUpzbGVIV0ZtRisyTFlhSEI5S3FPZHpmL0dVTzZKQVJodDQrYWNVPV92MjAw'),
});


