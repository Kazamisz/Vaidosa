import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, MessageCircle } from 'lucide-react';
import { Produto, CartItem } from '../types';
import { COMPANY } from '../data/company';
import { getImageUrl } from '../utils/image';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  products: Produto[];
  onSelectProduct: (p: Produto) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveFromCart: (id: string) => void;
  onClearCart: () => void;
}

export const FavoritesDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart = [],
  products = [],
  onSelectProduct,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart
}) => {
  if (!isOpen) return null;

  const cartDetails = (cart || [])
    .map(item => {
      const product = (products || []).find(p => p.id === item.id);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter((item): item is { product: Produto; quantity: number } => Boolean(item));

  const totalQuantity = cartDetails.reduce((sum, item) => sum + item.quantity, 0);

  // Exact WhatsApp formatted text (clean, no technical IDs, elegant presentation)
  const itemsText = cartDetails
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.product.titulo}*\n   • Quantidade: ${item.quantity} un\n   • Categoria: ${item.product.categoria}`
    )
    .join('\n\n');

  const whatsappOrderMessage = `✨ *PEDIDO DE LOOKS - VAIDOSA PLUS SIZE* ✨\n----------------------------------------\nOlá! Gostaria de consultar e pedir as seguintes peças do meu carrinho:\n\n🛍️ *ITENS SELECIONADOS:*\n${itemsText}\n\n----------------------------------------\n📦 *Total de peças:* ${totalQuantity} ${totalQuantity === 1 ? 'peça' : 'peças'}\n📍 *Loja:* Vaidosa Plus Size (Birigui - SP)\n\nGostaria de confirmar a disponibilidade de tamanhos e opções de envio/retirada! 💕`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Meu Carrinho"
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-stone-950 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-[0_0_12px_rgba(217,70,239,0.5)]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg leading-tight">Meu Carrinho</h3>
              <p className="text-[11px] text-stone-400">
                {totalQuantity} {totalQuantity === 1 ? 'peça selecionada' : 'peças selecionadas'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Fechar carrinho"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of items */}
        <div className="flex-grow overflow-y-auto p-4 space-y-3">
          {cartDetails.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="w-16 h-16 rounded-full bg-fuchsia-50 flex items-center justify-center mx-auto mb-4 border border-fuchsia-100">
                <ShoppingBag className="w-8 h-8 text-fuchsia-600" />
              </div>
              <h4 className="font-bold text-stone-800 text-base">Seu carrinho está vazio</h4>
              <p className="text-xs text-stone-500 mt-2 max-w-xs mx-auto leading-relaxed">
                Explore nosso catálogo e adicione suas peças preferidas para enviar seu pedido diretamente ao WhatsApp da loja.
              </p>
            </div>
          ) : (
            cartDetails.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex items-center space-x-3.5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/90 hover:border-fuchsia-200 transition-all shadow-2xs"
              >
                <img
                  src={getImageUrl(product.imagens[0])}
                  alt={product.titulo}
                  className="w-16 h-20 object-cover object-top rounded-xl shrink-0 cursor-pointer shadow-xs"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/instagram/DRBTkLVDNXO/01.webp';
                  }}
                  onClick={() => {
                    onClose();
                    onSelectProduct(product);
                  }}
                />
                <div className="flex-grow min-w-0">
                  <h4
                    onClick={() => {
                      onClose();
                      onSelectProduct(product);
                    }}
                    className="text-xs font-bold text-stone-900 hover:text-fuchsia-700 cursor-pointer truncate"
                  >
                    {product.titulo}
                  </h4>
                  <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block mt-0.5">
                    {product.categoria}
                  </span>

                  {/* Quantity controls */}
                  <div className="flex items-center space-x-2.5 mt-2.5">
                    <div className="flex items-center bg-white border border-stone-300 rounded-lg overflow-hidden shadow-2xs">
                      <button
                        onClick={() => onUpdateQuantity(product.id, -1)}
                        className="px-2 py-1 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-bold text-stone-800 min-w-[20px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, 1)}
                        className="px-2 py-1 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onSelectProduct(product);
                      }}
                      className="text-[11px] font-semibold text-fuchsia-700 hover:text-purple-800 flex items-center space-x-0.5 cursor-pointer ml-1"
                    >
                      <span>Ver foto</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => onRemoveFromCart(product.id)}
                  className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Remover item"
                  aria-label="Remover item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {cartDetails.length > 0 && (
          <div className="p-5 bg-stone-50 border-t border-stone-200 space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-600 pb-1">
              <span>Total de peças:</span>
              <span className="font-bold text-stone-900 text-sm">{totalQuantity} un</span>
            </div>

            <a
              href={`${COMPANY.whatsapp_url}?text=${encodeURIComponent(whatsappOrderMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-4 rounded-full text-xs sm:text-sm shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all hover:scale-[1.01] cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Enviar Pedido para o WhatsApp</span>
            </a>

            <button
              onClick={onClearCart}
              className="w-full py-1 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              Esvaziar carrinho
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

