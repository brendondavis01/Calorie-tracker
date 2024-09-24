document.addEventListener('DOMContentLoaded', loadMealsFromStorage);
document.getElementById('meal-form').addEventListener('submit', addMeal);

let totalCalories = 0;

// Predefined database for automatic calorie lookup
const calorieDatabase = {
    "Chicken Salad": 350,
    "Apple": 95,
    "Banana": 105,
    "Rice": 206,
    "Egg": 78,
    "Orange": 62
};

function addMeal(e) {
    e.preventDefault();

    const mealName = document.getElementById('meal-name').value;
    let calorieValue = parseInt(document.getElementById('calories').value);

    // If no calories are manually entered, check in the predefined database
    if (isNaN(calorieValue)) {
        calorieValue = calorieDatabase[mealName] || 0; // Use 0 if not found
    }

    if (calorieValue === 0) {
        alert("Calorie value not found for this meal. Please enter manually.");
        return;
    }

    const meal = {
        name: mealName,
        calories: calorieValue
    };

    // Save meal in local storage
    saveMealToLocalStorage(meal);

    // Add meal to UI
    appendMealToList(meal);
    updateTotalCalories(calorieValue);

    // Clear the form
    document.getElementById('meal-form').reset();
}

function appendMealToList(meal) {
    const li = document.createElement('li');
    li.innerHTML = `${meal.name} - ${meal.calories} kcal 
                    <button class="delete-btn" onclick="deleteMeal(this, ${meal.calories}, '${meal.name}')">X</button>`;
    document.getElementById('meal-list').appendChild(li);
}

function updateTotalCalories(calorieValue) {
    totalCalories += calorieValue;
    document.getElementById('total-calories').innerText = totalCalories;
}

function deleteMeal(button, calorieValue, mealName) {
    const li = button.parentElement;
    li.remove();

    totalCalories -= calorieValue;
    document.getElementById('total-calories').innerText = totalCalories;

    // Remove meal from local storage
    removeMealFromLocalStorage(mealName);
}

function saveMealToLocalStorage(meal) {
    let meals = JSON.parse(localStorage.getItem('meals')) || [];
    meals.push(meal);
    localStorage.setItem('meals', JSON.stringify(meals));
}

function loadMealsFromStorage() {
    let meals = JSON.parse(localStorage.getItem('meals')) || [];
    meals.forEach(meal => {
        appendMealToList(meal);
        updateTotalCalories(meal.calories);
    });
}

function removeMealFromLocalStorage(mealName) {
    let meals = JSON.parse(localStorage.getItem('meals')) || [];
    meals = meals.filter(meal => meal.name !== mealName);
    localStorage.setItem('meals', JSON.stringify(meals));
}