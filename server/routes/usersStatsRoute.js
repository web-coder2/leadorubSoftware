const dayjs = require('dayjs')
const axios = require('axios')
const mongoose = require('mongoose')
const crone = require('node-cron')
const dotenv = require('dotenv')
const { Router } = require('express');

const usersStatsModel = require('../models/usersStats.js')


const router = Router()


router.get('/api/salary/get', async (req, res) => {

    try {

        const { gte, lte } = req.query

        const usersStatsArray = []

        const usersStatsData = await usersStatsModel.find({
            date: {
                $gte: gte,
                $lte: lte
            }
        })

        const todayStr = dayjs().format('YYYY-MM-DD')

        const result = usersStatsData.map((item) => {
            let newItem = { ...item.toObject() };
            return newItem;
          });

        let resultObject = {}

        function getBonusByDate(item) {
            let bonus = 0;
        
            if (dayjs(item.date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')) {
                if (dayjs().hour() > 21) { // прошло больше 21 часов дня
                    bonus = item.scriptBonus;
                } else {
                    bonus = 0;
                }
            } else {
                bonus = item.scriptBonus
            }
        
            return bonus;
        }

        result.forEach((item) => {

            let bonusByDate = getBonusByDate(item)

            if (resultObject[item.name]) {
                resultObject[item.name].countCalls += item.countCalls || 0
                // resultObject[item.name].countCallsWithProfile += item.countCallsWithProfile
                resultObject[item.name].countCallsWithProfile += 0
                resultObject[item.name].countLeads += item.countLeads
                resultObject[item.name].countTargets += item.countTargets
                resultObject[item.name].countHolds += item.countHolds
                resultObject[item.name].sumHold += item.sumHold
                resultObject[item.name].salary += Math.round(item.salary)
                resultObject[item.name].scriptBonus += bonusByDate
                resultObject[item.name].clear += item.clear
                resultObject[item.name].brokerSalary += item.brokerSalary
            } else {
                resultObject[item.name] = {
                    name: item.name,
                    email: item.email,
                    countCalls: item.countCalls || 0,
                    // countCallsWithProfile: item.countCallsWithProfile,
                    countCallsWithProfile: 0,
                    countLeads: item.countLeads,
                    countTargets: item.countTargets,
                    countHolds: item.countHolds,
                    sumHold: item.sumHold,
                    salary: Math.round(item.salary),
                    scriptBonus: bonusByDate,
                    clear: item.clear,
                    brokerSalary: item.brokerSalary,
                }
            }
        })

        resultObject = Object.values(resultObject)

        const total = {
            name: 'Итого',
            email: 'total@total.com',
            countCalls: 0,
            countLeads: 0,
            countTargets: 0,
            countHolds: 0,
            sumHold: 0,
            salary: 0,
            scriptBonus: 0,
            clear: 0,
            brokerSalary: 0,
            countCallsWithProfile: 0,
        };

        resultObject.forEach(item => {
            total.countCalls += item.countCalls || 0;
            total.countCallsWithProfile += item.countCallsWithProfile || 0
            total.countLeads += item.countLeads || 0;
            total.countTargets += item.countTargets || 0;
            total.countHolds += item.countHolds || 0;
            total.sumHold += item.sumHold || 0;
            total.salary += item.salary || 0;
            total.scriptBonus += item.scriptBonus || 0;
            total.clear += item.clear || 0;
            total.brokerSalary += item.brokerSalary || 0;
        });

        resultObject.push(total)

        res.status(200).json({
            data: resultObject
        })

    } catch (e) {
        res.status(500).json({
            msg: e.message
        })
    }

})

module.exports = router