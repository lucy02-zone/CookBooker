# TODO: Enhance Dietary Plans Feature

## Backend Updates
- [x] Update DietaryPlan schema in backend/routes/dietaryPlans.js to include:
  - guidelines: Array of strings
  - mealSuggestions: Object with breakfast, lunch, dinner arrays
  - restrictions: Array of strings
  - benefits: Array of strings
  - duration: String (e.g., "4 weeks")
  - difficulty: String (e.g., "Beginner")
- [x] Update GET /api/dietary-plans to return detailed data
- [x] Add GET /api/dietary-plans/:id for individual diet details
- [x] Insert sample detailed data into database for Keto, Vegan, Mediterranean diets

## Frontend Updates
- [x] Modify frontend/src/pages/DietaryPlans.js to display selectable cards
- [x] Add click handler to navigate to /dietary-plans/:id
- [x] Create new component frontend/src/pages/DietaryPlanDetail.js for detailed view
- [x] Add route in frontend/src/App.js for /dietary-plans/:id
- [x] Style the components with proper CSS for good UX
- [x] Add loading and error states

## Testing
- [x] Test selection and navigation
- [x] Test detailed view display
- [x] Ensure no compilation errors
- [x] Verify backend API responses
