import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, FileDown, ClipboardCheck, Clock, Package } from "lucide-react";
import { CardKPICompras } from "./CardKPICompras";
import { TabelaCotacoes } from "./TabelaCotacoes";
import { ItemCotacao } from "./tipos";
import { useToast } from "@/hooks/use-toast";

interface PainelComprasProps {
  aoTrocarPerfil: () => void;
}

// Mock data consistente com aprovação do CEO
const itensMock: ItemCotacao[] = [
  {
    id: "item-1",
    requisicaoId: "#REQ-042",
    produto: "Monitor Dell 27\"",
    quantidadeAprovada: 5,
    targetPrice: 2500.00,
    status: 'aguardando_cotacao',
  },
  {
    id: "item-2",
    requisicaoId: "#REQ-042",
    produto: "Cadeira Ergonômica",
    quantidadeAprovada: 2,
    targetPrice: 1800.00,
    status: 'aguardando_cotacao',
  },
  {
    id: "item-3",
    requisicaoId: "#REQ-042",
    produto: "MacBook Pro 14\"",
    quantidadeAprovada: 3, // Quantidade original solicitada
    targetPrice: 18500.00,
    status: 'cancelado', // Rejeitado pelo CEO
  },
];

export function PainelCompras({ aoTrocarPerfil }: PainelComprasProps) {
  const { toast } = useToast();
  const [itens] = useState<ItemCotacao[]>(itensMock);

  const itensACotar = itens.filter(i => i.status === 'aguardando_cotacao').length;
  const cotacoesAbertas = itens.filter(i => i.status === 'em_cotacao').length;
  const ordensEmitidas = 12; // Mock

  const handleRegistrarCotacao = (itemId: string) => {
    const item = itens.find(i => i.id === itemId);
    toast({
      title: "Registro de Cotação",
      description: `Abrindo formulário de cotação para: ${item?.produto}`,
    });
  };

  const handleGerarMapaComparativo = () => {
    toast({
      title: "Gerando PDF...",
      description: "Solicitando geração de PDF ao Backend (WeasyPrint)... Arquivo baixado com sucesso.",
      className: "bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Central de Compras
            </h1>
            <p className="text-muted-foreground mt-1">
              Itens aprovados aguardando cotação e emissão de pedido
            </p>
          </div>
          <Button
            variant="outline"
            onClick={aoTrocarPerfil}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Voltar ao Portal
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CardKPICompras
            titulo="Itens a Cotar"
            valor={itensACotar}
            icone={ClipboardCheck}
          />
          <CardKPICompras
            titulo="Cotações em Aberto"
            valor={cotacoesAbertas}
            icone={Clock}
          />
          <CardKPICompras
            titulo="Ordens Emitidas"
            valor={ordensEmitidas}
            icone={Package}
          />
        </div>

        {/* Tabela Principal */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              Fila de Cotação
            </CardTitle>
            <Button
              onClick={handleGerarMapaComparativo}
              className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
            >
              <FileDown className="h-4 w-4" />
              Gerar Mapa Comparativo (PDF)
            </Button>
          </CardHeader>
          <CardContent>
            <TabelaCotacoes
              itens={itens}
              aoRegistrarCotacao={handleRegistrarCotacao}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
