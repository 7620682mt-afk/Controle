'use client';

import { useState, useEffect } from 'react';
import { Product, Movement, Order, Supplier } from './types';
import { INITIAL_PRODUCTS, INITIAL_MOVEMENTS, INITIAL_ORDERS, INITIAL_SUPPLIERS } from './mock-data';

export function useCRM() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, movementsRes, ordersRes, suppliersRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/movements'),
          fetch('/api/orders'),
          fetch('/api/suppliers')
        ]);

        const productsData = await productsRes.json();
        const movementsData = await movementsRes.json();
        const ordersData = await ordersRes.json();
        const suppliersData = await suppliersRes.json();

        // Fallback to mock data if API fails or returns error (e.g. no keys)
        setProducts(Array.isArray(productsData) ? productsData : INITIAL_PRODUCTS);
        setMovements(Array.isArray(movementsData) ? movementsData : INITIAL_MOVEMENTS);
        setOrders(Array.isArray(ordersData) ? ordersData : INITIAL_ORDERS);
        setSuppliers(Array.isArray(suppliersData) ? suppliersData : INITIAL_SUPPLIERS);
      } catch (error) {
        console.error('Failed to fetch data from Supabase:', error);
        setProducts(INITIAL_PRODUCTS);
        setMovements(INITIAL_MOVEMENTS);
        setOrders(INITIAL_ORDERS);
        setSuppliers(INITIAL_SUPPLIERS);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchData();
  }, []);

  const addMovement = async (movement: Movement) => {
    // Optimistic update
    setMovements(prev => [movement, ...prev]);
    
    // Update product stock locally
    let updatedProduct: Product | undefined;
    setProducts(prev => prev.map(p => {
      if (p.sku === movement.sku) {
        const newStock = p.stockLevel + movement.quantity;
        let newStatus: Product['status'] = 'normal';
        
        if (newStock <= 0) newStatus = 'out_of_stock';
        else if (newStock < p.reorderPoint) newStatus = 'critical';
        else if (newStock < p.minStock) newStatus = 'low';
        else newStatus = 'normal';

        updatedProduct = { ...p, stockLevel: newStock, status: newStatus };
        return updatedProduct;
      }
      return p;
    }));

    // Server update
    try {
      await fetch('/api/movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movement)
      });
      if (updatedProduct) {
        await fetch('/api/products', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct)
        });
      }
    } catch (error) {
      console.error('Failed to sync movement with Supabase:', error);
    }
  };

  const updateMovement = async (id: string, updated: Partial<Movement>) => {
    const oldMovement = movements.find(m => m.id === id);
    if (!oldMovement) return;

    setMovements(prev => prev.map(m => m.id === id ? { ...m, ...updated } : m));

    let updatedProduct: Product | undefined;
    if (updated.quantity !== undefined && updated.quantity !== oldMovement.quantity) {
      const diff = updated.quantity - oldMovement.quantity;
      setProducts(prev => prev.map(p => {
        if (p.sku === oldMovement.sku) {
          const newStock = p.stockLevel + diff;
          let newStatus: Product['status'] = 'normal';
          if (newStock <= 0) newStatus = 'out_of_stock';
          else if (newStock < p.reorderPoint) newStatus = 'critical';
          else if (newStock < p.minStock) newStatus = 'low';
          updatedProduct = { ...p, stockLevel: newStock, status: newStatus };
          return updatedProduct;
        }
        return p;
      }));
    }

    try {
      await fetch('/api/movements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updated })
      });
      if (updatedProduct) {
        await fetch('/api/products', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct)
        });
      }
    } catch (error) {
      console.error('Failed to update movement in Supabase:', error);
    }
  };

  const deleteMovement = async (movement: Movement) => {
    setMovements(prev => prev.filter(m => m.id !== movement.id));

    let updatedProduct: Product | undefined;
    setProducts(prev => prev.map(p => {
      if (p.sku === movement.sku) {
        const newStock = p.stockLevel - movement.quantity;
        let newStatus: Product['status'] = 'normal';
        if (newStock <= 0) newStatus = 'out_of_stock';
        else if (newStock < p.reorderPoint) newStatus = 'critical';
        else if (newStock < p.minStock) newStatus = 'low';
        else newStatus = 'normal';

        updatedProduct = { ...p, stockLevel: newStock, status: newStatus };
        return updatedProduct;
      }
      return p;
    }));

    try {
      await fetch(`/api/movements?id=${movement.id}`, { method: 'DELETE' });
      if (updatedProduct) {
        await fetch('/api/products', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct)
        });
      }
    } catch (error) {
      console.error('Failed to delete movement in Supabase:', error);
    }
  };

  const addOrder = async (order: Order) => {
    setOrders(prev => [order, ...prev]);
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
    } catch (error) {
      console.error('Failed to add order to Supabase:', error);
    }
  };

  const updateOrder = async (id: string, updated: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updated } : o));
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updated })
      });
    } catch (error) {
      console.error('Failed to update order in Supabase:', error);
    }
  };

  const deleteOrder = async (order: Order) => {
    setOrders(prev => prev.filter(o => o.id !== order.id));
    try {
      await fetch(`/api/orders?id=${order.id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete order in Supabase:', error);
    }
  };

  const addProduct = async (product: Product) => {
    setProducts(prev => [product, ...prev]);
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
    } catch (error) {
      console.error('Failed to add product to Supabase:', error);
    }
  };

  const updateProduct = async (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    try {
      await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updated })
      });
    } catch (error) {
      console.error('Failed to update product in Supabase:', error);
    }
  };

  const deleteProduct = async (product: Product) => {
    setProducts(prev => prev.filter(p => p.id !== product.id));
    try {
      await fetch(`/api/products?id=${product.id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete product in Supabase:', error);
    }
  };

  const addSupplier = async (supplier: Supplier) => {
    setSuppliers(prev => [supplier, ...prev]);
    try {
      await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplier)
      });
    } catch (error) {
      console.error('Failed to add supplier to Supabase:', error);
    }
  };

  const updateSupplier = async (id: string, updated: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
    try {
      await fetch('/api/suppliers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updated })
      });
    } catch (error) {
      console.error('Failed to update supplier in Supabase:', error);
    }
  };

  const deleteSupplier = async (supplier: Supplier) => {
    setSuppliers(prev => prev.filter(s => s.id !== supplier.id));
    try {
      await fetch(`/api/suppliers?id=${supplier.id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete supplier in Supabase:', error);
    }
  };

  return {
    products,
    movements,
    orders,
    suppliers,
    addMovement,
    updateMovement,
    deleteMovement,
    addOrder,
    updateOrder,
    deleteOrder,
    addProduct,
    updateProduct,
    deleteProduct,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    isLoaded
  };
}
