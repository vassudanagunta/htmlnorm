# initial release

## add support for excluding/normalizing elements values

- [ ] targeting
  - [ ] **elements** by CSS selector. Can use [fb55/css-select](https://www.npmjs.com/package/css-select) which is designed to work with htmlparser2
  - [ ] **attributes** by element CSS selector + attribute name

- [ ] actions:
  - [ ] **exclude** - not included in normalized output
  - [ ] **normalize value** - included, but with replaced value:
    - [ ] **fixed:** simply replaces the value with a constant
    - [ ] **numeric:** ensure source value is numeric (leave as-is if not), then replace with fixed or sequential value
    - [ ] **string pattern:** tests source value against regex pattern. if matches, replaces it with regex replacement expression.  if it does not match, leaves it as-is





## Nail correct whitespace rules

- [ ] Spell them out in **`Docs.md`**.
  - [ ] Including clear rules for `CONSERVATIVE` mode. 
- [x] add more test cases to cover the complete understanding



## double check element classes and rules

- [ ] see the spec resources saved in `DOCS.md`
- [ ] sync up to HTML/CSS specs (see list in `DOCS.md`)
- [ ] write tests for the changes/new expectations from this work
- [ ] add test cases for legit HTML5 
  - [ ] `<p>` and `<li>` without closing tags.
- [ ] add test cases that break rules:
  - a paragraph that contains a list. (leaf that contains a block)




## Tests as the documentation

Make tests the documentation (AND required GitHub Issue submittal form)

- [x] move them to a plain text file
- [x] implement a quick reader solution, to be replaced by TextPlain down the road.
- [ ] make sure tests have unique names
  - [ ] enforce in test loader?



## Alternate Lib tests / validation of `htmlnorm`

TEST EACH of the alternate libraries in the table against html-examples.html

- [ ] actually - put the tests in the test case file instead.
- [ ] print and HTML version for sanity check whether browser "passes" the same tests.
- [ ] reference which tests alt html formatter impls fail



## README / docs

- [ ] SEARCH README for "TODO"
- [ ] Merge or link to `DOCS.md`
- [ ] 🚩 Include more kinds of normalization in example, e.g. attributes, escaping...
- [ ] 🚩 use the same base example throughout.
- [ ] Make sure all the implemented features are listed somewhere
   - [ ] scour the test cases for notable features and behaviors
         Even if the test case file *is* to be the detailed doc of behavior, we
         need a quick to read summary somewhere.
- [ ] Claim complete HTML support:
  - [x] **EITHER**: Implement handling of all HTML elements e.g. (`html`, `head`, etc)

    See https://html.spec.whatwg.org/#elements-2.

  - [ ] **OR**, Document what we haven't implemented yet /  put in public TODO/roadmap
  - [ ] Ask for feedback.
  - [ ] Welcome pull requests.



## Publish list of open questions to end users

> #### Pending list further below, though some of them are for me, not users.



## Pre-release

- [ ] use code coverage to make sure we have the tests we need
- [ ] take the final description from the README and put it in
  - [ ] CLI command
  - [ ] GitHub proj summary
  - [ ] package.json description
- [ ] update the release date in CHANGELOG



## GitHub issue template

- [ ] in subdir

- [ ] issue template:

  Require Issue submission to describe expected behavior using the same
  exact format -- i.e. they have to create or modify a test, though they
  can do it in the issue text as opposed to doing a code pull request.



## NPM publishing

- [ ] add 2FA to NPM account, review account.
- [ ] do the stuff in this: https://zellwk.com/blog/publish-to-npm/
  - [ ] maybe also this: https://zellwk.com/blog/publish-to-npm/
- [ ] FIRST publish a trial package under a different package name to examine
  how it looks. It can be [unpublished](https://docs.npmjs.com/cli/v7/commands/npm-unpublish) 
  before the real one is pushed.
  - [ ] See https://docs.npmjs.com/policies/unpublish

- [ ] add NPM shield to README?



## announcements

- https://stackoverflow.com/questions/3974734/how-to-normalize-html-in-javascript-or-jquery
- https://stackoverflow.com/questions/63314804/normalizing-html-lost-space-inside-between-two-tags



## misc

- compare https://github.com/commonmark/commonmark-spec/blob/37f6e702350e446b5415647dd90a62cfabc36c50/test/normalize.py



# 🟧 Open questions

This is a v0.1. I've put a LOT of research and thought into it, going beyond even my own needs (`htmlnorm` would be way simpler if this were just for me). But the right way to go beyond one's own needs and theory based on complicated HTML specs is real world feedback from users.

Here is a list of open questions, including a number of possible new features, options and behaviors. Please feel free to comment. 



> ### some of these open questions are just for me. Publish only the ones that are meant for user feedback



## 1. Do browsers collapse whitespace before CSS sees anything?

Conjecture: Even if you allow for CSS to change what is block or inline, **the browser's parser may operate on the whitespace before CSS (which operates on the DOM) even gets a chance to see it**.

**If so, it would make `paranoid` mode pointless.**

🟧 DO A TEST:  try and change the CSS definition of `<p>` to `pre` whitespace handling. 



Tools refs:

- https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing/Introduction



## 2. Should the preservation of whitespace on *both* sides of inline tags be CONSERVATIVE mode?

The v0.1 release of `htmlnorm` does this by default, *for all modes, conservative or not*. But should that be changed? Leave this as an open question during pre-v1.0 releases, at least until someone makes a compelling and especially standards-based case one way or another. But state that if no such case is made, the current behavior will carry into v1.0.



## 3. confirm space before and after tag behavior

Figure out the proper interpretation of:

```html
<p>Wild thing,<b> I think I love you</b></p>

<li>Wild thing,<p> I think I love you</p></li>

<li>Wild thing,<p>I think I love you</p></li>
```

- [ ] Try it in my code
- [ ] compare to https://prettydiff.com/# - see *Alternate Lib tests / validation of `htmlnorm`* below.



## 4. 🌈 Support a "Skip the closing tag" option to break tag abutting blocks across lines?

See  [Fighting the Space Between Inline Block Elements | CSS-Tricks](https://css-tricks.com/fighting-the-space-between-inline-block-elements/) 



## 5. Should we commit to HTML5 and rename to `html5norm`?

https://www.w3.org/TR/html5-author/ (includes HTML vs XHTML)

https://www.w3.org/TR/html5-diff/



## 6. normalize malformed HTML?

**Currently, in all cases of invalid or malformed input, `htmlnorm` will return the input as-is**

The main purpose of `htmlnorm` is to facilitate testing. It would be very 
unusual and rare to expect the correct output to be malformed HTML.  
If `htmlnorm` normalized malformed HTML by fixing it, it would end up allowing
tests that should fail to pass. So for now it will take the most conservative
approach, which is to leave it as-is.

But the better solution might be to normalize it without "fixing" it.
This would make diffs easier to read, as the broken part of the HTML would
not be hidden by other insignificant differences.



## 7. normalize duplicate attributes?

Duplicates attributes are a parse error according to the spec.
But the spec also says browsers can gracefully handle the error,
and if they choose to do so, MUST ignore all but the first
(lexical first, not alphabetical first). Currently `htmlnorm` operates
in line with the latter approach. See https://stackoverflow.com/a/43859478/8910547.

Since `htmlnorm`'s 
primary purpose is for testing, **this may be the wrong approach**, as it
can potentially hide behavior that should result in test failure.

Alternatives:

- Treat it is malformed input, and return as-is.

- Treat it as legitimate input, and return with the duplicates as-is, **in the same order** (since in the end only the first occurrence is used, to maintain semantics we cannot change which occurence is first in the output)  

  > We can
  > definately implement this because htmlparser2's
  > handler interface will report EVERY attrib via the
  > `onattribute` callbck. This question should be answered
  > below. )

- let `CONSERVATIVE` mode, or a `strict` mode or some other configuration govern what happens.

  BUT DO NOT create too many kinds of modes. There really should be one `strict`/`safe` mode which covers all these sorts of situations. I *THINK* maybe that `CONSERVATIVE` mode is a distinct mode for whitespace, though perhaps an *overall* `STRICT` mode would automatically include `CONSERVATIVE whitespace` mode... but that seems wrong. why not keep the switches orthogonal and let users decide?



# next

- [ ] for CLI, look at mocha/bin/mocha.js and lib/cli.js
- [ ] commit message standard
- [ ] setup CI
  - [ ] add test stats and coverage badges / shields
    - [ ] https://shields.io/category/version



## either a separate `HTMLAssertion` lib or add an `assertEquals` method

a convenience method that applies `htmlnorm` to both inputs and then makes an assertion.

- are assertions tied to a tech like Mocha, or generic?
  - if generic, try to do this without depending on another assertion library. Just see how they do them.
  - if not generic, release a Chai extension or something, etc...





# future custom settings

useful for testing
----------------------
- [ ] disable whitespace collapsing (aka `untra-conservative` mode) - *because any tag could be styles as `pre` by CSS.*

  - This would be useful only if there are cases where this would matter. UNSURE. 
  - maybe best approach is to ask users. Via list of open questions above.

- [ ] Special (optional) run-on block handling, e.g.

  ``` html
  <p>Wild thing.</p
  ><p>You make my heart sing.</p
  ></hr><p>You make everything.</p>
  ```

  This is not a priority: If blocks are intentionally run-on, they are
  unlikely to be long (i could be wrong).

- [ ] options for more granular breaking up output to separate lines. For example:

  - format inlines hierarchically just like blocks

  - putting each attrib on it own line (like `diffable-html`)

    - i don't think this is all that useful give that attributes are sorted and a easily revealed with good diff display

    - would this clash with CONSERVATIVE mode too much? maybe not.



## more for aesthetics (i.e. not for testing)

- [ ] choose boolean tag normalized form
- [ ] choose void tag normalized form: [simple vs self-closing](https://dev.w3.org/html5/html-author/#void-elements-0)
  - [ ] see answers to [Do you need to close meta and link tags in HTML?](https://stackoverflow.com/questions/19506028/do-you-need-to-close-meta-and-link-tags-in-html)

- [ ] customized newline / indentation rules





# future

- [ ] link to TextPlain.js (and perhaps its tests) in the README as an example tool using it
- [ ] **When TextPlain is released**, use a custom stylesheet + TextPlain to parse the plain text test cases file.





# performance notes



## re-using handler and Parser instances

currently a new handler and `htmlparser2` instance is created every call to `htmlnorm`.

Alternatives:

1. have user create an `htmlnorm` *instance* 

   - at the end of each use, reset the handler (needs new method) and the parser (`parser.reset()`)

   CON: not as simple API. User can't just call a function. Also, the function is not reentrant / thread-safe.

2. create a pool of handlers/parsers. A call to `htmlparse` will re-use one from pool if available, else add a new instance to pool. Pool size should never exceed the number of threads in operation. So kinda perfect.

3. Do nothing. `htmlparse` is geared for testing, not production services, so is plenty fast.











