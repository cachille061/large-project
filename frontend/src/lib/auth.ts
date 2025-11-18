import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://coremarket.csprojects.dev/api/auth",
  fetchOptions: {
    credentials: "include",
  },
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  forgetPassword,
  resetPassword,
} = authClient;
