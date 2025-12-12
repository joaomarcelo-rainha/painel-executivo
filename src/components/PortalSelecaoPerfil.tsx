import { Briefcase, Landmark, UserPlus, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export type PerfilUsuario = 'ceo' | 'financeiro' | 'solicitante' | 'compras' | null;

interface PerfilConfig {
  id: PerfilUsuario;
  titulo: string;
  descricao: string;
  icone: React.ReactNode;
  corIcone: string;
}

const perfis: PerfilConfig[] = [
  {
    id: 'ceo',
    titulo: 'Diretoria Executiva (CEO)',
    descricao: 'Aprovação de requisições, Dashboard de KPIs e Matriz de Decisão.',
    icone: <Briefcase className="h-10 w-10" />,
    corIcone: 'text-primary'
  },
  {
    id: 'financeiro',
    titulo: 'Gestão Financeira',
    descricao: 'Lançamento de disponibilidade de caixa e controle de liquidez.',
    icone: <Landmark className="h-10 w-10" />,
    corIcone: 'text-emerald-500'
  },
  {
    id: 'solicitante',
    titulo: 'Solicitante (Áreas)',
    descricao: 'Criação de novas demandas e acompanhamento de status.',
    icone: <UserPlus className="h-10 w-10" />,
    corIcone: 'text-violet-500'
  },
  {
    id: 'compras',
    titulo: 'Compras (Procurement)',
    descricao: 'Cotação com fornecedores e emissão de Ordens de Compra.',
    icone: <ShoppingCart className="h-10 w-10" />,
    corIcone: 'text-orange-500'
  }
];

interface PortalSelecaoPerfilProps {
  aoSelecionarPerfil: (perfil: PerfilUsuario) => void;
}

export function PortalSelecaoPerfil({ aoSelecionarPerfil }: PortalSelecaoPerfilProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Cabeçalho */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Sistema de Compras Estratégicas
          </h1>
          <p className="text-muted-foreground">
            Selecione seu perfil de acesso para continuar
          </p>
        </div>

        {/* Grid de Cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {perfis.map((perfil) => (
            <Card
              key={perfil.id}
              onClick={() => aoSelecionarPerfil(perfil.id)}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary hover:-translate-y-1 group"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`${perfil.corIcone} transition-transform group-hover:scale-110`}>
                    {perfil.icone}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold text-foreground mb-1">
                      {perfil.titulo}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {perfil.descricao}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Rodapé */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Versão Demo • Dados Simulados
        </p>
      </div>
    </div>
  );
}
