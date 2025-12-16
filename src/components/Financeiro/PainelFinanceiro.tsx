import { Landmark, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormularioPrevisao } from "./FormularioPrevisao";
import { TabelaPrevisoes } from "./TabelaPrevisoes";
import { PrevisaoCaixa, FormPrevisao } from "./tipos";
import { useApp } from "@/contexts/AppContext";

interface PainelFinanceiroProps {
  aoTrocarPerfil: () => void;
}

export function PainelFinanceiro({ aoTrocarPerfil }: PainelFinanceiroProps) {
  const { previsoesFinanceiras, adicionarPrevisao } = useApp();

  const aoLancarPrevisao = (dados: FormPrevisao) => {
    if (!dados.dataInicio || !dados.dataFim) return;
    
    const novaPrevisao: PrevisaoCaixa = {
      id: `prev-${Date.now()}`,
      periodoInicio: dados.dataInicio.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      periodoFim: dados.dataFim.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      responsavel: "Usuário Atual",
      valor: parseFloat(dados.valor.replace(/\./g, '').replace(',', '.')) || 0,
      status: "projetado",
      centroCusto: dados.centroCusto
    };

    adicionarPrevisao(novaPrevisao);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Landmark className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Gestão de Disponibilidade de Caixa
                </h1>
                <p className="text-sm text-muted-foreground">
                  Controle de liquidez e previsões financeiras
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={aoTrocarPerfil}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Voltar ao Portal
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal - 2 Colunas */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Coluna Esquerda: Formulário */}
          <div className="lg:col-span-2">
            <FormularioPrevisao aoLancar={aoLancarPrevisao} />
          </div>

          {/* Coluna Direita: Tabela */}
          <div className="lg:col-span-3">
            <TabelaPrevisoes previsoes={previsoesFinanceiras} />
          </div>
        </div>
      </main>
    </div>
  );
}
