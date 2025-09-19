/**
 * Billing Service Configuration
 * Configuration for the billing support system
 */

const config = {
  // Billing service settings
  service: {
    enabled: true,
    currency: 'USD',
    billingCycle: 'monthly',
    invoiceGenerationDay: 1,
    dueDateOffset: 30, // Days after invoice generation
    gracePeriod: 7, // Days after due date before late fees
    lateFeePercentage: 1.5,
    taxCalculation: true,
    dunningProcess: true
  },

  // Payment methods
  paymentMethods: {
    creditCard: {
      enabled: true,
      types: ['visa', 'mastercard', 'amex', 'discover'],
      processingFee: 0.029 // 2.9%
    },
    bankTransfer: {
      enabled: true,
      processingFee: 0.01 // 1%
    },
    paypal: {
      enabled: true,
      processingFee: 0.034 // 3.4%
    },
    wireTransfer: {
      enabled: true,
      fixedFee: 25 // $25
    }
  },

  // Customer tiers
  customerTiers: {
    free: {
      name: 'Free',
      monthlyRate: 0,
      features: ['basic_access'],
      supportLevel: 'community'
    },
    starter: {
      name: 'Starter',
      monthlyRate: 299,
      features: ['basic_access', 'limited_ai'],
      supportLevel: 'email'
    },
    professional: {
      name: 'Professional',
      monthlyRate: 999,
      features: ['full_access', 'priority_ai', 'api_access'],
      supportLevel: 'priority_email'
    },
    enterprise: {
      name: 'Enterprise',
      monthlyRate: 2999,
      features: ['full_access', 'priority_ai', 'api_access', 'dedicated_support'],
      supportLevel: '24_7_phone'
    }
  },

  // Invoice settings
  invoice: {
    template: 'templates/invoice-template.hbs',
    logo: 'assets/logo.png',
    companyInfo: {
      name: 'MediSync Healthcare AI Platform',
      address: '123 Healthcare Blvd, Medical City, MC 12345',
      phone: '(555) 123-4567',
      email: 'billing@medisync.example.com'
    },
    paymentTerms: 'Net 30',
    lateFeeDescription: 'Late fee of 1.5% per month will be applied to overdue balances'
  },

  // Tax configuration
  tax: {
    enabled: true,
    defaultRate: 0.08, // 8% default tax rate
    ratesByRegion: {
      'US-CA': 0.09, // 9% for California
      'US-NY': 0.08875, // 8.875% for New York
      'US-TX': 0.0825, // 8.25% for Texas
      'EU': 0.20 // 20% for European Union
    }
  },

  // Dunning process settings
  dunning: {
    enabled: true,
    maxAttempts: 5,
    intervals: [1, 3, 7, 14, 30], // Days after due date
    emailTemplates: {
      reminder1: 'templates/dunning-reminder-1.hbs',
      reminder2: 'templates/dunning-reminder-2.hbs',
      reminder3: 'templates/dunning-reminder-3.hbs',
      finalNotice: 'templates/dunning-final-notice.hbs',
      overdue: 'templates/dunning-overdue.hbs'
    }
  },

  // Reporting settings
  reporting: {
    enabled: true,
    frequency: 'daily',
    retentionPeriod: 31536000000, // 1 year in milliseconds
    formats: ['csv', 'pdf', 'json']
  },

  // Security settings
  security: {
    pciCompliant: true,
    dataEncryption: true,
    auditLogging: true,
    fraudDetection: true
  }
};

module.exports = config;