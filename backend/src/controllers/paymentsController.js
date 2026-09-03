const { createClient } = require('@supabase/supabase-js');
const paymentService = require('../services/paymentService');
const { getPlanPricing } = require('../config/pricing');
const config = require('../config');

let supabase = null;
if (config.supabaseUrl && config.supabaseServiceRoleKey) {
  supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey);
}

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId = 'pro_monthly', countryCode = 'IN' } = req.body;

    const orderData = await paymentService.createOrder({
      userId,
      planId,
      countryCode
    });

    return res.json({
      success: true,
      order: orderData
    });
  } catch (err) {
    console.error('[Create Order Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to create payment order.' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId = 'pro_monthly',
      countryCode = 'IN'
    } = req.body;

    // 1. Verify HMAC SHA-256 signature
    const isValidSignature = paymentService.verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature
    });

    if (!isValidSignature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid digital signature.'
      });
    }

    // 2. Fetch payment details from Razorpay API
    const paymentDetails = await paymentService.fetchPaymentDetails(razorpay_payment_id);
    if (paymentDetails.status !== 'captured' && paymentDetails.status !== 'authorized') {
      return res.status(400).json({
        success: false,
        message: `Payment status is ${paymentDetails.status}. Subscription not activated.`
      });
    }

    const pricing = getPlanPricing(countryCode, planId);
    const startDate = new Date().toISOString();
    const endDate = new Date(Date.now() + (planId === 'pro_yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString();

    // 3. Database Subscription Update
    if (supabase) {
      // Upsert Subscription
      const { data: subData, error: subErr } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          plan: planId,
          status: 'active',
          currency: pricing.currency,
          amount: pricing.amount,
          gateway: 'razorpay',
          start_date: startDate,
          end_date: endDate,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
        .select()
        .single();

      if (subErr) console.warn('[Subscription DB Warning]:', subErr.message);

      // Record Transaction safely (Idempotency)
      await supabase
        .from('payment_transactions')
        .insert({
          user_id: userId,
          subscription_id: subData?.id || null,
          gateway: 'razorpay',
          gateway_payment_id: razorpay_payment_id,
          gateway_order_id: razorpay_order_id,
          amount: pricing.amount,
          currency: pricing.currency,
          status: 'captured',
          payment_method: paymentDetails.method || 'card',
          country: countryCode
        });
    }

    return res.json({
      success: true,
      message: 'Payment verified successfully! Your Pro plan is now active.',
      subscription: {
        plan: planId,
        status: 'active',
        currency: pricing.currency,
        amount: pricing.amount,
        startDate,
        endDate,
        paymentId: razorpay_payment_id
      }
    });
  } catch (err) {
    console.error('[Verify Payment Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Payment verification failed.' });
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.rawBody || JSON.stringify(req.body);

    const isValid = paymentService.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      return res.status(400).json({ status: 'rejected', message: 'Invalid webhook signature.' });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payment ? payload.payment.entity : null;
      const orderEntity = payload.order ? payload.order.entity : null;
      const paymentId = paymentEntity ? paymentEntity.id : null;

      if (paymentId && supabase) {
        // Idempotency check: verify if transaction was already processed
        const { data: existingTx } = await supabase
          .from('payment_transactions')
          .select('id')
          .eq('gateway_payment_id', paymentId)
          .single();

        if (existingTx) {
          return res.json({ status: 'ok', message: 'Event already processed.' });
        }

        const userId = (paymentEntity.notes && paymentEntity.notes.userId) || (orderEntity && orderEntity.notes && orderEntity.notes.userId);
        const planId = (paymentEntity.notes && paymentEntity.notes.planId) || 'pro_monthly';

        if (userId) {
          await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              plan: planId,
              status: 'active',
              gateway: 'razorpay',
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });
        }
      }
    }

    return res.json({ status: 'ok' });
  } catch (err) {
    console.error('[Webhook Error]:', err.message);
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getBillingHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    let subscription = { plan: 'free', status: 'active', currency: 'INR', amount: 0 };
    let transactions = [];

    if (supabase) {
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (subData) subscription = subData;

      const { data: txData } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (txData) transactions = txData;
    }

    return res.json({
      success: true,
      subscription,
      transactions
    });
  } catch (err) {
    console.error('[Get Billing History Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch billing history.' });
  }
};
