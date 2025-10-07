const express = require('express');
const path = require('path');
const { readData, generateId, writeData } = require('./utils/fileHandler');
const app = express();
const PORT = process.env.API_PORT || 3067;

app.use(express.json());

const createResponse = (success, data = null, message = null, errors = null) => {
  return {
    success,
    data,
    message,
    errors
  };
};

// GET /items - Get all items
app.get('/items', (req, res) => {
  try {
    const items = readData();
    res.json(createResponse(true, items));
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json(createResponse(false, null, 'Internal server error'));
  }
});

// GET /items/:id - Get a single item
app.get('/items/:id', (req, res) => {
  try {
    const items = readData();
    const id = parseInt(req.params.id);
    // Check if id is a number
    if (isNaN(id)) {
      return res.status(400).json(createResponse(false, null, 'Invalid ID format'));
    }
    
    // Find item with correct ID in .json array 
    const item = items.find(item => item.id === id);
    
    if (!item) {
      return res.status(404).json(createResponse(false, null, 'Item not found'));
    }
    
    res.json(createResponse(true, item));
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json(createResponse(false, null, 'Internal server error'));
  }
});

// POST /items - Create a new item
app.post('/items', (req, res) => {
  try {
    const items = readData();
    const newItem = req.body;
    
    // Create the item with new ID each time
    const item = {
      id: generateId(items),
      name: newItem.name.trim(),
      price: newItem.price,
      size: newItem.size
    };
    
    items.push(item);
    
    if (writeData(items)) {
      res.status(201).json(createResponse(true, item, 'Item created successfully'));
    } else {
      res.status(500).json(createResponse(false, null, 'Failed to save item'));
    }
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json(createResponse(false, null, 'Internal server error'));
  }
});

// PUT /items/:id - Update an existing item
app.put('/items/:id', (req, res) => {
  try {
    const items = readData();
    const id = parseInt(req.params.id);
    const updatedItem = req.body;
    
    if (isNaN(id)) {
      return res.status(400).json(createResponse(false, null, 'Invalid ID format'));
    }
    
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return res.status(404).json(createResponse(false, null, 'Item not found'));
    }
    
    // Validate the updated item
    const validationErrors = validateItem(updatedItem);
    if (validationErrors.length > 0) {
      return res.status(400).json(createResponse(false, null, 'Validation failed', validationErrors));
    }
    
    // Update the item
    items[itemIndex] = {
      id: id,
      name: updatedItem.name.trim(),
      price: updatedItem.price,
      size: updatedItem.size
    };
    
    if (writeData(items)) {
      res.json(createResponse(true, items[itemIndex], 'Item updated successfully'));
    } else {
      res.status(500).json(createResponse(false, null, 'Failed to update item'));
    }
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json(createResponse(false, null, 'Internal server error'));
  }
});

// DELETE /items/:id - Delete an item
app.delete('/items/:id', (req, res) => {
  try {
    const items = readData();
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json(createResponse(false, null, 'Invalid ID format'));
    }
    
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return res.status(404).json(createResponse(false, null, 'Item not found'));
    }
    
    const deletedItem = items.splice(itemIndex, 1)[0];
    
    if (writeData(items)) {
      res.json(createResponse(true, deletedItem, 'Item deleted successfully'));
    } else {
      res.status(500).json(createResponse(false, null, 'Failed to delete item'));
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json(createResponse(false, null, 'Internal server error'));
  }
});

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).json(createResponse(false, null, 'API endpoint accounted for.'));
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
