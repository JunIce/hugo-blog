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


var index = new FlexSearch.Document({
  tokenize: "forward",
  cache: 100,
  document: {
    id: 'id',
    store: [
      "href", "title", "description"
    ],
    index: ["title", "description", "content"]
  },
  encode: str => str.split("")
});

{{ $list := .Site.Pages }}
{{ range $index, $element := $list -}}
  index.add(
    {
      id: {{ $index }},
      href: "{{ .RelPermalink }}",
      title: {{ .Title | jsonify }},
      content: {{ .Plain | jsonify }}
    }
  );
{{ end -}}



const search = document.querySelector("#search-container")

search.addEventListener("input", doSearchResult, true)



function doSearchResult() {
  const searchQuery = this.value;

  const searchResult = index.search(searchQuery, { limit: 5, enrich: true })


  const flatResults = new Map(); // keyed by href to dedupe results
  for (const result of searchResult.flatMap(r => r.result)) {
    if (flatResults.has(result.doc.href)) continue;
    flatResults.set(result.doc.href, result.doc);
  }


  console.log(flatResults)
}