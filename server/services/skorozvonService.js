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


async function getLeadsToOneDay(gte, lte) {

    try {
        const url = 'https://pod5-shard2-lb1.skorozvon.ru/calls';
        const token = await getSkorozvonToken()

        const params = {
            limit: 100,
            'date[from]': dayjs(gte).format('YYYY-MM-DD'),
            'date[to]': dayjs(lte).format('YYYY-MM-DD'),
            'duration[from]': '',
            'duration[to]': '',
            type: 'transfered',
            direction: 1,
            column: 'start',
            page: 1,
            offset: 0,
        };

        const trasnfersList = await axios.get(url, {
            params: params,
            headers: { Authorization: `Bearer ${token}`}
        }).then((resp) => {
            return resp.data.data.calls;
        });

        return trasnfersList
    } catch (e) {
        console.log(e.message)
    }

}

async function getLeadAudioUrls(transfer) {
    try {

        const token = await getSkorozvonToken()
        const leadURL = `https://pod5-shard2-lb1.skorozvon.ru/${transfer.lead_url}/history`;

        const response = await axios.get(leadURL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const leads = response.data.data;
        let audioUrls = []

        for (let lead of leads.data) {
            const audioUrl = `https://pod5-shard2-lb1.skorozvon.ru/call_records/${lead.attachment_id}`

            const responseUrl = await axios.get(audioUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // audioUrls.push({
            //     url: responseUrl.data.data.url,
            //     manager: responseUrl.data.data.track_manager
            // })

            audioUrls.push(responseUrl.data.data.url)

        }

        return audioUrls

    } catch (e) {
        console.log(e.message)
    }
}

async function getLeadTimeline(transfer) {
    try {
        const token = await getSkorozvonToken();
        const leadURL = `https://pod5-shard2-lb1.skorozvon.ru/${transfer.lead_url}/history`;

        let userName = "";

        const response = await axios.get(leadURL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const leads = response.data.data;

        for (let lead of leads.data) {

            let user = lead.called_user || lead.manager;

            if (user) {
                userName = user;
                break;
            }
        }

        return userName;

    } catch (e) {
        console.log(e.message);
        return null;
    }
}

module.exports = { getSkorozvonToken, getSkorozvonCalls, getLeadsToOneDay, getLeadTimeline, getLeadAudioUrls }