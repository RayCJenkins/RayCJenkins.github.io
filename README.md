## Website Performance Optimization portfolio project

This is my optimized project. The optimazations will be detailed below. I have hosted this on my github.io page for your viewing pleasure. The link to that is https://RayCJenkins.github.io

### Optimizations

#### Part 1: Optimize PageSpeed Insights score for index.html

I made the follwoing optimazations to index.html to record a google pagespeed insights where the page received a 95/100 on the mobile tab and 97/100 on the desktop tab. The following optimazations were implememted

- shrank pizzeria.jpg to 100 x 75 pixels
- compressed both pizzeria.jpg and profile.jpg by using the webp format
- added the async tag to the google analytics, print.css links
- Removed the call to the google Web fonts
- inlined all of the style.css
- moved the print.css, google analytics, and js/perfmatters.css

#### Part 2: Optimize Frames per Second in pizza.html

The optimizations performed for the main.js were similar to each other. In each case it involved anaylzing a loop and reducing the time overall by moving some of the calculations outside of the loop.

- In updatePositions, I pre-calculate each of the 5 phases and store them in an array, and then in the loop I just decide which index in the array to use to adjust each items left style.
- In changePizzaSizes, I calculated the new pizza width using the 0th element of the items array and then set the width property of each item.
