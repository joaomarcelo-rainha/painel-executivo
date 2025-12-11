// Tipos para o Painel de Aprovação do CEO

export interface ItemRequisicao {
  id: number;
  produto: string;
  categoria: 'hardware' | 'mobiliario' | 'software';
  sku: string;
  precoUnitario: number;
  qtdSolicitada: number;
  qtdAprovada: number;
  observacao: string;
}

export interface DadosFinanceiros {
  disponibilidadeCaixa: number;
  dataVencimento: string;
}
