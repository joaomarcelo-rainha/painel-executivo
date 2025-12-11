import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, X } from "lucide-react";

interface BarraDecisaoProps {
  totalItensAprovados: number;
  valorTotalAprovado: string;
  temDeficit: boolean;
  aoRejeitar: () => void;
  aoAprovar: () => void;
}

export function BarraDecisao({
  totalItensAprovados,
  valorTotalAprovado,
  temDeficit,
  aoRejeitar,
  aoAprovar
}: BarraDecisaoProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="text-sm">
          <span className="text-muted-foreground">Resumo: </span>
          <span className="font-semibold text-foreground">
            Aprovar {totalItensAprovados} {totalItensAprovados === 1 ? 'item' : 'itens'} totalizando {valorTotalAprovado}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={aoRejeitar}
            className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="mr-2 h-4 w-4" />
            Rejeitar Tudo
          </Button>
          
          <Button 
            onClick={aoAprovar}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            {temDeficit && (
              <AlertTriangle className="mr-2 h-4 w-4 text-amber-300" />
            )}
            <Check className="mr-2 h-4 w-4" />
            Confirmar Aprovação Executiva
          </Button>
        </div>
      </div>
    </div>
  );
}
