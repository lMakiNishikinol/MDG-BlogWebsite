const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const nextDir = path.join(projectRoot, '.next');
const outDir = path.join(projectRoot, 'out');
const staticDir = path.join(nextDir, 'static');
const serverAppDir = path.join(nextDir, 'server', 'app');

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      try {
        fs.copyFileSync(srcPath, destPath);
      } catch (err) {
        console.warn(`Warning: Could not copy ${srcPath}: ${err.message}`);
      }
    }
  }
}

function buildStaticSite() {
  console.log('Building static site...');
  
  if (fs.existsSync(outDir)) {
    try {
      fs.rmSync(outDir, { recursive: true, force: true });
    } catch (err) {
      console.warn(`Warning: Could not clean out directory: ${err.message}`);
    }
  }
  
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  if (fs.existsSync(staticDir)) {
    const nextStaticDir = path.join(outDir, '_next', 'static');
    copyDirSync(staticDir, nextStaticDir);
    console.log('Copied static files');
  }
  
  if (fs.existsSync(serverAppDir)) {
    processAppDir(serverAppDir, outDir);
    console.log('Copied HTML files');
  }
  
  const publicDir = path.join(projectRoot, 'public');
  if (fs.existsSync(publicDir)) {
    const entries = fs.readdirSync(publicDir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.name === 'data') continue;
      
      const srcPath = path.join(publicDir, entry.name);
      const destPath = path.join(outDir, entry.name);
      
      if (entry.isDirectory()) {
        copyDirSync(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
    console.log('Copied public files');
  }
  
  const publicDataDir = path.join(publicDir, 'data');
  const outDataDir = path.join(outDir, 'data');
  if (fs.existsSync(publicDataDir)) {
    copyDirSync(publicDataDir, outDataDir);
    console.log('Copied data files');
  }
  
  console.log('Static site built successfully!');
  console.log(`Output directory: ${outDir}`);
}

function processAppDir(srcDir, destDir) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    
    if (entry.isDirectory()) {
      if (entry.name === '[slug]') {
        processSlugDir(srcPath, destDir);
      } else {
        const subDestDir = path.join(destDir, entry.name);
        processAppDir(srcPath, subDestDir);
      }
    } else if (entry.name.endsWith('.html')) {
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      const baseName = entry.name.replace('.html', '');
      
      if (baseName === 'index' || baseName === '_not-found') {
        fs.copyFileSync(srcPath, path.join(destDir, entry.name));
      } else {
        const htmlDestDir = path.join(destDir, baseName);
        if (!fs.existsSync(htmlDestDir)) {
          fs.mkdirSync(htmlDestDir, { recursive: true });
        }
        fs.copyFileSync(srcPath, path.join(htmlDestDir, 'index.html'));
      }
    }
  }
}

function processSlugDir(srcDir, destDir) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.name.endsWith('.html')) {
      const slug = entry.name.replace('.html', '');
      const slugDestDir = path.join(destDir, slug);
      
      if (!fs.existsSync(slugDestDir)) {
        fs.mkdirSync(slugDestDir, { recursive: true });
      }
      
      const srcPath = path.join(srcDir, entry.name);
      fs.copyFileSync(srcPath, path.join(slugDestDir, 'index.html'));
    }
  }
}

buildStaticSite();
