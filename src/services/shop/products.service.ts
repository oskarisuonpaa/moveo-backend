import { AppDataSource } from 'database/data-source';
import Product from '../../models/product.model';
import AppError from '../../utils/errors';

const productRepository = AppDataSource.getRepository(Product);

// service for products table

/**
 * Gets all products from the database.
 * @returns An array of all products.
 * @module products.service
 */
export const getProducts = () => {
  return productRepository.find();
};

/**
 * Gets a product by its code.
 * @param productCode - The product code to search for.
 * @returns The product associated with the product code, or null if not found.
 */
export const getProductByCode = (productCode: string) => {
  return productRepository.findOne({
    where: {
      product_code: productCode,
    },
  });
};

/**
 * Adds a new product to the database.
 * @param productName - The name of the product.
 * @param productCode - The code of the product.
 * @param productSeason - The season of the product.
 * @param productNameEnglish - The English name of the product (optional).
 * @returns The created product.
 * @module products.service
 */
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

/**
 * Updates an existing product in the database.
 * @param productId - The ID of the product to update.
 * @param productName - The new name of the product.
 * @param productCode - The new code of the product.
 * @param productSeason - The new season of the product.
 * @param productNameEnglish - The new English name of the product (optional).
 * @returns The updated product.
 * @module products.service
 */
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

/**
 * Deletes a product from the database.
 * @param productId - The ID of the product to delete.
 * @returns The result of the delete operation.
 * @module products.service
 */
export const deleteProduct = async (productId: number) => {
  return productRepository.delete({ product_id: productId });
};

/**
 * Gets all products for a specific season.
 * @param season - The season to filter products by.
 * @returns An array of products that match the specified season.
 * @module products.service
 */
export const getProductsBySeason = (season: string) => {
  return productRepository.find({
    where: {
      product_season: season,
    },
  });
};

/**
 * Gets the season of a product by its code.
 * @param productCode - The code of the product to find.
 * @returns The season of the product, or null if not found.
 * @module products.service
 */
export const getProductSeason = (productCode: string) => {
  return productRepository.findOne({
    where: {
      product_code: productCode,
    },
    select: ['product_season'],
  });
};
