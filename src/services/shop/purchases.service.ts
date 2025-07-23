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

// service for purchases table
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
  // need to compare dateNow to endDate since someone could buy membership mid-season
  startDate.setFullYear(
    dateNow < endDate ? dateNow.getFullYear() : dateNow.getFullYear() + 1,
  );

  endDate.setDate(parseInt(seasonDates.end.split('/')[0]));
  endDate.setMonth(parseInt(seasonDates.end.split('/')[1]) - 1);
  endDate.setFullYear(
    dateNow < endDate ? dateNow.getFullYear() : dateNow.getFullYear() + 1,
  );

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
  productEndDate: string,
  productStartDate: string,
): Promise<UpdateResult> => {
  return PurchaseRepo.update(
    { purchase_id: purchaseId },
    {
      shop_email: shopEmail,
      product_code: productCode,
      purchase_date: purchaseDate,
      product_end_date: productEndDate,
      product_start_date: productStartDate,
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
