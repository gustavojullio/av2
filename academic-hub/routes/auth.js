// academic-hub/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Carregar modelo de Usuário
const User = require('../models/User');

// --- PÁGINAS ---
// Página de Login
router.get('/login', (req, res) => res.render('auth/login', { layout: 'main' }));

// Página de Registro
router.get('/register', (req, res) => res.render('auth/register', { layout: 'main' }));


// --- PROCESSAMENTO ---
// Processar Registro
router.post('/register', (req, res) => {
    const { displayName, email, password, password2 } = req.body;
    let errors = [];

    if (!displayName || !email || !password || !password2) {
        errors.push({ msg: 'Por favor, preencha todos os campos' });
    }

    if (password !== password2) {
        errors.push({ msg: 'As senhas não coincidem' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'A senha deve ter no mínimo 6 caracteres' });
    }

    if (errors.length > 0) {
        res.render('auth/register', {
            errors,
            displayName,
            email,
            password,
            password2
        });
    } else {
        User.findOne({ email: email.toLowerCase() }).then(user => {
            if (user) {
                errors.push({ msg: 'Este e-mail já está em uso' });
                res.render('auth/register', {
                    errors,
                    displayName,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    displayName,
                    email: email.toLowerCase(),
                    password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                req.flash('success_msg', 'Você foi registrado com sucesso e já pode fazer login');
                                res.redirect('/auth/login');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});

// Processar Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/events',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
});

// Processar Logout
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success_msg', 'Você foi deslogado com sucesso.');
        res.redirect('/auth/login');
    });
});

module.exports = router; s