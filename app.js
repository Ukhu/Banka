const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Your app has started!!');
});

app.listen(3000, () => console.log('Server Has Started!!!'));

module.exports = app;
