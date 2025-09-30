import React, { useState, useRef } from 'react';
import axios from 'axios';

interface FileInfo {
  fileUrl: string;
  fullUrl: string;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  uploadedAt: string;
}

interface MultipleFileUploadProps {
  fieldName: string;
  value?: string[] | FileInfo[];
  onChange: (files: FileInfo[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  label?: string;
  required?: boolean;
}

const MultipleFileUpload: React.FC<MultipleFileUploadProps> = ({
  fieldName,
  value = [],
  onChange,
  accept = '*/*',
  maxFiles = 10,
  maxSize = 10,
  label,
  required = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    await uploadFiles(Array.from(files));
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);

    const files = Array.from(event.dataTransfer.files);
    if (files.length === 0) return;

    await uploadFiles(files);
  };

  const uploadFiles = async (files: File[]) => {
    // Validate file count
    if (value.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed. Currently have ${value.length} files.`);
      return;
    }

    // Validate each file
    for (const file of files) {
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        return;
      }

      // Validate file type if accept is specified
      if (accept && accept !== '*/*') {
        const allowedTypes = accept.split(',').map(type => type.trim());
        const fileType = file.type;
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        
        const isAllowed = allowedTypes.some(type => {
          if (type.startsWith('.')) {
            return type === fileExtension;
          } else if (type.includes('/*')) {
            const baseType = type.split('/')[0];
            return fileType.startsWith(baseType + '/');
          } else {
            return fileType === type;
          }
        });
        
        if (!isAllowed) {
          setError(`File ${file.name} type not allowed. Allowed types: ${accept}`);
          return;
        }
      }
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await axios.post(
        `http://localhost:5000/api/upload-multiple/${fieldName}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        const newFiles = response.data.files;
        onChange([...value, ...newFiles]);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (index: number) => {
    const fileToRemove = value[index];
    
    if (fileToRemove && typeof fileToRemove === 'object' && 'filename' in fileToRemove) {
      try {
        // Delete file from server
        await axios.delete(`http://localhost:5000/api/upload/${fieldName}/${fileToRemove.filename}`);
        console.log('File deleted from server');
      } catch (err) {
        console.error('Error deleting file:', err);
        // Continue with local removal even if server deletion fails
      }
    }
    
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = (mimetype: string) => {
    return mimetype.startsWith('image/');
  };

  return (
    <div className="multiple-file-upload">
      {label && (
        <label className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      
      <div 
        className={`file-upload-container ${dragOver ? 'drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={handleClick}
      >
        {value.length === 0 ? (
          <div className="file-upload-area">
            <div className="upload-content">
              <span className="upload-icon">📁</span>
              <span className="upload-text">
                {uploading ? 'Uploading...' : 'Click or drag files here'}
              </span>
              <span className="upload-hint">
                Max {maxFiles} files, {maxSize}MB each
              </span>
            </div>
          </div>
        ) : (
          <div className="files-list">
            <div className="files-header">
              <span className="files-count">{value.length} / {maxFiles} files</span>
              <button 
                type="button" 
                className="add-more-btn"
                onClick={(e) => { e.stopPropagation(); handleClick(); }}
                disabled={uploading || value.length >= maxFiles}
              >
                + Add More
              </button>
            </div>
            
            <div className="files-grid">
              {value.map((file, index) => (
                <div key={index} className="file-item">
                  {isImage(file.mimetype) ? (
                    <img 
                      src={file.fullUrl || `http://localhost:5000${file.fileUrl}`} 
                      alt={file.originalName}
                      className="file-preview-image"
                    />
                  ) : (
                    <div className="file-icon">📄</div>
                  )}
                  
                  <div className="file-details">
                    <div className="file-name">{file.originalName}</div>
                    <div className="file-size">{formatFileSize(file.size)}</div>
                  </div>
                  
                  <button 
                    type="button" 
                    className="remove-file-btn"
                    onClick={(e) => { e.stopPropagation(); handleRemove(index); }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={uploading}
        />
      </div>
      
      {error && <div className="field-error">{error}</div>}
    </div>
  );
};

export default MultipleFileUpload;