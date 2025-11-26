# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

MindMup MapJS is a zero-friction mind map visualization library built with JavaScript and SVG. This is the JavaScript visualization portion of MindMup that provides a canvas for creating and editing mind maps in browsers. The library can be used standalone or integrated into other projects.

## Build System

This project uses Grunt as its build system. Install the Grunt CLI globally if needed:

```bash
sudo npm install -g grunt-cli
```

### Common Commands

**Install dependencies:**
```bash
npm install
```

**Run tests:**
```bash
npm test
# or directly via grunt:
grunt jasmine
```

**Prepare test environment (downloads dependencies):**
```bash
npm run pretest
# This generates lib/dependencies.js from browserified dependencies
```

**Build distribution files:**
```bash
grunt dist
# This runs: checkstyle → jasmine → browserify:dependencies → concat:dist → uglify:dist
```

**Run code quality checks:**
```bash
grunt checkstyle  # Runs jshint and jscs
grunt jshint      # JavaScript linting
grunt jscs        # Code style checking
```

**Precommit checks:**
```bash
grunt precommit  # Runs checkstyle and jasmine
```

**Watch mode for development:**
```bash
grunt watch  # Auto-runs tests on file changes
```

**Visual testing:**
Open `test/index.html` in a browser after running `npm run pretest`.

## Architecture

### Core Design Pattern

MindMup MapJS uses a **Model-View-Controller** architecture with an event-driven observable pattern:

- **Observable Pattern**: The `observable()` function (src/observable.js) wraps objects to provide event listener capabilities (addEventListener, dispatchEvent, removeEventListener). This is the foundation for all communication between components.

- **Data Model**: `MAPJS.content` (src/content.js) represents the hierarchical mind map data structure (ideas and their relationships). It provides methods for traversing, querying, and manipulating the idea tree.

- **Business Logic**: `MAPJS.MapModel` (src/map-model.js) is the controller that manages user interactions, undo/redo, clipboard operations, and coordinates between the data model and view. It dispatches events for all state changes.

- **Layout Engine**: `MAPJS.layout` (src/layout.js) calculates node positions using an outline-based algorithm. It determines where each node should be positioned on the canvas while avoiding overlaps.

- **View Layer**: `domMapWidget` (src/dom-map-widget.js) is the main jQuery widget that handles rendering and user input. It listens to MapModel events and updates the DOM accordingly.

### Component Responsibilities

**src/mapjs.js**: Global namespace initialization (`var MAPJS = MAPJS || {};`)

**src/observable.js**: Event system implementation for pub/sub pattern

**src/content.js**:
- Mind map data structure (idea hierarchy with ids, titles, attributes)
- Tree traversal and query methods
- ID generation and session tracking

**src/map-model.js**:
- Coordinates user actions (add/remove/edit nodes, undo/redo)
- Maintains selection and activation state
- Clipboard operations (cut/copy/paste)
- Dispatches granular events (nodeCreated, nodeMoved, nodeTitleChanged, etc.)

**src/layout.js**:
- Calculates node positions using outline-based spacing
- Handles connector routing between parent/child nodes
- Processes links between arbitrary nodes
- Style calculations (colors, contrast)

**src/dom-map-view.js**: Lower-level DOM manipulation and SVG rendering for nodes/connectors

**src/dom-map-widget.js**:
- Main jQuery plugin (`$.fn.domMapWidget`)
- Keyboard shortcuts and hotkey mapping
- Touch/mouse interaction handling (via Hammer.js)
- Drag-and-drop support
- Zoom and pan controls

**src/clipboard.js**: Clipboard abstraction (memory-based implementation)

**src/hammer-draggable.js**: Dragging behavior using Hammer.js

**src/link-edit-widget.js**: UI for editing links between nodes

**src/image-drop-widget.js**: Drag-and-drop image insertion

**src/map-toolbar-widget.js**: Toolbar UI component

**src/url-helper.js**: URL parsing and manipulation utilities

### Event Flow

1. User interacts with the DOM (keyboard, mouse, touch)
2. `domMapWidget` translates DOM events into MapModel method calls
3. `MapModel` modifies the `content` data model
4. Layout is recalculated based on new content
5. `MapModel` dispatches specific change events (nodeCreated, nodeMoved, etc.)
6. `domMapWidget` and `domMapView` update the DOM in response to events

### Data Structure

Mind map data (`MAPJS.content`) is a recursive tree structure:
- Each node has: `id`, `title`, `ideas` (child nodes), `attr` (attributes like color, icon, links)
- Child nodes are stored in the `ideas` object with numeric keys (positive = right side, negative = left side)
- Session keys are appended to IDs for tracking origin (e.g., "42.session123")

## Code Style

- **Indentation**: Tabs (enforced by JSCS)
- **Quotes**: Single quotes (enforced by JSHint)
- **Strict mode**: All functions must use `'use strict';`
- **Style preset**: Crockford preset with custom modifications (.jscsrc)
- **Linting**: All undefined variables must be declared, all defined variables must be used

## Dependencies

Runtime dependencies (loaded via npm/browserify):
- jQuery 2.1.4
- Underscore.js 1.8.3
- Hammer.js 1.1.3 (touch gestures)
- jquery-hammerjs (jQuery integration)
- jquery.hotkeys (keyboard shortcuts)
- color 0.10.1 (color manipulation)

These are bundled into `lib/dependencies.js` via the pretest script.

## Distribution

Two main distribution files are generated in the `dist/` folder:

1. **dist/mindmup-mapjs.min.js**: Minified library without dependencies (use with separate dependency loading)
2. **dist/index.js**: Full bundle with dependencies (for npm usage with browserify)

Source concatenation order (defined in GruntFile.js): mapjs.js → observable.js → url-helper.js → content.js → layout.js → clipboard.js → hammer-draggable.js → map-model.js → map-toolbar-widget.js → link-edit-widget.js → image-drop-widget.js → dom-map-view.js → dom-map-widget.js

## Testing

- **Framework**: Jasmine 1.2.0
- **Test files**: All `test/*-spec.js` files
- **Custom matchers**: `test-lib/jquery-extension-matchers.js` for jQuery-specific assertions
- **Helpers**: `test-lib/describe-batch.js` for batch test generation
- **Coverage**: Extensive specs for content.js, map-model.js, layout.js, and dom-map-view.js
