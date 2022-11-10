---
layout: post
title: Install PHP on macOS 12.0 Monterey
category: Development
tags: [development, php, macOS, apache]
---
If you got a new Mac with the latest OS, and you need to develop some PHP projects, you may be surprised that it doesn't work out-of-the-box any more.  
This guide post will help you setup PHP and get it to run on Apche inside your Mac machine.  
PHP is NOT included in Monterey. Apple even included a note about it in `/etc/apache2/httpd.conf` saying:
```
#PHP was deprecated in macOS 11 and removed from macOS 12
```
To Install PHP and get Apache to run on macOS 12, follow these steps:
1. Start by installing Homebrew if you don't have it already
`ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
2. Install PHP by using
`brew install php`  
After brew finishes installing, it shows the following message:  

```
To enable PHP in Apache add the following to httpd.conf and restart Apache:
  LoadModule php_module /opt/homebrew/opt/php/lib/httpd/modules/libphp.so

  <FilesMatch \.php$>
    SetHandler application/x-httpd-php
  </FilesMatch>

Finally, check DirectoryIndex includes index.php
  DirectoryIndex index.php index.html

The php.ini and php-fpm.ini file can be found in:
  /opt/homebrew/etc/php/8.1/
```
3. Follow the two steps by editing httpd.conf, you can find it on: `/opt/homebrew/etc/httpd/httpd.conf`
4. Using Homebrew, install the following libraries:
```
brew install openssl
brew install httpd
```
5. Restart PHP and Apache
```
brew services restart php
sudo apachectl restart
```
6. Start httpd
```
brew services start httpd
```
7. Put an HTML or PHP file in `/Library/WebServer/Documents/`
8. In your wbe browser, visit `http://localhost` and check if you get the code running.
