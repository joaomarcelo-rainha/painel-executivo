import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { FileCheck } from "lucide-react";

interface Fornecedor {
  id: string;
  nome: string;
  precoUnitario: string;
  prazo: string;
}

interface ModalRegistroCotacaoProps {
  aberto: boolean;
  aoFechar: () => void;
  produto: string;
}

const fornecedoresIniciais: Fornecedor[] = [
  { id: "1", nome: "Kalunga", precoUnitario: "2550.00", prazo: "7" },
  { id: "2", nome: "Kabum", precoUnitario: "2400.00", prazo: "5" },
  { id: "3", nome: "Amazon", precoUnitario: "2600.00", prazo: "3" },
];

export function ModalRegistroCotacao({ aberto, aoFechar, produto }: ModalRegistroCotacaoProps) {
  const { toast } = useToast();
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(fornecedoresIniciais);
  const [vencedorId, setVencedorId] = useState<string>("2");

  const atualizarFornecedor = (id: string, campo: keyof Fornecedor, valor: string) => {
    setFornecedores(prev =>
      prev.map(f => f.id === id ? { ...f, [campo]: valor } : f)
    );
  };

  const handleFinalizarOC = () => {
    const vencedor = fornecedores.find(f => f.id === vencedorId);
    toast({
      title: "Ordem de Compra Emitida!",
      description: `Ordem de Compra #OC-2025/99 emitida para fornecedor ${vencedor?.nome} com sucesso!`,
      className: "bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800",
    });
    aoFechar();
  };

  return (
    <Dialog open={aberto} onOpenChange={aoFechar}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-orange-500" />
            Registro de Preços de Fornecedores
          </DialogTitle>
          <p className="text-muted-foreground text-sm mt-1">
            Insira os preços coletados para: <span className="font-semibold text-foreground">{produto}</span>
          </p>
        </DialogHeader>

        <RadioGroup value={vencedorId} onValueChange={setVencedorId} className="space-y-4 mt-4">
          {fornecedores.map((fornecedor, index) => (
            <div
              key={fornecedor.id}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                vencedorId === fornecedor.id
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
                  : 'border-border hover:border-muted-foreground/30'
              }`}
            >
              <RadioGroupItem value={fornecedor.id} id={`fornecedor-${fornecedor.id}`} />
              
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor={`nome-${fornecedor.id}`} className="text-xs text-muted-foreground">
                    Fornecedor {index + 1}
                  </Label>
                  <Input
                    id={`nome-${fornecedor.id}`}
                    value={fornecedor.nome}
                    onChange={(e) => atualizarFornecedor(fornecedor.id, 'nome', e.target.value)}
                    placeholder="Nome do fornecedor"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor={`preco-${fornecedor.id}`} className="text-xs text-muted-foreground">
                    Preço Unitário (R$)
                  </Label>
                  <Input
                    id={`preco-${fornecedor.id}`}
                    type="number"
                    step="0.01"
                    value={fornecedor.precoUnitario}
                    onChange={(e) => atualizarFornecedor(fornecedor.id, 'precoUnitario', e.target.value)}
                    placeholder="0,00"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor={`prazo-${fornecedor.id}`} className="text-xs text-muted-foreground">
                    Prazo (Dias)
                  </Label>
                  <Input
                    id={`prazo-${fornecedor.id}`}
                    type="number"
                    value={fornecedor.prazo}
                    onChange={(e) => atualizarFornecedor(fornecedor.id, 'prazo', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              {vencedorId === fornecedor.id && (
                <span className="text-xs font-semibold text-orange-600 bg-orange-100 dark:bg-orange-900/50 px-2 py-1 rounded">
                  Vencedor
                </span>
              )}
            </div>
          ))}
        </RadioGroup>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={aoFechar}>
            Cancelar
          </Button>
          <Button
            onClick={handleFinalizarOC}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Finalizar e Gerar Ordem de Compra (OC)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
