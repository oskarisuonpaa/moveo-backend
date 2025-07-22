import { RequestHandler } from 'express';
import {
  addPurchase,
  getAllPurchases,
  getLatestPurchaseByEmail,
  getPurchasesByEmail,
} from '../services/shop/purchases.service';

interface PurchaseData {
  productCode: string;
  shopEmail: string;
  firstName: string;
  lastName: string;
  studyLocation: string;
  purchaseDate: Date;
  productStartDate: Date;
  productEndDate: Date;
}
/**
 * Controller to handle purchase-related operations.
 * It includes methods to add a new purchase.
 */
export const addPurchaseController: RequestHandler<
  object,
  unknown,
  PurchaseData
> = async (req, res) => {
  try {
    const purchaseData: PurchaseData = req.body;
    const newPurchase = await addPurchase(purchaseData);
    res.status(201).json(newPurchase);
  } catch (error) {
    console.error('Error adding purchase:', error);
    res.status(500).send((error as Error).message || 'Error adding purchase.');
  }
};

export const getAllPurchasesController: RequestHandler = async (req, res) => {
  try {
    const purchases = await getAllPurchases();
    res.status(200).json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res
      .status(500)
      .send((error as Error).message || 'Error fetching purchases.');
  }
};

export const getPurchasesByEmailController: RequestHandler<{
  email: string;
}> = async (req, res) => {
  const { email } = req.params;
  try {
    const purchases = await getPurchasesByEmail(email);
    res.status(200).json(purchases);
  } catch (error) {
    console.error('Error fetching purchases by email:', error);
    res
      .status(500)
      .send((error as Error).message || 'Error fetching purchases by email.');
  }
};

export const getLatestPurchaseByEmailController: RequestHandler = async (
  req,
  res,
) => {
  const { email } = req.params;
  try {
    const latestPurchase = await getLatestPurchaseByEmail(email);
    if (!latestPurchase) {
      res.status(404).send('No purchases found for this email.');
      return;
    }
    res.status(200).json(latestPurchase);
  } catch (error) {
    console.error('Error fetching latest purchase by email:', error);
    res
      .status(500)
      .send(
        (error as Error).message || 'Error fetching latest purchase by email.',
      );
  }
};
