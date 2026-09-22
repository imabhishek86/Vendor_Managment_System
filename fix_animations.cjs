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
  let originalContent = content;

  // Replace modal animations
  content = content.replace(/animate-in fade-in zoom-in-95 duration-200/g, 'animate-modal-enter');
  content = content.replace(/animate-in slide-in-from-bottom-8/g, 'animate-modal-enter');
  content = content.replace(/animate-in zoom-in-95 duration-200/g, 'animate-modal-enter');
  content = content.replace(/animate-in fade-in duration-200/g, 'transition-opacity');
  
  // Replace popover/toast animations
  content = content.replace(/animate-in fade-in slide-in-from-top-4/g, 'animate-popover-enter');

  if (content !== originalContent) {
    fs.writeFileSync(filepath, content);
    console.log(`Updated animations in ${filepath}`);
  }
});
