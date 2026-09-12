import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ShoppingBag, X } from 'lucide-react';
import { Produto } from '../types';
import { getImageUrl } from '../utils/image';

interface ToastNotificationProps {
  toast: {
    id: string;
    product: Produto;
  } | null;
  onClose: () => void;
  onOpenCart: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  toast,
  onClose,
  onOpenCart,
}) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  return (
    <div className="fixed top-5 right-4 sm:top-6 sm:right-6 z-[100] pointer-events-none max-w-sm w-[92%] sm:w-auto">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-rose-200/25 bg-stone-950/90 p-3.5 sm:p-4 text-white shadow-[0_12px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
          >
            {/* Thumbnail or Icon */}
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-stone-900 shadow-inner">
              {toast.product.imagens?.[0] ? (
                <img
                  src={getImageUrl(toast.product.imagens[0])}
                  alt={toast.product.titulo}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#790931]/60 text-white">
                  <ShoppingBag className="h-5 w-5" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-stone-950 shadow-md">
                <Check className="h-3 w-3 stroke-[3]" />
              </div>
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 pr-1">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-300">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-ping" />
                Adicionado à sacola
              </span>
              <p className="truncate text-xs sm:text-sm font-medium text-stone-100 mt-0.5">
                {toast.product.titulo}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCart();
                }}
                className="rounded-full bg-gradient-to-r from-[#b52d62] via-[#8f123f] to-[#4e051e] px-3 py-1.5 text-[11px] font-semibold text-white uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                Ver Sacola
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Fechar notificação"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
