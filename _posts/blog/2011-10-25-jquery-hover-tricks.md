--- 
layout: post
title: jQuery Hover Tricks
created: 1319515261
category: blog
---

I had an issue in which I need to keep an element shown when the mouse hovers on another element. The markup looks like this:

{% highlight html %}
<a href="#" id="hover-here">Hover here</a>
<div class="dialog">
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
</div>
{% endhighlight %}

The goal is to have `.dialog` shown when mouse hovers over to `#hover-here` and the former is kept shown until it either leaves `#hover-here` or `.dialog`. Here's the script that I was able to come up with. Not that clean I think but works just fine the way it is:

{% highlight javascript %}
$(function() {
    $('.dialog').hide().data('over', false);
    $('#hover-here').hover(function() {
      $('.dialog').fadeIn();
    }, function() {
      // Check if mouse did not go over .dialog before hiding it again
      var timeOut = setTimeout(function() {
        if (!$('.dialog').data('over')) {
          $('.dialog').fadeOut();
          clearTimeout(timeOut);
        }
      }, 1000);
    });

    // Set data for filtering on mouse events for #hover-here
    $('.dialog').hover(function() {
      $(this).data('over', true);
    }, function() {
      $(this).fadeOut().data('over', false);
    });
});
{% endhighlight %}

Cheers! :D
