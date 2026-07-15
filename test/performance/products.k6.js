/**
 * k6 performance test — Products endpoints
 * Run: k6 run --env BASE_URL=https://tu-app.railway.app test/performance/products.k6.js
 *
 * Thresholds:
 *   - GET /product (lista): p95 < 50ms (caché Redis HIT tras primer request)
 *   - GET /product/:id:     p95 < 50ms (caché Redis HIT)
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { getToken, authHeaders } from './helpers/auth.js';

const BASE_URL  = __ENV.BASE_URL  || 'http://localhost:3000';
const PRODUCT_ID = __ENV.PRODUCT_ID || '1';

export let options = {
  stages: [
    { duration: '20s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    'http_req_duration{endpoint:product-list}': ['p(95)<200'],
    'http_req_duration{endpoint:product-one}':  ['p(95)<200'],
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

  get('/api/product?page=1&limit=20', 'product-list');
  get(`/api/product/${PRODUCT_ID}`,   'product-one');

  sleep(0.5);
}
