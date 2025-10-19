const eleventyNavigationPlugin = require("@11ty/eleventy-navigation")
const CleanCSS = require("clean-css");
const dateFilter = require('nunjucks-date-filter');
const markdownIt = require("markdown-it");


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

  eleventyConfig.addNunjucksShortcode("fundraisingPanel", function(logo, title, description, buttonText, buttonLink, code, codeMessage, allowedItems, notAllowedItems, panelClass) {
    let buttonHtml = '';
    if (buttonText && buttonLink) {
      buttonHtml = `<a href="${buttonLink}" class="fundraising-button">${buttonText}</a>`;
    }

    let codeHtml = '';
    if (code && codeMessage) {
      codeHtml = `<div class="fundraising-code-block"><p>${codeMessage}</p><p><strong>${code}</strong></p></div>`;
    }

    let allowedHtml = '';
    if (allowedItems && allowedItems.length > 0) {
      allowedHtml = `<div class="fundraising-allowed-heading">Allowed Items</div><ul class="fundraising-allowed-list">` +
                    allowedItems.map(item => `<li>${item}</li>`).join('') +
                    `</ul>`;
    }

    let notAllowedHtml = '';
    if (notAllowedItems && notAllowedItems.length > 0) {
      notAllowedHtml = `<div class="fundraising-not-allowed-heading">Not Allowed Items</div><ul class="fundraising-not-allowed-list">` +
                       notAllowedItems.map(item => `<li>${item}</li>`).join('') +
                       `</ul>`;
    }

    const md = new markdownIt();
    const renderedDescription = md.render(description || '');

    let headerContent = `
        <div class="fundraising-logo-container">
          <img src="/images/${logo}" alt="${title} Logo" class="fundraising-logo">
        </div>
        <h3>${title}</h3>`;

    if (buttonLink) {
      headerContent = `<a href="${buttonLink}" class="fundraising-header-link">${headerContent}</a>`;
    }

    const panelClasses = ["fundraising-panel"];
    if (panelClass) {
      panelClasses.push(panelClass);
    }

    return `
      <div class="${panelClasses.join(' ')}">
        ${headerContent}
        ${renderedDescription}
        ${allowedHtml}
        ${notAllowedHtml}
        ${codeHtml}
        ${buttonHtml}
      </div>
    `;
  });

  eleventyConfig.addPassthroughCopy("src/images");

  // Return your Object options:
  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "src",
      // output: "_site"
      layouts: "_includes/layouts"
    },
  }
}
