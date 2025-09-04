# Movie API Code Test

## Getting Started
This repo contains a sqlite database with movie information as well as a local instance of an API providing movie ratings.  You need to create an API that will pull data from the database and interact with the ratings API.


#### Pre-requisites

* An IDE or text editor of your choice
* Node es2016 & Typescript
* [Sqlite3](http://www.sqlitetutorial.net/)


#### Set Up
1. Run `npm install` to install the javascript dependencies
2. Start the ratings API with `npm run dev`.  It will be available at [localhost:3000](http://localhost:3000).
3. Test the response by visiting [http://localhost:3000/heartbeat](http://localhost:3000/heartbeat)


## Task
Your task is to create an API on top of several data sources including a database, an API that you can edit and an external API.  It should conform to the user stories provided below.  You are free to use whatever language you prefer.  Google and the interwebs are at your disposal.

**The Database**
The database is provided as a SQLite3 database in `db/movies.db`.  It does not require any credentials to login.  You can run SQL queries directly against the database using:

```
sqlite3 <path to db file>
```

`.tables` will return a list of available tables and `.schema <table>` will provide the schema.

**The Local API**
There is a local API that provides ratings for a specific movie when provided with the IMDB movie id.

**The External API**
The [Open Movie Database (OMDB)](https://www.omdbapi.com) provides Rotten Tomato ratings.  API documentation is available at: [omdbapi.com](https://www.omdbapi.com).


## Considerations
When developing a solution, please consider the following:

* Structure of the endpoints - So, you can easily extend the API to support new endpoints as feature requests come in?
* Quality of the code - Does the code demonstrate the use of design patterns?
* Testability - Is the code testable?
* Can the solution be easily configured and deployed?  Consider guidelines from [12 Factor App](http://12factor.net/)


## User Stories

#### List All Movies
AC:

* An endpoint exists that lists all movies in the database
* List is paginated: 50 movies per page, the page can be altered with the `page` query params
* Columns should include: imdb id, title, genres, release date, budget
* Budget is displayed in dollars

#### Movie Details
AC:

* An endpoint exists that lists the movie details for a particular movie
* Details should include: imdb id, title, description, release date, budget, runtime, average rating, genres, original language, production companies
* Budget should be displayed in dollars
* Ratings are pulled from the rating API and the Rotten Tomatoes score from OMDB
* The source of each rating is clear in the response

#### Movies By Year
AC:

* An endpoint exists that will list all movies from a particular year
* List is paginated: 50 movies per page, the page can be altered with the `page` query params
* List is sorted by date in chronological order
* Sort order can be descending
* Columns include: imdb id, title, genres, release date, budget

#### Movies By Genre
AC:

* An endpoint exists that will list all movies by a genre
* List is paginated: 50 movies per page, the page can be altered with the `page` query params
* Columns include: imdb id, title, genres, release date, budget

## Tips

* It is more important to produce well structured code that meets the criteria in the user stories rather than getting all stories done.
* If you get stuck, or need clarity, then please ask someone.  Asking for help on something that is unclear is something we all do.
