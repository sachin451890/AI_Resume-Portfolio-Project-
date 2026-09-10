const redisService = require('../services/redisService');

let localPortfoliosStore = [];

exports.getPortfolioByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    // 1. Try Redis Cache for ultra-fast public portfolio page rendering
    const cachedPortfolio = await redisService.getCachedPortfolio(username);
    if (cachedPortfolio && cachedPortfolio.is_published) {
      return res.json({ portfolio: cachedPortfolio, source: 'redis-cache' });
    }

    const portfolio = localPortfoliosStore.find(p => p.username.toLowerCase() === username.toLowerCase());

    if (!portfolio || !portfolio.is_published) {
      return res.status(404).json({ error: 'Portfolio not found or private.' });
    }

    // Store in Redis
    await redisService.cachePortfolio(username, portfolio);
    return res.json({ portfolio });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updatePortfolio = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user-123';
    const portfolioData = req.body;

    let updatedPortfolio = null;
    const existingIndex = localPortfoliosStore.findIndex(p => p.user_id === userId);
    if (existingIndex !== -1) {
      localPortfoliosStore[existingIndex] = {
        ...localPortfoliosStore[existingIndex],
        ...portfolioData,
        updated_at: new Date().toISOString()
      };
      updatedPortfolio = localPortfoliosStore[existingIndex];
    } else {
      updatedPortfolio = {
        id: `port_${Date.now()}`,
        user_id: userId,
        username: portfolioData.username || `user_${Math.floor(Math.random() * 10000)}`,
        theme_id: portfolioData.themeId || 'developer',
        is_published: portfolioData.isPublished !== undefined ? portfolioData.isPublished : true,
        tagline: portfolioData.tagline || '',
        bio: portfolioData.bio || '',
        resume_data: portfolioData.resumeData || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      localPortfoliosStore.push(updatedPortfolio);
    }

    // Cache updated portfolio in Redis
    if (updatedPortfolio.username) {
      await redisService.cachePortfolio(updatedPortfolio.username, updatedPortfolio);
    }

    return res.json({ portfolio: updatedPortfolio });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.sendContactMessage = async (req, res) => {
  try {
    const { username } = req.params;
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    console.log(`[Contact Form] Message received for ${username} from ${name} (${email}): ${message}`);
    return res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
