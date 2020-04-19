---
layout: post
title: Raspberry Pi Station
category: Software Engineering
tags: [raspberrypi, weather, angular, api, news]
---

![Raspberry Pi Station]({{site.images_url}}2020/04/rpi-station.jpg)

A while ago, I programmed some automation Python script on my Raspberry Pi, and installed a cheap 3" screen on it not to need the big monitor. The new screen doesn't turn off unless I make a hardware shield for it, so I made a use of it to display time, weather, and latest news all the time.  

Today I added a COVID-19 tracker to it.  

### Features:
* Display time and date.
* Show latest news by country.
* Show weather in a city.
* Show latest COVID-19 cases in a country.
* Updates data every half hour.

### How to install and use:
* Clone the script to your server.
* Insert country / city details.
* Visit Open Weather Map and get an ID for the API.
* Visit News API and get an API Key.


Here is the [Github page](https://github.com/housamz/rpi-station){:target="_blank"}

