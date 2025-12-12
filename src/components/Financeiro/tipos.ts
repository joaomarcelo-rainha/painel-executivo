export interface PrevisaoCaixa {
  id: string;
  periodoInicio: string;
  periodoFim: string;
  responsavel: string;
  valor: number;
  status: 'confirmado' | 'projetado';
  centroCusto: 'geral' | 'tesouraria';
}

export interface FormPrevisao {
  dataInicio: Date | undefined;
  dataFim: Date | undefined;
  valor: string;
  centroCusto: 'geral' | 'tesouraria';
}
