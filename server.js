const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const dns = require('dns')
const urlSubmit = require('./urlSubmit.js')
const urlLookup = require('./urlLookup.js')

app.use('/public', express.static('./public'))
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

//The route you'll be sent when you submit the form on the home page
app.post('/api/shorturl/new', (req, res) => {
    //Getting just the domain name from the URL
    let urlDomain = req.body.url.replace(/http?s:\/\//, '').replace(/\/.*/, '')
    //Doing a dns lookup to see if the domain exists and returning an error if it doesn't
    dns.lookup(urlDomain, (err) => {
        if(err) {
            res.json({error:"Invalid URL"})
        } else {
            //Check database if the url exists, if it doesn't we create a new one and return the original and shrt URL
            urlSubmit(req.body.url)
                .then(data => {
                    res.json(data)
                })
        }
    })
})

//The route you call when you want to get a shortened url
app.get('/api/shorturl/:id', (req, res) => {
    //Sereach through database if short_url value exists and either redirect to new URL or return error if it doesn't exist.
    urlLookup(req.params.id)
        .then(data => {
            if(typeof data === 'string') {
                res.redirect(301, data)
            } else {
                res.json(data)
            }
        })
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Listening to port ' + (process.env.PORT || 3000))
})