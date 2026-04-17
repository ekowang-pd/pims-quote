// 为陶瓷产品添加标签
const fs = require('fs');

// 读取现有数据
const content = fs.readFileSync('./ceramic_products.ts', 'utf-8');

// 定义标签配置
const tagConfigs = [
  { type: 'hot', weight: 3 },        // 热销 30%
  { type: 'recommend', weight: 3 },  // 推荐 30%
  { type: 'new', weight: 2 },       // 新品 20%
  { type: 'sale', weight: 2 },      // 特价 20%
];

// 总权重
const totalWeight = tagConfigs.reduce((sum, t) => sum + t.weight, 0);

// 随机选择标签类型
function randomTagType() {
  let r = Math.random() * totalWeight;
  for (const config of tagConfigs) {
    r -= config.weight;
    if (r <= 0) return config.type;
  }
  return 'hot';
}

// 随机生成报价引用次数
function randomQuoteCount() {
  return Math.floor(Math.random() * 50) + 5; // 5-55次
}

// 为约12%的产品添加标签
const shouldAddTag = (id) => {
  const num = parseInt(id.split('-')[1]);
  return num % 8 === 0; // 约12.5%
};

// 处理每一行产品数据
const lines = content.split('\n');
const updatedLines = [];
let inProductBlock = false;
let braceCount = 0;
let currentProduct = '';
let productStartLine = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // 检测产品行开始
  if (line.includes("id: 'cer-") && line.includes("libraryId:")) {
    inProductBlock = true;
    productStartLine = i;
    currentProduct = line;
    continue;
  }

  // 在产品块内累积内容
  if (inProductBlock) {
    currentProduct += '\n' + line;
    braceCount += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;

    // 产品块结束
    if (braceCount === 0 && line.includes('}')) {
      const idMatch = currentProduct.match(/id: '([^']+)'/);
      const id = idMatch ? idMatch[1] : null;

      // 检查是否需要添加标签
      if (id && shouldAddTag(id)) {
        const tagType = randomTagType();
        const quoteCount = randomQuoteCount();
        const tagStr = `tags: [{ type: '${tagType}', quoteCount: ${quoteCount} }]`;

        // 在 supplierPrices 后添加 tags
        if (currentProduct.includes('supplierPrices:')) {
          // 在 supplierPrices 数组结束后添加
          currentProduct = currentProduct.replace(
            /(\]\s*}\s*)\s*(\)|,)/,
            `$1,\n    ${tagStr} $2`
          );
        } else {
          // 在行尾添加
          currentProduct = currentProduct.replace(
            /(\})\s*(\)|,)/,
            `,\n    ${tagStr} $2`
          );
        }
      }

      updatedLines.push(currentProduct);
      inProductBlock = false;
      currentProduct = '';
      braceCount = 0;
      productStartLine = -1;
    }
  } else {
    updatedLines.push(line);
  }
}

// 写回文件
fs.writeFileSync('./ceramic_products.ts', updatedLines.join('\n'), 'utf-8');

console.log('标签添加完成！');
