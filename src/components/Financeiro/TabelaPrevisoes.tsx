import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PrevisaoCaixa } from "./tipos";

interface TabelaPrevisoesProps {
  previsoes: PrevisaoCaixa[];
}

export function TabelaPrevisoes({ previsoes }: TabelaPrevisoesProps) {
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const totalGeral = previsoes.reduce((acc, p) => acc + p.valor, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Previsões Vigentes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Período</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead className="text-right">Valor (R$)</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {previsoes.map((previsao) => (
              <TableRow key={previsao.id}>
                <TableCell className="font-medium">
                  {previsao.periodoInicio} a {previsao.periodoFim}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {previsao.responsavel}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatarMoeda(previsao.valor)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant={previsao.status === 'confirmado' ? 'default' : 'secondary'}
                    className={previsao.status === 'confirmado' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                  >
                    {previsao.status === 'confirmado' ? 'Confirmado' : 'Projetado'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Totalizador */}
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <span className="text-sm font-medium text-muted-foreground">
            Total Disponível no Período
          </span>
          <span className="text-lg font-bold text-emerald-600">
            {formatarMoeda(totalGeral)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
