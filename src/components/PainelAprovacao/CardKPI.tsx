import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";

interface CardKPIProps {
  titulo: string;
  valor: string;
  variante?: 'neutro' | 'destaque' | 'economia' | 'semaforo';
  semaforoStatus?: 'saudavel' | 'deficit';
  icone?: React.ReactNode;
}

export function CardKPI({ 
  titulo, 
  valor, 
  variante = 'neutro', 
  semaforoStatus,
  icone 
}: CardKPIProps) {
  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg",
      variante === 'destaque' && "border-primary/50 bg-primary/5"
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{titulo}</p>
            <p className={cn(
              "text-2xl font-bold tracking-tight",
              variante === 'economia' && "text-emerald-600",
              variante === 'destaque' && "text-foreground",
              variante === 'neutro' && "text-muted-foreground"
            )}>
              {valor}
            </p>
            
            {variante === 'semaforo' && semaforoStatus && (
              <Badge 
                variant={semaforoStatus === 'saudavel' ? 'default' : 'destructive'}
                className={cn(
                  "mt-2 text-xs font-medium",
                  semaforoStatus === 'saudavel' 
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" 
                    : "bg-destructive/10 text-destructive hover:bg-destructive/10"
                )}
              >
                {semaforoStatus === 'saudavel' ? (
                  <><CheckCircle className="mr-1 h-3 w-3" /> Fluxo Saudável</>
                ) : (
                  <><AlertTriangle className="mr-1 h-3 w-3" /> Déficit de Caixa - Risco de Liquidez</>
                )}
              </Badge>
            )}
          </div>
          
          <div className={cn(
            "rounded-full p-2",
            variante === 'economia' && "bg-emerald-100 text-emerald-600",
            variante === 'destaque' && "bg-primary/10 text-primary",
            variante === 'neutro' && "bg-muted text-muted-foreground",
            variante === 'semaforo' && semaforoStatus === 'saudavel' && "bg-emerald-100 text-emerald-600",
            variante === 'semaforo' && semaforoStatus === 'deficit' && "bg-destructive/10 text-destructive"
          )}>
            {icone || <DollarSign className="h-5 w-5" />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
