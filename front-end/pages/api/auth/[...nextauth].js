import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

export default NextAuth({
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_ISSUER_BASE_URL,
      // authorization: { url: "https://dev-5g0j9i2z.us.auth0.com/authorize?response_type=code&client_id=nzBoJ6TTyV9QXdOjci1zfIZw34hmut7l&redirect_uri=http://localhost:3000/api/auth/callback/auth0&scope=openid&state=xyzABC123"}
      authorization: {
        url: "https://dev-5g0j9i2z.us.auth0.com/authorize",
        params: {
          response_type: "code",
          response_mode: "query",
          client_id: "nzBoJ6TTyV9QXdOjci1zfIZw34hmut7l",
          // redirect_uri: "http://localhost:3000/api/auth/callback/auth0",
          redirect_uri : "https://housing-passport-app.vercel.app/api/auth/callback/auth0",
          // scope : "openid",
          audience:"https://housing-passport-backend.com",
          state: "xyzABC123",
        },
        // authorization: { url: "https://dev-5g0j9i2z.us.auth0.com/authorize",
        //                 params : { response_type: "code",
        //                         response_mode: "query",
        //                         client_id : "nzBoJ6TTyV9QXdOjci1zfIZw34hmut7l",
        //                         redirect_uri : "http://localhost:3000/api/auth/callback/auth0",
        //                         audience : "https://housing-passport-backend.com",
        //                         // scope : "openid",
        //                         state : "xyzABC123" }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.role = profile["https://role_access.com/control"];
      }
      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      session.user.role = token.role;
      session.user.email = token.email;
      return session;
    },
  },
});
