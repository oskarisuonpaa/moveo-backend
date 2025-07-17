import { AppDataSource } from 'database/data-source';
import Purchase from '@models/purchase.model';
import { DeleteResult, UpdateResult, Between } from 'typeorm';

const PurchaseRepo = AppDataSource.getRepository(Purchase);
// handles purchases table

// get all purchases based on email
export const getPurchasesByEmail = (shopEmail: string) => {
  return PurchaseRepo.find({
    where: {
      shop_email: shopEmail,
    },
  });
};

// gets the latest purchase based on email
export const getLatestPurchaseByEmail = (shopEmail: string) => {
  return PurchaseRepo.findOne({
    where: {
      shop_email: shopEmail,
    },
    order: {
      purchase_date: 'DESC',
    },
  });
};

// adds a new purchase
export const addPurchase = (purchaseData: {
  shopEmail: string;
  productCode: string;
  firstName: string;
  lastName: string;
  purchaseDate?: Date;
  studyLocation: string;
}): Promise<Purchase> => {
  const purchase = PurchaseRepo.create({
    shop_email: purchaseData.shopEmail,
    product_code: purchaseData.productCode,
    first_name: purchaseData.firstName,
    last_name: purchaseData.lastName,
    study_location: purchaseData.studyLocation,
    purchase_date: purchaseData.purchaseDate || new Date(),
  });
  return PurchaseRepo.save(purchase);
};

// gets a purchase by its ID
export const getPurchaseById = (
  purchaseId: number,
): Promise<Purchase | null> => {
  return PurchaseRepo.findOne({
    where: { purchase_id: purchaseId },
  });
};

// gets all purchases for a specific product code
export const getPurchasesByProductCode = (productCode: string) => {
  return PurchaseRepo.find({
    where: { product_code: productCode },
  });
};

// deletes a purchase by its ID, probably not needed if we want to keep a record of all purchases
export const deletePurchase = (purchaseId: number): Promise<DeleteResult> => {
  return PurchaseRepo.delete({ purchase_id: purchaseId });
};

// updates a purchase by its id, not sure this is needed if we want to keep a record of all purchases
export const updatePurchase = (
  purchaseId: number,
  shopEmail: string,
  productCode: string,
  purchaseDate: string,
): Promise<UpdateResult> => {
  return PurchaseRepo.update(
    { purchase_id: purchaseId },
    {
      shop_email: shopEmail,
      product_code: productCode,
      purchase_date: purchaseDate,
    },
  );
};

// gets a list of all purchases
// this could be used for admin purposes to see all purchases made
export const getAllPurchases = (): Promise<Purchase[]> => {
  return PurchaseRepo.find({
    order: {
      purchase_date: 'DESC',
    },
  });
};

// gets purchases made within a specific date range
// this could be used for reporting purposes
export const getPurchasesByDateRange = (
  startDate: Date,
  endDate: Date,
): Promise<Purchase[]> => {
  return PurchaseRepo.find({
    where: {
      purchase_date: Between(startDate, endDate),
    },
  });
};
