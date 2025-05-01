
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PricingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha o plano perfeito para seus estudos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Seja mais produtivo e acompanhe seu progresso com nossas ferramentas avançadas de monitoramento de estudos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Plano Gratuito */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900">Plano Gratuito</h3>
              <div className="mt-4 flex items-end">
                <span className="text-5xl font-extrabold">R$0</span>
                <span className="text-gray-500 ml-2 mb-1">/para sempre</span>
              </div>
              <p className="mt-6 text-gray-600">
                Perfeito para estudantes iniciando sua jornada de estudos
              </p>

              <ul className="mt-8 space-y-4">
                <FeatureItem text="Cronômetro de estudos" />
                <FeatureItem text="Até 5 matérias diferentes" />
                <FeatureItem text="Histórico dos últimos 30 dias" />
                <FeatureItem text="Relatórios básicos" />
              </ul>
            </div>
            <div className="p-8 bg-gray-50">
              <Button 
                onClick={() => navigate("/register")}
                className="w-full"
                variant="outline"
              >
                Começar Grátis
              </Button>
            </div>
          </div>

          {/* Plano Premium */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-blue-500 transition-transform hover:scale-105">
            <div className="p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Plano Premium</h3>
                <span className="px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                  Recomendado
                </span>
              </div>
              <div className="mt-4 flex items-end">
                <span className="text-5xl font-extrabold">R$29</span>
                <span className="text-gray-500 ml-2 mb-1">/mês</span>
              </div>
              <p className="mt-6 text-gray-600">
                Ideal para estudantes dedicados que buscam análises avançadas
              </p>

              <ul className="mt-8 space-y-4">
                <FeatureItem text="Tudo do plano gratuito" />
                <FeatureItem text="Matérias ilimitadas" />
                <FeatureItem text="Histórico completo" />
                <FeatureItem text="Relatórios avançados e estatísticas" />
                <FeatureItem text="Metas de estudo personalizadas" />
                <FeatureItem text="Lembretes e notificações" />
                <FeatureItem text="Suporte prioritário" />
              </ul>
            </div>
            <div className="p-8 bg-gradient-to-r from-blue-500 to-purple-500">
              <Button 
                onClick={() => navigate("/register")}
                className="w-full bg-white text-blue-600 hover:bg-gray-100"
              >
                Assinar Premium
              </Button>
            </div>
          </div>
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

// Componente para itens da lista de recursos
const FeatureItem = ({ text }: { text: string }) => (
  <li className="flex items-start">
    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
    <span className="text-gray-700">{text}</span>
  </li>
);

// Componente para itens de FAQ
const FaqItem = ({ question, answer }: { question: string; answer: string }) => (
  <div className="mb-6">
    <h4 className="text-lg font-semibold text-gray-900 mb-2">{question}</h4>
    <p className="text-gray-600">{answer}</p>
  </div>
);

export default PricingPage;
