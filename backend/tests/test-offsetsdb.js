import https from 'https';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';

const streamPipeline = promisify(pipeline);

console.log('🌍 Downloading OffsetsDB CSV...\n');

const url = 'https://carbonplan-offsets-db.s3.us-west-2.amazonaws.com/production/latest/offsets-db.csv.zip';

async function downloadFile() {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = createWriteStream('offsets-db.csv.zip');
        streamPipeline(response, fileStream)
          .then(() => {
            console.log('✅ Download complete!');
            console.log(`File size: ${fileStream.bytesWritten} bytes`);
            resolve();
          })
          .catch(reject);
      } else {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
      }
    }).on('error', reject);
  });
}

downloadFile()
  .then(() => console.log('\n✅ Ready to extract and parse!'))
  .catch((error) => console.error('❌ Error:', error.message));
