// ============================================
// REUSABLE FRAMEWORK CONFIGURATION
// Universal schema-driven admin framework
// ============================================

export interface FrameworkConfig {
  // Project Information
  project: {
    name: string;
    version: string;
    description: string;
    author: string;
    repository?: string;
  };
  
  // Database Configuration
  database: {
    type: 'mongodb' | 'mysql' | 'postgresql';
    host: string;
    port: number;
    name: string;
    username?: string;
    password?: string;
    ssl?: boolean;
  };
  
  // Server Configuration
  server: {
    port: number;
    host: string;
    cors: {
      origin: string[];
      credentials: boolean;
    };
    upload: {
      maxFileSize: number; // in MB
      allowedTypes: string[];
      storagePath: string;
    };
  };
  
  // Schema Configuration
  schema: {
    autoSync: boolean;
    syncInterval: number; // in minutes
    validation: {
      strict: boolean;
      customValidators: boolean;
    };
    caching: {
      enabled: boolean;
      ttl: number; // in seconds
    };
  };
  
  // UI Configuration
  ui: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    dateFormat: string;
    timeFormat: string;
    currency: string;
    pagination: {
      defaultPageSize: number;
      maxPageSize: number;
    };
  };
  
  // Security Configuration
  security: {
    jwt: {
      secret: string;
      expiresIn: string;
    };
    bcrypt: {
      rounds: number;
    };
    rateLimit: {
      windowMs: number;
      max: number;
    };
  };
  
  // Features Configuration
  features: {
    fileUpload: boolean;
    emailNotifications: boolean;
    auditLogging: boolean;
    realTimeUpdates: boolean;
    apiDocumentation: boolean;
    backup: boolean;
  };
  
  // Custom Fields
  customFields: {
    [key: string]: {
      type: string;
      label: string;
      validation?: any;
      ui?: any;
    };
  };
  
  // Hooks and Extensions
  hooks: {
    beforeCreate?: string[];
    afterCreate?: string[];
    beforeUpdate?: string[];
    afterUpdate?: string[];
    beforeDelete?: string[];
    afterDelete?: string[];
  };
  
  // API Configuration
  api: {
    version: string;
    basePath: string;
    documentation: boolean;
    rateLimit: boolean;
    authentication: boolean;
  };
}

// Default Configuration
export const DEFAULT_FRAMEWORK_CONFIG: FrameworkConfig = {
  project: {
    name: 'Schema-Driven Admin Framework',
    version: '1.0.0',
    description: 'Universal admin framework with dynamic schema management',
    author: 'Framework Team',
    repository: 'https://github.com/your-org/schema-admin-framework'
  },
  
  database: {
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    name: 'admin_framework',
    ssl: false
  },
  
  server: {
    port: 5000,
    host: 'localhost',
    cors: {
      origin: ['http://localhost:3000'],
      credentials: true
    },
    upload: {
      maxFileSize: 10,
      allowedTypes: ['image/*', 'application/pdf', 'text/*'],
      storagePath: 'uploads'
    }
  },
  
  schema: {
    autoSync: true,
    syncInterval: 5,
    validation: {
      strict: true,
      customValidators: true
    },
    caching: {
      enabled: true,
      ttl: 300
    }
  },
  
  ui: {
    theme: 'light',
    language: 'en',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm:ss',
    currency: 'USD',
    pagination: {
      defaultPageSize: 20,
      maxPageSize: 100
    }
  },
  
  security: {
    jwt: {
      secret: 'your-secret-key',
      expiresIn: '24h'
    },
    bcrypt: {
      rounds: 12
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100
    }
  },
  
  features: {
    fileUpload: true,
    emailNotifications: true,
    auditLogging: true,
    realTimeUpdates: true,
    apiDocumentation: true,
    backup: true
  },
  
  customFields: {
    // Custom field definitions
  },
  
  hooks: {
    beforeCreate: [],
    afterCreate: [],
    beforeUpdate: [],
    afterUpdate: [],
    beforeDelete: [],
    afterDelete: []
  },
  
  api: {
    version: 'v1',
    basePath: '/api',
    documentation: true,
    rateLimit: true,
    authentication: true
  }
};

// Configuration Management
export class ConfigManager {
  private config: FrameworkConfig;
  
  constructor(config?: Partial<FrameworkConfig>) {
    this.config = { ...DEFAULT_FRAMEWORK_CONFIG, ...config };
  }
  
  // Get configuration value
  get<K extends keyof FrameworkConfig>(key: K): FrameworkConfig[K] {
    return this.config[key];
  }
  
  // Set configuration value
  set<K extends keyof FrameworkConfig>(key: K, value: FrameworkConfig[K]): void {
    this.config[key] = value;
  }
  
  // Update configuration
  update(updates: Partial<FrameworkConfig>): void {
    this.config = { ...this.config, ...updates };
  }
  
  // Get full configuration
  getAll(): FrameworkConfig {
    return { ...this.config };
  }
  
  // Validate configuration
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Validate required fields
    if (!this.config.project.name) {
      errors.push('Project name is required');
    }
    
    if (!this.config.database.host) {
      errors.push('Database host is required');
    }
    
    if (!this.config.server.port) {
      errors.push('Server port is required');
    }
    
    // Validate port numbers
    if (this.config.server.port < 1 || this.config.server.port > 65535) {
      errors.push('Server port must be between 1 and 65535');
    }
    
    if (this.config.database.port < 1 || this.config.database.port > 65535) {
      errors.push('Database port must be between 1 and 65535');
    }
    
    // Validate file size
    if (this.config.server.upload.maxFileSize <= 0) {
      errors.push('Max file size must be greater than 0');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  // Export configuration
  export(): string {
    return JSON.stringify(this.config, null, 2);
  }
  
  // Import configuration
  import(configJson: string): void {
    try {
      const importedConfig = JSON.parse(configJson);
      this.config = { ...DEFAULT_FRAMEWORK_CONFIG, ...importedConfig };
    } catch (error) {
      throw new Error('Invalid configuration JSON');
    }
  }
}

// Framework Templates
export const FRAMEWORK_TEMPLATES = {
  ecommerce: {
    name: 'E-commerce Admin',
    description: 'Complete e-commerce management system',
    tables: ['users', 'products', 'categories', 'orders', 'customers'],
    features: ['inventory', 'payments', 'shipping', 'reviews']
  },
  
  cms: {
    name: 'Content Management',
    description: 'Content management system',
    tables: ['users', 'pages', 'posts', 'media', 'menus'],
    features: ['seo', 'multilingual', 'versioning', 'workflow']
  },
  
  crm: {
    name: 'Customer Relationship',
    description: 'Customer relationship management',
    tables: ['users', 'contacts', 'companies', 'deals', 'activities'],
    features: ['pipeline', 'automation', 'reporting', 'integration']
  },
  
  inventory: {
    name: 'Inventory Management',
    description: 'Inventory and warehouse management',
    tables: ['products', 'warehouses', 'stock', 'suppliers', 'transactions'],
    features: ['tracking', 'alerts', 'reporting', 'barcode']
  }
};

// Framework Utilities
export class FrameworkUtils {
  // Generate project structure
  static generateProjectStructure(config: FrameworkConfig): string[] {
    const structure = [
      'project/',
      'project/backend/',
      'project/backend/src/',
      'project/backend/src/controllers/',
      'project/backend/src/models/',
      'project/backend/src/routes/',
      'project/backend/src/middleware/',
      'project/backend/src/utils/',
      'project/frontend/',
      'project/frontend/src/',
      'project/frontend/src/components/',
      'project/frontend/src/pages/',
      'project/frontend/src/hooks/',
      'project/shared/',
      'project/shared/schemas/',
      'project/shared/types/',
      'project/docs/',
      'project/tests/'
    ];
    
    return structure;
  }
  
  // Generate package.json
  static generatePackageJson(config: FrameworkConfig): any {
    return {
      name: config.project.name.toLowerCase().replace(/\s+/g, '-'),
      version: config.project.version,
      description: config.project.description,
      main: 'backend/src/index.js',
      scripts: {
        dev: 'concurrently "npm run server" "npm run client"',
        server: 'cd backend && npm run dev',
        client: 'cd frontend && npm start',
        build: 'cd frontend && npm run build',
        test: 'jest',
        lint: 'eslint .',
        format: 'prettier --write .'
      },
      dependencies: {
        express: '^4.18.2',
        mongoose: '^8.0.3',
        cors: '^2.8.5',
        dotenv: '^16.3.1',
        bcryptjs: '^2.4.3',
        jsonwebtoken: '^9.0.2',
        multer: '^1.4.5-lts.1'
      },
      devDependencies: {
        nodemon: '^3.0.2',
        concurrently: '^8.2.2',
        jest: '^29.7.0',
        eslint: '^8.55.0',
        prettier: '^3.1.0'
      }
    };
  }
  
  // Generate environment file
  static generateEnvFile(config: FrameworkConfig): string {
    return `# Framework Configuration
PROJECT_NAME=${config.project.name}
PROJECT_VERSION=${config.project.version}

# Database Configuration
DB_TYPE=${config.database.type}
DB_HOST=${config.database.host}
DB_PORT=${config.database.port}
DB_NAME=${config.database.name}
${config.database.username ? `DB_USERNAME=${config.database.username}` : ''}
${config.database.password ? `DB_PASSWORD=${config.database.password}` : ''}
DB_SSL=${config.database.ssl}

# Server Configuration
SERVER_PORT=${config.server.port}
SERVER_HOST=${config.server.host}

# Security Configuration
JWT_SECRET=${config.security.jwt.secret}
JWT_EXPIRES_IN=${config.security.jwt.expiresIn}
BCRYPT_ROUNDS=${config.security.bcrypt.rounds}

# Upload Configuration
MAX_FILE_SIZE=${config.server.upload.maxFileSize}
UPLOAD_PATH=${config.server.upload.storagePath}

# Schema Configuration
AUTO_SYNC=${config.schema.autoSync}
SYNC_INTERVAL=${config.schema.syncInterval}
`;
  }
}

export default ConfigManager;