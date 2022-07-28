import NextAuth from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';

export default NextAuth({
    debug: true,
    providers: [
        Auth0Provider({
            clientId: process.env.AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH0_CLIENT_SECRET,
            issuer: process.env.AUTH0_ISSUER_BASE_URL
        })
    ],
    callbacks: {
        async jwt({ token, account, user, profile }) {
            if(account) {
                token.accessToken = account.access_token;
                token.role = profile['https://role_access.com/please'];
            }
        return token;
        },
        async session({ session, token, user }){
            session.accessToken = token.accessToken;
            session.user.role = token.role;
            session.user.email = token.email;
            return session;
        }
    }
});