export interface ItemRequisicao {
  id: string;
  produto: string;
  quantidade: number;
  precoUnitario: number;
}

export interface Requisicao {
  id: string;
  titulo: string;
  justificativa: string;
  centroCusto: string;
  itens: ItemRequisicao[];
  valorTotal: number;
  status: 'rascunho' | 'aguardando_aprovacao' | 'em_analise' | 'aprovado_parcial' | 'aprovado' | 'aguardando_ratificacao' | 'rejeitado';
  etapaAtual: number; // 0: Envio, 1: CEO, 2: Compras, 3: Entrega
  dataCriacao: string;
  horaCriacao: string;
}

export interface FormNovaRequisicao {
  titulo: string;
  justificativa: string;
  centroCusto: string;
  itens: ItemRequisicao[];
}
