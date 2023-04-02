// const lunrSearcher = lunr(function () {
//     this.use(lunr.zh);
//     this.ref("uri")
//     this.field('title');
//     // this.field("tags", { boost: 4 });
//     this.field('content');

//     fetch("/lunr.json")
//         .then(res => res.json())
//         .then(data => {
//             for (let i = 0; i < data.length; i++) {
//                 let item = data[i]
//                 // item.id = i+1
//                 this.add(item)
//             }
//         })
// });

// window.onload = function () {

//     const search = document.querySelector('.search-input')

//     console.log(lunrSearcher);

//     search.addEventListener('input', (e) => {
//         // console.log(e.target.value);

//         let searchStr = e.target.value;

//         if (searchStr.trim()) {

//             let result = lunrSearcher.search(searchStr.trim());

//             console.log('result: ', searchStr.trim(), result);
//         }

//     })
// }

hljs.highlightAll();

function addCopyButtons(clipboard) {
  document
    .querySelectorAll(".highlight td:nth-child(2) pre > code")
    .forEach(function (codeBlock) {
      var button = document.createElement("button");
      button.className = "copy-code-button";
      button.type = "button";
      button.innerText = "Copy";

      button.addEventListener("click", function () {
        clipboard.writeText(codeBlock.innerText).then(
          function () {
            button.blur();

            button.innerText = "Copied!";

            setTimeout(function () {
              button.innerText = "Copy";
            }, 2000);
          },
          function (error) {
            button.innerText = "Error";
          }
        );
      });

      var pre = codeBlock.parentNode;
      if (pre.parentNode.classList.contains("highlight")) {
        var highlight = pre.parentNode;
        highlight.parentNode.insertBefore(button, highlight);
      } else {
        pre.parentNode.insertBefore(button, pre);
      }
    });
}

if (navigator && navigator.clipboard) {
  addCopyButtons(navigator.clipboard);
} else {
  var script = document.createElement("script");
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/clipboard-polyfill/2.7.0/clipboard-polyfill.promise.js";
  script.integrity = "sha256-waClS2re9NUbXRsryKoof+F9qc1gjjIhc2eT7ZbIv94=";
  script.crossOrigin = "anonymous";
  script.onload = function () {
    addCopyButtons(clipboard);
  };

  document.body.appendChild(script);
}
