import { CheckCircle, FileSignature, ShoppingCart, Scissors, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventoAuditoria {
  id: number;
  icone: React.ReactNode;
  corIcone: string;
  titulo: string;
  descricao: string;
  usuario: string;
  data: string;
}

const eventosAuditoria: EventoAuditoria[] = [
  {
    id: 1,
    icone: <CheckCircle className="h-4 w-4" />,
    corIcone: "bg-green-500 text-white",
    titulo: "Processo Finalizado e Empenhado",
    descricao: "Nota de Empenho #NE-2025/99 gerada automaticamente.",
    usuario: "Sistema",
    data: "Hoje, 10:05"
  },
  {
    id: 2,
    icone: <FileSignature className="h-4 w-4" />,
    corIcone: "bg-blue-500 text-white",
    titulo: "Ratificação Executiva",
    descricao: "Compra autorizada com saving confirmado de R$ 500,00.",
    usuario: "Diretoria Executiva (CEO)",
    data: "Hoje, 10:00"
  },
  {
    id: 3,
    icone: <ShoppingCart className="h-4 w-4" />,
    corIcone: "bg-orange-500 text-white",
    titulo: "Cotação Concluída",
    descricao: "Vencedor: Kabum (Melhor preço e prazo).",
    usuario: "Dep. Compras",
    data: "Ontem, 16:00"
  },
  {
    id: 4,
    icone: <Scissors className="h-4 w-4" />,
    corIcone: "bg-amber-500 text-white",
    titulo: "Revisão Orçamentária",
    descricao: "Item 'MacBook Pro' alterado: Qtd 3 -> 0. Justificativa: 'Restrição de Liquidez'.",
    usuario: "Diretoria Executiva (CEO)",
    data: "Ontem, 14:00"
  },
  {
    id: 5,
    icone: <User className="h-4 w-4" />,
    corIcone: "bg-gray-400 text-white",
    titulo: "Requisição Criada",
    descricao: "Entrada de demanda inicial.",
    usuario: "Ana Silva (TI)",
    data: "Ontem, 09:30"
  }
];

export function TimelineAuditoria() {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Histórico de Auditoria
      </h3>
      
      <div className="relative">
        {/* Linha vertical conectora */}
        <div className="absolute left-[15px] top-2 h-[calc(100%-16px)] w-[2px] bg-border" />
        
        <div className="space-y-4">
          {eventosAuditoria.map((evento, index) => (
            <div key={evento.id} className="relative flex gap-3">
              {/* Ícone com círculo */}
              <div 
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  evento.corIcone
                )}
              >
                {evento.icone}
              </div>
              
              {/* Conteúdo do evento */}
              <div className="flex-1 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {evento.titulo}
                  </p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {evento.data}
                  </span>
                </div>
                
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {evento.id === 4 ? (
                    <>
                      Item '<strong>MacBook Pro</strong>' alterado: Qtd <strong>3 → 0</strong>. 
                      Justificativa: '<em>Restrição de Liquidez</em>'.
                    </>
                  ) : evento.id === 2 ? (
                    <>
                      Compra autorizada com saving confirmado de <strong>R$ 500,00</strong>.
                    </>
                  ) : (
                    evento.descricao
                  )}
                </p>
                
                <p className="mt-1 text-xs text-muted-foreground/70">
                  por {evento.usuario}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
