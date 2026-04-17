const fs = require('fs');

const content = fs.readFileSync('src/data/ceramic_products.ts', 'utf8');

// 修复模式: `...\n  },` 在同一行的情况
// 替换为: `...\n  }\n,`

// 查找 supplierPrices 数组后面的 }, 格式并修复
const fixed = content.replace(
  /(\] \})\s*,(\s*\n\s*\n\s*\{)/g,
  '] }\n,$2'
);

fs.writeFileSync('src/data/ceramic_products.ts', fixed);
console.log('Fixed format');
