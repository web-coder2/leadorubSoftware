const dayjs = require('dayjs')
const axios = require('axios')
const mongoose = require('mongoose')
const crone = require('node-cron')
const dotenv = require('dotenv')


dotenv.config()

const { skorozvonAPI, skorozvonUSER, skorozvonID, skorozvonSecret } = process.env


async function getSkorozvonToken() {
    try {
        const response = await axios.post('https://api.skorozvon.ru/oauth/token', {
            grant_type: 'password',
            username: skorozvonUSER,
            api_key: skorozvonAPI,
            client_id: skorozvonID,
            client_secret: skorozvonSecret,
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Ошибка авторизации Skorozvon:', error);
    }
}


async function getSkorozvonCalls(gte, lte) {

    const params = {
        limit: 100,
        'date[from]': dayjs(gte).format('YYYY-MM-DD'),
        'date[to]': dayjs(lte).format('YYYY-MM-DD'),
        'duration[from]': 1,
        type: 'all',
        page: 1,
        offset: 0,
    };

    const token = await getSkorozvonToken()

    let usersCallsArray = []

    // получение юзеров из скорозвона
    const usersList = await axios.get('https://pod5-shard2-lb1.skorozvon.ru/settings/team.json', {
        headers: { 
            Authorization: `Bearer ${token}` 
        }
    }).then( res => res.data.data.team )


    for (let user of usersList) {
        const userParams = { ...params, users: user.id };
        const responseCalls = await axios.get('https://pod5-shard2-lb1.skorozvon.ru/calls', {
            headers: { Authorization: `Bearer ${token}` },
            params: userParams,
        });
        usersCallsArray.push({
            email: user.email,
            name: user.name,
            countCalls: responseCalls.data.data.total
        })
    }
    return usersCallsArray
}

module.exports = { getSkorozvonToken, getSkorozvonCalls }