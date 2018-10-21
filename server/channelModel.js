import { mongo } from 'mongoose';

const mongoose = require('mongoose');
const counterModel = require('./countersModel');

const ChannelSchema = mongoose.Schema({
    channelId: {
        type: mongoose.Schema.Types.Number,
        unique: true
    },
    name: {
        type: mongoose.Schema.Types.String,
        unique: true,
        required: true
    },
    description: {
        type: mongoose.Schema.Types.String
    },
    isPublic: {
        type: mongoose.Schema.Types.Boolean
    },
    creationDate: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
    },
    createdBy: {
        // user id
        type: mongoose.Schema.Types.Number
    },
    members: [
        {
            // user id
            type: mongoose.Schema.Types.Number
        }
    ]
});

ChannelSchema.pre('save', function(next) {
    let doc = this;
    counterModel.findOneAndUpdate(
        { 'name': 'channelId' },
        { $inc: { value: 1} },
        function(err, counter) {
            if (err) {
                console.log('could not generate channel id, err =', err);
                return next(err);
            }
            console.log('generate channel id =', counter.value);
            doc.channelId = counter.value;
            next();
        }
    )
});

module.exports = mongoose.model('Channel', ChannelSchema);
