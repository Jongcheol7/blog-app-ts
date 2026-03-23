export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/write", "/edit/:path*", "/admin/:path*"],
};
