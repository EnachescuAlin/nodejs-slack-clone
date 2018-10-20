const mongoose = require('mongoose');
const counterModel = require('./countersModel');

const UserSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.Number,
        unique: true
    },
    username: {
        type: mongoose.Schema.Types.String,
        unique: true,
        required: true
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    registerDate: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
    },
    status: {
        type: mongoose.Schema.Types.String
    },
    openPrivateMessages: [
        {
            type: mongoose.Schema.Types.String
        }
    ],
    channels: [
        {
            type: mongoose.Schema.Types.String,
        }
    ],
    online: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
});

UserSchema.pre('save', function(next) {
    let doc = this;
    counterModel.findOneAndUpdate(
        { 'name': 'userId' },
        { $inc: { value: 1 } },
        function(err, counter) {
            if (err) {
                console.log('could not generate user id, err =', err);
                return next(err);
            }
            console.log('generated user id =', counter.value);
            doc.userId = counter.value;
            next();
        }
    );
});

module.exports = mongoose.model('User', UserSchema);
