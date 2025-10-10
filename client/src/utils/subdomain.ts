// ============================================
// SUBDOMAIN DETECTION UTILITY
// Handles multi-tenant subdomain detection
// ============================================

export interface TenantInfo {
  subdomain: string;
  isDefault: boolean;
  displayName: string;
  storageType: 'tigris' | 'local';
  features: {
    fileUpload: boolean;
    analytics: boolean;
    seo: boolean;
    multiLanguage: boolean;
  };
  limits: {
    maxFileSize: number;
    maxFiles: number;
    storageQuota: number;
  };
}

// Get current subdomain from window.location
export const getCurrentSubdomain = (): string => {
  if (typeof window === 'undefined') return 'default';
  
  const hostname = window.location.hostname;
  
  // Handle localhost and IP addresses
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
    return 'default';
  }
  
  // Extract subdomain
  const parts = hostname.split('.');
  if (parts.length >= 3) {
    const subdomain = parts[0];
    // Skip 'www' subdomain
    if (subdomain === 'www') {
      return 'default';
    }
    return subdomain;
  }
  
  return 'default';
};

// Get tenant information
export const getTenantInfo = async (): Promise<TenantInfo> => {
  try {
    const subdomain = getCurrentSubdomain();
    
    // Fetch tenant configuration from backend
    const response = await fetch(`http://localhost:5000/api/tenant/info?subdomain=${subdomain}`);
    
    if (response.ok) {
      const tenantData = await response.json();
      return {
        subdomain: tenantData.subdomain || subdomain,
        isDefault: tenantData.isDefault || subdomain === 'default',
        displayName: tenantData.displayName || `${subdomain} Store`,
        storageType: tenantData.storageType || 'local',
        features: tenantData.features || {
          fileUpload: true,
          analytics: true,
          seo: true,
          multiLanguage: false,
        },
        limits: tenantData.limits || {
          maxFileSize: 10 * 1024 * 1024, // 10MB
          maxFiles: 10,
          storageQuota: 10 * 1024 * 1024 * 1024, // 10GB
        },
      };
    }
  } catch (error) {
    console.warn('Failed to fetch tenant info, using defaults:', error);
  }
  
  // Fallback to default configuration
  return {
    subdomain: getCurrentSubdomain(),
    isDefault: true,
    displayName: 'Default Store',
    storageType: 'local',
    features: {
      fileUpload: true,
      analytics: true,
      seo: true,
      multiLanguage: false,
    },
    limits: {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10,
      storageQuota: 10 * 1024 * 1024 * 1024, // 10GB
    },
  };
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Check if file size is within limits
export const isFileSizeValid = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};

// Check if file type is allowed
export const isFileTypeAllowed = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

// Get storage status indicator
export const getStorageStatus = (storageType: 'tigris' | 'local'): { color: string; text: string; icon: string } => {
  switch (storageType) {
    case 'tigris':
      return {
        color: 'text-purple-600',
        text: 'Tigris Storage',
        icon: '🚀',
      };
    case 'local':
      return {
        color: 'text-blue-600',
        text: 'Local Storage',
        icon: '💾',
      };
    default:
      return {
        color: 'text-gray-600',
        text: 'Unknown',
        icon: '❓',
      };
  }
};

// Get tenant display name with subdomain
export const getTenantDisplayName = (tenantInfo: TenantInfo): string => {
  if (tenantInfo.isDefault) {
    return tenantInfo.displayName;
  }
  return `${tenantInfo.displayName} (${tenantInfo.subdomain})`;
};

// Check if feature is enabled for tenant
export const isFeatureEnabled = (tenantInfo: TenantInfo, feature: keyof TenantInfo['features']): boolean => {
  return tenantInfo.features[feature];
};

// Get storage quota usage percentage
export const getStorageUsagePercentage = (usedBytes: number, quotaBytes: number): number => {
  return Math.min((usedBytes / quotaBytes) * 100, 100);
};

// Get storage quota status
export const getStorageQuotaStatus = (percentage: number): { color: string; text: string } => {
  if (percentage >= 90) {
    return { color: 'text-red-600', text: 'Critical' };
  } else if (percentage >= 75) {
    return { color: 'text-yellow-600', text: 'Warning' };
  } else {
    return { color: 'text-green-600', text: 'Good' };
  }
};
