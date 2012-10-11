---
layout: post
title: Debugging Drupal With Vim and Xdebug
category: blog
---

Debugging Drupal isn't a lot of fun especially when you're only making use of functions like `var_dump()` or `print_r()` in your source codes. Surely, you would make use of the popular [Devel module](http://drupal.org/project/devel) that gives you access to functions like `dd()` or `dpm()`. Another tool that would come in handy would be a debugger. [Xdebug](http://xdebug.org) seems to be the most popular among the debuggers as it gives you functions like a [Profiler](http://xdebug.org/docs/profiler) or provide you a [Stack Trace](http://xdebug.org/docs/stack_trace) when you get an error or simply just wanting to know *"How did I get here?"* Another useful function that Xdebug provides is [Remote Debugging](http://xdebug.org/docs/remote) which I will cover here but only with the use of Vim. Installation of Xdebug can be very easy. There's actually a [tutorial](http://drupal.org/node/260854) on Drupal about installing Xdebug.

For Remote Debugging, you'll first need to enable it. This is what I have on my `php.ini` or `xdebug.ini`:

{% highlight bash %}
xdebug.remote_enable=On
xdebug.remote_port=9000
xdebug.remote_host=localhost
{% endhighlight %}

You'll then need to restart your webserver for the changes to take effect.
