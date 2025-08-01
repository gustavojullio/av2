// academic-hub/server.js
const path = require('path');
const http = require('http');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const { Server } = require("socket.io");

// Carregar config
dotenv.config({ path: './.env' });

// Config do Passport
require('./config/passport-setup')(passport);

// Conectar ao DB
const connectDB = require('./config/db');
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Handlebars Helpers
const { formatDate, stripTags, truncate } = require('./helpers/hbs');

// Body parser e Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));

// Handlebars
app.engine('.hbs', exphbs.engine({
  helpers: { formatDate, stripTags, truncate },
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Sessão
app.use(
  session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false,
  })
);

// Flash messages
app.use(flash());

// Middleware do Passport
app.use(passport.initialize());
app.use(passport.session());

// Variaveis globais
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error'); // Para erros do passport
  next();
});

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Passando o 'io' para as rotas
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Rotas
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/events', require('./routes/events'));

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('Um usuário se conectou via WebSocket');
  socket.on('disconnect', () => {
    console.log('Usuário desconectado');
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, console.log(`Servidor rodando na porta ${PORT}`));