const dayjs = require('dayjs')
const axios = require('axios')
const mongoose = require('mongoose')
const crone = require('node-cron')
const dotenv = require('dotenv')
const { Router } = require('express');

const leadsModel = require('../models/leadsModel')
const usersStats = require('../models/usersStats.js')

const { getLeadsToDate, aggregateUsersLeads, calculateClearByUser, getLeadsByUser } = require('../services/leadsService.js')
const { getDifferenceByCalls } = require('../services/skorozvonService.js')
const { getUserIdByName } = require('../services/usersService')

const router = Router()

router.get('/api/leads/get', async (req, res) => {
    try {
        const { gte, lte } = req.query

        const statuses = req.query['statuses[]'];
        const users = req.query['users[]']
        
        console.log(statuses, users)

        const filter = {
            date: {
                $gte: gte,
                $lte: lte
            }
        }
  
        if (users) {
            const usersFilter = Array.isArray(users) ? users : [users];
            filter.userName = { $in: usersFilter };
        }
  
        if (statuses) {
            const statusesFilter = Array.isArray(statuses) ? statuses : [statuses];
            filter.residenceStatus = { $in: statusesFilter };
        }
  
        const leadsData = await leadsModel.find(filter);
  
        res.status(200).json({
            leads: leadsData
        });
    } catch (e) {
        res.status(500).json({
            msg: e.message
        });
    }
});


router.post('/api/leads/upsert', async (req, res) => {
    try {
        const { leadsData } = req.body

        for (let lead of leadsData) {
            
            const updateData = { ...lead };
            delete updateData._id;

            const result = await leadsModel.findOneAndUpdate(
                { phone: lead.phone, date: lead.date },
                { $set: updateData },
                { upsert: true, returnDocument: 'after' }
            );
        }

        res.status(200).json({
            msg: 'leads updated successfuly'
        })

    } catch (e) {
        res.status(500).json({
            msg: e.message
        })
    }

})

router.post('/api/leads/edit', async (req, res) => {
    try {

        let { editedLead } = req.body

        const updateData = { ...editedLead }
        delete updateData._id;

        const result = await leadsModel.findOneAndUpdate(
            { phone: editedLead.phone, date: editedLead.date },
            { $set: updateData },
            { upsert: true, returnDocument: 'after' }
        );

        res.status(200).json({
            msg: 'Лид успешно редактированый'
        })

    } catch (e) {
        console.log(e.message)
        res.status(500).json({
            msg: e.message
        })
    }
})

// сдесь будут добавляся лиды системеные но созданые админом если вдруг не получилось спарсить с скорозвона ебучего
router.post('/api/leads/create', async (req, res) => {

    try {

        const { leadObject } = req.body

        const userId = await getUserIdByName(leadObject.userName)

        let selfLeadValue = false

        if (leadObject.selfLead === 'Сам') {
            selfLeadValue = true
        } else if (leadObject.selfLead === 'На брокера') {
            selfLeadValue = false
        } else if (leadObject.selfLead === 'Ручной') {
            selfLeadValue = false
        }

        const newLeadObject = leadsModel({
            date: leadObject.date,
            broker: leadObject.broker,
            price: leadObject.price,
            phone: leadObject.phone.replace(/\D/g, ''),
            audioArray: leadObject.audioArray,
            residenceStatus: leadObject.residenceStatus,
            statusOKK: leadObject.statusOKK,
            // selfLead: leadObject.selfLead.value,
            selfLead: selfLeadValue,
            selfLeadName: leadObject.selfLead,
            user: userId?._id ?? null,
            userName: leadObject.userName,
            countHold: leadObject.countHold,
            isEdited: true,
        })

        const result = await newLeadObject.save()

        res.status(200).json({
            msg: 'lead created successfuly'
        })

    } catch (e) {
        res.status(500).json({
            msg: e.message
        })
    }

})


router.get('/api/leads/intensity', async (req, res) => {
    try {

        const { gte, userName } = req.query

        const lte = dayjs(gte).endOf('week').format('YYYY-MM-DD')

        let leads = await getLeadsByUser(gte, lte, userName)

        let intensity = {}

        leads.forEach((lead) => {
            if (!intensity[lead.date]) {
                intensity[lead.date] = [lead]
            } else {
                intensity[lead.date].push(lead)
            }
        })

        res.status(200).json({
            intensity
        })

    } catch (e) {
        res.status(500).json({
            msg: e.message
        })
    }
})

router.get('/api/test/diffinity', async (req, res) => {

    try {

        let { gte, lte } = req.query

        let difinityObjectsArray = []

        let usersStatsArrayOfUsers = await usersStats.find({
            date: {
                $gte: gte,
                $lte: lte
            }
        })

        for (let user of usersStatsArrayOfUsers) {
            let data = await getDifferenceByCalls(gte, lte, user)

            difinityObjectsArray.push(data)

        }

        res.status(200).json({
            data: difinityObjectsArray
        })

    } catch (e) {
        res.status(500).json({
            msg: e.message
        })
        console.log(e.message)
    }


})

module.exports = router