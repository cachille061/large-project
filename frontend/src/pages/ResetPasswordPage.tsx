import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authClient } from "../lib/auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Cpu, ArrowLeft } from "lucide-react";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  
  // Request reset state
  const [email, setEmail] = useState("");
  
  // Reset with token state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Common state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { resetPassword } = useAuth();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const result = await resetPassword(email);
      if (result) {
        setSuccess(true);
      } else {
        setError("No account found with this email");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetWithToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.resetPassword({
        newPassword,
        token: token!,
      }, {
        onRequest: (ctx) => {
          return {
            ...ctx,
            credentials: "include",
          };
        },
      });

      if (error) {
        setError(error.message || "Failed to reset password");
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // If token exists, show reset form, otherwise show request form
  if (token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F8F5F0' }}>
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#285570' }}>
                <Cpu className="w-7 h-7 text-white" />
              </div>
            </div>
            <CardTitle className="text-center" style={{ fontSize: '32px', fontWeight: '700', color: '#1C3D51', fontFamily: '"Architects Daughter", cursive' }}>Set New Password</CardTitle>
            <CardDescription className="text-center" style={{ fontSize: '18px', color: '#000', fontFamily: '"Architects Daughter", cursive', fontWeight: '600' }}>
              Enter your new password
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleResetWithToken}>
            <CardContent className="space-y-4" style={{ paddingBottom: '1.5rem' }}>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <AlertDescription>
                    Password reset successful! Redirecting to login...
                  </AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="shadow-sm"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4" style={{ paddingTop: '0.5rem' }}>
              <Button type="submit" className="w-full nautical-primary hover:nautical-primary-dark" disabled={loading || success}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
              <Link
                to="/login"
                className="text-sm nautical-text hover:underline flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F8F5F0' }}>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#285570' }}>
              <Cpu className="w-7 h-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-center" style={{ fontSize: '32px', fontWeight: '700', color: '#1C3D51', fontFamily: '"Architects Daughter", cursive' }}>Reset password</CardTitle>
          <CardDescription className="text-center" style={{ fontSize: '18px', color: '#000', fontFamily: '"Architects Daughter", cursive', fontWeight: '600' }}>
            Enter your email to receive reset instructions
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRequestReset}>
          <CardContent className="space-y-4" style={{ paddingBottom: '1.5rem' }}>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription>
                  Password reset instructions have been sent to your email
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="shadow-sm"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4" style={{ paddingTop: '0.5rem' }}>
            <Button type="submit" className="w-full nautical-primary hover:nautical-primary-dark" disabled={loading}>
              {loading ? "Sending..." : "Send reset instructions"}
            </Button>
            <Link
              to="/login"
              className="text-sm nautical-text hover:underline flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

