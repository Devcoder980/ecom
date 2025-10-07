// ============================================
// TENANT CONTEXT
// Manages multi-tenant information across the app
// ============================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TenantInfo, getTenantInfo, getCurrentSubdomain } from '../utils/subdomain';

interface TenantContextType {
  tenantInfo: TenantInfo | null;
  loading: boolean;
  error: string | null;
  refreshTenantInfo: () => Promise<void>;
  isFeatureEnabled: (feature: keyof TenantInfo['features']) => boolean;
  getStorageStatus: () => { color: string; text: string; icon: string };
  getTenantDisplayName: () => string;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [tenantInfo, setTenantInfo] = useState<TenantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTenantInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const info = await getTenantInfo();
      setTenantInfo(info);
      
      console.log('🌐 Tenant info loaded:', {
        subdomain: info.subdomain,
        displayName: info.displayName,
        storageType: info.storageType,
        features: info.features,
      });
    } catch (err) {
      console.error('❌ Failed to load tenant info:', err);
      setError('Failed to load tenant information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTenantInfo();
  }, []);

  const isFeatureEnabled = (feature: keyof TenantInfo['features']): boolean => {
    if (!tenantInfo) return false;
    return tenantInfo.features[feature];
  };

  const getStorageStatus = () => {
    if (!tenantInfo) {
      return { color: 'text-gray-600', text: 'Unknown', icon: '❓' };
    }
    
    switch (tenantInfo.storageType) {
      case 'r2':
        return { color: 'text-green-600', text: 'CloudFlare R2', icon: '☁️' };
      case 'local':
        return { color: 'text-blue-600', text: 'Local Storage', icon: '💾' };
      default:
        return { color: 'text-gray-600', text: 'Unknown', icon: '❓' };
    }
  };

  const getTenantDisplayName = (): string => {
    if (!tenantInfo) return 'Loading...';
    
    if (tenantInfo.isDefault) {
      return tenantInfo.displayName;
    }
    return `${tenantInfo.displayName} (${tenantInfo.subdomain})`;
  };

  const value: TenantContextType = {
    tenantInfo,
    loading,
    error,
    refreshTenantInfo,
    isFeatureEnabled,
    getStorageStatus,
    getTenantDisplayName,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
