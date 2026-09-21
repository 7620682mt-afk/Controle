'use-client';

import React from 'react';

interface HeaderProps {
  onNewOrder: () => void;
  onNewMovement: () => void;
  onMenuToggle?: () => void;
  onLogout?: () => void;
}

export function Header({ onNewOrder, onNewMovement, onMenuToggle, onLogout }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface/80 backdrop-blur-xl z-40 px-4 lg:px-6 flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/30">
      <div className="flex items-center gap-2 lg:gap-6 flex-1 max-w-xl">
        <button 
          onClick={onMenuToggle}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-low transition-colors text-on-surface"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="relative flex-1 hidden sm:flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-outline pointer-events-none text-[20px]">search</span>
          <input
            className="w-full h-9 pl-10 pr-14 bg-surface-container-lowest rounded-lg text-[13px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            placeholder="Buscar por SKU, produto, fornecedor ou lote..."
            type="text"
          />
          <kbd className="absolute right-2 px-1.5 py-0.5 rounded bg-surface-container text-[11px] font-semibold text-on-surface-variant border border-outline-variant/20">⌘K</kbd>
        </div>
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest text-tertiary shadow-[0_1px_2px_rgba(15,23,42,0.04)] shrink-0 border border-outline-variant/10">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
          <span className="text-[12px] text-on-surface">ERP:</span>
          <span className="text-[12px] text-tertiary font-bold tracking-tight">Online</span>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <button 
            onClick={onNewOrder}
            className="h-9 px-4 rounded-lg bg-surface-container-lowest text-on-surface text-[13px] font-semibold hover:bg-surface-container-low transition-colors shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex items-center gap-2 border border-outline-variant/20 hidden md:flex"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">add_shopping_cart</span>
            + Ordem
          </button>
          <button 
            onClick={onNewMovement}
            className="h-9 px-4 rounded-lg bg-primary text-on-primary text-[13px] font-bold hover:bg-primary-container transition-colors shadow-md flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
            <span className="hidden sm:inline">+ Movimentação</span>
            <span className="sm:hidden">+ Mov</span>
          </button>
        </div>

        <div className="h-8 w-px bg-outline-variant/30 hidden sm:block"></div>

        <button 
          onClick={onLogout}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container-lowest text-error hover:bg-error/10 transition-colors shadow-sm border border-outline-variant/20"
          title="Sair do Sistema"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
        </button>

        <div className="flex items-center gap-3 pl-2 hidden sm:flex">
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-[12px] shadow-sm">
            CE
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[13px] text-on-surface font-bold leading-tight">Carlos Eduardo</span>
            <span className="text-[11px] text-outline leading-tight font-medium">Gerente de Operações</span>
          </div>
        </div>
      </div>
    </header>
  );
}
