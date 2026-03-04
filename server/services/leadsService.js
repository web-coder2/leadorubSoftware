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


module.exports = { upsertNewLeadsData, getLeadsToDate }