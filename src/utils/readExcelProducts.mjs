import XLSX from 'xlsx';
import fs from 'fs';

// Get the Excel file path from cmd line arguments
const excelFilepath = process.argv[2];
if (!excelFilepath) {
    console.error('Usage: readExcelProducts.js [excel filepath]');
    process.exit(1);
}

// Read the excel file
const workbook = XLSX.readFile(excelFilepath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Change headerRow if its place in the file changes
const headerRow = 3;

// Convert to JSON
const rawData = XLSX.utils.sheet_to_json(worksheet, {
    defval: '',
    blankrows: false,
    range: headerRow, // start reading data from headerRow
});

// Filter and format
const products = rawData.filter((row) => row.nimi);
const formattedProducts = products.map((row) => ({
    product_name: row.nimi,
    product_code: row['koodi '],
    product_season: row.kausi,
}));

fs.writeFileSync('./src/mocks/products.json', JSON.stringify(formattedProducts, null, 2));

console.log('Products saved to ./src/mocks/products.json');