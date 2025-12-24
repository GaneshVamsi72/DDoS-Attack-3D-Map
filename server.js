const express = require('express');
const app = express();
const path = require('path');
const enrichAttacks = require("./data/enrichAttacks.js");
const { fetchAttackFeed } = require('./services/attackService.js');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const timeTaken = Date.now() - start;
        console.log(`${req.method} ${req.url} - ${timeTaken}ms`);
    });

    next();
});

const PORT = 3000;

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/api/attacks', (req, res) => {
    res.json(enrichAttacks(fetchAttackFeed()));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});