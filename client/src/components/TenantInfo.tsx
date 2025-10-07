// ============================================
// TENANT INFO COMPONENT
// Displays current tenant information and storage status
// ============================================

import React from 'react';
import { useTenant } from '../contexts/TenantContext';
import { formatFileSize, getStorageQuotaStatus } from '../utils/subdomain';

const TenantInfo: React.FC = () => {
  const { tenantInfo, loading, error, getStorageStatus, getTenantDisplayName } = useTenant();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-red-600 mr-2">❌</span>
          <span className="text-red-800">{error}</span>
        </div>
      </div>
    );
  }

  if (!tenantInfo) {
    return null;
  }

  const storageStatus = getStorageStatus();
  const displayName = getTenantDisplayName();

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {displayName}
        </h3>
        <div className={`flex items-center text-sm ${storageStatus.color}`}>
          <span className="mr-1">{storageStatus.icon}</span>
          <span>{storageStatus.text}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subdomain:</span>
          <span className="font-medium">{tenantInfo.subdomain}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Storage Type:</span>
          <span className={`font-medium ${storageStatus.color}`}>
            {storageStatus.text}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Max File Size:</span>
          <span className="font-medium">{formatFileSize(tenantInfo.limits.maxFileSize)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Storage Quota:</span>
          <span className="font-medium">{formatFileSize(tenantInfo.limits.storageQuota)}</span>
        </div>

        <div className="pt-2 border-t">
          <div className="text-sm text-gray-600 mb-1">Features:</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(tenantInfo.features).map(([feature, enabled]) => (
              <span
                key={feature}
                className={`px-2 py-1 rounded-full text-xs ${
                  enabled
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {enabled ? '✅' : '❌'} {feature.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantInfo;
