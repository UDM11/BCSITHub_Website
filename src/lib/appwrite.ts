
// src/lib/appwrite.ts
import { Client, Storage, ID, Databases } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
  .setProject('6884d3e40020bf84778d'); // Your Appwrite project ID

export const storage = new Storage(client);
export const databases = new Databases(client);
export { ID };
