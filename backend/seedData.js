const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

// Sample products data
const sampleProducts = [
  {
    name: "Men's Cotton T-Shirt",
    nameUz: "Erkaklar uchun paxta futbolka",
    description: "Comfortable cotton t-shirt perfect for daily wear",
    descriptionUz: "Kundalik kiyish uchun qulay paxta futbolka",
    price: 75000,
    originalPrice: 95000,
    category: "kiyim",
    subcategory: "futbolka",
    brand: "Uzbek Cotton",
    sizes: [
      { size: "S", stock: 10 },
      { size: "M", stock: 15 },
      { size: "L", stock: 12 },
      { size: "XL", stock: 8 }
    ],
    colors: ["oq", "qora", "ko'k", "yashil"],
    images: [
      { url: "/uploads/sample-tshirt.jpg", alt: "Men's Cotton T-Shirt" }
    ],
    tags: ["erkaklar", "futbolka", "paxta", "kundalik"],
    isFeatured: true,
    specifications: {
      material: "100% Paxta",
      weight: "180g",
      careInstructions: "30°C da yuvish mumkin"
    }
  },
  {
    name: "Women's Elegant Dress",
    nameUz: "Ayollar uchun nafis ko'ylak",
    description: "Beautiful elegant dress for special occasions",
    descriptionUz: "Maxsus tadbirlar uchun chiroyli nafis ko'ylak",
    price: 350000,
    originalPrice: 450000,
    category: "kiyim",
    subcategory: "koylak",
    brand: "Elegant Style",
    sizes: [
      { size: "XS", stock: 5 },
      { size: "S", stock: 8 },
      { size: "M", stock: 12 },
      { size: "L", stock: 7 }
    ],
    colors: ["qora", "qizil", "ko'k", "pushti"],
    images: [
      { url: "/uploads/sample-dress.jpg", alt: "Women's Elegant Dress" }
    ],
    tags: ["ayollar", "koylak", "nafis", "maxsus"],
    isFeatured: true,
    specifications: {
      material: "Polyester va Elastan",
      weight: "250g",
      careInstructions: "Quruq tozalash tavsiya etiladi"
    }
  },
  {
    name: "Sport Running Shoes",
    nameUz: "Sport yugurish poyabzali",
    description: "High-quality running shoes for athletes",
    descriptionUz: "Sportchilar uchun yuqori sifatli yugurish poyabzali",
    price: 450000,
    originalPrice: 550000,
    category: "poyabzal",
    subcategory: "sport",
    brand: "RunFast",
    sizes: [
      { size: "39", stock: 6 },
      { size: "40", stock: 10 },
      { size: "41", stock: 8 },
      { size: "42", stock: 12 },
      { size: "43", stock: 9 },
      { size: "44", stock: 5 }
    ],
    colors: ["qora-oq", "ko'k", "qizil"],
    images: [
      { url: "/uploads/sample-shoes.jpg", alt: "Sport Running Shoes" }
    ],
    tags: ["poyabzal", "sport", "yugurish", "atletika"],
    isFeatured: true,
    specifications: {
      material: "Sintetik material va mesh",
      weight: "320g",
      careInstructions: "Yumshoq cho'tka bilan tozalash"
    }
  },
  {
    name: "Classic Leather Jacket",
    nameUz: "Klassik teri kurtka",
    description: "Genuine leather jacket with classic design",
    descriptionUz: "Klassik dizaynga ega haqiqiy teri kurtka",
    price: 850000,
    category: "kiyim",
    subcategory: "kurtka",
    brand: "Leather Master",
    sizes: [
      { size: "M", stock: 4 },
      { size: "L", stock: 6 },
      { size: "XL", stock: 3 }
    ],
    colors: ["qora", "jigar rang"],
    images: [
      { url: "/uploads/sample-jacket.jpg", alt: "Classic Leather Jacket" }
    ],
    tags: ["kurtka", "teri", "klassik", "kuz"],
    specifications: {
      material: "100% Haqiqiy teri",
      weight: "1.2kg",
      careInstructions: "Maxsus teri parvarishi"
    }
  },
  {
    name: "Casual Jeans",
    nameUz: "Kundalik jinsi shim",
    description: "Comfortable denim jeans for everyday wear",
    descriptionUz: "Kundalik kiyish uchun qulay jinsi shim",
    price: 180000,
    originalPrice: 220000,
    category: "kiyim",
    subcategory: "shim",
    brand: "Denim Pro",
    sizes: [
      { size: "30", stock: 7 },
      { size: "32", stock: 12 },
      { size: "34", stock: 10 },
      { size: "36", stock: 8 },
      { size: "38", stock: 5 }
    ],
    colors: ["ko'k", "qora", "och ko'k"],
    images: [
      { url: "/uploads/sample-jeans.jpg", alt: "Casual Jeans" }
    ],
    tags: ["shim", "jinsi", "kundalik", "qulay"],
    specifications: {
      material: "98% Paxta, 2% Elastan",
      weight: "450g",
      careInstructions: "40°C da yuvish mumkin"
    }
  }
];

// Add more sample products to reach 50
for (let i = 6; i <= 50; i++) {
  const categories = ["kiyim", "poyabzal"];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  
  const subcategories = randomCategory === "kiyim" 
    ? ["futbolka", "koylak", "shim", "kurtka"] 
    : ["sport", "rasmiy", "kundalik"];
  
  const randomSubcategory = subcategories[Math.floor(Math.random() * subcategories.length)];
  
  sampleProducts.push({
    name: `Product ${i}`,
    nameUz: `Mahsulot ${i}`,
    description: `High quality ${randomSubcategory} for modern lifestyle`,
    descriptionUz: `Zamonaviy hayot tarzi uchun yuqori sifatli ${randomSubcategory}`,
    price: Math.floor(Math.random() * 500000) + 50000,
    originalPrice: Math.floor(Math.random() * 200000) + 600000,
    category: randomCategory,
    subcategory: randomSubcategory,
    brand: `Brand ${i}`,
    sizes: [
      { size: "M", stock: Math.floor(Math.random() * 20) + 5 },
      { size: "L", stock: Math.floor(Math.random() * 20) + 5 }
    ],
    colors: ["qora", "oq", "ko'k"],
    images: [
      { url: `/uploads/sample-product-${i}.jpg`, alt: `Product ${i}` }
    ],
    tags: [randomCategory, randomSubcategory, "yangi"],
    isFeatured: Math.random() > 0.8,
    soldCount: Math.floor(Math.random() * 50),
    specifications: {
      material: "Yuqori sifatli material",
      weight: `${Math.floor(Math.random() * 500) + 100}g`,
      careInstructions: "Standart parvarish"
    }
  });
}

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB ga ulandi...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    console.log('Mavjud ma\'lumotlar tozalandi...');

    // Create admin user
    const adminUser = new User({
      name: 'Admin',
      email: 'admin@uzbekshop.uz',
      password: 'admin123',
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin foydalanuvchi yaratildi');

    // Create sample products
    await Product.insertMany(sampleProducts);
    console.log(`${sampleProducts.length} ta namuna mahsulot yaratildi`);

    console.log('Ma\'lumotlar bazasi muvaffaqiyatli to\'ldirildi!');
    console.log('Admin login ma\'lumotlari:');
    console.log('Email: admin@uzbekshop.uz');
    console.log('Parol: admin123');

  } catch (error) {
    console.error('Xatolik:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seed function
seedDatabase();