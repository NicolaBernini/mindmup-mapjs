/*jslint nomen: true, newcap: true, browser: true*/
/*global jQuery, _*/
jQuery.fn.notesSidebarWidget = function (mapModel) {
	'use strict';
	return this.each(function () {
		var element = jQuery(this),
			textarea = element.find('textarea'),
			closeBtn = element.find('.notes-close'),
			titleEl = element.find('.notes-node-title'),
			currentNodeId = null,
			saveTimer = null;

		function saveNotes() {
			if (currentNodeId !== null) {
				var content = textarea.val();
				mapModel.setAttachment('notes-sidebar', currentNodeId, content ? {content: content} : false);
			}
		}

		function openSidebar(nodeId, attachment) {
			if (currentNodeId !== null && currentNodeId !== nodeId) {
				saveNotes();
			}
			currentNodeId = nodeId;
			textarea.val((attachment && attachment.content) || '');
			element.addClass('notes-sidebar-open');
			textarea.focus();
		}

		function closeSidebar() {
			saveNotes();
			element.removeClass('notes-sidebar-open');
			currentNodeId = null;
			if (saveTimer) {
				clearTimeout(saveTimer);
				saveTimer = null;
			}
		}

		function isOpen() {
			return element.hasClass('notes-sidebar-open');
		}

		mapModel.addEventListener('attachmentOpened', function (nodeId, attachment) {
			if (isOpen() && currentNodeId === nodeId) {
				closeSidebar();
			} else {
				openSidebar(nodeId, attachment);
			}
		});

		mapModel.addEventListener('nodeSelectionChanged', function (nodeId, isSelected) {
			if (isOpen() && isSelected) {
				saveNotes();
				mapModel.openAttachment('notes-sidebar', nodeId);
			}
		});

		mapModel.addEventListener('nodeRemoved', function (node) {
			if (isOpen() && node.id === currentNodeId) {
				currentNodeId = null;
				closeSidebar();
			}
		});

		closeBtn.on('click', function () {
			closeSidebar();
		});

		textarea.on('input', function () {
			if (saveTimer) {
				clearTimeout(saveTimer);
			}
			saveTimer = setTimeout(function () {
				saveNotes();
				saveTimer = null;
			}, 500);
		});

		textarea.on('keydown', function (e) {
			if (e.keyCode === 27) {
				closeSidebar();
				jQuery('#container').focus();
				e.stopPropagation();
			}
		});
	});
};
