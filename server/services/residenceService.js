const dayjs = require('dayjs')
const axios = require('axios')
const mongoose = require('mongoose')
const crone = require('node-cron')
const dotenv = require('dotenv')

dotenv.config()

const { residenceBaseUrl, residenceToken } = process.env

async function geteResidenceLeads(gte, lte) {

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


module.exports = { geteResidenceLeads }