const fs = require("fs");
const path = require("path");

const outAppChunksDir = path.join(
  __dirname,
  "out",
  "_next",
  "static",
  "chunks",
  "app"
);

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function hasDynamicSegment(name) {
  return name.startsWith("[") && name.endsWith("]");
}

function toEncodedSegment(name) {
  return encodeURIComponent(name);
}

function createEncodedMirrors(rootDir) {
  if (!fs.existsSync(rootDir)) {
    console.log("Skip: exported app chunks directory does not exist yet.");
    return;
  }

  let created = 0;

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const srcDir = path.join(currentDir, entry.name);

      if (hasDynamicSegment(entry.name)) {
        const encodedName = toEncodedSegment(entry.name);
        const encodedDir = path.join(currentDir, encodedName);

        if (!fs.existsSync(encodedDir)) {
          copyDirRecursive(srcDir, encodedDir);
          created += 1;
          console.log(`Created encoded mirror: ${encodedDir}`);
        }
      }

      walk(srcDir);
    }
  }

  walk(rootDir);
  console.log(`Done. Encoded dynamic chunk mirrors created: ${created}`);
}

createEncodedMirrors(outAppChunksDir);