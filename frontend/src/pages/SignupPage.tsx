import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Cpu } from "lucide-react";

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, name);
      // Small delay to ensure session is established before navigation
      await new Promise(resolve => setTimeout(resolve, 100));
      navigate("/");
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: '#F8F5F0' }}>
      <Card style={{ width: '100%', maxWidth: '448px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
        <CardHeader style={{ paddingTop: '24px', paddingBottom: '16px', paddingLeft: '24px', paddingRight: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#285570' }}>
              <Cpu style={{ width: '28px', height: '28px', color: 'white' }} />
            </div>
          </div>
          <CardTitle style={{ fontSize: '32px', fontWeight: '700', textAlign: 'center', marginBottom: '8px', color: '#1C3D51', fontFamily: '"Architects Daughter", cursive' }}>
            Create an account
          </CardTitle>
          <CardDescription style={{ textAlign: 'center', fontSize: '18px', color: '#000', fontFamily: '"Architects Daughter", cursive', fontWeight: '600' }}>
            Join CoreMarket today
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent style={{ padding: '24px', paddingTop: '16px' }}>
            {error && (
              <Alert variant="destructive" style={{ marginBottom: '16px' }}>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div style={{ marginBottom: '20px' }}>
              <Label htmlFor="name" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', padding: '8px 12px', fontSize: '14px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <Label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '8px 12px', fontSize: '14px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <Label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                style={{ width: '100%', padding: '8px 12px', fontSize: '14px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
            </div>
            <div style={{ marginBottom: '0' }}>
              <Label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                style={{ width: '100%', padding: '8px 12px', fontSize: '14px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
            </div>
          </CardContent>
          <CardFooter style={{ padding: '24px', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '10px 16px', 
                backgroundColor: '#285570', 
                color: 'white', 
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '6px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
            <p style={{ fontSize: '14px', textAlign: 'center', color: '#66655F', margin: 0 }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: '#285570', textDecoration: 'none', fontWeight: '500' }}>
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

