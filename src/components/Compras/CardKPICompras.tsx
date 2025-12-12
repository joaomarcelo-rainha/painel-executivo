import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CardKPIComprasProps {
  titulo: string;
  valor: number;
  icone: LucideIcon;
}

export function CardKPICompras({ titulo, valor, icone: Icone }: CardKPIComprasProps) {
  return (
    <Card className="border-orange-200 dark:border-orange-800">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
          <Icone className="h-6 w-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{titulo}</p>
          <p className="text-2xl font-bold text-foreground">{valor}</p>
        </div>
      </CardContent>
    </Card>
  );
}
