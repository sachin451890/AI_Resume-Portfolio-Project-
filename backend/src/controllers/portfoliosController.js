let localPortfoliosStore = [];

exports.getPortfolioByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const portfolio = localPortfoliosStore.find(p => p.username.toLowerCase() === username.toLowerCase());

    if (!portfolio || !portfolio.is_published) {
      return res.status(404).json({ error: 'Portfolio not found or private.' });
    }

    return res.json({ portfolio });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updatePortfolio = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user-123';
    const portfolioData = req.body;

    const existingIndex = localPortfoliosStore.findIndex(p => p.user_id === userId);
    if (existingIndex !== -1) {
      localPortfoliosStore[existingIndex] = {
        ...localPortfoliosStore[existingIndex],
        ...portfolioData,
        updated_at: new Date().toISOString()
      };
      return res.json({ portfolio: localPortfoliosStore[existingIndex] });
    }

    const newPortfolio = {
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

    localPortfoliosStore.push(newPortfolio);
    return res.status(201).json({ portfolio: newPortfolio });
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
