'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { useCRM } from '@/lib/use-crm';
import { LoginView } from '@/components/login';
import { supabase } from '@/lib/supabase';

import { DashboardView } from '@/views/dashboard';
import { ProductCatalogView } from '@/views/catalog';
import { MovementsView } from '@/views/movements';
import { OrdersView } from '@/views/orders';
import { SuppliersView } from '@/views/suppliers';
import { ReportsView } from '@/views/reports';

export default function Page() {
  const [activeView, setActiveView] = useState('visao-geral');
  const [triggerOrderForm, setTriggerOrderForm] = useState(0);
  const [triggerMovementForm, setTriggerMovementForm] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const crm = useCRM();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
      }
      setIsMounted(true);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('stockflow_session');
    setIsAuthenticated(false);
  };

  if (!isMounted || !crm.isLoaded) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginView onLogin={() => setIsAuthenticated(true)} />;
  }

  const handleNewOrder = () => {
    setActiveView('ordens-de-compra');
    setTriggerOrderForm(prev => prev + 1);
    setIsSidebarOpen(false);
  };

  const handleNewMovement = () => {
    setActiveView('movimentacoes');
    setTriggerMovementForm(prev => prev + 1);
    setIsSidebarOpen(false);
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
    setIsSidebarOpen(false);
  };

  const renderView = () => {
    switch (activeView) {
      case 'visao-geral': 
        return <DashboardView products={crm.products} movements={crm.movements} />;
      case 'catalogo-de-produtos': 
        return <ProductCatalogView 
          products={crm.products} 
          onAddProduct={crm.addProduct}
          onUpdateProduct={crm.updateProduct}
          onDeleteProduct={crm.deleteProduct}
        />;
      case 'movimentacoes': 
        return <MovementsView 
          movements={crm.movements} 
          products={crm.products} 
          onAddMovement={crm.addMovement} 
          onUpdateMovement={crm.updateMovement}
          onDeleteMovement={crm.deleteMovement}
          triggerAdd={triggerMovementForm}
        />;
      case 'ordens-de-compra': 
        return <OrdersView 
          orders={crm.orders} 
          suppliers={crm.suppliers} 
          onAddOrder={crm.addOrder}
          onUpdateOrder={crm.updateOrder}
          onDeleteOrder={crm.deleteOrder}
          triggerAdd={triggerOrderForm}
        />;
      case 'fornecedores-e-crm': 
        return <SuppliersView 
          suppliers={crm.suppliers}
          onAddSupplier={crm.addSupplier}
          onUpdateSupplier={crm.updateSupplier}
          onDeleteSupplier={crm.deleteSupplier}
        />;
      case 'relatorios-e-auditoria': 
        return <ReportsView 
          products={crm.products}
          movements={crm.movements}
          orders={crm.orders}
          suppliers={crm.suppliers}
        />;
      default: 
        return <DashboardView products={crm.products} movements={crm.movements} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-surface relative overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        activeView={activeView} 
        onViewChange={handleViewChange} 
        className={`transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      />
      
      <div className="flex-1 lg:pl-72 w-full min-w-0 transition-all">
        <Header 
          onNewOrder={handleNewOrder} 
          onNewMovement={handleNewMovement} 
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onLogout={handleLogout}
        />
        <main className="pt-16 min-h-[calc(100vh-64px)] overflow-y-auto w-full">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
