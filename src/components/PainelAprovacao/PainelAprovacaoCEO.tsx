import { useState, useMemo, useEffect } from "react";
import { ItemRequisicao, DadosFinanceiros } from "./tipos";
import { CardKPI } from "./CardKPI";
import { TabelaItens } from "./TabelaItens";
import { BarraDecisao } from "./BarraDecisao";
import { TimelineAuditoria } from "./TimelineAuditoria";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Wallet, TrendingUp, PiggyBank, Building2, ArrowLeft, LogOut, PackageX } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { ItemCotacao } from "@/components/Compras/tipos";

const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
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

interface PainelAprovacaoCEOProps {
  aoVoltar?: () => void;
  aoTrocarPerfil?: () => void;
  requisicaoId?: string;
}

export function PainelAprovacaoCEO({ aoVoltar, aoTrocarPerfil, requisicaoId }: PainelAprovacaoCEOProps) {
  const { toast } = useToast();
  const { requisicoes, obterDisponibilidadeGlobal, aprovarRequisicao, atualizarRequisicao } = useApp();
  
  // Encontrar requisição real do contexto
  const requisicaoAtual = requisicoes.find(r => r.id === requisicaoId);
  
  // Converter itens da requisição para formato do painel
  const [itens, setItens] = useState<ItemRequisicao[]>([]);
  
  useEffect(() => {
    if (requisicaoAtual) {
      const itensConvertidos: ItemRequisicao[] = requisicaoAtual.itens.map((item, index) => ({
        id: index + 1,
        produto: item.produto,
        categoria: 'hardware' as const,
        sku: `SKU-${index + 1}`,
        precoUnitario: item.precoUnitario,
        qtdSolicitada: item.quantidade,
        qtdAprovada: item.quantidade,
        observacao: "",
      }));
      setItens(itensConvertidos);
    }
  }, [requisicaoAtual]);

  const disponibilidadeCaixa = obterDisponibilidadeGlobal();
  const nomeDepto = requisicaoAtual ? (mapCentroCusto[requisicaoAtual.centroCusto] || requisicaoAtual.centroCusto) : 'Desconhecido';

  // Cálculos dinâmicos
  const calculos = useMemo(() => {
    const totalOriginal = itens.reduce(
      (acc, item) => acc + (item.precoUnitario * item.qtdSolicitada), 
      0
    );
    
    const totalAprovado = itens.reduce(
      (acc, item) => acc + (item.precoUnitario * item.qtdAprovada), 
      0
    );
    
    const economia = totalOriginal - totalAprovado;
    
    const itensAprovados = itens.filter(item => item.qtdAprovada > 0).length;
    
    const temDeficit = disponibilidadeCaixa < totalAprovado;
    
    return {
      totalOriginal,
      totalAprovado,
      economia,
      itensAprovados,
      temDeficit
    };
  }, [itens]);

  const aoAlterarQuantidade = (id: number, novaQuantidade: number) => {
    setItens(itensAtuais =>
      itensAtuais.map(item =>
        item.id === id 
          ? { ...item, qtdAprovada: novaQuantidade }
          : item
      )
    );
  };

  const aoAlterarObservacao = (id: number, novaObservacao: string) => {
    setItens(itensAtuais =>
      itensAtuais.map(item =>
        item.id === id 
          ? { ...item, observacao: novaObservacao }
          : item
      )
    );
  };

  const aoRejeitar = () => {
    setItens(itensAtuais =>
      itensAtuais.map(item => ({ ...item, qtdAprovada: 0 }))
    );
    toast({
      title: "Requisição Rejeitada",
      description: "Todos os itens foram marcados como rejeitados.",
      variant: "destructive"
    });
  };

  const aoAprovar = () => {
    if (!requisicaoId || !requisicaoAtual) return;
    
    // Converter itens aprovados para o formato de compras
    const itensAprovados: ItemCotacao[] = itens
      .filter(item => item.qtdAprovada > 0)
      .map(item => ({
        id: `${requisicaoId}-item-${item.id}`,
        requisicaoId,
        produto: item.produto,
        quantidadeAprovada: item.qtdAprovada,
        targetPrice: item.precoUnitario,
        status: 'aguardando_cotacao' as const,
      }));
    
    // Salvar no contexto global
    aprovarRequisicao(requisicaoId, itensAprovados);
    
    toast({
      title: "Aprovação Executiva Confirmada",
      description: `${calculos.itensAprovados} itens aprovados no valor de ${formatarMoeda(calculos.totalAprovado)}`,
    });
    
    if (aoVoltar) aoVoltar();
  };

  // Empty state quando não encontra requisição
  if (!requisicaoAtual) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <PackageX className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Requisição não encontrada
            </h2>
            <p className="text-muted-foreground mb-6">
              A requisição {requisicaoId} não existe ou foi removida.
            </p>
            {aoVoltar && (
              <Button onClick={aoVoltar} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Empty state quando requisição não tem itens
  if (itens.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <PackageX className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Nenhum item na requisição
            </h2>
            <p className="text-muted-foreground mb-6">
              A requisição {requisicaoId} não possui itens para aprovar.
            </p>
            {aoVoltar && (
              <Button onClick={aoVoltar} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {aoVoltar && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={aoVoltar}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar ao Dashboard
                </Button>
              )}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Painel de Aprovação Executiva</h1>
                  <p className="text-sm text-muted-foreground">Requisição {requisicaoId} • {nomeDepto}</p>
                </div>
              </div>
            </div>
            {aoTrocarPerfil && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={aoTrocarPerfil}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Trocar Perfil
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* KPI Cards */}
        <section className="mb-8">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Inteligência Financeira
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CardKPI
              titulo="Demanda Original"
              valor={formatarMoeda(calculos.totalOriginal)}
              variante="neutro"
              icone={<FileText className="h-5 w-5" />}
            />
            
            <CardKPI
              titulo="Disponibilidade na Data de Vencimento"
              valor={formatarMoeda(disponibilidadeCaixa)}
              variante="semaforo"
              semaforoStatus={calculos.temDeficit ? 'deficit' : 'saudavel'}
              icone={<Wallet className="h-5 w-5" />}
            />
            
            <CardKPI
              titulo="Valor a Aprovar Agora"
              valor={formatarMoeda(calculos.totalAprovado)}
              variante="destaque"
              icone={<TrendingUp className="h-5 w-5" />}
            />
            
            <CardKPI
              titulo="Economia Gerada (Cortes)"
              valor={formatarMoeda(calculos.economia)}
              variante={calculos.economia > 0 ? 'economia' : 'neutro'}
              icone={<PiggyBank className="h-5 w-5" />}
            />
          </div>
        </section>

        {/* Tabela de Itens + Timeline */}
        <section className="grid gap-6 lg:grid-cols-[1fr,320px]">
          <div>
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Matriz de Edição
            </h2>
            <TabelaItens
              itens={itens}
              aoAlterarQuantidade={aoAlterarQuantidade}
              aoAlterarObservacao={aoAlterarObservacao}
            />
          </div>
          
          {/* Timeline de Auditoria */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <TimelineAuditoria />
          </div>
        </section>
      </main>

      {/* Barra de Decisão */}
      <BarraDecisao
        totalItensAprovados={calculos.itensAprovados}
        valorTotalAprovado={formatarMoeda(calculos.totalAprovado)}
        temDeficit={calculos.temDeficit}
        aoRejeitar={aoRejeitar}
        aoAprovar={aoAprovar}
      />
    </div>
  );
}
