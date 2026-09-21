'use client';

import React, { useState } from 'react';
import { Movement, Product } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

interface MovementsViewProps {
  movements: Movement[];
  products: Product[];
  onAddMovement: (m: Movement) => void;
  onUpdateMovement: (id: string, m: Partial<Movement>) => void;
  onDeleteMovement: (m: Movement) => void;
  triggerAdd?: number;
}

export function MovementsView({ movements, products, onAddMovement, onUpdateMovement, onDeleteMovement, triggerAdd }: MovementsViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    sku: '',
    quantity: 0,
    type: 'inbound' as any,
    document: '',
    origin: '',
    destination: ''
  });

  React.useEffect(() => {
    if (triggerAdd && triggerAdd > 0) {
      // Deferring state update to avoid cascading render warning
      const timer = setTimeout(() => {
        setIsAdding(true);
        setEditingId(null);
        setFormData({ sku: '', quantity: 0, type: 'inbound', document: '', origin: '', destination: '' });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [triggerAdd]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.sku === formData.sku);
    if (!product) return alert('SKU não encontrado');

    if (editingId) {
      onUpdateMovement(editingId, {
        sku: formData.sku,
        productName: product.name,
        quantity: formData.type === 'inbound' ? Math.abs(formData.quantity) : -Math.abs(formData.quantity),
        type: formData.type,
        document: formData.document,
        origin: formData.origin,
        destination: formData.destination,
      });
      setEditingId(null);
    } else {
      const newMovement: Movement = {
        id: Math.random().toString(36).substr(2, 9),
        protocol: `#MOV-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toISOString(),
        type: formData.type,
        document: formData.document,
        sku: formData.sku,
        productName: product.name,
        quantity: formData.type === 'inbound' ? Math.abs(formData.quantity) : -Math.abs(formData.quantity),
        unit: 'un',
        origin: formData.origin,
        destination: formData.destination,
        operator: 'Carlos Eduardo',
        status: 'completed'
      };
      onAddMovement(newMovement);
      setIsAdding(false);
    }
    setFormData({ sku: '', quantity: 0, type: 'inbound', document: '', origin: '', destination: '' });
  };

  const handleEdit = (m: Movement) => {
    setFormData({
      sku: m.sku,
      quantity: Math.abs(m.quantity),
      type: m.type,
      document: m.document,
      origin: m.origin,
      destination: m.destination
    });
    setEditingId(m.id);
    setIsAdding(true);
  };

  const filteredMovements = movements.filter(m => 
    m.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.document.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[20px] lg:text-[24px] font-bold text-on-surface">Movimentações de Estoque</h1>
          <p className="text-[12px] lg:text-[13px] text-on-surface-variant">Rastreabilidade completa de recebimentos, baixas e transferências.</p>
        </div>
        <button 
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({ sku: '', quantity: 0, type: 'inbound', document: '', origin: '', destination: '' });
          }}
          className="h-10 px-4 sm:px-6 bg-primary text-on-primary rounded-lg font-bold text-[13px] shadow-sm flex items-center justify-center gap-2 shrink-0 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          Novo Registro
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-surface-container-low p-6 rounded-xl border border-primary/20 shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-on-surface">
                {editingId ? 'Editar Movimentação' : 'Registrar Fluxo de Estoque'}
              </h2>
              <button 
                onClick={() => { setIsAdding(false); setEditingId(null); }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider">Produto (SKU)</label>
                <select 
                  className="h-11 px-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={formData.sku}
                  onChange={e => setFormData({...formData, sku: e.target.value})}
                  required
                >
                  <option value="">Selecionar SKU...</option>
                  {products.map(p => <option key={p.id} value={p.sku}>{p.sku} - {p.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider">Quantidade</label>
                <input 
                  type="number"
                  min="1"
                  className="h-11 px-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 text-[14px] tabular-nums"
                  value={formData.quantity || ''}
                  onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider">Tipo de Fluxo</label>
                <select 
                  className="h-11 px-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 text-[14px] focus:outline-none"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as any})}
                >
                  <option value="inbound">Entrada (Recebimento)</option>
                  <option value="outbound">Saída (Baixa/Venda)</option>
                  <option value="transfer">Transferência entre Docas</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider">Documento de Referência</label>
                <input 
                  className="h-11 px-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 text-[14px]"
                  value={formData.document}
                  onChange={e => setFormData({...formData, document: e.target.value})}
                  placeholder="Ex: NF-e 45920 / Pedido #88"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider">Local de Origem</label>
                <input 
                  className="h-11 px-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 text-[14px]"
                  value={formData.origin}
                  onChange={e => setFormData({...formData, origin: e.target.value})}
                  placeholder="Ex: Doca 1"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider">Local de Destino</label>
                <input 
                  className="h-11 px-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 text-[14px]"
                  value={formData.destination}
                  onChange={e => setFormData({...formData, destination: e.target.value})}
                  placeholder="Ex: Prateleira A-02"
                />
              </div>

              <div className="lg:col-span-3 flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
                <button 
                  type="button" 
                  onClick={() => { setIsAdding(false); setEditingId(null); }} 
                  className="px-6 h-11 text-[14px] font-bold text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-colors"
                >
                  Descartar
                </button>
                <button 
                  type="submit" 
                  className="px-8 h-11 bg-primary text-on-primary rounded-xl font-bold text-[14px] shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95"
                >
                  {editingId ? 'Atualizar Registro' : 'Confirmar Lançamento'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden flex flex-col gap-4 p-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
          <input 
            className="w-full h-10 pl-10 pr-4 bg-surface-container-low rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Filtrar por Protocolo, SKU, Produto ou Documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto -mx-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low h-10 text-[11px] font-bold text-outline uppercase tracking-wider">
                <th className="px-6">Protocolo</th>
                <th className="px-4">Horário</th>
                <th className="px-4">Tipo</th>
                <th className="px-4">Referência</th>
                <th className="px-4">Produto</th>
                <th className="px-4 text-right">Quantidade</th>
                <th className="px-4">Operador</th>
                <th className="px-4 text-center">Status</th>
                <th className="px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="text-[13px] divide-y divide-outline-variant/10">
              {filteredMovements.map((m) => (
                <tr key={m.id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-primary font-mono">{m.protocol}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="block font-bold">{format(new Date(m.timestamp), 'HH:mm', { locale: ptBR })}</span>
                    <span className="text-[11px] text-outline">{format(new Date(m.timestamp), 'dd/MM/yyyy', { locale: ptBR })}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${
                        m.type === 'inbound' ? 'bg-tertiary' : 
                        m.type === 'outbound' ? 'bg-error' : 'bg-secondary'
                      }`} />
                      <span className={`text-[11px] font-bold uppercase tracking-tight ${
                        m.type === 'inbound' ? 'text-tertiary' : 
                        m.type === 'outbound' ? 'text-error' : 'text-secondary'
                      }`}>
                        {m.type === 'inbound' ? 'Entrada' : m.type === 'outbound' ? 'Saída' : 'Transf'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-on-surface-variant">{m.document || '---'}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col max-w-[200px]">
                      <span className="font-bold truncate">{m.productName}</span>
                      <span className="text-[11px] text-outline font-mono">{m.sku}</span>
                    </div>
                  </td>
                  <td className={`px-4 py-4 text-right font-bold tabular-nums ${m.quantity > 0 ? 'text-tertiary' : 'text-error'}`}>
                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity} {m.unit}
                  </td>
                  <td className="px-4 py-4 text-on-surface-variant font-medium">{m.operator}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-tertiary-container/20 text-tertiary text-[10px] font-bold uppercase">
                      Concluído
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(m);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-high hover:bg-primary/10 text-primary transition-all shadow-sm active:scale-95 border border-outline-variant/10"
                        title="Editar Registro"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation();
                          if (window.confirm(`Deseja realmente excluir permanentemente o registro ${m.protocol}? Esta ação é irreversível e o estoque será estornado.`)) {
                            onDeleteMovement(m); 
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-high hover:bg-error/10 text-error hover:bg-error hover:text-white transition-all shadow-sm active:scale-95 border border-outline-variant/10"
                        title="Excluir Registro"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMovements.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-outline italic">
                    Nenhuma movimentação encontrada para o filtro selecionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
