--- 
layout: post
title: Print Views Output in Drupal
category: blog
---

There are times that I would like to print the output of a view without it being rendered from a template i.e. it would go through `page.tpl.php`. I find this useful when say I'd like to do an Ajax call and I'd like it to return just the output of the view itself so I could print it inside a `div` container for example. This is quite simple as I could use [drupal_json](http://api.drupal.org/api/drupal/includes--common.inc/function/drupal_json/6) as my reference.

I first created a new menu like so:

{% highlight php %}
<?php
function MODULE_menu() {
  $items = array();

  $items['example/js'] = array(
    'page callback' => 'MODULE_menu_callback',
    'type' => MENU_CALLBACK,
    'access callback' => TRUE,
  );

  return $items;
}
{% endhighlight %}

Then the callback which is based on `drupal_json()`:

{% highlight php %}
<?php
function MODULE_menu_callback() {
  drupal_set_header('Content-Type: text/plain; charset=utf-8');

  echo views_embed_view('view_name');
}
{% endhighlight %}

Now, I could just do a simple ajax call to use the output inside any element like so:

{% highlight javascript %}
$.get(Drupal.settings.basePath + '/example/js', function(data) {
  $('.some-element').html(data);
});
{% endhighlight %}

Woot! :D
