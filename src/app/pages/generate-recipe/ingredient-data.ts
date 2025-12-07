/**
 * master list of known ingredient names used for autocomplete.
 *
 * The ingredients are grouped by category (vegetables, fruits, meat, etc.)
 * but exported as a single flat string array.
 */
export const INGREDIENT_NAMES: string[] = [

  // --- Vegetables ---
  'Artichoke', 'Arugula', 'Asparagus', 'Bamboo Shoots', 'Beetroot',
  'Bell Pepper', 'Bok Choy', 'Broccoli', 'Brussels Sprouts', 'Butternut Squash',
  'Cabbage', 'Carrot', 'Cassava', 'Cauliflower', 'Celery', 'Chard', 'Chayote',
  'Chili', 'Chinese Cabbage', 'Cucumber', 'Daikon', 'Edamame', 'Eggplant',
  'Fennel', 'Garlic', 'Ginger', 'Green Bean', 'Green Onion', 'Horseradish',
  'Jalapeno', 'Kale', 'Kimchi', 'Kohlrabi', 'Leek', 'Lettuce', 'Lotus Root',
  'Mushroom', 'Okra', 'Onion', 'Parsnip', 'Peas', 'Pickles', 'Plantain',
  'Potato', 'Pumpkin', 'Radish', 'Red Cabbage', 'Rutabaga', 'Sauerkraut',
  'Scallion', 'Seaweed', 'Shallot', 'Snow Peas', 'Spinach', 'Sugar Snap Peas',
  'Sweet Potato', 'Tomato', 'Turnip', 'Water Chestnut', 'Yam', 'Yellow Squash',
  'Zucchini',

  // --- Fruit & Nuts (fresh & dried) ---
  'Almond', 'Apple', 'Apricot', 'Avocado', 'Banana', 'Blackberry', 'Blueberry',
  'Cantaloupe', 'Cranberry', 'Currants', 'Date', 'Dragon Fruit', 'Dried Apricots',
  'Dried Cranberries', 'Durian', 'Fig', 'Goji Berries', 'Grape', 'Guava',
  'Honeydew', 'Jackfruit', 'Kiwi', 'Lemon', 'Lime', 'Lychee', 'Mandarin', 'Mango',
  'Nectarine', 'Orange', 'Papaya', 'Passion Fruit', 'Peach', 'Pear', 'Pineapple',
  'Plum', 'Pomegranate', 'Prunes', 'Raspberry', 'Rhubarb', 'Strawberry',
  'Sultanas', 'Tangerine', 'Watermelon',

  // --- Meat & Sausages ---
  'Bacon', 'Beef Kidney', 'Beef Liver', 'Beef Roast', 'Beef Steak', 'Brisket',
  'Chicken Breast', 'Chicken Gizzards', 'Chicken Liver', 'Chicken Thigh',
  'Chicken Wings', 'Duck Breast', 'Duck Legs', 'Goose', 'Ground Beef',
  'Ground Lamb', 'Ground Pork', 'Ground Turkey', 'Ham', 'Lamb Chops', 'Lamb Shank',
  'Meatballs', 'Oxtail', 'Pork Belly', 'Pork Chop', 'Pork Ribs', 'Pork Shoulder',
  'Salami', 'Sausage', 'Turkey Breast', 'Turkey',

  // --- Fish & Seafood ---
  'Anchovies', 'Calamari', 'Clams', 'Cod', 'Crab', 'Herring', 'Lobster',
  'Mackerel', 'Mussels', 'Octopus', 'Prawn', 'Salmon', 'Salt Cod', 'Sardines',
  'Scallops', 'Shrimp', 'Trout', 'Tuna',

  // --- Dairy & Alternatives ---
  'Almond Milk', 'Brioche', 'Butter', 'Buttermilk', 'Camembert', 'Cheddar',
  'Cheese', 'Clotted Cream', 'Coconut Milk', 'Condensed Milk', 'Cream',
  'Cream Cheese', 'Edam', 'Emmental', 'Evaporated Milk', 'Feta', 'Goat Cheese',
  'Gouda', 'Greek Yogurt', 'Gruyere', 'Halloumi', 'Mascarpone', 'Milk',
  'Mozzarella', 'Paneer', 'Parmesan', 'Ricotta', 'Roquefort', 'Sour Cream',
  'Whipping Cream', 'Whole Milk', 'Yogurt',

  // --- Pasta & Noodles ---
  'Egg Noodles', 'Fusilli', 'Glass Noodles', 'Gnocchi', 'Linguine', 'Macaroni',
  'Pasta', 'Penne', 'Ramen Noodles', 'Rice Noodles', 'Rigatoni', 'Soba',
  'Spaghetti', 'Tagliatelle', 'Udon',

  // --- Rice & Grains ---
  'Amaranth', 'Arborio Rice', 'Barley', 'Basmati Rice', 'Brown Rice',
  'Bulgur', 'Couscous', 'Farro', 'Jasmine Rice', 'Millet', 'Oats',
  'Polenta', 'Quinoa', 'Rice', 'Sticky Rice', 'Wild Rice',

  // --- Baked Goods & Doughs ---
  'Bagel', 'Baguette', 'Bread', 'Bread Crumbs', 'Bun', 'Brioche', 'Ciabatta',
  'Crackers', 'Croissant', 'English Muffin', 'Flatbread', 'Focaccia', 'Naan',
  'Pita', 'Pretzel', 'Sourdough', 'Toast', 'Tortilla', 'Phyllo Dough',
  'Puff Pastry', 'Pizza Dough', 'Cake Mix', 'Brownie Mix',

  // --- Legumes ---
  'Black Beans', 'Borlotti Beans', 'Chickpeas', 'Kidney Beans', 'Lentils',
  'Lima Beans', 'Pinto Beans', 'Soybeans', 'Split Peas', 'White Beans',

  // --- Canned & Jarred ---
  'Canned Beans', 'Canned Chickpeas', 'Canned Coconut Milk', 'Canned Corn',
  'Canned Peas', 'Canned Tomatoes', 'Canned Tuna', 'Tomato Paste', 'Tomato Sauce',

  // --- Pantry Staples & Baking ---
  'Baking Powder', 'Baking Soda', 'Balsamic Vinegar', 'Brown Sugar',
  'Coconut Oil', 'Corn Flour', 'Cornstarch', 'Flour', 'Honey', 'Icing Sugar',
  'Maple Syrup', 'Molasses', 'Mustard', 'Olive Oil', 'Peanut Butter',
  'Salt', 'Soy Sauce', 'Sugar', 'Vegetable Oil', 'Vinegar',
  'Worcestershire Sauce', 'Vanilla Extract', 'Almond Extract',

  // --- Spices & Seasonings ---
  'Allspice', 'Basil', 'Berbere', 'Cardamom', 'Cinnamon', 'Cloves',
  'Coriander', 'Cumin', 'Curry Powder', 'Fenugreek', 'Five Spice Powder',
  'Harissa', 'Lavender', 'Nutmeg', 'Oregano', 'Paprika', 'Ras el Hanout',
  'Rosemary', 'Saffron', 'Smoked Paprika', 'Star Anise', 'Sumac', 'Thyme',
  'Turmeric', 'Chili Powder', 'Hot Sauce', 'Sriracha',

  // --- Sauces, Oils & Pastes ---
  'BBQ Sauce', 'Chili Sauce', 'Fish Sauce', 'Hoisin Sauce', 'Ketchup',
  'Miso Paste', 'Oyster Sauce', 'Pesto', 'Pesto Rosso', 'Sesame Oil',
  'Tahini', 'Gochujang', 'Curry Paste', 'Tomato Ketchup',

  // --- Frozen ---
  'Frozen Berries', 'Frozen Peas', 'Frozen Pizza', 'Frozen Spinach',

  // --- Nuts, Seeds & Snacks ---
  'Cashews', 'Hazelnuts', 'Macadamia Nuts', 'Nuts', 'Pine Nuts',
  'Pistachios', 'Pumpkin Seeds', 'Sunflower Seeds', 'Trail Mix', 'Granola',

  // --- Sweets & Confectionery ---
  'Chocolate', 'Dark Chocolate', 'White Chocolate', 'Cocoa Powder',
  'Cocoa Nibs', 'Jam', 'Marzipan',

  // --- Beverages ---
  'Coffee', 'Tea', 'Coconut Water', 'Energy Drink',
];

/**
 * Convenience type representing any valid ingredient name from {@link INGREDIENT_NAMES}.
 *
 * This is optional but useful if you ever want strict typing for
 * ingredient name properties.
 */
export type IngredientName = (typeof INGREDIENT_NAMES)[number];
