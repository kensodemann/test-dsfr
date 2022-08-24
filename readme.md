# Issues

There are two issues with the strategy being used here. Neither is an issue with Stencil. These issues are:

- The component library being consumed uses global selectors that will not work embedded in shadow DOM unless the CSS and JavaScript using them is made to be part of the web component itself, which could cause bloat.
- Slots should _only_ be used inside of Shadow DOM

## The Sample Application

This renders a basic page that looks like this:

```
+----------------------------------------------------------+
| Hello, World! I'm Stencil 'Don't call me a framework' JS |
|                                                          |
| A slot will go here...                                   | 
|                                                          |
| This is slotted                                          |
| +---------------+                                        |
| | With a button |                                        |
| +---------------+                                        |
|                                                          |
| +----------------------+                                 |
| | A non-slotted button |                                 |
| +----------------------+                                 |
|                                                          |
| +-------------+                                          |
| | Hello World |                                          |
| +-------------+                                          |
|                                                          |
+----------------------------------------------------------+
```

All buttons have the `fr-btn` class. However, `A non-slotted button` will not be styled because it is in the shadow DOM and the CSS selectors cannot see it by HTML specification and design.

The other two buttons _are_ styled because the are in the light DOM.

Clicking the "Hello World" button will add new buttons to the `my-component` slot. These will also be styled because even though the slot is inside the component and thus in the shadow DOM, the button itself is a child of `my-compnent` and thus in the light DOM. This is how slotting works as per the HTML specification and design.

As such, the page will look like this after a few presses:


```
+----------------------------------------------------------+
| Hello, World! I'm Stencil 'Don't call me a framework' JS |
|                                                          |
| A slot will go here...                                   | 
|                                                          |
| This is slotted                                          |
| +---------------+                                        |
| | With a button |                                        |
| +---------------+                                        |
| +----------------+                                       |
| | Another button |                                       |
| +----------------+                                       |
| +----------------+                                       |
| | Another button |                                       |
| +----------------+                                       |
| +----------------+                                       |
| | Another button |                                       |
| +----------------+                                       |
| +----------------+                                       |
| | Another button |                                       |
| +----------------+                                       |
|                                                          |
| +----------------------+                                 |
| | A non-slotted button |                                 |
| +----------------------+                                 |
|                                                          |
| +-------------+                                          |
| | Hello World |                                          |
| +-------------+                                          |
|                                                          |
+----------------------------------------------------------+
```

If you look at the console, you will also see that the slot changed event _is_ being fired as expected, including with the initial slotting of "This is slotted" and "With a button". The slot is being changed.

## Issue One

That all works very well, but it shows problem number 1, which is that the `dsfr` components are not designed to work with shadow DOM, resulting in "A non-slotted button" not being styled.

Again, this is by HTML specification and design. This is _not_ a bug.

## Issue Two

Issue two will become evident if you set `shadow: false` in order to try and get around "Issue One."

Now "A non-slotted button" _is_ styled since it is no longer protected by shadow DOM. However, the buttons that are added will not be added into the `slot`. Instead you will get something like this:

```
+----------------------------------------------------------+
| Hello, World! I'm Stencil 'Don't call me a framework' JS |
|                                                          |
| A slot will go here...                                   | 
|                                                          |
| This is slotted                                          |
| +---------------+                                        |
| | With a button |                                        |
| +---------------+                                        |
|                                                          |
| +----------------------+                                 |
| | A non-slotted button |                                 |
| +----------------------+                                 |
| +----------------+                                       |
| | Another button |                                       |
| +----------------+                                       |
| +----------------+                                       |
| | Another button |                                       |
| +----------------+                                       |
| +----------------+                                       |
| | Another button |                                       |
| +----------------+                                       |
| +----------------+                                       |
| | Another button |                                       |
| +----------------+                                       |
|                                                          |
| +-------------+                                          |
| | Hello World |                                          |
| +-------------+                                          |
|                                                          |
+----------------------------------------------------------+
```

The reason for this is that we are not using shadow DOM, and a `slot` is only defined within the HTML specifications in the context of the shadow DOM. As such, when you add the buttons, they are simply children of the `my-component` and are rendered as such.

If you look at the console, you will see that the slot changed was _never_ called, not even with the initial slotting, because slots don't really exist outside of the shadow DOM so far as the browser is concerned.

Again, this is _not_ a bug. This is just the way HTML works.

The "This is slotted" and "With a button" elements _are_ actually slotted, but I believe this is Stencil doing the best that it can with the static elements.

## The `onslotchange` Event

This event [appears to be highly experimental](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/onslotchange). I do not know if I would trust it, but the behavior I have noted above is very logical to me and seems absolutely correct.

## Solutions

Any of the following seem to be reasonable solutions:

- Do not use the `dsfr` library, at least in its current form
- Use the library with SD but in the components that use `dsfr` components, be sure to import the proper CSS. This worries me with potential bloat in the CSS. I am also concerned that selectors used in the JavaScript will not work regardless.
- Use the `dsfr` library but _do not_ support dynamically adding children to the containers. Rather, suggest that people only use statically defined child elements and then show / hide as appropriate. This may not be practical, especially for lists.
- Use the `dsfr` library with SD off, and implement proper "add" and "remove" methods in the container elements (it would only be the container elements that would require this)


The last bullet point seems to be the least painful to me, though it does mean creating an unnatural API on each container.
