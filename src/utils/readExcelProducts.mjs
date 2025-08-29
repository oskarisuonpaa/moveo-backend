import * as XLSX from 'xlsx';
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


XLSX.set_fs(fs);

// Get the Excel file path from cmd line arguments
const excelFilepath = process.argv[2];
if (!excelFilepath) {
    console.error('Usage: node src/utils/readExcelProducts.js "excel filepath"');
    process.exit(1);
}

// need to use absolute paths to avoid problems with relative paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, '../database/products.json');

// does the excel file exist?
if (!fs.existsSync(excelFilepath)) {
    console.error('File does not exist:', excelFilepath);
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

// make the folder if it does not exist
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

// write to the target file
fs.writeFileSync(outputPath, JSON.stringify(formattedProducts, null, 2));

console.log('Products saved to', outputPath);