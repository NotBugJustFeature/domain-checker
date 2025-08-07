```js
jQuery.fn.dataTable.tables(true).forEach(function (tbl) {
    var api = jQuery(tbl).DataTable()
    console.log('=== TABLE ID:', api.table().node().id, '===')

    // Végigmegyünk az összes soron
    let result = []
    api.rows().every(function () {
        result.push(this.data())
    })
    console.log(result)
})
```
