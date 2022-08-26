# Issues

There are two issues with the strategy being used here. Neither is an issue with Stencil. These issues are:

- The component library being consumed uses global selectors that will not work embedded in shadow DOM unless the CSS and JavaScript using them is made to be part of the web component itself, which could cause bloat.
- Slots should _only_ be used inside of Shadow DOM

## The Sample Library

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

The `dsfr` design system needs to be used because the design team controls the design system and all properties need to use the exact same components. They cannot rewrite the components.

There are a few ways to handle this:
- re-write `dsfr` to create web-components using Stencil from the start
- continue wrapping, but allow CSS and JavaScript to be brought into the components
- do not use Stencil since this is not what it is designed for, rather create framework specific libraries that wrap `dsfr`

### Rewriting `dsfr`

The team that controls the `dsfr` design system would need to rewrite these components using Stencil. At that point, the framework wrappers would be used to create the Angular, React, and Vue libraries. This is a lot of work, but it is _exactly_ what Stencil is designed for.

This would also entail breaking changes for anyone using the existing `dsfr` library as they would have to switch from markup like this: `<button class="fr-btn">Hello my friends!</button>` to markup like this: `<fr-button>Hello my friends!</fr-button>`.

For the Ionic Customer Success team, think of an Ionic Framework v3 to v4 level migration. Huge. Also, though, Stencil was specifically created to take the Ionic Framework from the v3 methodology to the v4 methodology using web components.

**Note:** while this may be the best option from a technological standpoint, it is fundamentally opposite of DGFiP's goals as well as a large shock to existing applications and sites.


### Wrapping

In the current strategy, it is not possible to use the `dsfr` CSS and JavaScript at a global level _and_ use Shadow DOM at the same time. The easiest compromise is to not use Shadow DOM and then work around any limitations this may provide.

Another option is to create the components using Shadow DOM and then bring in the CSS and JavaScript as required so it can be applied within the component's shadow-root. You can see where [I have done that](https://github.com/kensodemann/test-dsfr/blob/main/src/components/my-component/my-component.css). If the comment is removed from the import of the `global.css` file, styles will be applied to the button that is in the shadow-root. There are a couple of caveats with this approach:

- It is best to import the minimal amount of CSS required like the [Vue library](https://github.com/dnum-mi/vue-dsfr/blob/abd29b2a755ada3c296769ba9557cf02deefbad3/src/components/DsfrButton/DsfrButton.vue#L62) does. This sample brings in everything, but that is only to maintain the simplicity of the demo.
- This does not account for the JavaScript. The sample library [applies the JavaScript globally](https://github.com/kensodemann/test-dsfr/blob/main/src/global.ts), but the selectors in the JavaScript will not be able to look inside of the Shadow DOM. As such, `dsfr` would likely need to be modified so the appropriate JavaScript could be imported and applied within each component.
- This has the potential to cause bloat, depending on how the `dsfr` JavaScript and CSS is structured.
j
### Create Framework Specific Libraries

In this model, the `dsfr` library is wrapped for each application framework. A [Vue based example](https://github.com/dnum-mi/vue-dsfr) of this already exists. It is then a matter of creating Angular and React based flavors.

This is a fair amount of work, but likely could have been done by now had they taken this route from the start. Given that they already have a component library, using Stencil makes little sense. They are really looking for something _like_ our wrappers, but that wraps their `dsfr` components instead of Stencil components.

There is a potential that the team could automate the creation of these framework specific wrappers. Due to the nature of the `dsfr` library, however, this may be a challenge. This may also not be possible. This may need to be a manual process.

