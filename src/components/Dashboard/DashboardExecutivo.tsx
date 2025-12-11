import { Building2 } from "lucide-react";
import { MetricasSaude } from "./MetricasSaude";
import { GraficosInteligencia } from "./GraficosInteligencia";
import { TabelaRequisicoes } from "./TabelaRequisicoes";
import { 
  RequisicaoPendente, 
  MetricaGlobal, 
  DemandaCentroCusto, 
  DesembolsoSemanal 
} from "./tipos";

interface DashboardExecutivoProps {
  aoAnalisarDetalhes: (requisicaoId: string) => void;
}

// Dados mockados
const requisicoesPendentes: RequisicaoPendente[] = [
  { id: "#REQ-042", depto: "Tecnologia", solicitante: "Ana Silva", valor: 79500, statusCaixa: "risco", data: "12/12/2025" },
  { id: "#REQ-043", depto: "Marketing", solicitante: "Carlos Souza", valor: 12000, statusCaixa: "ok", data: "13/12/2025" },
  { id: "#REQ-044", depto: "Operações", solicitante: "Mariana Lima", valor: 45000, statusCaixa: "ok", data: "14/12/2025" }
];

const metricasGlobais: MetricaGlobal = {
  filaPendente: 1250000,
  totalRequisicoes: 12,
  disponibilidadeGlobal: 900000
};

const demandaPorCentro: DemandaCentroCusto[] = [
  { nome: "TI", valor: 562500, percentual: 45, cor: "hsl(200, 98%, 39%)" },
  { nome: "Marketing", valor: 312500, percentual: 25, cor: "hsl(280, 60%, 50%)" },
  { nome: "RH", valor: 187500, percentual: 15, cor: "hsl(40, 90%, 50%)" },
  { nome: "Operações", valor: 187500, percentual: 15, cor: "hsl(150, 60%, 45%)" }
];

const desembolsoSemanal: DesembolsoSemanal[] = [
  { semana: "Semana 1", previsto: 350000, realizavel: 280000 },
  { semana: "Semana 2", previsto: 280000, realizavel: 250000 },
  { semana: "Semana 3", previsto: 320000, realizavel: 200000 },
  { semana: "Semana 4", previsto: 300000, realizavel: 170000 }
];

export function DashboardExecutivo({ aoAnalisarDetalhes }: DashboardExecutivoProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Painel de Controle Executivo
              </h1>
              <p className="text-sm text-muted-foreground">
                Visão consolidada de aprovações e fluxo de caixa
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Seção A: Métricas de Saúde Corporativa */}
        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Métricas de Saúde Corporativa
          </h2>
          <MetricasSaude metricas={metricasGlobais} />
        </section>

        {/* Seção B: Inteligência Visual */}
        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Inteligência Visual
          </h2>
          <GraficosInteligencia 
            demandaPorCentro={demandaPorCentro}
            desembolsoSemanal={desembolsoSemanal}
          />
        </section>

        {/* Seção C: Fila de Trabalho */}
        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Fila de Trabalho
          </h2>
          <TabelaRequisicoes 
            requisicoes={requisicoesPendentes}
            aoAnalisarDetalhes={aoAnalisarDetalhes}
          />
        </section>
      </main>
    </div>
  );
}
