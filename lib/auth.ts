import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './next-auth';
import prisma from './prisma';
import { CustomSession } from '../types';

export const getAuthSession = async (): Promise<CustomSession | null> => {
  const session = await getServerSession(authOptions);
  if(session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if(user) {
      return {
        ...session,
        user: {
          ...session?.user,
          id: user.id
        }
      };
    }
  }
  
  return session as CustomSession;
};

export { authOptions };
