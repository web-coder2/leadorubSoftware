const dayjs = require('dayjs')
const axios = require('axios')
const mongoose = require('mongoose')
const crone = require('node-cron')
const dotenv = require('dotenv')

const leadsModel = require('../models/leadsModel.js')
const usersModel = require('../models/usersModel.js')

const { getSkorozvonCalls } = require('../services/skorozvonService.js')
const { getLeadsToDate, aggregateUsersLeads } = require('../services/leadsService.js')
const { calculateSalaryLeadorub, calculateSalaryHoldorub, calculateBonusToTargetsLeadorub, calculateBonusToClearPrice } = require('../services/salaryService.js')
const { getAllUsers, getUserIdByName } = require('../services/usersService.js')

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
        
        console.log(fullUserObject, user.userName)
    }

}


function setUsersStatsCrone() {
    const croneHour = '0 * * * *'

    setUsersStatsToDB(new Date(), new Date())
  
    // crone.schedule(croneHour, () => {
    //     setUsersStatsToDB(new Date(), new Date())
    // })
  }

module.exports = { setUsersStatsCrone }