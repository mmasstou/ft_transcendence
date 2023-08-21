import React, { createContext, useContext, useState } from 'react';

interface Data {
  someProperty: string;
  // Add more properties as needed
}

interface DataContextValue {
  data: Data | null;
  updateData: (newData: Data) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Data | null>(null);

  const updateData = (newData: Data) => {
    setData(newData);
  };

  const contextValue: DataContextValue = { data, updateData };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
