---
layout: post
title: Fix/Install PHP on macOS 10.14 Mojave 
category: Development
tags: [development, php, macOS, apache]
---

After I updated my laptop macOS from High Sierra to Mojave, Apache with PHP stopped working properly, which I discovered to be a common problem with Mac users, and it wasn't only me.

I tried to check for solutions online, but all of them were complicated to apply, that's why I list here very simple steps using Terminal to solve the problem:
* Start by installing Homebrew if you don't have it already
`ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
* Install PHP by using
`brew install php@7.1`
This will install PHP version 7.1, and the `php.ini` file would be located in: `/usr/local/etc/php/7.1/php.ini`
* Open Apache config by running: `sudo nano /etc/apache2/httpd.conf`
* Press `CTRL + W` on your keyboard to search within the file, locate the following line and uncomment it by removing the # sign from the beginning of the line. `LoadModule php7_module /usr/local/opt/php@7.1/lib/httpd/modules/libphp7.so`
* You need to configure the directory indexes to accept PHP files, search for the line

```
<IfModule dir_module>
    DirectoryIndex index.html
</IfModule>
```

and replace it with the following lines:

```
<IfModule dir_module>
    DirectoryIndex index.php index.html
</IfModule>
<FilesMatch \.php$>
    SetHandler application/x-httpd-php
</FilesMatch>
```
* Start PHP by using `brew services start php@7.1`
* Restart Apache by using `sudo /usr/sbin/apachectl restart`

And you'll be done with PHP and Apache working again.

Update18-10-2018: A friend told me that this might work with macOS 10.13 High Sierra, please let me know in the comments section.