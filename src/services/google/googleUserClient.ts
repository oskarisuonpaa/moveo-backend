/*import { google } from 'googleapis';
import config from '@config';

const getUserCalendarClient = () => {
  const { refreshToken, accessToken, expiryDate } = await getUserTokens();
  const oauth2Client = new google.auth.OAuth2(
    config.google.clientId,
    config.google.clientSecret,
    config.google.redirectUri,
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
    access_token: accessToken,
    expiry_date: expiryDate,
  });

  return google.calendar({
    version: 'v3',
    auth: oauth2Client,
  });
};

export default getUserCalendarClient;
*/
