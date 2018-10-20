const mongoose = require('mongoose');

const CounterSchema = mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        unique: true,
        required: true,
    },
    value: {
        type: mongoose.Schema.Types.Number,
        required: true
    }
});

module.exports = mongoose.model('Counter', CounterSchema);
