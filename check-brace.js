const fs = require('fs');
const content = fs.readFileSync('e:/pims设计/app/src/types/index.ts', 'utf8');
const lines = content.split('\n');
let braceCount = 0;
for(let i=0; i<190; i++) {
  const line = lines[i];
  for(const c of line) {
    if(c === '{') braceCount++;
    if(c === '}') braceCount--;
  }
  if(i >= 175 && i <= 185) {
    console.log((i+1) + ': braceCount=' + braceCount + ' ' + JSON.stringify(line.substring(0,80)));
  }
}
