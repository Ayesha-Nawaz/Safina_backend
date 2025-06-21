const mongoose = require('mongoose');
const StorySchema = require('../../schema/ContentSchemas/StorySchema')

const Story = mongoose.model('Story', StorySchema);

module.exports = Story;
