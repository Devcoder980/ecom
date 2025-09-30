import React, { useState, useRef } from 'react';
import axios from 'axios';

interface FileUploadProps {
  fieldName: string;
  value?: string;
  onChange: (value: string) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  label?: string;
  required?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  fieldName,
  value = '',
  onChange,
  accept = '*/*',
  multiple = false,
  maxSize = 10,
  label,
  required = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `http://localhost:5000/api/upload/${fieldName}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        onChange(response.data.fileUrl);
        
        // Set preview for images
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreview(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload">
      {label && (
        <label className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      
      <div className="file-upload-container">
        {value ? (
          <div className="file-preview">
            {preview || value ? (
              <div className="preview-content">
                {value.startsWith('/uploads/') && value.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img 
                    src={`http://localhost:5000${value}`} 
                    alt="Preview" 
                    className="preview-image"
                  />
                ) : (
                  <div className="file-info">
                    <span className="file-icon">📄</span>
                    <span className="file-name">{value.split('/').pop()}</span>
                  </div>
                )}
                <button 
                  type="button" 
                  className="remove-btn"
                  onClick={handleRemove}
                >
                  ✕
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="file-upload-area" onClick={handleClick}>
            <div className="upload-content">
              <span className="upload-icon">📁</span>
              <span className="upload-text">
                {uploading ? 'Uploading...' : 'Click to upload file'}
              </span>
              <span className="upload-hint">
                Max size: {maxSize}MB
              </span>
            </div>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={uploading}
        />
      </div>
      
      {error && <div className="field-error">{error}</div>}
    </div>
  );
};

export default FileUpload;