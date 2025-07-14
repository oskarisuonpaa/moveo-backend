import { RequestHandler } from 'express';

// Setting options
type UserSettings = {
  language: 'fi' | 'en';
  theme: 'light' | 'dark';
};

// Mock for test users, can be changed to database later
const mockStorage: Record<string, UserSettings> = {
  testi: { language: 'fi', theme: 'light' },
};

// GET: shows current settings
export const getUserSettings: RequestHandler = (req, res) => {
  const userId = typeof req.params.userId === 'string' ? req.params.userId : '';
  const settings = mockStorage[userId];

  if (!settings) {
    res.status(404).json({ message: 'Asetuksia ei löytynyt käyttäjälle' });
    return;
  }

  res.json(settings);
};

// PUT: updates settings
export const updateUserSettings: RequestHandler = (req, res) => {
  const userId = typeof req.params.userId === 'string' ? req.params.userId : '';
  const body = req.body as Partial<UserSettings>;

  const language =
    typeof body.language === 'string' ? body.language : undefined;
  const theme = typeof body.theme === 'string' ? body.theme : undefined;

  if (language && !['fi', 'en'].includes(language)) {
    res.status(400).json({ error: 'Virheellinen kieli' });
    return;
  }

  if (theme && !['light', 'dark'].includes(theme)) {
    res.status(400).json({ error: 'Virheellinen teema' });
    return;
  }

  const current = mockStorage[userId] || { language: 'fi', theme: 'light' };

  const updatedSettings: UserSettings = {
    language: language ?? current.language,
    theme: theme ?? current.theme,
  };

  mockStorage[userId] = updatedSettings;

  res.json({ message: 'Asetukset päivitetty', settings: updatedSettings });
};
