const eleventyNavigationPlugin = require("@11ty/eleventy-navigation")
const CleanCSS = require("clean-css");
const dateFilter = require('nunjucks-date-filter');


module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin)

  eleventyConfig.addNunjucksFilter("date", dateFilter);

  eleventyConfig.addCollection("events", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/ptfa/events/*.md");
  });

  eleventyConfig.addCollection("datedEvents", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/ptfa/events/*.md").filter(function(item) {
      return "date" in item.data;
    }).sort(function(a, b) {
      return a.date - b.date;
    });
  });

  eleventyConfig.addCollection("futureEvents", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/ptfa/events/*.md").filter(function(item) {
      
      return !("date" in item.data) && !(item.data.layout == 'ptfa-events');
    });
  });

  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  eleventyConfig.addPassthroughCopy("src/images");

  // Return your Object options:
  return {
    dir: {
      input: "src",
      // output: "_site"
      layouts: "_includes/layouts"
    },
  }
}
