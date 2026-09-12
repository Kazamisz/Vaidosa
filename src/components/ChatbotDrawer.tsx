import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, MessageCircle, ArrowRight, User, Bot, ShieldCheck } from 'lucide-react';
import { Produto, ChatMessage } from '../types';
import { COMPANY } from '../data/company';
import { getImageUrl } from '../utils/image';
import { motion, AnimatePresence } from 'motion/react';

interface ChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Produto[];
  onSelectProduct: (p: Produto) => void;
}

const QUICK_PROMPTS = [
  'Quero ver vestidos fluidos',
  'Quais peças em tons escuros?',
  'Opções masculinas disponíveis',
  'Como chegar na loja em Birigui?',
  'Falar com atendente no WhatsApp'
];

export const ChatbotDrawer: React.FC<ChatbotDrawerProps> = ({
  isOpen,
  onClose,
  products = [],
  onSelectProduct
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Olá! Sou a consultora virtual de estilo da Vaidosa Plus Size Ele&Ela. Como posso ajudar você a descobrir peças com caimento nobre e liberdade hoje?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Lock document scroll when chat drawer is open
  useEffect(() => {
    if (isOpen) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const cleanText = (t: string) =>
    (t || '')
      .replace(/\s*\([a-zA-Z0-9_-]{4,}\)/g, '')
      .replace(/\s*\[(?:ID|id|código|ref)[:\s]*[a-zA-Z0-9_-]+\]/gi, '')
      .replace(/\s*\((?:ID|id|código|ref)[:\s]*[a-zA-Z0-9_-]+\)/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      if (!res.ok) {
        throw new Error('Falha na resposta do servidor');
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: cleanText(data.answer || 'Estamos à disposição no WhatsApp para confirmar todos os detalhes da peça.'),
        suggestedProductIds: data.suggestedProductIds || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      // Intelligent local catalog search fallback
      const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const tokens = lower.split(/\s+/).filter(t => t.length > 2);
      
      const matched = (products || []).filter(p => {
        const full = `${p.titulo} ${p.categoria} ${p.descricao_curta} ${p.palavras_chave?.join(' ') || ''}`
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        return tokens.some(t => full.includes(t));
      }).slice(0, 4);

      let fallbackText = '';
      if (matched.length > 0) {
        fallbackText = `Encontrei algumas opções em nosso catálogo que combinam com sua busca: ${matched.map(m => `"${m.titulo}"`).join(', ')}.`;
      } else {
        fallbackText = 'Não encontrei uma correspondência exata para essa busca em nosso catálogo no momento.';
      }
      fallbackText += '\n\nPara confirmar disponibilidade de tamanhos (feminino até 70 e masculino até 80), valores e condições, nossa equipe atende diretamente pelo WhatsApp: (18) 99649-2221.';

      const fallbackMsg: ChatMessage = {
        id: `fb-${Date.now()}`,
        sender: 'bot',
        text: cleanText(fallbackText),
        suggestedProductIds: matched.map(m => m.id),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Consultora Virtual Vaidosa Plus Size"
          className="fixed inset-0 z-50 overflow-hidden bg-stone-950/75 backdrop-blur-md flex justify-end"
          data-lenis-prevent="true"
          onClick={onClose}
        >
        <motion.div
          initial={{ x: '100%', opacity: 0.88 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0.92 }}
          transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-lg bg-stone-950 text-stone-100 h-full max-h-[100dvh] shadow-[0_0_50px_rgba(0,0,0,0.85)] flex flex-col justify-between border-l border-stone-800 text-left relative overflow-hidden"
          data-lenis-prevent="true"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ambient mesh gradient wash */}
          <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-950/25 via-stone-950 to-stone-950 pointer-events-none -z-10" />

          {/* Elite Header */}
          <div className="p-4 sm:p-6 bg-stone-900/80 backdrop-blur-xl border-b border-stone-800 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3.5">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full p-[1px] bg-gradient-to-tr from-fuchsia-500 to-purple-400 shadow-[0_0_20px_rgba(217,70,239,0.35)]">
                <img
                  src="/images/icon-vaidosaAI-1-96.webp"
                  alt="Consultora IA"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <div className="flex items-center">
                  <h3 className="text-base sm:text-lg font-semibold tracking-tight text-white">Consultora Virtual</h3>
                </div>
                <p className="text-[11px] sm:text-xs text-stone-400 font-light">Vaidosa Plus Size • Atendimento Curado</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-all duration-300 cursor-pointer border border-stone-700"
              aria-label="Fechar consultora"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Editorial Factual Trust Banner */}
          <div className="bg-stone-900/50 border-b border-stone-800/80 px-4 sm:px-6 py-2 text-[11px] sm:text-xs text-stone-300 flex items-center space-x-2.5 shrink-0">
            <ShieldCheck className="w-4 h-4 text-fuchsia-400 shrink-0" />
            <span className="font-light tracking-wide truncate">Recomendações baseadas no acervo visual. Confirmações no WhatsApp.</span>
          </div>

          {/* Chat Messages Body with Dedicated Scroll and Touch Optimization */}
          <div
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-5 touch-pan-y"
            data-lenis-prevent="true"
          >
            {messages.map(msg => {
              const isUser = msg.sender === 'user';
              const suggestedProducts = (msg.suggestedProductIds || [])
                .map(id => (products || []).find(p => p.id === id))
                .filter((p): p is Produto => Boolean(p));

              return (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[92%] sm:max-w-[88%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {!isUser ? (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden shrink-0 mt-1 ring-1 ring-fuchsia-500/50">
                        <img src="/images/icon-vaidosaAI-1-96.webp" alt="Bot" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-800 text-stone-200 flex items-center justify-center shrink-0 mt-1 ring-1 ring-stone-700">
                        <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                    )}

                    <div
                      className={`rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-tr-xs shadow-lg'
                          : 'bg-stone-900/90 text-stone-200 border border-stone-800 rounded-tl-xs shadow-xl backdrop-blur-md'
                      }`}
                    >
                      <p className="whitespace-pre-line font-light">{msg.text}</p>
                      <span
                        className={`text-[9px] sm:text-[10px] block mt-1.5 ${
                          isUser ? 'text-fuchsia-200 text-right' : 'text-stone-500'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* Gapless Bento Grid of Suggested Products */}
                  {suggestedProducts.length > 0 && (
                    <div className="mt-3 ml-10 sm:ml-11 w-full max-w-[88%] space-y-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-fuchsia-400 block">
                        Peças Selecionadas do Acervo:
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {suggestedProducts.slice(0, 3).map(p => (
                          <div
                            key={p.id}
                            onClick={() => {
                              onClose();
                              onSelectProduct(p);
                            }}
                            className="group flex items-center space-x-3 p-2.5 sm:p-3 bg-stone-900/80 hover:bg-stone-800/90 rounded-xl border border-stone-800 hover:border-fuchsia-500/60 cursor-pointer transition-all duration-300"
                          >
                            <div className="w-12 h-14 sm:w-14 sm:h-16 rounded-lg overflow-hidden shrink-0 relative bg-stone-950">
                              <img
                                src={getImageUrl(p.imagens[0])}
                                alt={p.titulo}
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = '/images/instagram/DRBTkLVDNXO/01.webp';
                                }}
                              />
                            </div>
                            <div className="flex-grow min-w-0">
                              <h4 className="text-xs font-medium text-stone-100 truncate group-hover:text-fuchsia-300 transition-colors">
                                {p.titulo}
                              </h4>
                              <span className="text-[10px] sm:text-[11px] text-stone-400 block truncate font-light mt-0.5">
                                {p.categoria}
                              </span>
                            </div>
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-300 group-hover:bg-fuchsia-600 group-hover:text-white transition-all shrink-0">
                              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}

            {loading && (
              <div className="flex items-center space-x-3 text-xs text-stone-400 pl-10 sm:pl-11">
                <div className="w-2 h-2 rounded-full bg-fuchsia-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-fuchsia-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-fuchsia-500 animate-bounce [animation-delay:0.4s]" />
                <span className="font-light tracking-wide text-xs">Consultando acervo e curadoria...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts - Mobile Optimized Horizontal Scroll Row */}
          <div
            className="px-3 sm:px-4 py-2.5 bg-stone-900/90 border-t border-stone-800/80 overflow-x-auto scrollbar-none overscroll-x-contain flex items-center gap-2 shrink-0 touch-pan-x"
            data-lenis-prevent="true"
          >
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="shrink-0 text-[11px] sm:text-xs whitespace-nowrap bg-stone-800/90 hover:bg-fuchsia-950/60 hover:text-fuchsia-300 text-stone-300 px-3.5 py-1.5 rounded-full border border-stone-700/80 transition-all duration-200 cursor-pointer font-light tracking-wide active:scale-95"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 sm:p-4 bg-stone-900 border-t border-stone-800 flex items-center space-x-2 sm:space-x-3 shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua dúvida sobre looks, tamanhos..."
              disabled={loading}
              className="flex-grow px-4 py-2.5 sm:px-5 sm:py-3 bg-stone-950 rounded-full text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/80 border border-stone-800 font-light"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !inputValue.trim()}
              className="p-2.5 sm:p-3 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 disabled:opacity-40 text-white shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-all cursor-pointer hover:scale-105 shrink-0"
              aria-label="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Footer WhatsApp Direct CTA */}
          <div className="p-2.5 sm:p-3 bg-stone-950 border-t border-stone-800 text-center shrink-0">
            <a
              href={COMPANY.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] sm:text-xs font-medium text-fuchsia-400 hover:text-fuchsia-300 transition-colors inline-flex items-center space-x-2 tracking-wide"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              <span>Atendimento Direto no WhatsApp da Loja</span>
            </a>
          </div>

        </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
