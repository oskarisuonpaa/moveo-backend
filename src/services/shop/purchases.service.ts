import { AppDataSource } from 'database/data-source';
import Purchase from '@models/purchase.model';
import { DeleteResult, UpdateResult, Between } from 'typeorm';
import { getProductSeason } from './products.service';
import formatDate from '@utils/formatDate';
import AppError from '@utils/errors';

const PurchaseRepo = AppDataSource.getRepository(Purchase);

// Convert product seasons to dates
const productDates = [
  { season: 'kevät', start: '1/1', end: '31/5' },
  { season: 'kesä', start: '1/6', end: '31/8' },
  { season: 'syksy', start: '1/9', end: '31/12' },
];

/**
 * Get all purchases based on shop email
 * @param shopEmail 
 * @returns all purchases made using the specified email
 * @module purchases.service
 */
export const getPurchasesByEmail = (shopEmail: string) => {
  return PurchaseRepo.find({
    where: {
      shop_email: shopEmail,
    },
  });
};

/**
 * Get all purchases based on user ID
 * @param userId 
 * @returns all purchases made by the specified user
 * @module purchases.service
 */
export const getPurchasesByUserId = (userId: string) => {
  return PurchaseRepo.find({
    where: {
      userProfileId: userId,
    },
  });
};

/**
 * Get the latest purchase based on shop email
 * @param shopEmail 
 * @returns the latest purchase made using the specified email
 * @module purchases.service
 */
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

/**
 * Adds a new purchase to the database.
 * @param purchaseData - The purchase data to add.
 * @returns The added purchase.
 * @module purchases.service
 */
export const addPurchase = async (purchaseData: {
  shopEmail: string;
  productCode: string;
  firstName: string;
  lastName: string;
  purchaseDate?: Date;
  studyLocation: string;
}): Promise<Purchase> => {
  // Need to convert product season into membership start and end dates
  const productSeason = await getProductSeason(purchaseData.productCode);
  if (!productSeason) {
    throw AppError.notFound('Product not found');
  }
  const seasonDates = productDates.find(
    (season) => season.season === productSeason.product_season,
  );
  if (!seasonDates) {
    throw AppError.notFound('Product season not found');
  }
  // Dates are set DD/MM in the seasonDates object, set day and month based on that
  // year is current year, or next year if we've already passed end date
  const dateNow = new Date();
  const startDate = new Date();
  const endDate = new Date();
  startDate.setDate(parseInt(seasonDates.start.split('/')[0]));
  startDate.setMonth(parseInt(seasonDates.start.split('/')[1]) - 1);
  endDate.setDate(parseInt(seasonDates.end.split('/')[0]));
  endDate.setMonth(parseInt(seasonDates.end.split('/')[1]) - 1);
  // need to compare dateNow to endDate since someone could buy membership mid-season
  startDate.setFullYear(dateNow.getFullYear());
endDate.setFullYear(dateNow.getFullYear());

// If today is after the end date, move both to next year
if (dateNow > endDate) {
  startDate.setFullYear(dateNow.getFullYear() + 1);
  endDate.setFullYear(dateNow.getFullYear() + 1);
}

  // create and save new purchase
  const purchase = PurchaseRepo.create({
    shop_email: purchaseData.shopEmail,
    product_code: purchaseData.productCode,
    first_name: purchaseData.firstName,
    last_name: purchaseData.lastName,
    study_location: purchaseData.studyLocation,
    purchase_date: purchaseData.purchaseDate || new Date(),
    product_end_date: new Date(formatDate(endDate)),
    product_start_date: new Date(formatDate(startDate)),
  });
  return PurchaseRepo.save(purchase);
};

/**
 * Get a purchase by its ID
 * @param purchaseId - The ID of the purchase to retrieve
 * @returns The purchase with the specified ID, or null if not found
 * @module purchases.service
 */
export const getPurchaseById = (
  purchaseId: number,
): Promise<Purchase | null> => {
  return PurchaseRepo.findOne({
    where: { purchase_id: purchaseId },
  });
};

/**
 * Get purchases by product code
 * @param productCode - The code of the product to filter purchases by
 * @returns All purchases made for the specified product code
 * @module purchases.service
 */
export const getPurchasesByProductCode = (productCode: string) => {
  return PurchaseRepo.find({
    where: { product_code: productCode },
  });
};

/**
 * Deletes a purchase by its ID
 * @param purchaseId - The ID of the purchase to delete
 * @returns The result of the delete operation
 */
export const deletePurchase = (purchaseId: number): Promise<DeleteResult> => {
  return PurchaseRepo.delete({ purchase_id: purchaseId });
};

// updates a purchase by its id, not sure this is needed if we want to keep a record of all purchases
export const updatePurchase = (
  purchaseId: number,
  shopEmail: string,
  productCode: string,
  purchaseDate: string,
  productEndDate: string,
  productStartDate: string,
  userId?: string,
): Promise<UpdateResult> => {
  return PurchaseRepo.update(
    { purchase_id: purchaseId },
    {
      shop_email: shopEmail,
      product_code: productCode,
      purchase_date: purchaseDate,
      product_end_date: productEndDate,
      product_start_date: productStartDate,
      userProfileId: userId,
    },
  );
};

/**
 * Adds a user ID to a purchase
 * @param purchaseId - The ID of the purchase to update
 * @param userId - The ID of the user to associate with the purchase
 * @returns The result of the update operation
 * @module purchases.service
 */
export const addPurchaseUserId = async (
  purchaseId: number,
  userId: string,
): Promise<UpdateResult> => {
  return PurchaseRepo.update(
    { purchase_id: purchaseId },
    { userProfileId: userId },
  );
};

/**
 * Get all purchases
 * @returns All purchases in the database
 * @module purchases.service
 */
export const getAllPurchases = (): Promise<Purchase[]> => {
  return PurchaseRepo.find({
    order: {
      purchase_date: 'DESC',
    },
  });
};

/**
 * Get purchases by date range
 * @param startDate - The start date of the range
 * @param endDate - The end date of the range
 * @returns All purchases made within the specified date range
 * @module purchases.service
 */
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
