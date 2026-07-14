const express = require('express');
const config = require('./config/environment');
const app = express();
const router = express.Router();
const reportController = require('./controllers/report.controller');

app.use(express.json({ limit: config.jsonLimit }));

router.get('/health', reportController.getHealthCheck);
router.post('/reports/pdf', reportController.createReportPdf);

module.exports = router;