import http from 'k6/http';

export function getToken(baseUrl, email = 'superadmin@local.test', password = 'Super1234') {
  const res = http.post(
    `${baseUrl}/api/auth/login`,
    JSON.stringify({ email, password }),
    { headers: { 'Content-Type': 'application/json' } },
  );
  if (res.status !== 200 && res.status !== 201) {
    throw new Error(`Login failed: ${res.status} ${res.body}`);
  }
  return JSON.parse(res.body).accessToken;
}

export function authHeaders(token) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}
