const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

const jar = new CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true, baseURL: 'http://localhost:5000/api' }));

async function testAPI() {
    const username = `user_${Date.now()}`;
    const password = 'password123';
    const email = `${username}@example.com`;

    try {
        console.log(`1. Registering user: ${username}`);
        await client.post('/auth/register', {
            username,
            email,
            password,
            phone: '1234567890'
        });
        console.log('✅ Registration Successful');

        console.log('2. Logging in...');
        await client.post('/auth/login', {
            username,
            password
        });
        console.log('✅ Login Successful (Cookie received)');

        console.log('3. Checking Balance...');
        const balanceRes = await client.get('/user/balance');
        console.log(`✅ Balance Retrieved: ${balanceRes.data.balance}`);

        if (balanceRes.data.balance == 100000) {
            console.log('🎉 VERIFICATION PASSED: Initial balance is correct.');
        } else {
            console.error('❌ VERIFICATION FAILED: Incorrect balance.');
        }

    } catch (error) {
        console.error('❌ VERIFICATION FAILED:', error.response ? error.response.data : error.message);
    }
}

testAPI();
