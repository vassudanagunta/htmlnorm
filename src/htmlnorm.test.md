# `htmlnorm` test cases

Each code block below represents a test case for the `htmlnorm` function. Above
the dashed line is the `input`, and below it is the `expected output`. The text
just above the block describes the rule or the expectation.

Any `tab` characters in `input` or  `expected output` values are represented
with `→`. They will be converted to real tabs before being used to test
`htmlnorm`.


> 🌶 The order of these tests and the order of any failures matter
> 
> The tests are arranged such that if a test is targeting
> functionality D, but must use functionality A, B and C 
> to test D, then the tests for A, B and C will come first.
> 
> This means that if a test fails and it is the only failure,
> it is likely that the functionality it targets is broken.
> But if one or more earlier tests fail, its failure could
> simply be those early failures cascading down. In other
> words, in general, it is usually more fruitful to look
> at early failures first.




## preliminary sanity checks

These are simple, already normalized inputs that should
be returned unchanged. Many of the more in-depth tests
assume this basic behavior, so we verify these up front.

The cases in this section SHOULD BE INVARIANT regardless
of `htmlnorm` custom settings (i.e. the same `OUT` for
all `IN`s).

### [CASE] leave unchanged already normalized simple text
[IN]
``````````````````````````````````````````````````
This is already normalized simple text.
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
This is already normalized simple text.
``````````````````````````````````````````````````

### [CASE] leave unchanged already normalized inline sequence
[IN]
``````````````````````````````````````````````````
This is an <b>already</b> normalized <em>inline sequence</em>.
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
This is an <b>already</b> normalized <em>inline sequence</em>.
``````````````````````````````````````````````````

### [CASE] leave unchanged already normalized leaf block
[IN]
``````````````````````````````````````````````````
<p>This is an <b>already</b> normalized <em>leaf block</em>.</p>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<p>This is an <b>already</b> normalized <em>leaf block</em>.</p>
``````````````````````````````````````````````````




## tags


### [CASE] legal but extraneous spaces removed
[IN]
``````````````````````````````````````````````````
<h2  >heading</  h2  >
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<h2>heading</h2>
``````````````````````````````````````````````````

### [CASE] legal but extraneous newlines removed
[IN]
``````````````````````````````````````````````````
<h2
>heading</
h2>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<h2>heading</h2>
``````````````````````````````````````````````````

### [CASE] already normalized void element tag
[IN]
``````````````````````````````````````````````````
<hr>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<hr>
``````````````````````````````````````````````````

### [CASE] normalize simple void element tag
[IN]
``````````````````````````````````````````````````
<hr />
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<hr>
``````````````````````````````````````````````````

### [CASE] normalize void element tag with attributes
[IN]
``````````````````````````````````````````````````
<img title="pizza with pineapple" />
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<img title="pizza with pineapple">
``````````````````````````````````````````````````

### [CASE] case insensitivity
[IN]
``````````````````````````````````````````````````
<H2>heading</H2>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<h2>heading</h2>
``````````````````````````````````````````````````




## attributes


### [CASE] leave unchanged already normalized element with single attribute
[IN]
``````````````````````````````````````````````````
<button id="123">Don't Panic Button</button>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<button id="123">Don't Panic Button</button>
``````````````````````````````````````````````````

### [CASE] case insensitivity
[IN]
``````````````````````````````````````````````````
<button COLOR="SOOTHING BLUE">Don't Panic Button</button>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<button color="SOOTHING BLUE">Don't Panic Button</button>
``````````````````````````````````````````````````



### normalized form

#### [CASE] normalized single-quoted attribute values
[IN]
``````````````````````````````````````````````````
<button id='123'>Don't Panic Button</button>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<button id="123">Don't Panic Button</button>
``````````````````````````````````````````````````

#### [CASE] normalized unquoted attribute values
[IN]
``````````````````````````````````````````````````
<button id=123>Don't Panic Button</button>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<button id="123">Don't Panic Button</button>
``````````````````````````````````````````````````


### booleans

#### [CASE] "empty attribute syntax" is normalized form
[IN]
``````````````````````````````````````````````````
<button disabled>sorry</button>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<button disabled>sorry</button>
``````````````````````````````````````````````````

#### [CASE] empty string form converted to empty attribute syntax
[IN]
``````````````````````````````````````````````````
<button disabled="">sorry</button>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<button disabled>sorry</button>
``````````````````````````````````````````````````

#### [CASE] attrib="attrib" form converted to empty attribute syntax
[IN]
``````````````````````````````````````````````````
<button disabled="disabled">sorry</button>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<button disabled>sorry</button>
``````````````````````````````````````````````````

#### [CASE] boolean not in HTML spec as boolean given "" value
[IN]
``````````````````````````````````````````````````
<button secret>secret button</button>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<button secret="">secret button</button>
``````````````````````````````````````````````````


### sorting

#### [CASE] sort attributes
[IN]
``````````````````````````````````````````````````
<input type="checkbox" id="cats" class="setting" checked> Cats?
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<input checked class="setting" id="cats" type="checkbox"> Cats?
``````````````````````````````````````````````````

#### [CASE] sort class values
[IN]
``````````````````````````````````````````````````
<h2 class="x-ray subtitle optional">heading</h2>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<h2 class="optional subtitle x-ray">heading</h2>
``````````````````````````````````````````````````


### escaping

#### [CASE] `'` within `"`
[IN]
``````````````````````````````````````````````````
<img title="Pandora's Box">
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<img title="Pandora's Box">
``````````````````````````````````````````````````

#### [CASE] `&apos;` within `"`
[IN]
``````````````````````````````````````````````````
<img title="Pandora&apos;s Box">
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<img title="Pandora's Box">
``````````````````````````````````````````````````

#### [CASE] `&apos;` within `'`
[IN]
``````````````````````````````````````````````````
<img title='Pandora&apos;s Box'>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<img title="Pandora's Box">
``````````````````````````````````````````````````

#### [CASE] `"` within `'`
[IN]
``````````````````````````````````````````````````
<img title='the meaning of "grok"'>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<img title='the meaning of "grok"'>
``````````````````````````````````````````````````

#### [CASE] Both `"` and `'` in value
[IN]
``````````````````````````````````````````````````
<img title='the meaning of "grok&apos;s creek"'>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<img title="the meaning of &quot;grok's creek&quot;">
``````````````````````````````````````````````````

#### [CASE] unescaped `<` left as-is
[IN]
``````````````````````````````````````````````````
<img title="jealousy < love">
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<img title="jealousy < love">
``````````````````````````````````````````````````

#### [CASE] unescaped `&` left as-is
[IN]
``````````````````````````````````````````````````
<img title="sugar & spice">
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<img title="sugar & spice">
``````````````````````````````````````````````````


### errors

#### [CASE] duplicate attributes

Duplicates attributes are a parse error according to the spec.
But the spec also says browsers can gracefully handle the error,
and if they choose to do so, MUST ignore all but the first
(lexical first, not alphabetical first). Currently `htmlnorm` operates
in line with the latter approach.
See also https://stackoverflow.com/a/43859478/8910547.

> ### 🚩 This may be the wrong approach
It can potentially hide behavior that should result in test failure.
Since `htmlnorm`'s primary purpose is for testing, this would obviously be
bad. See open questions in the docs.

[IN]
``````````````````````````````````````````````````
<input id="cats" id="ants" ID="CATS"> Cats!
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<input id="cats"> Cats!
``````````````````````````````````````````````````




## simple text


### line and whitespace collapsing

#### [CASE] simple text broken across lines collapses to single line
[IN]
``````````````````````````````````````````````````
Wild thing.
You make
my heart sing.
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Wild thing. You make my heart sing.
``````````````````````````````````````````````````

#### [CASE] `<br>` within simple text

> ## 🌶 Every `<br>` will be followed by a `newline` in the output HTML.
> This has no impact on how the HTML is ultimately rendered (e.g.
> by a browser). This is done so that the "chunking" of content in
> the output HTML more closely resembles the chunking of the input
> content.
>
> We will even assume this to be the case for
> CONSERVATIVE mode, as treating a `<br>` as anything other than some
> kind of whitespace between what comes before it and what comes
> after totally violates its semantics.
> 
> ALT TEXT: Like `<pre>`, `<br>` is given special treatment even with
> respect `htmlnorm`'s principe of treating every tag as having a 
> character or character-like representation within the sequence of
> characters and words.

[IN]
``````````````````````````````````````````````````
Wild thing.<br> You make my
heart sing.
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Wild thing.<br>
You make my heart sing.
``````````````````````````````````````````````````

#### [CASE] leading and trailing whitespace removed
[IN]
``````````````````````````````````````````````````

  →
  Wild thing.<br> You make
my heart sing.→

→
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Wild thing.<br>
You make my heart sing.
``````````````````````````````````````````````````

#### [CASE] internal whitespace runs collapse to a single space
[IN]
``````````````````````````````````````````````````
Wild    thing.     <br>
    You→make  →→→


my
→
→→heart  →  →→→   sing.
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Wild thing.<br>
You make my heart sing.
``````````````````````````````````````````````````

#### [CASE] pure whitespace collapses to empty string
[IN]
``````````````````````````````````````````````````
  
 → 

``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````

``````````````````````````````````````````````````

#### [CASE] empty string in, empty string out
[IN]
``````````````````````````````````````````````````

``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````

``````````````````````````````````````````````````


### escaping

#### [CASE] escaped `'` always unescaped
[IN]
``````````````````````````````````````````````````
it&apos;s &apos;dangerous&apos;
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
it's 'dangerous'
``````````````````````````````````````````````````

#### [CASE] escaped `"` always unescaped
[IN]
``````````````````````````````````````````````````
She said, &quot;That's what she said.&quot;
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
She said, "That's what she said."
``````````````````````````````````````````````````

#### [CASE] literal `<` and `>` always escaped
[IN]
``````````````````````````````````````````````````
"<" and ">" <i>always</i> &lt;i&gt;escaped&lt;/i&gt;
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
"&lt;" and "&gt;" <i>always</i> &lt;i&gt;escaped&lt;/i&gt;
``````````````````````````````````````````````````

#### [CASE] literal `&` always escaped
[IN]
``````````````````````````````````````````````````
"&" replaced with "&amp;amp;"
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
"&amp;" replaced with "&amp;amp;"
``````````````````````````````````````````````````

#### [CASE] other escaped characters are unescaped
[IN]
``````````````````````````````````````````````````
"&commat;" replaces "&amp;commat;"
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
"@" replaces "&amp;commat;"
``````````````````````````````````````````````````

#### [CASE] tag open cannot have whitespace, treat as simple text
[IN]
``````````````````````````````````````````````````
< h2>heading< /h2>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
&lt; h2&gt;heading&lt; /h2&gt;
``````````````````````````````````````````````````




## inline elements


### line and whitespace collapsing

A run of inline elements collapses to single line.

#### [CASE] single inline broken by newlines
[IN]
``````````````````````````````````````````````````
<b>Wild thing.
You make
my heart sing.</b>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<b>Wild thing. You make my heart sing.</b>
``````````````````````````````````````````````````

#### [CASE] sequence of inlines
[IN]
``````````````````````````````````````````````````
Wild thing.
<b>You</b> make
my <i>heart sing</i>.
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Wild thing. <b>You</b> make my <i>heart sing</i>.
``````````````````````````````````````````````````

#### [CASE] sequence with nested inlines
[IN]
``````````````````````````````````````````````````
Wild thing.
<q>You make
my <i><b>heart</b> sing</i>.</q>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Wild thing. <q>You make my <i><b>heart</b> sing</i>.</q>
``````````````````````````````````````````````````

#### [CASE] `<br>` between inline elements
[IN]
``````````````````````````````````````````````````
Wild <em>thing.</em><br> You make
my heart sing.
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Wild <em>thing.</em><br>
You make my heart sing.
``````````````````````````````````````````````````

#### [CASE] `<br>` inside an inline element
[IN]
``````````````````````````````````````````````````
<strong>Wild thing.<br> You make my heart
sing.</strong>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<strong>Wild thing.<br>
You make my heart sing.</strong>
``````````````````````````````````````````````````

#### [CASE] sequence with inline void elements
[IN]
``````````````````````````````````````````````````
Wild thing.
<img title="You"> make
my <img title="heart"> <i>sing</i>.
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Wild thing. <img title="You"> make my <img title="heart"> <i>sing</i>.
``````````````````````````````````````````````````

#### [CASE] sequence with nested inline void elements
[IN]
``````````````````````````````````````````````````
Wild thing.
<i><img title="You"> make
my <b><img title="heart"></b> sing</i>.
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Wild thing. <i><img title="You"> make my <b><img title="heart"></b> sing</i>.
``````````````````````````````````````````````````

#### [CASE] leading and trailing whitespace removed
[IN]
``````````````````````````````````````````````````

  →
  Wild thing.
<i><img title="You"> make 
my <b><img title="heart"></b> sing</i>.

  →
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Wild thing. <i><img title="You"> make my <b><img title="heart"></b> sing</i>.
``````````````````````````````````````````````````

#### [CASE] internal whitespace runs collapse to a single space
[IN]
``````````````````````````````````````````````````
Wild   thing.
   <q>You→make →→→


my
→
→→<i><b>heart</b>  →  →→→   sing</i>.</q>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Wild thing. <q>You make my <i><b>heart</b> sing</i>.</q>
``````````````````````````````````````````````````

#### [CASE] whitespace around tags
Space around tags preserved

[IN]
``````````````````````````````````````````````````
<b>
<u>
word
</u>
</b>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<b> <u> word </u> </b>
``````````````````````````````````````````````````

#### [CASE] whitespace or lack thereof around tags
Space or lack thereof around tags preserved

[IN]
``````````````````````````````````````````````````
Wild thing.<b>You
</b> make <i>
<b>
my</b>
heart</i><b>sing</b>.
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Wild thing.<b>You </b> make <i> <b> my</b> heart</i><b>sing</b>.
``````````````````````````````````````````````````

#### [CASE] each run of whitespace collapses to a single space
[IN]
``````````````````````````````````````````````````
Wild       thing.<b>You
    </b>→make  →  <i>


<b>   →
→→→my</b>→
→  →→
heart</i> sing.
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Wild thing.<b>You </b> make <i> <b> my</b> heart</i> sing.
``````````````````````````````````````````````````


#### `<q>` vs `<i>`

The cases in this section compares normalization behavior for two
inline elements that typically render differently, where the
difference sometimes demands different treatment of whitespace.

The `<q>` and `</q>` tags typically manifest as open and close
quotation marks, respectively, implemented via CSS `::before`
and `::after` pseudo-elements rules. This makes whitespace
before, after, or on both sides of the tags always significant.

In contrast, the `<i>` and `</i>` tags typically have no physical
manifestation *themselves*, only affecting the font-styling of
the content they wrap. That there is or isn't whitespace between
the *rendered* italicized text and its surrounding text is
significant, but whether that whitespace itself is italicized,
not so much. If there is whitespace on both sides, only that on 
one is deemed necessary; there should only be on space between
the *rendered* italicized text and its surrounding text. The rule
browsers use is to collapse the whitespace to one side. The side
chosen is the "first" side, as determined by the direction of
the text, left-to-right or right-to-left.

You can see this yourself, by looking at your browser's DOM
representation of 
[the HTML rendered form of this test suite](add link here), 
or that of in this demonstration
[study of how browsers collapse whitespace](../browser-whitespace-study.html).

[//]: # (todo replace links above with the correct URLs when
          this is published.)

`htmlnorm`, even in its default non-conservative mode, will
not assume the default CSS rendering rules for `<i>`, `<q>`
or any other inline element. If whitespace occurs on both sides
of a tag, both will be preserved.

##### [CASE] keep whitespace on left side of `q` tag
[IN]
``````````````````````````````````````````````````
I said,    <q>What I said.</q>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
I said, <q>What I said.</q>
``````````````````````````````````````````````````

##### [CASE] keep whitespace on right side of `q` tag
[IN]
``````````````````````````````````````````````````
I said,<q>    What I said.</q>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
I said,<q> What I said.</q>
``````````````````````````````````````````````````

##### [CASE] keep whitespace on both sides of `q` tag
[IN]
``````````````````````````````````````````````````
I said,    <q>    What I said.</q>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
I said, <q> What I said.</q>
``````````````````````````````````````````````````

##### [CASE] keep whitespace on left side of `i` tag
[IN]
``````````````````````````````````````````````````
I said,    <i>What I said.</i>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
I said, <i>What I said.</i>
``````````````````````````````````````````````````

##### [CASE] keep whitespace on right side of `i` tag
[IN]
``````````````````````````````````````````````````
I said,<i>    What I said.</i>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
I said,<i> What I said.</i>
``````````````````````````````````````````````````

##### [CASE] keep whitespace on both sides of `i` tag
[IN]
``````````````````````````````````````````````````
I said,    <i>    What I said.</i>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
I said, <i> What I said.</i>
``````````````````````````````````````````````````


### empty vs space vs newline

#### [CASE] empty inline
[IN]
``````````````````````````````````````````````````
Wild <b></b> thing
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Wild <b></b> thing
``````````````````````````````````````````````````

#### [CASE] space inline
[IN]
``````````````````````````````````````````````````
Wild <b> </b> thing
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Wild <b> </b> thing
``````````````````````````````````````````````````

#### [CASE] newline inline
[IN]
``````````````````````````````````````````````````
Wild <b>
</b> thing
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Wild <b> </b> thing
``````````````````````````````````````````````````




## leaf blocks


### line and whitespace collapsing

A leaf block collapses to single line.

#### [CASE] simple inner text with newlines
[IN]
``````````````````````````````````````````````````
<h3>Wild thing.
You make
my heart sing.</h3>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<h3>Wild thing. You make my heart sing.</h3>
``````````````````````````````````````````````````

#### [CASE] inner inline sequence with newlines
[IN]
``````````````````````````````````````````````````
<p>Wild thing.
<b>You</b> make
my <i><b>heart</b> sing</i>.</p>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<p>Wild thing. <b>You</b> make my <i><b>heart</b> sing</i>.</p>
``````````````````````````````````````````````````

#### [CASE] `<br>` inside a leaf block

Content of a leaf block after the `<br>` will be indented.

[IN]
``````````````````````````````````````````````````
<p>Wild thing.<br>You make my heart sing.</p>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<p>Wild thing.<br>
    You make my heart sing.</p>
``````````````````````````````````````````````````

#### [CASE] `<br>` at end of leaf block

Content of a leaf block after the `<br>` will be indented.

[IN]
``````````````````````````````````````````````````
<p>Wild thing.<br>You make my heart sing.<br></p>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<p>Wild thing.<br>
    You make my heart sing.<br>
    </p>
``````````````````````````````````````````````````

#### [CASE] `<br>` immediately preceding inline close tag

While there is no real world reason to put the closing inline
tag below after the `<br>`rather than before it, it is technically
valid HTML. `htmlnorm` has supposed to have coherently consistent
behavior, so we test this, even if a bit anal 🤣

In fact this test only exists because while examining the code I
noticed a gap in the logic, and this test was written to prove it
before I attempted to fix the logic. The logic flaw only occurred
when `<br>` was followed by an inline close tag without any intervening
text and only in CONSERVATIVE mode.

Yes, 

[IN]
``````````````````````````````````````````````````
<p><strong>Wild thing.<br></strong> You make my heart
sing.</p>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<p><strong>Wild thing.<br>
    </strong> You make my heart sing.</p>
``````````````````````````````````````````````````

#### [CASE] inner inline sequence with leading and trailing whitespace
[IN]
``````````````````````````````````````````````````
<p>
  →
  Wild thing.
<b>You</b> make
my <i><b>heart</b> sing</i>.

  →</p>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<p>Wild thing. <b>You</b> make my <i><b>heart</b> sing</i>.</p>
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
<p> Wild thing. <b>You</b> make my <i><b>heart</b> sing</i>. </p>
``````````````````````````````````````````````````

#### [CASE] internal whitespace runs collapse to a single space
[IN]
``````````````````````````````````````````````````
<p>Wild   thing.
    <b>You</b>→make →→→


my
→
→→<i><b>heart</b>  →  →→→   sing</i>.</p>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<p>Wild thing. <b>You</b> make my <i><b>heart</b> sing</i>.</p>
``````````````````````````````````````````````````


### leaf block sequences (siblings)

Whitespace separated sibling blocks put on separate lines
(*when possible* if constrained by CONSERVATIVE mode).

#### [CASE] just leaf blocks
[IN]
``````````````````````````````````````````````````
<h2>Wild
thing</h2><p>You make <em>my
heart</em> sing.</p> <p>You
make <i>everything.</i></p>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<h2>Wild thing</h2>
<p>You make <em>my heart</em> sing.</p>
<p>You make <i>everything.</i></p>
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
<h2>Wild thing</h2><p>You make <em>my heart</em> sing.</p>
<p>You make <i>everything.</i></p>
``````````````````````````````````````````````````

#### [CASE] with void leaf blocks
[IN]
``````````````````````````````````````````````````
<h2>Wild
thing</h2><hr> <p>You make <em>my
heart</em> sing.</p> <hr
><p>You
make <i>everything.</i></p>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<h2>Wild thing</h2>
<hr>
<p>You make <em>my heart</em> sing.</p>
<hr>
<p>You make <i>everything.</i></p>
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
<h2>Wild thing</h2><hr>
<p>You make <em>my heart</em> sing.</p>
<hr><p>You make <i>everything.</i></p>
``````````````````````````````````````````````````

#### [CASE] with `<br>` between leaf blocks

`<br>` tags between leaf blocks, with zero whitespace,
with a space before, and with a space after.

[IN]
``````````````````````````````````````````````````
<h2>Wild
thing</h2><br><p>You make <em>my
heart</em> sing.</p> <br
><p>You
make <i>everything.</i></p><br> <p>Wild thing.</p>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<h2>Wild thing</h2>
<br>
<p>You make <em>my heart</em> sing.</p>
<br>
<p>You make <i>everything.</i></p>
<br>
<p>Wild thing.</p>
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
<h2>Wild thing</h2><br>
<p>You make <em>my heart</em> sing.</p>
<br>
<p>You make <i>everything.</i></p><br>
<p>Wild thing.</p>
``````````````````````````````````````````````````

#### [CASE] all run-on siblings

This is identical to the last case, except that the
closing tag of each leaf block is run-on with the
opening tag of the next leaf.

[IN]
``````````````````````````````````````````````````
<h2>Wild
thing</h2><hr><p>You make <em>my
heart</em> sing.</
p><hr
><p
>You make <i>everything.</i></p>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<h2>Wild thing</h2>
<hr>
<p>You make <em>my heart</em> sing.</p>
<hr>
<p>You make <i>everything.</i></p>
``````````````````````````````````````````````````
[OUT: CONSERVATIVE] stay run-on in CONSERVATIVE mode
``````````````````````````````````````````````````
<h2>Wild thing</h2><hr><p>You make <em>my heart</em> sing.</p><hr><p>You make <i>everything.</i></p>
``````````````````````````````````````````````````

#### [CASE] mixed leaf and anonymous inline block sequences
[IN]
``````````````````````````````````````````````````
<h2>Wild thing</h2>You make<p>my heart
sing.</p> You make <i>everything.</i><hr> Wild
thing, <p>I think <em>I love you</em> But
I</p>wanna know for sure
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<h2>Wild thing</h2>
You make
<p>my heart sing.</p>
You make <i>everything.</i>
<hr>
Wild thing,
<p>I think <em>I love you</em> But I</p>
wanna know for sure
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
<h2>Wild thing</h2>You make<p>my heart sing.</p>
You make <i>everything.</i><hr>
Wild thing,
<p>I think <em>I love you</em> But I</p>wanna know for sure
``````````````````````````````````````````````````


### empty vs space vs newline

#### [CASE] empty leaf block
[IN]
``````````````````````````````````````````````````
Wild<p></p>thing
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Wild
<p></p>
thing
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
Wild<p></p>thing
``````````````````````````````````````````````````

#### [CASE] space leaf block
[IN]
``````````````````````````````````````````````````
Wild<p> </p>thing
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Wild
<p></p>
thing
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
Wild<p> </p>thing
``````````````````````````````````````````````````

#### [CASE] newline leaf block
[IN]
``````````````````````````````````````````````````
Wild<p>
</p>thing
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Wild
<p></p>
thing
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
Wild<p> </p>thing
``````````````````````````````````````````````````




## container blocks

Content within a container appears as indented blocks.


### inline content

#### [CASE] normal container
Inline content collapses to its own, indented line

[IN]
``````````````````````````````````````````````````
<blockquote>
<i>Wild</i>
thing.
</blockquote>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<blockquote>
  <i>Wild</i> thing.
</blockquote>
``````````````````````````````````````````````````

#### [CASE] formattable as leaf
[IN]
``````````````````````````````````````````````````
<li><i>Wild</i> thing.</li>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<li><i>Wild</i> thing.</li>
``````````````````````````````````````````````````

#### [CASE] extraneous whitespace
[IN]
``````````````````````````````````````````````````
<blockquote>

→<i>Wild</i>


thing.  

→→</blockquote>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<blockquote>
  <i>Wild</i> thing.
</blockquote>
``````````````````````````````````````````````````

#### [CASE] sans leading/trailing whitespace
[IN]
``````````````````````````````````````````````````
<blockquote><i>Wild</i> thing.</blockquote>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<blockquote>
  <i>Wild</i> thing.
</blockquote>
``````````````````````````````````````````````````
[OUT: CONSERVATIVE] lack of space between container tags and content preserved
``````````````````````````````````````````````````
<blockquote><i>Wild</i> thing.</blockquote>
``````````````````````````````````````````````````

#### [CASE] `<br>` within normal container

Content after the `<br>` will be indented.

[IN]
``````````````````````````````````````````````````
<blockquote>Wild thing.<br>You make my heart sing.</blockquote>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<blockquote>
  Wild thing.<br>
  You make my heart sing.
</blockquote>
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
<blockquote>Wild thing.<br>
  You make my heart sing.</blockquote>
``````````````````````````````````````````````````


#### [CASE] `<br>` at end of normal container

Content after the `<br>` will be indented.

[IN]
``````````````````````````````````````````````````
<blockquote>Wild thing.<br>You make my heart sing.<br></blockquote>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<blockquote>
  Wild thing.<br>
  You make my heart sing.<br>
</blockquote>
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
<blockquote>Wild thing.<br>
  You make my heart sing.<br>
</blockquote>
``````````````````````````````````````````````````

#### [CASE] `<br>` within container formattable as leaf
[IN]
``````````````````````````````````````````````````
<li><i>Wild</i><br> thing.</li>
``````````````````````````````````````````````````
[OUT] `<br>` cancels leaf formatting
``````````````````````````````````````````````````
<li>
  <i>Wild</i><br>
  thing.
</li>
``````````````````````````````````````````````````
[OUT: CONSERVATIVE] `<br>` cancels leaf formatting
``````````````````````````````````````````````````
<li><i>Wild</i><br>
  thing.</li>
``````````````````````````````````````````````````

#### [CASE] `<br>` at end of container formattable as leaf
[IN]
``````````````````````````````````````````````````
<li><i>Wild</i><br> thing.<br></li>
``````````````````````````````````````````````````
[OUT] `<br>` cancels leaf formatting
``````````````````````````````````````````````````
<li>
  <i>Wild</i><br>
  thing.<br>
</li>
``````````````````````````````````````````````````
[OUT: CONSERVATIVE] `<br>` cancels leaf formatting
``````````````````````````````````````````````````
<li><i>Wild</i><br>
  thing.<br>
</li>
``````````````````````````````````````````````````


### child leaf blocks

#### [CASE] single leaf block
[IN]
``````````````````````````````````````````````````
<li><p>You make my heart sing.</p></li>
``````````````````````````````````````````````````
[OUT] single child still goes on own line
``````````````````````````````````````````````````
<li>
  <p>You make my heart sing.</p>
</li>
``````````````````````````````````````````````````
[OUT: CONSERVATIVE] a lack of space between parent and child tags forces them on same line
``````````````````````````````````````````````````
<li><p>You make my heart sing.</p></li>
``````````````````````````````````````````````````

#### [CASE] sequence of leaf blocks
[IN]
``````````````````````````````````````````````````
Track one: <blockquote><h2>Wild thing</h2>
<p>You make <em>my heart</em> sing.</p><p>You make
everything.</p> <p>Wile thing.</p></blockquote>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Track one:
<blockquote>
  <h2>Wild thing</h2>
  <p>You make <em>my heart</em> sing.</p>
  <p>You make everything.</p>
  <p>Wile thing.</p>
</blockquote>
``````````````````````````````````````````````````
[OUT: CONSERVATIVE] but lack of whitespace must be preserved

Any lack of space between parent and child tags or sibling tags forces them on same line.
This rule is applied independently at each block boundary

``````````````````````````````````````````````````
Track one:
<blockquote><h2>Wild thing</h2>
  <p>You make <em>my heart</em> sing.</p><p>You make everything.</p>
  <p>Wile thing.</p></blockquote>
``````````````````````````````````````````````````

#### [CASE] mixed leaf and anonymous inline blocks

The content of the block quote is the same as for the
*leaf block/mixed leaf and anonymous inline block sequences*
case:

[IN]
``````````````````````````````````````````````````
Lyrics: <blockquote><h2>Wild thing</h2>You 
make <p>my heart
sing.</p> You make <i>everything.</i><hr> Wild
thing,<p>I think <em>I love you</em> But
I</p> wanna know for sure</blockquote>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Lyrics:
<blockquote>
  <h2>Wild thing</h2>
  You make
  <p>my heart sing.</p>
  You make <i>everything.</i>
  <hr>
  Wild thing,
  <p>I think <em>I love you</em> But I</p>
  wanna know for sure
</blockquote>
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]

> ### 🌶 For CONSERVATIVE mode, we might implement length-based line wrapping
> of the block contents for cases where the lack of whitespace between
> child blocks results in excessively long lines.
> Work breaks within child element content provide ample semantics-preserving
> line wrap opportunities.

``````````````````````````````````````````````````
Lyrics:
<blockquote><h2>Wild thing</h2>You make
  <p>my heart sing.</p>
  You make <i>everything.</i><hr>
  Wild thing,<p>I think <em>I love you</em> But I</p>
  wanna know for sure</blockquote>
``````````````````````````````````````````````````

#### [CASE] mixed leaf and anonymous inline blocks with extraneous whitespace

Same as prior case input, but with extraneous whitespace added both
between and withing child blocks.

[IN]
``````````````````````````````````````````````````
Lyrics: <blockquote>

  <h2>Wild thing</h2>    You make <p>my heart
→→sing.</p> You make <i>every

thing.</i> <hr> Wild
thing, → →
→<p>→I think <em>I love you</em> 

But
I </p>    wanna know for sure→→</blockquote>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Lyrics:
<blockquote>
  <h2>Wild thing</h2>
  You make
  <p>my heart sing.</p>
  You make <i>every thing.</i>
  <hr>
  Wild thing,
  <p>I think <em>I love you</em> But I</p>
  wanna know for sure
</blockquote>
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
Lyrics:
<blockquote>
  <h2>Wild thing</h2>
  You make
  <p>my heart sing.</p>
  You make <i>every thing.</i>
  <hr>
  Wild thing,
  <p> I think <em>I love you</em> But I </p>
  wanna know for sure
</blockquote>
``````````````````````````````````````````````````


### container sequences (siblings)

#### [CASE] sequence of container blocks
[IN]
``````````````````````````````````````````````````
<div>Wild thing.</div><div>You make <b>my heart</b>
sing.</div><div><p>You make everything.</p></div>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<div>
  Wild thing.
</div>
<div>
  You make <b>my heart</b> sing.
</div>
<div>
  <p>You make everything.</p>
</div>
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
<div>Wild thing.</div><div>You make <b>my heart</b> sing.</div><div><p>You make everything.</p></div>
``````````````````````````````````````````````````

#### [CASE] sequence of container blocks with extraneous whitespace
[IN]
``````````````````````````````````````````````````
   <div> Wild thing.→</div>   <div>
   You make <b>my 
→heart</b> sing.
</div>→→→<div>     <p>You 

→make everything.</p> 

</div>

``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<div>
  Wild thing.
</div>
<div>
  You make <b>my heart</b> sing.
</div>
<div>
  <p>You make everything.</p>
</div>
``````````````````````````````````````````````````


### nested containers

#### [CASE] nested container
[IN]
``````````````````````````````````````````````````
<blockquote><blockquote>Wild thing.</blockquote></blockquote>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<blockquote>
  <blockquote>
    Wild thing.
  </blockquote>
</blockquote>
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
<blockquote><blockquote>Wild thing.</blockquote></blockquote>
``````````````````````````````````````````````````

#### [CASE] nested container formattable as leaf
[IN]
``````````````````````````````````````````````````
<ol><li>Wild thing.</li></ol>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<ol>
  <li>Wild thing.</li>
</ol>
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
<ol><li>Wild thing.</li></ol>
``````````````````````````````````````````````````

#### [CASE] nested containers sequence
[IN]
``````````````````````````````````````````````````
<ul> <li>get milk</li> <li> <h2>Wild thing.</h2>
You make my heart sing. <p>You make everything.</p>
<hr> <p>Wild thing,</p> <p>I think I love you</p>
But I wanna know for sure </li>
<li><p>do laundry!</p></li> </ul>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<ul>
  <li>get milk</li>
  <li>
    <h2>Wild thing.</h2>
    You make my heart sing.
    <p>You make everything.</p>
    <hr>
    <p>Wild thing,</p>
    <p>I think I love you</p>
    But I wanna know for sure
  </li>
  <li>
    <p>do laundry!</p>
  </li>
</ul>
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
<ul>
  <li>get milk</li>
  <li>
    <h2>Wild thing.</h2>
    You make my heart sing.
    <p>You make everything.</p>
    <hr>
    <p>Wild thing,</p>
    <p>I think I love you</p>
    But I wanna know for sure
  </li>
  <li><p>do laundry!</p></li>
</ul>
``````````````````````````````````````````````````

#### [CASE] each level of deeply nested structure properly indented
[IN]
``````````````````````````````````````````````````
A dream: <blockquote>Within a dream: <ul> <li>
<em>Within</em> a dream: <blockquote> <h2>Wild thing</h2>
<p>You make my heart sing.</p> <p>You make
everything.</p> </blockquote> </li> <li>kick.</li>
</ul> kick.</blockquote> and you're back!
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
A dream:
<blockquote>
  Within a dream:
  <ul>
    <li>
      <em>Within</em> a dream:
      <blockquote>
        <h2>Wild thing</h2>
        <p>You make my heart sing.</p>
        <p>You make everything.</p>
      </blockquote>
    </li>
    <li>kick.</li>
  </ul>
  kick.
</blockquote>
and you're back!
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
A dream:
<blockquote>Within a dream:
  <ul>
    <li>
      <em>Within</em> a dream:
      <blockquote>
        <h2>Wild thing</h2>
        <p>You make my heart sing.</p>
        <p>You make everything.</p>
      </blockquote>
    </li>
    <li>kick.</li>
  </ul>
  kick.</blockquote>
and you're back!
``````````````````````````````````````````````````

#### [CASE] extraneous whitespace within deeply nested elements
[IN]
``````````````````````````````````````````````````
A dream:→<blockquote> Within a dream: <ul> <li>


<em>Within</em> a dream:→→<blockquote> <h2>Wild→thing</h2>
<p>You make my 

heart sing.</p>

→<p>You make
everything.</p> </blockquote> </li> <li>→→kick.→→</li>
</ul>→


→kick. </blockquote> and you're back!
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
A dream:
<blockquote>
  Within a dream:
  <ul>
    <li>
      <em>Within</em> a dream:
      <blockquote>
        <h2>Wild thing</h2>
        <p>You make my heart sing.</p>
        <p>You make everything.</p>
      </blockquote>
    </li>
    <li>kick.</li>
  </ul>
  kick.
</blockquote>
and you're back!
``````````````````````````````````````````````````

#### [CASE] hard line breaks within deeply nested elements

Container content indentation is maintained regardless of
any `<br>`s.

[IN]
``````````````````````````````````````````````````
A dream: <blockquote>Within<br> a dream: <ul> <li>
<em>Within</em> a dream: <blockquote> <h2>Wild<br>thing</h2>
<p>You make my heart sing.</p><br><p>You<br> <u>make<br>
everything.<br></u><br></p><br></blockquote> </li> <li><br><br
>kick.</li> </ul> kick.</blockquote> and you're back!
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
A dream:
<blockquote>
  Within<br>
  a dream:
  <ul>
    <li>
      <em>Within</em> a dream:
      <blockquote>
        <h2>Wild<br>
            thing</h2>
        <p>You make my heart sing.</p>
        <br>
        <p>You<br>
            <u>make<br>
            everything.<br>
            </u><br>
            </p>
        <br>
      </blockquote>
    </li>
    <li>
      <br>
      <br>
      kick.
    </li>
  </ul>
  kick.
</blockquote>
and you're back!
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]

Note how the lack of whitespace after a  `<br>` does not
prevent a line break for a following block element as it
normally does in CONSERVATIVE mode.

``````````````````````````````````````````````````
A dream:
<blockquote>Within<br>
  a dream:
  <ul>
    <li>
      <em>Within</em> a dream:
      <blockquote>
        <h2>Wild<br>
            thing</h2>
        <p>You make my heart sing.</p><br>
        <p>You<br>
            <u>make<br>
            everything.<br>
            </u><br>
            </p><br>
      </blockquote>
    </li>
    <li><br>
      <br>
      kick.</li>
  </ul>
  kick.</blockquote>
and you're back!
``````````````````````````````````````````````````


### empty vs space vs newline

#### [CASE] empty container block
[IN]
``````````````````````````````````````````````````
Wild<blockquote></blockquote>thing
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Wild
<blockquote>
</blockquote>
thing
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
Wild<blockquote></blockquote>thing
``````````````````````````````````````````````````

#### [CASE] single space container block
[IN]
``````````````````````````````````````````````````
Wild<blockquote> </blockquote>thing
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Wild
<blockquote>
</blockquote>
thing
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
Wild<blockquote>
</blockquote>thing
``````````````````````````````````````````````````

#### [CASE] single newline container block
[IN]
``````````````````````````````````````````````````
Wild<blockquote>
</blockquote>thing
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Wild
<blockquote>
</blockquote>
thing
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
Wild<blockquote>
</blockquote>thing
``````````````````````````````````````````````````




## Tables

### [CASE] cells with simple text content

From https://github.com/mdn/learning-area/blob/master/html/tables/basic/dogs-table-fixed.html

[IN]
``````````````````````````````````````````````````
<table>
  <caption>The Beatles</caption>
  <tr>
    <td>John Lennon</td>
    <td>Rhythm Guitar</td>
  </tr>
  <tr>
    <td>Paul McCartney</td>
    <td>Bass</td>
  </tr>
  <tr>
    <td>George Harrison</td>
    <td>Lead Guitar</td>
  </tr>
  <tr>
    <td>Ringo Starr</td>
    <td>Drums</td>
  </tr>
</table>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<table>
  <caption>The Beatles</caption>
  <tr>
    <td>John Lennon</td>
    <td>Rhythm Guitar</td>
  </tr>
  <tr>
    <td>Paul McCartney</td>
    <td>Bass</td>
  </tr>
  <tr>
    <td>George Harrison</td>
    <td>Lead Guitar</td>
  </tr>
  <tr>
    <td>Ringo Starr</td>
    <td>Drums</td>
  </tr>
</table>
``````````````````````````````````````````````````

### [CASE] cells with inline content

[IN]
``````````````````````````````````````````````````
<table>
  <tr>
    <td>chorus</td>
    <td>
    
    Wild thing<br>
You make my heart sing<br>
You make everything groovy<br>
Wild thing
    
    </td>
  </tr>
  
  <tr>
    <td>verse 1</td>
    <td>
    
Wild thing, I think I love you<br>
But I wanna know for sure<br>
Come on, hold me tight<br>
I love you
    
    </td>
  </tr>
  
  
  <tr>
    <td>verse 2</td>
    <td>
    
Wild thing, I think you move me<br>
But I wanna know for sure<br>
So come on and hold me tight<br>
You move me
    
    </td>
  </tr>
  
  
</table>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<table>
  <tr>
    <td>chorus</td>
    <td>
      Wild thing<br>
      You make my heart sing<br>
      You make everything groovy<br>
      Wild thing
    </td>
  </tr>
  <tr>
    <td>verse 1</td>
    <td>
      Wild thing, I think I love you<br>
      But I wanna know for sure<br>
      Come on, hold me tight<br>
      I love you
    </td>
  </tr>
  <tr>
    <td>verse 2</td>
    <td>
      Wild thing, I think you move me<br>
      But I wanna know for sure<br>
      So come on and hold me tight<br>
      You move me
    </td>
  </tr>
</table>
``````````````````````````````````````````````````

### [CASE] cells with block content

[IN]
``````````````````````````````````````````````````
<table>

<tr>
<th>The Troggs</th>
<th>Jimi Hendrix</th>
</tr>

  <tr>
    <td>
    
    <h3>chorus</h3>  
  <p>
    Wild thing<br>
You make my heart sing<br>
You make everything groovy<br>
Wild thing</p>

<h3>verse 1</h3>  
  <p>
Wild thing, I think I love you<br>
But I wanna know for sure<br>
Come on, hold me tight<br>
I love you</p>

<h3>chorus</h3>  
  <p>
    Wild thing<br>
You make my heart sing<br>
You make everything groovy<br>
Wild thing</p>

<h3>verse 2</h3>  
  <p>
Wild thing, I think you move me<br>
But I wanna know for sure<br>
So come on and hold me tight<br>
You move me</p>

<h3>chorus</h3>  
  <p>
    Wild thing<br>
You make my heart sing<br>
You make everything groovy<br>
Wild thing<br>
Oh, come on, wild thing<br>
Check it, check it, wild thing</p>
    
    </td>

    <td>
    
    <h3>intro</h3>  
  <p>
    Come on man sing it with me</p>

<h3>verse 1</h3>  
  <p>
Wild thing, you make my heart sing<br>
Oh<br>
You make a everything, groovy<br>
Wild thing<br>
Wild thing I think you move me<br>
But I want a know for sure<br>
Come on and ssssssock it to me one more time<br>
You move me</p>

<h3>verse 2</h3>  
  <p>
Wild thing, you make my heart sing<br>
Oh<br>
You make a everything, groovy<br>
A sing again<br>
Wild thing<br>
Yeah<br>
Wild thing I think you move me<br>
But I want a know for sure<br>
Come on and ssssssock it to me one more time again<br>
Oh shucks I love ya</p>

<h3>verse 3</h3>  
  <p>
Wild thing, you make my heart sing<br>
You make a everything, groovy<br>
Yeah wild thing<br>
Yeah wild thing<br>
Yeah yeah wild thing<br>
Yeah yeah yeah wild thing</p>
    
    
    
  
    
    </td>
  </tr>
  
  
</table>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<table>
  <tr>
    <th>The Troggs</th>
    <th>Jimi Hendrix</th>
  </tr>
  <tr>
    <td>
      <h3>chorus</h3>
      <p>Wild thing<br>
          You make my heart sing<br>
          You make everything groovy<br>
          Wild thing</p>
      <h3>verse 1</h3>
      <p>Wild thing, I think I love you<br>
          But I wanna know for sure<br>
          Come on, hold me tight<br>
          I love you</p>
      <h3>chorus</h3>
      <p>Wild thing<br>
          You make my heart sing<br>
          You make everything groovy<br>
          Wild thing</p>
      <h3>verse 2</h3>
      <p>Wild thing, I think you move me<br>
          But I wanna know for sure<br>
          So come on and hold me tight<br>
          You move me</p>
      <h3>chorus</h3>
      <p>Wild thing<br>
          You make my heart sing<br>
          You make everything groovy<br>
          Wild thing<br>
          Oh, come on, wild thing<br>
          Check it, check it, wild thing</p>
    </td>
    <td>
      <h3>intro</h3>
      <p>Come on man sing it with me</p>
      <h3>verse 1</h3>
      <p>Wild thing, you make my heart sing<br>
          Oh<br>
          You make a everything, groovy<br>
          Wild thing<br>
          Wild thing I think you move me<br>
          But I want a know for sure<br>
          Come on and ssssssock it to me one more time<br>
          You move me</p>
      <h3>verse 2</h3>
      <p>Wild thing, you make my heart sing<br>
          Oh<br>
          You make a everything, groovy<br>
          A sing again<br>
          Wild thing<br>
          Yeah<br>
          Wild thing I think you move me<br>
          But I want a know for sure<br>
          Come on and ssssssock it to me one more time again<br>
          Oh shucks I love ya</p>
      <h3>verse 3</h3>
      <p>Wild thing, you make my heart sing<br>
          You make a everything, groovy<br>
          Yeah wild thing<br>
          Yeah wild thing<br>
          Yeah yeah wild thing<br>
          Yeah yeah yeah wild thing</p>
    </td>
  </tr>
</table>
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
<table>
  <tr>
    <th>The Troggs</th>
    <th>Jimi Hendrix</th>
  </tr>
  <tr>
    <td>
      <h3>chorus</h3>
      <p> Wild thing<br>
          You make my heart sing<br>
          You make everything groovy<br>
          Wild thing</p>
      <h3>verse 1</h3>
      <p> Wild thing, I think I love you<br>
          But I wanna know for sure<br>
          Come on, hold me tight<br>
          I love you</p>
      <h3>chorus</h3>
      <p> Wild thing<br>
          You make my heart sing<br>
          You make everything groovy<br>
          Wild thing</p>
      <h3>verse 2</h3>
      <p> Wild thing, I think you move me<br>
          But I wanna know for sure<br>
          So come on and hold me tight<br>
          You move me</p>
      <h3>chorus</h3>
      <p> Wild thing<br>
          You make my heart sing<br>
          You make everything groovy<br>
          Wild thing<br>
          Oh, come on, wild thing<br>
          Check it, check it, wild thing</p>
    </td>
    <td>
      <h3>intro</h3>
      <p> Come on man sing it with me</p>
      <h3>verse 1</h3>
      <p> Wild thing, you make my heart sing<br>
          Oh<br>
          You make a everything, groovy<br>
          Wild thing<br>
          Wild thing I think you move me<br>
          But I want a know for sure<br>
          Come on and ssssssock it to me one more time<br>
          You move me</p>
      <h3>verse 2</h3>
      <p> Wild thing, you make my heart sing<br>
          Oh<br>
          You make a everything, groovy<br>
          A sing again<br>
          Wild thing<br>
          Yeah<br>
          Wild thing I think you move me<br>
          But I want a know for sure<br>
          Come on and ssssssock it to me one more time again<br>
          Oh shucks I love ya</p>
      <h3>verse 3</h3>
      <p> Wild thing, you make my heart sing<br>
          You make a everything, groovy<br>
          Yeah wild thing<br>
          Yeah wild thing<br>
          Yeah yeah wild thing<br>
          Yeah yeah yeah wild thing</p>
    </td>
  </tr>
</table>
``````````````````````````````````````````````````




## PRE blocks


### stand-alone `<pre>`

#### [CASE] simple text with extra spaces, tabs and newlines
[IN]
``````````````````````````````````````````````````
<pre> → See    how  

→→


 wild?  →</pre>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<pre> → See    how  

→→


 wild?  →</pre>
``````````````````````````````````````````````````

#### [CASE] closing `</pre>` on own line
[IN]
``````````````````````````````````````````````````
<pre> → See    how  

→→


 wild?  →
</pre>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<pre> → See    how  

→→


 wild?  →
</pre>
``````````````````````````````````````````````````


### nested PRE blocks

> ### 🚩 Should PRE preserve extraneous whitespace between block elements?
> I'm pretty sure pure whitespace between block elements is NOT treated as inline
> content, in which case PRE wouldn't apply. But for now, to play it safe,
> `htmlnorm` will assume it is treated as inline text, and will preserve said
> whitespace.
> 
> If this is wrong, please submit an issue.

#### [CASE] nested `<pre>` with whitespace before and after
[IN]
``````````````````````````````````````````````````
<blockquote> →

 <pre> → See    how  


 wild?  →</pre> →   </blockquote>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<blockquote>
<pre> → See    how  


 wild?  →</pre>
</blockquote>
``````````````````````````````````````````````````

#### [CASE] deeply nested
[IN]
``````````````````````````````````````````````````
<blockquote><blockquote>
<blockquote><pre> → See    how  

→→


 wild?  →
</pre></blockquote>
</blockquote></blockquote>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<blockquote>
  <blockquote>
    <blockquote>
<pre> → See    how  

→→


 wild?  →
</pre>
    </blockquote>
  </blockquote>
</blockquote>
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
<blockquote><blockquote>
    <blockquote><pre> → See    how  

→→


 wild?  →
</pre></blockquote>
  </blockquote></blockquote>
``````````````````````````````````````````````````

#### [CASE] deeply nested with siblings blocks
[IN]
``````````````````````````````````````````````````
<blockquote>
<blockquote>
<blockquote>
Some extraneous   whitespace 
→outside this PRE block:  <pre> → See    how  

→→


 wild?  →
</pre>
<p>back 

→→to 

normal.

</p>
</blockquote>
</blockquote>
</blockquote>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<blockquote>
  <blockquote>
    <blockquote>
      Some extraneous whitespace outside this PRE block:
<pre> → See    how  

→→


 wild?  →
</pre>
      <p>back to normal.</p>
    </blockquote>
  </blockquote>
</blockquote>
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
<blockquote>
  <blockquote>
    <blockquote>
      Some extraneous whitespace outside this PRE block:
<pre> → See    how  

→→


 wild?  →
</pre>
      <p>back to normal. </p>
    </blockquote>
  </blockquote>
</blockquote>
``````````````````````````````````````````````````

### elements nested within `<pre>`

Do not change whitespace *of text content* within indented `<pre>` container
or its children.

#### [CASE] nested within standalone `<pre>`
[IN]
``````````````````````````````````````````````````
  Start→of →
wild
   lyrics: <pre> →
<blockquote><ul>
    <li>
Wild thing,<p>I→
   think →I love you</p>
      </li>
→

<li>    But I wanna know for sure     </li>
  </ul>
</blockquote></pre> End→of →
wild
   lyrics.
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
Start of wild lyrics:
<pre> →
<blockquote><ul>
    <li>
Wild thing,<p>I→
   think →I love you</p>
      </li>
→

<li>    But I wanna know for sure     </li>
  </ul>
</blockquote></pre>
End of wild lyrics.
``````````````````````````````````````````````````

#### [CASE] nested within nested `<pre>`

[IN]
``````````````````````````````````````````````````
<blockquote> →

  Start→of →
wild
   lyrics: <pre> →
<blockquote><ul>
    <li>
Wild thing,<p>I→
   think →I love you</p>
      </li>
→

<li>    But I wanna know for sure     </li>
  </ul>
</blockquote></pre> End→of →
wild
   lyrics. →   </blockquote>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<blockquote>
  Start of wild lyrics:
<pre> →
<blockquote><ul>
    <li>
Wild thing,<p>I→
   think →I love you</p>
      </li>
→

<li>    But I wanna know for sure     </li>
  </ul>
</blockquote></pre>
  End of wild lyrics.
</blockquote>
``````````````````````````````````````````````````

#### [CASE] nested within `<pre>` nested within `<pre>`

PRE formatting rules are in effect as determined 
by the outer `<pre>` block, i.e. it should not be
affected by whether there are nested `<pre>`
blocks, and should not revert to non-PRE rules when
a nested `<pre>` block closes.

[IN]
``````````````````````````````````````````````````
True start→of →
wild:
<pre>
<blockquote> →

  Start→of →
wild
   lyrics: <pre> →
<blockquote><ul>
    <li>
Wild thing,<p>I→
   think →I love you</p>
      </li>
→

<li>    But I wanna know for sure     </li>
  </ul>
</blockquote></pre> End→of →
wild
   lyrics. →   </blockquote>
</pre>
True end→of →
wild.
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
True start of wild:
<pre>
<blockquote> →

  Start→of →
wild
   lyrics: <pre> →
<blockquote><ul>
    <li>
Wild thing,<p>I→
   think →I love you</p>
      </li>
→

<li>    But I wanna know for sure     </li>
  </ul>
</blockquote></pre> End→of →
wild
   lyrics. →   </blockquote>
</pre>
True end of wild.
``````````````````````````````````````````````````

#### [CASE] tag and attribute normalization within `<pre>`
[IN]
``````````````````````````````````````````````````
  Start→of →
wild
   lyrics: <pre> →
<blockquote  ><ul>
    <li
>
Wild thing,<p verse=1 class='verse lyrics' >I→
   think →I love you</p>
      </li>
→

<li>    But I wanna know for sure     </li>
  </ul>
</blockquote></pre> End→of →
wild
   lyrics.
``````````````````````````````````````````````````
[OUT] `<pre>` must not affect tag and attribute normalization
``````````````````````````````````````````````````
Start of wild lyrics:
<pre> →
<blockquote><ul>
    <li>
Wild thing,<p class="lyrics verse" verse="1">I→
   think →I love you</p>
      </li>
→

<li>    But I wanna know for sure     </li>
  </ul>
</blockquote></pre>
End of wild lyrics.
``````````````````````````````````````````````````


### empty vs space vs newline

#### [CASE] empty `<pre>`
[IN]
``````````````````````````````````````````````````
<pre></pre>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<pre></pre>
``````````````````````````````````````````````````

#### [CASE] single space `<pre>`
[IN]
``````````````````````````````````````````````````
<pre> </pre>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<pre> </pre>
``````````````````````````````````````````````````

#### [CASE] single newline `<pre>`

> ## 🚩 this test caught a flaw in a sax parser 
> that used by an earlier implementation. It ignored
> this single newline.

[IN]
``````````````````````````````````````````````````
<pre>
</pre>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<pre>
</pre>
``````````````````````````````````````````````````




## unknown elements


### [CASE] unknown tags in simple text

By default, CSS treats unknown tags as inline.

[IN]
``````````````````````````````````````````````````
a
<wild>thing</wild>
makes my
<song beat="joyful">heart</song>.
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
a <wild>thing</wild> makes my <song beat="joyful">heart</song>.
``````````````````````````````````````````````````

### [CASE] unknown tags within a leaf block
[IN]
``````````````````````````````````````````````````
<p>Wild thing.
<person>You</person> make
my <organ>heart</organ> sing.</p>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<p>Wild thing. <person>You</person> make my <organ>heart</organ> sing.</p>
``````````````````````````````````````````````````

### [CASE] unknown tags within a container block
[IN]
``````````````````````````````````````````````````
<blockquote> Wild thing.
<person>You</person> make
my <p><organ>heart</organ> sing.</p> </blockquote>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<blockquote>
  Wild thing. <person>You</person> make my
  <p><organ>heart</organ> sing.</p>
</blockquote>
``````````````````````````````````````````````````




## complete HTML docs

Up to here, cases have been HTML fragments. Here we'll do full HTML docs.


### [CASE] simplest complete doc

[IN]
``````````````````````````````````````````````````
<!DOCTYPE html>
<html>
<title>The Title</title>
<body>
Hello world
</body>
</html>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<!DOCTYPE html>
<html>
  <title>The Title</title>
  <body>
    Hello world
  </body>
</html>
``````````````````````````````````````````````````

### [CASE] doc with head

[IN]

from https://www.webfx.com/blog/images/assets/cdn.sixrevisions.com/0435-01_html5_download_attribute_demo/samp/htmldoc.html

``````````````````````````````````````````````````
<!DOCTYPE html>
<html>
<head>
<title>A Sample HTML Document (Test File)</title>
<meta charset="utf-8">
<meta name="description" content="A blank HTML document for testing purposes.">
<meta name="author" content="Six Revisions">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="http://sixrevisions.com/favicon.ico" type="image/x-icon" />
</head>
<body>
  
<h1>A Sample HTML Document (Test File)</h1>
<p>A blank HTML document for testing purposes.</p>
<p><a href="../html5download-demo.html">Go back to the demo</a></p>
<p><a href="http://sixrevisions.com/html5/download-attribute/">Read the HTML5 download attribute guide</a></p>

</body>
</html>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<!DOCTYPE html>
<html>
  <head>
    <title>A Sample HTML Document (Test File)</title>
    <meta charset="utf-8">
    <meta content="A blank HTML document for testing purposes." name="description">
    <meta content="Six Revisions" name="author">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <link href="http://sixrevisions.com/favicon.ico" rel="icon" type="image/x-icon">
  </head>
  <body>
    <h1>A Sample HTML Document (Test File)</h1>
    <p>A blank HTML document for testing purposes.</p>
    <p><a href="../html5download-demo.html">Go back to the demo</a></p>
    <p><a href="http://sixrevisions.com/html5/download-attribute/">Read the HTML5 download attribute guide</a></p>
  </body>
</html>
``````````````````````````````````````````````````




## unclosed elements

Inlines are never implicitly closed, even when the parent
leaf or container block in which it opened closes. This
mimics browser behavior.

[//]: # (todo: apparently, htmlparser2 doesn't agree with Safari.
          The case below reflect htmlparser2's behavior, not 
          Safari's. Not sure how Firefox or Chrome handle this,
          THOUGH I SHOULD FIGURE OUT WHAT THE SPEC SAYS.
          Then do one of the following:
           - log a bug with htmlparser2
           - code some workarounds to htmlparser2's non-spec behavior.
           - accept that Safari doesn't follow spec.)

### unclosed inlines

#### [CASE] with no trailing whitespace
inline tag forced close by outer inline

[IN]
``````````````````````````````````````````````````
<i>Italic. <u>Underlined.</i> Now what?
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<i>Italic. <u>Underlined.</i> Now what?
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE]
``````````````````````````````````````````````````
<i>Italic. <u>Underlined.</u></i> Now what?
``````````````````````````````````````````````````

#### [CASE] with trailing whitespace

So where should an inserted closing tag go relative to the
whitespace? Before or after? If the source explicitly closed
the element, it would of course make that decision.

`htmlnorm` will make insert the tag so that the contents
are wrapped *tightly*, as that is by far the most likely
intent.

[IN]
``````````````````````````````````````````````````
<i>Italic. <u>Underlined.
</i> Now what?
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<i>Italic. <u>Underlined. </i> Now what?
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE]
``````````````````````````````````````````````````
<i>Italic. <u>Underlined.</u> </i> Now what?
``````````````````````````````````````````````````

#### [CASE] intersecting block boundaries

Nested inline forced closed by parent container (see question
above about whether this is correct). Outer inline
remains open across both the open and close of the 
container.

[IN]
``````````````````````````````````````````````````
<i>Italic.
<blockquote>
  <u>Underlined.
</blockquote>
Now what?
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<i>Italic.
<blockquote>
  <u>Underlined.
</blockquote>
Now what?
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE]
``````````````````````````````````````````````````
<i>Italic.
<blockquote>
  <u>Underlined.</u>
</blockquote>
Now what?</i>
``````````````````````````````````````````````````

#### [CASE] intersecting block boundaries, no whitespace
[IN]
``````````````````````````````````````````````````
<i>Italic.<blockquote><u>Underlined.</blockquote>Now what?
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<i>Italic.
<blockquote>
  <u>Underlined.
</blockquote>
Now what?
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE]
``````````````````````````````````````````````````
<i>Italic.
<blockquote>
  <u>Underlined.</u>
</blockquote>
Now what?</i>
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
<i>Italic.<blockquote><u>Underlined.</blockquote>Now what?
``````````````````````````````````````````````````
[OUT: CONSERVATIVE, EXPLICIT_CLOSE]
``````````````````````````````````````````````````
<i>Italic.<blockquote><u>Underlined.</u></blockquote>Now what?</i>
``````````````````````````````````````````````````

#### [CASE] followed by `<br>`
[IN]
``````````````````````````````````````````````````
<i>Italic.<br>
<blockquote>
  <u>Underlined.<br>
</blockquote>
Now what?<br>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<i>Italic.<br>
<blockquote>
  <u>Underlined.<br>
</blockquote>
Now what?<br>
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE]
``````````````````````````````````````````````````
<i>Italic.<br>
<blockquote>
  <u>Underlined.<br>
  </u>
</blockquote>
Now what?<br>
</i>
``````````````````````````````````````````````````

#### [CASE] unclosed cascade

Notice how in the rendered form of the unaltered IN value,
the browser will include a tailing space after "Quote."
within the resulting quotation marks. This is another 
confirmation of how leading and trailing whitespace within
and between inline elements can be significant.

[//]: # (todo consider using this example in the `browser-whitespace-study`,
          and linking to it here.)

[//]: # (todo![now] based on the browser rendering of the implied closings,
          the explicit closing logic of htmlnorm is INCORRECT!  I need to 
          confirm this by installing Firefox and see how it renders all of these.
          .
          THE ACTUAL logic appears to be to insert then implied tag exactly where
          it is triggered, where htmlnorm generates and event for it, and all my
          logic to "don't pop traiing whitespace" is wrong.
          .
          ANOTHER THING THAT'S REALLY INTERESTING: the browser only put the 
          implied close of the Q tag inside the parent blockquote, not the B
          or S elements, even though all start within the blockquote, even 
          though one starts before and one after the Q element. So:
          - WRT Q, htmlparser2 is correct.
          - WRT to B and S, and probably I and U, htmlparser2 is incorrect.
          - If htmlparser2 does not fix this, I may have to hack it myself,
            making a list of the two classes of inlines and how they auto-close,
            much like htmlparser2 already does for blocks.)


[IN]
``````````````````````````````````````````````````
<i>Italic.
<u>Underlined.
<blockquote>
<b>Bold.
<q>Quote.
<s>Strike.
</blockquote>
Confused.
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<i>Italic. <u>Underlined.
<blockquote>
  <b>Bold. <q>Quote. <s>Strike.
</blockquote>
Confused.
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE]
``````````````````````````````````````````````````
<i>Italic. <u>Underlined.
<blockquote>
  <b>Bold. <q>Quote. <s>Strike.</s></q></b>
</blockquote>
Confused.</u></i>
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE, CONSERVATIVE]
``````````````````````````````````````````````````
<i>Italic. <u>Underlined.
<blockquote>
  <b>Bold. <q>Quote. <s>Strike.</s></q></b>
</blockquote>
Confused.</u></i>
``````````````````````````````````````````````````

#### [CASE] unclosed interleaved

[//]: # (todo: here, htmlparser2 forces q, b, blockquote and u to 
          close between "Quote." and the explicit `</i>`, since they all 
          opened within the i element. This runs counter to the browser
          rendering immensely: the b, blockquote and u are not auto-closed,
          only the q is.
          .
          Possible rules:
          - "formatting" inlines like i, b, s, u and u, are never implicitly closed.
          - "container" inlines are implicitly closed, by both parent inlines or
            containers.
          - HTML5 elements are closed according to HTML5 rules, otherwise they are
            closed by the next rule...
          - block elements are only closed by parent containers [need to check])

[IN]
``````````````````````````````````````````````````
<i>Italic.
<u>Underlined.
<blockquote>
<b>Bold.
<q>Quote.</i>
<s>Strike</b> out.</u>
</blockquote>
Confused.
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<i>Italic. <u>Underlined.
<blockquote>
  <b>Bold. <q>Quote.</i> <s>Strike</b> out.</u>
</blockquote>
Confused.
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE]
``````````````````````````````````````````````````
<i>Italic. <u>Underlined.
<blockquote>
  <b>Bold. <q>Quote.</i> <s>Strike</b> out.</u></s></q>
</blockquote>
Confused.</u>
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE, CONSERVATIVE]
``````````````````````````````````````````````````
<i>Italic. <u>Underlined.
<blockquote>
  <b>Bold. <q>Quote.</i> <s>Strike</b> out.</u></s></q>
</blockquote>
Confused.</u>
``````````````````````````````````````````````````

#### [CASE] interleaved OLD

Inlines are not even implicitly closed when interleaved. In effect,
they open and close independently. This mimics browser behavior.

[//]: # (todo: ok i lie. the implementation and the test spec below
          reflect what htmlparser2 does, not browsers. Pending 
          discussion with htmlparser2's author.)

[IN]
``````````````````````````````````````````````````
<p>plain<br>
<i>italic<br>
<u>italic underline<br>
<b>italic underline bold<br>
</u>
italic<br>
</p>
plain<br>
</i>
end
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<p>plain<br>
    <i>italic<br>
    <u>italic underline<br>
    <b>italic underline bold<br>
    </u> italic<br>
    </p>
plain<br>
end
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE] same behavior for `as-is`, `explicit` and `html5 implicit`
``````````````````````````````````````````````````
<p>plain<br>
    <i>italic<br>
    <u>italic underline<br>
    <b>italic underline bold<br>
    </b></u> italic<br>
    </i></p>
plain<br>
end
``````````````````````````````````````````````````

#### [CASE] unclosed inlines within closed inline
[IN]
``````````````````````````````````````````````````
<i>Italic.
<u>Underlined.
<q>Quote.
<b>Bold.
</i>
Confused.
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<i>Italic. <u>Underlined. <q>Quote. <b>Bold. </i> Confused.
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE]
``````````````````````````````````````````````````
<i>Italic. <u>Underlined. <q>Quote. <b>Bold.</b></q></u> </i> Confused.
``````````````````````````````````````````````````

#### [CASE] unclosed inlines with trailing `<br>` within closed inline
[IN]
``````````````````````````````````````````````````
<i>Italic.
<u>Underlined.
<q>Quote.
<b>Bold.<br>
</i>
Confused.
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<i>Italic. <u>Underlined. <q>Quote. <b>Bold.<br>
</i> Confused.
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE]
``````````````````````````````````````````````````
<i>Italic. <u>Underlined. <q>Quote. <b>Bold.<br>
</b></q></u></i> Confused.
``````````````````````````````````````````````````


### HTML5 implicitly closed blocks

per https://html.spec.whatwg.org/#syntax-tag-omission

#### [CASE] leaf blocks

Closing tags for `p` elements are optional for HTML5.

[IN]
``````````````````````````````````````````````````
<p>paragraph 1 <p>paragraph 2</p> <p>paragraph 3
``````````````````````````````````````````````````
[OUT] default 'as-is' behavior
``````````````````````````````````````````````````
<p>paragraph 1
<p>paragraph 2</p>
<p>paragraph 3
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE]
``````````````````````````````````````````````````
<p>paragraph 1</p>
<p>paragraph 2</p>
<p>paragraph 3</p>
``````````````````````````````````````````````````
[OUT(disabled): HTML5_IMPLICIT_CLOSE]
``````````````````````````````````````````````````
<p>paragraph 1
<p>paragraph 2
<p>paragraph 3
``````````````````````````````````````````````````

#### [CASE] leaf blocks with and without trailing whitespace
> ### 🚩 CONSERVATIVE whitespace mode and implicit closing tags
> The implicit closing tag will be "inserted" immediately after the
> last non-whitespace character of the element. The space between 
> `paragraph 1` and the following `<p>` will be treated as whitespace
> between the elements. This allows a line break between those 
> elements for HTML formatting purposes.

[IN]
``````````````````````````````````````````````````
<p>paragraph 1 <p>paragraph 2<p>paragraph 3
``````````````````````````````````````````````````
[OUT] default 'as-is' behavior
``````````````````````````````````````````````````
<p>paragraph 1
<p>paragraph 2
<p>paragraph 3
``````````````````````````````````````````````````
[OUT: CONSERVATIVE] 
``````````````````````````````````````````````````
<p>paragraph 1
<p>paragraph 2<p>paragraph 3
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE]
``````````````````````````````````````````````````
<p>paragraph 1</p>
<p>paragraph 2</p>
<p>paragraph 3</p>
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE, CONSERVATIVE]
``````````````````````````````````````````````````
<p>paragraph 1</p>
<p>paragraph 2</p><p>paragraph 3</p>
``````````````````````````````````````````````````

#### [CASE] container block
[IN]
``````````````````````````````````````````````````
The ending of *The Castle* by Franz Kafka:
<blockquote>
She held out her trembling hand to K. and had him sit
down beside her, she spoke with great difficulty, it
was difficult to understand her, but what she said
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
The ending of *The Castle* by Franz Kafka:
<blockquote>
  She held out her trembling hand to K. and had him sit down beside her, she spoke with great difficulty, it was difficult to understand her, but what she said
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE]
``````````````````````````````````````````````````
The ending of *The Castle* by Franz Kafka:
<blockquote>
  She held out her trembling hand to K. and had him sit down beside her, she spoke with great difficulty, it was difficult to understand her, but what she said
</blockquote>
``````````````````````````````````````````````````

#### [CASE] unclosed container and contained inline
[IN]
``````````````````````````````````````````````````
<blockquote>
  <u>italic
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<blockquote>
  <u>italic
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE]
``````````````````````````````````````````````````
<blockquote>
  <u>italic</u>
</blockquote>
``````````````````````````````````````````````````

#### [CASE] sequence of container blocks, some unclosed

Closing tags for `li` elements are optional for HTML5.

[IN]
``````````````````````````````````````````````````
<ol>
<li>list item 1 <li>list item 2</li> <li>list item 3
</ol>
``````````````````````````````````````````````````
[OUT] default 'as-is' behavior
``````````````````````````````````````````````````
<ol>
  <li>list item 1
  <li>list item 2</li>
  <li>list item 3
</ol>
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE]
``````````````````````````````````````````````````
<ol>
  <li>list item 1</li>
  <li>list item 2</li>
  <li>list item 3</li>
</ol>
``````````````````````````````````````````````````
[OUT(disabled): HTML5_IMPLICIT_CLOSE]
``````````````````````````````````````````````````
<ol>
  <li>list item 1
  <li>list item 2
  <li>list item 3
</ol>
``````````````````````````````````````````````````

#### [CASE] sequence of unclosed container blocks, with and without trailing whitespace

[IN]
``````````````````````````````````````````````````
<ol><li>list item 1 <li>list item 2<li>list item 3</ol>
``````````````````````````````````````````````````
[OUT] default 'as-is' behavior
``````````````````````````````````````````````````
<ol>
  <li>list item 1
  <li>list item 2
  <li>list item 3
</ol>
``````````````````````````````````````````````````
[OUT: CONSERVATIVE] 
``````````````````````````````````````````````````
<ol><li>list item 1
  <li>list item 2<li>list item 3</ol>
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE]
``````````````````````````````````````````````````
<ol>
  <li>list item 1</li>
  <li>list item 2</li>
  <li>list item 3</li>
</ol>
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE, CONSERVATIVE]
``````````````````````````````````````````````````
<ol><li>list item 1</li>
  <li>list item 2</li><li>list item 3</li></ol>
``````````````````````````````````````````````````


### blocks with NON-optional closing tag

#### [CASE] unclosed leaf block

Closing tags for `h3` elements are NOT optional for HTML5.

[IN]
``````````````````````````````````````````````````
<h3>heading
text
``````````````````````````````````````````````````
[OUT] default 'as-is' behavior
``````````````````````````````````````````````````
<h3>heading text
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE] mimics browser handling of "tag soup"
``````````````````````````````````````````````````
<h3>heading text</h3>
``````````````````````````````````````````````````
[OUT(disabled): HTML5_IMPLICIT_CLOSE] heading close tags are NOT optional in HTML5

> ## 🚩 not sure about these cases
> does `html5 implicit` behave like `as-is` or like `explicit`
> for elements with non-optional closing tags?
>
> Choose the option that makes more sense to reliable testing

``````````````````````````````````````````````````
<h3>heading text
``````````````````````````````````````````````````

#### [CASE] unclosed leaf block, followed by other blocks

The heading turns into a container, consuming the following
blocks. This mimics browser behavior.

[IN]
``````````````````````````````````````````````````
<h3>heading
<p>paragraph 1
<p>paragraph 2</p>
text
``````````````````````````````````````````````````
[OUT] default 'as-is' behavior
``````````````````````````````````````````````````
<h3>
  heading
  <p>paragraph 1
  <p>paragraph 2</p>
  text
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
<h3>heading
  <p>paragraph 1
  <p>paragraph 2</p>
  text
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE] mimics browser handling of "tag soup"
``````````````````````````````````````````````````
<h3>
  heading
  <p>paragraph 1</p>
  <p>paragraph 2</p>
  text
</h3>
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE, CONSERVATIVE]
``````````````````````````````````````````````````
<h3>heading
  <p>paragraph 1</p>
  <p>paragraph 2</p>
  text</h3>
``````````````````````````````````````````````````
[OUT(disabled): HTML5_IMPLICIT_CLOSE] heading close tags are NOT optional in HTML5
``````````````````````````````````````````````````
<h3>
  heading
  <p>paragraph 1
  <p>paragraph 2</p>
  text
``````````````````````````````````````````````````

#### [CASE] unclosed leaf block, closed by parent container
[IN]
``````````````````````````````````````````````````
<blockquote>
<h3>heading
text
</blockquote>
text
``````````````````````````````````````````````````
[OUT] default 'as-is' behavior
``````````````````````````````````````````````````
<blockquote>
  <h3>heading text
</blockquote>
text
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE] mimics browser handling of "tag soup"
``````````````````````````````````````````````````
<blockquote>
  <h3>heading text</h3>
</blockquote>
text
``````````````````````````````````````````````````
[OUT(disabled): HTML5_IMPLICIT_CLOSE] heading close tags are NOT optional in HTML5
``````````````````````````````````````````````````
<blockquote>
  <h3>heading text
</blockquote>
text
``````````````````````````````````````````````````

#### [CASE] unclosed leaf block, followed by more blocks then close of parent
[IN]
``````````````````````````````````````````````````
<blockquote>
<h3>heading <p>paragraph 1 <p>paragraph 2</p>
</blockquote>
text
``````````````````````````````````````````````````
[OUT] default 'as-is' behavior
``````````````````````````````````````````````````
<blockquote>
  <h3>
    heading
    <p>paragraph 1
    <p>paragraph 2</p>
</blockquote>
text
``````````````````````````````````````````````````
[OUT: CONSERVATIVE]
``````````````````````````````````````````````````
<blockquote>
  <h3>heading
    <p>paragraph 1
    <p>paragraph 2</p>
</blockquote>
text
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE] mimics browser handling of "tag soup"
``````````````````````````````````````````````````
<blockquote>
  <h3>
    heading
    <p>paragraph 1</p>
    <p>paragraph 2</p>
  </h3>
</blockquote>
text
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE, CONSERVATIVE]
``````````````````````````````````````````````````
<blockquote>
  <h3>heading
    <p>paragraph 1</p>
    <p>paragraph 2</p></h3>
</blockquote>
text
``````````````````````````````````````````````````
[OUT(disabled): HTML5_IMPLICIT_CLOSE] heading close tags are NOT optional in HTML5

> ## 🚩 not sure about this case
> does `html5 implicit` behave like `as-is` or like `explicit`
> for elements with non-optional closing tags?
>
> Choose the option that makes more sense to reliable testing

``````````````````````````````````````````````````
<blockquote>
  <h3>
    heading
    <p>paragraph 1
    <p>paragraph 2
</blockquote>
text
``````````````````````````````````````````````````

#### [CASE] unclosed leaf block, with `<br>`s

In a blockquote container to make sure spurious newline
isn't added between the heading and the closing `</blockquote>`

[IN]
``````````````````````````````````````````````````
<blockquote>
<h3>heading<br>
text<br>
</blockquote>
text
``````````````````````````````````````````````````
[OUT] default 'as-is' behavior
``````````````````````````````````````````````````
<blockquote>
  <h3>heading<br>
      text<br>
</blockquote>
text
``````````````````````````````````````````````````
[OUT: EXPLICIT_CLOSE] mimics browser handling of "tag soup"
``````````````````````````````````````````````````
<blockquote>
  <h3>heading<br>
      text<br>
      </h3>
</blockquote>
text
``````````````````````````````````````````````````
[OUT(disabled): HTML5_IMPLICIT_CLOSE] heading close tags are NOT optional in HTML5
``````````````````````````````````````````````````
<blockquote>
  <h3>heading<br>
      text<br>
</blockquote>
text
``````````````````````````````````````````````````




## beyond redemption

While browsers are able to handle all sorts of "tag soup", `htmlnorm` will
make no attempt to normalize malformed HTML beyond some very limited cases,
e.g. unclosed elements, as covered above.

Why? `htmlnorm`'s primary purpose is to facilitate testing where semantic 
equivalence is the only thing that matters. For well-formed HTML, `htmlnorm` can
normalize the HTML so that the only differences between the tested function's
actual result and the expected result will be semantic.

`htmlnorm` can normalize some not-so-well-formed HTML, in particular unclosed
tags. This is entirely optional, and whether tests use that option depends on
whether the tests care about whether tags are specifically closed or unclosed,
even if the semantics don't.

But for other kinds of malformation, the semantics become ambiguous. The safest
thing to do for the reliability of tests is to compare the outputs and expected
outputs as-is. Doing otherwise may hide what should be considered failures,
either in the function being tested or the test code and data itself. Perhaps
the malformed HTML output is intentional. The test will want to make assertions
on that exact value.

[//]: # (todo: move this to documentation and place a link or reference here instead.)


### [CASE] closing tag without matching open
[IN]
``````````````````````````````````````````````````
  we 
have→→→ a close
     tag
     without
an open→
  so return as-is.
</p>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
  we 
have→→→ a close
     tag
     without
an open→
  so return as-is.
</p>
``````````````````````````````````````````````````

### [CASE] closing tag orphaned by earlier implicit close
[IN]
``````````````````````````````````````````````````
<p>  we 
have→→→ a close
     tag
     below that 
was meant to go with→
  the above open
  <blockquote>
     but it is implicitly closed by this
       blockquote, so the close below is orphaned.
  <blockquote>
</p>
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<p>  we 
have→→→ a close
     tag
     below that 
was meant to go with→
  the above open
  <blockquote>
     but it is implicitly closed by this
       blockquote, so the close below is orphaned.
  <blockquote>
</p>
``````````````````````````````````````````````````




## content modifications

### attribute exclusion

#### [CASE] excludes attributes in targeted element
The test configuration of htmlnorm excludes `exclude` and `itemscope` attributes
on `input` elements.

[IN]
``````````````````````````````````````````````````
<input type="checkbox" exclude="x" id="cats" class="setting" checked itemscope> Cats?
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<input checked class="setting" id="cats" type="checkbox"> Cats?
``````````````````````````````````````````````````

#### [CASE] does not change other elements

[IN]
``````````````````````````````````````````````````
<area type="checkbox" exclude="x" id="cats" class="setting" checked itemscope> Cats?
``````````````````````````````````````````````````
[OUT]
``````````````````````````````````````````````````
<area checked class="setting" exclude="x" id="cats" itemscope type="checkbox"> Cats?
``````````````````````````````````````````````````


### replaced attribute values

[//]: # (todo add support)

### excluded tags

[//]: # (todo add support)

### replaced tag content

[//]: # (todo add support)
