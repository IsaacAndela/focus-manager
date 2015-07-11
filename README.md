# Focus Manager

_Accessible focus management made easy_

## What is this?

This is a small Javascript library to help you with focus management for modal dialogs and other content that is opened in the page. How you open or close these dialogs and other content is up to you, this library is just here to help you make your dialogs more accessible for keyboard users.


## Documentation


### `focusManager.focusInElement(element)`

If the `element` is focusable it will be focused. Otherwise the first descendant that is focusable will be focused. If this fails the `element` itself will be made focusable and will be focused.


### `focusManager.capture(modal, focusElement: optional)`

`focusManager.capture` will only allow `modal` and it's descendants to be focused. Whenever an element outside `modal` receives focus, `modal` or the first focusable descendant inside `modal` will be focused. Thus helping keyboard users to stay inside the `modal` until it is dismissed.

Optionally a `focusElement` can be provided. This element will receive the initial focus instead of the first focusable descendant. If no `focusElement` is provided `focusManager.focusInElement(modal)` will be used to determine which element will receive the initial focus.

`focusManager.capture` will keep listening for focus events until it is released.

This function should be used when opening a modal dialog.


### `focusManager.release(focusElement: optional)`

`focusManager.release` will release the captured focus and allow elements to be focused as they normally would be.

Optionally a `focusElement` can be provided. This element will receive focus when this function is executed.

This function should be used when closing a modal dialog.


## Examples

[TODO 07-11-2015]


## License

Focus Manager is licensed under the ISC license. See [the license file](LICENSE) for details.