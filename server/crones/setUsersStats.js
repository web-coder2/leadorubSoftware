const dayjs = require('dayjs')
const axios = require('axios')
const mongoose = require('mongoose')
const crone = require('node-cron')
const dotenv = require('dotenv')

const leadsModel = require('../models/leadsModel.js')
const usersModel = require('../models/usersModel.js')

const { getSkorozvonCalls } = require('../services/skorozvonService.js')
const { getLeadsToDate, aggregateUsersLeads, calculateClearByUser } = require('../services/leadsService.js')
const { calculateSalaryLeadorub, calculateSalaryHoldorub, calculateBonusToTargetsLeadorub, calculateBonusToClearPrice } = require('../services/salaryService.js')
const { getAllUsers, getUserIdByName, upserUsersStatsToDB } = require('../services/usersService.js')

async function setUsersStatsToDB(gte, lte) {
    
    const usersCalls = await getSkorozvonCalls(gte, lte)
    const usersLeads = await getLeadsToDate(gte, lte)

    const aggregatedUsersLeads = aggregateUsersLeads(usersLeads)

    for (let user of aggregatedUsersLeads) {

        let usersCallsObject = usersCalls.find((item) => {
            return item.name === user.userName
        })

        if (usersCallsObject) {
            user.email = usersCallsObject.email
            user.countCalls = usersCallsObject.countCalls
        }

        let fullUserObject = await getUserIdByName(user.userName)

        if (fullUserObject) {
            user.rankName = fullUserObject.rankName
            user._id = fullUserObject._id
        }

        if (user.rankName === "leadorub") {
            user.salary = calculateSalaryLeadorub(user)
        } else if (user.rankName === "holdorub") {
            user.salary = await calculateSalaryHoldorub(gte, lte, user)
        }

        let clearData = await calculateClearByUser(user, aggregatedUsersLeads.length)

        user.clear = clearData.clear
        user.brokerSalary = clearData.brokerSalary

        let scriptBonus = 0

        scriptBonus += await calculateBonusToTargetsLeadorub(user)
        scriptBonus += await calculateBonusToClearPrice(user)

        user.scriptBonus = scriptBonus
        user.date = dayjs(gte).format('YYYY-MM-DD')

        const result = await upserUsersStatsToDB(user)
    }

}


function setUsersStatsCrone() {
    const croneHour = '0 * * * *'

    setUsersStatsToDB(new Date('2026-03-13'), new Date('2026-03-13'))
  
    crone.schedule(croneHour, () => {
        setUsersStatsToDB(new Date(), new Date())
    })
  }

module.exports = { setUsersStatsCrone }