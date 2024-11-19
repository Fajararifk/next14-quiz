import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  // Define routes that do not require authentication
  //publicRoutes: ["/sign-in", "/sign-up"],

  // Custom behavior after authentication
  afterAuth(auth, req) {
    // If no user is authenticated
    console.log(auth)
    console.log('======')

    console.log(req)

    // if (!auth.userId) {
    //   // Check if the user is on a public route
    //   const url = new URL(req.url);
    //   const isPublicRoute = ["/sign-in", "/sign-up"].includes(url.pathname);

    //   // Redirect to the sign-in page if not on a public route
    //   if (!isPublicRoute) {
    //     return new Response(null, {
    //       status: 302,
    //       headers: { Location: `/sign-in?redirect_url=${encodeURIComponent(req.url)}` },
    //     });
    //   }
    // }

    // Optionally, you can handle post-login redirects here
    console.log("User authenticated:", auth.userId);
  },
});

export const config = {
  matcher: [
    // Match all pages except static files and internal routes
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
