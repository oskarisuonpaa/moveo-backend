import { AppDataSource } from 'database/data-source';
import Product from '@models/product.model';
import { LessThan, MoreThan } from 'typeorm';

const productRepository = AppDataSource.getRepository(Product);

// service for products table

// get all products
export const getProducts = () => {
  return productRepository.find();
};

// get product by product code
// product code (should be) unique, so it returns only one product
export const getProductByCode = (productCode: string) => {
  return productRepository.findOne({
    where: {
      product_code: productCode,
    },
  });
};

// gets all products that match the end date
export const getProductsByEndDate = (endDate: Date) => {
  return productRepository.find({
    where: {
      product_end: endDate,
    },
  });
};

// gets all products that are older than the given date, by end date
export const getProductsOlderThanDate = (date: Date) => {
  return productRepository.find({
    where: {
      product_end: LessThan(date),
    },
  });
};

// gets all products that are newer than the given date, by end date
export const getProductsNewerThanDate = (date: Date) => {
  return productRepository.find({
    where: {
      product_end: MoreThan(date),
    },
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
  const product = productRepository.create({
    product_name: productName,
    product_name_english: productNameEnglish,
    product_code: productCode,
    product_start: productStart,
    product_end: productEnd,
  });
  return productRepository.save(product);
};

// updates an existing product in the database
export const updateProduct = async (
  productId: number,
  productName: string,
  productNameEnglish: string,
  productCode: string,
  productStart: Date,
  productEnd: Date,
) => {
  const product = {
    product_name: productName,
    product_name_english: productNameEnglish,
    product_code: productCode,
    product_start: productStart,
    product_end: productEnd,
  };
  const existingProduct = await productRepository.findOneBy({
    product_id: productId,
  });
  if (!existingProduct) {
    throw new Error('Product not found');
  }
  return productRepository.update(productId, product);
};

// deletes a product from the database by product ID
export const deleteProduct = async (productId: number) => {
  return productRepository.delete({ product_id: productId });
};
