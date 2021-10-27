import { compare } from 'bcryptjs';
import NextAuth from 'next-auth';
import providers from 'next-auth/providers';
import { getSigninClientByEmail, logClient } from '../../../data/access/clients';
import { getSigninUserByEmail, logUser } from '../../../data/access/user';

export default NextAuth({
  jwt: {
    secret: process.env.JWT_SECRET,
    signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
  },
  session: {
    jwt: true,
  },
  providers: [
    providers.Credentials({
      async authorize(credentials) {
        const log = await JSON.parse(credentials.log);
        let logged = false;
        
        let user = await getSigninClientByEmail(credentials.email);

        if (!user) {
          user = await getSigninUserByEmail(credentials.email);
          if (!user) {
            throw new Error('Not found');
          }
          logged = await logUser(user._id, log);
        } else {
          logged = await logClient(user._id, log);
        }

        if (!logged) {
          throw new Error('Not found');
        }

        const isValid = await compare(credentials.password, user.hashPassword);

        if (!isValid) {
          throw new Error('Incorrect Password');
        }

        return {
          name: user.name || 'Laruci',
          email: user.email,
        };
      },
    }),
  ],
});
