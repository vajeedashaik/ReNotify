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

  // Check if Supabase is configured
  const hasSupabaseConfig = typeof window !== 'undefined' && 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Fetch customers from Supabase on mount
  useEffect(() => {
    const fetchCustomers = async () => {
      if (hasSupabaseConfig) {
        try {
          const fetchedCustomers = await supabaseService.getCustomers();
          setCustomers(fetchedCustomers);
          setIsInitialized(true);
        } catch (error) {
          console.error('Failed to fetch customers from Supabase:', error);
          setCustomers([]);
          setIsInitialized(false);
        }
      } else {
        // If Supabase not configured, check dataset store
        if (datasetStore.isInitialized()) {
          setCustomers(datasetStore.getAllCustomers());
          setDatasetState(datasetStore.getDataset());
          setIsInitialized(true);
        } else {
          setCustomers([]);
          setIsInitialized(false);
        }
      }
      setLoading(false);
    };

    fetchCustomers();
  }, [hasSupabaseConfig]);

  const refreshCustomers = async () => {
    if (hasSupabaseConfig) {
      try {
        const fetchedCustomers = await supabaseService.getCustomers();
        setCustomers(fetchedCustomers);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to refresh customers:', error);
      }
    }
  };

  const setDataset = (rows: DatasetRow[]) => {
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
