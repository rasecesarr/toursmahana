import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Globe, Lock, User, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginMutation, user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (user) {
    setLocation("/admin");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen bg-sand/30 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl border-none overflow-hidden">
        <div className="bg-deep-blue p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gold mx-auto flex items-center justify-center mb-4 shadow-lg rotate-3">
            <Globe className="w-10 h-10 text-deep-blue" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Mahana Tours</h1>
          <p className="text-white/50 text-sm mt-1 uppercase tracking-widest font-medium">Panel de Control</p>
        </div>

        <CardHeader className="pt-8 text-center">
          <CardTitle className="text-xl font-bold text-deep-blue">Bienvenido</CardTitle>
          <CardDescription>Ingresa tus credenciales para administrar el portal</CardDescription>
        </CardHeader>

        <CardContent className="pb-8 px-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  placeholder="admin"
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gold hover:bg-gold-light text-deep-blue font-bold py-6 text-lg rounded-xl transition-all shadow-md mt-2"
              disabled={loginMutation.isPending || isLoading}
            >
              {loginMutation.isPending ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="fixed bottom-8 text-muted-foreground text-xs font-medium uppercase tracking-[0.2em]">
        Propiedad de Mahana Tours &copy; 2026
      </div>
    </div>
  );
}
