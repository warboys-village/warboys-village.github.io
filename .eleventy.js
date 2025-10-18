const eleventyNavigationPlugin = require("@11ty/eleventy-navigation")
const CleanCSS = require("clean-css");
const dateFilter = require('nunjucks-date-filter');


module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin)

  eleventyConfig.addNunjucksFilter("date", dateFilter);

  eleventyConfig.addCollection("events", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/ptfa/events/*.md").sort(function(a, b) {
      return a.date - b.date;
    });
  });

  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Return your Object options:
  return {
    dir: {
      input: "src",
      // output: "_site"
      layouts: "_includes/layouts"
    },
  }
}
