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

  dns.lookup(original_url, (err, addr) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    urls.push(original_url);
    return res.json(
      {
        original_url,
        short_url: urls.length,
      }
    )
  });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const short_url = parseInt(req.params.short_url);

  const original_url = urls[short_url-1];

  if (!original_url.includes('http')) {
    original_url = 'http://' + original_url;
  }

  res.redirect(original_url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
