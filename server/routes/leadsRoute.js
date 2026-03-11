const dayjs = require('dayjs')
const axios = require('axios')
const mongoose = require('mongoose')
const crone = require('node-cron')
const dotenv = require('dotenv')
const { Router } = require('express');

const leadsModel = require('../models/leadsModel')

const { getLeadsToDate, aggregateUsersLeads, calculateClearByUser, getLeadsByUser } = require('../services/leadsService.js')

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

module.exports = router