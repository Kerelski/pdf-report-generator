const puppeteer = require('puppeteer');
const config = require('../config/environment');

let globalBrowser = null;

async function getBrowserInstance() {
    if (!globalBrowser) {
        globalBrowser = await puppeteer.launch({
            headless: 'shell',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--enable-webgl',
                '--use-gl=angle',
                '--gl-renderer=swangle',
            ]
        });
    }
    return globalBrowser;
}

async function generatePdfFromUrl(renderRequest) {
    const browser = await getBrowserInstance();
    let page;

    try {
        page = await browser.newPage();

        const targetLocale = renderRequest.locale || 'en';

        await page.setExtraHTTPHeaders({
            'Accept-Language': targetLocale
        });

        await page.evaluateOnNewDocument((locale) => {
            Object.defineProperty(navigator, 'language', { get: () => locale });
            Object.defineProperty(navigator, 'languages', { get: () => [locale] });
        }, targetLocale);

        await page.setViewport({
            width: renderRequest.render.width,
            height: renderRequest.render.height,
            deviceScaleFactor: 1
        });

        await page.evaluateOnNewDocument(
            (key, request) => {
                window.sessionStorage.setItem(key, JSON.stringify(request));
                window.__SMART_APP_REPORT_PDF_READY__ = false;
            },
            config.storageKey,
            renderRequest
        );

        await page.goto(config.frontendRenderUrl, {
            waitUntil: 'networkidle2',
            timeout: config.renderTimeoutMs
        });

        await page.waitForSelector('.report-pdf-render-host', {
            timeout: config.renderTimeoutMs
        });

        await page.waitForSelector('.ol-viewport', {
            timeout: config.renderTimeoutMs
        }).catch(() => console.log('Warning: The ol-viewport container was not found.'));

        await page.waitForFunction(
            'window.__SMART_APP_REPORT_PDF_READY__ === true || document.documentElement.dataset.reportPdfReady === "true"',
            { timeout: config.renderTimeoutMs }
        );

        await page.emulateMediaType('screen');

        return await page.pdf({
            format: renderRequest.render.format || 'A4',
            printBackground: true,
            preferCSSPageSize: true,
            margin: {top: 0, right: 0, bottom: 0, left: 0}
        });

    } catch (error) {
        if (page) {
            await logDebugInfo(page);
        }
        throw error;
    } finally {
        if (page) {
            await page.close();
        }
    }
}

async function logDebugInfo(page) {
    try {
        console.error('--- PDF REPORT GENERATION ERROR ---');
        console.error('Failed to generate report for URL:', page.url());
    } catch (debugError) {
        console.error('Failed to collect Puppeteer debug output.', debugError);
    }
}

module.exports = {
    generatePdfFromUrl
};