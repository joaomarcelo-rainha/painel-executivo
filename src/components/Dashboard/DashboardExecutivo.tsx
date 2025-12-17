import { useState, useMemo } from "react";
import { Building2, LogOut, Inbox } from "lucide-react";
import { MetricasSaude } from "./MetricasSaude";
import { GraficosInteligencia } from "./GraficosInteligencia";
import { TabelaRequisicoes } from "./TabelaRequisicoes";
import { NotificacaoBell } from "./NotificacaoBell";
import { ModalRatificacao } from "./ModalRatificacao";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PerfilUsuario } from "@/components/PortalSelecaoPerfil";
import { useApp } from "@/contexts/AppContext";
import { 
  RequisicaoPendente, 
  MetricaGlobal, 
  DemandaCentroCusto, 
  DesembolsoSemanal 
} from "./tipos";

interface DashboardExecutivoProps {
  aoAnalisarDetalhes: (requisicaoId: string) => void;
  aoTrocarPerfil: () => void;
  perfilAtual: PerfilUsuario;
}

const nomesPerfilExibicao: Record<NonNullable<PerfilUsuario>, string> = {
  ceo: 'CEO',
  financeiro: 'Financeiro',
  solicitante: 'Solicitante',
  compras: 'Compras'
};

const mapCentroCusto: Record<string, string> = {
  'ti': 'Tecnologia',
  'mkt': 'Marketing',
  'rh': 'RH',
  'ops': 'Operações',
  'log': 'Logística',
  'jur': 'Jurídico',
  'pd': 'P&D',
  'com': 'Comercial',
  'fin': 'Financeiro',
};

export function DashboardExecutivo({ aoAnalisarDetalhes, aoTrocarPerfil, perfilAtual }: DashboardExecutivoProps) {
  const { requisicoes, obterDisponibilidadeGlobal } = useApp();
  const [notificacoes, setNotificacoes] = useState(0);
  const [modalRatificacaoAberto, setModalRatificacaoAberto] = useState(false);

  const disponibilidadeGlobal = obterDisponibilidadeGlobal();

  // Converter requisicões do contexto para o formato do dashboard
  const requisicoesPendentes: RequisicaoPendente[] = useMemo(() => {
    return requisicoes
      .filter(req => req.status === 'aguardando_aprovacao' || req.status === 'em_analise')
      .map(req => ({
        id: req.id,
        depto: (mapCentroCusto[req.centroCusto] || 'Tecnologia') as RequisicaoPendente['depto'],
        solicitante: 'Solicitante',
        valor: req.valorTotal,
        statusCaixa: req.valorTotal > disponibilidadeGlobal ? 'risco' : 'ok',
        data: req.dataCriacao,
      }));
  }, [requisicoes, disponibilidadeGlobal]);

  // Calcular métricas dinâmicas
  const metricasGlobais: MetricaGlobal = useMemo(() => ({
    filaPendente: requisicoesPendentes.reduce((acc, r) => acc + r.valor, 0),
    totalRequisicoes: requisicoesPendentes.length,
    disponibilidadeGlobal,
  }), [requisicoesPendentes, disponibilidadeGlobal]);

  // Gráficos baseados em dados reais
  const demandaPorCentro: DemandaCentroCusto[] = useMemo(() => {
    const total = requisicoesPendentes.reduce((acc, r) => acc + r.valor, 0);
    if (total === 0) return [];
    
    const porDepto: Record<string, number> = {};
    requisicoesPendentes.forEach(r => {
      porDepto[r.depto] = (porDepto[r.depto] || 0) + r.valor;
    });

    const cores: Record<string, string> = {
      'Tecnologia': 'hsl(200, 98%, 39%)',
      'Marketing': 'hsl(280, 60%, 50%)',
      'RH': 'hsl(40, 90%, 50%)',
      'Operações': 'hsl(150, 60%, 45%)',
    };

    return Object.entries(porDepto).map(([nome, valor]) => ({
      nome,
      valor,
      percentual: Math.round((valor / total) * 100),
      cor: cores[nome] || 'hsl(200, 50%, 50%)',
    }));
  }, [requisicoesPendentes]);

  const desembolsoSemanal: DesembolsoSemanal[] = useMemo(() => {
    const total = metricasGlobais.filaPendente;
    if (total === 0) return [];
    
    return [
      { semana: "Semana 1", previsto: Math.round(total * 0.28), realizavel: Math.round(disponibilidadeGlobal * 0.35) },
      { semana: "Semana 2", previsto: Math.round(total * 0.22), realizavel: Math.round(disponibilidadeGlobal * 0.25) },
      { semana: "Semana 3", previsto: Math.round(total * 0.26), realizavel: Math.round(disponibilidadeGlobal * 0.22) },
      { semana: "Semana 4", previsto: Math.round(total * 0.24), realizavel: Math.round(disponibilidadeGlobal * 0.18) },
    ];
  }, [metricasGlobais.filaPendente, disponibilidadeGlobal]);

  const aoAbrirRatificacao = () => {
    setModalRatificacaoAberto(true);
  };

  const aoConcluirProcesso = () => {
    setNotificacoes(0);
  };

  const temDados = requisicoesPendentes.length > 0 || disponibilidadeGlobal > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
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
                  {perfilAtual && ` • ${nomesPerfilExibicao[perfilAtual]}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificacaoBell 
                contagem={notificacoes} 
                aoClicarNotificacao={aoAbrirRatificacao} 
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={aoTrocarPerfil}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Trocar Perfil
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {!temDados ? (
          /* Empty State */
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <Inbox className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Nenhuma requisição pendente
              </h2>
              <p className="text-muted-foreground max-w-md">
                Ainda não há requisições para aprovar. O Financeiro precisa lançar disponibilidade de caixa e os solicitantes precisam criar requisições.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Seção A: Métricas de Saúde Corporativa */}
            <section>
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Métricas de Saúde Corporativa
              </h2>
              <MetricasSaude metricas={metricasGlobais} />
            </section>

            {/* Seção B: Inteligência Visual */}
            {demandaPorCentro.length > 0 && (
              <section>
                <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Inteligência Visual
                </h2>
                <GraficosInteligencia 
                  demandaPorCentro={demandaPorCentro}
                  desembolsoSemanal={desembolsoSemanal}
                />
              </section>
            )}

            {/* Seção C: Fila de Trabalho */}
            {requisicoesPendentes.length > 0 && (
              <section>
                <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Fila de Trabalho
                </h2>
                <TabelaRequisicoes 
                  requisicoes={requisicoesPendentes}
                  aoAnalisarDetalhes={aoAnalisarDetalhes}
                />
              </section>
            )}
          </>
        )}
      </main>

      <ModalRatificacao 
        aberto={modalRatificacaoAberto}
        aoFechar={() => setModalRatificacaoAberto(false)}
        aoConcluir={aoConcluirProcesso}
      />
    </div>
  );
}
