import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../app/api/auth/[...nextauth]/route';
import prisma from './prisma';
import { CustomSession } from '../types'

type ParametersGetServerSession =
  | []
  | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
  | [NextApiRequest, NextApiResponse];

export const getAuthSession = async (...parameters: ParametersGetServerSession): Promise<CustomSession | null> => {
  const session = await getServerSession(...parameters, authOptions);
  if(session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    })

    if(user) {
      return {
        ...session,
        user: {
          ...session?.user,
          id: user.id
        }
      }
    }
  }
  
  return session as CustomSession;
};

export { authOptions };
