import { useState, useMemo } from "react";
import { ItemRequisicao, DadosFinanceiros } from "./tipos";
import { CardKPI } from "./CardKPI";
import { TabelaItens } from "./TabelaItens";
import { BarraDecisao } from "./BarraDecisao";
import { TimelineAuditoria } from "./TimelineAuditoria";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { FileText, Wallet, TrendingUp, PiggyBank, Building2, ArrowLeft, LogOut } from "lucide-react";

// Dados iniciais mockados
const dadosIniciais: ItemRequisicao[] = [
  { 
    id: 1, 
    produto: "MacBook Pro M3", 
    categoria: 'hardware',
    sku: "APPLE-MBP-M3-14",
    precoUnitario: 12000, 
    qtdSolicitada: 3, 
    qtdAprovada: 3, 
    observacao: "" 
  },
  { 
    id: 2, 
    produto: "Monitor Dell 27\"", 
    categoria: 'hardware',
    sku: "DELL-U2723QE",
    precoUnitario: 2500, 
    qtdSolicitada: 5, 
    qtdAprovada: 5, 
    observacao: "" 
  },
  { 
    id: 3, 
    produto: "Cadeira Ergonômica", 
    categoria: 'mobiliario',
    sku: "HM-AERON-BLK",
    precoUnitario: 8000, 
    qtdSolicitada: 2, 
    qtdAprovada: 2, 
    observacao: "" 
  },
  { 
    id: 4, 
    produto: "Licença de Software", 
    categoria: 'software',
    sku: "JBRAINS-ALL-ANNUAL",
    precoUnitario: 1500, 
    qtdSolicitada: 10, 
    qtdAprovada: 10, 
    observacao: "" 
  }
];

const dadosFinanceiros: DadosFinanceiros = {
  disponibilidadeCaixa: 30000,
  dataVencimento: "15/01/2025"
};

const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

interface PainelAprovacaoCEOProps {
  aoVoltar?: () => void;
  aoTrocarPerfil?: () => void;
  requisicaoId?: string;
}

export function PainelAprovacaoCEO({ aoVoltar, aoTrocarPerfil, requisicaoId = "#REQ-2025-0042" }: PainelAprovacaoCEOProps) {
  const [itens, setItens] = useState<ItemRequisicao[]>(dadosIniciais);
  const { toast } = useToast();

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
    
    const temDeficit = dadosFinanceiros.disponibilidadeCaixa < totalAprovado;
    
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
    toast({
      title: "Aprovação Executiva Confirmada",
      description: `${calculos.itensAprovados} itens aprovados no valor de ${formatarMoeda(calculos.totalAprovado)}`,
    });
  };

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
                  <p className="text-sm text-muted-foreground">Requisição {requisicaoId} • Departamento de TI</p>
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
              valor={formatarMoeda(dadosFinanceiros.disponibilidadeCaixa)}
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
