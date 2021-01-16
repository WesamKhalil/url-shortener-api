const mongoose = require('mongoose')
const URLModel = require('./models/url.js')

const mongoUrl = 'mongodb+srv://FCC:' + process.env.PW + '@cluster0.1mvbk.mongodb.net/url?retryWrites=true&w=majority'
mongoose.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true})

const urlLookup = short_url => {
    //Look for short_url and return appropriate value
    return URLModel.findOne({ new_url: short_url })
        .then(res => {
            if(res != null) {
                return res.original_url
            } else {
                return {
                    error: "No short URL found for the given input"
                }
            }
        })
}

module.exports = urlLookup