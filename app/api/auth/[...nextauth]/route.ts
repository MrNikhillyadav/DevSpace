import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
//@ts-expect-error : description of the error here
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };