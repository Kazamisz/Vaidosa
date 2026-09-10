export interface Produto {
  id: string;
  titulo: string;
  categoria: string;
  ambiente: string;
  descricao_curta: string;
  descricao_comercial: string;
  imagens: string[];
  palavras_chave: string[];
  confidence: number;
  needs_review: boolean;
}

export interface CartItem {
  id: string;
  quantity: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  suggestedProductIds?: string[];
  timestamp: string;
}

export type CategoryFilter = string;
