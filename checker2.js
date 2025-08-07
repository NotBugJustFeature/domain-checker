import axios from 'axios'
import fs from 'fs'
const MAX_CONCURRENT = 5000

// Simulated list of API endpoints or request payloads
const requests = ['https://www.google.com', 'https://www.asdasadaddadadadadsads.com']

// Function to process one request
async function handleRequest(url) {
    try {
        // Try https first
        if (!url.startsWith('http://www.') && !url.startsWith('https://www.')) {
            try {
                const httpsUrl = `https://www.${url}`
                const response = await axios.get(httpsUrl, {
                    timeout: 5000
                })
                return !!response.data
            } catch (error) {
                // If https fails, try http
                const httpUrl = `http://www.${url}`
                const response = await axios.get(httpUrl, {
                    timeout: 5000
                })
                return !!response.data
            }
        } else {
            const response = await axios.get(url, {
                timeout: 5000
            })
            return !!response.data
        }
    } catch (error) {
        return false
    }
}

// Function to run requests in parallel with concurrency control
export const runConcurrentRequests = async (requests, maxConcurrent) => {
    let index = 0
    let activeCount = 0
    const results = []

    return new Promise((resolve) => {
        const next = () => {
            if (index >= requests.length && activeCount === 0) {
                // All done
                return resolve(results)
            }

            while (activeCount < maxConcurrent && index < requests.length) {
                const currentIndex = index++
                const url = requests[currentIndex]
                activeCount++

                console.log(`Processing: ${currentIndex} ${url.domain}`)
                handleRequest(url.domain)
                    .then((data) => {
                        // results[currentIndex] = data
                        console.log(`Completed: ${url.domain} ${data}`)
                        if (data) {
                            results.push(url)
                        }
                    })
                    .finally(() => {
                        activeCount--
                        next() // Trigger the next request
                    })
            }
        }

        next() // Initial trigger
    })
}
// const domainsJSON = JSON.parse(fs.readFileSync('save.json', 'utf8'))
// Start
// runConcurrentRequests(domainsJSON, MAX_CONCURRENT).then((allResults) => {
//     console.log('All requests complete', allResults)
// })
