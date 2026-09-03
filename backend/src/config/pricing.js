// Centralized Pricing Configuration for AI Resume & Portfolio Builder

const REGIONS = {
  IN: {
    countryName: 'India',
    currency: 'INR',
    symbol: '₹',
    flag: '🇮🇳',
    paymentMethods: ['UPI', 'Debit/Credit Cards', 'Net Banking', 'Wallets'],
    plans: {
      pro_monthly: { amount: 799, amountSubUnits: 79900, period: 'month', label: '₹799 / month' },
      pro_yearly: { amount: 7999, amountSubUnits: 799900, period: 'year', label: '₹7,999 / year (Save 16%)' }
    }
  },
  US: {
    countryName: 'United States',
    currency: 'USD',
    symbol: '$',
    flag: '🇺🇸',
    paymentMethods: ['Credit/Debit Cards', 'International Gateways'],
    plans: {
      pro_monthly: { amount: 9.99, amountSubUnits: 999, period: 'month', label: '$9.99 / month' },
      pro_yearly: { amount: 99.99, amountSubUnits: 9999, period: 'year', label: '$99.99 / year (Save 16%)' }
    }
  },
  EU: {
    countryName: 'Europe',
    currency: 'EUR',
    symbol: '€',
    flag: '🇪🇺',
    paymentMethods: ['Cards', 'SEPA/International'],
    plans: {
      pro_monthly: { amount: 9.99, amountSubUnits: 999, period: 'month', label: '€9.99 / month' },
      pro_yearly: { amount: 99.99, amountSubUnits: 9999, period: 'year', label: '€99.99 / year (Save 16%)' }
    }
  },
  GB: {
    countryName: 'United Kingdom',
    currency: 'GBP',
    symbol: '£',
    flag: '🇬🇧',
    paymentMethods: ['Cards', 'International'],
    plans: {
      pro_monthly: { amount: 7.99, amountSubUnits: 799, period: 'month', label: '£7.99 / month' },
      pro_yearly: { amount: 79.99, amountSubUnits: 7999, period: 'year', label: '£79.99 / year (Save 16%)' }
    }
  }
};

const DEFAULT_REGION = 'IN';

function getRegionConfig(countryCode = 'IN') {
  const code = (countryCode || 'IN').toUpperCase();
  return REGIONS[code] || REGIONS[DEFAULT_REGION];
}

function getPlanPricing(countryCode = 'IN', planId = 'pro_monthly') {
  const region = getRegionConfig(countryCode);
  const plan = region.plans[planId] || region.plans.pro_monthly;
  return {
    country: region.countryName,
    countryCode: countryCode.toUpperCase(),
    currency: region.currency,
    symbol: region.symbol,
    amount: plan.amount,
    amountSubUnits: plan.amountSubUnits,
    period: plan.period,
    label: plan.label
  };
}

module.exports = {
  REGIONS,
  DEFAULT_REGION,
  getRegionConfig,
  getPlanPricing
};
