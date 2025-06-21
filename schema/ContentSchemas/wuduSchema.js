const mongoose = require("mongoose");

const WuduSchema = new mongoose.Schema({
    titleEn: {
        type: String,
        required: true
    },
    titleUr:
    {
        type: String,
        required: true
    },
    descriptionEn:
    {
        type: String,
        required: true
    },
    descriptionUr:
    {
        type: String,
        required: true
    },
});

module.exports = WuduSchema;