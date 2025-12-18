import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, FileDown, ClipboardCheck, Clock, Package, Inbox } from "lucide-react";
import { CardKPICompras } from "./CardKPICompras";
import { TabelaCotacoes } from "./TabelaCotacoes";
import { ModalRegistroCotacao } from "./ModalRegistroCotacao";
import { ItemCotacao } from "./tipos";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PainelComprasProps {
  aoTrocarPerfil: () => void;
}

export function PainelCompras({ aoTrocarPerfil }: PainelComprasProps) {
  const { toast } = useToast();
  const { itensCompras, atualizarItemCompra, finalizarCotacao } = useApp();
  const [modalAberto, setModalAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<ItemCotacao | null>(null);
  const [ordensEmitidasCount, setOrdensEmitidasCount] = useState(0);

  const itensACotar = itensCompras.filter(i => i.status === 'aguardando_cotacao').length;
  const cotacoesAbertas = itensCompras.filter(i => i.status === 'em_cotacao' || i.status === 'processando_oc').length;

  const handleRegistrarCotacao = (itemId: string) => {
    const item = itensCompras.find(i => i.id === itemId);
    if (item) {
      setItemSelecionado(item);
      setModalAberto(true);
    }
  };

  const handleFinalizarCotacao = () => {
    if (itemSelecionado) {
      atualizarItemCompra(itemSelecionado.id, { status: 'processando_oc' });
      finalizarCotacao(itemSelecionado.requisicaoId);
      setOrdensEmitidasCount(prev => prev + 1);
    }
  };

  const handleGerarMapaComparativo = () => {
    if (itensCompras.length === 0) {
      toast({
        title: "Sem itens para exportar",
        description: "Não há itens na fila de cotação.",
        variant: "destructive",
      });
      return;
    }

    const doc = new jsPDF();
    
    // Cabeçalho
    doc.setFontSize(18);
    doc.setTextColor(234, 88, 12); // orange-500
    doc.text("Mapa Comparativo de Cotações", 14, 22);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 14, 32);
    
    // Tabela de cotações
    autoTable(doc, {
      startY: 42,
      head: [['Item', 'Qtd', 'Target Price', 'Status']],
      body: itensCompras.map(item => [
        item.produto,
        item.quantidadeAprovada.toString(),
        `R$ ${item.targetPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        item.status,
      ]),
      headStyles: {
        fillColor: [234, 88, 12],
        textColor: 255,
        fontStyle: 'bold',
      },
      bodyStyles: {
        textColor: 50,
      },
      alternateRowStyles: {
        fillColor: [255, 247, 237],
      },
    });
    
    // Rodapé
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Documento gerado automaticamente pelo Sistema de Compras", 14, pageHeight - 10);
    
    doc.save("mapa_comparativo.pdf");
    
    toast({
      title: "PDF Gerado com Sucesso!",
      description: "O arquivo mapa_comparativo.pdf foi baixado.",
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
            valor={ordensEmitidasCount}
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
              disabled={itensCompras.length === 0}
            >
              <FileDown className="h-4 w-4" />
              Gerar Mapa Comparativo (PDF)
            </Button>
          </CardHeader>
          <CardContent>
            {itensCompras.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                  <Inbox className="h-8 w-8 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhum item na fila
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Aguardando aprovação de requisições pelo CEO. Itens aprovados aparecerão aqui automaticamente.
                </p>
              </div>
            ) : (
              <TabelaCotacoes
                itens={itensCompras}
                aoRegistrarCotacao={handleRegistrarCotacao}
              />
            )}
          </CardContent>
        </Card>

        {/* Modal de Registro de Cotação */}
        <ModalRegistroCotacao
          aberto={modalAberto}
          aoFechar={() => setModalAberto(false)}
          produto={itemSelecionado?.produto || ""}
          aoFinalizar={handleFinalizarCotacao}
        />
      </div>
    </div>
  );
}
