const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const newspapers = [
    {
        name: 'thehindu',
        address: 'https://www.thehindu.com/topic/coronavirus',
        base: ''
    },
    {
        name: 'thetimesofindia',
        address: 'https://timesofindia.indiatimes.com/coronavirus',
        base: ''
    },
    {
        name: 'hindustantimes',
        address: 'https://www.hindustantimes.com/topic/omicron',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/world/coronavirus-outbreak',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/coronavirus/',
        base: 'https://www.telegraph.co.uk'
    },
    {
        name: 'telegraphindia',
        address: 'https://www.telegraphindia.com/topic/coronavirus',
        base: 'https://www.telegraphindia.com'
    },
    {
        name: 'economictimes',
        address: 'https://economictimes.indiatimes.com/coronavirus/coronavirus/storylisting/msid-74203027,page-4.cms?query=coronavirus',
        base: 'https://economictimes.indiatimes.com'
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.com/news/coronavirus',
        base: 'https://www.bbc.com'
    },
    {
        name: 'thetribune',
        address: 'https://www.tribuneindia.com/news/coronavirus',
        base: 'https://www.tribuneindia.com'
    },
    {
        name: 'nyp',
        address: 'https://www.nyp.org/coronavirus-information',
        base: ''
    },
]

const app = express()

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            $('a:contains("corona")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name

                })
            })
        })
})

app.get('/', (req, res) => {
    res.json("Welcome to the COVID-19 News API")
})


app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []
            $('a:contains("corona")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`))