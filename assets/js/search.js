(function() {
    function displaySearchResults(results, store) {
        var searchResults = document.getElementById('search-results');

        if (results.length) { // Are there any results?
            var appendString = '';

            for (var i = 0; i < results.length; i++) {  // Iterate over the results
                var item = store[results[i].ref];
                appendString += '<h3><a href="' + item.url + '">' + item.title + '</a></h3>';
                appendString += '<p>' + item.content.substring(0, 150) + '...</p>';
            }

            searchResults.innerHTML = appendString;
        } else {
            searchResults.innerHTML = 'No results found';
        }
    }

    function displaySearchException(searchException) {
        var searchResults = document.getElementById('search-results');
        var displayString = "<h2>ERROR</h2>";
        if (searchException.name == "QueryParseError") {
            displayString += "Your query contains an error.<br>" + searchException + "<br>For a description of the query syntax and query special characters ('*', ':', '^', '~', '+', '-'), please visit <a href='https://lunrjs.com/guides/searching.html'>https://lunrjs.com/guides/searching.html</a>";
        } else {
            displayString += searchException;
        }
        searchResults.innerHTML = displayString;
    }

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');

        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');

            if (pair[0] === variable) {
                return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
            }
        }
    }

    var searchTerm = getQueryVariable('query');

    // Initalize lunr with the fields it will be searching on. I've given title
    // a boost of 10 to indicate matches on this field are more important.
    var idx = lunr(function () {
        this.field('id');
        this.field('title', { boost: 10 });
        this.field('content');

        for (var key in window.store) { // Add the data to lunr
            this.add({
                'id': key,
                'title': window.store[key].title,
                'content': window.store[key].content
            });
        }
    });
    if (searchTerm) {
        document.getElementById('search-box').setAttribute("value", searchTerm);

        // Initalize lunr with the fields it will be searching on. I've given title
        // a boost of 10 to indicate matches on this field are more important.
        var idx = lunr(function () {
            this.field('id');
            this.field('title', { boost: 10 });
            this.field('content');

            for (var key in window.store) { // Add the data to lunr
                this.add({
                    'id': key,
                    'title': window.store[key].title,
                    'content': window.store[key].content
                });
            }
        });

        try {
            var results = idx.search(searchTerm); // Get lunr to perform a search
            displaySearchResults(results, window.store); // We'll write this in the next section
        } catch (searchException) {
            displaySearchException(searchException);
        }
    }

    $(document).ready(function() {
    const storeUnstemmed = function(builder) {

       // Define a pipeline function that keeps the unstemmed word
       const pipelineFunction = function(token) {
          token.metadata['unstemmed'] = token.toString();
          return token;
       };

       // Register the pipeline function so the index can be serialised
       lunr.Pipeline.registerFunction(pipelineFunction, 'storeUnstemmed');

       // Add the pipeline function to both the indexing pipeline and the searching pipeline
       builder.pipeline.before(lunr.stemmer, pipelineFunction);

       // Whitelist the unstemmed metadata key
       builder.metadataWhitelist.push('unstemmed');
    };

    lunr.tokenizer.separator =  /\W+/
    const index = lunr(function() {
       this.use(storeUnstemmed);
       this.field('id');
       this.field('title', { boost: 10 });
       this.field('content');

       for (var key in window.store) { // Add the data to lunr
           this.add({
               'id': key,
               'title': window.store[key].title,
               'content': window.store[key].content
           });
       }
    });
    const autoComplete = function (searchTerm) {
       const results = index.query(function(q) {
          // exact matches should have the highest boost
          q.term(searchTerm, { boost : 100 })
          // wildcard matches should be boosted slightly
          q.term(searchTerm, {
             boost : 10,
             usePipeline : true,
             wildcard : lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING
          })
          // finally, try a fuzzy search, without any boost
          q.term(searchTerm, { boost : 1, usePipeline : false, editDistance : 1 })
       });
       if (!results.length) {
          return "";
       }
       return results.map(function(v, i, a) { // extract unstemmed terms
          const unstemmedTerms = {};
          Object.keys(v.matchData.metadata).forEach(function(term) {
             Object.keys(v.matchData.metadata[term]).forEach(function(field) {
                v.matchData.metadata[term][field].unstemmed.forEach(function(word) {
                   unstemmedTerms[word] = true;
                });
             });
          });
          return Object.keys(unstemmedTerms);
       }).reduce(function(a, b) { // flatten
          return a.concat(b);
       }).filter(function(v, i, a) { // uniq
          return a.indexOf(v) === i;
       }).slice(0, 10);
    }

    $( "#search-box" ).autocomplete({
      source: function(request, response) {
        var results = autoComplete(request.term);
        response(results);
      },
      select: function(event, ui) { $("#search-box").val(ui.item.value); $("#search-form").submit(); }
    });
    });

})();
