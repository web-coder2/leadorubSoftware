const dayjs = require('dayjs')
const axios = require('axios')
const mongoose = require('mongoose')
const crone = require('node-cron')
const dotenv = require('dotenv')

const leadsModel = require('../models/leadsModel.js')
const usersModel = require('../models/usersModel.js')

const { getSkorozvonToken, getLeadsToOneDay, getLeadTimeline, getLeadAudioUrls } = require('../services/skorozvonService.js')
const { getResidenceLeads, getLeadsOnePhone, defaineSelfLead } = require('../services/residenceService.js')
const { getAllUsers, getUserIdByName } = require('../services/usersService.js')
const { upsertNewLeadsData } = require('../services/leadsService.js')


async function setTransfersToDB(gte, lte) {
    try {
      const leadsToDate = await getLeadsToOneDay(gte, lte);
  
      if (!Array.isArray(leadsToDate)) {
        console.error('leadsToDate не является массивом:', leadsToDate);
        return;
      }
  
      for (let lead of leadsToDate) {
        let leadUser = await getLeadTimeline(lead);
        let leadResidence = await getLeadsOnePhone(gte, lte, lead.number.slice(1));
        let leadAudioArray = await getLeadAudioUrls(lead);
        let userIdObject = await getUserIdByName(leadUser);
        let isSelfLead = await defaineSelfLead(gte, lte, lead.number.slice(1));
  
        
        // в эту переменую долен вернстьяс масив записаться

        if (leadResidence) {
          for (let item of leadResidence) {
            let leadInfo = {
              date: dayjs(gte).format('YYYY-MM-DD'),
              broker: item.broker,
              price: item.price,
              offerName: item.offerName,
              phone: lead.number.slice(1),
              audioArray: leadAudioArray,
              residenceStatus: item.status,
              statusOKK: false,
              selfLead: isSelfLead,
              user: userIdObject?._id ?? undefined,
              userName: leadUser,
              countHold: item.countHold,
              isEdited: false,
              commentOKK: ""
            };
            const result = await upsertNewLeadsData(leadInfo);
          }
        }
      }
  
      console.log('Обновление в базу за ', dayjs(gte).format('YYYY-MM-DD'), 'закончилось');
    } catch (error) {
      console.error('Ошибка в setTransfersToDB:', error.message);
    }
}

function setTransfersCrone() {
    const croneHour = '0 * * * *'

    setTransfersToDB(new Date('2026-03-11'), new Date('2026-03-11'))
  
    crone.schedule(croneHour, () => {
        setTransfersToDB(new Date(), new Date())
    })
  }

module.exports = { setTransfersCrone }