/*=============== TRACK QUANTITY BUTTONS ===============*/

const numElement = document.querySelector('.num');
const priceElement = document.getElementById('productPrice');
var actualProductPrice = parseFloat(priceElement.innerHTML);
var a =  parseInt(numElement.innerHTML);
var currentProductPrice = calculateTotalPrice(actualProductPrice, a);

function calculateTotalPrice(actualPrice, quantity) {
    // Ensure both inputs are valid numbers
    if (typeof actualPrice !== 'number' || typeof quantity !== 'number' || isNaN(actualPrice) || isNaN(quantity)) {
        return "Invalid input. Please provide valid numbers.";
    }

    // Calculate total price
    var totalPrice = actualPrice * quantity;
    
    // Return the total price
    return totalPrice.toFixed(2);
}

const plus = document.querySelector(".plus"), minus = document.querySelector(".minus"), num = document.querySelector(".num");

plus.addEventListener("click", () => {
    let prodPrice = document.getElementById('productPrice');
    if(a == 1)
        actualProductPrice = parseFloat(prodPrice.innerHTML);

    a++;
    a = a < 10 ? "0" + a : a;
    num.innerText = a;
    // Updating Price
    let calculatedPrice = calculateTotalPrice(actualProductPrice, parseInt(num.innerText));
    // currentProductPrice = calculatedPrice.toFixed(2);
    prodPrice.textContent =  calculatedPrice;
});

minus.addEventListener("click", () => {
    let prodPrice = document.getElementById('productPrice');
    if(a == 1)
        actualProductPrice = parseFloat(prodPrice.innerHTML);;

    if (a > 1) {
    a--;
    a = a < 10 ? "0" + a : a;
    num.innerText = a;
    let calculatedPrice = calculateTotalPrice(actualProductPrice, parseInt(num.innerText));
    // currentProductPrice = calculatedPrice.toFixed(2);
    prodPrice.textContent = calculatedPrice;
    }
});

// Function to set cart data in a cookie
function setCartData(cartData) {
    document.cookie = `cart=${JSON.stringify(cartData)}; path=/`;
}

// Function to get cart data from the cookie
function getCartData() {
    const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)cart\s*=\s*([^;]*).*$)|^.*$/, "$1");
    return cookieValue ? JSON.parse(cookieValue) : {};
}

// Example usage:
// Add item to cart
function addItemToCart(event) {
    itemId = event.dataset.sku;
    const cartData = getCartData();

    // Get Current Quantity of Product
    const quantity = parseInt(a);

    cartData[itemId] = quantity;
    setCartData(cartData);
    UpdateCart()
}

// Remove item from cart
function removeItemFromCart(itemId) {
    const cartData = getCartData();
    if (cartData[itemId]) {
        delete cartData[itemId];
        setCartData(cartData);
    }
}