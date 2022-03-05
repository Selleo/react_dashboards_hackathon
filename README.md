# React dashboards hackathon (march 11 2022)

[DOC](https://docs.google.com/document/d/1lpqY7UEP8it-DdVUK9dEUXmlE4_9dyZMLmAs749eXeQ/edit#) with discussion about the hackathon.

## Setup

- Create a branch `git checkout -b [yourLibrary]_dashboard`
- Copy `/project_template` folder to `/projects` and rename it to `[yourLibrary]_dashboard`
- Change directory into your one `cd projects/[yourLibrary]_dashboard`
- Add your charting library `yarn add [your library]`
- Setup the database `yarn run db:setup`
- Start the frontend dev server `yarn start`
- Start the json-server `yarn run server:start`

## Running the app

- Start the frontend dev server `yarn start`
- Start the json-server `yarn run server:start`

## Features to implement

1. Line chart - use data from `/salesByTime` endpoint
   1. Display the data for single month
   2. Add "pagination" - the user should be able to display the data for next and previous months
2. Bar chart - use data from `/salesByCompanyProduct`
   1. Display bars with total sale value of given product (without division by company)
   2. Display bars with total sale value of given product (stacked per company)
   3. Display bars with product sale value (each company should be in separate data series)
3. Radial chart - use data from `/salesByRegion`
   1. Display sale data in the circle divided per country
   2. After clicking the country, display sale data for this country divided per country region (add some nice animation if possible)
4. ??? If you still have time, add some additional feature to the already existing charts.

## Additional info

- Use axios instance from `src/axios.js` file as it has configured port for the api
