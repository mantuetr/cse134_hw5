For this exercise, I used Eleventy (11ty) with Nunjucks to generate two pages from my existing portfolio: Home and About Me.

Both pages retain their original content, styling, and images while sharing a reusable footer located in src/_includes/footer.njk.

## Installation

Run the following commands from the Homework 5 repository:

cd ssg-exercise
npm install

## Build

npx @11ty/eleventy

The generated HTML files and assets are stored in the _site folder.

## Local Preview

npx @11ty/eleventy --serve

Open the following pages in a browser:

* Home: http://localhost:8080/

* About Me: http://localhost:8080/about.html