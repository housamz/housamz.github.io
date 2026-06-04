---
layout: post
title: Do People Like Sequel Movies?
category: Tools
tags: [javascript, d3, python, beautifulsoup4, bootstrap, data-visualization]
---
![Starwars]({{site.images_url}}2019/08/starwars.gif)

I am a Star Wars fan, I have to admit. I am not one of those hardcore Star Wars fans who say "Star Wars is only the original trilogy", but still, I am a big fan. I liked the prequel trilogy more than many people did, but I was not
as amused by the sequel trilogy. That made me curious: was this just my own
reaction, or did audiences and critics usually feel the same way when a hit
movie keeps getting sequels?

That question became the start of a bigger project:
[Sequel Movies Meter](https://t.hmz.ie/sequel/){:target="_blank"}.

The idea is simple: collect movie ratings, group movies into franchises, and
compare how the scores move from the original movie to the sequels. Do
franchises usually improve, stay steady, or fall apart after the first hit?

The current version now answers the question directly on the homepage:

> Do people like sequel movies?

For the current scored dataset, the answer is **No**.

Sequels average **57/100** with audiences, while franchise starters average
**68/100**. Only **44%** of scored sequels clear the 60/100 "like" line, and
only **15%** of franchise final entries beat or match their first movie.

The project has changed a lot since the first version. It is no longer just a
large page of charts. It is now a small dashboard with a data-driven homepage,
an insights page, and a smarter franchise browser.

### The Dataset

The current local dataset contains **502 franchises** and **1,554 movies**.
Not every movie has enough rating data to calculate a fair composite score, so
the dashboard view focuses on **372 scored franchises** and **1,096 scored
movies**.

The rating model combines data from IMDb, Metacritic, and Rotten Tomatoes [1].
The scores are normalized onto a 0-100 scale:

- Critics: Metacritic critics + Rotten Tomatoes critics.
- Audience: IMDb users + Metacritic users + Rotten Tomatoes users.
- Overall: average of the critic and audience composites.
- Franchise delta: final movie composite minus first movie composite.

That makes it possible to compare franchises in a consistent way, even when
their raw ratings come from different websites and scales.

### Finding Movies With Sequels

**Tools:** Wikipedia research, manual work, Python.

The first challenge was not ratings. It was finding the franchises themselves.
I started with lists of movies with sequels, but none of them were complete
enough on their own. The first version used a lot of manual cleanup and merged
lists.

The newer data refresh work also experiments with Wikipedia-based franchise
discovery. The goal is to keep a better franchise seed list, then generate the
dashboard data from repeatable scripts instead of treating the dataset as a
one-time manual file.

### Identifying Movies

**Tools:** Manual research, IMDb links, Python helpers.

Movie titles by themselves are not stable enough. The same title can refer to
different movies, and sequels often have different names in different markets.
So the project uses source links and movie metadata to keep each movie anchored
to real pages.

In the older version, the most useful identifier was the IMDb link. If I were
starting from scratch today, I would also store stable provider IDs from IMDb,
TMDb, Wikidata, or a similar source. That would make future refreshes much
less fragile.

### Crawling Data

**Tools:** BeautifulSoup, Requests, urllib, JSON, Python.

The first data collection tool was
[Movie Info Finder](http://www.hmz.ie/movie-info-finder/){:target="_blank"}.
It crawled movie pages in this order:

1. Read IMDb data for the movie name, year, IMDb rating, and vote count.
2. Search Metacritic by movie name and match the result by release year.
3. Collect Metacritic critic and user ratings.
4. Repeat a similar process for Rotten Tomatoes.
5. Return one JSON object for the movie.

![Movie Info Finder]({{site.images_url}}2019/01/movie-info-tool-1.jpg)

This was a useful prototype, but it was also fragile. Website HTML changes
quickly. Rotten Tomatoes changed their pages while I was building the crawler,
which meant part of the work had to be rebuilt.

That is one of the biggest lessons from the project: save stable identifiers,
keep raw provider data separate from generated dashboard data, and expect web
scrapers to age.

### Sorting Movies Under Franchises

**Tools:** JSON, Python, DiffLib SequenceMatcher, manual review.

Grouping movies into franchises was its own problem. Movie titles do not always
share enough text to make the connection obvious. Python and `SequenceMatcher`
helped group similar titles, but this was never a fully automatic step.

The script did a large part of the work, then I manually reviewed the output to
fix wrong matches and split odd cases.

### Building The Dashboard

**Tools:** JSON, D3, JavaScript, Bootstrap, HTML, CSS.

The original version used D3 to draw many line charts on one page. That made
the data visible, but it also made the page noisy.

The current version is more focused:

- The homepage asks the main question and shows a large red **No** or green
  **Yes** based on the current audience data.
- The chart dashboard shows franchise score trends with critic and audience
  lines.
- Filters let you search, sort, change the minimum franchise length, and
  toggle between critics, users, or both.
- Quick-read cards show the best rebound, hardest fall, biggest
  audience-critic gap, and strongest long-running franchise.

The frontend has also been cleaned up to use Bootstrap wherever possible:
cards, grids, forms, buttons, badges, progress bars, spacing, and responsive
layout. The custom CSS is now mostly just project colors, the large verdict
word, the D3 chart styling, and a few small helper styles.

### The Insights Page

The project now has a separate Insights page for the broader data story.

It summarizes the current audience signal and includes rankings for:

- Best sequel runs.
- Most liked individual sequels.
- Hardest second-movie drops.
- Best final comebacks.
- Biggest audience vs critics gaps.
- Best long-running franchises.

This makes the project more useful than a single answer. The answer is "No" in
the aggregate, but some franchises clearly beat the trend.

### The Movies Page

The old Movies page showed every movie card at once. That meant loading a large
wall of movie cards and poster images immediately.

The new page is smarter. It now starts with franchises, not individual movies.
Each franchise card shows general information such as:

- Number of movies.
- Release year range.
- Average audience score.
- Average critic score.
- Best-rated movie.

When someone clicks a franchise, the movie cards for that franchise expand in
place under the selected card. Only then are the movie cards and poster images
loaded. The section can also be closed again.

This keeps the page faster, calmer, and easier to browse.

### Results

Despite examples like **The Lord of the Rings**, which stayed unusually strong
across its trilogy, the wider pattern is clear in the current data:

People do not usually like sequels as much as the original movies.

That does not mean every sequel is bad. It means the average franchise loses
audience momentum after the first movie. Sequels average **57/100**, compared
with **68/100** for franchise starters.

Examples from the meter for popular movies:

![Movie Info Finder]({{site.images_url}}2019/08/chart1.jpeg)
![Movie Info Finder]({{site.images_url}}2019/08/chart2.jpeg)
![Movie Info Finder]({{site.images_url}}2019/08/chart3.jpeg)

### Final Thoughts

Working on this project was interesting and mentally challenging. The first
version was mostly about collecting the data and proving the idea. The current
version is more about making the answer readable: a clear homepage verdict, a
better insights page, and a movie browser that does not overwhelm the user.

I hope people enjoy
[Sequel Movies Meter](https://t.hmz.ie/sequel/){:target="_blank"} and find it
useful, even if the answer is a little harsh on sequels.

[1] IMDb, Rotten Tomatoes, and Metacritic. These three websites provide five
ratings used by the project: IMDb users, Metacritic critics, Metacritic users,
Rotten Tomatoes critics, and Rotten Tomatoes users.
