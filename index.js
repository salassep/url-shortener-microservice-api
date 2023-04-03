require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

const urls = [];

app.use(cors());
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  let original_url = req.body.url;

  const isValidUrl = () => {
    try {
      const url = new URL(original_url);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (err) {
      return false;
    }
  };

  if (!isValidUrl()) {
    return res.json({
      error: 'invalid url',
    });
  }

  urls.push(original_url);
  return res.json(
    {
      original_url,
      short_url: urls.length,
    }
  )
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const short_url = parseInt(req.params.short_url);

  res.redirect(urls[short_url - 1]);
  res.end();
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
