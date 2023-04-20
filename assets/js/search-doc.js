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