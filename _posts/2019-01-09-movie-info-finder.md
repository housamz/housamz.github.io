---
layout: post
title: Movie Info Finder
category: Tools
tags: [python, beautifulsoup4, imdb, metacritic, rottentomatoes, movies, movies-api, movie-reviews]
---

![Movie Info Finder]({{site.images_url}}2019/01/movie-info-tool-1.jpg)

I am working currently on a side project to study viewers reactions to sequel movies, and I am crwaling the data from three websites, IMDB, Meta Critic, and Rotten Tomatoes, in order to compare the results later.

Every movie entry has the following keys: Movie name, the year, a link to the poster, movie description, IMDB page URL, IMDB rating, number of votes on IMDB, Metacritic critics count, Metacritic critics rating, Metacritic page URL, Metacritic users count, Metacritic users rating, Rottentomatoes critics count, Rottentomatoes critics rating, Rottentomatoes page URL, Rottentomatoes users count, and Rottentomatoes users_rating.

Collecting all of these entries for each movie manually, would be tedious and time consuming, so I developed this tool which crawls all of the above mentioned websites and return a JSON object with the data.

The main code is located in the file `find_movie_info.py` which can be used in a loop of movies list to get data for multiple movies. 

You can find the Github repository on [this link](https://github.com/housamz/Find-Movie-Info){:target="_blank"}
