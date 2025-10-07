// ============================================
// MULTI-TENANT CONFIGURATION
// Subdomain-based tenant management
// ============================================

// Tenant configuration
const tenantConfig = {
  // Default tenant settings
  default: {
    name: 'Default Store',
    domain: 'localhost',
    database: 'ecommerce',
    bucket: 'ecommerce-storage',
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
    }
  },
  
  // Example tenant configurations
  tenants: {
    'store1': {
      name: 'Store 1',
      domain: 'store1.yourdomain.com',
      database: 'store1_ecommerce',
      bucket: 'store1-ecommerce-storage',
      features: {
        fileUpload: true,
        analytics: true,
        seo: true,
        multiLanguage: true,
      },
      limits: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        maxFiles: 10,
        storageQuota: 10 * 1024 * 1024 * 1024, // 10GB
      }
    },
    'store2': {
      name: 'Store 2',
      domain: 'store2.yourdomain.com',
      database: 'store2_ecommerce',
      bucket: 'store2-ecommerce-storage',
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
      }
    }
  }
};

// Get tenant configuration by subdomain
const getTenantConfig = (subdomain) => {
  if (!subdomain || subdomain === 'www' || subdomain === 'localhost') {
    return tenantConfig.default;
  }
  
  return tenantConfig.tenants[subdomain] || tenantConfig.default;
};

// Get database name for tenant
const getTenantDatabase = (subdomain) => {
  const config = getTenantConfig(subdomain);
  return config.database;
};

// Get bucket name for tenant
const getTenantBucket = (subdomain) => {
  const config = getTenantConfig(subdomain);
  return config.bucket;
};

// Check if feature is enabled for tenant
const isFeatureEnabled = (subdomain, feature) => {
  const config = getTenantConfig(subdomain);
  return config.features[feature] || false;
};

// Get tenant limits
const getTenantLimits = (subdomain) => {
  const config = getTenantConfig(subdomain);
  return config.limits;
};

// Validate tenant access
const validateTenantAccess = (subdomain) => {
  const config = getTenantConfig(subdomain);
  
  // Check if tenant exists or use default
  if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
    if (!tenantConfig.tenants[subdomain]) {
      console.log(`⚠️  Unknown tenant: ${subdomain}, using default configuration`);
      return tenantConfig.default;
    }
  }
  
  return config;
};

// Get all tenants
const getAllTenants = () => {
  return Object.keys(tenantConfig.tenants);
};

// Add new tenant
const addTenant = (subdomain, config) => {
  tenantConfig.tenants[subdomain] = {
    ...tenantConfig.default,
    ...config,
    name: config.name || `${subdomain} Store`,
    domain: config.domain || `${subdomain}.yourdomain.com`,
    database: config.database || `${subdomain}_ecommerce`,
    bucket: config.bucket || `${subdomain}-ecommerce-storage`,
  };
  
  console.log(`✅ Added new tenant: ${subdomain}`);
  return tenantConfig.tenants[subdomain];
};

// Remove tenant
const removeTenant = (subdomain) => {
  if (tenantConfig.tenants[subdomain]) {
    delete tenantConfig.tenants[subdomain];
    console.log(`🗑️  Removed tenant: ${subdomain}`);
    return true;
  }
  return false;
};

// Update tenant configuration
const updateTenant = (subdomain, updates) => {
  if (tenantConfig.tenants[subdomain]) {
    tenantConfig.tenants[subdomain] = {
      ...tenantConfig.tenants[subdomain],
      ...updates,
    };
    console.log(`📝 Updated tenant: ${subdomain}`);
    return tenantConfig.tenants[subdomain];
  }
  return null;
};

// Get tenant statistics
const getTenantStats = async (subdomain, mongoose) => {
  try {
    const config = getTenantConfig(subdomain);
    const db = mongoose.connection.db;
    
    // Get collection stats
    const collections = await db.listCollections().toArray();
    const stats = {
      tenant: subdomain,
      database: config.database,
      bucket: config.bucket,
      collections: collections.length,
      features: config.features,
      limits: config.limits,
    };
    
    return stats;
  } catch (error) {
    console.error(`❌ Error getting tenant stats for ${subdomain}:`, error);
    return null;
  }
};

export {
  tenantConfig,
  getTenantConfig,
  getTenantDatabase,
  getTenantBucket,
  isFeatureEnabled,
  getTenantLimits,
  validateTenantAccess,
  getAllTenants,
  addTenant,
  removeTenant,
  updateTenant,
  getTenantStats,
};
