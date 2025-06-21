const mongoose = require('mongoose');
const NamazSchema = require('../../schema/ContentSchemas/namazschema'); // import Namaz schema

const Namaz = mongoose.model('Namaz', NamazSchema); // create the model

module.exports = Namaz;