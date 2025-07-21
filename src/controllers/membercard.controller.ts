import { RequestHandler } from 'express';

// Types
interface MemberCard {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
}

// Mock data, update needed
const mockDB: Record<string, MemberCard> = {
  testi: {
    id: 'testi',
    name: 'Testikäyttäjä',
    role: 'Opiskelija',
    imageUrl: '',
  },
};

// GET /api/member/:id
export const getMemberCard: RequestHandler = (req, res) => {
  const id = req.params.id;
  const member = mockDB[id];

  if (!member) {
    res.status(404).json({ error: 'Member not found' });
    return;
  }

  res.json(member);
};

// PUT /api/member/:id/image
export const updateProfileImage: RequestHandler = (req, res) => {
  const id = req.params.id;
  const { imageUrl } = req.body as { imageUrl: unknown };

  const member = mockDB[id];

  if (!member) {
    res.status(404).json({ error: 'Member not found' });
    return;
  }

  if (typeof imageUrl !== 'string' || !imageUrl.trim()) {
    res.status(400).json({ error: 'Invalid imageUrl' });
    return;
  }

  member.imageUrl = imageUrl;
  res.json({ message: 'Image updated', member });
};
