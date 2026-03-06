const dayjs = require('dayjs')
const axios = require('axios')
const mongoose = require('mongoose')
const crone = require('node-cron')
const dotenv = require('dotenv')
const { Router } = require('express');

const leadsModel = require('../models/leadsModel')


const { getLeadsToDate, aggregateUsersLeads, calculateClearByUser } = require('../services/leadsService.js')

const router = Router()

router.get('/api/leads/get', async (req, res) => {

    try {

        const { gte, lte } = req.query

        const leadsData = await getLeadsToDate(gte, lte)

        res.status(200).json({
            leads: leadsData
        })
    } catch (e) {
        // console.log(e.message)
        res.status(500).json({
            msg: e.message
        })
    }

})

module.exports = router