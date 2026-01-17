//var ServerIP = 'http://localhost'  // Change IP (for Debugging)
var ServerIP = 'http://192.168.77.176'  // Change IP (for live, use network IP e.g 192.198.x.x)
                                        // Make sure this network IP is added into Chrome flag (Desktop and mobile both)

let searchForm = document.querySelector('.search-form');
let cart = document.querySelector('.shopping-cart');
let loginForm = document.querySelector('.login-form');
let navbar = document.querySelector('.navbar');
let createForm = document.querySelector('.create-form');
let SignOut = document.querySelector('.SignOut-div');

document.querySelector('#search-btn').onclick = () => {
    searchForm.classList.toggle('active');
    
    cart.classList.remove('active');
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
    createForm.classList.remove('active');
    SignOut.classList.toggle('active');
}

document.querySelector('#cart-btn').onclick = () =>{
    cart.classList.toggle('active');
    searchForm.classList.remove('active');
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
    createForm.classList.remove('active');
}

document.querySelector('#login-btn').onclick = () => {
    loginForm.classList.toggle('active');
    searchForm.classList.remove('active');
    cart.classList.remove('active');
    navbar.classList.remove('active');
    createForm.classList.remove('active');
}

try{
    document.querySelector('#create-btn').onclick = () => {
        createForm.classList.toggle('active');
        searchForm.classList.remove('active');
        cart.classList.remove('active');
        navbar.classList.remove('active');
        loginForm.classList.remove('active');
    }
} catch(error) {
    console.log("element not found!");
}


document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    cart.classList.remove('active');
    loginForm.classList.remove('active');
    createForm.classList.remove('active');
}

try {
    window.onscroll = () =>{
        searchForm.classList.remove('active');
        cart.classList.remove('active');
        loginForm.classList.remove('active');
        navbar.classList.remove('active');
        if(createForm)
            createForm.classList.remove('active');
    }
} catch(error) {
    console.log("Element not found!")
}



let slides = document.querySelectorAll('.home .slides-container .slide');
let index = 0;

function next(){
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
}

function prev(){
    slides[index].classList.remove('active');
    index = (index - 1 + slides.length) % slides.length;
    slides[index].classList.add('active');
}

function loginBtn() {
    loginForm.classList.toggle('active');
    searchForm.classList.remove('active');
    cart.classList.remove('active');
    navbar.classList.remove('active');
    createForm.classList.remove('active');
}

// ---------------------------- Base Functions ----------------------------
// // Function to set cart data in a cookie
// function setCartData(cartData) {
//     document.cookie = `cart=${JSON.stringify(cartData)}; path=/`;
// }

// // Function to get cart data from the cookie
// function getCartData() {
//     const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)cart\s*=\s*([^;]*).*$)|^.*$/, "$1");
//     return cookieValue ? JSON.parse(cookieValue) : {};
// }
function getCartCookie(name) {
    // const name = 'cart=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for(let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return ''; // Return an empty string if the 'cart' cookie is not found
}

async function UpdateCart() {
    
    let Cookie = getCartCookie('cart=');
    if(Cookie != "") {
        // let CookieName = Cookie[0];
        Cookie = JSON.parse(Cookie);
        if (Cookie) {
            try {
                const currentPort = window.location.port;
                const apiUrl = `${ServerIP}:${currentPort}/readProductList`;
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        Cart: Cookie,
                    }),
                });
                
                if (!response.ok) {
                    console.log("Token verification failed!");
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if(data) {
                    let lastElement = data.pop();

                    // console.log("Add into Cart")
                    const cartElement = document.getElementById('productsInCart');
                    cartElement.innerHTML = '';
                    for(i = 0; i<data.length; i++) {
                        // Adding into Cart
                        // console.log(data[i]);

                        document.createElement("div");
                        const boxDiv = document.createElement('div');
                        boxDiv.classList.add('box');

                        // Create the close icon element
                        const closeIcon = document.createElement('i');
                        closeIcon.classList.add('fas', 'fa-times');
                        closeIcon.dataset.sku = data[i].SKU;
                        // closeIcon.onclick = removeItemFromCart;
                        // Assign an anonymous function to the onclick attribute
                        closeIcon.onclick = function() {
                            removeItemFromCart(this); // 'this' will refer to the closeIcon element
                        };

                        // Create the image element
                        const image = document.createElement('img');
                        image.src = data[i].ImageSrc; //'../static/images/cart-1.jpg';
                        image.alt = '';

                        // Create the content div
                        const contentDiv = document.createElement('div');
                        contentDiv.classList.add('content');

                        // Create the heading element
                        const heading = document.createElement('h3');
                        heading.textContent = data[i].Title; //'organic food';

                        // Create the quantity span
                        const quantitySpan = document.createElement('span');
                        quantitySpan.classList.add('quantity');
                        quantitySpan.textContent = data[i].Quantity;

                        // Create the multiply span
                        const multiplySpan = document.createElement('span');
                        multiplySpan.classList.add('multiply');
                        multiplySpan.textContent = 'x';

                        // Create the price span
                        const priceSpan = document.createElement('span');
                        priceSpan.classList.add('price');
                        priceSpan.textContent = `£${data[i].Price}`; //'$18.99';

                        // Append all elements to the content div
                        contentDiv.appendChild(heading);
                        contentDiv.appendChild(quantitySpan);
                        contentDiv.appendChild(multiplySpan);
                        contentDiv.appendChild(priceSpan);

                        // Append close icon, image, and content div to the main container div
                        boxDiv.appendChild(closeIcon);
                        boxDiv.appendChild(image);
                        boxDiv.appendChild(contentDiv);

                        // Append the main container div to the document body or another parent element
                        cartElement.appendChild(boxDiv);
                        // console.log("Cart");
                    }

                    let TotalElement = document.getElementById('cartTotal');
                    TotalElement.innerHTML = `£${lastElement.Total}`;
                }
            }
            catch(error) {
                console.log(error);
                alert("Error loading Cart")
            }
        }
    }
    
}

document.addEventListener('DOMContentLoaded', async function() {
    UpdateCart()
});

// Generate a unique identifier for the user
// function generateToken(length = 16) {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let token = '';
//     for (let i = 0; i < length; i++) {
//         const randomIndex = Math.floor(Math.random() * chars.length);
//         token += chars.charAt(randomIndex);
//     }
//     return token;
// }

// function getToken() {
//     try {
//         let token = sessionStorage.getItem('token');
//         if (token)
//             return token;
//         else {
//             // If not, generate a new one and store it
//             token = generateToken();
//             // sessionStorage.setItem('token', token);
//         }

//         return token;
//     } catch(erorr) {
//         // console.log(erorr);
//         return Error(erorr);
//     }
// }

async function Search() {
    const searchField = document.getElementById('search-box');
    searchField.value
    if(searchField.value == '')
        return alert("Search field is blank")

    console.log(searchField.value);

    history.pushState({}, document.title, '/');

    window.location.href = '/search?q=' + `${searchField.value}`;
    try {
        // Make a GET request using the fetch API
        const url = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        apiUrl = url + '/search?q=' + `${searchField.value}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        // const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}



// Function to retrieve the value of a cookie by name
function getCookie(cookieName) {
    const name = cookieName + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for(let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return '';
}

// Function to set cart data in a cookie
function setCartData_2(cartData) {
    document.cookie = `cart=${JSON.stringify(cartData)}; path=/`;
}

// Function to get cart data from the cookie
function getCartData_2() {
    const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)cart\s*=\s*([^;]*).*$)|^.*$/, "$1");
    return cookieValue ? JSON.parse(cookieValue) : {};
}

// Remove item from cart
function removeItemFromCart(event) {    
    itemId = event.dataset.sku;

    const cartData = getCartData_2();
    if (cartData[itemId]) {
        delete cartData[itemId];
        setCartData_2(cartData);
        UpdateCart()
    }
    
    // Check if the current URL is '/checkout'
    if (window.location.pathname === '/checkout') {
        // Reload
        location.reload();
    } 
}

async function AddToCart(event) {
    try {

        itemId = event.dataset.sku;
        const cartData = getCartData_2();

        // fetch product quantity
        let num = document.querySelector(".num");
        let quantity = '';
        if(num)
            quantity = num.innerText;
        else
            quantity = 1;

        cartData[itemId] = cartData[itemId] ? cartData[itemId] + 1 : Number( quantity ); // Default quantity when product from shop.html
        setCartData_2(cartData);
        UpdateCart()

        let model = document.getElementById('modal-container');
        if (model != null) {
            closeModel();
        }
        
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
    
}

function ViewProduct(event) {
    // event.preventDefault(); // Prevent the default behavior of the link
    const productSlug = event.dataset.slug;

    // Clear the path in the URL and navigate to the new path
    window.history.pushState({}, document.title, event.target.href);

    // To clear the path and navigate to a new page:
    window.location.href = `/shop/${productSlug}`;
}

// CheckOut Will redirect to Customer Details Page. Where Customer Input there details
function CheckOut() {
    const cartCookie = getCookie('cart');
    // Check if the 'cart' cookie value is not empty
    if(cartCookie == '{}')
        alert("Shopping Cart is empty");
    else {
        // Clear the path in the URL and navigate to the new path
        window.history.pushState({}, document.title, event.target.href);
        window.location.href = `/checkout`;
    }
}

function Account() {
    console.log("Account");
}

// function AddToCart() {
//     console.log("Add to cart");
// }

// ---------------------------- Functions ----------------------------

// ---------------------------- Shop ----------------------------
function Category(path) {
    event.preventDefault(); // Prevent the default behavior of the link
    
    // Clear the path in the URL and navigate to the new path
    window.history.pushState({}, document.title, event.target.href);

    // To clear the path and navigate to a new page:
    window.location.href = `/category/${path}`;
}

async function CreateUser() {
    // Get the input field values
    var name = document.querySelector('.create-form input[type="text"]').value;
    var email = document.querySelector('.create-form input[type="email"]').value;
    var password = document.querySelector('.create-form input[type="password"]').value;
    var confirmPassword = document.querySelectorAll('.create-form input[type="password"]')[1].value;

    // Do something with the fetched data
    console.log("Name: " + name);
    console.log("Email: " + email);
    console.log("Password: " + password);
    console.log("Confirm Password: " + confirmPassword);

    if(name && email && password && confirmPassword) {
        if(password != confirmPassword) 
        alert("Password Mismatch");
        else {
            // const token = getToken();
            const currentPort = window.location.port;
            const apiUrl = `${ServerIP}:${currentPort}/createUser`;
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                Name: name,
                Email: email.toLowerCase(),
                Password: password,
                // token: token
                }),
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            if(!data.status) { 
                alert(data.message)
            } else {
                // sessionStorage.setItem('token', token);
                // window.history.pushState({}, document.title, event.target.href);
                // To clear the path and navigate to a new page:
                alert("User Successfully Created!");
                window.location.href = `/`;
                // SignOut.style.display = "block";
                
            }
        }
    } else{
        alert("Fields Missing!")
    }
    
    
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

async function loginUser() {
    try {
        // Get the input field values
        var email = document.querySelector('.login-form input[type="email"]').value;
        var password = document.querySelector('.login-form input[type="password"]').value;

        // Do something with the fetched data
        // console.log("Email: " + email);
        // console.log("Password: " + password);

        if(email && password) {
            const currentPort = window.location.port;
            const apiUrl = `${ServerIP}:${currentPort}/login`;
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Email: email.toLowerCase(),
                    Password: password
                }),
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            if(data) { 

                setCookie('token', data.token, 1);

                history.pushState({}, document.title, '/');
                window.location.href = '/'

                // alert(data.message)
            } else {
                // sessionStorage.setItem('token', token);
                // window.history.pushState({}, document.title, event.target.href);
                // To clear the path and navigate to a new page:
                // 
                // location.reload();

                history.pushState({}, document.title, '/');
                window.location.href = '/'

                // alert("Successfully loggedIn"); user model instead
                
            }
        } else{
            alert("Fields Empty!")
        }
    
    } catch(error) {
        alert("Can't Login User");
        console.error(error);
    }    
}


async function logoutUser() {
    try {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        history.pushState({}, document.title, '/');
        window.location.href = '/';
        // const currentPort = window.location.port;
        // const apiUrl = `${ServerIP}:${currentPort}/logout`;
        // const response = await fetch(apiUrl, {
        //     method: "POST",
        //     headers: {
        //     Accept: "application/json",
        //     "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //         Email: email.toLowerCase(),
        //         Password: password
        //     }),
        // });
        
        // if (!response.ok) {
        //     throw new Error('Network response was not ok');
        // }
    }
    catch(error) {
        console.error(error);
    }
}

// ---------------------------- Shop ----------------------------

// ---------------------------- CheckOut ----------------------------
// Get references to the radio buttons and the corresponding HTML sections
var homeDeliveryRadio = document.getElementById('homedelivery');
var collectNowRadio = document.getElementById('collectnow');

var addressSection = document.getElementById('addressSection');
var address2Section = document.getElementById('address2Section');
var countrySection = document.getElementById('countrySection');

// Add event listeners to the radio buttons
try {
    homeDeliveryRadio.addEventListener('click', function() {
        // Show the address section and hide the other sections
        addressSection.style.display = 'block';
        address2Section.style.display = 'block';
        countrySection.style.display = 'block';
    });
} catch(error) {
    console.log('homeDelivery Radio Btn not found!');
}

try {
    collectNowRadio.addEventListener('click', function() {
        // Hide the address section and show the other sections
        addressSection.style.display = 'none';
        address2Section.style.display = 'none';
        countrySection.style.display = 'none';
    });
} catch(error) {
    console.log('collectNow Radio Btn not found!');
}



async function checkoutFormData() {
    try {
        const cartData = getCartData_2();
        if(JSON.stringify(cartData) === '{}') {
            alert("Cart data is removed! please add product into cart")
        } else {
            var formData = {
                name: document.getElementById("Name").value,
                phone: document.getElementById("phone").value,
                email: document.getElementById("email").value,
                address: document.getElementById("address").value,
                address2: document.getElementById("address2").value,
                country: document.getElementById("country").value,
                cart: cartData
            };
             
            var homeDeliveryRadio = document.getElementById('homedelivery');
            var collectNowRadio = document.getElementById('collectnow');
    
            let call;
            if (homeDeliveryRadio.checked) {
                //validate fields
                let fields = ['name', 'phone', 'email', 'address', 'country'];
                
                i = 0;
                for (const [key, value] of Object.entries(formData)) {
                    if (key == fields[i] && value === '') {
                        alert(fields[i] + ' field is required.');
                        return; // Stop further execution
                    }
                    i++;
                }
                formData.shoppingMethod = "homeDelivery";
                call = true;
                
            } else if (collectNowRadio.checked) {
                //validate fields
                let fields = ['name', 'phone', 'email'];
                
                i = 0;
                for (const [key, value] of Object.entries(formData)) {
                    if (key == fields[i] && value === '') {
                        alert(fields[i] + ' field is required.');
                        return; // Stop further execution
                    }
                    i++;
                }
    
                formData.shoppingMethod = "collectNow";
                call = true;
            } else {
                formData.shoppingMethod = null;
                return null; // None of the radio buttons are selected
            }
    
            // Initiate Call
            if(call) {
                const currentPort = window.location.port;
                const apiUrl = `${ServerIP}:${currentPort}/stripeCheckout`;
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
                
                if (!response.ok) {
                    console.log("Token verification failed!");
                    throw new Error('Network response was not ok');
                }
                
                const data = await response.json();
                window.location.href = data.url;
    
             } else {
                alert("Invalid Payment Method");
            }
        }
    }
    catch(error) {
        console.error('There was a problem with the Post call:', error);
        alert("Error!")
    }
}

// ---------------------------- CheckOut ----------------------------
