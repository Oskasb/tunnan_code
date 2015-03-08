"use strict";

define([
	"application/EventManager"
],
	function(
		event

		) {



		var passive = function() {
			event.fireEvent(event.list().ONESHOT_SOUND, {soundData:event.sound().UI_OUT})
		};

		var on_hover = function() {
			event.fireEvent(event.list().ONESHOT_SOUND, {soundData:event.sound().UI_HOVER})
		};

		var on_active = function() {
			event.fireEvent(event.list().ONESHOT_SOUND, {soundData:event.sound().UI_ACTIVE})
		};

		var on_applied = function() {
			event.fireEvent(event.list().ONESHOT_SOUND, {soundData:event.sound().UI_CLICK})
		};

		var on_message = function() {
			event.fireEvent(event.list().ONESHOT_SOUND, {soundData:event.sound().UI_OUT})
		};


		var GuiStateTransitionCallbacks = {
			passive:passive,
			on_hover:on_hover,
			on_active:on_active,
			on_applied:on_applied,
			on_message:on_message,
		};


		return GuiStateTransitionCallbacks;

	});