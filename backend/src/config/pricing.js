// Centralized Pricing Configuration for AI Resume & Portfolio Builder

const REGIONS = {
  IN: {
    countryName: 'India',
    currency: 'INR',
    symbol: '₹',
    flag: '🇮🇳',
    paymentMethods: ['UPI', 'Debit/Credit Cards', 'Net Banking', 'Wallets'],
    plans: {
      pro_monthly: { amount: 99, amountSubUnits: 9900, period: 'month', label: '₹99 / month' },
      pro_yearly: { amount: 999, amountSubUnits: 99900, period: 'year', label: '₹999 / year (Save 16%)' }
    }
  },
  US: {
    countryName: 'United States',
    currency: 'USD',
    symbol: '$',
    flag: '🇺🇸',
    paymentMethods: ['Credit/Debit Cards', 'International Gateways'],
    plans: {
      pro_monthly: { amount: 9, amountSubUnits: 900, period: 'month', label: '$9 / month' },
      pro_yearly: { amount: 79, amountSubUnits: 7900, period: 'year', label: '$79 / year (Save 16%)' }
    }
  },
  EU: {
    countryName: 'Europe',
    currency: 'EUR',
    symbol: '€',
    flag: '🇪🇺',
    paymentMethods: ['Cards', 'SEPA/International'],
    plans: {
      pro_monthly: { amount: 9, amountSubUnits: 900, period: 'month', label: '€9 / month' },
      pro_yearly: { amount: 79, amountSubUnits: 7900, period: 'year', label: '€79 / year (Save 16%)' }
    }
  },
  GB: {
    countryName: 'United Kingdom',
    currency: 'GBP',
    symbol: '£',
    flag: '🇬🇧',
    paymentMethods: ['Cards', 'International'],
    plans: {
      pro_monthly: { amount: 7, amountSubUnits: 700, period: 'month', label: '£7 / month' },
      pro_yearly: { amount: 69, amountSubUnits: 6900, period: 'year', label: '£69 / year (Save 16%)' }
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
