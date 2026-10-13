// ----- The built-in meal collection -----
// Each meal has an id, a name, tags (used to match what people like)
// and a list of ingredients (used to build the shopping list).
// To add a meal, copy one block and change it. Ids must be unique.

const TAGS = ["Chicken", "Beef", "Pork", "Fish", "Vegetarian", "Pasta", "Rice", "Quick"];

const MEALS = [
  { id: "m1",  name: "Chicken stir fry",         tags: ["Chicken", "Rice", "Quick"],      ingredients: ["chicken breast", "peppers", "onion", "soy sauce", "rice"] },
  { id: "m2",  name: "Spaghetti bolognese",      tags: ["Beef", "Pasta"],                 ingredients: ["minced beef", "spaghetti", "chopped tomatoes", "onion", "garlic"] },
  { id: "m3",  name: "Vegetable curry",          tags: ["Vegetarian", "Rice"],            ingredients: ["chickpeas", "coconut milk", "curry paste", "spinach", "onion", "rice"] },
  { id: "m4",  name: "Salmon with potatoes",     tags: ["Fish"],                          ingredients: ["salmon fillets", "potatoes", "green beans", "lemon"] },
  { id: "m5",  name: "Chicken fajitas",          tags: ["Chicken", "Quick"],              ingredients: ["chicken breast", "peppers", "onion", "tortilla wraps", "fajita seasoning"] },
  { id: "m6",  name: "Mac and cheese",           tags: ["Vegetarian", "Pasta"],           ingredients: ["macaroni", "cheddar cheese", "milk", "butter", "flour"] },
  { id: "m7",  name: "Beef chilli",              tags: ["Beef", "Rice"],                  ingredients: ["minced beef", "kidney beans", "chopped tomatoes", "onion", "chilli powder", "rice"] },
  { id: "m8",  name: "Pork sausages and mash",   tags: ["Pork"],                          ingredients: ["pork sausages", "potatoes", "peas", "gravy granules", "butter"] },
  { id: "m9",  name: "Tuna pasta bake",          tags: ["Fish", "Pasta"],                 ingredients: ["tinned tuna", "pasta", "sweetcorn", "cheddar cheese", "chopped tomatoes"] },
  { id: "m10", name: "Veggie omelette",          tags: ["Vegetarian", "Quick"],           ingredients: ["eggs", "peppers", "mushrooms", "cheddar cheese"] },
  { id: "m11", name: "Chicken fried rice",       tags: ["Chicken", "Rice", "Quick"],      ingredients: ["chicken breast", "rice", "eggs", "peas", "soy sauce", "spring onions"] },
  { id: "m12", name: "Pesto pasta",              tags: ["Vegetarian", "Pasta", "Quick"],  ingredients: ["pasta", "pesto", "cherry tomatoes", "parmesan"] },
  { id: "m13", name: "Fish tacos",               tags: ["Fish", "Quick"],                 ingredients: ["white fish fillets", "tortilla wraps", "cabbage", "lime", "sour cream"] },
  { id: "m14", name: "Roast chicken dinner",     tags: ["Chicken"],                       ingredients: ["whole chicken", "potatoes", "carrots", "broccoli", "gravy granules"] },
  { id: "m15", name: "Beef burgers",             tags: ["Beef", "Quick"],                 ingredients: ["minced beef", "burger buns", "lettuce", "tomatoes", "cheddar cheese"] },
  { id: "m16", name: "Lentil soup",              tags: ["Vegetarian"],                    ingredients: ["red lentils", "carrots", "onion", "vegetable stock", "bread"] },
  { id: "m17", name: "Pork stir fry noodles",    tags: ["Pork", "Quick"],                 ingredients: ["pork strips", "egg noodles", "peppers", "soy sauce", "spring onions"] },
  { id: "m18", name: "Chicken curry",            tags: ["Chicken", "Rice"],               ingredients: ["chicken thighs", "curry paste", "chopped tomatoes", "onion", "rice"] },
  { id: "m19", name: "Cottage pie",               tags: ["Beef"],                          ingredients: ["minced beef", "potatoes", "carrots", "peas", "onion", "butter"] },
  { id: "m20", name: "Prawn linguine",           tags: ["Fish", "Pasta", "Quick"],        ingredients: ["prawns", "linguine", "garlic", "cherry tomatoes", "chilli flakes"] },
  { id: "m21", name: "Bean burritos",            tags: ["Vegetarian", "Rice"],            ingredients: ["black beans", "tortilla wraps", "rice", "cheddar cheese", "salsa"] },
  { id: "m22", name: "Chicken caesar wraps",     tags: ["Chicken", "Quick"],              ingredients: ["chicken breast", "tortilla wraps", "lettuce", "caesar dressing", "parmesan"] },
  { id: "m23", name: "Pork chops with veg",      tags: ["Pork"],                          ingredients: ["pork chops", "potatoes", "broccoli", "apples"] },
  { id: "m24", name: "Mushroom risotto",         tags: ["Vegetarian", "Rice"],            ingredients: ["risotto rice", "mushrooms", "onion", "vegetable stock", "parmesan"] },
  { id: "m25", name: "Baked cod and chips",      tags: ["Fish"],                          ingredients: ["cod fillets", "potatoes", "peas", "lemon"] },
  { id: "m26", name: "Lasagne",                  tags: ["Beef", "Pasta"],                 ingredients: ["minced beef", "lasagne sheets", "chopped tomatoes", "milk", "cheddar cheese", "onion"] },
  { id: "m27", name: "Halloumi and veg traybake", tags: ["Vegetarian"],                   ingredients: ["halloumi", "peppers", "courgette", "red onion", "couscous"] },
  { id: "m28", name: "Teriyaki salmon rice bowl", tags: ["Fish", "Rice", "Quick"],        ingredients: ["salmon fillets", "rice", "teriyaki sauce", "broccoli", "spring onions"] },
];
