import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Wallet, AlertTriangle } from "lucide-react";
import { MetricaGlobal } from "./tipos";

interface MetricasSaudeProps {
  metricas: MetricaGlobal;
}

const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

export function MetricasSaude({ metricas }: MetricasSaudeProps) {
  const deficit = metricas.filaPendente - metricas.disponibilidadeGlobal;
  const temDeficit = deficit > 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Fila de Aprovação */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Fila de Aprovação
              </p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {formatarMoeda(metricas.filaPendente)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {metricas.totalRequisicoes} Requisições
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disponibilidade Global */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Disponibilidade Global (Mês)
              </p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {formatarMoeda(metricas.disponibilidadeGlobal)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Caixa disponível
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Geral */}
      <Card className={`border-border ${temDeficit ? 'bg-destructive/10' : 'bg-primary/10'}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Status Geral
              </p>
              {temDeficit ? (
                <>
                  <p className="mt-2 text-2xl font-bold text-destructive">
                    Déficit Projetado: {formatarMoeda(deficit)}
                  </p>
                  <p className="mt-1 text-sm font-medium text-destructive">
                    Ação Necessária
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-2 text-2xl font-bold text-primary">
                    Fluxo Saudável
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Dentro do orçamento
                  </p>
                </>
              )}
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${temDeficit ? 'bg-destructive/20' : 'bg-primary/20'}`}>
              <AlertTriangle className={`h-6 w-6 ${temDeficit ? 'text-destructive' : 'text-primary'}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
