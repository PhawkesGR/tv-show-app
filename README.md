# TV shows dashboard assignment

Node version: 22.0.0

Npm version: 10.5.1

## How to get started

- git clone the repo
- cd into the folder
- mpm install --> to install the dependencies
- npm run dev --> to start the project, and open http://localhost:5173/ on a browser to test

- npm run test --> to run the tests


I used vite to get a basic template for the project. Chose Vue3 with the composition API as a framework, since that's what is used by ABN AMRO. For testing, I used vitest, since it's one of the most popular testing framework for Vue applications.

The application opens on the homepage, where the user can see horizontal lists of bunch of different genres, which are sorted from highest rating to the lowest. I limited the results on each group to 20, as an effort to minimize API requests.

If a user clicks on a show, they get redirect to the show details page, where they can view some more information about the show.

On the top right of both of the pages, there is a search icon, where the user can search for shows. If a show is clicked, the app redirects to the show details page.

I tried to limit the usage of external libraries and plugins, only used what was necessary for routing, and a simple icons package.

I used SCSS as a CSS pre processor, since it's what I'm more used to, and what seems to be the industry default. Also followed BEM, for clean and structured SCSS.
