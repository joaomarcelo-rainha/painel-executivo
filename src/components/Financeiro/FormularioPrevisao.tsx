import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FormPrevisao } from "./tipos";

interface FormularioPrevisaoProps {
  aoLancar: (dados: FormPrevisao) => void;
}

export function FormularioPrevisao({ aoLancar }: FormularioPrevisaoProps) {
  const { toast } = useToast();
  const [dataInicio, setDataInicio] = useState<Date>();
  const [dataFim, setDataFim] = useState<Date>();
  const [valor, setValor] = useState("");
  const [centroCusto, setCentroCusto] = useState<'geral' | 'tesouraria'>('geral');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dataInicio || !dataFim || !valor) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o período e o valor disponível.",
        variant: "destructive"
      });
      return;
    }

    aoLancar({ dataInicio, dataFim, valor, centroCusto });
    
    // Limpar formulário
    setDataInicio(undefined);
    setDataFim(undefined);
    setValor("");
    setCentroCusto('geral');

    toast({
      title: "Previsão lançada",
      description: "A disponibilidade de caixa foi registrada com sucesso.",
    });
  };

  const formatarValorInput = (value: string) => {
    const numero = value.replace(/\D/g, '');
    if (!numero) return '';
    const valorNumerico = parseInt(numero, 10) / 100;
    return valorNumerico.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  };

  return (
    <Card className="border-emerald-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-emerald-500" />
          Nova Previsão de Caixa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Período */}
          <div className="space-y-2">
            <Label>Período</Label>
            <div className="grid grid-cols-2 gap-3">
              {/* Data Início */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !dataInicio && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataInicio ? format(dataInicio, "dd/MM/yyyy", { locale: ptBR }) : "Início"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataInicio}
                    onSelect={setDataInicio}
                    initialFocus
                    className="pointer-events-auto"
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>

              {/* Data Fim */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !dataFim && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataFim ? format(dataFim, "dd/MM/yyyy", { locale: ptBR }) : "Fim"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataFim}
                    onSelect={setDataFim}
                    initialFocus
                    className="pointer-events-auto"
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Valor */}
          <div className="space-y-2">
            <Label htmlFor="valor">Valor Disponível (R$)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                R$
              </span>
              <Input
                id="valor"
                type="text"
                placeholder="0,00"
                value={valor}
                onChange={(e) => setValor(formatarValorInput(e.target.value))}
                className="pl-10 text-lg font-semibold"
              />
            </div>
          </div>

          {/* Centro de Custo */}
          <div className="space-y-2">
            <Label>Centro de Custo</Label>
            <Select value={centroCusto} onValueChange={(v) => setCentroCusto(v as 'geral' | 'tesouraria')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="geral">Geral</SelectItem>
                <SelectItem value="tesouraria">Tesouraria</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botão */}
          <Button 
            type="submit" 
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            Lançar Previsão
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
