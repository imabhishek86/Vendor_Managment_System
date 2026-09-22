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
  let changed = false;

  // Add Ripple import if we are going to add Ripples
  if (content.includes('<button') && !content.includes('Ripple')) {
    // Basic regex to find buttons that have bg- or hover:bg-
    const buttonRegex = /<button\s+([^>]*?)className=["']([^"']*(?:bg-|hover:bg-|text-primary|text-slate|text-red)[^"']*)["']([^>]*)>/g;
    
    content = content.replace(buttonRegex, (match, beforeClass, classes, afterClass) => {
      // Don't add to very specific small icon buttons if it breaks layout, but relative overflow-hidden usually fine
      if (!classes.includes('relative')) classes += ' relative';
      if (!classes.includes('overflow-hidden')) classes += ' overflow-hidden';
      // Add standard transition if not present
      if (!classes.includes('transition-')) classes += ' transition-all duration-200';
      
      changed = true;
      let rippleColor = 'rgba(0, 0, 0, 0.1)';
      if (classes.includes('bg-primary-600') || classes.includes('bg-red-600') || classes.includes('text-white')) {
        rippleColor = 'rgba(255, 255, 255, 0.3)';
      }
      
      return `<button ${beforeClass}className="${classes}"${afterClass}>\n        <Ripple color="${rippleColor}" />`;
    });

    if (changed) {
      // Insert import
      const importStmt = `import Ripple from '${path.relative(path.dirname(filepath), 'src/components/common/Ripple').replace(/\\/g, '/')}';\n`;
      // Put it after the last import
      const lastImportIndex = content.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
        const endOfImport = content.indexOf('\\n', lastImportIndex);
        content = content.slice(0, endOfImport + 1) + importStmt + content.slice(endOfImport + 1);
      } else {
        content = importStmt + content;
      }
      
      // Need to fix the import placement, simply putting it at top is safer if we just do:
      content = importStmt + content;
      fs.writeFileSync(filepath, content);
      console.log(`Updated ${filepath}`);
    }
  }
});
