/**
 * k6 performance test — Clients endpoints
 * Run: k6 run --env BASE_URL=https://tu-app.railway.app test/performance/clients.k6.js
 *
 * Thresholds:
 *   - GET /clients (lista):  p95 < 700ms
 *   - GET /clients/:id:      p95 < 80ms (con caché Redis) / 300ms (MISS)
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { getToken, authHeaders } from './helpers/auth.js';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const CLIENT_ID = __ENV.CLIENT_ID || '1';

export let options = {
  stages: [
    { duration: '20s', target: 5 },
    { duration: '1m', target: 5 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    'http_req_duration{endpoint:clients-list}':      ['p(95)<700'],
    'http_req_duration{endpoint:client-one}':        ['p(95)<300'],
    'http_req_duration{endpoint:client-purchases}':  ['p(95)<700'],
    'http_req_duration{endpoint:client-frequency}':  ['p(95)<500'],
    'http_req_failed': ['rate<0.01'],
  },
};

export function setup() {
  return { token: getToken(BASE_URL) };
}

export default function (data) {
  const headers = authHeaders(data.token);

  function get(path, endpoint) {
    const res = http.get(`${BASE_URL}${path}`, { headers, tags: { endpoint } });
    check(res, { [`${endpoint} status 200`]: (r) => r.status === 200 });
    return res;
  }

  get('/api/clients?page=1&limit=20',                    'clients-list');
  get(`/api/clients/${CLIENT_ID}`,                       'client-one');
  get(`/api/clients/${CLIENT_ID}/purchases?page=1`,      'client-purchases');
  get(`/api/clients/${CLIENT_ID}/frequency`,             'client-frequency');

  sleep(1);
}
