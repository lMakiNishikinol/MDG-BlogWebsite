const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'out');

function fixHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const relativePath = path.relative(outDir, filePath);
  const depth = relativePath.split(path.sep).length - 1;
  const prefix = depth === 0 ? './' : '../'.repeat(depth);
  
  content = content.replace(/href="\/_next\//g, `href="${prefix}_next/`);
  content = content.replace(/src="\/_next\//g, `src="${prefix}_next/`);
  content = content.replace(/href='\/_next\//g, `href='${prefix}_next/`);
  content = content.replace(/src='\/_next\//g, `src='${prefix}_next/`);
  
  content = content.replace(/href="\.\/_next\//g, `href="${prefix}_next/`);
  content = content.replace(/src="\.\/_next\//g, `src="${prefix}_next/`);
  
  content = content.replace(/href="\/(posts|categories|tags|about|archives|gallery)"/g, `href="${prefix}$1/"`);
  content = content.replace(/href='\/(posts|categories|tags|about|archives|gallery)'/g, `href='${prefix}$1/'`);
  
  content = content.replace(/href="\/(posts|categories|tags)\/([^"]+)"/g, `href="${prefix}$1/$2/"`);
  content = content.replace(/href='\/(posts|categories|tags)\/([^']+)'/g, `href='${prefix}$1/$2/'`);
  
  content = content.replace(/srcset="[^"]*"/g, (match) => {
    let result = match.replace(/\/_next\//g, `${prefix}_next/`);
    return result;
  });
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Fixed: ${filePath}`);
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.name.endsWith('.html')) {
      fixHtmlFile(fullPath);
    }
  }
}

console.log('Fixing all HTML paths...');
processDirectory(outDir);
console.log('Done!');
