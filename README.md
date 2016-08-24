## Udacity Project 4: Website Performance Optimization

Live project is available at : surya/surya.github.io/views/pizza.html

#### How to run

1. Clone this repository to run in local machine:

       $ git clone https://surya/surya.github.io

2. Launch a local server:
3.
        $ python -m SimpleHTTPServer

3. Open the website:

        open "http://localhost:8000"


#### Part 1: Optimize PageSpeed Insights score for index.html
* Minify CSS and JS files : all CSS and JS files were minified to make downloading faster.They are saved with .min in their names The original-formatted files are still present in their respective directories.
* Made images repsonsive with two diferent sizes
* Added backface-visibility property in .mover class of style.min.css

       $ backface-visibility : hidden;

* Reduced no. of pizzas in main.min.js from 200 to 20
* added async in JS/CSS files of index.html
* moved GoogleAnalyticsObject to footer of index.html
* Move render blocking css/js to the footer
```html
        <link href="//fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet">
        <link href="css/style.min.css" rel="stylesheet">
        <link async href="css/print.min.css" rel="stylesheet">
        <script async src="js/perfmatters.js"></script>
```
* force Analytics and JS script to load asynchronously
```html
     <script async src="http://www.google-analytics.com/analytics.js"></script>
     <script async src="js/perfmatters.js"></script>

```
* removed unnecessary JS operations from main.min.js
