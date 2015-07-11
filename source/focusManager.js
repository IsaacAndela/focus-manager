"use strict";

function isAncestor(ancestor, descendant) {
	var element = descendant;
	while (element) {
		if (element === ancestor) {
			return true;
		}
		element = element.parentElement;
	}

	return false;
}

function isDisabled(element) {
	return element.disabled === true;
}

function isFocusable(element) {
	return Boolean(element) && element.tabIndex >= 0 && !isDisabled(element);
}

function makeFocusable(element) {
	// A tabIndex is needed to make the element focusable
	// A tabIndex of -1 means that the element is only programmatically focusable
	if (isDisabled(element)) {
		element.disabled = false;
	}

	if (!isFocusable(element)) {
		element.tabIndex = -1;
	}
}

// Find the first focusable element.
// The candidates are the element and it's descendants.
// The search is performed depth-first.
function findFirstFocusableElement(element) {
	if (isFocusable(element)) {
		return element;
	}

	var children = element.children;
	var length = children.length;
	var child;
	var focusableDescendant;

	for (var i = 0; i < length; i += 1) {
		child = children[i];

		focusableDescendant = findFirstFocusableElement(child);

		if (focusableDescendant) {
			return focusableDescendant;
		}
	}

	return null;
}

function focus(element) {
	makeFocusable(element);
	element.focus();
}

function resolveFocus(parent, defaultFocus) {
	var focusElement;

	if (defaultFocus) {
		focusElement = defaultFocus;
	} else {
		focusElement = findFirstFocusableElement(parent) || parent;
	}

	focus(focusElement);
}

function focusInElement(element) {
	resolveFocus(element);
}

// State is kept is these variables.
// Since only one modal dialog can capture focus at a time the state is a singleton.
var state = {
	eventListenerArguments: null,
	eventListenerContext: null
};

function releaseModalFocus(newFocusElement) {
	var eventListenerContext = state.eventListenerContext;
	var eventListenerArguments = state.eventListenerArguments;

	if (eventListenerContext && eventListenerArguments) {
		eventListenerContext.removeEventListener.apply(eventListenerContext, eventListenerArguments);
	}

	// Reset the state object
	state.eventListenerContext = null;
	state.eventListenerArguments = null;

	if (newFocusElement) {
		newFocusElement.focus();
	}
}

// Keep focus inside the modal
function restrictFocus(modal, focusedElement) {
	if (!isAncestor(modal, focusedElement)) {
		resolveFocus(modal);
	}
}

// modal, the element in which to contain focus
// focusElement (optional), the element inside the modal to focus when opening
function captureModalFocus(modal, focusElement) {

	// without a modal there is nothing to capture
	if (!modal) {
		return null;
	}

	// If any focus is already being captured, release it now
	releaseModalFocus();

	// focus the modal so the user knows it was opened
	resolveFocus(modal, focusElement);

	// Whenever an element outside of the modal is focused, the modal is focused instead
	function focusCallback(evnt) {
		restrictFocus(modal, evnt.target);
	}

	// The focus event does not bubble
	// however it can be captured on an ancestor element
	// by setting useCapture to true
	var eventListenerContext = document;
	var eventListenerArguments = ["focus", focusCallback, true];

	// Save the eventListener data in the state object so it can be removed later
	// by the releaseModalFocus function
	state.eventListenerContext = eventListenerContext;
	state.eventListenerArguments = eventListenerArguments;

	eventListenerContext.addEventListener.apply(eventListenerContext, eventListenerArguments);
}

var focusManager = {
	capture: captureModalFocus,
	release: releaseModalFocus,
	focusInElement: focusInElement
};