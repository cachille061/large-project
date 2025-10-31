import { Router } from "express";
import { auth } from "../middlewares/auth";

const router = Router();

// Better Auth Endpoints
// POST   /sign-up/email          - Register with email/password
// POST   /sign-in/email          - Login with email/password
// POST   /sign-out               - Logout
// GET    /session                - Get current user session
// GET    /google                 - Initiate Google OAuth
// GET    /google/callback        - Google OAuth callback
// GET    /github                 - Initiate GitHub OAuth
// GET    /github/callback        - GitHub OAuth callback

router.use("/", auth.handler);

export default router;