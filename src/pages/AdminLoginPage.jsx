import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { LogIn, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        localStorage.setItem('isAdmin', 'true'); 
        navigate('/admin/registrations');
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) {
        throw authError;
      }

      if (data.session) {
        localStorage.setItem('isAdmin', 'true'); 
        toast({
          title: "Inicio de Sesión Exitoso",
          description: "Bienvenido, Administrador.",
          variant: "default",
        });
        navigate('/admin/registrations');
      } else {
        setError("No se pudo iniciar sesión. Verifica tus credenciales.");
        toast({
          title: "Error de Inicio de Sesión",
          description: "Credenciales incorrectas o error desconocido.",
          variant: "destructive",
        });
      }
    } catch (authError) {
      console.error("Error en inicio de sesión:", authError);
      let errorMessage = "Error al intentar iniciar sesión. Inténtalo de nuevo.";
      if (authError.message.includes("Invalid login credentials")) {
        errorMessage = "Credenciales inválidas. Por favor, verifica tu email y contraseña.";
      } else if (authError.message.includes("Email not confirmed")) {
        errorMessage = "Tu correo electrónico aún no ha sido confirmado.";
      }
      setError(errorMessage);
      toast({
        title: "Error de Inicio de Sesión",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-[calc(100vh-200px)]"
    >
      <Card className="w-full max-w-md glassmorphism shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold ">Acceso Administrador</CardTitle>
          <CardDescription className="text-muted-foreground">
            Ingresa tus credenciales para acceder al panel.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input border-border focus:border-primary"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input border-border focus:border-primary"
                disabled={loading}
              />
            </div>
            {error && (
              <div className="flex items-center text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-foreground mr-2"></div>
              ) : (
                <LogIn className="mr-2 h-5 w-5" />
              )}
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default AdminLoginPage;