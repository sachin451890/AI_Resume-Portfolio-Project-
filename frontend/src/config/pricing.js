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
      pro_monthly: { amount: 99, period: 'month', label: '₹99 / month' },
      pro_yearly: { amount: 999, period: 'year', label: '₹999 / year' }
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
      pro_monthly: { amount: 9, period: 'month', label: '$9 / month' },
      pro_yearly: { amount: 79, period: 'year', label: '$79 / year' }
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
      pro_monthly: { amount: 9, period: 'month', label: '€9 / month' },
      pro_yearly: { amount: 79, period: 'year', label: '€79 / year' }
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
      pro_monthly: { amount: 7, period: 'month', label: '£7 / month' },
      pro_yearly: { amount: 69, period: 'year', label: '£69 / year' }
    }
  }
};

export function getRegionConfig(countryCode = 'IN') {
  const code = (countryCode || 'IN').toUpperCase();
  return REGIONS[code] || REGIONS.IN;
}
