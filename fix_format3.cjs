const fs = require('fs');

const content = fs.readFileSync('src/data/ceramic_products.ts', 'utf8');

// 找到所有 ] },\n 模式 (闭合的 supplierPrices 对象后直接跟逗号)
const lines = content.split('\n');
const fixed = [];
let skipNext = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();

  // 如果当前行以 ] } 结尾，并且下一行是单独的逗号
  if (trimmed.endsWith('] }') && lines[i+1] && lines[i+1].trim() === ',') {
    // 替换 ] } 为 ] }\n,
    const parts = line.split('] }');
    fixed.push(parts[0] + '] }');
    fixed.push(',');
    skipNext = true;
  } else if (skipNext && trimmed === ',') {
    skipNext = false;
    // 跳过重复的逗号
  } else {
    fixed.push(line);
  }
}

fs.writeFileSync('src/data/ceramic_products.ts', fixed.join('\n'));
console.log('Fixed!');
