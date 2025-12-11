import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { RequisicaoPendente } from "./tipos";

interface TabelaRequisicoesProps {
  requisicoes: RequisicaoPendente[];
  aoAnalisarDetalhes: (requisicaoId: string) => void;
}

const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

const obterCorDepartamento = (depto: string): string => {
  const cores: Record<string, string> = {
    'Tecnologia': 'bg-primary/20 text-primary border-primary/30',
    'Marketing': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
    'RH': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    'Operações': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
  };
  return cores[depto] || 'bg-muted text-muted-foreground';
};

const obterIniciaisNome = (nome: string): string => {
  return nome
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export function TabelaRequisicoes({ requisicoes, aoAnalisarDetalhes }: TabelaRequisicoesProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">
          Fila de Trabalho Inteligente
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Solicitante</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
              <TableHead>Status Financeiro</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requisicoes.map((req) => (
              <TableRow key={req.id} className="group">
                <TableCell className="font-mono text-sm font-medium">
                  {req.id}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={obterCorDepartamento(req.depto)}
                  >
                    {req.depto}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                        {obterIniciaisNome(req.solicitante)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{req.solicitante}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatarMoeda(req.valor)}
                </TableCell>
                <TableCell>
                  {req.statusCaixa === 'risco' ? (
                    <Badge variant="destructive" className="font-normal">
                      Risco de Liquidez
                    </Badge>
                  ) : (
                    <Badge className="bg-primary/20 text-primary border-primary/30 font-normal">
                      Fluxo Saudável
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => aoAnalisarDetalhes(req.id)}
                    className="opacity-70 transition-opacity group-hover:opacity-100"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Analisar Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
