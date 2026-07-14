const puppeteerService = require('../services/puppeteer.service');
const { isValidRenderRequest, sanitizeFileName } = require('../utils/validators');

async function createReportPdf(req, res) {
    const renderRequest = req.body;

    if (!isValidRenderRequest(renderRequest)) {
        return res.status(400).json({ message: 'Invalid report PDF render request.' });
    }

    try {
        const pdfBuffer = await puppeteerService.generatePdfFromUrl(renderRequest);
        const safeFileName = sanitizeFileName(renderRequest.fileName);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}"`);
        res.send(Buffer.from(pdfBuffer));

    } catch (error) {
        console.error('Failed to generate report PDF.', error);
        res.status(500).json({ message: 'Failed to generate report PDF.' });
    }
}

function getHealthCheck(_req, res) {
    res.json({ status: 'ok' });
}

module.exports = {
    createReportPdf,
    getHealthCheck
};