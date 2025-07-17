import { AppDataSource } from './data-source';
import Product from '../models/product.model';
import { mockProducts } from '../mocks/mockProducts';

// uses mockdata, update for production
export async function seedProducts() {
  const productRepo = AppDataSource.getRepository(Product);
  const count = await productRepo.count();
  if (count === 0) {
    await productRepo.save(mockProducts);
    console.log('Mock products inserted!');
  }
}
