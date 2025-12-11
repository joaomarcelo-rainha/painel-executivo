import { useState } from "react";
import { DashboardExecutivo } from "./Dashboard/DashboardExecutivo";
import { PainelAprovacaoCEO } from "./PainelAprovacao/PainelAprovacaoCEO";

type VisaoAtual = 'dashboard' | 'detalhe';

export function PainelControle() {
  const [visaoAtual, setVisaoAtual] = useState<VisaoAtual>('dashboard');
  const [requisicaoSelecionada, setRequisicaoSelecionada] = useState<string | null>(null);

  const aoAnalisarDetalhes = (requisicaoId: string) => {
    setRequisicaoSelecionada(requisicaoId);
    setVisaoAtual('detalhe');
  };

  const aoVoltarDashboard = () => {
    setVisaoAtual('dashboard');
    setRequisicaoSelecionada(null);
  };

  if (visaoAtual === 'detalhe') {
    return (
      <PainelAprovacaoCEO 
        aoVoltar={aoVoltarDashboard}
        requisicaoId={requisicaoSelecionada || undefined}
      />
    );
  }

  return <DashboardExecutivo aoAnalisarDetalhes={aoAnalisarDetalhes} />;
}
