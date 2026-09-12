import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Share2, ShoppingBag, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Produto } from '../types';
import { getImageUrl } from '../utils/image';
import { triggerHapticFeedback } from '../utils/haptics';

interface ProductModalProps {
  product: Produto | null;
  onClose: () => void;
  onAddToCart: (id: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.classList.add('product-modal-open');

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.documentElement.classList.remove('product-modal-open');
    };
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (!product) return;
      if (event.key === 'ArrowRight' && product.imagens.length > 1) {
        setActiveImageIndex(index => (index + 1) % product.imagens.length);
      }
      if (event.key === 'ArrowLeft' && product.imagens.length > 1) {
        setActiveImageIndex(index => (index - 1 + product.imagens.length) % product.imagens.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, product]);

  if (!product) return null;

  const images = product.imagens || [];
  const totalImages = images.length;
  const currentImage = getImageUrl(images[activeImageIndex] || '');

  const handleShare = async () => {
    triggerHapticFeedback(15);
    const shareData = {
      title: product.titulo,
      text: `Confira esta peça incrível na Vaidosa Plus Size: ${product.titulo}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copiado para a área de transferência!');
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert('Link copiado para a área de transferência!');
        } catch {}
      }
    }
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.24 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/80 p-0 backdrop-blur-md sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-h-[100dvh] w-full overflow-hidden bg-[#12060c] text-left text-stone-100 shadow-[0_30px_100px_rgba(55,0,21,.75)] sm:max-h-[calc(100dvh-2rem)] sm:max-w-5xl sm:rounded-3xl sm:border sm:border-rose-200/25"
        onClick={event => event.stopPropagation()}
      >
        <div className="absolute right-3 top-3 z-30 flex items-center gap-2 sm:right-4 sm:top-4">
          <button
            type="button"
            onClick={handleShare}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#210a14]/90 text-white shadow-lg backdrop-blur-md transition-transform hover:scale-105 hover:bg-[#3b0c20] cursor-pointer"
            aria-label="Compartilhar peça"
            title="Compartilhar peça"
          >
            <Share2 className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHapticFeedback(10);
              onClose();
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#210a14]/90 text-white shadow-lg backdrop-blur-md transition-transform hover:scale-105 hover:bg-[#3b0c20] cursor-pointer"
            aria-label="Fechar janela"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          data-lenis-prevent
          className="max-h-[100dvh] overflow-y-auto overscroll-contain sm:max-h-[calc(100dvh-2rem)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="border-b border-rose-200/12 bg-[#0b0307] p-3 sm:p-5 lg:col-span-7 lg:border-b-0 lg:border-r">
              <div className="relative mx-auto aspect-[4/5] max-h-[62dvh] w-full overflow-hidden rounded-2xl bg-stone-200 sm:max-h-[68dvh] lg:max-h-[calc(100dvh-5rem)]">
                {currentImage && (
                  <img
                    src={currentImage}
                    alt={`${product.titulo}, imagem ${activeImageIndex + 1} de ${totalImages}`}
                    className="h-full w-full object-cover object-top"
                    onError={event => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                )}

                <div className="absolute left-3 top-3 flex max-w-[calc(100%-4.5rem)] flex-wrap items-center gap-2">
                  <span className="rounded-full bg-stone-950/78 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md sm:text-xs">
                    {product.categoria}
                  </span>
                  {totalImages > 1 && (
                    <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-stone-800 sm:text-xs">
                      {activeImageIndex + 1} de {totalImages}
                    </span>
                  )}
                </div>

                {totalImages > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex(index => (index - 1 + totalImages) % totalImages)}
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-stone-900 shadow-lg transition-transform hover:scale-105"
                      aria-label="Foto anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex(index => (index + 1) % totalImages)}
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-stone-900 shadow-lg transition-transform hover:scale-105"
                      aria-label="Próxima foto"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {totalImages > 1 && (
                <div data-lenis-prevent className="mt-3 flex gap-2.5 overflow-x-auto overscroll-x-contain pb-1">
                  {images.map((image, index) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      onClick={() => setActiveImageIndex(index)}
                      className={`h-16 w-12 shrink-0 overflow-hidden rounded-lg border-2 transition-opacity sm:h-20 sm:w-16 ${
                        activeImageIndex === index ? 'border-[#790931] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      aria-label={`Exibir foto ${index + 1}`}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt=""
                        className="h-full w-full object-cover object-top"
                        onError={event => {
                          event.currentTarget.style.display = 'none';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6 p-5 sm:p-8 lg:col-span-5 lg:min-h-full lg:justify-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#790931]">
                  Vaidosa Plus Size
                </span>
                <h2 id="product-modal-title" className="mt-2 pr-10 text-2xl font-semibold leading-tight text-white sm:text-3xl">
                  {product.titulo}
                </h2>
              </div>

              <p className="text-sm leading-relaxed text-stone-300 sm:text-base">
                {product.descricao_comercial || product.descricao_curta}
              </p>



              <div className="rounded-2xl border border-rose-200/15 bg-white/[0.045] p-4 text-sm text-stone-300">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <MapPin className="h-4 w-4 text-rose-300" />
                  <span>Loja física em Birigui - SP</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-stone-400">
                  Consulte na loja as medidas, as cores e a disponibilidade atual desta peça.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  triggerHapticFeedback([12, 40, 18]);
                  onAddToCart(product.id);
                }}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-rose-200/30 bg-gradient-to-r from-[#b52d62] via-[#8f123f] to-[#4e051e] px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-[0_14px_34px_rgba(121,9,49,.42)] transition-all duration-300 hover:-translate-y-0.5 hover:from-[#c93b70] hover:via-[#a51b4c] hover:to-[#630626] active:scale-[0.98] cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                Adicionar ao carrinho
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
