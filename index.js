const fs = require("fs")
const path = require("path")
var propertiesReader = require('properties-reader')
var filePath = path.resolve('./src')

readFileList(filePath)

function readFileList(filePath) {
    fs.readdir(filePath, (err, files) => {
        if (err) {
            console.warn(err)
        } else {
            files.forEach(filename => {
                var filedir = path.join(filePath, filename)
                fs.stat(filedir, (err, stats) => {
                    if (err) {
                        console.warn('Get file stats failed')
                    } else {
                        var isFile = stats.isFile()
                        var isDir = stats.isDirectory()
                        if (isFile && filename.includes('.properties')) {
                            createJSONFile(filedir, filename)
                        }
                        if (isDir) {
                            readFileList(filedir)
                        }
                    }
                })
            })
        }
    })
}

function createJSONFile(filePath, fileName) {
    fs.readFile(filePath, {
        encoding: "utf-8"
    }, (err, data) => {
        if (!err) {
            const name = fileName.replace('.properties', '')
            fs.writeFile(path.join(__dirname, `./dist/${name}.json`), JSON.stringify({
                [name]: propertiesReader(filePath)._propertiesExpanded
            }), (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Write file success')
                }
            })
        }
    })
}