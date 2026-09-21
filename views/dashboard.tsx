'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, PieChart, Pie } from 'recharts';
import { Product, Movement } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardProps {
  products: Product[];
  movements: Movement[];
}

export function DashboardView({ products, movements }: DashboardProps) {
  // KPI Calculations
  const totalStockValue = products.reduce((acc, p) => acc + (p.stockLevel * p.costPrice), 0);
  const totalItems = products.length;
  const criticalItems = products.filter(p => p.status === 'critical' || p.status === 'out_of_stock').length;
  const otif = 98.4; // Fixed for demo, would be calculated from delivery data

  // Chart Data: Movements
  const chartData = [
    { month: 'Jun', entradas: 3200, saidas: 3840 },
    { month: 'Jul', entradas: 4100, saidas: 3650 },
    { month: 'Ago', entradas: 2900, saidas: 4250 },
    { month: 'Set', entradas: 4800, saidas: 4400 },
    { month: 'Out', entradas: 5120, saidas: 4900 },
    { month: 'Nov', entradas: 4300, saidas: 4600 },
  ];

  // ABC Data
  const abcData = [
    { name: 'Classe A', value: 70, color: '#0037b0' },
    { name: 'Classe B', value: 20, color: '#565e74' },
    { name: 'Classe C', value: 10, color: '#c4c5d7' },
  ];

  return (
    <div className="p-4 lg:p-8 flex flex-col gap-6 lg:gap-8 max-w-[1600px] mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-4 lg:p-6 rounded-xl shadow-sm border border-outline-variant/20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-primary-fixed text-on-primary-fixed uppercase tracking-wider">Centro de Comando</span>
            <span className="text-[11px] font-medium text-outline">• Atualizado em tempo real</span>
          </div>
          <h1 className="text-[20px] lg:text-[24px] font-bold text-on-surface">Dashboard de Estoque & Operações</h1>
          <p className="text-[12px] lg:text-[13px] text-on-surface-variant max-w-2xl">
            Acompanhamento de níveis de estoque, giro de mercadorias e alertas críticos para tomada de decisão ágil.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-surface-container-low rounded-lg px-3 py-1.5 shadow-sm border border-outline-variant/10">
            <span className="material-symbols-outlined text-outline text-[18px] mr-2">warehouse</span>
            <span className="text-[13px] font-bold">Galpão Central</span>
          </div>
          <button className="h-9 px-4 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-[13px] font-bold shadow-sm transition-all flex items-center gap-2 border border-outline-variant/20">
            <span className="material-symbols-outlined text-[18px] text-primary">download</span>
            Exportar
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        <KPICard 
          label="Valor em Estoque" 
          value={`R$ ${totalStockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          trend="+4.2%"
          trendLabel="vs. mês anterior"
          icon="account_balance_wallet"
          color="primary"
        />
        <KPICard 
          label="Total de SKUs Ativos" 
          value={totalItems.toString()}
          trend="99.1%"
          trendLabel="Catalogados"
          icon="category"
          color="secondary"
        />
        <KPICard 
          label="Críticos / Reposição" 
          value={criticalItems.toString()}
          trend="Ação Necessária"
          trendLabel={`${criticalItems} itens em risco`}
          icon="warning"
          color="error"
          isAlert
        />
        <KPICard 
          label="Taxa de Atendimento" 
          value={`${otif}%`}
          trend="Meta >= 98%"
          trendLabel="OTIF Saudável"
          icon="verified"
          color="tertiary"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-bold text-on-surface">Fluxo de Movimentações</h2>
              <p className="text-[12px] text-outline">Entradas vs. Saídas (Últimos 6 meses)</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                <span className="text-[11px] font-bold text-on-surface-variant">Entradas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                <span className="text-[11px] font-bold text-on-surface-variant">Saídas</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="entradas" fill="#1d4ed8" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="saidas" fill="#565e74" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-4">
            <h3 className="text-[16px] font-bold text-on-surface">Curva ABC</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={abcData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {abcData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {abcData.map((item) => (
                <div key={item.name} className="bg-surface-container-low p-2 rounded text-center">
                  <span className="text-[11px] font-bold block">{item.name}</span>
                  <span className="text-[13px] font-bold text-primary">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Movements Table */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-on-surface">Últimas Movimentações</h2>
          <button className="text-[12px] font-bold text-primary hover:underline">Ver Todos</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold text-outline uppercase tracking-wider border-b border-outline-variant/20 h-10">
                <th className="pb-2">SKU</th>
                <th className="pb-2">Produto</th>
                <th className="pb-2">Tipo</th>
                <th className="pb-2 text-right">Qtd</th>
                <th className="pb-2">Horário</th>
                <th className="pb-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-[13px] divide-y divide-outline-variant/10">
              {movements.slice(0, 5).map((m) => (
                <tr key={m.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3 font-mono font-bold text-primary">{m.sku}</td>
                  <td className="py-3 font-medium">{m.productName}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                      m.type === 'inbound' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-secondary-container text-on-secondary-container'
                    }`}>
                      {m.type === 'inbound' ? 'Entrada' : 'Saída'}
                    </span>
                  </td>
                  <td className={`py-3 text-right font-bold tabular-nums ${m.quantity > 0 ? 'text-tertiary' : 'text-error'}`}>
                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                  </td>
                  <td className="py-3 text-outline font-medium">{format(new Date(m.timestamp), 'HH:mm:ss')}</td>
                  <td className="py-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-tertiary-container/10 text-tertiary text-[11px] font-bold">
                      Concluído
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, trend, trendLabel, icon, color, isAlert }: any) {
  const colorMap: any = {
    primary: 'bg-primary-fixed text-primary',
    secondary: 'bg-secondary-fixed text-secondary',
    error: 'bg-error-container text-error',
    tertiary: 'bg-tertiary-fixed text-tertiary',
  };

  return (
    <div className={`bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md ${isAlert ? 'ring-1 ring-error/20' : ''}`}>
      {isAlert && <div className="absolute top-0 right-0 w-1.5 h-full bg-error"></div>}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-bold text-outline uppercase tracking-wider">{label}</span>
        <div className={`w-8 h-8 rounded-lg ${colorMap[color]} flex items-center justify-center`}>
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[24px] font-bold text-on-surface tabular-nums">{value}</span>
        <div className="flex items-center gap-1.5">
          <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
            trend.startsWith('+') || color === 'tertiary' ? 'bg-tertiary-container/10 text-tertiary' : 'bg-surface-container text-on-surface-variant'
          }`}>
            {trend}
          </span>
          <span className="text-[11px] text-outline font-medium">{trendLabel}</span>
        </div>
      </div>
    </div>
  );
}
