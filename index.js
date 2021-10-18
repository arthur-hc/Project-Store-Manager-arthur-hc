const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.use('/products', require('./router/productsRouter'));

app.use('/sales', require('./router/salesRouter'));

app.listen(PORT, () => {
  console.log('App listening on port 3000!');
});
