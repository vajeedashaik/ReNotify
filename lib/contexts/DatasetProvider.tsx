'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DatasetRow, Customer } from '../types';
import { datasetStore } from '../data/datasetStore';
import { mockCustomers } from '../data/mockData';
import { transformDatasetToCustomers } from '../data/dataTransformers';

interface DatasetContextType {
  dataset: DatasetRow[];
  customers: Customer[];
  isInitialized: boolean;
  setDataset: (rows: DatasetRow[]) => void;
  clearDataset: () => void;
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined);

export function DatasetProvider({ children }: { children: React.ReactNode }) {
  const [dataset, setDatasetState] = useState<DatasetRow[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize with mock data if no dataset uploaded
  useEffect(() => {
    if (!datasetStore.isInitialized() && dataset.length === 0) {
      // Use mock data as fallback
      setCustomers(mockCustomers);
      setIsInitialized(true);
    }
  }, []);

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

  // Sync with store
  useEffect(() => {
    if (datasetStore.isInitialized()) {
      setCustomers(datasetStore.getAllCustomers());
      setDatasetState(datasetStore.getDataset());
      setIsInitialized(true);
    }
  }, []);

  return (
    <DatasetContext.Provider
      value={{
        dataset,
        customers,
        isInitialized,
        setDataset,
        clearDataset,
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
