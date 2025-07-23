import { AppDataSource } from 'database/data-source';
import PendingShopEmail from '@models/pendingShopEmail.model';
import AppError from '@utils/errors';

const pendingShopEmailRepo = AppDataSource.getRepository(PendingShopEmail);

export const getPendingShopEmailByUserId = async (
  userId: string,
): Promise<string> => {
  const email = await pendingShopEmailRepo.findOne({
    where: { userProfileId: userId },
  });
  if (!email) {
    throw AppError.notFound('Pending shop email not found.');
  }
  return email.shop_email;
};

export const getPendingShopEmailByTokenAndId = async (
  token: string,
  userId: string,
): Promise<string> => {
  const email = await pendingShopEmailRepo.findOne({
    where: { verification_token: token, userProfileId: userId },
  });
  if (!email) {
    throw AppError.notFound('Pending shop email not found.');
  }
  return email.shop_email;
};

export const addPendingShopEmail = async (
  userId: string,
  shopEmail: string,
  verificationToken: string,
): Promise<void> => {
  const pendingEmail = pendingShopEmailRepo.create({
    userProfileId: userId,
    shop_email: shopEmail,
    verification_token: verificationToken,
  });
  await pendingShopEmailRepo.save(pendingEmail);
};

export const removePendingShopEmail = async (userId: string): Promise<void> => {
  await pendingShopEmailRepo.delete({ userProfileId: userId });
};
