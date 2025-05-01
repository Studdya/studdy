
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PricingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingView />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Estude de forma mais eficiente
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Escolha o plano que melhor se adapta à sua jornada de estudos e acompanhe seu progresso
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Plano Gratuito */}
          <Card className="border-2 border-gray-200 shadow-lg transition-transform hover:scale-105">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-gray-900">Plano Gratuito</CardTitle>
              <div className="mt-4 flex items-end">
                <span className="text-5xl font-extrabold">R$0</span>
                <span className="text-gray-500 ml-2 mb-1">/para sempre</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-gray-600">
                Perfeito para estudantes iniciando sua jornada de estudos
              </p>

              <ul className="space-y-4">
                <FeatureItem text="Cronômetro de estudos" />
                <FeatureItem text="Até 5 matérias diferentes" />
                <FeatureItem text="Histórico dos últimos 30 dias" />
                <FeatureItem text="Relatórios básicos" />
              </ul>
            </CardContent>
            <CardFooter className="pt-4 bg-gray-50">
              <Button 
                onClick={() => navigate("/register")}
                className="w-full"
                variant="outline"
              >
                Começar Grátis
              </Button>
            </CardFooter>
          </Card>

          {/* Plano Premium */}
          <Card className="border-2 border-blue-500 shadow-lg transition-transform hover:scale-105">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-gray-900">Plano Premium</CardTitle>
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500">
                  Recomendado
                </Badge>
              </div>
              <div className="mt-4 flex items-end">
                <span className="text-5xl font-extrabold">R$29</span>
                <span className="text-gray-500 ml-2 mb-1">/mês</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-gray-600">
                Ideal para estudantes dedicados que buscam análises avançadas
              </p>

              <ul className="space-y-4">
                <FeatureItem text="Tudo do plano gratuito" />
                <FeatureItem text="Matérias ilimitadas" />
                <FeatureItem text="Histórico completo" />
                <FeatureItem text="Relatórios avançados e estatísticas" />
                <FeatureItem text="Metas de estudo personalizadas" />
                <FeatureItem text="Lembretes e notificações" />
                <FeatureItem text="Suporte prioritário" />
              </ul>
            </CardContent>
            <CardFooter className="pt-4 bg-gradient-to-r from-blue-500 to-purple-500">
              <Button 
                onClick={() => navigate("/register")}
                className="w-full bg-white text-blue-600 hover:bg-gray-100"
              >
                Assinar Premium
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <Alert className="max-w-4xl mx-auto bg-gradient-to-r from-purple-50 to-blue-50 border-blue-200">
            <AlertTitle className="text-xl font-semibold text-blue-700">
              Teste Gratuito de 7 dias
            </AlertTitle>
            <AlertDescription className="text-md">
              Assine agora e experimente o plano Premium por 7 dias sem compromisso. 
              Cancele a qualquer momento se não ficar satisfeito.
            </AlertDescription>
          </Alert>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Perguntas Frequentes
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <FaqItem 
              question="Posso cancelar a qualquer momento?"
              answer="Sim, você pode cancelar sua assinatura a qualquer momento. Não há contratos de longo prazo ou taxas de cancelamento."
            />
            <FaqItem 
              question="Como funciona o período de testes?"
              answer="Oferecemos 7 dias de teste gratuito do plano Premium. Você pode experimentar todos os recursos sem compromisso."
            />
            <FaqItem 
              question="Posso mudar de plano depois?"
              answer="Claro! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento, conforme suas necessidades mudarem."
            />
            <FaqItem 
              question="Como funciona o suporte?"
              answer="Usuários Premium têm acesso a suporte prioritário por email com resposta em até 24 horas."
            />
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600">
            Ainda com dúvidas? Entre em contato com a nossa equipe em{" "}
            <a href="mailto:suporte@estudos.app" className="text-blue-600 font-medium">
              suporte@estudos.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Loading view component
const LoadingView = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mx-auto animate-pulse flex items-center justify-center">
            <span className="text-white text-4xl font-bold">E</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Carregando planos...
        </h2>
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-3 h-3 rounded-full bg-blue-300 animate-bounce" style={{ animationDelay: "0.3s" }}></div>
        </div>
        <p className="text-gray-600 mt-8 max-w-md mx-auto">
          Estamos preparando as melhores opções para sua jornada de estudos
        </p>
      </div>
    </div>
  );
};

// Componente para itens da lista de recursos
const FeatureItem = ({ text }: { text: string }) => (
  <li className="flex items-start">
    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
    <span className="text-gray-700">{text}</span>
  </li>
);

// Componente para itens de FAQ
const FaqItem = ({ question, answer }: { question: string; answer: string }) => (
  <div className="mb-6 p-4 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
    <h4 className="text-lg font-semibold text-gray-900 mb-2">{question}</h4>
    <p className="text-gray-600">{answer}</p>
  </div>
);

export default PricingPage;
