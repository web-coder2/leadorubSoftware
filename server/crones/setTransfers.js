const dayjs = require('dayjs')
const axios = require('axios')
const mongoose = require('mongoose')
const crone = require('node-cron')
const dotenv = require('dotenv')

const leadsModel = require('../models/leadsModel.js')

const { getSkorozvonToken, getLeadsToOneDay, getLeadTimeline, getLeadAudioUrls } = require('../services/skorozvonService.js')
const { getResidenceLeads, getLeadsOnePhone } = require('../services/residenceService.js')


async function setTransfersToDB(gte, lte) {

    const leadsToDate = await getLeadsToOneDay(gte, lte)

    for (let lead of leadsToDate) {

        let leadUser = await getLeadTimeline(lead)

        let leadResidence = await getLeadsOnePhone(gte, lte, lead.number.slice(1))
        let leadAudioArray = await getLeadAudioUrls(lead)

        let leadInfo = {
            date: dayjs(gte).format('YYYY-MM-DD'),
            broker: leadResidence.broker,
            price: leadResidence.price,
            phone: lead.number.slice(1),
            audioArray: leadAudioArray,
            residenceStatus: leadResidence.status,
            statusOKK: false,
            selfLead: false,
            user: leadUser
        }

        console.log(leadInfo)

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