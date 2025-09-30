import fs from 'fs';
import path from 'path';

// Clean up orphaned files (files not referenced in database)
export const cleanupOrphanedFiles = async (Model, fieldName) => {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads', fieldName);
    
    if (!fs.existsSync(uploadsDir)) {
      return { cleaned: 0, errors: [] };
    }
    
    // Get all files in uploads directory
    const files = fs.readdirSync(uploadsDir);
    
    // Get all file URLs referenced in database
    const documents = await Model.find({ [fieldName]: { $exists: true, $ne: null } });
    const referencedFiles = documents.map(doc => {
      const fileUrl = doc[fieldName];
      return fileUrl ? path.basename(fileUrl) : null;
    }).filter(Boolean);
    
    // Find orphaned files
    const orphanedFiles = files.filter(file => !referencedFiles.includes(file));
    
    let cleaned = 0;
    const errors = [];
    
    // Delete orphaned files
    for (const file of orphanedFiles) {
      try {
        const filePath = path.join(uploadsDir, file);
        fs.unlinkSync(filePath);
        cleaned++;
        console.log(`Cleaned orphaned file: ${file}`);
      } catch (error) {
        errors.push({ file, error: error.message });
        console.error(`Error cleaning file ${file}:`, error);
      }
    }
    
    return { cleaned, errors };
  } catch (error) {
    console.error('File cleanup error:', error);
    return { cleaned: 0, errors: [{ error: error.message }] };
  }
};

// Get file statistics
export const getFileStats = (fieldName) => {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads', fieldName);
    
    if (!fs.existsSync(uploadsDir)) {
      return { totalFiles: 0, totalSize: 0, files: [] };
    }
    
    const files = fs.readdirSync(uploadsDir);
    let totalSize = 0;
    const fileStats = [];
    
    for (const file of files) {
      try {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isFile()) {
          totalSize += stats.size;
          fileStats.push({
            name: file,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
          });
        }
      } catch (error) {
        console.error(`Error reading file ${file}:`, error);
      }
    }
    
    return {
      totalFiles: fileStats.length,
      totalSize,
      files: fileStats
    };
  } catch (error) {
    console.error('File stats error:', error);
    return { totalFiles: 0, totalSize: 0, files: [] };
  }
};