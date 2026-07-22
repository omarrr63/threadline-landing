const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get a random joke from JokeAPI
router.get('/random', async (req, res, next) => {
  try {
    const response = await axios.get('https://api.api-ninjas.com/v1/jokes', {
      headers: {
        'X-Api-Key': process.env.JOKES_API_KEY
      }
    });
    
    res.json({
      success: true,
      joke: response.data[0].joke,
      source: 'API Ninjas'
    });
  } catch (error) {
    next(error);
  }
});

// Get a random joke by category
router.get('/category/:category', async (req, res, next) => {
  try {
    const { category } = req.params;
    const validCategories = ['general', 'programming', 'knock-knock'];
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: `Invalid category. Valid categories are: ${validCategories.join(', ')}`
      });
    }
    
    let apiUrl;
    if (category === 'programming') {
      apiUrl = 'https://api.api-ninjas.com/v1/jokes?category=programming';
    } else {
      apiUrl = 'https://api.api-ninjas.com/v1/jokes';
    }
    
    const response = await axios.get(apiUrl, {
      headers: {
        'X-Api-Key': process.env.JOKES_API_KEY
      }
    });
    
    res.json({
      success: true,
      category,
      joke: response.data[0].joke,
      source: 'API Ninjas'
    });
  } catch (error) {
    next(error);
  }
});

// Get multiple random jokes
router.get('/multiple/:count', async (req, res, next) => {
  try {
    const { count } = req.params;
    const numJokes = Math.min(parseInt(count) || 5, 20); // Max 20 jokes
    
    const jokes = [];
    for (let i = 0; i < numJokes; i++) {
      const response = await axios.get('https://api.api-ninjas.com/v1/jokes', {
        headers: {
          'X-Api-Key': process.env.JOKES_API_KEY
        }
      });
      jokes.push(response.data[0].joke);
    }
    
    res.json({
      success: true,
      count: jokes.length,
      jokes,
      source: 'API Ninjas'
    });
  } catch (error) {
    next(error);
  }
});

// Alternative: Use JokeAPI (free, no key required)
router.get('/alternative/random', async (req, res, next) => {
  try {
    const response = await axios.get('https://v2.jokeapi.dev/joke/Any');
    
    let jokeText;
    if (response.data.type === 'single') {
      jokeText = response.data.joke;
    } else {
      jokeText = `${response.data.setup}\n\n${response.data.delivery}`;
    }
    
    res.json({
      success: true,
      joke: jokeText,
      type: response.data.type,
      category: response.data.category,
      source: 'JokeAPI'
    });
  } catch (error) {
    next(error);
  }
});

// Get joke by JokeAPI category
router.get('/alternative/category/:category', async (req, res, next) => {
  try {
    const { category } = req.params;
    const validCategories = ['general', 'programming', 'knock-knock', 'coding', 'misc'];
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: `Invalid category. Valid categories are: ${validCategories.join(', ')}`
      });
    }
    
    const response = await axios.get(`https://v2.jokeapi.dev/joke/${category.charAt(0).toUpperCase() + category.slice(1)}`);
    
    let jokeText;
    if (response.data.type === 'single') {
      jokeText = response.data.joke;
    } else {
      jokeText = `${response.data.setup}\n\n${response.data.delivery}`;
    }
    
    res.json({
      success: true,
      joke: jokeText,
      type: response.data.type,
      category: response.data.category,
      source: 'JokeAPI'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
