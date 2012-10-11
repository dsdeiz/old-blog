--- 
layout: post
title: Simple CRUD in Limonade
category: blog
---

Last weekend, I thought of ways of recording my expenses in a techie manner. I don't actually spend a lot, I just wanted to create something during the weekend. :D I googled for some PHP micro frameworks that I might use to create the application. I was able to find [Slim](http://www.slimframework.com/), [Silex](http://silex.sensiolabs.org/) and [Limonade](http://www.limonade-php.net/). **Slim** was nice although I don't think it has built-in support for databases. **Silex** was a micro framework that was based on [Symfony 2](http://symfony.com/) but it requires **PHP 5.3.x** which I am not quite familiar of the changes and features yet. I've chosen **Limonade** to create my app. **Limonade** has built-in support for databases and had some nice examples but for some reason, there hasn't been any development on the framework lately. It also somehow misses the "M" in "MVC".

The application I've made is fully based on the [Limonade Blog Example](github.com/sofadesign/limonade-blog-example).

## Directory Structure

Including **Limonade** in your application is easy by just doing `require_once('path/to/limonade.php')` but this is how the root directory for my application looked like with options set as the default ones e.g. default values for `views_dir`.

{% highlight bash %}
|-- db
|   `-- bas.db
|-- index.php
|-- lib
|   |-- limonade
|   |   |-- abstract.php
|   |   |-- assertions.php
|   |   |-- public
|   |   |-- tests.php
|   |   `-- views
|   |-- limonade.php
|   `-- model.transactions.php
`-- views
    |-- default.html.php
    |-- form.html.php
    `-- index.html.php
{% endhighlight %}

Libraries you wish to be loaded automatically can be placed under the folder **lib** or whatever value you have set for the option `lib_dir`.

> **Note from Limonade README:** PHP files contained in the `option('lib_dir')` folder (`lib/` by default) are loaded with `require_once` just before executing configure. So you can place in this folder all your PHP libraries and functions so that they will be loaded and available at application launch.

## Database

My database was pretty simple. Only had one table in it called **transactions**. This is what my **transactions** table has:

{% highlight sql %}
CREATE TABLE "transactions" (
  "transaction_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "date" integer NOT NULL,
  "amount" real NOT NULL,
  "description" text NOT NULL
);
{% endhighlight %}

### Model

I have a file named `model.transactions.php` under the directory `lib` which contains functions for querying the database. It contains functions for doing simple database calls e.g. `transaction_find_all()` or `transaction_create`. It also makes use of [PDO](http://php.net/pdo) the same as the **Limonade Blog Example**. I'm also using [SQLite](http://sqlite.org/) for my Database.

## Application

The application is actually located on 1 file regardless of the templates which are under the `views` directory. I have 4 routes in total `/transactions` which lists all transactions depending on filters if they are supplied, `transactions/add` which allows you to add a new transaction, `transactions/:id/edit` for editing an existing transaction and `transactions/:id/delete` for deleting one. There are also functions that are for `POST` route e.g. `transactions_insert()` which handles the values passed on the form from `/transactions/add`. A sample of a `dispatch_get()` (or simply `dispatch()`) and `dispatch_post()` would be:

{% highlight php %}
<?php
dispatch('/transactions/add', 'transactions_add');
  function transactions_add() {
    // Set defaults
    set('transaction', array('date' => time(), 'amount' => '0.00', 'description' => ''));
    return render('form.html.php');
  }

dispatch_post('/transactions/add', 'transactions_insert');
  function transactions_insert() {
    if (!is_numeric($_POST['transaction']['amount'])) {
      flash('form_errors', 'Invalid amount.');
      redirect_to('transactions', 'add');
    }
    else {
      $_POST['transaction']['date'] = strtotime(implode('/', $_POST['transaction']['date']));

      if (transaction_create($_POST['transaction'])) {
        redirect_to('transactions');
      }
    }
  }
{% endhighlight %}
