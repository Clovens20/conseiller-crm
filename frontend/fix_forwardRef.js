import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'src/components/ui');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const regex = /React\.forwardRef\(\(\{\s*className/g;
  if (regex.test(content)) {
    content = content.replace(regex, 'React.forwardRef<any, any>(({\n  className');
    changed = true;
  }
  
  const regex2 = /React\.forwardRef\(\(props/g;
  if (regex2.test(content)) {
    content = content.replace(regex2, 'React.forwardRef<any, any>((props');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(d) {
  const files = fs.readdirSync(d);
  for (const file of files) {
    const fullPath = path.join(d, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

walkDir(dir);
