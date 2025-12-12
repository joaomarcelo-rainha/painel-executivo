import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ClipboardList } from "lucide-react";
import { ItemCotacao } from "./tipos";

interface TabelaCotacoesProps {
  itens: ItemCotacao[];
  aoRegistrarCotacao: (itemId: string) => void;
}

const statusLabels: Record<ItemCotacao['status'], string> = {
  aguardando_cotacao: 'Aguardando Cotação',
  em_cotacao: 'Em Cotação',
  pronto_pedido: 'Pronto para Pedido',
  cancelado: 'Cancelado',
};

const statusVariants: Record<ItemCotacao['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
  aguardando_cotacao: 'secondary',
  em_cotacao: 'default',
  pronto_pedido: 'outline',
  cancelado: 'destructive',
};

export function TabelaCotacoes({ itens, aoRegistrarCotacao }: TabelaCotacoesProps) {
  const itensAtivos = itens.filter(item => item.status !== 'cancelado');
  const itensCancelados = itens.filter(item => item.status === 'cancelado');

  return (
    <div className="space-y-6">
      {/* Tabela Principal - Itens Aprovados */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-orange-50 dark:bg-orange-950/30">
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Requisição</TableHead>
              <TableHead className="font-semibold">Produto</TableHead>
              <TableHead className="font-semibold text-center">Qtd. Aprovada</TableHead>
              <TableHead className="font-semibold text-right">Target Price</TableHead>
              <TableHead className="font-semibold text-center">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itensAtivos.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/50">
                <TableCell>
                  <Badge 
                    variant={statusVariants[item.status]}
                    className={item.status === 'aguardando_cotacao' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' : ''}
                  >
                    {statusLabels[item.status]}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {item.requisicaoId}
                </TableCell>
                <TableCell className="font-medium">{item.produto}</TableCell>
                <TableCell className="text-center font-semibold">
                  {item.quantidadeAprovada}
                </TableCell>
                <TableCell className="text-right">
                  {item.targetPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => aoRegistrarCotacao(item.id)}
                    className="text-orange-600 border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/30"
                  >
                    <ClipboardList className="h-4 w-4 mr-1" />
                    Registrar Cotação
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Lista de Itens Cancelados */}
      {itensCancelados.length > 0 && (
        <div className="rounded-lg border border-destructive/30 overflow-hidden">
          <div className="bg-destructive/10 px-4 py-2 border-b border-destructive/30">
            <h4 className="font-semibold text-destructive flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Itens Cancelados pela Diretoria
            </h4>
          </div>
          <Table>
            <TableBody>
              {itensCancelados.map((item) => (
                <TableRow key={item.id} className="bg-muted/30 text-muted-foreground">
                  <TableCell>
                    <Badge variant="destructive">Cancelado</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {item.requisicaoId}
                  </TableCell>
                  <TableCell>{item.produto}</TableCell>
                  <TableCell className="text-center line-through">
                    {item.quantidadeAprovada}
                  </TableCell>
                  <TableCell className="text-right line-through">
                    {item.targetPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </TableCell>
                  <TableCell className="text-center text-sm italic">
                    Rejeitado
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
