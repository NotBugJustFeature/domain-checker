import { scrape } from './scrape.js'
import { runConcurrentRequests } from './checker2.js'
import fs from 'fs'
;(async () => {
    // await scrape()
    const domainsJSON = JSON.parse(fs.readFileSync('result.json', 'utf8'))
    const result = await runConcurrentRequests(domainsJSON, 5000)
    console.log(result)
    fs.writeFileSync('good.json', JSON.stringify(result, null, 2))
})()
