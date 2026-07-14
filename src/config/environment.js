module.exports = {
    port: Number(process.env.PORT || 3000),
    frontendRenderUrl: process.env.FRONTEND_RENDER_URL || 'http://localhost:4200/app/report-pdf-render',
    storageKey: 'smart-app-report-pdf-render-request',
    jsonLimit: process.env.JSON_LIMIT || '5mb',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    renderTimeoutMs: Number(process.env.RENDER_TIMEOUT_MS || 60000),
};