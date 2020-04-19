---
layout: post
title: How To Count All Files in Directory From The Terminal
category: Technology
tags: [terminal, linux, macOS]
---

Sometimes I need to copy directories using the terminal, and I wish to know how many files are there in them. For that, I use some terminal commands to show that piece of info.   
If anybody is looking for these, here are the commands and their breakdown.  

## tl;dr
This command counts all files in a directory and subdirectories:  
`echo "Directory $(pwd) has $(find . | wc -l) files"`  


To avoid doing that recursively, you achieve that by listing all the files and count the lines. That means using either `find` of `ls` commands.
Here's a list of useful parameters using the above two commands:
1. `ls -F` lists all the files and the subdirectories in a directory and appends an indicator `/` to directories names.
2. `ls -la` the parameter `l` displays a detailed list with info about each file and directory, while `a` lists hidden files.
3. `find . -maxdepth 1` finds the files in the directory with the depth set to one; it won't go into subdirectories.
4. `find . -type f` finds only files but not directories in the current directory and subdirectories.
5. `find . -type d` Same as before but returns the number of subdirectories, not the files in them.

After applying these, we need to clean the returned data (described below) and convert this output into the input of the counting command. For that, we need to use | (pipe) to pipe the data to the next command. 
For example `who` lists all the people or sessions connected to your computer, and then we can count the lines as follows:
`who | wc -l` where `wc` with the parameter `l` counts the lines.

To clean the data coming from the `list`, we need the following commands:
1. `ls -F | grep -v / | wc -l` which means, list files, then ignore those with `/` in their name, then count lines.
2. `ls -la | grep ^[-] | wc -l` long-lists all files, catch those lines starting with `-`, then count them.
3. With `find`, no cleaning is needed, go directly to count the lines, `find . -maxdepth 1 | wc -l` counts all files and directories on this level.
4. `find . -type f | wc -l` counts only files on all levels.
5. `find . -type d | wc -l` counts only directories on all levels.
And lastly, `find . | wc -l` counts everything on this level and in subdirectories.


