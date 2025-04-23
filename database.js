require("dotenv").config();
const mongoose = require("mongoose");

// mongoose.set('useNewUrlParser', true);
// mongoose.set('useUnifiedTopology', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useUnifiedTopology', true);

class Database {

    constructor() {
        this.connect();
    }

    connect() {
        const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority&appName=${process.env.MONGO_APP_NAME}`;

mongoose.connect(uri)
        .then(() => console.log("Database connection successful"))
        .catch(err => console.error("Database connection error:", err));
    }
}

module.exports = new Database();
