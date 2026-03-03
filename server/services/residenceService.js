const dayjs = require('dayjs')
const axios = require('axios')
const mongoose = require('mongoose')
const crone = require('node-cron')
const dotenv = require('dotenv')

dotenv.config()

const { residenceBaseUrl, residenceToken } = process.env

async function getResidenceLeads(gte, lte) {
    try {
        const responseLeads = await axios.get(`${residenceBaseUrl}leads`, {
            headers: { Authorization: `Bearer ${residenceToken}` },
            params: {
                startedAt: ['gte:' + dayjs(gte).format('YYYY-MM-DD'), 'lte:' + dayjs(lte).format('YYYY-MM-DD')],
                _populate: 'userId offerId',
                _select: 'status phone startedAt price',
                _limit: 0,
            },
        })

        return responseLeads.data

    } catch (e) {
        console.log(e.message)
    }
}

// получить лиды резиденции по одному телефону
async function getLeadsOnePhone(gte, lte, phone) {

    try {

        const allLeadsInDate = getResidenceLeads(gte, lte)
        const allLeadsData = allLeadsInDate.data

        const leadsByPhone = allLeadsData.filter((item) => {
            return item.phone === phone
        })

        return leadsByPhone

    } catch (e) {
        console.log(e.message)
    }

}


module.exports = { getResidenceLeads }