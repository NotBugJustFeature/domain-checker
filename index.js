import jsdom from 'jsdom'
fetch('https://www.domain-figyelo.hu/felszabadulo-domainek/1.oldal/felszabadulas-szerint')
    .then((response) => response.text())
    .then((html) => {
        const dom = new jsdom.JSDOM(html)
        const tables = dom.window.document.querySelectorAll('table')
        tables.forEach((table) => {
            console.log('=== TABLE ID:', table.id, '===')
            const rows = table.querySelectorAll('tr')
            rows.forEach((row) => {
                const cells = row.querySelectorAll('td')
                const rowData = Array.from(cells).map((cell) => cell.textContent)
                console.log(rowData)
            })
        })
    })
    .catch((error) => {
        console.error(error)
    })

/*
load and execute  this script

jQuery.fn.dataTable.tables(true).forEach(function(tbl) {
    var api = jQuery(tbl).DataTable();
    console.log("=== TABLE ID:", api.table().node().id, "===");

    // Végigmegyünk az összes soron
    api.rows().every(function() {
        console.log(this.data()); // Minden sor adata (array vagy object)
    });
});

*/
