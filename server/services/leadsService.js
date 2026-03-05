const dayjs = require('dayjs')
const axios = require('axios')
const mongoose = require('mongoose')
const crone = require('node-cron')
const dotenv = require('dotenv')

const leadsModel = require('../models/leadsModel.js')


async function getLeadsToDate(gte, lte) {

    try {

        const leadsToDate = await leadsModel.find({
            date: {
                $gte: dayjs(gte).format('YYYY-MM-DD'),
                $lte: dayjs(lte).format('YYYY-MM-DD')
            }
        })

        return leadsToDate

    } catch (e) {
        console.log(e.message)
    }

}

async function upsertNewLeadsData(lead) {

    try {
        const oldEntry = await leadsModel.findOneAndDelete({
            date: lead.date,
            phone: lead.phone,
            userName: lead.userName
        })

        const newEntry = new leadsModel({
            date: lead.date,
            phone: lead.phone,
            userName: lead.userName,
            broker: lead.broker,
            price: lead.price,
            audioArray: lead.audioArray,
            residenceStatus: lead.residenceStatus,
            statusOKK: lead.statusOKK,
            selfLead: lead.selfLead,
            user: lead.user
        })

        await newEntry.save()

    } catch (e) {
        console.log(e.message)
    }

}


function aggregateUsersLeads(array) {

    let arrayObject = {}
    let allowedHolds = ['hold', 'confirmed', 'refused']

    array.forEach((item) => {
        if (arrayObject[item.userName]) {
            arrayObject[item.userName].countLeads++
            arrayObject[item.userName].countHolds += allowedHolds.includes(item.residenceStatus) ? 1 : 0
            arrayObject[item.userName].sumHold += allowedHolds.includes(item.residenceStatus) ? item.price : 0
            arrayObject[item.userName].targets += item.statusOKK === true ? 1 : 0
        } else {
            arrayObject[item.userName] = {
                userName: item.userName,
                countLeads: 1,
                countHolds: allowedHolds.includes(item.residenceStatus) ? 1 : 0,
                sumHold: allowedHolds.includes(item.residenceStatus) ? item.price : 0,
                targets: item.statusOKK === true ? 1 : 0
            }
        }
    })

    return Object.values(arrayObject)

}

module.exports = { upsertNewLeadsData, getLeadsToDate, aggregateUsersLeads }