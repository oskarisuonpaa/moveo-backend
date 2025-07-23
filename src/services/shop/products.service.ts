import { AppDataSource } from 'database/data-source';
import Product from '@models/product.model';
import AppError from '@utils/errors';

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

// adds a new product to the database
export const addProduct = (
  productName: string,
  productCode: string,
  productSeason: string,
  productNameEnglish?: string,
) => {
  const product = productRepository.create({
    product_name: productName,
    product_name_english: productNameEnglish,
    product_code: productCode,
    product_season: productSeason,
  });
  return productRepository.save(product);
};

// updates an existing product in the database
export const updateProduct = async (
  productId: number,
  productName: string,
  productCode: string,
  productSeason: string,
  productNameEnglish?: string,
) => {
  const product = {
    product_name: productName,
    product_name_english: productNameEnglish,
    product_code: productCode,
    product_season: productSeason,
  };
  const existingProduct = await productRepository.findOneBy({
    product_id: productId,
  });
  if (!existingProduct) {
    throw AppError.notFound('Product not found');
  }
  return productRepository.update(productId, product);
};

// deletes a product from the database by product ID
export const deleteProduct = async (productId: number) => {
  return productRepository.delete({ product_id: productId });
};

// get all products by season
export const getProductsBySeason = (season: string) => {
  return productRepository.find({
    where: {
      product_season: season,
    },
  });
};

// get a product's season
export const getProductSeason = (productCode: string) => {
  return productRepository.findOne({
    where: {
      product_code: productCode,
    },
    select: ['product_season'],
  });
};
