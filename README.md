Instapoppin' is a ridiculously simple script that lets you synchronize Web pages to media without needing to know any JavaScript.

See the [tutorial][] to learn about basic usage.

## Motivation

Whenever I use [Popcorn][], I find myself using the [footnote][] and [code][] plugins a disproportionate amount. Much of the metadata I pass in to these plugins also feels more like semantic markup than JavaScript code.

Eventually I realized that I could get most of what I needed simply by enabling classes at the proper intervals in a video, and allowing CSS to do most of the heavy lifting.

At the same time, I also know a lot of folks who know HTML and CSS but are very uncomfortable with JavaScript. So I figured I could also help them out by making a simple drop-in script that lets them get a lot of Popcorn's functionality without needing to write any JS.

## Dependencies

* Instapoppin's only dependency is [popcorn.js][] without any plugins.

## Durations

The `data-active-during` attribute is pretty flexible, and you can specify time intervals in a variety of formats. Here's some example values:

* `2-6` means *seconds two thru six*.
* `1:02-1:06` means *one minute and two seconds thru one minute and six seconds*.
* `32-` means *thirty-two seconds thru the end of the media*.
* `1-2, 3-5` means *seconds one thru two and seconds three thru five*.
* `-0.5` means *the beginning of the media thru half a second in*.

## Sync Sources

By default, Instapoppin' assumes the first media element in the page (audio or video) is the one to be synchronized against. However, if you have multiple media elements on the page, you can give one of them the `primary-sync-source` class to force Instapoppin' to use it.

## Troubleshooting

I've attempted to make Instapoppin' provide good error feedback if it gets confused. Check your browser's error console if it seems to behave oddly. And if you're not sure what's wrong, feel free to [file a bug][].

## More Demos

The [Mas Bebes][] video makes use of Instapoppin' to drastically reduce the size of its JavaScript codebase.

  [Popcorn]: http://popcornjs.org/
  [popcorn.js]: http://popcornjs.org/code/dist/popcorn.js
  [tutorial]: http://toolness.github.com/instapoppin/
  [footnote]: https://github.com/webmademovies/popcorn-js/tree/master/plugins/footnote
  [code]: https://github.com/webmademovies/popcorn-js/blob/master/plugins/code/popcorn.code.js
  [file a bug]: https://github.com/toolness/instapoppin/issues
  [Mas Bebes]: http://toolness.github.com/mas-bebe-itvs-sprint/
