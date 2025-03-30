import categories from './categories';
import { Product } from '../types/types';

const products: Product[] = [
  // Electronics (Category 1)
  {
    id: 1,
    name: 'Smartphone Pro X',
    price: 999.99,
    imagePath: '',
    description:
      'Latest flagship smartphone with advanced camera and long battery life.\n' +
      'Features a stunning 6.7" OLED display with 120Hz refresh rate.\n' +
      'Equipped with a professional-grade camera system for breathtaking photos.\n' +
      'All-day battery life with fast charging capabilities.',
    category: categories[0],
  },
  {
    id: 2,
    name: 'Wireless Headphones',
    price: 199.99,
    imagePath: '',
    description:
      'Noise-cancelling wireless headphones with premium sound quality.\n' +
      'Industry-leading noise cancellation technology blocks out ambient sounds.\n' +
      'Up to 30 hours of battery life on a single charge.\n' +
      'Comfortable over-ear design for extended listening sessions.',
    category: categories[0],
  },
  {
    id: 3,
    name: 'Smart Watch Series 5',
    price: 349.99,
    imagePath: '',
    description:
      'Advanced smartwatch with health monitoring and GPS.\n' +
      'Tracks heart rate, blood oxygen, and sleep patterns with medical-grade accuracy.\n' +
      'Water-resistant design suitable for swimming and workouts.\n' +
      'Customizable watch faces and interchangeable bands for any style.',
    category: categories[0],
  },
  {
    id: 4,
    name: 'Laptop Ultra',
    price: 1299.99,
    imagePath: '',
    description:
      'Thin and powerful laptop with high-resolution display.\n' +
      'Latest-generation processor handles demanding applications with ease.\n' +
      'Stunning edge-to-edge display with vibrant colors and sharp details.\n' +
      'All-day battery life in an ultra-thin, lightweight design.',
    category: categories[0],
  },
  {
    id: 5,
    name: 'Bluetooth Speaker',
    price: 79.99,
    imagePath: '',
    description:
      'Portable speaker with rich sound and long battery life.\n' +
      'Delivers 360-degree sound that fills any room or outdoor space.\n' +
      'Waterproof design perfect for beach trips and pool parties.\n' +
      'Simple one-touch pairing with all your favorite devices.',
    category: categories[0],
  },
  {
    id: 6,
    name: 'Wireless Earbuds',
    price: 129.99,
    imagePath: '',
    description:
      'Compact earbuds with noise isolation and water resistance.\n' +
      'True wireless design with no cords to tangle or restrict movement.\n' +
      'Active noise cancellation creates an immersive listening experience.\n' +
      'Ergonomic fit designed for comfort during extended wear.',
    category: categories[0],
  },

  // Clothing (Category 2)
  {
    id: 7,
    name: 'Casual T-Shirt',
    price: 24.99,
    imagePath: '',
    description:
      'Comfortable cotton t-shirt for everyday wear.\n' +
      'Made from premium organic cotton for superior softness.\n' +
      'Pre-shrunk fabric maintains its shape wash after wash.\n' +
      'Available in a variety of trendy colors and sizes.',
    category: categories[1],
  },
  {
    id: 8,
    name: 'Denim Jeans',
    price: 59.99,
    imagePath: '',
    description:
      'Classic fit jeans with durable denim fabric.\n' +
      'Crafted from high-quality denim with just the right amount of stretch.\n' +
      'Reinforced stitching at stress points for enhanced durability.\n' +
      'Versatile style that pairs perfectly with any casual outfit.',
    category: categories[1],
  },
  {
    id: 9,
    name: 'Winter Jacket',
    price: 149.99,
    imagePath: '',
    description:
      'Insulated jacket for cold weather protection.\n' +
      'Advanced thermal technology traps body heat while remaining breathable.\n' +
      'Water-resistant outer shell keeps you dry in light rain and snow.\n' +
      'Multiple pockets provide ample storage for essentials.',
    category: categories[1],
  },
  {
    id: 10,
    name: 'Running Shoes',
    price: 89.99,
    imagePath: '',
    description:
      'Lightweight shoes designed for runners with cushioned soles.\n' +
      'Responsive cushioning returns energy with every stride.\n' +
      'Breathable mesh upper keeps feet cool during intense workouts.\n' +
      'Durable rubber outsole provides exceptional traction on any surface.',
    category: categories[1],
  },
  {
    id: 11,
    name: 'Formal Shirt',
    price: 49.99,
    imagePath: '',
    description:
      'Wrinkle-resistant dress shirt for professional settings.\n' +
      'Premium cotton blend fabric maintains a crisp, polished appearance all day.\n' +
      'Modern slim fit design flatters your silhouette without restricting movement.\n' +
      'Easy-care technology means less time ironing and more time looking your best.',
    category: categories[1],
  },
  {
    id: 12,
    name: 'Summer Dress',
    price: 39.99,
    imagePath: '',
    description:
      'Light and breezy dress perfect for warm weather.\n' +
      'Breathable fabric keeps you cool even on the hottest summer days.\n' +
      'Flattering A-line silhouette suits all body types.\n' +
      'Versatile enough for beach outings or casual evening events.',
    category: categories[1],
  },

  // Home & Kitchen (Category 3)
  {
    id: 13,
    name: 'Coffee Maker',
    price: 79.99,
    imagePath: '',
    description:
      'Programmable coffee maker with built-in grinder.\n' +
      'Freshly grinds whole beans moments before brewing for maximum flavor.\n' +
      'Customizable brewing strength from light to bold to suit your taste.\n' +
      'Timer function ensures your coffee is ready when you wake up.',
    category: categories[2],
  },
  {
    id: 14,
    name: 'Non-stick Cookware Set',
    price: 129.99,
    imagePath: '',
    description:
      'Complete set of pans and pots with durable non-stick coating.\n' +
      'Triple-layer non-stick surface requires minimal oil for healthier cooking.\n' +
      'Heat-resistant handles stay cool during stovetop use for safe handling.\n' +
      'Dishwasher safe design makes cleanup quick and effortless.',
    category: categories[2],
  },
  {
    id: 15,
    name: 'Blender Pro',
    price: 69.99,
    imagePath: '',
    description:
      'High-speed blender for smoothies and food preparation.\n' +
      'Powerful motor pulverizes even the toughest ingredients in seconds.\n' +
      'Variable speed settings give you precise control for any recipe.\n' +
      'Durable stainless steel blades maintain sharpness for years of use.',
    category: categories[2],
  },
  {
    id: 16,
    name: 'Bedding Set',
    price: 89.99,
    imagePath: '',
    description:
      'Soft cotton bedding set with pillowcases and duvet cover.\n' +
      'Luxuriously soft 400 thread count Egyptian cotton for a hotel-quality feel.\n' +
      'Hypoallergenic materials ideal for sensitive skin and allergy sufferers.\n' +
      'Elegant design adds a touch of sophistication to any bedroom.',
    category: categories[2],
  },
  {
    id: 17,
    name: 'Smart Thermostat',
    price: 199.99,
    imagePath: '',
    description:
      'Wi-Fi enabled thermostat that learns your preferences.\n' +
      'Intelligent sensors automatically adjust temperature based on occupancy.\n' +
      'Energy-saving features can reduce heating and cooling costs by up to 20%.\n' +
      'Simple smartphone control allows adjustment from anywhere in the world.',
    category: categories[2],
  },
  {
    id: 18,
    name: 'LED Desk Lamp',
    price: 39.99,
    imagePath: '',
    description:
      'Adjustable desk lamp with multiple brightness settings.\n' +
      'Eye-friendly LED technology prevents strain during long work sessions.\n' +
      'Flexible arm positions light exactly where you need it.\n' +
      'Energy-efficient design uses 75% less electricity than traditional bulbs.',
    category: categories[2],
  },

  // Sports & Outdoors (Category 4)
  {
    id: 19,
    name: 'Yoga Mat',
    price: 29.99,
    imagePath: '',
    description:
      'Non-slip yoga mat made from eco-friendly materials.\n' +
      'Extra-thick cushioning protects joints during floor exercises.\n' +
      'Textured surface provides superior grip even during intense sessions.\n' +
      'Lightweight and portable with included carrying strap.',
    category: categories[3],
  },
  {
    id: 20,
    name: 'Mountain Bike',
    price: 499.99,
    imagePath: '',
    description:
      'Durable bike designed for off-road trails and rough terrain.\n' +
      'Responsive suspension system absorbs impacts for a smoother ride.\n' +
      'Precision gear shifting allows effortless climbing on steep inclines.\n' +
      'Rugged frame constructed to withstand years of adventure.',
    category: categories[3],
  },
  {
    id: 21,
    name: 'Camping Tent',
    price: 149.99,
    imagePath: '',
    description:
      'Waterproof tent that comfortably fits four people.\n' +
      'Quick-setup design allows one person to assemble in under 5 minutes.\n' +
      'Double-layer construction with sealed seams keeps you dry in any weather.\n' +
      'Reinforced stakes and guy lines ensure stability in windy conditions.',
    category: categories[3],
  },
  {
    id: 22,
    name: 'Fitness Tracker',
    price: 79.99,
    imagePath: '',
    description:
      'Wearable device that monitors activity, sleep, and heart rate.\n' +
      'Advanced sensors provide detailed metrics for over 20 different workout types.\n' +
      'Sleep analysis helps optimize your rest for better recovery and performance.\n' +
      'Multi-day battery life means less charging and more tracking.',
    category: categories[3],
  },
  {
    id: 23,
    name: 'Basketball',
    price: 24.99,
    imagePath: '',
    description:
      'Official size basketball with superior grip.\n' +
      'Premium composite leather provides excellent feel and control.\n' +
      'Deep channel design enhances grip for more accurate passing and shooting.\n' +
      'Durable construction stands up to intense indoor or outdoor play.',
    category: categories[3],
  },
  {
    id: 24,
    name: 'Hiking Backpack',
    price: 79.99,
    imagePath: '',
    description:
      'Spacious backpack with multiple compartments for hiking essentials.\n' +
      'Ergonomic design with padded straps distributes weight evenly for comfort.\n' +
      'Integrated hydration system compatible with most water reservoirs.\n' +
      'Weather-resistant materials protect your gear in changing conditions.',
    category: categories[3],
  },

  // Books (Category 5)
  {
    id: 25,
    name: 'The Art of Programming',
    price: 34.99,
    imagePath: '',
    description:
      'Comprehensive guide to modern programming techniques.\n' +
      'Clear explanations of complex concepts make learning accessible for all levels.\n' +
      'Includes practical examples and exercises to reinforce understanding.\n' +
      'Written by industry experts with decades of combined experience.',
    category: categories[4],
  },
  {
    id: 26,
    name: 'Cooking Masterclass',
    price: 29.99,
    imagePath: '',
    description:
      'Recipe collection from world-renowned chefs.\n' +
      'Step-by-step instructions make even complex dishes approachable.\n' +
      'Beautiful food photography inspires your culinary creativity.\n' +
      'Includes special sections on ingredient selection and kitchen techniques.',
    category: categories[4],
  },
  {
    id: 27,
    name: 'Business Strategy',
    price: 24.99,
    imagePath: '',
    description:
      'Insights into successful business strategies and leadership.\n' +
      'Case studies from Fortune 500 companies illustrate key concepts.\n' +
      'Practical frameworks you can apply immediately to your organization.\n' +
      'Written by a leading business consultant with global experience.',
    category: categories[4],
  },
  {
    id: 28,
    name: 'Science Fiction Anthology',
    price: 19.99,
    imagePath: '',
    description:
      'Collection of award-winning science fiction short stories.\n' +
      'Features works from both established masters and emerging voices.\n' +
      'Explores thought-provoking themes about technology and humanity.\n' +
      'Includes exclusive author interviews and commentary.',
    category: categories[4],
  },
  {
    id: 29,
    name: 'Photography Guide',
    price: 39.99,
    imagePath: '',
    description:
      'Practical techniques for amateur and professional photographers.\n' +
      'Covers everything from basic composition to advanced lighting setups.\n' +
      'Illustrated with stunning examples that demonstrate each concept.\n' +
      'Includes tips for getting the most from both smartphone and DSLR cameras.',
    category: categories[4],
  },
  {
    id: 30,
    name: 'Historical Biography',
    price: 27.99,
    imagePath: '',
    description:
      'Fascinating account of an influential historical figure.\n' +
      'Meticulously researched with access to previously unpublished materials.\n' +
      'Provides rich context to understand the era and its challenges.\n' +
      'Humanizes its subject through personal letters and firsthand accounts.',
    category: categories[4],
  },
];

export default products;
