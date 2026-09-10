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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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
        text: data.answer || 'Estamos à disposição no WhatsApp para confirmar todos os detalhes da peça.',
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
        text: fallbackText,
        suggestedProductIds: matched.map(m => m.id),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label="Consultora Virtual Vaidosa Plus Size"
        className="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-md flex justify-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          className="w-full max-w-lg bg-stone-950 text-stone-100 h-full shadow-[_0_0_50px_rgba(0,0,0,0.8)] flex flex-col justify-between border-l border-stone-800 text-left relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ambient mesh gradient wash */}
          <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-950/25 via-stone-950 to-stone-950 pointer-events-none -z-10" />

          {/* Elite Header */}
          <div className="p-6 bg-stone-900/80 backdrop-blur-xl border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="relative w-11 h-11 rounded-full p-[1px] bg-gradient-to-tr from-fuchsia-500 to-purple-400 shadow-[0_0_20px_rgba(217,70,239,0.35)]">
                <img
                  src="/images/icon-vaidosaAI-1.webp"
                  alt="Consultora IA"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-serif text-lg font-medium text-white tracking-wide">Consultora Virtual</h3>
                  <span className="px-2 py-0.5 text-[9px] uppercase tracking-widest bg-fuchsia-500/20 text-fuchsia-300 rounded-full border border-fuchsia-500/30">IA Elite</span>
                </div>
                <p className="text-xs text-stone-400 font-light">Vaidosa Plus Size • Atendimento Curado</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-all duration-300 cursor-pointer border border-stone-700"
              aria-label="Fechar consultora"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Editorial Factual Trust Banner */}
          <div className="bg-stone-900/50 border-b border-stone-800/80 px-6 py-2.5 text-xs text-stone-300 flex items-center space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-fuchsia-400 shrink-0" />
            <span className="font-light tracking-wide">Recomendações baseadas no acervo visual. Confirmações no WhatsApp.</span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6">
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
                  <div className={`flex items-start space-x-3 max-w-[90%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {!isUser ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-1 ring-1 ring-fuchsia-500/50">
                        <img src="/images/icon-vaidosaAI-1.webp" alt="Bot" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-stone-800 text-stone-200 flex items-center justify-center shrink-0 mt-1 ring-1 ring-stone-700">
                        <User className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`rounded-2xl p-4 text-sm leading-relaxed ${
                        isUser
                          ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-tr-xs shadow-lg'
                          : 'bg-stone-900/90 text-stone-200 border border-stone-800 rounded-tl-xs shadow-xl backdrop-blur-md'
                      }`}
                    >
                      <p className="whitespace-pre-line font-light">{msg.text}</p>
                      <span
                        className={`text-[10px] block mt-2 ${
                          isUser ? 'text-fuchsia-200 text-right' : 'text-stone-500'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* Gapless Bento Grid of Suggested Products */}
                  {suggestedProducts.length > 0 && (
                    <div className="mt-4 ml-11 w-full max-w-[85%] space-y-2.5">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-fuchsia-400 block">
                        Peças Selecionadas do Acervo:
                      </span>
                      <div className="grid grid-cols-1 gap-2.5">
                        {suggestedProducts.slice(0, 3).map(p => (
                          <div
                            key={p.id}
                            onClick={() => {
                              onClose();
                              onSelectProduct(p);
                            }}
                            className="group flex items-center space-x-3.5 p-3 bg-stone-900/80 hover:bg-stone-800/90 rounded-xl border border-stone-800 hover:border-fuchsia-500/60 cursor-pointer transition-all duration-300"
                          >
                            <div className="w-14 h-16 rounded-lg overflow-hidden shrink-0 relative bg-stone-950">
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
                              <span className="text-[11px] text-stone-400 block truncate font-light mt-0.5">
                                {p.categoria}
                              </span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-300 group-hover:bg-fuchsia-600 group-hover:text-white transition-all shrink-0">
                              <ArrowRight className="w-4 h-4" />
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
              <div className="flex items-center space-x-3 text-xs text-stone-400 pl-11">
                <div className="w-2 h-2 rounded-full bg-fuchsia-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-fuchsia-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-fuchsia-500 animate-bounce [animation-delay:0.4s]" />
                <span className="font-light tracking-wide">Consultando acervo e curadoria...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts - Gapless Bento Pill Row */}
          <div className="p-4 bg-stone-900/60 border-t border-stone-800 overflow-x-auto whitespace-nowrap scrollbar-none space-x-2">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="inline-block text-xs bg-stone-800/90 hover:bg-fuchsia-950/60 hover:text-fuchsia-300 text-stone-300 px-4 py-2 rounded-full border border-stone-700/80 transition-all duration-300 cursor-pointer font-light tracking-wide"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-5 bg-stone-900 border-t border-stone-800 flex items-center space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua dúvida sobre looks, tamanhos..."
              disabled={loading}
              className="flex-grow px-5 py-3.5 bg-stone-950 rounded-full text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/80 border border-stone-800 font-light"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !inputValue.trim()}
              className="p-3.5 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 disabled:opacity-40 text-white shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-all cursor-pointer hover:scale-105 shrink-0"
              aria-label="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Footer WhatsApp Direct CTA */}
          <div className="p-3.5 bg-stone-950 border-t border-stone-800 text-center">
            <a
              href={COMPANY.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-fuchsia-400 hover:text-fuchsia-300 transition-colors inline-flex items-center space-x-2 tracking-wide"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Atendimento Direto no WhatsApp da Loja</span>
            </a>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
