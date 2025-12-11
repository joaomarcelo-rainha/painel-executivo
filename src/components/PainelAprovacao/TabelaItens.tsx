import { ItemRequisicao } from "./tipos";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Laptop, Monitor, Armchair, FileCode } from "lucide-react";

interface TabelaItensProps {
  itens: ItemRequisicao[];
  aoAlterarQuantidade: (id: number, novaQuantidade: number) => void;
  aoAlterarObservacao: (id: number, novaObservacao: string) => void;
}

const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

const obterIconeCategoria = (categoria: ItemRequisicao['categoria']) => {
  const icones = {
    hardware: Laptop,
    mobiliario: Armchair,
    software: FileCode
  };
  const Icone = icones[categoria] || Laptop;
  return <Icone className="h-5 w-5 text-muted-foreground" />;
};

export function TabelaItens({ itens, aoAlterarQuantidade, aoAlterarObservacao }: TabelaItensProps) {
  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[280px]">Produto</TableHead>
            <TableHead className="text-right">Preço Unit.</TableHead>
            <TableHead className="text-center">Qtd. Solicitada</TableHead>
            <TableHead className="text-center">Qtd. Aprovada</TableHead>
            <TableHead className="text-right">Subtotal</TableHead>
            <TableHead className="w-[200px]">Ressalvas/Notas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itens.map((item) => {
            const foiAlterado = item.qtdAprovada < item.qtdSolicitada;
            const foiRejeitado = item.qtdAprovada === 0;
            const subtotal = item.precoUnitario * item.qtdAprovada;
            
            return (
              <TableRow 
                key={item.id}
                className={cn(
                  "transition-opacity duration-200",
                  foiRejeitado && "opacity-50"
                )}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      {obterIconeCategoria(item.categoria)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.produto}</p>
                      <p className="text-xs text-muted-foreground">{item.sku}</p>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="text-right font-mono text-sm">
                  {formatarMoeda(item.precoUnitario)}
                </TableCell>
                
                <TableCell className="text-center">
                  <div className="inline-flex h-9 w-16 items-center justify-center rounded-md bg-muted text-sm font-medium">
                    {item.qtdSolicitada}
                  </div>
                </TableCell>
                
                <TableCell className="text-center">
                  <Input
                    type="number"
                    min={0}
                    max={item.qtdSolicitada}
                    value={item.qtdAprovada}
                    onChange={(e) => {
                      const valor = Math.max(0, Math.min(item.qtdSolicitada, parseInt(e.target.value) || 0));
                      aoAlterarQuantidade(item.id, valor);
                    }}
                    className={cn(
                      "w-20 text-center font-medium mx-auto",
                      foiAlterado && !foiRejeitado && "border-amber-400 focus-visible:ring-amber-400",
                      foiRejeitado && "border-destructive/50"
                    )}
                  />
                </TableCell>
                
                <TableCell className="text-right">
                  <span className={cn(
                    "font-mono text-sm font-semibold",
                    foiRejeitado && "text-muted-foreground line-through"
                  )}>
                    {formatarMoeda(subtotal)}
                  </span>
                </TableCell>
                
                <TableCell>
                  <Input
                    type="text"
                    placeholder="Adicionar nota..."
                    value={item.observacao}
                    onChange={(e) => aoAlterarObservacao(item.id, e.target.value)}
                    className="text-sm"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
