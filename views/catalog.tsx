'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCatalogProps {
  products: Product[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (id: string, p: Partial<Product>) => void;
  onDeleteProduct: (p: Product) => void;
}

export function ProductCatalogView({ products, onAddProduct, onUpdateProduct, onDeleteProduct }: ProductCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    sku: '',
    ean: '',
    name: '',
    category: '',
    location: '',
    stockLevel: 0,
    minStock: 0,
    reorderPoint: 0,
    costPrice: 0,
    sellPrice: 0,
    abcClass: 'B' as 'A' | 'B' | 'C'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const calculateStatus = (stock: number, min: number, reorder: number): Product['status'] => {
      if (stock <= 0) return 'out_of_stock';
      if (stock < reorder) return 'critical';
      if (stock < min) return 'low';
      return 'normal';
    };

    const status = calculateStatus(formData.stockLevel, formData.minStock, formData.reorderPoint);

    if (editingId) {
      onUpdateProduct(editingId, { ...formData, status });
      setEditingId(null);
    } else {
      const newProduct: Product = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        reservedStock: 0,
        status
      };
      onAddProduct(newProduct);
      setIsAdding(false);
    }
    setFormData({
      sku: '', ean: '', name: '', category: '', location: '',
      stockLevel: 0, minStock: 0, reorderPoint: 0, costPrice: 0, sellPrice: 0, abcClass: 'B'
    });
  };

  const handleEdit = (p: Product) => {
    setFormData({
      sku: p.sku, ean: p.ean, name: p.name, category: p.category, location: p.location,
      stockLevel: p.stockLevel, minStock: p.minStock, reorderPoint: p.reorderPoint,
      costPrice: p.costPrice, sellPrice: p.sellPrice, abcClass: p.abcClass
    });
    setEditingId(p.id);
    setIsAdding(true);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 lg:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-[20px] lg:text-[24px] font-bold text-on-surface">Inventário & Catálogo de SKUs</h1>
        <p className="text-[12px] lg:text-[13px] text-on-surface-variant">Gerenciamento completo de saldo físico e pontos de reposição.</p>
      </div>

      <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-4 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input 
              className="w-full h-10 pl-10 pr-4 bg-surface-container-low rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Buscar por nome ou SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <select 
              className="flex-1 sm:flex-none h-10 px-4 bg-surface-container-low rounded-lg text-[13px] font-bold focus:outline-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Status</option>
              <option value="normal">Normal</option>
              <option value="low">Baixo</option>
              <option value="critical">Crítico</option>
              <option value="out_of_stock">Falta</option>
            </select>
            <button 
              onClick={() => {
                setFormData({
                  sku: '', ean: '', name: '', category: '', location: '',
                  stockLevel: 0, minStock: 0, reorderPoint: 0, costPrice: 0, sellPrice: 0, abcClass: 'B'
                });
                setEditingId(null);
                setIsAdding(true);
              }}
              className="h-10 px-4 sm:px-6 bg-primary text-on-primary rounded-lg font-bold text-[13px] shadow-sm shrink-0"
            >
              + Novo
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-surface-container-low p-6 rounded-xl border border-primary/20 shadow-sm mb-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-on-surface">
                {editingId ? 'Editar SKU' : 'Cadastrar Novo Item'}
              </h2>
              <button 
                onClick={() => { setIsAdding(false); setEditingId(null); }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-2 flex flex-col gap-1">
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider">Nome do Produto</label>
                <input 
                  className="h-11 px-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Ex: Teclado Mecânico RGB"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider">SKU</label>
                <input 
                  className="h-11 px-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 text-[14px] font-mono"
                  placeholder="EX: PROD-001"
                  value={formData.sku}
                  onChange={e => setFormData({...formData, sku: e.target.value})}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider">EAN / Barcode</label>
                <input 
                  className="h-11 px-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 text-[14px] font-mono"
                  placeholder="7890000000000"
                  value={formData.ean}
                  onChange={e => setFormData({...formData, ean: e.target.value})}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider">Categoria</label>
                <input 
                  className="h-11 px-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 text-[14px]"
                  placeholder="Ex: Eletrônicos"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider">Localização (WMS)</label>
                <input 
                  className="h-11 px-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 text-[14px]"
                  placeholder="Ex: A-12-3"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider">Classe ABC</label>
                <select 
                  className="h-11 px-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 text-[14px] focus:outline-none"
                  value={formData.abcClass}
                  onChange={e => setFormData({...formData, abcClass: e.target.value as any})}
                >
                  <option value="A">Curva A (Alto Impacto)</option>
                  <option value="B">Curva B (Médio Impacto)</option>
                  <option value="C">Curva C (Baixo Impacto)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider">Preço de Custo (R$)</label>
                <input 
                  type="number"
                  step="0.01"
                  className="h-11 px-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 text-[14px] tabular-nums"
                  value={formData.costPrice || ''}
                  onChange={e => setFormData({...formData, costPrice: parseFloat(e.target.value) || 0})}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider">Preço de Venda (R$)</label>
                <input 
                  type="number"
                  step="0.01"
                  className="h-11 px-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 text-[14px] tabular-nums"
                  value={formData.sellPrice || ''}
                  onChange={e => setFormData({...formData, sellPrice: parseFloat(e.target.value) || 0})}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider">Estoque Atual</label>
                <input 
                  type="number"
                  className="h-11 px-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 text-[14px] tabular-nums"
                  value={formData.stockLevel || 0}
                  onChange={e => setFormData({...formData, stockLevel: parseInt(e.target.value) || 0})}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider">Mínimo de Segurança</label>
                <input 
                  type="number"
                  className="h-11 px-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 text-[14px] tabular-nums"
                  value={formData.minStock || 0}
                  onChange={e => setFormData({...formData, minStock: parseInt(e.target.value) || 0})}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider">Ponto de Ressuprimento</label>
                <input 
                  type="number"
                  className="h-11 px-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 text-[14px] tabular-nums"
                  value={formData.reorderPoint || 0}
                  onChange={e => setFormData({...formData, reorderPoint: parseInt(e.target.value) || 0})}
                  required
                />
              </div>

              <div className="lg:col-span-4 flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
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
                  {editingId ? 'Atualizar SKU' : 'Salvar no Catálogo'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
        </AnimatePresence>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold text-outline uppercase tracking-wider border-b border-outline-variant/20 h-10">
                <th className="px-4">SKU / EAN</th>
                <th className="px-4">Produto</th>
                <th className="px-4">Localização</th>
                <th className="px-4">Saldo Físico</th>
                <th className="px-4">Ponto Rep.</th>
                <th className="px-4 text-right">Custo Unit.</th>
                <th className="px-4 text-center">Status</th>
                <th className="px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="text-[13px] divide-y divide-outline-variant/10">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-primary">{p.sku}</span>
                      <span className="text-[10px] text-outline font-mono">{p.ean}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[18px]">package_2</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold">{p.name}</span>
                        <span className="text-[11px] text-outline">{p.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[12px] font-medium text-on-surface flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-outline">location_on</span>
                      {p.location}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className={`font-bold tabular-nums ${p.status === 'out_of_stock' ? 'text-error' : ''}`}>
                        {p.stockLevel} un
                      </span>
                      <div className="w-20 h-1 bg-surface-container rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${p.status === 'critical' || p.status === 'out_of_stock' ? 'bg-error' : 'bg-primary'}`} 
                          style={{ width: `${Math.min(100, (p.stockLevel / p.minStock) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-outline">Mín: {p.minStock}</span>
                      <span className="text-[11px] font-bold text-on-surface">Ponto: {p.reorderPoint}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-bold tabular-nums">
                    R$ {p.costPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(p);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-high hover:bg-primary/10 text-primary transition-all shadow-sm active:scale-95 border border-outline-variant/10"
                        title="Editar Produto"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation();
                          if (window.confirm(`Deseja realmente excluir o SKU ${p.sku} (${p.name})?`)) {
                            onDeleteProduct(p);
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-high hover:bg-error/10 text-error hover:bg-error hover:text-white transition-all shadow-sm active:scale-95 border border-outline-variant/10"
                        title="Excluir Produto"
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
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    normal: { label: 'Normal', class: 'bg-tertiary-fixed text-on-tertiary-fixed' },
    low: { label: 'Baixo', class: 'bg-secondary-container text-on-secondary-container' },
    critical: { label: 'Crítico', class: 'bg-error-container text-error' },
    out_of_stock: { label: 'Sem Estoque', class: 'bg-error text-on-error' },
  };
  const config = configs[status] || configs.normal;
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${config.class}`}>
      {config.label}
    </span>
  );
}
