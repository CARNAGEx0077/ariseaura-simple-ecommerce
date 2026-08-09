const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../content/products');
const outputFile = path.join(__dirname, '../products.json');

function buildProducts() {
  console.log('Building products.json...');
  
  if (!fs.existsSync(contentDir)) {
    console.warn(`Content directory not found at ${contentDir}. Creating empty products.json.`);
    fs.writeFileSync(outputFile, JSON.stringify([]));
    return;
  }

  const files = fs.readdirSync(contentDir);
  const products = [];

  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(contentDir, file);
      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const product = JSON.parse(fileContent);
        
        // Validation: skip if name or price is missing
        if (!product.name || typeof product.price !== 'number') {
          console.warn(`Skipping invalid product in ${file}. Missing name or price.`);
          continue;
        }

        // Set ID from filename if not present
        if (!product.id) {
          product.id = file.replace('.json', '');
        }
        
        // Provide fallbacks for new fields
        product.sizes = product.sizes || [];
        product.featured = product.featured === true;
        product.available = product.available !== false;
        
        products.push(product);
      } catch (err) {
        console.error(`Error processing file ${file}:`, err);
      }
    }
  }

  // Sort products (optional, e.g., by ID or featured status)
  products.sort((a, b) => {
    // Basic alphanumeric sort by id if present
    const idA = a.id ? a.id.toLowerCase() : '';
    const idB = b.id ? b.id.toLowerCase() : '';
    return idA.localeCompare(idB);
  });

  fs.writeFileSync(outputFile, JSON.stringify(products, null, 2));
  console.log(`Successfully built products.json with ${products.length} products.`);
}

buildProducts();
