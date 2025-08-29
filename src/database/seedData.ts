import { AppDataSource } from './data-source';
import Product from '../models/product.model';
import products from './products.json';
import { mockPurchase } from 'mocks/mockPurchase';
import Purchase from '../models/purchase.model';

// uses mockdata, update for production
export async function seedProducts() {
  const productRepo = AppDataSource.getRepository(Product);
  const count = await productRepo.count();
  if (count === 0) {
    await productRepo.save(products);
    console.log('Mock products inserted!');
  }
}

export async function seedPurchase() {
  const purchaseRepo = AppDataSource.getRepository(Purchase);
  const count = await purchaseRepo.count();
  if (count === 0) {
    await purchaseRepo.save(mockPurchase);
    console.log('Mock purchase inserted!');
  }
}
