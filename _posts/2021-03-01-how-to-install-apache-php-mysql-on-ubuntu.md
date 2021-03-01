---
layout: post
title: How to install Apache, PHP and MySQL on Ubuntu 20.02
category: Development
tags: [development, php, MySQL, Apache]
---

PHP is one of the most common server-side programming languages; it is used in many common CMS and frameworks, including WordPress, Magento, and Laravel. Many of the popular CMSs use MySQL as the database as well.  
This tutorial will take you through installing PHP & MySQL on Ubuntu 20.04 and integrating it with Apache from your terminal.  
  
At the time of this article, the PHP version is `7.4.3`, and the MySQL version is `8.0.23`.  
  
### Installing Apache  
Apache is included within the Ubuntu repositories.  
Installing Apache is straightforward on Ubuntu. The Apache package and the service is called `apache2`.  
  
Use the following two commands to update the package index and install Apache:  
```bash  
sudo apt update  
sudo apt install apache2  
```  
After the installation completes, the Apache service will start automatically.  
To verify that the service is running, type the following:  
```bash  
sudo systemctl status apache2  
```  
This command should show a message like this  
```bash  
apache2.service - The Apache HTTP Server  
Loaded: loaded (/lib/systemd/system/apache2.service; enabled; vendor preset: enabled)  
Active: active (running) since Mon 2021-03-01 09:22:49 GMT; 20min ago  
```  
Notice that it says `(running)`  
  
Since Apache ships with a default one virtual host enabled, you can head to the following directory `/var/www/html` and add your website inside it.  
Head to your browser and type `http://YOUR_IP/` `http://localhost/` or you can add the port 80, which Apache listens to. e.g. `http://localhost:80`  
  
If you like to setup your the VirtualHost Configuration File [check this page](https://ubuntu.com/tutorials/install-and-configure-apache#4-setting-up-the-virtualhost-configuration-file){:target="_blank"}  
  
### Installing PHP 7.4 with Apache  
Head to your terminal and run the following commands to install PHP and Apache PHP module.  
Please notice that you don't need to update again if you are doing this process directly after you installed Apache.  
```bash  
sudo apt update  
sudo apt install php libapache2-mod-php  
```  
Once the packages are installed, restart Apache to load the PHP module:  
```bash  
sudo systemctl restart apache2  
```  
To test your PHP installation, create a new file named `info.php` inside the `/var/www/html` and put the following code inside it:  
```php  
<?php  
phpinfo();  
?>  
```  
This code displays the PHP information on your device.  
Save the file, and open the following URL in your browser: `http://localhost/info.php`  
You should see the information page.  
  
### Installing MySQL  
Type the following in your terminal to install the `mysql-server` package:  
```bash  
sudo apt update  
sudo apt install mysql-server  
```  
MySQL is not installed, but it's insecure as you were not prompted for a password.  
To configure your MySQL installation, run the security script with `sudo`:  
```bash  
sudo mysql_secure_installation  
```  
Follow the prompts to select your settings. In my case, I selected to keep `root` and set a new password for it with `LOW` password policy, option `0` because it's my local setup, and it won't be accessible from the internet.  
  
To connect to MySQL from the terminal, I had to use `sudo` as follows:  
```bash  
sudo mysql -u root -p  
```  
then enter MySQL password when prompted.  
  
#### Extra Step  

***Note: This is weak security settings only for local setups.***  

To get rid of the `sudo` you have to do the following:  
  
Connect to MySQL  
```bash  
sudo mysql -u root -p  
```  
Check the validate password policy  
```sql  
mysql> SHOW VARIABLES LIKE 'validate_password%';  
```  
This showed  
```sql  
+--------------------------------------+--------+  
| Variable_name | Value |  
+--------------------------------------+--------+  
| validate_password.check_user_name | ON |  
| validate_password.dictionary_file | |  
| validate_password.length | 8 |  
| validate_password.mixed_case_count | 1 |  
| validate_password.number_count | 1 |  
| validate_password.policy | MEDIUM |  
| validate_password.special_char_count | 1 |  
+--------------------------------------+--------+  
7 rows in set (0.01 sec)  
```  
  
I lowered the policy to `LOW` by typing  
```sql  
mysql> SET GLOBAL validate_password.policy = 0;  
```  
Then changed the user to have a new weak password as  
```sql  
mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'NEW_PASSWORD_HERE';  
mysql> exit  
```  
Restart MySQL like  
```bash  
sudo service mysql restart  
```  
Now you can connect to MySQL without the `sudo`  
```bash  
mysql -u root -p  
```
