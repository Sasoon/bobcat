import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uuidRegex = /\b[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}\b/;
const directoryToScan = 'src'; // Adjust this to your codebase directory

function scanDirectory(directory) {
  let uuids = [];
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      uuids = uuids.concat(scanDirectory(fullPath));
    } else if (stat.isFile()) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const matches = content.match(new RegExp(uuidRegex, 'g'));
      if (matches) {
        uuids = uuids.concat(matches);
      }
    }
  }

  return uuids;
}

const imageUUIDs = Array.from(new Set(scanDirectory(directoryToScan)));
fs.writeFileSync('imageUUIDs.json', JSON.stringify(imageUUIDs, null, 2));
console.log(`Found ${imageUUIDs.length} unique UUIDs.`);