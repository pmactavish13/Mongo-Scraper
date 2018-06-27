


app.get('/scrape', (req, res) => {
    return db.Article.find()
        .then((cachedArticles) => {
            // first create array of cached article titles
            let cachedTitle = cachedArticles.map(article => article.title);

            // next grab the body of the html with request
            return axios.get("http://www.newyorktimes.com/")

        })
        .then((response) => {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
            // create new array to hold new articles
            let newArticles = [];

            //Now iterate through scraped articles to make newArticle object
            $("article h2").each(function (i, element) {
                // Save an empty result object
                var result = {};

                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this)
                    .children("a")
                    .text();
                result.summary = $(this)
                    .children(".summary")
                    .text();
                result.link = $(this)
                    .children("a")
                    .attr("href");
                result.image = $(this)
                    .children("img")
                    .attr('src')

                // check for new article URL link
                if (result.link) {
                    // check if new article already in cached articles in database
                    if (!cachedTitle.includes(result.title)) {
                        // add to array of new articles to push into database
                        newArticles.push(result);
                    }
                }
            })

            return db.Article.create(newArticles)

        })
        .then((dbArticle) => {
            console.log(dbArticle, 'dbArticle');
            return res.json({
                newArticleCount: newArticles.length
            })

        })
        .catch((error) => {
            console.log(err)
            return res.json(error)
        })
})
