const fs = require('fs');
const path = require('path');

const walk = (dir, callback) => {
  fs.readdirSync(dir).forEach(file => {
    let filepath = path.join(dir, file);
    let stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walk(filepath, callback);
    } else if (filepath.endsWith('.jsx')) {
      callback(filepath);
    }
  });
};

walk('src', (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  let lines = content.split('\n');
  let newLines = [];
  let foundImport = false;
  
  for (let line of lines) {
    if (line.trim().startsWith('import Ripple from')) {
      if (foundImport) {
        // Skip duplicate
        continue;
      }
      foundImport = true;
      // also fix DataTable import Ripple from 'Ripple';
      if (line.includes("'Ripple'")) {
        line = "import Ripple from './Ripple';";
      }
    }
    newLines.push(line);
  }
  
  const newContent = newLines.join('\n');
  if (newContent !== content) {
    fs.writeFileSync(filepath, newContent);
    console.log(`Fixed duplicates in ${filepath}`);
  }
});
