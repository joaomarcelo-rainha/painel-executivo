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
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Send, Check, ChevronsUpDown } from "lucide-react";
import { ItemRequisicao } from "./tipos";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const centrosCusto = [
  { value: "ti", label: "Tecnologia (TI)" },
  { value: "mkt", label: "Marketing (MKT)" },
  { value: "rh", label: "Recursos Humanos (RH)" },
  { value: "ops", label: "Operações" },
  { value: "log", label: "Logística & Supply Chain" },
  { value: "jur", label: "Jurídico & Compliance" },
  { value: "pd", label: "Pesquisa & Desenvolvimento (P&D)" },
  { value: "com", label: "Comercial & Vendas" },
  { value: "fin", label: "Financeiro & Controladoria" },
];

interface FormularioRequisicaoProps {
  aberto: boolean;
  aoFechar: () => void;
  aoEnviar: (dados: {
    titulo: string;
    justificativa: string;
    centroCusto: string;
    itens: ItemRequisicao[];
  }) => void;
}

// Funções de formatação de moeda
const formatarMoeda = (valor: number): string => {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const parseMoedaInput = (valorDigitado: string): number => {
  // Remove tudo exceto números
  const apenasNumeros = valorDigitado.replace(/\D/g, '');
  // Converte para centavos (divide por 100)
  return parseInt(apenasNumeros || '0', 10) / 100;
};

const formatarInputMoeda = (valor: number): string => {
  if (valor === 0) return '';
  return formatarMoeda(valor);
};

export function FormularioRequisicao({ aberto, aoFechar, aoEnviar }: FormularioRequisicaoProps) {
  const { toast } = useToast();
  const [titulo, setTitulo] = useState("");
  const [justificativa, setJustificativa] = useState("");
  const [centroCusto, setCentroCusto] = useState("");
  const [itens, setItens] = useState<ItemRequisicao[]>([]);
  const [comboboxAberto, setComboboxAberto] = useState(false);

  const adicionarItem = () => {
    const novoItem: ItemRequisicao = {
      id: `item-${Date.now()}`,
      produto: "",
      quantidade: 1,
      precoUnitario: 0,
    };
    setItens([...itens, novoItem]);
  };

  const atualizarItem = (id: string, campo: keyof ItemRequisicao, valor: string | number) => {
    setItens(itens.map(item => 
      item.id === id ? { ...item, [campo]: valor } : item
    ));
  };

  const removerItem = (id: string) => {
    setItens(itens.filter(item => item.id !== id));
  };

  const totalEstimado = itens.reduce((acc, item) => acc + (item.quantidade * item.precoUnitario), 0);

  const handleEnviar = () => {
    if (!titulo || !justificativa || !centroCusto) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos do cabeçalho.",
        variant: "destructive",
      });
      return;
    }

    if (itens.length === 0) {
      toast({
        title: "Adicione itens",
        description: "A requisição precisa ter pelo menos um item.",
        variant: "destructive",
      });
      return;
    }

    aoEnviar({ titulo, justificativa, centroCusto, itens });
    
    // Reset form
    setTitulo("");
    setJustificativa("");
    setCentroCusto("");
    setItens([]);
    aoFechar();
  };

  return (
    <Dialog open={aberto} onOpenChange={aoFechar}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-violet-700 dark:text-violet-400">
            Nova Requisição de Compra
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Passo 1: Cabeçalho */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <span className="bg-violet-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              Informações do Pedido
            </h3>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="titulo">Título da Requisição</Label>
                <Input
                  id="titulo"
                  placeholder="Ex: Equipamentos para novos desenvolvedores"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="justificativa">Justificativa</Label>
                <Textarea
                  id="justificativa"
                  placeholder="Explique a necessidade desta compra..."
                  value={justificativa}
                  onChange={(e) => setJustificativa(e.target.value)}
                  className="mt-1 min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="centroCusto">Centro de Custo</Label>
                <Popover open={comboboxAberto} onOpenChange={setComboboxAberto}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={comboboxAberto}
                      className="w-full mt-1 justify-between font-normal"
                    >
                      {centroCusto
                        ? centrosCusto.find((cc) => cc.value === centroCusto)?.label
                        : "Pesquise ou selecione..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar centro de custo..." />
                      <CommandList>
                        <CommandEmpty>Nenhum centro encontrado.</CommandEmpty>
                        <CommandGroup>
                          {centrosCusto.map((cc) => (
                            <CommandItem
                              key={cc.value}
                              value={cc.label}
                              onSelect={() => {
                                setCentroCusto(cc.value);
                                setComboboxAberto(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  centroCusto === cc.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {cc.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Passo 2: Itens */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <span className="bg-violet-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                Itens da Requisição
              </h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={adicionarItem}
                className="text-violet-600 border-violet-300 hover:bg-violet-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Item
              </Button>
            </div>

            {itens.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center text-muted-foreground">
                  <p>Nenhum item adicionado.</p>
                  <p className="text-sm">Clique em "Adicionar Item" para começar.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {itens.map((item, index) => (
                  <Card key={item.id} className="border-violet-200">
                    <CardContent className="py-3">
                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <Label className="text-xs">Produto</Label>
                          <Input
                            placeholder="Ex: Cabo HDMI 5 metros"
                            value={item.produto}
                            onChange={(e) => atualizarItem(item.id, 'produto', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="w-24">
                          <Label className="text-xs">Qtd.</Label>
                          <Input
                            type="number"
                            min={1}
                            value={item.quantidade}
                            onChange={(e) => atualizarItem(item.id, 'quantidade', parseInt(e.target.value) || 1)}
                            className="mt-1"
                          />
                        </div>
                        <div className="w-36">
                          <Label className="text-xs">Preço Unit.</Label>
                          <Input
                            placeholder="R$ 0,00"
                            value={formatarInputMoeda(item.precoUnitario)}
                            onChange={(e) => {
                              const valorNumerico = parseMoedaInput(e.target.value);
                              atualizarItem(item.id, 'precoUnitario', valorNumerico);
                            }}
                            className="mt-1 [appearance:textfield]"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removerItem(item.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3 border-t pt-4">
          <div className="flex-1 text-left">
            <p className="text-sm text-muted-foreground">Total Estimado</p>
            <p className="text-2xl font-bold text-violet-600">
              {totalEstimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={aoFechar}>
              Cancelar
            </Button>
            <Button 
              onClick={handleEnviar}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar para Aprovação
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
