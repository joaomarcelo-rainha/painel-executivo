import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Requisicao } from "@/components/Solicitante/tipos";

interface NotificacaoBellProps {
  contagem: number;
  requisicoesPendentes: Requisicao[];
  aoClicarNotificacao: (requisicaoId?: string) => void;
}

export function NotificacaoBell({ contagem, requisicoesPendentes, aoClicarNotificacao }: NotificacaoBellProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {contagem > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-bold"
            >
              {contagem}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-popover">
        <div className="px-3 py-2 border-b">
          <p className="text-sm font-medium">Notificações</p>
        </div>
        {requisicoesPendentes.length > 0 ? (
          requisicoesPendentes.map((req) => (
            <DropdownMenuItem 
              key={req.id}
              onClick={() => aoClicarNotificacao(req.id)}
              className="cursor-pointer p-3 focus:bg-accent"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                  <span className="text-sm font-medium">Requisição {req.id}</span>
                </div>
                <p className="text-xs text-muted-foreground ml-4">
                  Cotação finalizada. Aguardando sua aprovação.
                </p>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Nenhuma notificação pendente
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
