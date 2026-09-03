// Centralized Pricing Configuration for AI Resume & Portfolio Builder (Frontend)

export const REGIONS = {
  IN: {
    code: 'IN',
    countryName: 'India',
    currency: 'INR',
    symbol: '₹',
    flag: '🇮🇳',
    paymentMethods: ['UPI', 'Debit/Credit Cards', 'Net Banking', 'Wallets'],
    plans: {
      pro_monthly: { amount: 799, period: 'month', label: '₹799 / month' },
      pro_yearly: { amount: 7999, period: 'year', label: '₹7,999 / year' }
    }
  },
  US: {
    code: 'US',
    countryName: 'United States',
    currency: 'USD',
    symbol: '$',
    flag: '🇺🇸',
    paymentMethods: ['Credit/Debit Cards', 'International Gateways'],
    plans: {
      pro_monthly: { amount: 9.99, period: 'month', label: '$9.99 / month' },
      pro_yearly: { amount: 99.99, period: 'year', label: '$99.99 / year' }
    }
  },
  EU: {
    code: 'EU',
    countryName: 'Europe',
    currency: 'EUR',
    symbol: '€',
    flag: '🇪🇺',
    paymentMethods: ['Cards', 'SEPA/International'],
    plans: {
      pro_monthly: { amount: 9.99, period: 'month', label: '€9.99 / month' },
      pro_yearly: { amount: 99.99, period: 'year', label: '€99.99 / year' }
    }
  },
  GB: {
    code: 'GB',
    countryName: 'United Kingdom',
    currency: 'GBP',
    symbol: '£',
    flag: '🇬🇧',
    paymentMethods: ['Cards', 'International'],
    plans: {
      pro_monthly: { amount: 7.99, period: 'month', label: '£7.99 / month' },
      pro_yearly: { amount: 79.99, period: 'year', label: '£79.99 / year' }
    }
  }
};

export function getRegionConfig(countryCode = 'IN') {
  const code = (countryCode || 'IN').toUpperCase();
  return REGIONS[code] || REGIONS.IN;
}
