// вытаскивает основные цифры из отчётов lhci (manifest.json в папке reports/*)
import fs from 'node:fs';
import path from 'node:path';

const dir = process.argv[2];
const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
const rows = manifest
    .filter((m) => m.isRepresentativeRun)
    .map((m) => {
        const lhr = JSON.parse(fs.readFileSync(path.join(dir, path.basename(m.jsonPath)), 'utf8'));
        const a = lhr.audits;
        const c = lhr.categories;
        return {
            url: m.url,
            perf: c.performance.score,
            a11y: c.accessibility.score,
            bp: c['best-practices'].score,
            seo: c.seo.score,
            FCP: Math.round(a['first-contentful-paint'].numericValue),
            LCP: Math.round(a['largest-contentful-paint'].numericValue),
            TBT: Math.round(a['total-blocking-time'].numericValue),
            CLS: +a['cumulative-layout-shift'].numericValue.toFixed(3),
            SI: Math.round(a['speed-index'].numericValue),
            KB: Math.round(a['total-byte-weight'].numericValue / 1024),
        };
    });
console.table(rows);
