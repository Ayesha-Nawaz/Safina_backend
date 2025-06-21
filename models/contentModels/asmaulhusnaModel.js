const mongoose = require('mongoose');
const AsmaulHusnaSchema = require('../../schema/ContentSchemas/AsmaulhusnaSchema')

const AsmaulHusna = mongoose.model('AsmaulHusna', AsmaulHusnaSchema);

module.exports = AsmaulHusna;
