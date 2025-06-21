const mongoose = require('mongoose');
const KalmaSchema = require('../../schema/ContentSchemas/kalmaSchema')

const Kalma = mongoose.model('Kalma', KalmaSchema);

module.exports = Kalma;
