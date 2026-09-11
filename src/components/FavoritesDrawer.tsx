import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, MessageCircle, Minus, Plus, ShoppingBag, Sparkles, Trash2, X } from 'lucide-react';
import { Produto, CartItem } from '../types';
import { COMPANY } from '../data/company';
import { getImageUrl } from '../utils/image';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  products: Produto[];
  onSelectProduct: (product: Produto) => void;
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
  onClearCart,
}) => {
  const cartDetails = cart
    .map(item => {
      const product = products.find(productItem => productItem.id === item.id);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter((item): item is { product: Produto; quantity: number } => Boolean(item));

  const totalQuantity = cartDetails.reduce((sum, item) => sum + item.quantity, 0);
  const itemsText = cartDetails
    .map((item, index) => `${index + 1}. *${item.product.titulo}*\nQuantidade: ${item.quantity}\nCategoria: ${item.product.categoria}`)
    .join('\n\n');
  const whatsappOrderMessage = `PEDIDO DE LOOKS - VAIDOSA PLUS SIZE\n\nOlá! Gostaria de consultar as peças do meu carrinho:\n\n${itemsText}\n\nTotal de peças: ${totalQuantity}\n\nGostaria de confirmar disponibilidade, valores e opções de envio ou retirada.`;

  const openProduct = (product: Produto) => {
    onClose();
    onSelectProduct(product);
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Meu Carrinho"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: '108%', scale: 0.97, opacity: 0.7 }}
            animate={{ x: 0, scale: 1, opacity: 1 }}
            exit={{ x: '108%', scale: 0.98, opacity: 0.7 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            data-lenis-prevent
            className="absolute inset-y-2 right-2 isolate flex w-[calc(100%-1rem)] max-w-lg flex-col overflow-hidden rounded-[30px] border border-rose-300/18 bg-[#10080c] text-left text-white shadow-[0_30px_100px_rgba(0,0,0,.62),0_0_50px_rgba(121,9,49,.18)] sm:inset-y-4 sm:right-4 sm:w-[calc(100%-2rem)]"
            style={{
              backgroundColor: '#10080c',
              backgroundImage: 'linear-gradient(180deg, rgba(26, 8, 17, 0.99), rgba(16, 8, 12, 1))',
            }}
            onClick={event => event.stopPropagation()}
          >
            <div className="relative overflow-hidden border-b border-white/10 px-5 py-5 sm:px-7 sm:py-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(180,39,99,.26),transparent_48%)]" />
              <div className="relative flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-rose-200/20 bg-[#790931] shadow-[0_0_24px_rgba(121,9,49,.42)]">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-rose-300">Seleção pessoal</p>
                    <h3 className="mt-1 text-xl font-medium tracking-tight text-white">Meu carrinho</h3>
                    <p className="mt-0.5 text-xs text-stone-400">
                      {totalQuantity} {totalQuantity === 1 ? 'peça selecionada' : 'peças selecionadas'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-stone-300 transition-all duration-300 hover:rotate-90 hover:border-rose-300/35 hover:bg-white/10 hover:text-white"
                  aria-label="Fechar carrinho"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
              {cartDetails.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex min-h-full flex-col items-center justify-center px-5 py-14 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-rose-300/20 bg-[#790931]/20 text-rose-300">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <h4 className="mt-5 text-xl font-medium text-white">Sua seleção começa aqui</h4>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-stone-400">
                    Adicione as peças que deseja consultar e envie tudo diretamente para a equipe da loja.
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {cartDetails.map(({ product, quantity }) => (
                      <motion.article
                        layout
                        key={product.id}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 28, scale: 0.96 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="group grid grid-cols-[76px_1fr_auto] gap-3 rounded-[22px] border border-white/10 bg-white/[0.045] p-3 transition-colors hover:border-rose-300/25 hover:bg-white/[0.065]"
                      >
                        <button type="button" onClick={() => openProduct(product)} className="overflow-hidden rounded-2xl bg-stone-900 text-left">
                          <img
                            src={getImageUrl(product.imagens[0])}
                            alt={product.titulo}
                            className="h-24 w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                            onError={event => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src = '/images/instagram/DRBTkLVDNXO/01.webp';
                            }}
                          />
                        </button>

                        <div className="min-w-0 py-1">
                          <button type="button" onClick={() => openProduct(product)} className="block max-w-full text-left">
                            <span className="block truncate text-sm font-medium text-white transition-colors group-hover:text-rose-200">{product.titulo}</span>
                            <span className="mt-1 block truncate text-[10px] font-semibold uppercase tracking-[0.13em] text-stone-500">{product.categoria}</span>
                          </button>
                          <div className="mt-4 inline-flex items-center overflow-hidden rounded-full border border-white/10 bg-black/30">
                            <button type="button" onClick={() => onUpdateQuantity(product.id, -1)} className="p-2 text-stone-400 transition-colors hover:bg-white/8 hover:text-white" aria-label="Diminuir quantidade">
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-8 text-center text-xs font-semibold text-white">{quantity}</span>
                            <button type="button" onClick={() => onUpdateQuantity(product.id, 1)} className="p-2 text-stone-400 transition-colors hover:bg-white/8 hover:text-white" aria-label="Aumentar quantidade">
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveFromCart(product.id)}
                          className="mt-1 flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-red-500/10 hover:text-red-300"
                          aria-label={`Remover ${product.titulo}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {cartDetails.length > 0 && (
              <div className="border-t border-white/10 bg-black/20 p-5 backdrop-blur-xl sm:p-6">
                <div className="mb-4 flex items-end justify-between border-b border-white/8 pb-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">Total selecionado</p>
                    <p className="mt-1 text-sm text-stone-300">Confirme disponibilidade com a loja</p>
                  </div>
                  <span className="text-2xl font-medium text-white">{totalQuantity}</span>
                </div>
                <a
                  href={`${COMPANY.whatsapp_url}?text=${encodeURIComponent(whatsappOrderMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-fuchsia-300/30 bg-gradient-to-r from-[#c255ef] via-[#a02bd4] to-[#790931] px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_34px_rgba(121,9,49,.42)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_42px_rgba(194,85,239,.3)]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Enviar pedido
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <button type="button" onClick={onClearCart} className="mt-3 w-full py-1 text-xs text-stone-500 transition-colors hover:text-stone-300">
                  Esvaziar carrinho
                </button>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
