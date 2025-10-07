// ============================================
// FILE UPLOAD STATUS COMPONENT
// Shows upload progress and storage information
// ============================================

import React from 'react';
import { useTenant } from '../contexts/TenantContext';
import { formatFileSize, isFileSizeValid, isFileTypeAllowed } from '../utils/subdomain';

interface FileUploadStatusProps {
  uploading: boolean;
  fieldName: string;
  file?: File;
  files?: File[];
  error?: string;
  success?: boolean;
  uploadedUrl?: string;
}

const FileUploadStatus: React.FC<FileUploadStatusProps> = ({
  uploading,
  fieldName,
  file,
  files,
  error,
  success,
  uploadedUrl,
}) => {
  const { tenantInfo, getStorageStatus } = useTenant();

  if (!tenantInfo) return null;

  const storageStatus = getStorageStatus();
  const isMultiple = files && files.length > 0;
  const currentFiles = isMultiple ? files : (file ? [file] : []);

  const validateFiles = () => {
    if (!currentFiles.length) return { valid: true, errors: [] };
    
    const errors: string[] = [];
    
    currentFiles.forEach((f, index) => {
      // Check file size
      if (!isFileSizeValid(f, tenantInfo.limits.maxFileSize)) {
        errors.push(`File ${index + 1}: Size exceeds ${formatFileSize(tenantInfo.limits.maxFileSize)} limit`);
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
      if (!isFileTypeAllowed(f, allowedTypes)) {
        errors.push(`File ${index + 1}: Invalid file type. Only images and PDFs allowed`);
      }
    });
    
    return { valid: errors.length === 0, errors };
  };

  const validation = validateFiles();

  return (
    <div className="space-y-3">
      {/* Storage Status */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Storage:</span>
        <div className={`flex items-center ${storageStatus.color}`}>
          <span className="mr-1">{storageStatus.icon}</span>
          <span>{storageStatus.text}</span>
        </div>
      </div>

      {/* File Information */}
      {currentFiles.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">Selected Files:</div>
          {currentFiles.map((f, index) => (
            <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
              <span className="truncate flex-1 mr-2">{f.name}</span>
              <span className="text-gray-500">{formatFileSize(f.size)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Validation Errors */}
      {!validation.valid && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <span className="text-red-600 mr-2">⚠️</span>
            <span className="text-red-800 font-medium">Validation Errors</span>
          </div>
          <ul className="text-sm text-red-700 space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-800">Uploading to {storageStatus.text}...</span>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && uploadedUrl && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center">
            <span className="text-green-600 mr-2">✅</span>
            <span className="text-green-800">File uploaded successfully</span>
          </div>
          <div className="mt-2 text-sm text-green-700">
            <a 
              href={uploadedUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              View uploaded file
            </a>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center">
            <span className="text-red-600 mr-2">❌</span>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Storage Limits */}
      <div className="text-xs text-gray-500 space-y-1">
        <div>Max file size: {formatFileSize(tenantInfo.limits.maxFileSize)}</div>
        <div>Max files: {tenantInfo.limits.maxFiles}</div>
        <div>Storage quota: {formatFileSize(tenantInfo.limits.storageQuota)}</div>
      </div>
    </div>
  );
};

export default FileUploadStatus;
