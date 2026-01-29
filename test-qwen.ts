
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { generateHistoricalImage } from './api/services/qwen.js';

dotenv.config();

async function test() {
  const apiKey = process.env.QWEN_API_KEY;
  if (!apiKey) {
    console.error('Error: QWEN_API_KEY is not set in .env');
    return;
  }

  // Use the image we found in node_modules for testing
  const testImagePath = path.join(process.cwd(), 'node_modules', 'undici', 'docs', 'assets', 'lifecycle-diagram.png');
  
  if (!fs.existsSync(testImagePath)) {
    console.error('Error: Test image not found at', testImagePath);
    return;
  }

  console.log('--- Starting Qwen API Test ---');
  console.log('Using API Key:', apiKey.substring(0, 8) + '...');
  console.log('Test Image:', testImagePath);

  try {
    const result = await generateHistoricalImage({
      imagePath: testImagePath,
      dynasty: 'tang',
      apiKey: apiKey
    });

    console.log('--- Test Successful ---');
    console.log('API Response:', JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('--- Test Failed ---');
    console.error('Error Message:', error.message);
    if (error.stack) {
      console.error('Stack Trace:', error.stack);
    }
  }
}

test();
