const mongoose = require("mongoose");
const WuduSchema = require("../../schema/ContentSchemas/wuduSchema");

const Wudu = mongoose.model("Wudu", WuduSchema);

module.exports = Wudu;