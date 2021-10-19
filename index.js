const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

   // arrow functions won't work here

const newspapers = [
    {
        name: 'onlinekhabar',
        address: 'https://www.onlinekhabar.com/',
        base: ''
    },
    {
        name: 'merolagani',
        address: 'https://merolagani.com/',
        base: 'https://merolagani.com'
    },
    {
        name: 'sharesansar',
        address: 'https://www.sharesansar.com/news-page',
        base: ''
    },
    {
        name: 'kantipur',
        address: 'https://ekantipur.com/',
        base: ''
    },
    {
        name: 'himalayantimes',
        address: 'https://thehimalayantimes.com/business',
        base: ''
    },
    {
        name: 'republica',
        address: 'https://myrepublica.nagariknetwork.com/category/economy',
        base: 'https://myrepublica.nagariknetwork.com'
    },
    {
        name: 'aarthiknews',
        address: 'https://aarthiknews.com/',
        base: 'https://aarthiknews.com/category/share-market'
    },
    {
        name: 'bizsala',
        address: 'https://www.bizshala.com/',
        base: ''
    },
    {
        name: 'karobardaily',
        address: 'https://www.karobardaily.com/category/share_bazaar',
        base: ''
    },
    {
        name: 'gorkhapatra',
        address: 'https://gorkhapatraonline.com/economics',
        base: ''
    }
]

const articles = []

const keywords = ["नेप्से","Nepse","nepse","NEPSE","शेयर","share","stocks","Stocks","अर्थतन्त्र","economy","पुँजी बजार"]

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            keywords.forEach(keyword =>{
                $(`a:contains(${keyword})`, html).each(function () {
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
})

app.get('/', (req, res) => {
    res.json('Welcome to my नेप्से News API')
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

            keywords.forEach(keyword =>{
                $(`a:contains(${keyword})`, html).each(function () {
                    const title = $(this).text()
                    const url = $(this).attr('href')
    
                    specificArticles.push({
                        title,
                        url: newspaperBase + url,
                        source: newspaperId
                    })
                })
            })

            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))