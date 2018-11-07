import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
        alias: 'id'
    },
    username: {
        type: mongoose.Schema.Types.String,
        unique: true,
        required: true
    },
    passwordHash: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    firstname: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    lastname: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    registerDate: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
    },
    status: {
        type: mongoose.Schema.Types.String,
        default: ""
    },
    channels: [
        {
            type: mongoose.Schema.Types.ObjectId,
        }
    ],
    online: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
    directMessages: [
        {
            type: mongoose.Schema.Types.ObjectId
        }
    ]
});

userSchema.methods.toDto = function() {
    return {
      id: this._id,
      username: this.username,
      firstname: this.firstname,
      lastname: this.lastname,
      registerDate: this.registerDate,
      email: this.email,
      channels: this.channels,
      online: this.online,
      directMessages: this.directMessages
    };
};

export default mongoose.model('User', userSchema);
