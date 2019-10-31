#!/usr/bin/env node
const arg = require('arg')
const table = require('table')
let args = null

try {
    args = arg({
        '--url': Boolean,
        '--cookie': Boolean,
        '--json': Boolean,
        '--table': Boolean
    });
} catch (err) {
    console.log(err.message);
    process.exit(0)
}

const isJson = !!args['--json']
const isTable = !!args['--table']
const isURL = !!args['--url']
const isCookie = !!args['--cookie']
const example = '\nExample: parser \'?a=1&b=2&c=3\' --url'
let input = args['_'][0]
let data = [['key', 'value']]
let jsonData = {}

if ((isURL || isCookie) && input) {
    if (isURL) {
        input = input.indexOf('?') === 0 ? input.slice(1) : input
        input.split('&').map(item => {
            item = item.split('=')
            let key = decode(item[0])
            let value = decode(item[1])
            data.push([key, value])
            jsonData[key] = value
        })
    } else {
        input.split(';').map(item => {
            item = item.split('=')
            let key = item[0].trim()
            let value = item[1].trim()
            data.push([key, value])
            jsonData[key] = value
        })
    }
    if (isJson) {
        let jsonString = JSON.stringify(jsonData)
        console.log(jsonString.replace(/(,|{)/g, '$1\n    ').replace(/(})/g, '\n$1').replace(/\":\"/g, '\": \"'))
    } else {
        console.log(table.table(data))
    }
} else if (!input) {
    console.log(`Lack of input parameters. ${example}`)
} else {
    console.log(`Lack of config parameters. ${example}`)
}

function decode (string) {
    return decodeURIComponent(decodeURIComponent(string))
}

