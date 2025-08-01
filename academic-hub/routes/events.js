// academic-hub/routes/events.js
const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Event = require('../models/Event');
const multer = require('multer');
const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs');
const { engine } = require('express-handlebars');

// Config do Multer
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage }).single('eventImage');

// Mostrar todos os eventos
router.get('/', ensureAuth, async (req, res) => {
  try {
    const events = await Event.find().populate('organizer').sort({ eventDate: 'asc' }).lean();
    res.render('events/index', { events, page_title: 'Próximos Eventos' });
  } catch (err) { res.send('error'); }
});

// Mostrar página de criação
router.get('/new', ensureAuth, (req, res) => res.render('events/new'));

// Processar criação de evento
router.post('/', ensureAuth, (req, res) => {
  upload(req, res, async (err) => {
    if(err) {
      // ... handle error
    }
    const newEventData = {
        title: req.body.title,
        description: req.body.description,
        eventDate: req.body.eventDate,
        organizer: req.user.id,
        image: req.file ? `/uploads/${req.file.filename}` : '/uploads/default-event.png'
    };
    try {
      const newEvent = await Event.create(newEventData);
      // Notificação com Socket.IO
      req.io.emit('newEvent', { 
        title: newEvent.title,
        organizer: req.user.displayName,
        id: newEvent._id
      });
      req.flash('success_msg', 'Evento criado com sucesso!');
      res.redirect('/events');
    } catch (err) { /* ... handle error */ }
  });
});

// Mostrar detalhes de um evento
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer').populate('subscribers').lean();
    const isSubscribed = event.subscribers.some(sub => sub._id.toString() === req.user.id.toString());
    const isOrganizer = event.organizer._id.toString() === req.user.id.toString();
    res.render('events/show', { event, isSubscribed, isOrganizer });
  } catch (err) { /* ... */ }
});

// Inscrever-se em um evento
router.post('/:id/subscribe', ensureAuth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event.subscribers.includes(req.user.id)) {
            event.subscribers.push(req.user.id);
            await event.save();
            req.flash('success_msg', 'Inscrição realizada!');
        }
        res.redirect(`/events/${req.params.id}`);
    } catch (err) { /* ... */ }
});

// Gerar Certificado PDF
router.get('/:id/certificate', ensureAuth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('organizer').lean();
        const isSubscribed = event.subscribers.some(subId => subId.toString() === req.user.id.toString());
        
        if (!isSubscribed) {
            req.flash('error_msg', 'Você precisa estar inscrito no evento para gerar o certificado.');
            return res.redirect(`/events/${req.params.id}`);
        }

        const hbs = engine({ defaultLayout: false });
        const certificateHtml = await hbs(path.join(__dirname, '..', 'views', 'certificate', 'template.hbs'), {
            layout: false,
            userName: req.user.displayName,
            eventTitle: event.title,
            eventDate: new Date(event.eventDate).toLocaleDateString('pt-BR'),
            organizerName: event.organizer.displayName,
        });

        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(certificateHtml);
        const pdfBuffer = await page.pdf({ format: 'A4', landscape: true });
        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
            'Content-Disposition': `attachment; filename="certificado-${event.title.replace(/\s/g, '-')}.pdf"`
        });
        res.send(pdfBuffer);

    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Não foi possível gerar o certificado.');
        res.redirect(`/events/${req.params.id}`);
    }
});

module.exports = router;