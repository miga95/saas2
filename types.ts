import { Session } from 'next-auth';

interface CustomUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface CustomSession extends Session {
  user: CustomUser;
}