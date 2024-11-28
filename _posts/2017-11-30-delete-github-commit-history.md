---
layout: post
title: Delete All Commit History in Github
category: Technology
tags: [git, tips, cheatsheet]
---

I was wondering if I can delete all commit history in Github, especially for those newly published projects that you commit six times to fix a comma in the README.md file.

Apparently, deleting the `.git` directory is a terrible idea, because that creates many problems in your repository.

The best solution is to check out a new branch, add all files to it, commit, delete the master branch, and then rename the new branch to master.

Steps to do that:
1. Checkout  
`git checkout --orphan latest_branch`

2. Add all the files  
`git add -A`

3. Commit  
`git commit -am "message"`

4. Delete the master branch  
`git branch -D master`

5. Rename the current branch to master  
`git branch -m master`

6. Finally, force update your repository  
`git push -f origin master`