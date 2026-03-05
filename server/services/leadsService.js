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

async function getLeadsByUser(gte, lte, name) {

    const usersLeadsToDate = await leadsModel.find({
        date: {
            $gte: dayjs(gte).format('YYYY-MM-DD'),
            $lte: dayjs(lte).format('YYYY-MM-DD')
        },
        userName: name
    })

    return usersLeadsToDate
}

function calculateClearByUser(userObject, countUsers) {

    const brokerSalary = Math.floor(userObject.sumHold * 0.6 * 0.15)
    const minusOfBase = Math.floor(5000 / countUsers)
    const allSumHold = userObject.sumHold * 0.6

    const clear = Math.floor(allSumHold - minusOfBase - brokerSalary - userObject.salary)

    return {
        clear: clear,
        brokerSalary: brokerSalary
    }
}

function aggregateUsersLeads(array) {

    let arrayObject = {}
    let allowedHolds = ['hold', 'confirmed', 'refused']

    array.forEach((item) => {
        if (arrayObject[item.userName]) {
            arrayObject[item.userName].countLeads++
            arrayObject[item.userName].countHolds += allowedHolds.includes(item.residenceStatus) ? 1 : 0
            arrayObject[item.userName].sumHold += item.price
            arrayObject[item.userName].countTargets += item.statusOKK === true ? 1 : 0
        } else {
            arrayObject[item.userName] = {
                userName: item.userName,
                countLeads: 1,
                countHolds: allowedHolds.includes(item.residenceStatus) ? 1 : 0,
                sumHold: item.price,
                countTargets: item.statusOKK === true ? 1 : 0
            }
        }
    })

    return Object.values(arrayObject)

}

module.exports = { upsertNewLeadsData, getLeadsToDate, aggregateUsersLeads, getLeadsByUser, calculateClearByUser }