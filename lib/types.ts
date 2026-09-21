export interface Product {
  id: string;
  sku: string;
  ean: string;
  name: string;
  category: string;
  location: string;
  stockLevel: number;
  reservedStock: number;
  minStock: number;
  reorderPoint: number;
  costPrice: number;
  sellPrice: number;
  abcClass: 'A' | 'B' | 'C';
  status: 'normal' | 'low' | 'critical' | 'out_of_stock';
}

export interface Movement {
  id: string;
  protocol: string;
  timestamp: string;
  type: 'inbound' | 'outbound' | 'transfer' | 'adjustment';
  document: string;
  sku: string;
  productName: string;
  quantity: number;
  unit: string;
  origin: string;
  destination: string;
  operator: string;
  status: 'pending' | 'in_transit' | 'completed' | 'audited';
}

export interface Order {
  id: string;
  orderId: string;
  date: string;
  supplierId: string;
  supplierName: string;
  itemsCount: number;
  totalValue: number;
  paymentTerms: string;
  expectedArrival: string;
  status: 'quotation' | 'approved' | 'shipped' | 'received' | 'cancelled';
  isAiSuggested?: boolean;
}

export interface Supplier {
  id: string;
  cnpj: string;
  name: string;
  category: string;
  contactName: string;
  scorecard: number;
  punctuality: number;
  qualityRate: number;
  status: 'active' | 'suspended' | 'under_review';
}
