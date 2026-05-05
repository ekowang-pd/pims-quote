const fs = require('fs');
const path = 'e:/pims设计/app/src/components/VanityCabinetConfigurator.tsx';
let content = fs.readFileSync(path, 'utf8');

const lines = content.split('\n');
let result = [];
let inOrphanBlock = false;
let skipOrphanedClosingDiv = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const stripped = line.trimStart();
  const leadingSpaces = line.length - line.trimStart().length;
  
  // Start orphan block
  if (stripped.includes('key_sub=')) {
    inOrphanBlock = true;
  }
  
  // Skip _KEEP_THIS_ and _DELETE_THIS_BLOCK_ markers
  if (stripped.includes('_KEEP_THIS_')) continue;
  if (stripped.includes('_DELETE_THIS_BLOCK_')) {
    inOrphanBlock = false;
    // The next </div> is the orphaned closing of space-y-2 div (it has 6 spaces indent = 2 tabs)
    skipOrphanedClosingDiv = true;
    continue;
  }
  
  // Skip orphaned </div> (closing of space-y-2 div without its opening)
  if (skipOrphanedClosingDiv && stripped === '</div>') {
    // This should be the orphaned </div> with 6 spaces (2 tabs) indent
    if (leadingSpaces >= 6) {
      skipOrphanedClosingDiv = false;
      continue;
    }
  }
  
  if (!inOrphanBlock) {
    result.push(line);
  }
}

const newContent = result.join('\n');
fs.writeFileSync(path, newContent);
console.log('Done. ' + lines.length + ' -> ' + result.length + ' lines');
