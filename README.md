![GitHub package.json version](https://img.shields.io/github/package-json/v/vassudanagunta/htmlnorm?color=purple&style=flat-square)
![GitHub](https://img.shields.io/github/license/vassudanagunta/htmlnorm?color=red&style=flat-square)
![module type](https://img.shields.io/badge/module-ESM-pink?style=flat-square)

<div align="center">

# `htmlnorm`
[Safely normalize](#normalization-is-more-than-pretty-printing) HTML for [testing](#example-problem),
[semantic diffs](#clean-succinct-semantic-diffs) and [readability](#readability).

</div>

<a id="what-and-how">

> Semantics-preserving and semantics-determined reformatting:
>
> - whitespace collapsed, [making no assumptions about CSS styling](https://stackoverflow.com/questions/12863588/when-does-whitespace-matter-in-html)
> - attributes and classes alphabetized
> - self-closing tags, void elements, quotation marks, escaped text and more normalized
> - lines intelligently reflowed and indented for readability
> - optional *conservative mode* that assumes CSS might change the layout semantics of most anything.
> - [tag soup](https://en.wikipedia.org/wiki/Tag_soup) left as-is, not auto-fixed
>
> which enables:
>
> - program output and test case [format independence](#format-independence)
> - readable tests
> - [clean and succinct diffs](#clean-succinct-semantic-diffs) on test failures

<br>

## example problem

You are developing software that outputs HTML. You want to write tests based on
expected outputs. For at least these tests the exact formatting doesn't matter.

<div align="center">

<a id="readability">

`(A)` Expected Output<br>*written for test case compactness and readability*

</div>

```html
<blockquote id='wt13', class='pullquote, lyrics'>
  <ul>
    <li>Wild thing, <p>I think I love you</p></li>
    <li>But I wanna know for sure</li>
  </ul>
</blockquote>
```

<div align="center">

`(B)` Actual Output

</div>

```html
<blockquote class="lyrics, pullquote", id="wt13" ><ul><li>Wild thing,<p>I think I love you</p></li><li>But I wanna know for sure</li></ul></blockquote>'
```

Even though (B) has attributes and class values in different orders,
double-quotes instead of single and all insignificant whitespace removed,
it is semantically identical to (A). *The test should pass*. 
You don't want to change the program output, or you can't because it's out of your control. What do you do?

You could try to do a semantic comparison by parsing both into DOM trees and
then analyzing. That's very hard to implement. Computationally expensive.
Unnecessary. You can't easily produce a diff that succinctly highlights any errors.

<br>

## an easy solution

Simply pass both *expected* and *actual* values through `htmlnorm` and use your
chosen assertion library's simple string comparison:

```javascript
import htmlnorm from 'htmlnorm'

let expected = ...
let actual = program.render(...)
assert.strictEqual(htmlnorm(actual), htmlnorm(expected))
```

<div align="center">

`(C)` Result of Both `htmlnorm(A)` and `htmlnorm(B)`

</div>

```html
<blockquote class='lyrics, pullquote' id='wt13'>
  <ul>
    <li>
      Wild thing,
      <p>I think I love you</p>
    </li>
    <li>
      But I wanna know for sure
    </li>
  </ul>
</blockquote>
```

The test will now `pass` as it should. 

<br>

## clean, succinct semantic diffs

Good assertion libraries produce a diff when a string equality assertion fails. By processing with `htmlnorm` first, the diff is better.

**Before:**

```diff
TODO
```

**After:**

```diff
TODO
```

<br>

## format independence

By using `htmlnorm` on *both* expected and actual values, your tests achieve 
*format independence*. Your program can generate HTML in whatever form it needs
— maybe for programming convenience, or execution efficiency, or because it uses
a library it can't control. It doesn't matter. Your tests can be written however
is best for the tests. And you won't have to update your tests just because a
new version of the code adds or removes inconsequential whitespace or any other
difference handled by `htmlnorm`.

See also *[Why semantic comparison is needed for stable tests](https://bunit.dev/docs/verification/semantic-html-comparison.html#why-semantic-comparison-is-needed-for-stable-tests)*.

<br>

## normalization is more than pretty printing

Many pretty printers basically make adjustments to the source HTML, removing whitespace here, adding newlines and spaces there. There is no guarantee that two semantically equivalent strings of HTML will be identical after pretty-printing.

`htmlnorm` fully parses the HTML parser and rewrites it from scratch. 
In the process it mimics browser logic for collapsing whitespace and performs
all the other normalizations [listed above](#what-and-how).

I tried various HTML pretty printers, [but they all came up short](#other-libraries-i-tried-first).
You can't just hack a regex to collapse whitespace in accordance with HTML rules.
You can't just take a run of whitespace and reducing it to one or zero spaces.

<div align="center">

Whitespace rules can be tricky

|        | remove all spaces      | keep a space before tag  | keep a space after tag   |
| ------ | ---------------------- | ------------------------ | ------------------------ |
| before | `⇢␠␠␠␠<em>⇢Thing</em>` | `  Wild⇢<em>⇢Thing</em>` | `  Wild<em>⇢Thing</em>.` |
| after  | `<em>Thing</em>`       | `Wild <em>Thing</em>`    | `Wild<em> Thing</em>.`   |

</div>

So even if your program suddenly started producing the following zany output,
maybe because you switched HTML rendering libraries, your tests will still pass
as long as it has not changed semantically:

<div align="center">

`(D)` Semantically the same as (A), (B) and (C), will normalize to (C)

</div>

```javascript
\t<blockquote class="lyrics, pullquote", id="wt13">\t<ul>\t<li>\tWild thing,\t<p>\tI think I love you    </p>
         </li>      <li>                 But\tI wanna know      for sure   </li>
            </ul>           </blockquote>
```

One browser behavior that `htmlnorm` does not mimic is 
[tag soup parsing](https://en.wikipedia.org/wiki/Tag_soup). Doing so would hide 
test failures. `htmlnorm` leaves malformed HTML as-is.

For a comprehensive explanation and illustration of everything `htmlnorm` does, [TODO, link to DOCS.md]

<br>

## installation & usage

```bash
> npm install htmlnorm
```

`htmlnorm` is an ESM module exporting one function:

```javascript
import htmlnorm from 'htmlnorm'

let html_with_a_personality = // html producing code here

let normalized_html = htmlnorm(html_with_a_personality)
```

If you are unfamiliar with ESM modules or unsure about how to use them, [this might help you](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). I don't plan to publish a CommonJS build unless someone makes a very compelling case. Node.js fully supports ESM now, and everyone should just make the switch.

<br>

## options

This alpha version of `htmlnorm` has no options, but I expect to add some in
later releases if there is enough demand. For example:

- User choice on reformatting strategies, particularly element wrapping and 
  indentation.
- Control over which kinds of differences are considered significant. 
  For example, some tests may care whether a character was escaped, even if the
  HTML spec didn't require it.
- support option to not close tags? (right now we just error out.) See https://html.spec.whatwg.org/#syntax-tag-omission


There are also some good ideas worth adopting from [other libraries](#other-libraries-i-tried-first).  

<br>

## Quick turn-around on bug reports and feature requests

This is [extensively tested](), but it is still the v0.1. If something doesn't work as you expect/want, instead of just walking away, please [submit an issue](). I promise a quick turn-around:

- bugs will be fixed pronto,
- feature that aligned with the goals of `htmlnorm` and otherwise make sense will be put on the roadmap. In any case I will respond to your request with an honest answer.
- requests that I don't think fit will get an quick and honest reply explaining why.

it's easy to make a request, just format your request like the test cases: an example input and your expected output.



##  🌈 Suggestions and pull requests welcome!

As long as they make sense, and don't add unnecessary UX complexity.

<br>

## other libraries i tried first

I hunted high and low, though no doubt missed a possibly excellent library out there. Let me know. Here are comments about the ones that I did find:

| library                                                      | strategy                                 | why it didn't work for me                                    |
| ------------------------------------------------------------ | ---------------------------------------- | ------------------------------------------------------------ |
| [prettydiff](https://github.com/prettydiff/prettydiff#readme) | semantic diff?                           | Is a rather large library supporting a large number of languages (code as well as markup), and using a complex parser (sparse). I hesitate to use something so large. <br><br>See [prior README](https://github.com/prettydiff/prettydiff/blob/0d5b434434f13377f80470924fb36d9ebb0b0233/readme.md). See MY TODO.md notes.<br><br>Seems to do whitespace collapsing correctly!<br><br>CC0 Creative Commons license. |
| Open Web Components *[Semantic Dom Diff](https://open-wc.org/docs/testing/semantic-dom-diff/)* | semantic diff                            | This is appears to be a very powerful tool! It does a lot of good things, including things I would like to add to future versions of `htmlnorm`. But it removes more than whitespace with no way to disable that. |
| [AngleSharp.Diffing](https://github.com/AngleSharp/AngleSharp.Diffing#readme) | semantic diff                            | Another powerful library, but it's written in C#. I has [a lot of configuration options](https://github.com/AngleSharp/AngleSharp.Diffing/wiki/Diffing-Options), including control for how whitespace is handled, but since it's C# I wasn't able to test whether it does properly. |
| [js-beautify](https://github.com/beautify-web/js-beautify#readme) | pretty-print                             | only does simplistic collapsing of whitespace runs into a single space. Can try it online: https://beautifier.io |
| [pretty](https://github.com/jonschlinkert/pretty#readme)     | pretty-print                             | just a customization of `js-beautify`, same issues           |
| [diffable-html](https://github.com/algolia/diffable-html#readme) | "opinionated formatter" focused on diffs | *"Be aware that this plugin is intended for making HTML diffs more readable. We took the compromise of not dealing with white-spaces like the browsers do."*<br><br>adds whitespace between inline elements where there was none, materially changing  <br><br>it doesn't sort attribs or classes. prob more diffs. |

### Behavior/feature comparison 

>  # 🟧 todo: complete this table


|                                      | htmlnorm | [diffable-html](https://github.com/algolia/diffable-html#readme) | [prettydiff](https://github.com/prettydiff/prettydiff#readme) | [Semantic Dom Diff](https://open-wc.org/docs/testing/semantic-dom-diff/) | [js-beautify](https://github.com/beautify-web/js-beautify#readme) |
| ------------------------------------ | -------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| sort attribs                         | ✅        | ❌                                                            |                                                              |                                                              |                                                              |
| sort classes                         | ✅        | ❌                                                            |                                                              |                                                              |                                                              |
| properly preserves inline whitespace | ✅        | ❌[^1]                                                        | ✅ (need to confirm)                                          |                                                              |                                                              |
| Conservative mode                    | ✅        | ❌                                                            |                                                              |                                                              |                                                              |
|                                      |          |                                                              |                                                              |                                                              |                                                              |
| small, focused library               | ✅        |                                                              | ❌                                                            |                                                              |                                                              |



[^1]: diffable-html adds leading and trailing whitespace to inline elements in order to display their text content on separate lines. This is NOT a semantics preserving transformation.

