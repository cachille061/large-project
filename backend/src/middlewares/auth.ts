import * as dotenv from 'dotenv';
dotenv.config();

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { admin } from "better-auth/plugins";
import { Resend } from 'resend';

if (!process.env.BETTER_AUTH_SECRET) {
    throw new Error("BETTER_AUTH_SECRET is not defined in environment variables");
}

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
}

if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not defined in environment variables");
}

// Create MongoDB client and connect
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(); // Uses the database specified in the connection string

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@coremarket.csprojects.dev';
const APP_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const useFlutterCors = process.env.USE_FLUTTER_CORS === 'true';
let trustedOrigins;
if (useFlutterCors) {
  trustedOrigins = (request: any): string[] => {
    const origin = request.headers['origin'] as string | undefined;
    if (
      origin &&
      (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))
    ) {
      return [origin];
    }
    return [];
  };
}
else {
  trustedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    process.env.FRONTEND_URL || "",
  ].filter(Boolean);
}

export const auth = betterAuth({
    // Use MongoDB adapter with both db and client
    database: mongodbAdapter(db, { client }),

    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            console.log("=== Email Verification Callback Triggered ===");
            console.log("To:", user.email);
            console.log("FROM_EMAIL:", FROM_EMAIL);
            console.log(
                "RESEND_API_KEY prefix:",
                process.env.RESEND_API_KEY?.slice(0, 8)
            );

            try {
                const { data, error } = await resend.emails.send({
                    from: FROM_EMAIL,
                    to: user.email,
                    subject: "Verify Your Email Address",
                    html: `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .button { 
                      display: inline-block; 
                      padding: 12px 24px; 
                      background-color: #007bff; 
                      color: white !important; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      margin: 20px 0;
                  }
                  .token-box {
                      background: #f5f5f5;
                      padding: 15px;
                      border-radius: 5px;
                      font-family: monospace;
                      word-break: break-all;
                      margin: 15px 0;
                  }
                  .footer { margin-top: 30px; font-size: 12px; color: #666; }
              </style>
          </head>
          <body>
              <div class="container">
                  <h2>Welcome${user.name ? `, ${user.name}` : ""}! 🎉</h2>
                  <p>Thanks for signing up! Please verify your email address to get started.</p>
                  <a href="${url}" class="button">Verify Email Address</a>
                  <p>Or copy and paste this link into your browser:</p>
                  <p style="word-break: break-all; color: #007bff;">${url}</p>
                  <p><strong>For testing purposes, your verification token is:</strong></p>
                  <div class="token-box">${token}</div>
                  <p>This link will expire in 24 hours.</p>
                  <div class="footer">
                      <p>If you didn't create an account, you can safely ignore this email.</p>
                  </div>
              </div>
          </body>
          </html>
        `,
                });

                console.log("Resend verification response:", { data, error });

                //If Resend returned an error, log it and fail the callback
                if (error) {
                    console.error("Resend verification ERROR:", error);
                    throw error;
                }

                //make sure we got an email id back
                if (!data?.id) {
                    console.error("Resend verification: no data.id returned!");
                    throw new Error("Resend did not return an email id");
                }

                // Only log success if no error
                console.log(`Verification email sent successfully to ${user.email}`);
                console.log(`Token for testing: ${token}`);
            } catch (err) {
                console.error("Unexpected error sending verification email:", err);
                // Re-throw so Better Auth knows email sending failed
                throw err;
            }
        },
        autoSignInAfterVerification: true,
    },

    // Email and password authentication
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url, token }, request) => {
            console.log("=== Password Reset Callback Triggered ===");
            console.log("To:", user.email);
            console.log("FROM_EMAIL:", FROM_EMAIL);
            console.log(
                "RESEND_API_KEY prefix:",
                process.env.RESEND_API_KEY?.slice(0, 8)
            );

            try {
                const { data, error } = await resend.emails.send({
                    from: FROM_EMAIL,
                    to: user.email,
                    subject: "Reset Your Password",
                    html: `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .button { 
                      display: inline-block; 
                      padding: 12px 24px; 
                      background-color: #dc2626; 
                      color: white !important; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      margin: 20px 0;
                  }
                  .token-box {
                      background: #f5f5f5;
                      padding: 15px;
                      border-radius: 5px;
                      font-family: monospace;
                      word-break: break-all;
                      margin: 15px 0;
                  }
                  .footer { margin-top: 30px; font-size: 12px; color: #666; }
              </style>
          </head>
          <body>
              <div class="container">
                  <h2>Reset Your Password</h2>
                  <p>Hi${user.name ? ` ${user.name}` : ""},</p>
                  <p>We received a request to reset your password. Click the button below to create a new password:</p>
                  <a href="${url}" class="button">Reset Password</a>
                  <p>Or copy and paste this link into your browser:</p>
                  <p style="word-break: break-all; color: #007bff;">${url}</p>
                  <p><strong>For testing purposes, your reset token is:</strong></p>
                  <div class="token-box">${token}</div>
                  <p>This link will expire in 1 hour for security reasons.</p>
                  <p>If you didn't request a password reset, you can safely ignore this email.</p>
                  <div class="footer">
                      <p>This is an automated message, please do not reply.</p>
                  </div>
              </div>
          </body>
          </html>
        `,
                });

                console.log("Resend reset-password response:", { data, error });

                if (error) {
                    console.error("Resend reset-password ERROR:", error);
                    throw error;
                }

                if (!data?.id) {
                    console.error("Resend reset-password: no data.id returned!");
                    throw new Error("Resend did not return an email id");
                }

                console.log(`Password reset email sent successfully to ${user.email}`);
                console.log(`Token for testing: ${token}`);
            } catch (err) {
                console.error("Unexpected error sending reset password email:", err);
                throw err;
            }
        },
    },


    // Social providers (OAuth 2.0)
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
            enabled: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
        },
    },

    trustedOrigins: trustedOrigins,

    // Session configuration
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
    },

    // Base URL
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

    // Secret for signing tokens
    secret: process.env.BETTER_AUTH_SECRET,

    plugins: [
        admin() as any // Enable admin plugin (optional, for future admin features)
    ],

});

export { db };
