import puppeteer from 'puppeteer'
import fs from 'fs'
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    })
}
export const scrape = async () => {
    // Launch browser
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    console.log('scrape initiated')
    // Go to a webpage
    await page.goto('https://www.domainabc.hu/felszabadulo-domainek/', {})
    console.log('scrape page loaded')
    // Wait for DataTable to be ready
    await page.waitForFunction(() => {
        return jQuery('#domain-pricing')?.DataTable()?.rows()?.[0]?.length !== 0
    })
    let result = []

    while (result.length === 0) {
        // Execute a script in the page context
        result = await page.evaluate(() => {
            const table = jQuery('#domain-pricing').DataTable()
            const results = []
            table.rows().every(function () {
                results.push(this.data())
            })

            // Explicitly return the results array from the evaluate function
            return JSON.parse(JSON.stringify(results))
        })
        console.log('scraping...')
        await delay(1000)
    }
    console.log('scrape done')
    console.log('Page Data:', result)
    fs.writeFileSync('result.json', JSON.stringify(result, null, 2))
    await browser.close()
}
