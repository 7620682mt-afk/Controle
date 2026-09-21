'use client';

import React, { useState } from 'react';
import { Product, Movement, Order, Supplier } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

interface ReportsViewProps {
  products: Product[];
  movements: Movement[];
  orders: Order[];
  suppliers: Supplier[];
}

export function ReportsView({ products, movements, orders, suppliers }: ReportsViewProps) {
  const [activeReport, setActiveReport] = useState('inventory');

  // Analytical Calculations
  const totalCostValue = products.reduce((acc, p) => acc + (p.stockLevel * p.costPrice), 0);
  const totalSellValue = products.reduce((acc, p) => acc + (p.stockLevel * p.sellPrice), 0);
  const potentialProfit = totalSellValue - totalCostValue;
  
  const movementsByType = movements.reduce((acc: any, m) => {
    acc[m.type] = (acc[m.type] || 0) + Math.abs(m.quantity);
    return acc;
  }, {});

  const pieData = [
    { name: 'Entradas', value: movementsByType.inbound || 0, color: '#0037b0' },
    { name: 'Saídas', value: movementsByType.outbound || 0, color: '#d32f2f' },
    { name: 'Transf.', value: movementsByType.transfer || 0, color: '#565e74' },
  ];

  const handleExport = (type: string) => {
    alert(`Iniciando geração de arquivo ${type.toUpperCase()}... O download começará em instantes.`);
  };

  return (
    <div className="p-4 lg:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[20px] lg:text-[24px] font-bold text-on-surface">Relatórios & Auditoria</h1>
          <p className="text-[12px] lg:text-[13px] text-on-surface-variant">Inteligência de dados e rastreabilidade fiscal para tomada de decisão.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleExport('pdf')}
            className="h-10 px-4 bg-surface-container-high hover:bg-surface-container text-[13px] font-bold rounded-lg flex items-center gap-2 border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-[18px] text-error">picture_as_pdf</span>
            PDF
          </button>
          <button 
            onClick={() => handleExport('csv')}
            className="h-10 px-4 bg-surface-container-high hover:bg-surface-container text-[13px] font-bold rounded-lg flex items-center gap-2 border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">table_view</span>
            CSV / Excel
          </button>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl w-fit border border-outline-variant/10">
        {[
          { id: 'inventory', label: 'Valuation & Estoque', icon: 'account_balance_wallet' },
          { id: 'movements', label: 'Fluxo & Movimento', icon: 'sync_alt' },
          { id: 'audit', label: 'Logs de Auditoria', icon: 'history' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${
              activeReport === tab.id 
                ? 'bg-primary text-on-primary shadow-md' 
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {activeReport === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
              <h3 className="text-[14px] font-bold text-outline uppercase tracking-wider mb-6">Resumo de Valuation</h3>
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-[12px] text-outline">Valor Total de Custo</span>
                  <p className="text-[28px] font-bold text-on-surface">R$ {totalCostValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="h-px bg-outline-variant/20" />
                <div>
                  <span className="text-[12px] text-outline">Valor Total de Venda</span>
                  <p className="text-[28px] font-bold text-primary">R$ {totalSellValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-tertiary-container/20 p-4 rounded-xl border border-tertiary/20">
                  <span className="text-[11px] font-bold text-tertiary uppercase">Margem de Lucro Bruta</span>
                  <p className="text-[20px] font-bold text-tertiary">R$ {potentialProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
              <h3 className="text-[14px] font-bold text-outline uppercase tracking-wider mb-6">Concentração ABC</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
            <h3 className="text-[14px] font-bold text-outline uppercase tracking-wider mb-6">Curva de Estoque por SKU</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[11px] font-bold text-outline uppercase tracking-wider border-b border-outline-variant/20 h-10">
                    <th className="pb-2 px-2">Produto</th>
                    <th className="pb-2 px-2 text-right">Saldo</th>
                    <th className="pb-2 px-2 text-right">Custo Total</th>
                    <th className="pb-2 px-2 text-right">Venda Total</th>
                    <th className="pb-2 px-2 text-right">Markup</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] divide-y divide-outline-variant/10">
                  {products.sort((a, b) => (b.stockLevel * b.costPrice) - (a.stockLevel * a.costPrice)).slice(0, 10).map(p => (
                    <tr key={p.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex flex-col">
                          <span className="font-bold">{p.name}</span>
                          <span className="text-[11px] text-outline">{p.sku}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right font-mono font-bold">{p.stockLevel}</td>
                      <td className="py-3 px-2 text-right tabular-nums">R$ {(p.stockLevel * p.costPrice).toLocaleString('pt-BR')}</td>
                      <td className="py-3 px-2 text-right tabular-nums">R$ {(p.stockLevel * p.sellPrice).toLocaleString('pt-BR')}</td>
                      <td className="py-3 px-2 text-right text-tertiary font-bold">
                        {(((p.sellPrice - p.costPrice) / p.costPrice) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeReport === 'movements' && (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm animate-in fade-in duration-300">
           <h3 className="text-[14px] font-bold text-outline uppercase tracking-wider mb-6">Heatmap de Movimentações</h3>
           <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={movements.slice(-20)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="timestamp" tickFormatter={(t) => format(new Date(t), 'HH:mm')} />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="quantity" stroke="#1d4ed8" fill="#1d4ed8" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
           </div>
        </div>
      )}

      {activeReport === 'audit' && (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm animate-in fade-in duration-300 overflow-hidden">
          <h3 className="text-[14px] font-bold text-outline uppercase tracking-wider mb-6">Histórico de Alterações (Imutável)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold text-outline uppercase tracking-wider border-b border-outline-variant/20 h-10">
                  <th className="pb-2">Evento</th>
                  <th className="pb-2">Operador</th>
                  <th className="pb-2">Data/Hora</th>
                  <th className="pb-2">Módulo</th>
                  <th className="pb-2">Impacto</th>
                </tr>
              </thead>
              <tbody className="text-[13px] divide-y divide-outline-variant/10">
                {movements.map(m => (
                  <tr key={m.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${m.type === 'inbound' ? 'bg-tertiary' : 'bg-error'}`} />
                        <span className="font-bold">{m.type === 'inbound' ? 'RECEBIMENTO' : 'BAIXA'} FISCAL</span>
                      </div>
                    </td>
                    <td className="py-4 font-medium">{m.operator}</td>
                    <td className="py-4 text-outline">{format(new Date(m.timestamp), "dd/MM/yy 'às' HH:mm:ss")}</td>
                    <td className="py-4">
                      <span className="px-2 py-0.5 bg-surface-container rounded text-[11px] font-bold text-on-surface-variant">WMS_CORE</span>
                    </td>
                    <td className="py-4 font-mono font-bold">{m.quantity > 0 ? `+${m.quantity}` : m.quantity} UN</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
