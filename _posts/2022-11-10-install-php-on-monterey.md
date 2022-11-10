---
layout: post
title: Install PHP on macOS 12.0 Monterey
category: Development
tags: [development, php, macOS, apache]
---
If you got a new Mac with the latest OS, and you need to develop some PHP projects, you may be surprised that it doesn't work out-of-the-box any more.  
This mean that you need to install and enable it manually.  
This guide post will help you setup PHP and get it to run on Apache inside your Mac machine.  

PHP is NOT included in Monterey. Apple even included a note about it in `/etc/apache2/httpd.conf` saying:
```
#PHP was deprecated in macOS 11 and removed from macOS 12
```

To Install PHP and get Apache to run on macOS 12, follow these steps:
- Start by installing Homebrew if you don't have it already
`ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
- Install PHP by using `brew install php`  
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
- Using Homebrew, install the following libraries:
```
brew install openssl
brew install httpd
```
- Edit httpd.conf, you can find it on: `/opt/homebrew/etc/httpd/httpd.conf`
- If you are using nano, scroll to the end by pressing CTRL + W and then CTRL + V and add the above lines.
- Add the following to the conf file

```
LoadModule php_module /opt/homebrew/opt/php/lib/httpd/modules/libphp.so

<FilesMatch \.php$>
  SetHandler application/x-httpd-php
</FilesMatch>
```
- Search, by using CTRL + W for the following and change them:  
`Listen 8080` change it to be 80 so you don't need to specify port every time.  
```
DocumentRoot "/Users/your_user/Sites"
<Directory "/Users/your_user/Sites">
```

change `"/Users/your_user/Sites"` to the directory that want to use as your document root.  

- Restart PHP and Apache
```
brew services restart php
sudo apachectl restart
```
- Start httpd
```
brew services start httpd
```
- Put an HTML or PHP file in your document root.
- In your wbe browser, visit `http://localhost` and check if you get the code running.
