import { Product, Movement, Order, Supplier } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    sku: 'SKU-IND-4092',
    ean: '7891234567012',
    name: 'Inversor Trifásico 15kW Industrial',
    category: 'Material Elétrico',
    location: 'Rua A • Prateleira 04',
    stockLevel: 450,
    reservedStock: 70,
    minStock: 120,
    reorderPoint: 150,
    costPrice: 4250.00,
    sellPrice: 5990.00,
    abcClass: 'A',
    status: 'normal'
  },
  {
    id: '2',
    sku: 'SKU-MEC-8812',
    ean: '7899876543210',
    name: 'Rolamento Cônico Blindado SKF 32008',
    category: 'Peças & Componentes',
    location: 'Rua B • Prateleira 01',
    stockLevel: 18,
    reservedStock: 6,
    minStock: 50,
    reorderPoint: 60,
    costPrice: 138.50,
    sellPrice: 245.00,
    abcClass: 'A',
    status: 'critical'
  },
  {
    id: '3',
    sku: 'SKU-EMB-1029',
    ean: '7894561230894',
    name: 'Filme Stretch Automático 500x0,025mm',
    category: 'Embalagens',
    location: 'Rua D • Prateleira 02',
    stockLevel: 85,
    reservedStock: 5,
    minStock: 80,
    reorderPoint: 100,
    costPrice: 42.90,
    sellPrice: 68.00,
    abcClass: 'B',
    status: 'low'
  },
  {
    id: '4',
    sku: 'SKU-VAL-9011',
    ean: '7893216549870',
    name: 'Válvula Solenoide Pneumática 5/2 Vias 24V',
    category: 'Pneumática',
    location: 'Rua C • Prateleira 05',
    stockLevel: 0,
    reservedStock: 15,
    minStock: 30,
    reorderPoint: 40,
    costPrice: 215.00,
    sellPrice: 389.00,
    abcClass: 'A',
    status: 'out_of_stock'
  }
];

export const INITIAL_MOVEMENTS: Movement[] = [
  {
    id: 'm1',
    protocol: '#MOV-90412',
    timestamp: new Date().toISOString(),
    type: 'inbound',
    document: 'NF-e 492.102',
    sku: 'SKU-IND-4092',
    productName: 'Rolamento Blindado 6204-2RS',
    quantity: 500,
    unit: 'un',
    origin: 'Bosch Rexroth',
    destination: 'Galpão SP-01',
    operator: 'Patrícia L.',
    status: 'completed'
  },
  {
    id: 'm2',
    protocol: '#MOV-90411',
    timestamp: new Date().toISOString(),
    type: 'outbound',
    document: 'Ped. #8410',
    sku: 'SKU-MEC-8812',
    productName: 'Correia Sincronizadora HTD 8M',
    quantity: -120,
    unit: 'un',
    origin: 'Galpão SP-01',
    destination: 'Expedição B2B',
    operator: 'Roberto G.',
    status: 'completed'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'o1',
    orderId: 'OC-2024-8841',
    date: '2024-10-18T14:32:00',
    supplierId: 's1',
    supplierName: 'WEG Equipamentos Elétricos S.A.',
    itemsCount: 12,
    totalValue: 48960.00,
    paymentTerms: '30/60 DDL Faturado',
    expectedArrival: '2024-10-22T00:00:00',
    status: 'shipped'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 's1',
    cnpj: '84.429.695/0001-11',
    name: 'WEG Equipamentos Elétricos S.A.',
    category: 'Motores & Inversores',
    contactName: 'Marcos Silveira',
    scorecard: 98.4,
    punctuality: 99,
    qualityRate: 98,
    status: 'active'
  }
];
