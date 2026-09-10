import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MessageCircle, ShoppingBag, ShieldAlert, MapPin, Check } from 'lucide-react';
import { Produto } from '../types';
import { COMPANY } from '../data/company';
import { getImageUrl } from '../utils/image';

interface ProductModalProps {
  product: Produto | null;
  onClose: () => void;
  isInCart: boolean;
  onToggleCart: (id: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  isInCart,
  onToggleCart
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reset image index whenever a new product is selected
  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (!product) return;
      if (e.key === 'ArrowRight' && product.imagens.length > 1) {
        setActiveImageIndex(prev => (prev + 1) % product.imagens.length);
      }
      if (e.key === 'ArrowLeft' && product.imagens.length > 1) {
        setActiveImageIndex(prev => (prev - 1 + product.imagens.length) % product.imagens.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, product]);

  if (!product) return null;

  const totalImgs = product.imagens?.length || 0;
  const currentImgSrc = getImageUrl(product.imagens?.[activeImageIndex] || '');
  const whatsappMessage = `Olá! Vi a peça "${product.titulo}" (${product.categoria}) no site da Vaidosa Plus Size e gostaria de verificar tamanhos disponíveis e caimento!`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200 text-left my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md transition-all hover:scale-105 cursor-pointer"
          aria-label="Fechar janela"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Gallery Column (7 cols) */}
          <div className="md:col-span-7 bg-stone-100 flex flex-col justify-between p-4 sm:p-6 border-b md:border-b-0 md:border-r border-stone-200">
            {/* Main Stage Image */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-stone-200 shadow-inner">
              <img
                src={currentImgSrc}
                alt={`${product.titulo}, imagem ${activeImageIndex + 1} de ${totalImgs}`}
                className="w-full h-full object-cover object-top sm:object-center transition-all duration-300"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/instagram/DRBTkLVDNXO/01.webp';
                }}
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex items-center space-x-2">
                <span className="bg-[#1E1B18]/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.categoria}
                </span>
                <span className="bg-white/90 text-stone-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {activeImageIndex + 1} de {totalImgs}
                </span>
              </div>

              {/* Prev / Next Controls if > 1 image */}
              {totalImgs > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex(prev => (prev - 1 + totalImgs) % totalImgs)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md transition-transform hover:scale-105"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex(prev => (prev + 1) % totalImgs)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md transition-transform hover:scale-105"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails row */}
            {totalImgs > 1 && (
              <div className="flex items-center space-x-2.5 mt-4 overflow-x-auto pb-1">
                {(product.imagens || []).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-18 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.4)] scale-102'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`Miniatura ${idx + 1}`}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/instagram/DRBTkLVDNXO/01.webp';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column (5 cols) */}
          <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-700 drop-shadow-[0_0_8px_rgba(217,70,239,0.3)]">
                    Vaidosa Plus Size
                  </span>
                  <h2
                    id="product-modal-title"
                    className="font-serif text-2xl font-bold text-stone-900 mt-1 leading-snug"
                  >
                    {product.titulo}
                  </h2>
                </div>

                <button
                  onClick={() => onToggleCart(product.id)}
                  className={`p-2.5 rounded-full transition-all cursor-pointer ${
                    isInCart
                      ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-[0_0_12px_rgba(217,70,239,0.5)]'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                  title={isInCart ? 'Remover do carrinho' : 'Adicionar ao carrinho'}
                  aria-label="Adicionar ou remover do carrinho"
                >
                  <ShoppingBag className="w-5 h-5" />
                </button>
              </div>

              {/* Description */}
              <div className="text-sm text-stone-700 space-y-2 leading-relaxed">
                <p>{product.descricao_comercial || product.descricao_curta}</p>
              </div>

              {/* Review note if needed */}
              {product.needs_review && (
                <div className="flex items-start space-x-2 p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
                  <p>
                    Item com detalhes visuais para conferência direta com nossa equipe na loja.
                  </p>
                </div>
              )}

              {/* Store physical availability note */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1">
                <div className="flex items-center space-x-1.5 font-semibold text-stone-800">
                  <MapPin className="w-3.5 h-3.5 text-fuchsia-600" />
                  <span>Loja Física em Birigui - SP</span>
                </div>
                <p>
                  Grade até 70 feminina e 80 masculina. Consulte as medidas e cores disponíveis diretamente no WhatsApp.
                </p>
              </div>
            </div>

            {/* Direct Actions: Add to Cart + WhatsApp */}
            <div className="pt-4 border-t border-stone-200 space-y-2.5">
              <button
                onClick={() => onToggleCart(product.id)}
                className={`w-full inline-flex items-center justify-center space-x-2 font-bold py-3.5 px-6 rounded-full text-xs sm:text-sm transition-all cursor-pointer ${
                  isInCart
                    ? 'bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-300'
                    : 'bg-stone-900 hover:bg-stone-800 text-white shadow-md hover:scale-[1.01]'
                }`}
              >
                {isInCart ? (
                  <>
                    <Check className="w-4 h-4 text-fuchsia-600" />
                    <span>Peça Adicionada ao Carrinho</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Adicionar ao Carrinho</span>
                  </>
                )}
              </button>

              <a
                href={`${COMPANY.whatsapp_url}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-6 rounded-full text-xs sm:text-sm shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all hover:scale-[1.01]"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Pedir esta peça no WhatsApp</span>
              </a>
              <p className="text-[11px] text-center text-stone-400">
                Atendimento humanizado para tirar dúvidas e conferir medidas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
