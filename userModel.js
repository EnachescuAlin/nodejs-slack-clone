const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        unique: true,
        required: true,
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    channels: [
        {
            type: mongoose.Schema.Types.String,
        },
    ],
    online: {
        type: mongoose.Schema.Types.Boolean,
        default: false,
    },
});

module.exports = mongoose.model('User', UserSchema);
