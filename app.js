const express = require('express')
const app = express()
const port = 8080

app.set('view engine', 'ejs');

app.use('/static', express.static('static'))

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get('/wallet', function(req, res) {
  res.render('pages/wallet');
});

app.get('/settings', function(req, res) {
  res.render('pages/settings');
});

// app.use('/', express.static('static'))


app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})