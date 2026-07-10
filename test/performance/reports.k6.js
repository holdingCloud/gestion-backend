/**
 * k6 performance test — Reports endpoints
 * Run: k6 run --env BASE_URL=https://tu-app.railway.app test/performance/reports.k6.js
 *
 * Thresholds (Chile → Supabase us-west-2, ~170ms RTT base):
 *   - Sin caché: p95 < 3000ms
 *   - Con caché: p95 < 80ms
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { getToken, authHeaders } from './helpers/auth.js';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export let options = {
  stages: [
    { duration: '20s', target: 3 },
    { duration: '1m', target: 3 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    'http_req_duration{endpoint:sales-by-product}':       ['p(95)<3000'],
    'http_req_duration{endpoint:clients-purchases}':      ['p(95)<3000'],
    'http_req_duration{endpoint:sales-evolution}':        ['p(95)<3000'],
    'http_req_duration{endpoint:inactive-clients}':       ['p(95)<3000'],
    'http_req_duration{endpoint:top-clients}':            ['p(95)<3000'],
    'http_req_duration{endpoint:avg-purchase-frequency}': ['p(95)<3000'],
    'http_req_duration{endpoint:daily-kpis}':             ['p(95)<3000'],
    'http_req_failed': ['rate<0.01'],
  },
};

let token;

export function setup() {
  token = getToken(BASE_URL);
  return { token };
}

export default function (data) {
  const headers = authHeaders(data.token);
  const start = '2024-01-01';
  const end   = new Date().toISOString().split('T')[0];

  function get(path, endpoint) {
    const res = http.get(`${BASE_URL}${path}`, { headers, tags: { endpoint } });
    check(res, { [`${endpoint} status 200`]: (r) => r.status === 200 });
    return res;
  }

  get(`/api/reports/sales-by-product?startDate=${start}&endDate=${end}`,        'sales-by-product');
  get(`/api/reports/clients-purchases?startDate=${start}&endDate=${end}`,        'clients-purchases');
  get(`/api/reports/sales-evolution?startDate=${start}&endDate=${end}`,          'sales-evolution');
  get(`/api/reports/inactive-clients`,                                            'inactive-clients');
  get(`/api/reports/top-clients?startDate=${start}&endDate=${end}`,              'top-clients');
  get(`/api/reports/avg-purchase-frequency?startDate=${start}&endDate=${end}`,   'avg-purchase-frequency');
  get(`/api/reports/daily-kpis`,                                                  'daily-kpis');

  sleep(1);
}
