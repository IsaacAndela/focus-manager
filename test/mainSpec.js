function appendToBody(element) {
	document.body.appendChild(element);
}

function el(name, attributes) {
	var element = document.createElement(name);

	if (attributes) {
		Object.keys(attributes).forEach(function (attributeName) {
			var attributeValue = attributes[attributeName];
			element.setAttribute(attributeName, attributeValue);
		});
	}

	return element;
}

function removeFromBody(element) {
	document.body.removeChild(element);
}

describe("captureModalFocus", function () {
	describe("isAncestor", function () {

		var parent = el("div");
		var child = el("div");
		var grandchild = el("div");
		var unrelated = el("div");

		parent.appendChild(child);
		child.appendChild(grandchild);

		it("should detect parents and grandparents", function () {
			expect(isAncestor(parent, child)).toBe(true);
			expect(isAncestor(parent, grandchild)).toBe(true);
		});

		it("should not detect other elements", function () {
			expect(isAncestor(child, parent)).toBe(false);
			expect(isAncestor(parent, unrelated)).toBe(false);
		});
	});

	describe("isFocusable", function () {
		var div = el("div");
		var button = el("button");
		var buttonDisabled = el("button", {disabled: ""});
		var buttonNonFocusable = el("button", {"tabIndex": -1});
		var divFocusable = el("div", {"tabIndex": 0});

		it("should discern focusable and non focusable elements", function () {
			expect(isFocusable(button)).toBe(true);
			expect(isFocusable(divFocusable)).toBe(true);

			expect(isFocusable(buttonNonFocusable)).toBe(false);
			expect(isFocusable(buttonDisabled)).toBe(false);
			expect(isFocusable(div)).toBe(false);
		});
	});

	describe("makeFocusable", function () {
		it("should make an element programmaticaly focusable", function () {
			var div = el("div", {"disabled": ""});
			makeFocusable(div);

			expect(div.tabIndex).toBe(-1);
			expect(div.disabled).toBeFalsy();
		});

		it("should not affect an already focusable element", function () {
			var button = el("button");
			makeFocusable(button);

			expect(button.tabIndex).toBe(0);
		});
	});

	describe("findFirstFocusableElement", function () {
		var root;
		var div;
		var span;
		var p;
		var button;
		var input;

		beforeEach(function () {
			root = el("div");
			div = el("div");
			span = el("span");
			p = el("p");
			button = el("button");
			input = el("input");
		});

		it("should do a dept first search", function () {
			root.appendChild(div);
			root.appendChild(p);
			p.appendChild(span);
			span.appendChild(input);
			root.appendChild(button);

			expect(findFirstFocusableElement(root)).toBe(input);
		});

		it("should be able to detect the root as a focusable element", function () {
			button.appendChild(span);

			expect(findFirstFocusableElement(button)).toBe(button);
		});
	});

	describe("findLastFocusableElement", function () {
		var root;
		var div;
		var span;
		var p;
		var button;
		var input;

		beforeEach(function () {
			root = el("div");
			div = el("div");
			span = el("span");
			p = el("p");
			button = el("button");
			input = el("input");
		});

		it("should do find the last element", function () {
			root.appendChild(div);
			root.appendChild(p);
			p.appendChild(span);
			span.appendChild(input);
			root.appendChild(button);

			expect(findLastFocusableElement(root)).toBe(button);
		});

		it("should be able to detect the root as a focusable element", function () {
			root.appendChild(div);
			root.appendChild(button);
			root.appendChild(p);
			p.appendChild(span);
			span.appendChild(input);
			p.tabIndex = 0;

			expect(findLastFocusableElement(root)).toBe(input);
		});
	});

	describe("focus", function () {
		it("should focus an element", function () {
			var div = el("div");

			appendToBody(div);
			focus(div);

			expect(div).toBe(document.activeElement);

			removeFromBody(div);
		});
	});

	describe("resolveFocus", function () {
		var root;
		var div;
		var button;
		var input;

		beforeEach(function () {
			root = el("div");
			div = el("div");
			button = el("button");
			input = el("input");

			root.appendChild(div);
			div.appendChild(button);
			root.appendChild(input);

			appendToBody(root);
		});

		afterEach(function () {
			removeFromBody(root);
		});

		it("should focus the defaultFocus element", function () {
			resolveFocus(root, div);

			expect(div).toBe(document.activeElement);
		});

		it("should focus the first focusable element", function () {
			resolveFocus(root);

			expect(button).toBe(document.activeElement);
		});

		it("should focus the last focusable element", function () {
			var defaultState = state;
			state.lastFocus = button;
			resolveFocus(root);

			expect(input).toBe(document.activeElement);
		});
	});

	describe("resolveFocus", function () {
		var root;
		var div;
		var button;

		beforeEach(function () {
			root = el("div");
			div = el("div");
			button = el("button");

			root.appendChild(div);
			div.appendChild(button);

			appendToBody(root);
		});

		afterEach(function () {
			removeFromBody(root);
		});

		it("should focus the defaultFocus element", function () {
			resolveFocus(root);

			expect(button).toBe(document.activeElement);
		});
	});

	describe("restrictFocus", function () {
		var root;
		var modal;
		var div;
		var insider;
		var secondInsider;
		var outsider;

		beforeEach(function () {
			root = el("div");
			modal = el("div");
			div = el("div");
			insider = el("button");
			secondInsider = el("button");
			outsider = el("button");

			root.appendChild(modal);
			root.appendChild(outsider);
			modal.appendChild(div);
			div.appendChild(insider);
			div.appendChild(secondInsider);

			appendToBody(root);
		});

		afterEach(function () {
			removeFromBody(root);
		});

		it("should restrict focus to the modal when an outside element is focused", function () {
			outsider.focus();
			expect(outsider).toBe(document.activeElement);
			restrictFocus(modal, outsider);
			expect(insider).toBe(document.activeElement);
		});

		it("shoud not move focus when the focus is already inside the modal", function () {
			secondInsider.focus();
			restrictFocus(modal, secondInsider);
			expect(secondInsider).toBe(document.activeElement);
		});
	});

	describe("focusFirstInElement", function () {
		it("should focus the first focusable element", function () {
			var root = el("div");
			var firstButton = el("button");
			var div = el("div");
			var lastButton = el("button");

			div.tabIndex = 0;

			root.appendChild(firstButton);
			root.appendChild(div);
			div.appendChild(lastButton);

			appendToBody(root);

			focusFirstInElement(root);

			expect(firstButton).toBe(document.activeElement);

			removeFromBody(root);
		});
	});

	describe("focusLastInElement", function () {
		it("should focus the last focusable element", function () {
			var root = el("div");
			var firstButton = el("button");
			var div = el("div");
			var lastButton = el("button");

			div.tabIndex = 0;

			root.appendChild(firstButton);
			root.appendChild(div);
			div.appendChild(lastButton);

			appendToBody(root);

			focusLastInElement(root);

			expect(lastButton).toBe(document.activeElement);

			removeFromBody(root);
		});
	});

	describe("releaseModalFocus", function () {
		var root;
		var modal;
		var insider;
		var secondInsider;
		var outsider;
		var callback;
		var defaultState = state;

		beforeEach(function () {
			root = el("div");
			modal = el("div");
			insider = el("button");
			secondInsider = el("button");
			outsider = el("button");

			root.appendChild(modal);
			root.appendChild(outsider);
			modal.appendChild(insider);
			modal.appendChild(secondInsider);

			appendToBody(root);
			callback = function () {};
			spyOn(document, "removeEventListener");
		});

		afterEach(function () {
			state = defaultState;
			removeFromBody(root);
		});

		it("should focus the newFocusElement", function () {
			releaseModalFocus(outsider);

			expect(outsider).toBe(document.activeElement);
		});

		it("should reset the state object", function () {
			state.eventListenerContext = document;
			state.eventListenerArguments = ["focus"];
			releaseModalFocus();

			expect(state).toEqual(defaultState);
		});

		it("remove the event listener that is in the state object", function () {

			state.eventListenerContext = document;
			state.eventListenerArguments = ["focus", callback, true];
			releaseModalFocus();

			expect(state).toEqual(defaultState);
			expect(document.removeEventListener).toHaveBeenCalledWith("focus", callback, true);
		});
	});

	describe("captureModalFocus", function () {
		var root;
		var modal;
		var insider;
		var secondInsider;
		var outsider;
		var callback;
		var defaultState = state;

		beforeEach(function () {
			root = el("div");
			modal = el("div");
			insider = el("button");
			secondInsider = el("button");
			outsider = el("button");

			root.appendChild(modal);
			root.appendChild(outsider);
			modal.appendChild(insider);
			modal.appendChild(secondInsider);

			appendToBody(root);
			callback = function () {};
			spyOn(document, "addEventListener");
			spyOn(document, "removeEventListener");

		});

		afterEach(function () {
			state = defaultState;
			removeFromBody(root);
		});

		it("should focus the focusElement", function () {
			captureModalFocus(modal, secondInsider);

			expect(secondInsider).toBe(document.activeElement);
		});

		it("should focus the first focusable element when there is no focusElement parameter", function () {
			captureModalFocus(modal);

			expect(insider).toBe(document.activeElement);
		});

		it("should set the state object", function () {
			captureModalFocus();

			expect(state.eventListenerContext).toBe(document);
			expect(state.eventListenerArguments).toEqual(["focus", jasmine.any(Function), true]);
		});

		it("should release the previous modal capture", function () {
			state.eventListenerContext = document;
			state.eventListenerArguments = ["focus", callback, true];
			captureModalFocus(modal);

			expect(document.removeEventListener).toHaveBeenCalledWith("focus", callback, true);
		});
	});
});