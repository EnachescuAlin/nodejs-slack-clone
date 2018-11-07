import mongoose from 'mongoose';

const senderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    username: {
        type: mongoose.Schema.Types.String,
        required: true
    }
}, { _id : false });

const receiverSchema = mongoose.Schema({
    channelId: {
        type: mongoose.Schema.Types.ObjectId
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
    }
}, { _id : false });

const messageSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
        alias: 'id'
    },
    sender: senderSchema,
    text: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    receiver: receiverSchema,
    addDate: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
    }
});
              
messageSchema.methods.toDto = function () {
    return {
        id: this._id,
        sender: this.sender,
        text: this.text,
        receiver: this.receiver
    }
}

export default mongoose.model('Message', messageSchema);
