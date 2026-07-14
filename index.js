const express = require('express');
const config = require('./src/config/environment');
const routes = require('./src/routes');

const app = express();

app.use(express.json({ limit: config.jsonLimit }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', config.corsOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

app.use('/', routes);

app.listen(config.port, () => {
    console.log(`PDF report generator listening on port ${config.port}`);
    console.log(`Rendering SmartApp route: ${config.frontendRenderUrl}`);
});