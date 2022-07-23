const lunrSearcher = lunr(function () {
    this.use(lunr.zh);
    this.ref("uri")
    this.field('title');
    // this.field("tags", { boost: 4 });
    this.field('content');

    fetch("/lunr.json")
        .then(res => res.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                let item = data[i]
                // item.id = i+1
                this.add(item)
            }
        })
});


window.onload = function () {

    const search = document.querySelector('.search-input')

    console.log(lunrSearcher);
    

    search.addEventListener('input', (e) => {
        // console.log(e.target.value);

        let searchStr = e.target.value;

        if (searchStr.trim()) {

            let result = lunrSearcher.search(searchStr.trim());

            console.log('result: ', searchStr.trim(), result);
        }

    })
}