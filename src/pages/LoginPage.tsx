
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const loginSchema = z.object({
  email: z.string().email("Digite um email válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres")
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      // Use Supabase to sign in
      const {
        data: authData,
        error
      } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (error) {
        throw new Error(error.message);
      }

      if (authData.session) {
        // Set authentication state
        localStorage.setItem('isAuthenticated', 'true');
        toast.success("Login realizado com sucesso!");

        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        throw new Error("Falha na autenticação. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPricing = () => {
    window.open("https://studdy.framer.ai/#pricing", "_blank");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/studdy-logo.png" 
              alt="Studdy Logo" 
              className="h-16 w-16"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Salve, Seja Bem-Vindo!</h2>
          <p className="mt-2 text-sm text-gray-600">
            Faça login para continuar seus estudos
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="email" render={({
            field
          }) => <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="seu@email.com" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

            <FormField control={form.control} name="password" render={({
            field
          }) => <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </div>
          </form>
        </Form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou</span>
            </div>
          </div>

          <div className="mt-6">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={handleViewPricing} disabled={isLoading}>
              <ExternalLink className="h-4 w-4" />
              Ver planos disponíveis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
