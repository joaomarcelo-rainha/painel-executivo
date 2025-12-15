import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, FileDown, ClipboardCheck, Clock, Package } from "lucide-react";
import { CardKPICompras } from "./CardKPICompras";
import { TabelaCotacoes } from "./TabelaCotacoes";
import { ModalRegistroCotacao } from "./ModalRegistroCotacao";
import { ItemCotacao } from "./tipos";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
    quantidadeAprovada: 3,
    targetPrice: 18500.00,
    status: 'cancelado',
  },
];

export function PainelCompras({ aoTrocarPerfil }: PainelComprasProps) {
  const { toast } = useToast();
  const [itens, setItens] = useState<ItemCotacao[]>(itensMock);
  const [modalAberto, setModalAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<ItemCotacao | null>(null);
  const [ordensEmitidasCount, setOrdensEmitidasCount] = useState(12);

  const itensACotar = itens.filter(i => i.status === 'aguardando_cotacao').length;
  const cotacoesAbertas = itens.filter(i => i.status === 'em_cotacao' || i.status === 'processando_oc').length;

  const handleRegistrarCotacao = (itemId: string) => {
    const item = itens.find(i => i.id === itemId);
    if (item) {
      setItemSelecionado(item);
      setModalAberto(true);
    }
  };

  const handleFinalizarCotacao = () => {
    if (itemSelecionado) {
      setItens(prev => prev.map(item => 
        item.id === itemSelecionado.id 
          ? { ...item, status: 'processando_oc' as const }
          : item
      ));
      setOrdensEmitidasCount(prev => prev + 1);
    }
  };

  const handleGerarMapaComparativo = () => {
    const doc = new jsPDF();
    
    // Cabeçalho
    doc.setFontSize(18);
    doc.setTextColor(234, 88, 12); // orange-500
    doc.text("Mapa Comparativo de Cotações", 14, 22);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Requisição: #REQ-042", 14, 32);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 14, 40);
    
    // Tabela de cotações
    autoTable(doc, {
      startY: 50,
      head: [['Item', 'Fornecedor', 'Preço Unitário', 'Prazo', 'Status']],
      body: [
        ['Monitor Dell 27"', 'Kalunga', 'R$ 2.550,00', '7 dias', ''],
        ['Monitor Dell 27"', 'Kabum', 'R$ 2.400,00', '5 dias', '✓ VENCEDOR'],
        ['Monitor Dell 27"', 'Amazon', 'R$ 2.600,00', '3 dias', ''],
      ],
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
      columnStyles: {
        4: { fontStyle: 'bold', textColor: [22, 163, 74] },
      },
    });
    
    // Rodapé
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Documento gerado automaticamente pelo Sistema de Compras", 14, pageHeight - 10);
    
    doc.save("mapa_comparativo_req042.pdf");
    
    toast({
      title: "PDF Gerado com Sucesso!",
      description: "O arquivo mapa_comparativo_req042.pdf foi baixado.",
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
