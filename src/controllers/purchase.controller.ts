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
  purchaseNumber: string;
  purchaseDate: Date;
}
/**
 * Controller to handle purchase-related operations.
 * It includes methods to add a new purchase, get all purchases, and get purchases by email.
 */

/**
 * Adds a new purchase to the database.
 * @param req - The request object containing purchase data.
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

/**
 * Gets all purchases from the database.
 * @returns All purchases in the database
 */
export const getAllPurchasesController: RequestHandler = asyncHandler(
  async (req, res) => {
    const purchases = await getAllPurchases();
    successResponse(res, purchases);
  },
);

/**
 * Gets purchases by email.
 * @param req - The request object containing the email in the URL parameters.
 * @returns Purchases associated with the provided email.
 */
export const getPurchasesByEmailController: RequestHandler<{
  email: string;
}> = asyncHandler(async (req, res) => {
  const { email } = req.params;
  const purchases = await getPurchasesByEmail(email);
  successResponse(res, purchases);
});

/**
 * Gets the latest purchase by email.
 * @param req - The request object containing the email in the URL parameters.
 * @returns The latest purchase associated with the provided email.
 */
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
