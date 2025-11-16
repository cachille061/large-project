import React, { createContext, useContext } from "react";
import { useSession, signIn, signUp, signOut } from "../lib/auth";

interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfilePicture: (imageUrl: string) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();

  const user: User | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        profilePicture: session.user.image,
      }
    : null;

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await signIn.email(
        {
          email,
          password,
        },
        {
          onRequest: () => {
            console.log("Login request started");
          },
          onSuccess: () => {
            console.log("Login successful");
          },
          onError: (ctx) => {
            console.error("Login error context:", ctx.error);
          },
        }
      );
      
      // Check if there was an error
      if (error) {
        throw new Error(error.message || "Invalid email or password");
      }
      
      // Wait a moment for the session to be established
      await new Promise(resolve => setTimeout(resolve, 100));
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      // Re-throw with user-friendly message
      throw new Error(error?.message || "Invalid email or password");
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    try {
      const { data, error } = await signUp.email(
        {
          email,
          password,
          name,
        },
        {
          onRequest: () => {
            console.log("Signup request started");
          },
          onSuccess: () => {
            console.log("Signup successful");
          },
          onError: (ctx) => {
            console.error("Signup error context:", ctx.error);
          },
        }
      );
      
      // Check if there was an error
      if (error) {
        throw new Error(error.message || "Failed to create account");
      }
      
      // Wait a moment for the session to be established
      await new Promise(resolve => setTimeout(resolve, 100));
      return true;
    } catch (error: any) {
      console.error("Signup error:", error);
      // Re-throw with user-friendly message
      throw new Error(error?.message || "Failed to create account");
    }
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      // Better Auth password reset would be implemented here
      // For now, return true to maintain compatibility
      console.log("Password reset requested for:", email);
      return true;
    } catch (error) {
      console.error("Reset password error:", error);
      return false;
    }
  };

  const updateProfilePicture = async (imageUrl: string) => {
    try {
      // Update profile picture via Better Auth API
      const response = await fetch('http://localhost:3000/api/auth/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          image: imageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Update failed:', errorData);
        throw new Error(errorData.error || 'Failed to update profile picture');
      }

      // Force session refresh by reloading
      window.location.reload();
    } catch (error) {
      console.error("Update profile picture error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        resetPassword,
        updateProfilePicture,
        isAuthenticated: !!user,
        isLoading: isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
