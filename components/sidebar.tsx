'use-client';

import React from 'react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  className?: string;
}

export function Sidebar({ activeView, onViewChange, className = '' }: SidebarProps) {
  const navItems = [
    { id: 'visao-geral', icon: 'dashboard', label: 'Visão Geral' },
    { id: 'catalogo-de-produtos', icon: 'inventory_2', label: 'Catálogo de Produtos' },
    { id: 'movimentacoes', icon: 'sync_alt', label: 'Movimentações' },
    { id: 'ordens-de-compra', icon: 'shopping_cart', label: 'Ordens de Compra' },
    { id: 'fornecedores-e-crm', icon: 'domain', label: 'Fornecedores & CRM' },
    { id: 'relatorios-e-auditoria', icon: 'bar_chart', label: 'Relatórios & Auditoria' },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] ${className}`}>
      <div className="flex flex-col">
        <div className="h-16 px-6 flex items-center justify-between bg-surface-container-lowest">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[20px]">inventory</span>
            </div>
            <div className="flex flex-col">
              <span className="font-jakarta font-bold text-[16px] text-on-surface leading-tight">StockFlow</span>
              <span className="font-inter text-[11px] text-outline tracking-wider uppercase font-semibold">CRM & Estoque</span>
            </div>
          </div>
          <span className="px-1 py-0.5 rounded text-[11px] font-semibold bg-surface-container text-on-surface-variant">v2.4</span>
        </div>
        
        <div className="px-6 pt-6">
          <span className="text-[11px] font-bold text-outline uppercase tracking-wider px-2">Operação & Gestão</span>
        </div>

        <nav className="flex flex-col gap-1 px-4 pt-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left ${
                activeView === item.id
                  ? 'bg-primary-container text-on-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${activeView === item.id ? 'material-symbols-fill' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[13px]">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-2 p-4 bg-surface-container-lowest">
        <div className="bg-surface-container-low rounded-lg p-2 flex flex-col gap-1">
          <label className="text-[11px] font-bold text-outline flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">warehouse</span>Depósito Ativo
          </label>
          <div className="flex items-center justify-between bg-surface-container-lowest px-2 py-1 rounded shadow-[0_1px_2px_rgba(15,23,42,0.04)] cursor-pointer">
            <span className="text-[13px] font-medium text-on-surface truncate">Galpão Central - SP 01</span>
            <span className="material-symbols-outlined text-outline text-[18px]">expand_more</span>
          </div>
        </div>
        
        <nav className="flex flex-col gap-1">
          <button className="flex items-center gap-3 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors text-left">
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span className="text-[13px]">Configurações</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors text-left">
            <span className="material-symbols-outlined text-[20px]">help</span>
            <span className="text-[13px]">Ajuda & Suporte</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
