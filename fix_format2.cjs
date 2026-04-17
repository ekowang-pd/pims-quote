const fs = require('fs');

const content = fs.readFileSync('src/data/ceramic_products.ts', 'utf8');

// 把 ] },\n 这种格式转换为 ] }\n,
// 模式: ] 后面跟着 }, 然后换行
const lines = content.split('\n');
const fixed = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // 如果行末是 ] } 并且下一行是空行再下一行是 {，
  // 合并成 ] } 然后换行
  if (line.endsWith('] }') && lines[i+1] && lines[i+1].trim() === ',' && lines[i+2] && lines[i+2].trim().startsWith('{')) {
    fixed.push(line);
    fixed.push(',');
    i++; // 跳过逗号行
  } else {
    fixed.push(line);
  }
}

fs.writeFileSync('src/data/ceramic_products.ts', fixed.join('\n'));
console.log('Fixed! Total lines:', fixed.length);
