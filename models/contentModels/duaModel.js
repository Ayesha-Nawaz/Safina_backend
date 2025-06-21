const mongoose = require('mongoose');
const DuaSchema = require('../../schema/ContentSchemas/duaSchema')

const Dua = mongoose.model('Dua', DuaSchema);

module.exports = Dua;
