'use client';

import React from 'react';
import { Order, Supplier } from '@/lib/types';

interface OrdersViewProps {
  orders: Order[];
  suppliers: Supplier[];
  onAddOrder: (o: Order) => void;
  onUpdateOrder: (id: string, o: Partial<Order>) => void;
  onDeleteOrder: (o: Order) => void;
  triggerAdd?: number;
}

export function OrdersView({ orders, suppliers, onAddOrder, onUpdateOrder, onDeleteOrder, triggerAdd }: OrdersViewProps) {
  const [isAdding, setIsAdding] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    supplierId: '',
    itemsCount: 0,
    totalValue: 0,
    paymentTerms: '',
    expectedArrival: '',
    status: 'quotation' as any
  });

  React.useEffect(() => {
    if (triggerAdd && triggerAdd > 0) {
      const openForm = () => {
        setIsAdding(true);
        setEditingId(null);
        setFormData({ supplierId: '', itemsCount: 0, totalValue: 0, paymentTerms: '', expectedArrival: '', status: 'quotation' });
      };
      openForm();
    }
  }, [triggerAdd]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const supplier = suppliers.find(s => s.id === formData.supplierId);
    if (!supplier) return alert('Fornecedor não encontrado');

    if (editingId) {
      onUpdateOrder(editingId, {
        supplierId: formData.supplierId,
        supplierName: supplier.name,
        itemsCount: formData.itemsCount,
        totalValue: formData.totalValue,
        paymentTerms: formData.paymentTerms,
        expectedArrival: formData.expectedArrival,
        status: formData.status
      });
      setEditingId(null);
    } else {
      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        orderId: `OC-2024-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString(),
        supplierId: formData.supplierId,
        supplierName: supplier.name,
        itemsCount: formData.itemsCount,
        totalValue: formData.totalValue,
        paymentTerms: formData.paymentTerms,
        expectedArrival: formData.expectedArrival,
        status: formData.status
      };
      onAddOrder(newOrder);
      setIsAdding(false);
    }
    setFormData({ supplierId: '', itemsCount: 0, totalValue: 0, paymentTerms: '', expectedArrival: '', status: 'quotation' });
  };

  const handleEdit = (o: Order) => {
    setFormData({
      supplierId: o.supplierId,
      itemsCount: o.itemsCount,
      totalValue: o.totalValue,
      paymentTerms: o.paymentTerms,
      expectedArrival: o.expectedArrival.split('T')[0],
      status: o.status
    });
    setEditingId(o.id);
    setIsAdding(true);
  };

  return (
    <div className="p-4 lg:p-8 flex flex-col gap-6 lg:gap-8 max-w-[1600px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-surface-container-high text-primary font-semibold">SUPPLY CHAIN & CRM</span>
          </div>
          <h1 className="text-[24px] font-bold text-on-surface">Ordens de Compra & Reposição</h1>
          <p className="text-[13px] text-on-surface-variant max-w-3xl">Gestão de cotações e relacionamento estratégico com fornecedores.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="h-10 px-6 bg-primary text-on-primary rounded-lg font-bold text-[13px] shadow-sm"
        >
          + Nova Ordem de Compra
        </button>
      </div>

      {isAdding && (
        <div className="bg-surface-container-low p-6 rounded-xl border border-primary/20 shadow-sm animate-in fade-in slide-in-from-top-4">
          <h2 className="text-[16px] font-bold mb-4">{editingId ? 'Editar Pedido' : 'Gerar Nova Cotação'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-outline uppercase">Fornecedor</label>
              <select 
                className="h-10 px-3 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-[13px]"
                value={formData.supplierId}
                onChange={e => setFormData({...formData, supplierId: e.target.value})}
                required
              >
                <option value="">Selecionar Fornecedor...</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-outline uppercase">Total de Itens</label>
              <input 
                type="number"
                className="h-10 px-3 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-[13px]"
                value={formData.itemsCount}
                onChange={e => setFormData({...formData, itemsCount: parseInt(e.target.value)})}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-outline uppercase">Valor Total (R$)</label>
              <input 
                type="number"
                step="0.01"
                className="h-10 px-3 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-[13px]"
                value={formData.totalValue}
                onChange={e => setFormData({...formData, totalValue: parseFloat(e.target.value)})}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-outline uppercase">Condição Pagto</label>
              <input 
                className="h-10 px-3 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-[13px]"
                value={formData.paymentTerms}
                onChange={e => setFormData({...formData, paymentTerms: e.target.value})}
                placeholder="Ex: 30 DDL"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-outline uppercase">Previsão Chegada</label>
              <input 
                type="date"
                className="h-10 px-3 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-[13px]"
                value={formData.expectedArrival}
                onChange={e => setFormData({...formData, expectedArrival: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-outline uppercase">Status</label>
              <select 
                className="h-10 px-3 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-[13px]"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as any})}
              >
                <option value="quotation">Cotação</option>
                <option value="approved">Aprovado</option>
                <option value="shipped">Em Trânsito</option>
                <option value="received">Recebido</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
            <div className="md:col-span-3 flex justify-end gap-2 mt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-[13px] font-bold text-on-surface-variant">Cancelar</button>
              <button type="submit" className="px-6 py-2 bg-primary text-on-primary rounded-lg font-bold text-[13px]">Salvar Pedido</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 flex flex-col gap-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
            <div className="p-4 border-b border-outline-variant/10 bg-surface-container-low/30">
              <h2 className="text-[14px] font-bold">Pedidos em Aberto</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[11px] font-bold text-outline uppercase tracking-wider h-10">
                    <th className="px-6">Nº OC</th>
                    <th className="px-4">Fornecedor</th>
                    <th className="px-4 text-right">Valor Total</th>
                    <th className="px-4">Previsão</th>
                    <th className="px-4 text-center">Status</th>
                    <th className="px-6 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] divide-y divide-outline-variant/10">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-primary">{o.orderId}</span>
                          <span className="text-[11px] text-outline">{o.date.split('T')[0]}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-bold">{o.supplierName}</td>
                      <td className="px-4 py-4 text-right font-bold tabular-nums">
                        R$ {o.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-4">{o.expectedArrival.split('T')[0]}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          o.status === 'shipped' ? 'bg-primary-container text-on-primary' : 
                          o.status === 'approved' ? 'bg-tertiary-container text-on-tertiary' : 'bg-surface-container text-on-surface-variant'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEdit(o)}
                            className="w-8 h-8 flex items-center justify-center rounded bg-surface-container hover:bg-primary/10 text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Excluir o pedido ${o.orderId}?`)) {
                                onDeleteOrder(o);
                              }
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded bg-surface-container hover:bg-error/10 text-error transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20 flex flex-col gap-6">
            <h2 className="text-[16px] font-bold">Scorecard de Fornecedores</h2>
            <div className="flex flex-col gap-4">
              {suppliers.map((s) => (
                <div key={s.id} className="bg-surface-container-low/50 p-4 rounded-lg flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-primary-container text-on-primary-container font-bold text-[12px] flex items-center justify-center">
                        {s.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold">{s.name}</span>
                        <span className="text-[11px] text-outline">{s.category}</span>
                      </div>
                    </div>
                    <span className="text-[13px] font-bold text-tertiary">{s.scorecard} pts</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[11px] font-bold text-outline">
                        <span>Pontualidade</span>
                        <span>{s.punctuality}%</span>
                      </div>
                      <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                        <div className="bg-tertiary h-full" style={{ width: `${s.punctuality}%` }}></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[11px] font-bold text-outline">
                        <span>Qualidade</span>
                        <span>{s.qualityRate}%</span>
                      </div>
                      <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: `${s.qualityRate}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
