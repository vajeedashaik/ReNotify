import { DatasetRow, Customer } from '../types';
import { transformDatasetToCustomers } from './dataTransformers';

class DatasetStore {
  private dataset: DatasetRow[] = [];
  private customers: Customer[] = [];
  private initialized = false;

  setDataset(rows: DatasetRow[]): void {
    this.dataset = rows;
    this.customers = transformDatasetToCustomers(rows);
    this.initialized = true;
  }

  getDataset(): DatasetRow[] {
    return this.dataset;
  }

  getAllCustomers(): Customer[] {
    return this.customers;
  }

  getCustomerByMobile(mobile: string): Customer | undefined {
    const normalizedMobile = mobile.trim();
    return this.customers.find(c => c.customer_mobile === normalizedMobile);
  }

  getCustomerById(id: string): Customer | undefined {
    return this.customers.find(c => c.id === id);
  }

  getProductById(customerId: string, productId: string) {
    const customer = this.getCustomerById(customerId);
    return customer?.products.find(p => p.id === productId);
  }

  getAllProducts() {
    return this.customers.flatMap(customer => 
      customer.products.map(product => ({
        ...product,
        customer_mobile: customer.customer_mobile,
        customer_id: customer.id,
      }))
    );
  }

  getAllInvoices() {
    return this.customers.flatMap(customer =>
      customer.products.map(product => ({
        id: `inv-${product.invoice_id}`,
        invoice_id: product.invoice_id,
        customer_mobile: customer.customer_mobile,
        retailer_name: product.retailer_name,
        purchase_date: product.purchase_date,
        product_category: 'Home Appliances', // Default, can be enhanced
        product_name: product.product_name,
        brand: product.brand,
        model_number: product.model_number,
        serial_number: product.serial_number,
        amount: 0, // Not in dataset, can be enhanced
      }))
    );
  }

  getAllAlerts() {
    const alerts: any[] = [];
    
    this.customers.forEach(customer => {
      customer.products.forEach(product => {
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
      });
    });
    
    return alerts;
  }

  getKPIs() {
    const totalCustomers = this.customers.length;
    const totalProducts = this.customers.reduce((acc, c) => acc + c.products.length, 0);
    const activeWarranties = this.customers.reduce((acc, c) => 
      acc + c.products.filter(p => p.warranty.status === 'active').length, 0
    );
    const expiringWarranties30 = this.customers.reduce((acc, c) => 
      acc + c.products.filter(p => p.warranty.status === 'expiring_soon').length, 0
    );
    const activeAMCs = this.customers.reduce((acc, c) => 
      acc + c.products.filter(p => p.amc.status === 'active').length, 0
    );
    const upcomingServices = this.customers.reduce((acc, c) => 
      acc + c.products.filter(p => p.service_reminder.days_until_due <= 30).length, 0
    );
    
    return {
      totalCustomers,
      totalProducts,
      activeWarranties,
      expiringWarranties30,
      activeAMCs,
      upcomingServices,
    };
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  clear(): void {
    this.dataset = [];
    this.customers = [];
    this.initialized = false;
  }
}

// Singleton instance
export const datasetStore = new DatasetStore();
