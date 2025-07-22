import { AppDataSource } from 'database/data-source';
import PendingShopEmail from '@models/pendingShopEmail.model';

const pendingShopEmailRepo = AppDataSource.getRepository(PendingShopEmail);
export const getPendingShopEmailByUserId = (
  userId: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    pendingShopEmailRepo
      .findOne({ where: { userProfileId: userId } })
      .then((email) => {
        if (!email) {
          return reject(new Error('Pending shop email not found.'));
        }
        resolve(email.shop_email);
      })
      .catch((err) => {
        console.error('Error fetching pending shop email:', err);
        reject(new Error('Error fetching pending shop email.'));
      });
  });
};

export const getPendingShopEmailByTokenAndId = (
  token: string,
  userId: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    pendingShopEmailRepo
      .findOne({ where: { verification_token: token, userProfileId: userId } })
      .then((email) => {
        if (!email) {
          return reject(new Error('Pending shop email not found.'));
        }
        resolve(email.shop_email);
      })
      .catch((err) => {
        console.error('Error fetching pending shop email:', err);
        reject(new Error('Error fetching pending shop email.'));
      });
  });
};

export const addPendingShopEmail = (
  userId: string,
  shopEmail: string,
  verificationToken: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const pendingEmail = pendingShopEmailRepo.create({
      userProfileId: userId,
      shop_email: shopEmail,
      verification_token: verificationToken,
    });
    pendingShopEmailRepo
      .save(pendingEmail)
      .then(() => resolve())
      .catch((err) => {
        console.error('Error adding pending shop email:', err);
        reject(new Error('Error adding pending shop email.'));
      });
  });
};

export const removePendingShopEmail = (userId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    pendingShopEmailRepo
      .delete({ userProfileId: userId })
      .then(() => resolve())
      .catch((err) => {
        console.error('Error removing pending shop email:', err);
        reject(new Error('Error removing pending shop email.'));
      });
  });
};
