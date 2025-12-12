import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Requisicao } from "./tipos";
import { CheckCircle, Circle, Clock } from "lucide-react";

interface CardRequisicaoProps {
  requisicao: Requisicao;
}

const statusConfig: Record<Requisicao['status'], { label: string; className: string }> = {
  rascunho: { label: "Rascunho", className: "bg-muted text-muted-foreground" },
  aguardando_aprovacao: { label: "Aguardando Aprovação", className: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300" },
  em_analise: { label: "Em Análise", className: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" },
  aprovado_parcial: { label: "Aprovado Parcialmente", className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  aprovado: { label: "Aprovado", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" },
  rejeitado: { label: "Rejeitado", className: "bg-destructive/10 text-destructive" },
};

const etapas = ["Envio", "CEO", "Compras", "Entrega"];

export function CardRequisicao({ requisicao }: CardRequisicaoProps) {
  const statusInfo = statusConfig[requisicao.status];
  const progressoPercentual = ((requisicao.etapaAtual + 1) / etapas.length) * 100;

  return (
    <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-violet-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">{requisicao.titulo}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {requisicao.dataCriacao}, {requisicao.horaCriacao}
            </p>
          </div>
          <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Valor Estimado</span>
          <span className="text-xl font-bold text-foreground">
            {requisicao.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>

        {/* Barra de Progresso Visual */}
        <div className="space-y-2">
          <Progress value={progressoPercentual} className="h-2 bg-violet-100 [&>div]:bg-violet-500" />
          <div className="flex justify-between">
            {etapas.map((etapa, index) => {
              const isCompleted = index < requisicao.etapaAtual;
              const isCurrent = index === requisicao.etapaAtual;
              
              return (
                <div key={etapa} className="flex flex-col items-center gap-1">
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-violet-600" />
                  ) : isCurrent ? (
                    <Clock className="h-4 w-4 text-violet-500 animate-pulse" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground/40" />
                  )}
                  <span className={`text-xs ${isCurrent ? 'text-violet-600 font-medium' : 'text-muted-foreground'}`}>
                    {etapa}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
