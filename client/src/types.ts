export type UserType = {
  name: string;
  email: string;
  password: string;
  id: string;
};

export type ApiKeyType = {
  name: string;
  key: string;
  userId: string;
  id: string | undefined;
  lastUsed: Date | null | undefined;
  expiresAt: Date | null | undefined;
  isActive: boolean | undefined;
  usageCount: number | undefined;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
};
