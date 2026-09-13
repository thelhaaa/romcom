import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { sound } from '../../utils/audioEngine';
import { triggerHaptic } from '../../hooks/useMobileSensors';

interface LoveReceiptProps {
  className?: string;
}

export const LoveReceipt: React.FC<LoveReceiptProps> = ({ className = '' }) => {
  useEffect(() => {
    sound.playPaperTear();
    triggerHaptic([30, 40]);
  }, []);

  const items = [
    { name: 'UNLIMITED CUDDLES & HUGS', qty: '999,999', price: 'FREE' },
    { name: 'LATE NIGHT CALLS & GOSSIP', qty: '365 DAYS', price: 'PAID IN SMILES' },
    { name: 'FOREHEAD KISSES (DAILY)', qty: 'NONSTOP', price: 'INCLUDED' },
    { name: 'PATIENCE WITH SILLY DRAMA', qty: '100%', price: 'GUARANTEED' },
    { name: 'SNACKS ON DEMAND', qty: 'VIP ACCESS', price: 'COMPLIMENTARY' },
    { name: 'LIFETIME LOYALTY CONTRACT', qty: '1 FOREVER', price: 'NON-REFUNDABLE' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`relative w-full max-w-sm mx-auto bg-[#faf8f2] text-[#1c1b18] font-mono text-xs shadow-2xl p-5 select-none ${className}`}
      style={{
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5), 0 0 1px 1px rgba(0,0,0,0.1)',
        clipPath:
          'polygon(0% 10px, 2% 0px, 4% 10px, 6% 0px, 8% 10px, 10% 0px, 12% 10px, 14% 0px, 16% 10px, 18% 0px, 20% 10px, 22% 0px, 24% 10px, 26% 0px, 28% 10px, 30% 0px, 32% 10px, 34% 0px, 36% 10px, 38% 0px, 40% 10px, 42% 0px, 44% 10px, 46% 0px, 48% 10px, 50% 0px, 52% 10px, 54% 0px, 56% 10px, 58% 0px, 60% 10px, 62% 0px, 64% 10px, 66% 0px, 68% 10px, 70% 0px, 72% 10px, 74% 0px, 76% 10px, 78% 0px, 80% 10px, 82% 0px, 84% 10px, 86% 0px, 88% 10px, 90% 0px, 92% 10px, 94% 0px, 96% 10px, 98% 0px, 100% 10px, 100% calc(100% - 10px), 98% 100%, 96% calc(100% - 10px), 94% 100%, 92% calc(100% - 10px), 90% 100%, 88% calc(100% - 10px), 86% 100%, 84% calc(100% - 10px), 82% 100%, 80% calc(100% - 10px), 78% 100%, 76% calc(100% - 10px), 74% 100%, 72% calc(100% - 10px), 70% 100%, 68% calc(100% - 10px), 66% 100%, 64% calc(100% - 10px), 62% 100%, 60% calc(100% - 10px), 58% 100%, 56% calc(100% - 10px), 54% 100%, 52% calc(100% - 10px), 50% 100%, 48% calc(100% - 10px), 46% 100%, 44% calc(100% - 10px), 42% 100%, 40% calc(100% - 10px), 38% 100%, 36% calc(100% - 10px), 34% 100%, 32% calc(100% - 10px), 30% 100%, 28% calc(100% - 10px), 26% 100%, 24% calc(100% - 10px), 22% 100%, 20% calc(100% - 10px), 18% 100%, 16% calc(100% - 10px), 14% 100%, 12% calc(100% - 10px), 10% 100%, 8% calc(100% - 10px), 6% 100%, 4% calc(100% - 10px), 2% 100%, 0% calc(100% - 10px))',
      }}
    >
      {/* Thermal Header */}
      <div className="text-center pt-2 pb-3 border-b-2 border-dashed border-[#1c1b18]/40">
        <h2 className="text-sm font-bold tracking-widest uppercase">RECEIPTIFY LOVE AUDIT</h2>
        <p className="text-[10px] text-zinc-600 mt-0.5">STORE #0214 • VALENTINE DESK</p>
        <p className="text-[9px] text-zinc-500">TERMINAL ID: FOREVER-IN-LOVE</p>
        <p className="text-[9px] text-zinc-500">CASHIER: YOUR ONE & ONLY ♡</p>
      </div>

      {/* Date & Invoice */}
      <div className="flex justify-between py-2 text-[10px] border-b border-dashed border-[#1c1b18]/30">
        <span>DATE: {new Date().toLocaleDateString('en-US')}</span>
        <span>ORDER #LOVE-777</span>
      </div>

      {/* Table Header */}
      <div className="flex justify-between font-bold text-[10px] pt-2 pb-1 border-b border-[#1c1b18]/30">
        <span className="w-1/2">ITEM DESCRIPTION</span>
        <span className="w-1/4 text-center">QTY</span>
        <span className="w-1/4 text-right">TOTAL</span>
      </div>

      {/* Items */}
      <div className="py-2 space-y-1.5 text-[10px]">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-start leading-tight">
            <span className="w-1/2 font-semibold">{item.name}</span>
            <span className="w-1/4 text-center text-zinc-600">{item.qty}</span>
            <span className="w-1/4 text-right font-bold">{item.price}</span>
          </div>
        ))}
      </div>

      {/* Calculations */}
      <div className="border-t-2 border-dashed border-[#1c1b18]/40 pt-2 space-y-1 text-[11px]">
        <div className="flex justify-between">
          <span>ITEM COUNT:</span>
          <span>INFINITY</span>
        </div>
        <div className="flex justify-between">
          <span>SUBTOTAL:</span>
          <span>100% ADORATION</span>
        </div>
        <div className="flex justify-between">
          <span>TAX (FEELINGS):</span>
          <span>0.00 (NO TAX ON LOVE)</span>
        </div>
        <div className="flex justify-between text-sm font-bold border-t border-[#1c1b18] pt-1">
          <span>TOTAL CHARGED:</span>
          <span className="text-rose-700">YOUR HEART ♡</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="text-[9px] text-zinc-600 pt-2 border-t border-dashed border-[#1c1b18]/30 mt-2 space-y-0.5">
        <p>PAYMENT METHOD: LIFETIME COMMITMENT</p>
        <p>AUTH CODE: 1402-HEARTBEAT-ACCEPTED</p>
        <p>NO RETURNS • NON-TRANSFERABLE</p>
      </div>

      {/* Barcode */}
      <div className="pt-3 pb-2 flex flex-col items-center">
        <div className="flex items-center gap-[2px] h-9">
          {[
            3, 1, 4, 1, 2, 5, 2, 1, 3, 2, 4, 1, 2, 3, 1, 5, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 5, 2, 3, 1,
            2, 4, 1,
          ].map((w, idx) => (
            <div key={idx} className="bg-black h-full" style={{ width: `${w}px` }} />
          ))}
        </div>
        <span className="text-[9px] tracking-[0.25em] text-zinc-700 mt-1">2026-VALENTINE-FOREVER</span>
      </div>

      {/* Footer message */}
      <div className="text-center pb-2 text-[10px] font-bold text-rose-700">
        ✦ THANK YOU FOR BEING MY VALENTINE ✦
      </div>
    </motion.div>
  );
};
