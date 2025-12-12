import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, FileText } from "lucide-react";
import { CardRequisicao } from "./CardRequisicao";
import { FormularioRequisicao } from "./FormularioRequisicao";
import { Requisicao, ItemRequisicao } from "./tipos";
import { useToast } from "@/hooks/use-toast";

interface PainelSolicitanteProps {
  aoTrocarPerfil: () => void;
}

// Mock data - Requisição #REQ-042 que o CEO vê
const requisicoesMock: Requisicao[] = [
  {
    id: "#REQ-042",
    titulo: "Equipamentos de TI - Novos Devs",
    justificativa: "Aquisição de equipamentos para os 5 novos desenvolvedores que iniciam em janeiro.",
    centroCusto: "ti",
    itens: [
      { id: "1", produto: "Notebook Dell Latitude", quantidade: 5, precoUnitario: 12000 },
      { id: "2", produto: "Monitor 27'' 4K", quantidade: 10, precoUnitario: 1500 },
      { id: "3", produto: "Teclado Mecânico", quantidade: 5, precoUnitario: 500 },
      { id: "4", produto: "Mouse Ergonômico", quantidade: 5, precoUnitario: 200 },
    ],
    valorTotal: 79500,
    status: "aguardando_aprovacao",
    etapaAtual: 1, // Aguardando CEO
    dataCriacao: "Hoje",
    horaCriacao: "14:30",
  },
];

export function PainelSolicitante({ aoTrocarPerfil }: PainelSolicitanteProps) {
  const { toast } = useToast();
  const [requisicoes, setRequisicoes] = useState<Requisicao[]>(requisicoesMock);
  const [modalAberto, setModalAberto] = useState(false);

  const handleNovaRequisicao = (dados: {
    titulo: string;
    justificativa: string;
    centroCusto: string;
    itens: ItemRequisicao[];
  }) => {
    const valorTotal = dados.itens.reduce((acc, item) => acc + (item.quantidade * item.precoUnitario), 0);
    
    const novaRequisicao: Requisicao = {
      id: `#REQ-${String(45 + requisicoes.length).padStart(3, '0')}`,
      titulo: dados.titulo,
      justificativa: dados.justificativa,
      centroCusto: dados.centroCusto,
      itens: dados.itens,
      valorTotal,
      status: "aguardando_aprovacao",
      etapaAtual: 0,
      dataCriacao: "Hoje",
      horaCriacao: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setRequisicoes([novaRequisicao, ...requisicoes]);
    toast({
      title: "Requisição enviada!",
      description: `${novaRequisicao.id} foi enviada para aprovação.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-background to-purple-50 dark:from-violet-950/20 dark:via-background dark:to-purple-950/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Portal de Compras - Área do Colaborador
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerencie suas solicitações de compra
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setModalAberto(true)}
              className="bg-violet-600 hover:bg-violet-700"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nova Requisição
            </Button>
            <Button variant="outline" onClick={aoTrocarPerfil}>
              <LogOut className="h-4 w-4 mr-2" />
              Voltar ao Portal
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {requisicoes.length === 0 ? (
          /* Estado Zero */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-32 h-32 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mb-6">
              <FileText className="h-16 w-16 text-violet-400" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Você não tem pedidos recentes
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Comece criando uma nova requisição de compra clicando no botão acima.
            </p>
            <Button 
              onClick={() => setModalAberto(true)}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Minha Primeira Requisição
            </Button>
          </div>
        ) : (
          /* Lista de Requisições */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Minhas Requisições ({requisicoes.length})
              </h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {requisicoes.map((req) => (
                <CardRequisicao key={req.id} requisicao={req} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal de Nova Requisição */}
      <FormularioRequisicao
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
        aoEnviar={handleNovaRequisicao}
      />
    </div>
  );
}
