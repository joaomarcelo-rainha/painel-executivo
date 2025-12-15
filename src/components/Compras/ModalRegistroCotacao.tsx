import { useState, useRef } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { FileCheck, Paperclip, X, FileText } from "lucide-react";

interface Fornecedor {
  id: string;
  nome: string;
  precoUnitario: string;
  frete: string;
  prazo: string;
  condicaoPagamento: string;
  arquivo: File | null;
}

interface ModalRegistroCotacaoProps {
  aberto: boolean;
  aoFechar: () => void;
  produto: string;
  aoFinalizar?: () => void;
}

const condicoesPagamento = [
  { value: "a_vista", label: "À Vista (Pix/Transferência)" },
  { value: "boleto_15", label: "Boleto 15 Dias" },
  { value: "boleto_30_60_90", label: "Boleto 30/60/90 Dias" },
  { value: "cartao", label: "Cartão Corporativo" },
];

const fornecedoresIniciais: Fornecedor[] = [
  { id: "1", nome: "Kalunga", precoUnitario: "2550.00", frete: "150.00", prazo: "7", condicaoPagamento: "boleto_15", arquivo: null },
  { id: "2", nome: "Kabum", precoUnitario: "2400.00", frete: "0", prazo: "5", condicaoPagamento: "a_vista", arquivo: null },
  { id: "3", nome: "Amazon", precoUnitario: "2600.00", frete: "0", prazo: "3", condicaoPagamento: "cartao", arquivo: null },
];

export function ModalRegistroCotacao({ aberto, aoFechar, produto, aoFinalizar }: ModalRegistroCotacaoProps) {
  const { toast } = useToast();
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(fornecedoresIniciais);
  const [vencedorId, setVencedorId] = useState<string>("");
  
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const atualizarFornecedor = (id: string, campo: keyof Fornecedor, valor: string | File | null) => {
    setFornecedores(prev =>
      prev.map(f => f.id === id ? { ...f, [campo]: valor } : f)
    );
  };

  const calcularCustoTotal = (fornecedor: Fornecedor): number => {
    const preco = parseFloat(fornecedor.precoUnitario) || 0;
    const frete = parseFloat(fornecedor.frete) || 0;
    return preco + frete;
  };

  const formatarMoeda = (valor: number): string => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleFileClick = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  const handleFileChange = (id: string, index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    atualizarFornecedor(id, 'arquivo', file);
  };

  const handleRemoveFile = (id: string) => {
    atualizarFornecedor(id, 'arquivo', null);
  };

  const truncateFileName = (name: string, maxLength: number = 20): string => {
    if (name.length <= maxLength) return name;
    const extension = name.split('.').pop();
    const baseName = name.slice(0, maxLength - (extension?.length || 0) - 4);
    return `${baseName}...${extension}`;
  };

  const handleFinalizar = () => {
    if (!vencedorId) {
      toast({
        title: "Selecione um Vencedor",
        description: "É necessário selecionar o fornecedor vencedor antes de finalizar.",
        variant: "destructive",
      });
      return;
    }

    const vencedor = fornecedores.find(f => f.id === vencedorId);
    
    toast({
      title: "Cotação Registrada com Sucesso!",
      description: "Notificação enviada automaticamente para o CEO para ratificação final da compra.",
      duration: 5000,
      className: "bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800",
    });

    aoFinalizar?.();
    aoFechar();
    
    // Reset state
    setVencedorId("");
    setFornecedores(fornecedoresIniciais);
  };

  const handleCancelar = () => {
    setVencedorId("");
    setFornecedores(fornecedoresIniciais);
    aoFechar();
  };

  const vencedor = fornecedores.find(f => f.id === vencedorId);
  const valorTotalVencedor = vencedor ? calcularCustoTotal(vencedor) : 0;

  return (
    <Dialog open={aberto} onOpenChange={handleCancelar}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-500" />
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
              className={`p-4 rounded-lg border transition-colors ${
                vencedorId === fornecedor.id
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
                  : 'border-border hover:border-muted-foreground/30'
              }`}
            >
              {/* Linha Superior - Dados do Custo */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex items-center gap-2 pt-6">
                  <RadioGroupItem value={fornecedor.id} id={`fornecedor-${fornecedor.id}`} />
                  {vencedorId === fornecedor.id && (
                    <span className="text-xs font-semibold text-orange-600 bg-orange-100 dark:bg-orange-900/50 px-2 py-1 rounded whitespace-nowrap">
                      Vencedor
                    </span>
                  )}
                </div>
                
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
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
                    <Label htmlFor={`frete-${fornecedor.id}`} className="text-xs text-muted-foreground">
                      Frete (R$)
                    </Label>
                    <Input
                      id={`frete-${fornecedor.id}`}
                      type="number"
                      step="0.01"
                      value={fornecedor.frete}
                      onChange={(e) => atualizarFornecedor(fornecedor.id, 'frete', e.target.value)}
                      placeholder="0,00"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Custo Total</Label>
                    <div className="h-10 flex items-center px-3 bg-muted/50 rounded-md border">
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {formatarMoeda(calcularCustoTotal(fornecedor))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Linha Inferior - Condições e Anexo */}
              <div className="flex items-end gap-4 pl-10">
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor={`condicao-${fornecedor.id}`} className="text-xs text-muted-foreground">
                      Condição de Pagamento
                    </Label>
                    <Select
                      value={fornecedor.condicaoPagamento}
                      onValueChange={(value) => atualizarFornecedor(fornecedor.id, 'condicaoPagamento', value)}
                    >
                      <SelectTrigger id={`condicao-${fornecedor.id}`}>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {condicoesPagamento.map((condicao) => (
                          <SelectItem key={condicao.value} value={condicao.value}>
                            {condicao.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor={`prazo-${fornecedor.id}`} className="text-xs text-muted-foreground">
                      Prazo de Entrega
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={`prazo-${fornecedor.id}`}
                        type="number"
                        value={fornecedor.prazo}
                        onChange={(e) => atualizarFornecedor(fornecedor.id, 'prazo', e.target.value)}
                        placeholder="0"
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">Dias</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Anexo da Proposta</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        hidden
                        ref={(el) => (fileInputRefs.current[index] = el)}
                        onChange={(e) => handleFileChange(fornecedor.id, index, e)}
                      />
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleFileClick(index)}
                              className={fornecedor.arquivo ? "text-green-600 border-green-300" : ""}
                            >
                              {fornecedor.arquivo ? (
                                <FileCheck className="h-4 w-4" />
                              ) : (
                                <Paperclip className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{fornecedor.arquivo ? "Alterar Proposta" : "Anexar Proposta"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {fornecedor.arquivo && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-950/30 rounded text-sm text-green-700 dark:text-green-400">
                          <span className="truncate max-w-[120px]">
                            {truncateFileName(fornecedor.arquivo.name)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(fornecedor.id)}
                            className="p-0.5 hover:bg-green-100 dark:hover:bg-green-900/50 rounded"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>

        {/* Resumo do Rodapé */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="text-sm">
              {vencedor ? (
                <span>
                  Fornecedor selecionado: <span className="font-semibold text-orange-600">{vencedor.nome}</span>
                </span>
              ) : (
                <span className="text-muted-foreground">Nenhum fornecedor selecionado</span>
              )}
            </div>
            {vencedor && (
              <div className="text-sm">
                Valor total da operação: <span className="font-bold text-green-600">{formatarMoeda(valorTotalVencedor)}</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4 gap-2">
          <Button variant="outline" onClick={handleCancelar}>
            Cancelar
          </Button>
          <Button
            onClick={handleFinalizar}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Finalizar e Gerar Ordem de Compra
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
