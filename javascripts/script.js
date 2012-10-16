$(function() {
  $('.icon-minus', 'article.post').hide();
  $('section.post-content', 'article.post').hide();

  $('article.post header h2 a').click(function(e) {
    $('header .icon-minus, header .icon-plus', $(this).parents('article.post')).toggle();
    $('section.post-content', $(this).parents('article.post')).fadeToggle();

    e.preventDefault();
  })
})
