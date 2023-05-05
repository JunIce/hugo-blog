window.onload = function () {
  // 高亮
  hljs.highlightAll();
  // 复制按钮
  addCopyButton();
};

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

      insertAfterHighlight(codeBlock, button);
    });
}

function insertAfterHighlight(node, target) {
  while (!node.parentNode.classList.contains("highlight")) {
    node = node.parentNode;
  }
  node.parentNode.insertBefore(target, node);
}

function addCopyButton() {
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
}



const search = document.querySelector("#search-container")

search.addEventListener("click", onSearchClick, true)


const searchModal = document.querySelector('#search-modal')

searchModal.addEventListener("click", onSearchModalClick, true)

const DocSearchModal = document.querySelector('.DocSearch-Modal')

const modal = {
  show(){
    searchModal.classList.remove('hidden')
    document.body.classList.add('overflow-hidden')
    search.show = true
  },
  hide() {
    searchModal.classList.add('hidden')
    document.body.classList.remove('overflow-hidden')
    search.show = false
  }
}


function onSearchClick() {
  if(!search.show) {
    modal.show()
  } else {
    modal.hide()
  }
}

function onSearchModalClick(e) {
  if(!e.target.contains(DocSearchModal) || e.target === DocSearchModal) {
  } else {
    modal.hide()
  }
}


const DocSearchInput = document.querySelector('.DocSearch-Input')

DocSearchInput.addEventListener('input', doSearchResult, true)


const resultContainer = document.querySelector('#result-container')
const emptyResultContainer = document.querySelector('#result-empty')

function doSearchResult() {
  const searchQuery = this.value;

  const searchResult = index.search(searchQuery, { limit: 5, enrich: true })
  emptyResultContainer.classList.add("hidden")


  const flatResults = new Map(); // keyed by href to dedupe results
  for (const result of searchResult.flatMap(r => r.result)) {
    if (flatResults.has(result.doc.href)) continue;
    flatResults.set(result.doc.href, result.doc);
  }


  let html = ''
  flatResults.forEach((item, key) => {
    html += renderResultItem(item)
  })
  resultContainer.innerHTML = html
}


function renderResultItem(item) {
  return `<div class="result-item p-4 bg-slate-600 hover:bg-indigo-700 rounded-md">
  <a href="${item.href}" target="_blank">
      <div class="text-lg">${item.title}</div>
      <div class="text-base mt-2 overflow-hidden text-ellipsis">
          ${item.content}
      </div>
  </a>
</div>`
}