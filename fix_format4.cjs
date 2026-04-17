const fs = require('fs');

const content = fs.readFileSync('src/data/ceramic_products.ts', 'utf8');

// 把 ] }, 变成 ] }\n,
// 同时处理 ] }\n, 变成 ] }\n,
// 简单替换所有 ] }, 为 ] }\n,
let fixed = content;

// 找到所有 ] }, 的位置
const regex = /\] \},\s*\n/g;
let match;
const matches = [];

while ((match = regex.exec(fixed)) !== null) {
  matches.push({
    index: match.index,
    length: match[0].length,
    text: match[0]
  });
}

console.log('Found', matches.length, 'matches');

// 替换
fixed = fixed.replace(/\] \},\s*\n/g, '] }\n,\n');

fs.writeFileSync('src/data/ceramic_products.ts', fixed);
console.log('Fixed!');
