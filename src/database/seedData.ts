import { AppDataSource } from './data-source';
import Product from '../models/product.model';
import fs from 'fs';

const productsPath = '../mocks/products.json';

// uses mockdata, update for production
export async function seedProducts() {
  const productRepo = AppDataSource.getRepository(Product);
  const count = await productRepo.count();
  if (count === 0) {
    const mockProducts = JSON.parse(fs.readFileSync(productsPath, 'utf-8'))
    await productRepo.save(mockProducts);
    console.log('Mock products inserted!');
  }
}
