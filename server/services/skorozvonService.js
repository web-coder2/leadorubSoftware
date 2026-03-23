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

async function getDifferenceByCalls(gte, lte, user) {

    // получить данные о звонках от имени админа
    // let dataCallsByAdmin = await getSkorozvonCalls(gte, lte)
    let dataCallsByAdmin = await getSkorozvonCallsByUser(gte, lte, user, user.countCalls)
    // console.log(dataCallsByAdmin, user.email)

    // взять масив звонков от акаунта лидоруба конкретного
    let dataCallsByUser = await getSkorozvonCallsFromProfile(gte, lte, user, mode = false)

    console.log('from admin: ', dataCallsByAdmin.length, 'from account: ', dataCallsByUser, '!!!!', user.email)

    // взять свойство (масив) от обхекта полученого у конкретного юзера и сравнить
    // let adminAndUsersCalls = dataCallsByAdmin.callsArray
    // let clearUsersCallsArray = dataCallsByUser.callsArray

    // console.log(gte, lte, user.name, user.email)
    // console.log('adminAndUsersCalls: ', adminAndUsersCalls.length, 'clearUsersCallsArray: ', clearUsersCallsArray.length)

    // const uniquePhones = clearUsersCallsArray.filter((phone) => {
    //     !adminAndUsersCalls.includes(phone)
    // });

    // console.log(uniquePhones, user)
}

async function getSkorozvonCallsFromProfile(gte, lte, user, mode = true) {

    try {

        if (user.email) {

            const response = await axios.post('https://app.skorozvon.ru/supreme/users/login?locale=ru', {
                "user" : {
                    // "email":"achkasovarkady97@yandex.ru",
                    "email": user.email,
                    // "password": user.password,
                    "password": 'qwertyuiop123A',
                    "ip_address":"e401fd27-748f-4b33-b03c-460454b1e702.local",
                    "tz_offset":-180,
                    "continue_token":""
                }
            });

            let userToken = response.data.callback_data.headers.authorization

            let userCallsPages = Math.ceil(user.callsCount / 100)
            let userCallsArray = []

            if (mode === true) {
                let result = await axios.get('https://pod5-shard2-lb1.skorozvon.ru/calls', {
                    headers: { Authorization: userToken },
                    params: {
                        limit: 100,
                        'date[from]': dayjs(gte).format('YYYY-MM-DD'),
                        'date[to]': dayjs(lte).format('YYYY-MM-DD'),
                        'duration[from]': 1,
                        type: 'all',
                        current_type: 'all',
                        direction: 1,
                        column: 'start',
                        page: 1,
                        offset: 0,
                    }
                })
                let responseDataByCalls = result.data.data.total

                return responseDataByCalls
            } else if (mode === false) {
                for (let i = 1; i <= userCallsPages; i++) {
                    let result = await axios.get('https://pod5-shard2-lb1.skorozvon.ru/calls', {
                        headers: { Authorization: userToken },
                        params: {
                            limit: 100,
                            'date[from]': dayjs(gte).format('YYYY-MM-DD'),
                            'date[to]': dayjs(lte).format('YYYY-MM-DD'),
                            'duration[from]': 1,
                            type: 'all',
                            current_type: 'all',
                            direction: 1,
                            column: 'start',
                            page: i,
                            offset: 0,
                        }
                    })
                    let data = result.data.data.calls

                    console.log(data)

                    data.forEach((call) => {
                        userCallsArray.push(call.number.slice(1))
                    })
                }
                return result
            }

        }

    } catch (e) {
        console.log(e.message)
    }

}


async function getSkorozvonCallsByUser(gte, lte, user, countCalls) {


    let countPages = Math.ceil(countCalls / 100)
    let callsArray = []

    const token = await getSkorozvonToken()

    const usersList = await axios.get('https://pod5-shard2-lb1.skorozvon.ru/settings/team.json', {
        headers: { 
            Authorization: `Bearer ${token}` 
        }
    }).then( res => res.data.data.team )

    let userObject = usersList.find((item) => {
        return item.email === user.email
    })

    const params = {
        limit: 100,
        'date[from]': dayjs(gte).format('YYYY-MM-DD'),
        'date[to]': dayjs(lte).format('YYYY-MM-DD'),
        'duration[from]': 1,
        type: 'all',
        offset: 0,
        users: userObject.id
    };

    for (let i = 1; i <= countPages; i++) {
        params['page'] = i

        const responseCalls = await axios.get('https://pod5-shard2-lb1.skorozvon.ru/calls', {
            headers: { Authorization: `Bearer ${token}` },
            params: params,
        });

        let callsData = responseCalls.data.data.calls

        callsData.forEach((call) => {
            callsArray.push(call.number.slice(1))
        })

    }

    return callsArray
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

        let callsFullDataArray = []

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

    let audioUrls = []

    try {

        const token = await getSkorozvonToken()
        const leadURL = `https://pod5-shard2-lb1.skorozvon.ru/${transfer.lead_url}/history`;

        const response = await axios.get(leadURL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const leads = response.data.data;

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
        // console.log(e.message)
        return audioUrls
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

module.exports = { getSkorozvonToken, getSkorozvonCalls, getLeadsToOneDay, getLeadTimeline, getLeadAudioUrls, getSkorozvonCallsFromProfile, getDifferenceByCalls }