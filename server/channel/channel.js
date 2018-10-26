import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
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
        type: mongoose.Schema.Types.Number
    },
    members: [
        {
            type: mongoose.Schema.Types.Number
        }
    ]
});

export default mongoose.model('Channel', channelSchema);
