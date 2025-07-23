import { RequestHandler } from 'express';
import {
  addPurchase,
  getAllPurchases,
  getLatestPurchaseByEmail,
  getPurchasesByEmail,
} from '../services/shop/purchases.service';
import AppError from '@utils/errors';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/responses';

interface PurchaseData {
  productCode: string;
  shopEmail: string;
  firstName: string;
  lastName: string;
  studyLocation: string;
  purchaseDate: Date;
}
/**
 * Controller to handle purchase-related operations.
 * It includes methods to add a new purchase.
 */
export const addPurchaseController: RequestHandler<
  object,
  unknown,
  PurchaseData
> = asyncHandler(async (req, res) => {
  const purchaseData: PurchaseData = req.body;
  const newPurchase = await addPurchase(purchaseData);
  successResponse(res, newPurchase, 201);
});

export const getAllPurchasesController: RequestHandler = asyncHandler(
  async (req, res) => {
    const purchases = await getAllPurchases();
    successResponse(res, purchases);
  },
);

export const getPurchasesByEmailController: RequestHandler<{
  email: string;
}> = asyncHandler(async (req, res) => {
  const { email } = req.params;
  const purchases = await getPurchasesByEmail(email);
  successResponse(res, purchases);
});

export const getLatestPurchaseByEmailController: RequestHandler = asyncHandler(
  async (req, res) => {
    const { email } = req.params;
    const latestPurchase = await getLatestPurchaseByEmail(email);
    if (!latestPurchase) {
      throw AppError.notFound('No purchases found for this email.');
    }
    successResponse(res, latestPurchase);
  },
);
