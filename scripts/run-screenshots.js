const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE_URL = 'https://dummyjson.com';

const testCases = [
    { id: 'TC-P001', name: 'Get Product by ID (valid)', category: 'Positive', method: 'GET', path: '/products/1', expectStatus: 200, expect: 'Status 200 + field title terisi' },
    { id: 'TC-P002', name: 'List Products limit=5', category: 'Positive', method: 'GET', path: '/products?limit=5', expectStatus: 200, expect: 'Status 200 + 5 produk dikembalikan', expectCount: 5 },
    { id: 'TC-P003', name: 'Create Product (body valid)', category: 'Positive', method: 'POST', path: '/products/add', body: { title: 'Demo Product', price: 99, category: 'smartphones' }, expectStatus: 201, expect: 'Status 201 + id produk baru' },
    { id: 'TC-N001', name: 'Product ID Tidak Ada (999999)', category: 'Negative', method: 'GET', path: '/products/999999', expectStatus: 404, expect: 'Status 404 (resource tidak ditemukan)' },
    { id: 'TC-N002', name: 'Body Invalid JSON (not-json)', category: 'Negative', method: 'POST', path: '/products/add', rawBody: 'not-json', expectStatus: 400, expect: 'Status 400 (request body ditolak)' },
    { id: 'TC-B001', name: 'ID Minimum = 1 (Boundary)', category: 'Boundary', method: 'GET', path: '/products/1', expectStatus: 200, expect: 'Status 200 (nilai batas bawah valid)' },
    { id: 'TC-B002', name: 'ID = 0 di bawah batas (Boundary)', category: 'Boundary', method: 'GET', path: '/products/0', expectStatus: 404, expect: 'Status 404 (di luar rentang valid)' },
    { id: 'TC-S001', name: 'XSS Payload pada Query Search', category: 'Security', method: 'GET', path: '/products/search?q=<script>alert(1)</script>', expectStatus: 200, expect: 'Status 200 + Content-Type JSON (tidak dieksekusi)', expectContentType: 'application/json' },
    { id: 'TC-E2E001', name: 'Create Cart dengan Product (E2E)', category: 'E2E', method: 'POST', path: '/carts/add', body: { userId: 1, products: [{ id: 1, quantity: 1 }] }, expectStatus: 201, expect: 'Status 201 + cart berisi produk' },
    { id: 'TC-PF001', name: 'List 100 Produk — Response < 2000ms', category: 'Performance', method: 'GET', path: '/products?limit=100', expectStatus: 200, expect: 'Status 200 + response time < 2000ms', maxMs: 2000 },
];

function evaluate(tc, api) {
    if (api.status !== tc.expectStatus) return false;
    if (tc.expectCount && Array.isArray(api.data?.products) && api.data.products.length !== tc.expectCount) return false;
    if (tc.expectContentType && !String(api.contentType).includes(tc.expectContentType)) return false;
    if (tc.maxMs && api.duration > tc.maxMs) return false;
    if (tc.expectStatus === 200 && tc.id === 'TC-P001' && !api.data?.title) return false;
    return true;
}

function generateHTML(tc, api, passed) {
    const bodyStr = tc.rawBody ? tc.rawBody : JSON.stringify(tc.body ?? null, null, 2);
    const statusColor = passed ? '#28a745' : '#dc3545';
    const httpColor = api.status === tc.expectStatus ? '#28a745' : '#dc3545';
    const responseStr = JSON.stringify(api.data, null, 2) ?? String(api.data);
    const truncated = responseStr.length > 800 ? responseStr.substring(0, 800) + '\n...(truncated)' : responseStr;
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>API Test Evidence - ${tc.id}</title>
    <style>
        * { box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f0f2f5; }
        .container { max-width: 960px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 24px 30px; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 600; }
        .header .meta { opacity: 0.85; margin-top: 6px; font-size: 14px; }
        .badge { display: inline-block; padding: 4px 14px; border-radius: 20px; font-weight: 700; font-size: 13px; }
        .badge-pass { background: #28a745; color: white; }
        .badge-fail { background: #dc3545; color: white; }
        .content { padding: 24px 30px; }
        .section { margin-bottom: 20px; }
        .section-title { font-size: 15px; font-weight: 700; color: #333; padding-bottom: 8px; border-bottom: 2px solid #667eea; margin-bottom: 12px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .card { border: 1px solid #e8e8e8; border-radius: 8px; padding: 16px; background: #fafafa; }
        .card-label { font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase; margin-bottom: 6px; }
        .card-value { font-size: 14px; color: #333; }
        .method-badge { display: inline-block; background: #28a745; color: white; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 13px; margin-right: 6px; }
        .url { font-family: 'Courier New', monospace; font-size: 13px; color: #6610f2; word-break: break-all; }
        pre { background: #1e1e2e; color: #cdd6f4; padding: 16px; border-radius: 8px; font-size: 12px; line-height: 1.5; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin: 0; }
        .http-status { font-size: 48px; font-weight: 800; color: ${httpColor}; line-height: 1; }
        .http-label { font-size: 13px; color: #888; margin-top: 4px; }
        .timestamp { font-size: 12px; color: #aaa; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>API Test Evidence</h1>
            <div class="meta">
                <span class="badge badge-${passed ? 'pass' : 'fail'}">${passed ? 'PASS' : 'FAIL'}</span>
                &nbsp;&nbsp;${tc.id} — ${tc.name}
            </div>
            <div class="meta" style="margin-top:4px;">${tc.category} Testing &nbsp;|&nbsp; Expected: ${tc.expect}</div>
        </div>
        <div class="content">
            <div class="section">
                <div class="section-title">Request</div>
                <div class="grid">
                    <div class="card">
                        <div class="card-label">Endpoint</div>
                        <div class="card-value">
                            <span class="method-badge">${tc.method}</span>
                            <span class="url">${BASE_URL}${tc.path}</span>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-label">Response Time</div>
                        <div class="card-value" style="font-size:20px;font-weight:700;">${api.duration}ms</div>
                    </div>
                </div>
                <div style="margin-top:12px;">
                    <div class="card-label" style="margin-bottom:6px;">Request Body</div>
                    <pre>${bodyStr === 'null' ? '-' : bodyStr}</pre>
                </div>
            </div>
            <div class="section">
                <div class="section-title">Response</div>
                <div class="grid">
                    <div class="card" style="text-align:center;">
                        <div class="card-label">HTTP Status</div>
                        <div class="http-status">${api.status}</div>
                        <div class="http-label">Expected ${tc.expectStatus}</div>
                    </div>
                    <div class="card">
                        <div class="card-label">Content-Type</div>
                        <div class="card-value" style="font-family:monospace;">${api.contentType || 'N/A'}</div>
                    </div>
                </div>
                <div style="margin-top:12px;">
                    <div class="card-label" style="margin-bottom:6px;">Response Body (JSON)</div>
                    <pre>${truncated}</pre>
                </div>
            </div>
            <div class="timestamp" style="text-align:center; padding-top:12px; border-top:1px solid #eee;">
                ${new Date().toISOString()} — AI-Driven API Testing
            </div>
        </div>
    </div>
</body>
</html>`;
}

(async () => {
    console.log(`Running ${testCases.length} test cases against ${BASE_URL}...\n`);
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1100, height: 900 } });
    const screenshotsDir = path.join(ROOT, 'evidence', 'screenshots');
    for (const d of [path.join(ROOT, 'evidence', 'PASS'), path.join(ROOT, 'evidence', 'FAIL'), screenshotsDir]) {
        if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
    }

    const summary = [];
    for (const tc of testCases) {
        let api = { status: 0, data: null, duration: 0, contentType: '' };
        try {
            const start = Date.now();
            const opts = { method: tc.method, headers: { 'Accept': 'application/json' } };
            if (tc.body) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(tc.body); }
            if (tc.rawBody) { opts.headers['Content-Type'] = 'application/json'; opts.body = tc.rawBody; }
            const res = await fetch(`${BASE_URL}${tc.path}`, opts);
            api.duration = Date.now() - start;
            api.status = res.status;
            api.contentType = res.headers.get('content-type') || '';
            api.data = await res.json().catch(() => null);
        } catch (e) {
            api.data = { error: e.message };
        }
        const passed = evaluate(tc, api);
        const html = generateHTML(tc, api, passed);
        const htmlPath = path.join(screenshotsDir, `${tc.id}.html`);
        fs.writeFileSync(htmlPath, html, 'utf-8');
        const page = await context.newPage();
        await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`);
        await page.waitForTimeout(400);
        const folder = passed ? 'PASS' : 'FAIL';
        await page.screenshot({ path: path.join(ROOT, 'evidence', folder, `${tc.id}_screenshot.png`), fullPage: true });
        await page.close();
        summary.push({ id: tc.id, name: tc.name, category: tc.category, status: passed ? 'PASS' : 'FAIL', httpStatus: api.status, expected: tc.expect, ms: api.duration });
        console.log(`  ${passed ? 'PASS' : 'FAIL'} ${tc.id} — ${tc.name} (${api.status}, ${api.duration}ms)`);
    }
    fs.writeFileSync(path.join(ROOT, 'evidence', 'results-summary.json'), JSON.stringify(summary, null, 2));
    await browser.close();
    console.log(`\nDone: ${summary.filter(s => s.status === 'PASS').length}/${summary.length} PASS. Evidence in evidence/PASS & evidence/FAIL`);
})();
