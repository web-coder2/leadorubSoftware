const { Schema, model } = require('mongoose');

const usersStats = new Schema({
    email: String,
    name: String,
    date: String,
    countCalls: Number,
    countLeads: Number,
    countTargets: Number,
    countHolds: Number,
    sumHold: Number,
    salary: Number,
    bonus: Number,
    scriptBonus: Number,
    clear: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'usersModel',
        required: true
    }
})

module.exports = model('usersStats', usersStats);