import { Customer, Invoice, Alert, Activity, Product } from '../types';

// Helper function to calculate days between dates
const daysBetween = (date1: string, date2: string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Helper function to get status based on dates
const getWarrantyStatus = (endDate: string): 'active' | 'expired' | 'expiring_soon' => {
  const days = daysBetween(new Date().toISOString().split('T')[0], endDate);
  if (days < 0) return 'expired';
  if (days <= 30) return 'expiring_soon';
  return 'active';
};

const getAMCStatus = (endDate: string | null, active: boolean): 'active' | 'inactive' | 'expiring_soon' => {
  if (!active || !endDate) return 'inactive';
  const days = daysBetween(new Date().toISOString().split('T')[0], endDate);
  if (days < 0) return 'inactive';
  if (days <= 30) return 'expiring_soon';
  return 'active';
};

// Mock customers with products
export const mockCustomers: Customer[] = [
  {
    id: '1',
    customer_mobile: '+91 98765 43210',
    consent_flag: true,
    city: 'Mumbai',
    pincode: '400001',
    products: [
      {
        id: 'p1',
        product_name: 'Air Conditioner',
        brand: 'LG',
        model_number: 'LG-AC-2024',
        serial_number: 'SN123456789',
        retailer_name: 'Reliance Digital',
        invoice_id: 'INV-001',
        purchase_date: '2023-06-15',
        warranty: {
          warranty_type: 'Standard',
          warranty_start: '2023-06-15',
          warranty_end: '2025-06-15',
          status: getWarrantyStatus('2025-06-15'),
          days_remaining: daysBetween(new Date().toISOString().split('T')[0], '2025-06-15'),
        },
        amc: {
          amc_active: true,
          amc_end_date: '2025-12-15',
          status: getAMCStatus('2025-12-15', true),
          days_remaining: daysBetween(new Date().toISOString().split('T')[0], '2025-12-15'),
        },
        service_reminder: {
          next_service_due: '2024-12-20',
          days_until_due: daysBetween(new Date().toISOString().split('T')[0], '2024-12-20'),
        },
      },
      {
        id: 'p2',
        product_name: 'Washing Machine',
        brand: 'Samsung',
        model_number: 'WM-2024',
        serial_number: 'SN987654321',
        retailer_name: 'Croma',
        invoice_id: 'INV-002',
        purchase_date: '2023-08-20',
        warranty: {
          warranty_type: 'Extended',
          warranty_start: '2023-08-20',
          warranty_end: '2026-08-20',
          status: getWarrantyStatus('2026-08-20'),
          days_remaining: daysBetween(new Date().toISOString().split('T')[0], '2026-08-20'),
        },
        amc: {
          amc_active: false,
          amc_end_date: null,
          status: 'inactive',
        },
        service_reminder: {
          next_service_due: '2024-11-15',
          days_until_due: daysBetween(new Date().toISOString().split('T')[0], '2024-11-15'),
        },
      },
    ],
  },
  {
    id: '2',
    customer_mobile: '+91 91234 56789',
    consent_flag: false,
    city: 'Delhi',
    pincode: '110001',
    products: [
      {
        id: 'p3',
        product_name: 'Refrigerator',
        brand: 'Whirlpool',
        model_number: 'WP-RF-2024',
        serial_number: 'SN456789123',
        retailer_name: 'Vijay Sales',
        invoice_id: 'INV-003',
        purchase_date: '2023-03-10',
        warranty: {
          warranty_type: 'Standard',
          warranty_start: '2023-03-10',
          warranty_end: '2025-03-10',
          status: getWarrantyStatus('2025-03-10'),
          days_remaining: daysBetween(new Date().toISOString().split('T')[0], '2025-03-10'),
        },
        amc: {
          amc_active: true,
          amc_end_date: '2024-12-10',
          status: getAMCStatus('2024-12-10', true),
          days_remaining: daysBetween(new Date().toISOString().split('T')[0], '2024-12-10'),
        },
        service_reminder: {
          next_service_due: '2024-10-25',
          days_until_due: daysBetween(new Date().toISOString().split('T')[0], '2024-10-25'),
        },
      },
    ],
  },
  {
    id: '3',
    customer_mobile: '+91 99887 66554',
    consent_flag: true,
    city: 'Bangalore',
    pincode: '560001',
    products: [
      {
        id: 'p4',
        product_name: 'Television',
        brand: 'Sony',
        model_number: 'SONY-TV-55',
        serial_number: 'SN789123456',
        retailer_name: 'Reliance Digital',
        invoice_id: 'INV-004',
        purchase_date: '2022-11-05',
        warranty: {
          warranty_type: 'Standard',
          warranty_start: '2022-11-05',
          warranty_end: '2024-11-05',
          status: getWarrantyStatus('2024-11-05'),
          days_remaining: daysBetween(new Date().toISOString().split('T')[0], '2024-11-05'),
        },
        amc: {
          amc_active: true,
          amc_end_date: '2025-11-05',
          status: getAMCStatus('2025-11-05', true),
          days_remaining: daysBetween(new Date().toISOString().split('T')[0], '2025-11-05'),
        },
        service_reminder: {
          next_service_due: '2024-10-30',
          days_until_due: daysBetween(new Date().toISOString().split('T')[0], '2024-10-30'),
        },
      },
    ],
  },
  {
    id: '4',
    customer_mobile: '+91 98765 12345',
    consent_flag: true,
    city: 'Mumbai',
    pincode: '400070',
    products: [
      {
        id: 'p5',
        product_name: 'Microwave Oven',
        brand: 'IFB',
        model_number: 'IFB-MW-2024',
        serial_number: 'SN321654987',
        retailer_name: 'Croma',
        invoice_id: 'INV-005',
        purchase_date: '2024-01-15',
        warranty: {
          warranty_type: 'Standard',
          warranty_start: '2024-01-15',
          warranty_end: '2026-01-15',
          status: getWarrantyStatus('2026-01-15'),
          days_remaining: daysBetween(new Date().toISOString().split('T')[0], '2026-01-15'),
        },
        amc: {
          amc_active: false,
          amc_end_date: null,
          status: 'inactive',
        },
        service_reminder: {
          next_service_due: '2024-12-15',
          days_until_due: daysBetween(new Date().toISOString().split('T')[0], '2024-12-15'),
        },
      },
    ],
  },
  {
    id: '5',
    customer_mobile: '+91 91234 87654',
    consent_flag: false,
    city: 'Pune',
    pincode: '411001',
    products: [
      {
        id: 'p6',
        product_name: 'Dishwasher',
        brand: 'Bosch',
        model_number: 'BOSCH-DW-2024',
        serial_number: 'SN654321987',
        retailer_name: 'Vijay Sales',
        invoice_id: 'INV-006',
        purchase_date: '2023-09-12',
        warranty: {
          warranty_type: 'Extended',
          warranty_start: '2023-09-12',
          warranty_end: '2026-09-12',
          status: getWarrantyStatus('2026-09-12'),
          days_remaining: daysBetween(new Date().toISOString().split('T')[0], '2026-09-12'),
        },
        amc: {
          amc_active: true,
          amc_end_date: '2025-09-12',
          status: getAMCStatus('2025-09-12', true),
          days_remaining: daysBetween(new Date().toISOString().split('T')[0], '2025-09-12'),
        },
        service_reminder: {
          next_service_due: '2024-11-20',
          days_until_due: daysBetween(new Date().toISOString().split('T')[0], '2024-11-20'),
        },
      },
    ],
  },
];

// Generate invoices from customers
export const mockInvoices: Invoice[] = mockCustomers.flatMap(customer =>
  customer.products.map(product => ({
    id: `inv-${product.invoice_id}`,
    invoice_id: product.invoice_id,
    customer_mobile: customer.customer_mobile,
    retailer_name: product.retailer_name,
    purchase_date: product.purchase_date,
    product_category: 'Home Appliances',
    product_name: product.product_name,
    brand: product.brand,
    model_number: product.model_number,
    serial_number: product.serial_number,
    amount: Math.floor(Math.random() * 50000) + 10000,
  }))
);

// Generate alerts from customers
export const mockAlerts: Alert[] = mockCustomers.flatMap(customer =>
  customer.products.flatMap(product => {
    const alerts: Alert[] = [];
    
    // Service due alerts
    if (product.service_reminder.days_until_due <= 30) {
      alerts.push({
        id: `alert-service-${product.id}`,
        type: 'service_due',
        customer_mobile: customer.customer_mobile,
        customer_id: customer.id,
        product_name: product.product_name,
        product_id: product.id,
        due_date: product.service_reminder.next_service_due,
        consent_flag: customer.consent_flag,
        days_until: product.service_reminder.days_until_due,
      });
    }
    
    // Warranty expiring alerts
    if (product.warranty.status === 'expiring_soon' || product.warranty.status === 'expired') {
      alerts.push({
        id: `alert-warranty-${product.id}`,
        type: 'warranty_expiring',
        customer_mobile: customer.customer_mobile,
        customer_id: customer.id,
        product_name: product.product_name,
        product_id: product.id,
        due_date: product.warranty.warranty_end,
        consent_flag: customer.consent_flag,
        days_until: product.warranty.days_remaining || 0,
      });
    }
    
    // AMC ending alerts
    if (product.amc.status === 'expiring_soon' || (product.amc.status === 'active' && product.amc.days_remaining && product.amc.days_remaining <= 30)) {
      alerts.push({
        id: `alert-amc-${product.id}`,
        type: 'amc_ending',
        customer_mobile: customer.customer_mobile,
        customer_id: customer.id,
        product_name: product.product_name,
        product_id: product.id,
        due_date: product.amc.amc_end_date || '',
        consent_flag: customer.consent_flag,
        days_until: product.amc.days_remaining || 0,
      });
    }
    
    return alerts;
  })
);

// Generate activities
export const mockActivities: Activity[] = [
  {
    id: 'act1',
    type: 'warranty_expiring',
    message: 'Warranty expiring soon for Sony Television',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    customer_id: '3',
    product_id: 'p4',
  },
  {
    id: 'act2',
    type: 'service_due',
    message: 'Service due today for LG Air Conditioner',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    customer_id: '1',
    product_id: 'p1',
  },
  {
    id: 'act3',
    type: 'amc_ending',
    message: 'AMC ending for Whirlpool Refrigerator',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    customer_id: '2',
    product_id: 'p3',
  },
  {
    id: 'act4',
    type: 'customer_added',
    message: 'New customer added: +91 98765 12345',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    customer_id: '4',
  },
  {
    id: 'act5',
    type: 'invoice_uploaded',
    message: 'Invoice INV-006 uploaded',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Helper functions
export const getCustomerById = (id: string): Customer | undefined => {
  return mockCustomers.find(c => c.id === id);
};

export const getProductById = (customerId: string, productId: string): Product | undefined => {
  const customer = getCustomerById(customerId);
  return customer?.products.find(p => p.id === productId);
};

export const getKPIs = () => {
  const totalCustomers = mockCustomers.length;
  const activeWarranties = mockCustomers.reduce((acc, customer) => 
    acc + customer.products.filter(p => p.warranty.status === 'active').length, 0
  );
  const activeAMCs = mockCustomers.reduce((acc, customer) => 
    acc + customer.products.filter(p => p.amc.status === 'active').length, 0
  );
  const upcomingServices = mockCustomers.reduce((acc, customer) => 
    acc + customer.products.filter(p => p.service_reminder.days_until_due <= 30).length, 0
  );
  
  return {
    totalCustomers,
    activeWarranties,
    activeAMCs,
    upcomingServices,
  };
};
