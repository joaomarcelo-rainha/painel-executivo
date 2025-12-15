import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, TrendingDown, CreditCard } from "lucide-react";

interface ModalRatificacaoProps {
  aberto: boolean;
  aoFechar: () => void;
  aoConcluir: () => void;
}

export function ModalRatificacao({ aberto, aoFechar, aoConcluir }: ModalRatificacaoProps) {
  const [ratificado, setRatificado] = useState(false);

  const orcamentoAutorizado = 12500;
  const melhorOferta = 12000;
  const economia = orcamentoAutorizado - melhorOferta;

  const aoAssinar = () => {
    if (!ratificado) {
      toast({
        title: "Ação necessária",
        description: "Você precisa ratificar os valores antes de assinar.",
        variant: "destructive",
      });
      return;
    }

    // Dispara confetes via CSS animation
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.backgroundColor = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 4)];
      confettiContainer.appendChild(confetti);
    }

    setTimeout(() => confettiContainer.remove(), 4000);

    toast({
      title: "🎉 Processo #REQ-042 Concluído com Sucesso!",
      description: "A ordem de compra foi autorizada e encaminhada para emissão da Nota de Empenho.",
      duration: 6000,
    });

    aoConcluir();
    aoFechar();
    setRatificado(false);
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <Dialog open={aberto} onOpenChange={aoFechar}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Autorização Final de Compra</DialogTitle>
          <DialogDescription>
            Confira os valores negociados antes da emissão da Nota de Empenho.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Comparativo lado a lado */}
          <div className="grid grid-cols-2 gap-4">
            {/* Coluna Esquerda - Orçamento Autorizado */}
            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Orçamento Autorizado</h4>
              <p className="text-2xl font-bold text-foreground">{formatarMoeda(orcamentoAutorizado)}</p>
              <p className="text-xs text-muted-foreground">5 Monitores x R$ 2.500,00 (estimado)</p>
            </div>

            {/* Coluna Direita - Melhor Oferta */}
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4 space-y-2">
              <h4 className="text-sm font-medium text-green-600">Melhor Oferta (Kabum)</h4>
              <p className="text-2xl font-bold text-green-600">{formatarMoeda(melhorOferta)}</p>
              <p className="text-xs text-muted-foreground">5 Monitores x R$ 2.400,00 (negociado)</p>
              <div className="flex items-center gap-1.5 mt-2">
                <CreditCard className="h-3.5 w-3.5 text-green-600" />
                <span className="text-xs font-medium text-green-600">Boleto 30/60/90 Dias</span>
              </div>
            </div>
          </div>

          {/* Banner de Economia */}
          <div className="flex items-center justify-center gap-3 rounded-lg bg-green-500/10 border border-green-500/30 p-4">
            <TrendingDown className="h-5 w-5 text-green-600" />
            <span className="text-base font-semibold text-green-600">
              Economia Adicional (Saving) de {formatarMoeda(economia)} confirmada!
            </span>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>

          {/* Checkbox de Ratificação */}
          <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
            <Checkbox 
              id="ratificar" 
              checked={ratificado}
              onCheckedChange={(checked) => setRatificado(checked === true)}
              className="mt-0.5"
            />
            <label 
              htmlFor="ratificar" 
              className="text-sm leading-relaxed cursor-pointer"
            >
              <span className="font-medium">Ratifico os valores apresentados</span> e autorizo a emissão 
              da ordem de compra ao fornecedor selecionado, conforme as condições negociadas.
            </label>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={aoFechar}>
            Cancelar
          </Button>
          <Button 
            onClick={aoAssinar}
            disabled={!ratificado}
            className="bg-primary hover:bg-primary/90"
          >
            Assinar Digitalmente e Finalizar Processo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
