import { Request, Response, NextFunction } from "express";
import { auth } from "./auth";

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name?: string | null | undefined;      // Allow null
                image?: string | null | undefined;     // Allow null
                emailVerified?: boolean;
            };
        }
    }
}

/**
 * Middleware that requires authentication
 * Returns 401 if user is not authenticated
 */
export const requireAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Get session from Better Auth using request headers
        const session = await auth.api.getSession({
            headers: req.headers as any,
        });

        if (!session || !session.user) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "You must be logged in to access this resource",
            });
        }

        // Attach user info to request object
        req.user = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
            emailVerified: session.user.emailVerified,
        };

        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({
            error: "Unauthorized",
            message: "Invalid or expired session",
        });
    }
};
export const requireVerifiedEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers as any,
        });

        if (!session || !session.user) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "You must be logged in to access this resource",
            });
        }

        if (!session.user.emailVerified) {
            return res.status(403).json({
                error: "Email not verified",
                message: "Please verify your email address to access this resource",
            });
        }

        req.user = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
            emailVerified: session.user.emailVerified,
        };

        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({
            error: "Unauthorized",
            message: "Invalid or expired session",
        });
    }
};
/**
 * Optional auth middleware
 * Attaches user if authenticated, but doesn't block if not
 */
export const optionalAuth = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers as any,
        });

        if (session?.user) {
            req.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                image: session.user.image,
                emailVerified: session.user.emailVerified,
            };
        }

        next();
    } catch (error) {
        // Continue without user if there's an error
        next();
    }
};