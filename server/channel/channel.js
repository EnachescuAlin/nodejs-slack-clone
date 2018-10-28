import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
        alias: 'id'
    },
    name: {
        type: mongoose.Schema.Types.String,
        unique: true,
        required: true
    },
    description: {
        type: mongoose.Schema.Types.String,
        default: ""
    },
    isPublic: {
        type: mongoose.Schema.Types.Boolean,
        required: true
    },
    creationDate: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId
        }
    ]
});

channelSchema.methods.toDto = function() {
    return {
        id: this._id,
        name: this.name,
        description: this.description,
        isPublic: this.isPublic,
        creationDate: this.creationDate,
        createdBy: this.createdBy,
        members: this.members
    };
};

export default mongoose.model('Channel', channelSchema);
