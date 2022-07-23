const lunr = require('lunr-chinese')()
const path = require("path")

const contents = require(path.resolve(__dirname, "../static/lunr.json"))

console.log(contents);

let idx = lunr(function() {
  this.ref("uri")
  this.field('title', { boost: 10 })
  this.field('categories')
  this.field('content')
})

const postContents = contents.map(content => {
    idx.add(content)
})

// get the Lunr instance(use locally)
// const lunrCn = lunr.init(idx, postContents)
// lunrCn.search('例子')

// generate the Lunr Index file
lunr.init(idx, postContents, './lunrCnIndexs.json')


let res = idx.search("开源")

console.log(res);
