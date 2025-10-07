const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../items.json');

// Read data from file
const readData = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      // Create a default static data file if it doesn't already exist
      const defaultData = [
        {"id": 1, "name": "T-Shirt", "price": 19.99, "size": "m"},
        {"id": 2, "name": "Jeans", "price": 49.99, "size": "l"},
        {"id": 3, "name": "Hat", "price": 14.99, "size": "s"},
        {"id": 4, "name": "Sneakers", "price": 79.99, "size": "m"},
        {"id": 5, "name": "Jacket", "price": 89.99, "size": "l"}
      ];
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return [];
  }
};

// Write data to file
const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data:', error);
    return false;
  }
};

// Creating a unique ID:
const generateId = (items) => {
  if (items.length === 0) return 1;
  return Math.max(...items.map(item => item.id)) + 1;
};

module.exports = {
  readData,
  writeData,
  generateId
};