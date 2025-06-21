const mongoose = require('mongoose');
const AsmaulNabiSchema = require('../../schema/ContentSchemas/asmaulnabischema')

const AsmaulNabi = mongoose.model('AsmaulNabi', AsmaulNabiSchema);

module.exports = AsmaulNabi;
