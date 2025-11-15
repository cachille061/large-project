import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Cpu, ArrowLeft } from "lucide-react";

export function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
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
        <form onSubmit={handleSubmit}>
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

