const dayjs = require('dayjs')
const axios = require('axios')
const mongoose = require('mongoose')
const crone = require('node-cron')
const dotenv = require('dotenv')
const { Router } = require('express');

const usersModel = require('../models/usersModel')


const router = Router();

router.post('/api/users/auth', async (req, res) => {

    try {

        const { email, password } = req.body

        let usersFounded = await usersModel.find({
            email: email,
            password: password
        })

        if (usersFounded) {
            res.status(200).json({
                user: usersFounded
            })
        } else {
            res.status(304).json({
                msg: "user not found"
            })
        }

    } catch (e) {
        res.status(500).json({
            e: e.message
        })
    }

})

module.exports = { router }