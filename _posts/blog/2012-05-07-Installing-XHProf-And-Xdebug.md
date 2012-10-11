---
layout: post
title: Installing xhprof and Xdebug
category: blog
---

After completely messing up my __PHP__ install after running `tasksel` to install some packages which turned out also removes some of the packages that I've installed, I had to completely build PHP 5.2 from source. I used to use [dotdeb's](http://www.dotdeb.org/) `oldstable` repository to install the old PHP packages but might've been removed now due to [Debian 5.0's EOL](http://www.debian.org/releases/oldstable/). I have a few notable changes on my setup (gonna list 'em so I don't forget):

*   Had to explicitly specify the files to match that would run with fcgi since I have PHP 5.3 running as [fastcgi](http://www.fastcgi.com/drupal/). This is what I have added on my vhost config (which I have taken from `php5.conf`) that I've specified to run in fcgi.
    {% highlight bash %}
<FilesMatch "\.ph(p3?|tml)$">
    SetHandler php-fcgi
</FilesMatch>
    {% endhighlight %}
* For every changes on the configuration options, need to remember to do a `sudo make clean` before doing `sudo make`.

That's about it. And now, installing [XHProf](https://github.com/facebook/xhprof) and [XDebug](http://xdebug.org/). :D

For installing __XHProf__, you can either install it using PECL or compile it yourself. I had to compile mine myself due to some errors that I encountered when I tried `pecl install xhprof`. To compile, you'll need to download the package first and extract it. After extracting, you cd to the __extension__ directory and run `phpize`. You'll need to specify the full path of `phpize` if it's not included in your `$PATH`. You'll then need to invoke the command `./configure`. I had to do `./configure --with-php-config=/path/to/php52/bin/php-config` since I was getting errors after running `phpize`. And then finally just do the usual `sudo make` and `sudo make install`. After installation, you'll need to add the extension on your __php.ini__ file and restart your webserver. If it's successfully installed, you'll be able to find xhprof listed as one of the modules when you do `php -m`.

And for setting up xhprof's UI, I used a [user's package from Arch Linux as a guide](https://aur.archlinux.org/packages/ph/php-xhprof/PKGBUILD). I copied both `xhprof_lib` and `xhprof_html` over to /usr/share/php and `chown`ed the directories so it can be accessed by the webserver. I then created a new file `xhprof.conf` under /etc/apache2/conf.d/ with this content:

{% highlight bash %}
Alias /xhprof "/usr/share/php/xhprof_html"
<Directory "/usr/share/php/xhprof_html">
	AllowOverride All
	Options FollowSymlinks
	Order allow,deny
	Allow from all
</Directory>
{% endhighlight %}
