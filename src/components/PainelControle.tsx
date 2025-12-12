import { useState } from "react";
import { DashboardExecutivo } from "./Dashboard/DashboardExecutivo";
import { PainelAprovacaoCEO } from "./PainelAprovacao/PainelAprovacaoCEO";
import { PainelFinanceiro } from "./Financeiro/PainelFinanceiro";
import { PortalSelecaoPerfil, PerfilUsuario } from "./PortalSelecaoPerfil";

type VisaoAtual = 'selecao' | 'dashboard' | 'detalhe' | 'financeiro';

export function PainelControle() {
  const [visaoAtual, setVisaoAtual] = useState<VisaoAtual>('selecao');
  const [perfilAtual, setPerfilAtual] = useState<PerfilUsuario>(null);
  const [requisicaoSelecionada, setRequisicaoSelecionada] = useState<string | null>(null);

  const aoSelecionarPerfil = (perfil: PerfilUsuario) => {
    setPerfilAtual(perfil);
    if (perfil === 'financeiro') {
      setVisaoAtual('financeiro');
    } else {
      setVisaoAtual('dashboard');
    }
  };

  const aoTrocarPerfil = () => {
    setVisaoAtual('selecao');
    setPerfilAtual(null);
    setRequisicaoSelecionada(null);
  };

  const aoAnalisarDetalhes = (requisicaoId: string) => {
    setRequisicaoSelecionada(requisicaoId);
    setVisaoAtual('detalhe');
  };

  const aoVoltarDashboard = () => {
    setVisaoAtual('dashboard');
    setRequisicaoSelecionada(null);
  };

  // Tela de seleção de perfil
  if (visaoAtual === 'selecao') {
    return <PortalSelecaoPerfil aoSelecionarPerfil={aoSelecionarPerfil} />;
  }

  // Tela do Financeiro
  if (visaoAtual === 'financeiro') {
    return <PainelFinanceiro aoTrocarPerfil={aoTrocarPerfil} />;
  }

  // Tela de detalhe (Matriz de Aprovação)
  if (visaoAtual === 'detalhe') {
    return (
      <PainelAprovacaoCEO 
        aoVoltar={aoVoltarDashboard}
        aoTrocarPerfil={aoTrocarPerfil}
        requisicaoId={requisicaoSelecionada || undefined}
      />
    );
  }

  // Dashboard (por enquanto só CEO está implementado)
  return (
    <DashboardExecutivo 
      aoAnalisarDetalhes={aoAnalisarDetalhes}
      aoTrocarPerfil={aoTrocarPerfil}
      perfilAtual={perfilAtual}
    />
  );
}
