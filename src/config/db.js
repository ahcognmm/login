const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost:27017/test`, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
module.exports = db;