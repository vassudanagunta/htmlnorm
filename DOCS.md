

> # 🌶 where goes this doc? 
> - in readme? 
> - as separate `htmlnorm` documentation?
> - dispersed in  htmlnorm.test.md



> ## 🌶 Let me know if `htmlnorm` is missing an ability 
>
> `htmlnorm`'s purpose is to facilitate testing of HTML output by not letting unimportant differences between output values and a test case's expected value result in a failed test.
>
> I did my best to imagine all the kinds of "unimportant differences" that are possible, but I may have missed some. If you have a case where `htmlnorm` comes up short, please file an issue! I will get to it as soon as possible!




# 📜 principles

## designed for testing

`htmlnorm`'s raison d'être is testing. This means:

- **It will be maximally conservative if there is any ambiguity.** 

  Specifically, if there is any ambiguity as to the semantics of the input that is not disambiguated by the HTML5 spec ([this one?](https://html.spec.whatwg.org/multipage/parsing.html)), then `htmlnorm` will return the input as-is, untouched. This ensures that `htmlnorm` doesn't inadvertently allow tests to pass that shouldn't pass because it chose the wrong interpretation. 

- "beautification" is not a primary concern, and is done only in service of testing.

  That said, you may really like the pretty printing `htmlnorm` performs.

- There is no guaranteed stability of how `htmlnorm` formats from version to version, though it will only change when justified -- to further improve its purpose.

  - stability is not required for testing, because `htmlnorm` is intended to be applied to both the test output and the expected value -- in other words they will both be normalized by the current version of `htmlnorm` and comparable. The output of `htmlnorm` is not intended to be preserved as test artifacts or fixtures.



## Pretty printing vs normalization

> ## ⚠️ this is redundant with the section in the README. Pick one spot, and link to it from the other.



As [someone pointed out](https://github.com/beautify-web/js-beautify/issues/1732#issuecomment-560138462) about JS-Beautifier:

> Your formatter is meant to take existing HTML source code and make it prettier by *improving* it, while still maintaining certain aesthetic decisions of the author (e.g. whether the author places extra newlines between paragraphs, etc.).

In other words, it doesn't normalize, just beautifies some things, and leaves alone other author choices, meaning two HTML docs that are actually semantically identical will not always be reformatted or reduced to a normalized or canonical form. 

---

document another difference between pretty printing and testing-oriented normalization:

whenever there are two semantically equivalent ways of expressing the same thing, then they both should be normalized to the exact same form (whether it is one of the two or a third form).

For example, the first form below looks great, and a pretty printer might leave it alone. But a pretty printer might also leave the second one alone, thinking: *given the context(inside single quotes), the internal quotes must remain escaped.*  But for `htmlnorm`  that is result in failed tests. So it MUST choose one of the two and ALWAYS transform to that form. It would have to choose between (a) ALWAYS choosing double quotes for the outer quotes and escaping as necessary or (b) employ complex logic, changing the outer quotes to single when the value contains double (and only double).

```
<img title='the meaning of "grok"'>
<img title="the meaning of &quot;grok&quot;">
```



# ✅ Line and whitespace reformatting


## 🟨 notes moved here from the code

Three basic decisions/operations on whitespace:
1. When to COLLAPSE to single space
2. When to REMOVE as run entirely.
3. When to INSERT to produce hierarchical structure.

### When to COLLAPSE
- outside of PRE, we collapse all whitespace runs to a single space.

### When to REMOVE
- STANDARD: we remove leading and trailing whitespace of any BLOCK's contents
- CONSERVATIVE: ❓❓❓

### When to INSERT
- STANDARD:
  - between any sibling BLOCKS (including anonymous inline text blocks)
  - between a CONTAINER BLOCK open/close tags and it's contents
- CONSERVATIVE:
  - same as STANDARD, but only if there is/was whitespace in that spot
    in the source originally. In other words, it's more a REPLACE than
    an INSERT. If there was no whitespace, we can't INSERT any without
    potentially altering how it is rendered --- and normalizing HTML
    CANNOT impact the visual rendering.

### THE NET AFFECT IS:
1. We don't insert whitespace where it does not exist in the source.
   This includes adding newlines or indentation to format the HTML source
   as a nice hierarchical structure. We will only do so when we can (i.e.
   whitespace already exists)
2. we don't remove whitespace where it does exist in the source. But we
   will:
   - reduces runs of whitespace between inline elements to a single space
   - replace the whitespace with a different run of whitespace in order to
     reformat the HTML source as a nice hierarchical structure, with blocks
     on their own lines.

### Analogy
So just as one wouldn't insert a space or newline in the middle of the
word "solidarity" when laying out a sentence, one doesn't insert a space
or newline between the `<q>` and the inner text of `"<q>a quote</q>`
because the <q> ends up rendering a a quotation mark and you'd end up with
`" a quote "`, which is obviously wrong and not what the author intended.

### THINGS WE DON'T ASSUME IN CONSERVATIVE MODE
1. That a normally block element won't be recast as inline by CSS
2. That a normally block element won't be recast as inline by CSS ❓❓❓
3. That tags that wrap an inline element don't also correspond to glyph(s),   <--- actually we do this for STANDARD mode too
   a border or other visible manifestation where the a space between the
   tag and its inner content can be ignored.  [??? also between it and outer adjacencies?]
4. Since a block can be recasts as inline, #3 applies to blocks.



## `htmlnorm`  formats all unknown tags as inline. 

- this corresponds with browser/CSS defaults
- this is also the most conservative, as `htmlnorm`'s rules for inlines are more conservative than for blocks (though they are identical in CONSERVATIVE mode)




## ✅ `STANDARD` mode

`STANDARD` mode **assumes HTML blocks elements have CSS `block` flow.** [`STANDARD` mode **assumes that each HTML defined element will have the same flow semantics as defined by the XXX default CSS.**] That inline elements will remain inline and block will remain block. This means we can insert whitespace between block-level elements even if there is no whitespace in the source.

1. Insert whitespace (newlines and spaces) between HTML blocks elements with newlines and spaces to form a visual hierarchy. Do so even if the source HTML has no whitespace between the tags, e.g. 

   ```
   <li><p>1</p><p>2</p></li>
   ```

   will be rendered as:

   ```
   <li>
     <p>1</p>
     <p>2</p>
   <li>
   ```
   > ## 🟧 need to distinguish between leaf and container blocks in the above description? Perhaps use a table to compare the four: inline, leaf block, container block, pre block?

2. Collapse all other contiguous whitespace runs to a single space. "Whitespace" here means spaces, tabs and newlines.

3. 🟧 Remove leading and trailing whitespace within each leaf block element

As a *semi-conservative* precaution, we do treat whitespace runs spanning an inline tag as a single run, even when the default CSS rule for that tag produces no visual element that separates the whitespace on either side. This rule is consistent with how browsers parse the HTML into the DOM[^1]. It has no impact on the ability to reformat blocks onto separate lines with indentation to create a visual hierarchy in the source.

---

[^1]: 🟧  See Open Question about whether browsers collapse whitespace before CSS sees anything





## ✅ `CONSERVATIVE` mode

`CONSERVATIVE` mode assumes that CSS rules might alter the flow property of any normally block element to `inline`. This means the existence of whitespace or the lack thereof is significant even between sibling element tags, and so cannot be arbitrarily altered. Specifically: 

1. Never add some where there was none.
2. Never reduce to none where there was some.

In other words, HTML whitespace semantics are such that all whitespace reduces down to a binary either-or: 

- **EITHER** there is whitespace between to things, with the amount not mattering:
  
  ``` html
  <p>1</p> <p>2</p>
  
  <p>1</p>
  <p>2</p>
  
  <p>1</p>     <p>2</p>
  ```

- **OR** there is not:

  ``` html
  <p>1</p><p>2</p>
  ```

`CONSERVATIVE` mode is careful not to change the sources condition form one to the other.

which means:

- ✅ **never collapse white space to `zero space`.** Any run of consecutive whitespace characters (space, tabs, newlines) can be collapse, replaced by, or expanded into to any another other consecutive run of whitespace characters and the document remains semantically identical.
- ✅ **never introduce space between to elements separated by `zero space` in the source.** This means, for example, when the opening tag of a paragraph abuts the closing tag a preceding paragraph, with no space between them), they are on the same line and must remain so. (One is free to break the text for these to paragraphs across lines anywhere there exists a space in the content of either paragraph.)

The only exception is around **PRE** and **BR** tags. These two tags are **void** tags with such explicit whitespace semantics that it makes no sense for a CSS rule to alter their meaning.

Otherwise the same as `standard` mode. 

The impact of `CONSERVATIVE` mode is that blocks whose tags have no whitespace between them cannot be broken onto separate lines or indented, limiting the ability to reformat those blocks into a visual hierarchy. Such "run-on" block elements will remain on a single line, potentially a very long one.



### real world problems solved by `conservative` mode

 `Conservative` mode may seem like a theoretical and unnecessary option, but as the examples below show, it matters in read world situations:

People accepting the reality of it when writing HTML / CSS with specific rendering goals in mind:

-  [Fighting the Space Between Inline Block Elements | CSS-Tricks](https://css-tricks.com/fighting-the-space-between-inline-block-elements/) 

More:

- ✅ [When does **whitespace matter** in HTML?](https://stackoverflow.com/questions/12863588/when-does-whitespace-matter-in-html)

  - Question is well written, illustrating the problem well.
  - 🌈 **It has the true answer: It all depends on the CSS rules. It has a link to the CSS spec.**

- ✅ [Browser **white space rendering**](https://stackoverflow.com/questions/24615355/browser-white-space-rendering)

  - is really a duplicate of the above question (already reported)
  - The accepted answer is spot on. 

- ✅ [White space removed by **minifier** tools affects look and feel of HTML](https://stackoverflow.com/questions/54678190/white-space-removed-by-minifier-tools-affects-look-and-feel-of-html)

  - The question is well written.

  - It points out that **there are minifiers that a make bad assumptions**.

  - The top answer is also well written. It points out that the only TOTALLY safe thing is to not mess with any whitespace at all, even collapsing, because there is a CSS rule that makes all whitespace significant: ``white-space:pre`.  But outside of that, this is who to do it:

    > it should collapse runs of whitespace in phrasing content, but not strip them:
    >
    > ```html
    > <div><span class="surround-brackets"> Title </span></div>
    > ```
    >
    > ...the effective minified equivalent assuming normal CSS white-space processing.

- ✅
  [Is **minifying** your HTML, CSS, and Javascript a bad idea?](https://stackoverflow.com/questions/23293168/is-minifying-your-html-css-and-javascript-a-bad-idea)

  - Same as previous.
  - 🥃 **WRITE A NEW ANSWER FOR THIS**, based on my `htmlnorm`  research, perpahaps pointing to my explainer doc in this repo. 

- ✅ [CSS word-spacing property doesn't work after HTML minified with PHP](https://stackoverflow.com/questions/41400532/css-word-spacing-property-doesnt-work-after-html-minified-with-php)

  - same deal

Even more:

- https://stackoverflow.com/questions/39325039/css-flex-box-last-space-removed








## 🟨 `custom` mode

`custom` mode is builds off of `standard`, but allows you to change the `inline` vs `leaf block` vs `container block`  property for any element.





# 🟧 Tag Normalization



## 🟧 WIP: `closing_tags` mode

> ## relevant specs (to link in final docs)
>
> https://html.spec.whatwg.org/multipage/syntax.html#optional-tags
>
> https://html.spec.whatwg.org/#syntax-tag-omission



Four possible options:

- `AS-IS` (default)

  - no closing tags will be added or removed
  - BUT the formatting of the document will reflect implicit closure, whether per HTML rules or mimicking browser handling of tag soup

- `EXPLICIT`

  - all unclosed tags are normalized via insertion of explicit close tags:

    - first, per HTML5 rules, some tags are implicitly closed open the opening of others (e.g. successive `p` tags without intervening close tags, as `p` cannot contain a `p`)

    - mimic browser handling of tag-soup. e.g. an unclosed blockquote will be automatically closed if its parent container terminates (including termination of the root doc container)

      I think htmlparser2 does this so it should be easy to implement.

  > ### 🚩 DO NOT use this mode if
  >
  > - if the user code being tested should never be allowed to produce tag soup. It will hide such usage, even if your expected values are properly formed, since the actually will be silently "fixed" before the test comparison.
  > - if your tests need to distinguish between explicit and implicit tag closure.
  >
  > Use either
  >
  > - `AS-IS` mode.
  >
  >   - Nice diff
  >   - your test expected values can express whether or not a closing tag should occur.
  >
  >   In other words, you can test a library that is expected to produce HTML abbreviated form, or explicit element closure, and be able to test this difference, with easy to read diffs when the expectation isn't met
  >
  > - `STRICT MODE` (if the diffs don't matter)
  >
  >   Use this when you want the tests to barf when ANY HTML is used that isn't perfectly formed with explicit closed tags (OR not barf, but your expected out is to be compared to the actual literally, char for char)

- `HTML5 IMPLICIT`

  - removes close tags for elements in contexts that support implicit closure, per HTML5 specs

  > 🚩 SAME "DO NOT use" caveat as `EXPLICIT_CLOSE` mode.

  > 🏈 I think this one is not so important, and since it isn't trivial to implement, punt for now

- `STRICT MODE` / `SAFE MODE`

  - if a document is missing any close tags, `htmlnorm` will simply return the input unchanged. This is useful for test contexts where the user does not want tests to pass if any tag soup fixes were employed and/or wants to test cases where tag soup is expected. 



> ### not sure if all of the above are orthogonal to CONSERVATIVE mode
>
> - Even if not totally orthogonal, we can let users figure out which combinations don't make sense?
> - or maybe we should disallow those, to proect the users
> - OR does CONSERVATIVE mode always choose one of the above?









# 🟨 OLD NOTES TO MERGE ABOVE OR ELIMINATE

-  See rules for [Google Code Archive - Long-term storage for Google Code Project Hosting.](https://code.google.com/archive/p/htmlcompressor/) 



## HTML fragments

`htmlnorm` handles HTML fragments, does not convert into HTML doc

## hidden elements (e.g. `<head>`)

https://github.com/beautify-web/js-beautify/issues/1732:

> The only problem is that this only applies to non-hidden elements. Things like `<head>` are considered "hidden" so I'm determining the best way to find a semantic grouping that would include the right hidden elements that we expect to be formatted as block in the HTML source code.





# HTML/CSS standards

📜 governing standard docs:

- [HTML Living Standard](https://html.spec.whatwg.org)

  > The W3C ceded authority over the HTML and DOM standards to WHATWG on 28 May 2019, as it considered that having two standards is harmful.[[37\]](https://en.wikipedia.org/wiki/HTML5#cite_note-W3C_transfer_blog-37)[[38\]](https://en.wikipedia.org/wiki/HTML5#cite_note-W3C_transfer_HTML-38)[[39\]](https://en.wikipedia.org/wiki/HTML5#cite_note-W3C_transfer_memo-39)[[3\]](https://en.wikipedia.org/wiki/HTML5#cite_note-W3C_transfer_ZDNet-3) The HTML Living Standard is now authoritative. However, W3C will still participate in the development process of HTML.

  [HTML (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTML) will be referenced when its explanation is more succinct and intelligible, but when there is any disagreement, the HTML Living Standard supersedes.





By topic:

- Parsing

  - 📜 [HTML Living Standard - Parsing](https://html.spec.whatwg.org/multipage/parsing.html)
  
- ✅ Defaults

  - [CSS Default Browser Values for HTML Elements](https://www.w3schools.com/cssref/css_default_values.asp) <-- a lot of minifiers/pretty printers assume this default CSS, and thus can break a design that uses different CSS. 
  - W3: [Default style sheet for HTML 4](https://www.w3.org/TR/CSS2/sample.html) 

- ✅ Kinds/Classes 

   - https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements

   - https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements

   - https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories

   - Whatwg spec: [Kinds of content](https://html.spec.whatwg.org/multipage/dom.html#kinds-of-content) 

   - Whatwg spec: [Palpable content](https://html.spec.whatwg.org/multipage/dom.html#palpable-content)

   - Whatwg spec: [Kinds of elements](https://html.spec.whatwg.org/#elements-2)

   - Whatwg spec: [HTML Living Standard - Rendering](https://html.spec.whatwg.org/multipage/rendering.html)  (HTML5)

      See particular sections such as:

      - [HTML Standard - Rendering - Phrasing content](https://html.spec.whatwg.org/multipage/rendering.html#phrasing-content-3) 
      - [HTML Standard - Rendering - Flow content](https://html.spec.whatwg.org/multipage/rendering.html#flow-content-3) 

   - W3: 

     > **inline-level**: Content that participates in inline layout. Specifically, inline-level boxes and [text runs](https://www.w3.org/TR/css-display-3/#text-run). 
     >
     > **block-level**: Content that participates in [block layout](https://www.w3.org/TR/css-display-3/#block-layout). Specifically, block-level boxes.

   - Summarized list, maybe useful if official specs don't summarize this conveniently: [HTML: The 16 Content Categories and Their Elements · Jens Oliver Meiert](https://meiert.com/en/blog/html-content-categories/) 

      



## Text and Whitespace

- MDN: [white-space - CSS: Cascading Style Sheets](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space) 

- CSS3 draft

  - CSS Text

    -  [White Space Processing & Control Characters](https://drafts.csswg.org/css-text/#white-space-processing)

    - [CSS Text Module Level 3](https://drafts.csswg.org/css-text/#white-space-property)

      Defines terms "collapse" and "preserve". Includes *White Space Processing Rules.*

  - CSS Display
    -  [Run-In Layout](https://drafts.csswg.org/css-display-3/#run-in-layout) 

- W3 CSS

  -  [Inline layout model](https://www.w3.org/TR/css-inline-3/#model)

    > The [==block container==](https://www.w3.org/TR/css-display-3/#block-container) also generates a ==root inline box==, which is an ==[anonymous](https://www.w3.org/TR/css-display-3/#anonymous) [inline box](https://www.w3.org/TR/css-display-3/#inline-box)== that holds all of its [inline-level](https://www.w3.org/TR/css-display-3/#inline-level) contents. (Thus, all text in an [inline formatting context](https://www.w3.org/TR/css-inline-3/#inline-formatting-context) is directly contained by an inline box, whether the [root inline box](https://www.w3.org/TR/css-inline-3/#root-inline-box) or one of its descendants.) The root inline box inherits from its parent block container, but is otherwise unstyleable.

    > Note: ==Empty [inline boxes](https://www.w3.org/TR/css-display-3/#inline-box)== still have [margins](https://www.w3.org/TR/css-box-4/#margin), [padding](https://www.w3.org/TR/css-box-4/#padding), [borders](https://www.w3.org/TR/css-box-4/#border), and a [line-height](https://www.w3.org/TR/css-inline-3/#propdef-line-height), and thus influence these calculations just like boxes with content.

  - display

    > Clarified that empty text objects are ignored for CSS rendering. 
    >
    > > [[css-display] Do empty text nodes generate text runs? #1808](https://github.com/w3c/csswg-drafts/issues/1808)
    > >
    > > > > empty inline boxes count as content that causes a line box to exist
    > > >
    > > > They do, but shouldn't they be treated as "not existing for any other [than positioning out-of-flow descendants] purpose" [phantom line boxes](https://www.w3.org/TR/CSS22/visuren.html#phantom-line-box)?
    > >
    > > > That depends on if they are assigned any other styles. :)





## blocks vs inlines

https://github.com/beautify-web/js-beautify/issues/1732:

> **There is no standard** that I'm aware of that says, "**here is how HTML source code should be formatted"**. But for the most part I think most users would agree that that the HTML source code formatting should **reflect the rendering of the HTML in the browser** for the most part. (That's a reasonable starting point, anyway, although users of course may want to override some things.)
>
> **Browser rendering is based on CSS, which defaults to `display: inline` for unknown elements.** You can read an explanation of this [on Stack Overflow](https://stackoverflow.com/a/35689800/421049), but in short the CSS `display` property has an initial value of `inline` as per the [CSS 2.1 spec](https://www.w3.org/TR/CSS2/visuren.html#display-prop). The [CSS3 Display Module](https://www.w3.org/TR/css-display-3/#the-display-properties) says the same thing.

==**An important thing to note in this: It's based on CSS, but CSS can be configured to do ANYTHING.**==



## a container/block "classification" not based on CSS

https://github.com/beautify-web/js-beautify/issues/1732#issuecomment-560043729:

> Yes, I'm pretty sure I'm the one who suggested to use HTML5 "phrasing content" in [#840](https://github.com/beautify-web/js-beautify/issues/840). The definition says basically that it's stuff in a paragraph, so for the most part I think those do reflect the right things.
>
> Now that I'm looking more closely at it, I'm ==not sure it's so straightforward with nested things==. For example "phrasing content" includes `<area>` inside a map, which someone might want to be placed on individual lines. And what about `<param>` inside `<object>` and `<source>` inside `<video>`? From the MDN examples, it looks like they would look nicer on separate lines, even though `<object>` and `<video>` are "phrasing" elements. But then again if the `<object>` had no `<param>` children, we wouldn't want it by itself break a paragraph.
>
> I'm almost thinking my original idea of ==a "container" classification might be useful==. **A container would:**
>
> - **Make all of its children be automatically considered "block" elements.**
> - **It would be considered a "block" element if it contained children; otherwise it would be considered an inline element.**
>
> But that is getting pretty complicated. And besides I'm not sure how I would *want* these sort of elements formatted. ==Maybe they would be fine just formatted inline in a paragraph.==
>
> I'm still not 100% sure how I would want ==`<iframe>` to be formatted, even though it's "phrasing content"==. And what about `<frame>` inside a `<frameset>` (although those are obsolete and should not be used)?
>
> I think the biggest doubt I have is things like ==`<dataset><option>`, and of course `<option>` within a `<select>`.==
>
> ==For now I'm going with this definition of "block element":==
>
> - ==All the elements that should default to `diplay: block` in the browser.==
> - ==All the elements that should default to `diplay: list-item` in the browser.==
> - ==All the elements HTML5 specifies as "metadata content".==
> - ==The HTML `<head>` element.==
>
> For a pretty complex HTML document, that matches almost exactly the js-beautify output using my algorithm (except for `<figcaption>` as mentioned). The only other difference is the order of attributes, which my algorithm changes to be consistent based upon certain rules.
>
> For me that will work for now, and I'll keep thinking about what want to do with the nested things like `<option>` and `<param>` and such.

 

## `HTML5/CSS`: Even the relationship between blocks and inlines is fluid / not set in stone

https://stackoverflow.com/questions/746531/is-it-wrong-to-change-a-block-element-to-inline-with-css-if-it-contains-another#758491

> I've since learned that in HTML5 it is perfectly valid to put block level elements inside link tags eg:
>
> ```html
> <a href="#">
>    <h1>Heading</h1>
>    <p>Paragraph.</p>
> </a>
> ```
>
> This is actually really useful if you want a large block of HTML to be a link.

If you read the accepted answer to the question, it is clear that for block level elements in sequence (be it originally a block or an inline coerced into a block by containing a block), `zero-space` and `space`  have the same effect: the blocks are distinct and separate, and thus rendered. 






# Live demo / explanation

Link to `browser-whitespace-study.html` and also to `htmlnorm.test.html` (perhaps renamed)

- [ ] perhaps combine these two files
- [ ] remove  `htmlnorm.test.html`  from `.gitignore` and check in. (changed behavior on code changes will show up as changes in this file to be checked in)
- [ ] 🚩 **Including these two files MIGHT replace some of the README stuff below.**





