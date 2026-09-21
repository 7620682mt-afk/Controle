'use client';

import React, { useState } from 'react';
import { Supplier } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface SuppliersViewProps {
  suppliers: Supplier[];
  onAddSupplier: (supplier: Supplier) => void;
  onUpdateSupplier: (id: string, updated: Partial<Supplier>) => void;
  onDeleteSupplier: (supplier: Supplier) => void;
}

export function SuppliersView({ 
  suppliers, 
  onAddSupplier, 
  onUpdateSupplier, 
  onDeleteSupplier 
}: SuppliersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    category: '',
    contactName: '',
    status: 'active' as Supplier['status']
  });

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.cnpj.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdateSupplier(editingId, formData);
    } else {
      onAddSupplier({
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        scorecard: 90, // Initial values
        punctuality: 95,
        qualityRate: 98
      });
    }
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', cnpj: '', category: '', contactName: '', status: 'active' });
  };

  const handleEdit = (s: Supplier) => {
    setFormData({
      name: s.name,
      cnpj: s.cnpj,
      category: s.category,
      contactName: s.contactName,
      status: s.status
    });
    setEditingId(s.id);
    setIsAdding(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success bg-success/10';
    if (score >= 70) return 'text-warning bg-warning/10';
    return 'text-error bg-error/10';
  };

  return (
    <div className="p-4 lg:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[20px] lg:text-[24px] font-bold text-on-surface">Fornecedores & CRM</h1>
          <p className="text-[12px] lg:text-[13px] text-on-surface-variant">Base de dados de parceiros homologados e gestão de performance.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="h-10 px-4 sm:px-6 bg-primary text-on-primary rounded-lg font-bold text-[13px] shadow-sm flex items-center justify-center gap-2 shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Novo Fornecedor
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-surface-container-low p-6 rounded-xl border border-primary/20 shadow-sm overflow-hidden"
          >
            <h2 className="text-[16px] font-bold mb-4">{editingId ? 'Editar Fornecedor' : 'Cadastrar Fornecedor'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-outline uppercase">Razão Social</label>
                <input 
                  required
                  className="h-10 px-3 bg-surface-container-lowest rounded-lg text-[13px] border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-outline uppercase">CNPJ</label>
                <input 
                  required
                  className="h-10 px-3 bg-surface-container-lowest rounded-lg text-[13px] border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={formData.cnpj}
                  onChange={e => setFormData({...formData, cnpj: e.target.value})}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-outline uppercase">Categoria</label>
                <input 
                  required
                  className="h-10 px-3 bg-surface-container-lowest rounded-lg text-[13px] border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-outline uppercase">Contato Principal</label>
                <input 
                  required
                  className="h-10 px-3 bg-surface-container-lowest rounded-lg text-[13px] border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={formData.contactName}
                  onChange={e => setFormData({...formData, contactName: e.target.value})}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-outline uppercase">Status</label>
                <select 
                  className="h-10 px-3 bg-surface-container-lowest rounded-lg text-[13px] border border-outline-variant/30 focus:outline-none"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value as Supplier['status']})}
                >
                  <option value="active">Ativo</option>
                  <option value="under_review">Em Revisão</option>
                  <option value="suspended">Suspenso</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button type="submit" className="h-10 px-6 bg-primary text-on-primary rounded-lg font-bold text-[13px] flex-1">
                  {editingId ? 'Salvar Alterações' : 'Confirmar Cadastro'}
                </button>
                <button 
                  type="button"
                  onClick={() => { setIsAdding(false); setEditingId(null); }}
                  className="h-10 px-4 bg-surface-container-high rounded-lg font-bold text-[13px]"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-4 overflow-hidden">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
          <input 
            className="w-full h-10 pl-10 pr-4 bg-surface-container-low rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Buscar fornecedor por nome ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto -mx-4">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-4 py-3 text-[11px] font-bold text-outline uppercase">Fornecedor</th>
                <th className="px-4 py-3 text-[11px] font-bold text-outline uppercase text-center">Scorecard</th>
                <th className="px-4 py-3 text-[11px] font-bold text-outline uppercase">Categoria</th>
                <th className="px-4 py-3 text-[11px] font-bold text-outline uppercase">Contato</th>
                <th className="px-4 py-3 text-[11px] font-bold text-outline uppercase">Status</th>
                <th className="px-4 py-3 text-[11px] font-bold text-outline uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map(s => (
                <tr key={s.id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold">{s.name}</span>
                      <span className="text-[11px] text-outline">{s.cnpj}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex flex-col items-center">
                        <span className={`text-[13px] font-bold px-2 py-0.5 rounded-full ${getScoreColor(s.scorecard)}`}>
                          {s.scorecard}%
                        </span>
                        <span className="text-[9px] text-outline font-bold mt-1 uppercase">Geral</span>
                      </div>
                      <div className="flex flex-col items-center opacity-60">
                        <span className="text-[12px] font-medium">{s.punctuality}%</span>
                        <span className="text-[9px] text-outline font-bold uppercase">Prazo</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-secondary/10 text-secondary rounded text-[11px] font-bold uppercase tracking-tight">
                      {s.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium">{s.contactName}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${
                        s.status === 'active' ? 'bg-success' : 
                        s.status === 'under_review' ? 'bg-warning' : 'bg-error'
                      }`} />
                      <span className="text-[12px] font-medium">
                        {s.status === 'active' ? 'Ativo' : 
                         s.status === 'under_review' ? 'Em Revisão' : 'Suspenso'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(s)}
                        className="w-8 h-8 flex items-center justify-center rounded bg-surface-container-high text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Excluir o fornecedor ${s.name}?`)) {
                            onDeleteSupplier(s);
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded bg-surface-container-high text-error hover:bg-error hover:text-white transition-all shadow-sm"
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
