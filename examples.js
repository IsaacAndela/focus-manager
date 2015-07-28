(function dialogExample() {
	"use strict";

	function arrayFrom(arrayLikeObject) {
		return [].slice.call(arrayLikeObject);
	}

	var openedClass = "is-opened";

	var openButton = document.querySelector("[data-open-modal-dialog]");
	var closeButtons = arrayFrom(document.querySelectorAll("[data-close-modal-dialog]"));
	var dialog = document.querySelector("[data-dialog]");

	var openButtonWithout = document.querySelector("[data-open-modal-dialog-without]");
	var closeButtonsWithout = arrayFrom(document.querySelectorAll("[data-close-modal-dialog-without]"));
	var dialogWithout = document.querySelector("[data-dialog-without]");


	openButton.addEventListener("click", function (evnt) {
		dialog.classList.add(openedClass);
		focusManager.capture(dialog);
	});

	closeButtons.forEach(function (closeButton) {
		closeButton.addEventListener("click", function (evnt) {
			dialog.classList.remove(openedClass);
			focusManager.release(openButton);
		});
	});

	openButtonWithout.addEventListener("click", function (evnt) {
		dialogWithout.classList.add(openedClass);
	});

	closeButtonsWithout.forEach(function (closeButtonWithout) {
		closeButtonWithout.addEventListener("click", function (evnt) {
			dialogWithout.classList.remove(openedClass);
		});
	});
}());