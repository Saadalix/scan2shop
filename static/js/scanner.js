function BarCodescanner() {
    // Get the video element from the HTML
    const videoElement = document.getElementById('video');

    // Check if the browser supports getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Access the mobile back camera
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(function(stream) {
                // Display the stream from the camera in the video element
                videoElement.srcObject = stream;
            })
            .catch(function(error) {
                console.error('Error accessing the camera:', error);
            });
    } else {
        console.error('getUserMedia is not supported on this browser');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    
});


// Function to send data to the server
function sendDataToServer(data) {
    // Replace '/upload_video' with the appropriate endpoint on your server
    const endpoint = '/upload_video';

    // Example using fetch API
    fetch(endpoint, {
        method: 'POST', // HTTP method
        body: data // Data to send to the server
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to upload video');
        }
        return response.json(); // Assuming server responds with JSON data
    })
    .then(data => {
        console.log('Server response:', data);
        // Handle the server response as needed
    })
    .catch(error => {
        console.error('Error uploading video:', error);
    });
}

function BarCodeScanner2() {
    
    // Get the video element from the HTML
    const videoElement = document.getElementById('video');

    // Check if the browser supports getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Access the mobile back camera
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(function(stream) {
                // Display the stream from the camera in the video element
                videoElement.srcObject = stream;

                // Send the stream data to the server
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = function(event) {
                    if (event.data && event.data.size > 0) {
                        sendDataToServer(event.data);
                    }
                };
                mediaRecorder.start();
            })
            .catch(function(error) {
                console.error('Error accessing the camera:', error);
            });
    } else {
        console.error('getUserMedia is not supported on this browser');
    }
}

// document.addEventListener('DOMContentLoaded', function() {
//     BarCodeScanner2();
// })


// Example usage:
async function PostCall(url, data) {
    try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        return await response.json();
    } catch (error) {
    console.error('There was a problem with the POST request:', error);
    throw error; // Rethrow the error to handle it outside
    }
}


/*=============== OPEN MODAL ===============*/
actualProductPrice = 0;
currentProductPrice = 0;
a = 1;
function openModel(productObj) { 
    
    const prodImage = document.getElementById('productImage');
    prodImage.src  = productObj.ImageSrc;

    const prodTitle = document.getElementById('productTitle');
    prodTitle.textContent  = productObj.Title;

    const prodDesc = document.getElementById('productDesc');
    prodDesc.textContent  = productObj.Description;

    const prodPrice = document.getElementById('productPrice');
    prodPrice.textContent  =  productObj.Price;
    currentProductPrice = productObj.Price
    actualProductPrice = productObj.Price

    var addToCartBtn = document.getElementById('addToCartBtn');
    // Add a custom data attribute to the element
    addToCartBtn.setAttribute('data-sku', productObj.SKU);

    var viewProductBtn = document.getElementById('viewProductBtn');
    // Add a custom data attribute to the element
    viewProductBtn.setAttribute('data-slug', productObj.slug);

    const modalContainer = document.getElementById('modal-container');
    modalContainer.style.display = "flex";
}

/*=============== CLOSE MODAL ===============*/
function closeModel() {
    const modalContainer = document.getElementById('modal-container')
    modalContainer.style.display = "none";

    // Clear Product Quantity
    const num = document.querySelector(".num");
    a = '01';
    num.innerText = a;
}
  
/*=============== TRACK QUANTITY BUTTONS ===============*/
// const plus = document.querySelector(".plus"), minus = document.querySelector(".minus"), num = document.querySelector(".num");

// plus.addEventListener("click", () => {
//     let prodPrice = document.getElementById('productPrice');
//     a++;
//     a = a < 10 ? "0" + a : a;
//     num.innerText = a;
//     // Updating Price
//     let calculatedPrice = parseFloat(currentProductPrice) + actualProductPrice;
//     currentProductPrice = calculatedPrice.toFixed(2);
//     prodPrice.textContent = '£' + currentProductPrice;
// });

// minus.addEventListener("click", () => {
//     let prodPrice = document.getElementById('productPrice');
//     if (a > 1) {
//     a--;
//     a = a < 10 ? "0" + a : a;
//     num.innerText = a;
//     let calculatedPrice = currentProductPrice - actualProductPrice;
//     currentProductPrice = calculatedPrice.toFixed(2);
//     prodPrice.textContent = '£' + currentProductPrice;
//     }
// });
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
    let calculatedPrice = calculateTotalPrice(actualProductPrice, parseInt(num.innerText));
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
    prodPrice.textContent = calculatedPrice;
    }
});