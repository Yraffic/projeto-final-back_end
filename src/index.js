require("dotenv").config()
const express = require('express');
const cors = require("cors")
const routes = require('./routes');

const app = express();

app.use(cors())
app.use(express.json());
app.use(routes);

app.listen(process.env.PORT, console.log('Iniciando o servidor'));