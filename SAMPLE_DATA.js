// Sample MongoDB data for testing
// Import this data into MongoDB after creating the collections

// Users Collection
db.users.insertMany([
  {
    _id: ObjectId(),
    username: "admin",
    email: "admin@jmc.com",
    password: "$2a$10$...", // hashed password: admin123
    firstName: "Admin",
    lastName: "User",
    phone: "1234567890",
    address: "123 Admin Street",
    city: "Admin City",
    postalCode: "12345",
    country: "India",
    isAdmin: true,
    avatar: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    username: "john_doe",
    email: "john@example.com",
    password: "$2a$10$...", // hashed password: password123
    firstName: "John",
    lastName: "Doe",
    phone: "9876543210",
    address: "456 Main Street",
    city: "New York",
    postalCode: "10001",
    country: "USA",
    isAdmin: false,
    avatar: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Products Collection - Agriculture Shop
db.products.insertMany([
  {
    _id: ObjectId(),
    name: "Hybrid Wheat Seeds Premium",
    description: "High-yield hybrid wheat seeds with disease resistance. Best for monsoon season planting.",
    price: 450.00,
    category: "Seeds",
    image: "https://via.placeholder.com/300?text=Wheat+Seeds",
    images: [],
    stock: 100,
    rating: 4.7,
    reviews: [],
    sku: "WHEAT-001",
    specifications: {
      yield: "45-50 quintals/hectare",
      duration: "120-130 days",
      moisture: "13% max",
      purity: "99.5%"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Organic Tomato Seeds",
    description: "Premium organic tomato seeds for commercial farming. High germination rate.",
    price: 320.00,
    category: "Seeds",
    image: "https://via.placeholder.com/300?text=Tomato+Seeds",
    images: [],
    stock: 75,
    rating: 4.6,
    reviews: [],
    sku: "TOMATO-001",
    specifications: {
      germination: "92%",
      duration: "50-60 days",
      yield: "30-35 tons/hectare",
      color: "Deep Red"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "NPK Fertilizer 20-20-20",
    description: "Balanced NPK fertilizer for all crops. Contains Nitrogen, Phosphorus, and Potassium in equal ratio.",
    price: 550.00,
    category: "Fertilizers",
    image: "https://via.placeholder.com/300?text=NPK+Fertilizer",
    images: [],
    stock: 150,
    rating: 4.8,
    reviews: [],
    sku: "NPK-001",
    specifications: {
      nitrogen: "20%",
      phosphorus: "20%",
      potassium: "20%",
      weight: "50 kg",
      coverage: "2-3 acres"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Urea Fertilizer Premium Grade",
    description: "High-nitrogen urea fertilizer for cereal crops. Promotes vigorous leaf growth.",
    price: 280.00,
    category: "Fertilizers",
    image: "https://via.placeholder.com/300?text=Urea+Fertilizer",
    images: [],
    stock: 120,
    rating: 4.6,
    reviews: [],
    sku: "UREA-001",
    specifications: {
      nitrogen: "46%",
      weight: "50 kg",
      solubility: "100%",
      purity: "99.8%"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Systemic Pesticide Concentrate",
    description: "Broad-spectrum systemic pesticide for controlling insects and pests. Safe for vegetables.",
    price: 420.00,
    category: "Pesticides",
    image: "https://via.placeholder.com/300?text=Pesticide",
    images: [],
    stock: 80,
    rating: 4.5,
    reviews: [],
    sku: "PEST-001",
    specifications: {
      activeIngredient: "Imidacloprid 70%",
      volume: "1 Liter",
      coverage: "5-10 acres",
      safety: "Class III"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Neem Oil Organic Pesticide",
    description: "100% natural neem oil pesticide. Organic certified, safe for all crops and livestock.",
    price: 650.00,
    category: "Pesticides",
    image: "https://via.placeholder.com/300?text=Neem+Oil",
    images: [],
    stock: 60,
    rating: 4.9,
    reviews: [],
    sku: "NEEM-001",
    specifications: {
      purity: "100% Pure",
      volume: "5 Liters",
      organic: "Certified",
      coverage: "10-15 acres"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Cabbage Hybrid Seeds F1",
    description: "Premium hybrid F1 cabbage seeds with uniform head size and excellent storage quality.",
    price: 380.00,
    category: "Seeds",
    image: "https://via.placeholder.com/300?text=Cabbage+Seeds",
    images: [],
    stock: 90,
    rating: 4.7,
    reviews: [],
    sku: "CAB-001",
    specifications: {
      germination: "95%",
      duration: "65-75 days",
      yield: "25-30 tons/hectare",
      color: "Green"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Potassium Chloride Fertilizer",
    description: "High-quality potassium fertilizer for improving fruit quality and crop yield. Ideal for vegetables.",
    price: 320.00,
    category: "Fertilizers",
    image: "https://via.placeholder.com/300?text=Potassium+Fertilizer",
    images: [],
    stock: 100,
    rating: 4.6,
    reviews: [],
    sku: "POT-001",
    specifications: {
      potassium: "60%",
      weight: "50 kg",
      solubility: "High",
      purity: "99%"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Fungicide Copper Sulphate",
    description: "Copper-based fungicide for controlling fungal diseases in vegetables and fruits.",
    price: 280.00,
    category: "Pesticides",
    image: "https://via.placeholder.com/300?text=Fungicide",
    images: [],
    stock: 70,
    rating: 4.5,
    reviews: [],
    sku: "FUNG-001",
    specifications: {
      activeIngredient: "Copper Sulphate 50%",
      weight: "500g",
      coverage: "3-5 acres",
      effectiveness: "85-90%"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Notes:
// 1. Replace ObjectId() with actual MongoDB ObjectIds when importing
// 2. Passwords shown are hashed bcryptjs hashes
// 3. Use MongoDB Compass or mongoimport tool to insert this data
// 4. Image URLs are placeholders - replace with actual product images
// 5. All products are agriculture-based: Seeds, Fertilizers, and Pesticides
