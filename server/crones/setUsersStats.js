const dayjs = require('dayjs')
const axios = require('axios')
const mongoose = require('mongoose')
const crone = require('node-cron')
const dotenv = require('dotenv')

const leadsModel = require('../models/leadsModel.js')
const usersModel = require('../models/usersModel.js')

const { getSkorozvonCalls } = require('../services/skorozvonService.js')
const { getLeadsToDate, aggregateUsersLeads } = require('../services/leadsService.js')

async function setUsersStatsToDB(gte, lte) {
    
    const usersCalls = await getSkorozvonCalls(gte, lte)
    const usersLeads = await getLeadsToDate(gte, lte)

    const aggregatedUsersLeads = aggregateUsersLeads(usersLeads)

    aggregatedUsersLeads.forEach((user) => {
        console.log(user)
    })

}


function setUsersStatsCrone() {
    const croneHour = '0 * * * *'

    setUsersStatsToDB(new Date(), new Date())
  
    // crone.schedule(croneHour, () => {
    //     setUsersStatsToDB(new Date(), new Date())
    // })
  }

module.exports = { setUsersStatsCrone }