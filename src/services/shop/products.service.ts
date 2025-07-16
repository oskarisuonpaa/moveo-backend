import db from '../../db';
import type { Product } from '../../types/product';

// service for products table

// get all products
export const getProducts = () => {
  return new Promise<Product[]>((resolve, reject) => {
    db.all('SELECT * FROM products', (err, rows: Product[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// get product by product code
// product code (should be) unique, so it returns only one product
export const getProductByCode = (productCode: string) => {
  return new Promise<Product | undefined>((resolve, reject) => {
    db.get(
      'SELECT * FROM products WHERE product_code = ?',
      [productCode],
      (err, row: Product | undefined) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      },
    );
  });
};

// gets all products that match the end date
export const getProductsByEndDate = (endDate: string) => {
  return new Promise<Product[]>((resolve, reject) => {
    db.all(
      'SELECT * FROM products WHERE product_end = ?',
      [endDate],
      (err, rows: Product[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      },
    );
  });
};

// gets all products that are older than the given date, by end date
export const getProductsOlderThanDate = (date: string) => {
  return new Promise<Product[]>((resolve, reject) => {
    db.all(
      'SELECT * FROM products WHERE product_end < ?',
      [date],
      (err, rows: Product[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      },
    );
  });
};

// gets all products that are newer than the given date, by end date
export const getProductsNewerThanDate = (date: string) => {
  return new Promise<Product[]>((resolve, reject) => {
    db.all(
      'SELECT * FROM products WHERE product_end > ?',
      [date],
      (err, rows: Product[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      },
    );
  });
};

// adds a new product to the database
export const addProduct = (
  productName: string,
  productNameEnglish: string,
  productCode: string,
  productStart: string,
  productEnd: string,
) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO products (product_name, product_name_english, product_code, product_start, product_end) VALUES (?, ?, ?, ?, ?)',
      [productName, productNameEnglish, productCode, productStart, productEnd],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      },
    );
  });
};

// updates an existing product in the database
export const updateProduct = (
  productId: number,
  productName: string,
  productNameEnglish: string,
  productCode: string,
  productStart: string,
  productEnd: string,
) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE products SET product_name = ?, product_name_english = ?, product_code = ?, product_start = ?, product_end = ? WHERE product_id = ?',
      [
        productName,
        productNameEnglish,
        productCode,
        productStart,
        productEnd,
        productId,
      ],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      },
    );
  });
};

// deletes a product from the database by product ID
export const deleteProduct = (productId: number) => {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM products WHERE product_id = ?',
      [productId],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      },
    );
  });
};
