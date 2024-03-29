--- 
layout: post
title: Add Filters for Apache SOLR
category: blog
---

To add simple filters on your search query with [apachesolr](http://drupal.org/project/apachesolr) can be easily done through `hook_apachesolr_query_alter`. You'll find the documentation on `path/to/apachesolr/apachesolr.api.php`. An example would be:

{% highlight php %}
<?php
function module_apachesolr_query_alter($query) {
  $query->addFilter('bundle', 'page');

  // To filter by either page or article content type
  $query->addFilter('bundle', 'page OR article');
}
{% endhighlight %}

For adding subqueries (which is a bit different), you may do this:

{% highlight php %}
<?php
function module_apachesolr_query_alter($query) {
  $sometid = 1;
  $filter = new SolrFilterSubQuery('AND');
  $filter->addFilter('bundle', 'video');
  $filter->addFilter('tid', $sometid);

  $compiled_filter = new SolrFilterSubQuery('OR');
  $compiled_filter->addFilter('bundle', 'faq');
  $compiled_filter->addFilterSubQuery($filter);

  $query->addFilterSubQuery($compiled_filter);
}
{% endhighlight %}

In here, I've used `addFilterSubQuery` for the final query as when you do `$query->addFilter('bundle', 'faq'); $query->addFilterSubQuery($filter)`, the operator would be **AND**. For filtering, you can go to `admin/reports/apachesolr` to find the available fields.

Cheers! :D
