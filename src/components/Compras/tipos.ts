export interface ItemCotacao {
  id: string;
  requisicaoId: string;
  produto: string;
  quantidadeAprovada: number;
  targetPrice: number;
  status: 'aguardando_cotacao' | 'em_cotacao' | 'pronto_pedido' | 'processando_oc' | 'cancelado';
  fornecedor?: string;
  precoNegociado?: number;
}

export interface Cotacao {
  id: string;
  itemId: string;
  fornecedor: string;
  preco: number;
  prazoEntrega: string;
  observacoes?: string;
}

export interface OrdemCompra {
  id: string;
  itens: ItemCotacao[];
  fornecedor: string;
  valorTotal: number;
  dataEmissao: Date;
  status: 'emitida' | 'enviada' | 'confirmada';
}
