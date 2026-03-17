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

async function defaineSelfLead(gte, lte, phone) {

    const allowedUsers = ['Владимир Медоед', 'Наташа Юрист ']

    const allLeadsToDate = await getResidenceLeads(gte, lte)
    const allLeadsData = allLeadsToDate.data
    const leadsByPhone = allLeadsData.filter((item) => {
        return item.phone === phone
    })

    let selfLead = false

    if (leadsByPhone) {
        for (let lead of leadsByPhone) {
            if (allowedUsers.includes(lead.userId.name)) {
                selfLead = true
                break
            }
        }
    }
    return selfLead
}

// получить лиды резиденции по одному телефону
async function getLeadsOnePhone(gte, lte, phone) {
    try {
        const allLeadsInDate = await getResidenceLeads(gte, lte)
        const allLeadsData = allLeadsInDate.data
        const allowedHolds = ['hold', 'confirmed', 'refused']

        const leadsByPhone = allLeadsData.filter((item) => {
            return item.phone === phone
        })
        let residenceInfo = {
            price: 0,
            status: "created",
            broker: undefined,
            countHold: 0,
        }

        let currentStatus = ""  // текущий статус во время итераций
        let holdStatus = null  // финалбьный статус если в какойто итеарции будет hold, confirmed или refused

        // Лидоруб сделал 1 трансфер и брокер с него сделал напрмиер 3 холда
        // тогда в price будет например 3000 + 4000 + 5000
        // status будет или hold или confirmed или refused
        // а countHold будет 1 + 1 + 1

        let holdsArray = []

        let leadsOnHold = leadsByPhone.filter((item) => {
            return allowedHolds.includes(item.status)
        })

        if (leadsOnHold.length > 0) {
            leadsOnHold.forEach((item) => {
                holdsArray.push({
                    price: item?.price?.offer ?? 0,
                    status: item.status,
                    broker: item?.userId?.name ?? '',
                    countHold: 1,
                    offerName: item?.offerId?.name ?? '',
                })
            })
        } else {
            holdsArray.push({
                price: 0,
                status: leadsByPhone[0].status,
                broker: leadsByPhone[0].userId.name,
                countHold: 0,
                offerName: item?.offerId?.name ?? '',
            })
        }

        return holdsArray
    } catch (e) {
        console.log(e.message)
    }
}


module.exports = { getResidenceLeads, getLeadsOnePhone, defaineSelfLead }