const xl = require('xlsx');
const wb = xl.readFile('C:/Users/Administrator/Desktop/陶瓷-产品线汇总（无彩图） - 副本.xlsx');
const ws = wb.Sheets['Sheet1'];
const data = xl.utils.sheet_to_json(ws, {header:1, defval:''});
const rows = data.slice(2);

const cats = [...new Set(rows.map(r => r[0]).filter(v => v))];
const sups = [...new Set(rows.map(r => r[1]).filter(v => v))];
console.log('Categories (' + cats.length + '):', cats.join(', '));
console.log('Suppliers (' + sups.length + '):', sups.join(', '));
console.log('Total products:', rows.length);

const catCount = {};
rows.forEach(r => {
  if(r[0]) {
    catCount[r[0]] = (catCount[r[0]] || 0) + 1;
  }
});
console.log('Per category:', JSON.stringify(catCount));

// Show sample data with all fields
console.log('\nFirst 3 rows (all cols):');
rows.slice(0, 3).forEach((r, i) => {
  console.log('Row', i+1, JSON.stringify(r));
});
