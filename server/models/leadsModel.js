const { Schema, model } = require('mongoose');

const leadsModel = new Schema({
    date: String,
    broker: String,
    price: Number,
    phone: String,
    audioArray: Array,
    residenceStatus: String,
    statusOKK: Boolean,
    selfLead: Boolean,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'usersModel',
        required: false // TODO: потом возможно поменять
    },
    userName: String,
    countHold: Number,
    isEdited: Boolean, // это фалжок лидии алексеевны (ОКК)
    commentOKK: {
        type: String,
        required: false,
        default: ""
    },
    offersList: {
        type: [{
            offerName: String,
            broker: String,
            price: Number,
            status: String,
        }],
        required: false,
        default: []
    }
})

module.exports = model('leadsModel', leadsModel);