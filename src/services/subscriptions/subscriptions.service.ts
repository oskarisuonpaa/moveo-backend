import Subscription from '@models/subscription.model';
import { AppDataSource } from 'database/data-source';

const SubscriptionRepo = AppDataSource.getRepository(Subscription);

export const createSubscription = async (
  subscriptionData: Partial<Subscription>,
) => {
  const newSubscription = SubscriptionRepo.create(subscriptionData);
  return SubscriptionRepo.save(newSubscription);
};

export const getAllSubscriptions = (): Promise<Subscription[]> => {
  return SubscriptionRepo.find();
};

export const deleteSubscription = (id: string): Promise<void> => {
  return SubscriptionRepo.delete(id).then(() => {});
};

export const getSubscriptionByEndpoint = (
  endpoint: string,
): Promise<Subscription | null> => {
  return SubscriptionRepo.findOne({ where: { endpoint } });
};

export const deleteSubscriptionByEndpoint = (
  endpoint: string,
): Promise<void> => {
  return SubscriptionRepo.delete({ endpoint }).then(() => {});
};

export const updateSubscription = async (
  id: number,
  updateData: Partial<Subscription>,
): Promise<Subscription | null> => {
  const subscription = await SubscriptionRepo.findOne({ where: { id } });
  if (!subscription) {
    return null;
  }
  Object.assign(subscription, updateData);
  return SubscriptionRepo.save(subscription);
};
