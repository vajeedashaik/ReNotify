'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DatasetRow, Customer } from '../types';
import { datasetStore } from '../data/datasetStore';
import { supabaseService } from '../data/supabaseService';

interface DatasetContextType {
  dataset: DatasetRow[];
  customers: Customer[];
  isInitialized: boolean;
  setDataset: (rows: DatasetRow[]) => void;
  clearDataset: () => void;
  refreshCustomers: () => Promise<void>;
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined);

export function DatasetProvider({ children }: { children: React.ReactNode }) {
  const [dataset, setDatasetState] = useState<DatasetRow[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch customers from Supabase on mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const fetchedCustomers = await supabaseService.getCustomers();
        setCustomers(fetchedCustomers);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to fetch customers from Supabase:', error);
        // If it's a configuration error, show empty state but don't crash
        if (error instanceof Error && error.message.includes('not configured')) {
          console.warn('Supabase not configured. Please check your .env.local file and restart the dev server.');
        }
        setCustomers([]);
        setIsInitialized(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();

    // Listen for dataset updates
    const handleDatasetUpdate = () => {
      fetchCustomers();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('datasetUpdated', handleDatasetUpdate);
      return () => {
        window.removeEventListener('datasetUpdated', handleDatasetUpdate);
      };
    }
  }, []);

  const refreshCustomers = async () => {
    try {
      const fetchedCustomers = await supabaseService.getCustomers();
      setCustomers(fetchedCustomers);
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to refresh customers:', error);
    }
  };

  const setDataset = (rows: DatasetRow[]) => {
    // This is mainly for backwards compatibility
    // In production, data should come from Supabase
    datasetStore.setDataset(rows);
    setDatasetState(rows);
    setCustomers(datasetStore.getAllCustomers());
    setIsInitialized(true);
  };

  const clearDataset = () => {
    datasetStore.clear();
    setDatasetState([]);
    setCustomers([]);
    setIsInitialized(false);
  };

  return (
    <DatasetContext.Provider
      value={{
        dataset,
        customers,
        isInitialized,
        setDataset,
        clearDataset,
        refreshCustomers,
      }}
    >
      {children}
    </DatasetContext.Provider>
  );
}

export function useDataset() {
  const context = useContext(DatasetContext);
  if (context === undefined) {
    throw new Error('useDataset must be used within a DatasetProvider');
  }
  return context;
}
