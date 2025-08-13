import logger from '../../utils/logger';

export function extractOrderData(text: string) {
  const firstName = text.match(/Etunimi:\s*(.+)/i)?.[1]?.trim();
  const lastName = text.match(/Sukunimi:\s*(.+)/i)?.[1]?.trim();
  const shopEmail = text.match(/Sähköposti:\s*(\S+)/)?.[1];
  const productCode = text.match(/SKU:\s*(.+)/i)?.[1]?.trim();
  const purchaseNumber = text.match(/Tilausnumero:\s*(\S+)/)?.[1];
  const purchaseDateRaw = text.match(
    /(?:Ostopäivä:\s*(\d{1,2}\.\d{1,2}\.\d{4}))/i,
  )?.[1];
  const studyLocation = text.match(/(?:Opintopaikka:\s*(.+))/i)?.[1]?.trim();

  const purchaseDate = purchaseDateRaw
    ? new Date(purchaseDateRaw.replace(/\./g, '/'))
    : null;

  if (
    firstName &&
    lastName &&
    shopEmail &&
    productCode &&
    purchaseNumber &&
    purchaseDate &&
    studyLocation
  ) {
    return {
      firstName,
      lastName,
      shopEmail,
      productCode,
      purchaseNumber,
      purchaseDate,
      studyLocation,
    };
  }
  logger.warn('extractOrderData: Missing one or more required fields.');
  return null;
}
