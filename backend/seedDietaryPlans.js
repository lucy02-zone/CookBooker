const mongoose = require('./config/db');

// Define DietaryPlan schema inline to avoid import issues
const dietaryPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  guidelines: [{ type: String }],
  mealSuggestions: {
    breakfast: [{ type: String }],
    lunch: [{ type: String }],
    dinner: [{ type: String }]
  },
  restrictions: [{ type: String }],
  benefits: [{ type: String }],
  duration: { type: String },
  difficulty: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const DietaryPlan = mongoose.model('DietaryPlan', dietaryPlanSchema);

const sampleDietaryPlans = [
  {
    name: "Keto Diet",
    description: "A low-carb, high-fat diet designed to put your body into ketosis.",
    guidelines: [
      "Limit carbs to 20-50g per day",
      "Focus on healthy fats like avocados, nuts, and olive oil",
      "Include moderate protein from meat, fish, and eggs",
      "Avoid sugars and processed foods"
    ],
    mealSuggestions: {
      breakfast: ["Avocado and eggs", "Keto smoothie with almond milk", "Bacon and cheese omelet"],
      lunch: ["Grilled chicken salad with olive oil dressing", "Tuna salad with mayo", "Steak with broccoli"],
      dinner: ["Salmon with asparagus", "Zucchini noodles with pesto", "Beef stir-fry with low-carb veggies"]
    },
    restrictions: ["No grains", "No sugars", "Limit fruits"],
    benefits: ["Weight loss", "Improved mental clarity", "Reduced inflammation"],
    duration: "4-8 weeks",
    difficulty: "Intermediate"
  },
  {
    name: "Vegan Diet",
    description: "A plant-based diet excluding all animal products.",
    guidelines: [
      "Eat plenty of fruits, vegetables, grains, and legumes",
      "Include nuts, seeds, and plant-based milks",
      "Ensure adequate protein from beans, tofu, and quinoa",
      "Supplement B12 and iron if needed"
    ],
    mealSuggestions: {
      breakfast: ["Oatmeal with fruits and nuts", "Smoothie bowl with plant milk", "Tofu scramble"],
      lunch: ["Quinoa salad with veggies", "Lentil soup", "Veggie wrap with hummus"],
      dinner: ["Stir-fried tofu with veggies", "Chickpea curry", "Grilled vegetable skewers"]
    },
    restrictions: ["No meat", "No dairy", "No eggs", "No honey"],
    benefits: ["Heart health", "Environmental sustainability", "Weight management"],
    duration: "Ongoing",
    difficulty: "Beginner"
  },
  {
    name: "Mediterranean Diet",
    description: "Inspired by traditional Mediterranean eating patterns, rich in fruits, vegetables, and healthy fats.",
    guidelines: [
      "Emphasize fruits, vegetables, whole grains, and legumes",
      "Include fish and poultry in moderation",
      "Use olive oil as primary fat",
      "Limit red meat and sweets"
    ],
    mealSuggestions: {
      breakfast: ["Greek yogurt with honey and nuts", "Whole grain toast with avocado", "Fruit salad"],
      lunch: ["Grilled fish with salad", "Hummus with pita and veggies", "Minestrone soup"],
      dinner: ["Baked chicken with herbs", "Pasta with tomato sauce and veggies", "Grilled salmon with quinoa"]
    },
    restrictions: ["Limit processed foods", "Moderate dairy", "Occasional red meat"],
    benefits: ["Heart health", "Longevity", "Reduced risk of chronic diseases"],
    duration: "Ongoing",
    difficulty: "Beginner"
  }
];

const seedDatabase = async () => {
  try {
    await DietaryPlan.deleteMany(); // Clear existing data
    await DietaryPlan.insertMany(sampleDietaryPlans);
    console.log('Sample dietary plans inserted successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
