const dayjs = require('dayjs')
const axios = require('axios')
const mongoose = require('mongoose')
const crone = require('node-cron')
const dotenv = require('dotenv')

const leadsModel = require('../models/leadsModel.js')

const { getSkorozvonToken, getLeadsToOneDay, getLeadTimeline } = require('../services/skorozvonService.js')
const { getResidenceLeads } = require('../services/residenceService.js')


async function setTransfersToDB(gte, lte) {

    const leadsToDate = await getLeadsToOneDay(gte, lte)

    for (let lead of leadsToDate) {

        let leadUser = await getLeadTimeline(lead)

        console.log(leadUser)

    }

}

function setTransfersCrone() {
    const croneHour = '0 * * * *'

    setTransfersToDB(new Date(), new Date())
  
    // crone.schedule(croneHour, () => {
    //     setTransfersToDB(new Date(), new Date())
    // })
  }

module.exports = { setTransfersCrone }