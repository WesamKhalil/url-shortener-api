const mongoose = require('mongoose')
const URLModel = require('./models/url.js')

const mongoUrl = 'mongodb+srv://FCC:' + process.env.PW + '@cluster0.1mvbk.mongodb.net/url?retryWrites=true&w=majority'
mongoose.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true})


const urlSubmit = url => {
    //Max is the maximum number of documents and acts as the value for the short_url.
    //By default it's one incase there's nothing in the collection and we need a number.
    //It's overwritten later on if we find an documents on the collection.
    let max = 1
    //look for original URL.
    return URLModel.findOne({ original_url: url})
        .then(res => {
            if(res != null) {
                //If original_url exists we send it back with it's short_url.
                return {
                    original_url: res.original_url,
                    new_url: res.new_url
                }
            } else {
                //If it doesn't exist we create a new document.
                //But first we find the largest value of short_url in our collection, and add 1 to it, then use that new number as the new short_url.
                return URLModel.findOne({})
                    .sort({ new_url: 'desc'})
                    .then(res => {
                        if(res != null) {
                            max = res.new_url + 1
                        }
                        URLModel.create({ original_url: url, new_url: max})
                        return {
                            original_url: url,
                            new_url: max
                        }
                    })
            }
        })
}

module.exports = urlSubmit