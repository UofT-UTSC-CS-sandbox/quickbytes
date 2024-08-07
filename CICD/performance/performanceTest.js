import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 10 }, // Ramp-up to 10 users over 30 seconds
        { duration: '1m', target: 10 },  // Stay at 10 users for 1 minute
        { duration: '30s', target: 0 },  // Ramp-down to 0 users over 30 seconds
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
        'checks': ['rate>0.95'], // 95% of checks must pass
    },
};

const BASE_URL = 'https://main--quickbytes-app.netlify.app/';

export default function () {
    // Test the main screen (root URL)
    let res = http.get(`${BASE_URL}/`);
    check(res, {
        'is status 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(1); // Simulate a pause between requests
}