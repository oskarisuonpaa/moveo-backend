type User = {
  ID: number;
  user_email: string;
  user_pass: string;
};

export const fakeUsers: User[] = [
  { ID: 1, user_email: 'test@example.com', user_pass: '' },
  { ID: 2, user_email: 'test@lab.fi', user_pass: '' },
  { ID: 3, user_email: 'registered@example.com', user_pass: '$P$mockedhash' },
  
];

export const findUserByEmail = (email: string): User | undefined =>
  fakeUsers.find((user) => user.user_email === email);

export const updateUserPassword = (email: string, newPass: string): void => {
  const user = fakeUsers.find((u) => u.user_email === email);
  if (user) {
    user.user_pass = newPass;
  }
};
