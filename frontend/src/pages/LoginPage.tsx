import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Cpu } from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
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
          <CardTitle style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px', color: '#1C3D51' }}>
            Welcome back
          </CardTitle>
          <CardDescription style={{ textAlign: 'center', fontSize: '14px', color: '#66655F' }}>
            Sign in to your MyTechMarket account
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
            <div style={{ marginBottom: '16px' }}>
              <Label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '8px 12px', fontSize: '14px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
            </div>
            <Link to="/reset-password" style={{ fontSize: '14px', color: '#285570', textDecoration: 'none', display: 'block' }}>
              Forgot password?
            </Link>
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
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            <p style={{ fontSize: '14px', textAlign: 'center', color: '#66655F', margin: 0 }}>
              Don't have an account?{" "}
              <Link to="/signup" style={{ color: '#285570', textDecoration: 'none', fontWeight: '500' }}>
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

