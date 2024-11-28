---
layout: post
title: Doomsday Rule Algorithm
category: Software Engineering
tags: [javascript, user-interface, codepen]
---

![Doomsday Rule Algorithm]({{site.images_url}}2020/04/dooms-day-algorithm.png)

An algorithm to know the day of the week for a given date (method valid for dates from 1800s to 2000s).  
How can you quickly and accurately calculate the day of the week associated with a specific date?  

Here is a link to a working demo utilised using JavaScript:
Check it at this [Code Pen page](https://codepen.io/housamz/full/rNVJKBm){:target="_blank"}


I explained the instructions on the demo with working example, but here are the method to do that:
1. Start by taking the last two digits of the year, this is your startingNumber.
2. Divide the startingNumber by four and ignore the remainder.
3. Add the result to startingNumber.
4. Find the month code: January: 1, February: 4, March: 4, April: 0, May: 2, June: 5, July: 0, August: 3, September: 6, October: 1, November: 4, December: 6,
5. In leap years, subtract one from the month code for January and February.
6. Find if the year is leap. (Century years must divisible by 400, non-century year, last two digits must divisible by 4)
7. Add the month code number.
8. Add the day of the month.
9. If year is in 2000s subtract 1, if year is in 1800s add 2.
10. Find the remainder of dividing the total by 7.
11. Find the day of the week according to the day codes. Starting Saturday: 0, Sunday: 1, ... , Friday: 6


Give it a try at [Code Pen](https://codepen.io/housamz/full/rNVJKBm){:target="_blank"} if you need an example to learn something.