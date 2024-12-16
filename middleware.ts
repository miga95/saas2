// import { getToken } from 'next-auth/jwt';
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// const publicPaths = ['/auth/signin', '/auth/signup'];

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
  
//   // Check if the path is public
//   if (publicPaths.includes(pathname)) {
//     return NextResponse.next();
//   }

//   try {
//     const token = await getToken({ 
//       req: request,
//       secret: process.env.NEXTAUTH_SECRET
//     });

//     const isAuthPage = pathname.startsWith('/auth');

//     // Redirect to login if accessing protected route without token
//     if (!token && !isAuthPage) {
//       const url = new URL('/auth/signin', request.url);
//       url.searchParams.set('callbackUrl', encodeURI(pathname));
//       return NextResponse.redirect(url);
//     }

//     // Redirect to home if accessing auth page with token
//     if (token && isAuthPage) {
//       return NextResponse.redirect(new URL('/', request.url));
//     }

//     return NextResponse.next();
//   } catch (error) {
//     console.error('Middleware error:', error);
//     return NextResponse.redirect(new URL('/auth/signin', request.url));
//   }
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api/auth (auth API routes)
//      * - api/stripe/webhook (Stripe webhook)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - public files (public/*)
//      */
//     '/((?!api/auth|api/stripe/webhook|_next/static|_next/image|favicon.ico|.*\\..*|$).*)',
//   ],
// }; 