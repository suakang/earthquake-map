
      $(document).ready(function() {

        $('#submit').click(function(){

          var search_term = {
            q: 'earthquake'
          };
          search(search_term);
        });
      });

      function search(search_term) {
        $.ajax({
          /* the 'param' function ensures that search terms are properly encoded */
          url: 'http://search.twitter.com/search.json?' + $.param(search_term),

          dataType: 'jsonp',

          /* since the function runs asynchronously,  need to define what should happen
             when the twitter API sends back a successful response (i.e. HTTP code 200)
          */

          success: function(data) {
            console.log(data);
            for (item in data['results']) {
              $('#tweets').append(
                '<li>' + data['results'][item]['text'] + '</li>');
            }
          }
        });
      }