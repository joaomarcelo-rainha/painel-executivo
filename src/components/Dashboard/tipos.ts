// Tipos para o Dashboard Executivo

export interface RequisicaoPendente {
  id: string;
  depto: 'Tecnologia' | 'Marketing' | 'RH' | 'Operações';
  solicitante: string;
  valor: number;
  statusCaixa: 'risco' | 'ok';
  data: string;
}

export interface MetricaGlobal {
  filaPendente: number;
  totalRequisicoes: number;
  disponibilidadeGlobal: number;
}

export interface DemandaCentroCusto {
  nome: string;
  valor: number;
  percentual: number;
  cor: string;
}

export interface DesembolsoSemanal {
  semana: string;
  previsto: number;
  realizavel: number;
}
