# Creating Mind Maps from Scratch with MindMup MapJS

This guide shows you how to create and use mind maps with the MindMup MapJS library.

## Quick Start

The easiest way to get started is to open the `simple-example.html` file in your browser:

```bash
# Start the server (if not already running)
python3 -m http.server 8080

# Then open in your browser:
# http://localhost:8080/simple-example.html
```

## Data Structure

Mind maps in MapJS use a hierarchical JSON structure:

```javascript
var mindMapData = {
    id: 1,                    // Unique ID (required)
    title: 'Root Node',       // Node text (required)
    ideas: {                  // Child nodes (optional)
        1: {                  // Positive keys = right side
            id: 2,
            title: 'Right Child 1'
        },
        2: {
            id: 3,
            title: 'Right Child 2',
            ideas: {          // Nested children
                1: {
                    id: 4,
                    title: 'Grandchild'
                }
            }
        },
        -1: {                 // Negative keys = left side
            id: 5,
            title: 'Left Child 1'
        }
    },
    attr: {                   // Optional attributes
        style: {
            background: '#FF0000'
        }
    }
};
```

### Key Points:

- **Positive keys** (1, 2, 3...) place nodes on the **right side**
- **Negative keys** (-1, -2, -3...) place nodes on the **left side**
- Each node must have a unique `id`
- The `ideas` object contains child nodes
- Nodes can be nested arbitrarily deep

## Basic HTML Setup

Here's a minimal HTML page:

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="test/mapjs-default-styles.css">
</head>
<body>
    <div id="container" style="width: 100%; height: 600px;"></div>

    <!-- Load dependencies -->
    <script src="lib/dependencies.js"></script>

    <!-- Load MAPJS sources (in order) -->
    <script src="src/mapjs.js"></script>
    <script src="src/observable.js"></script>
    <script src="src/url-helper.js"></script>
    <script src="src/content.js"></script>
    <script src="src/layout.js"></script>
    <script src="src/clipboard.js"></script>
    <script src="src/hammer-draggable.js"></script>
    <script src="src/map-model.js"></script>
    <script src="src/map-toolbar-widget.js"></script>
    <script src="src/link-edit-widget.js"></script>
    <script src="src/image-drop-widget.js"></script>
    <script src="src/dom-map-view.js"></script>
    <script src="src/dom-map-widget.js"></script>

    <script>
        // Your initialization code here (see below)
    </script>
</body>
</html>
```

## JavaScript Initialization

### Step 1: Create Your Data

```javascript
var mindMapData = {
    id: 1,
    title: 'My Mind Map',
    ideas: {
        1: { id: 2, title: 'First Idea' },
        2: { id: 3, title: 'Second Idea' }
    }
};
```

### Step 2: Initialize the Library

```javascript
// Get the container element
var container = jQuery('#container');

// Create a content object from your data
var idea = MAPJS.content(mindMapData);

// Create the map model
var mapModel = new MAPJS.MapModel(MAPJS.DOMRender.layoutCalculator);

// Initialize the widget
container.domMapWidget(console, mapModel, false);

// Load the data into the model
mapModel.setIdea(idea);
```

## Programmatic API

Once initialized, you can control the mind map programmatically:

```javascript
// Add a child to the selected node
mapModel.addSubIdea();

// Add a sibling to the selected node
mapModel.addSiblingIdea();

// Edit the selected node
mapModel.editNode();

// Delete the selected node
mapModel.removeSubIdea();

// Undo/Redo
mapModel.undo();
mapModel.redo();

// Select a specific node by ID
mapModel.selectNode(nodeId);

// Get the current idea (data structure)
var currentData = mapModel.getCurrentLayout();

// Update node title
mapModel.updateTitle(nodeId, 'New Title');

// Change node color
mapModel.updateStyle('nodeId', 'background', '#FF0000');

// Collapse/expand a node
mapModel.toggleCollapse();

// Reset view (center and zoom)
mapModel.resetView();
```

## Keyboard Shortcuts

The library includes built-in keyboard shortcuts:

- **Tab**: Add child node
- **Enter**: Add sibling node
- **Shift+Enter**: Add sibling before current
- **Delete/Backspace**: Remove node
- **Space** or **F2**: Edit node
- **Arrow keys**: Navigate between nodes
- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + Y**: Redo
- **Ctrl/Cmd + C**: Copy
- **Ctrl/Cmd + X**: Cut
- **Ctrl/Cmd + V**: Paste
- **F**: Toggle collapse/expand

## Styling Nodes

You can add visual styling to nodes:

```javascript
var styledNode = {
    id: 1,
    title: 'Styled Node',
    attr: {
        style: {
            background: '#FF6B6B',  // Background color
            color: '#FFFFFF'         // Text color (auto-calculated if not set)
        }
    }
};
```

## Adding Icons and Attachments

```javascript
var nodeWithIcon = {
    id: 1,
    title: 'Node with Icon',
    attr: {
        icon: {
            url: 'http://example.com/icon.png',
            width: 32,
            height: 32
        },
        attachment: {
            contentType: 'text/html',
            content: 'Additional information here'
        }
    }
};
```

## Events

Listen to map model events:

```javascript
mapModel.addEventListener('nodeCreated', function(node) {
    console.log('New node created:', node);
});

mapModel.addEventListener('nodeTitleChanged', function(node) {
    console.log('Node title changed:', node);
});

mapModel.addEventListener('nodeRemoved', function(node) {
    console.log('Node removed:', node);
});
```

## Exporting Data

Get the current mind map as JSON:

```javascript
// The idea object is automatically updated as you edit
var jsonData = JSON.stringify(idea, null, 2);
console.log(jsonData);

// Or download as a file
var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonData);
var downloadAnchorNode = document.createElement('a');
downloadAnchorNode.setAttribute("href", dataStr);
downloadAnchorNode.setAttribute("download", "mindmap.json");
document.body.appendChild(downloadAnchorNode);
downloadAnchorNode.click();
downloadAnchorNode.remove();
```

## Complete Example

See `simple-example.html` for a complete working example with:
- Pre-built mind map data
- Button controls
- Keyboard shortcuts
- Export functionality

## Advanced: Using with NPM/Browserify

If you've installed via npm:

```javascript
var MAPJS = require('mindmup-mapjs');

// Then use as described above
var idea = MAPJS.content(mindMapData);
// etc.
```

## Troubleshooting

1. **Map doesn't display**: Make sure all script files are loaded in the correct order
2. **Keyboard shortcuts don't work**: Click on the map container to focus it
3. **Changes aren't saved**: The library doesn't auto-save; you need to export the `idea` object
4. **Styling doesn't apply**: Check that `mapjs-default-styles.css` is loaded

## Resources

- Demo: `test/index.html` (complex example with all features)
- Simple example: `simple-example.html` (minimal setup)
- Source code: `src/` directory
- Tests: `test/*-spec.js` files show usage examples
