# First Week Quest

An original employee onboarding game inspired by the six-region learning journey in [Fabric Quest](https://github.com/JS-Digitall/Fabric_Quest). The upstream repository was inspected at commit e4460b6. This version uses a browser-based mission interface, short briefings from fictional colleagues, and scenario-based knowledge checks.

## Run locally

From this directory, run `python3 -m http.server 8080` and open http://localhost:8080.

## Adapt it to your team

Edit `content.js`. Each journey lists a company, a team and their missions. Each mission lists its category, title, description, guide, briefing, question, answer options, zero-based correct option and feedback. Replace the sample names and policy examples with approved company content before rolling it out to employees. The track selector labels are in `index.html`.

Progress is saved independently for each track on the current browser and origin. This prototype has no employee accounts, admin reporting or central progress storage.

## Publish with GitHub Pages

Upload the extracted files to the root of your public GitHub repository. Open Settings → Pages, choose Deploy from a branch, then select main and /(root). Save and use the published URL shown in Settings → Pages.
