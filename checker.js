import fs from 'fs'
import tqdm from 'tqdm'

async function checkDomain(domain) {
    try {
        const url = `https://${domain}`
        const response = await fetch(url, {
            method: 'GET', // Only get headers, don't download body
            timeout: 5000 // Timeout after 5 seconds
        })
        return response.ok // Check if status code is 200-299
    } catch (error) {
        return false // Return false if fetch fails (e.g. DNS error, timeout, etc)
    }
}

async function checkDomains(domains) {
    let good = []
    const batchSize = 64 // Number of parallel requests
    const batches = []

    // Split domains into batches
    for (let i = 0; i < domains.length; i += batchSize) {
        batches.push(domains.slice(i, i + batchSize))
    }

    // Process batches in parallel
    for (const batch of tqdm(batches)) {
        const results = await Promise.all(
            batch.map(async (domain) => {
                const result = await checkDomain(domain.domain)
                return { domain, result }
            })
        )

        // Filter and save good domains
        const goodDomains = results.filter((r) => r.result).map((r) => r.domain)

        if (goodDomains.length > 0) {
            good.push(...goodDomains)
            // fs.writeFileSync('good.json', JSON.stringify(good, null, 2))
        }
    }

    console.log(good)
    fs.writeFileSync('good.json', JSON.stringify(good, null, 2))
}
const domainsJSON = JSON.parse(fs.readFileSync('save.json', 'utf8'))
// let domains = domainsJSON.map((domain) => domain.domain)
// checkDomains(domainsJSON)
