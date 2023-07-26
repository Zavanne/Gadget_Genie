    function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }


        function getRandomPrice(min, max) {
            let randomPrice = (Math.floor(Math.random() * (max - min + 1)) + min).toFixed(2);
            return randomPrice;
        }


        const products = [
            "Ultra-Fast Gaming Mouse",
            "Noise-Canceling Wireless Headphones",
            "Smart LED Light Bulbs",
            "Portable Bluetooth Speaker",
            "Wireless Charging Pad",
            "Virtual Reality Headset",
            "Smart Wifi Thermostat",
            "Robot Vacuum Cleaner",
            "External Solid State Drive",
            "Wireless Ergonomic Keyboard"
        ];


        const productImages = [
        "1 Ultra-Fast Gaming Mouse.png",
        "2 Noise-Canceling Wireless Headphones.png",
        "3 Smart LED Light Bulb.png",
        "4 Portable Bluetooth Speaker.png",
        "5 Wireless Charging Pad.png",
        "6 Virtual Reality Headset.png",
        "7 Smart Wifi Thermostat.png",
        "8 Robot Vacuum Cleaner.png",
        "9 External Solid State Drive.png",
        "10 Wireless Ergonomic Keyboard.png",
        ];


        let catalogMatrix = [];
        for (let row = 0; row < products.length; row++) {
            catalogMatrix[row] = [
                products[row],
                getRandomPrice(9.99, 108.78),
                getRandomInt(5, 28),
                0, // Initialize the revenue to zero for each product
                0 // Initialize the amount of units sold to 0 for each product
            ];
        }


        let shoppingCart = [];


       
        let position = 0;
        let cartContent = ""; //variable provided by Chat GPT in order to concatanate all the elements of my shopping cart into one for display
        let lagRepeatedProduct =0;
        let total = 0;
        // let bestSeller = 0;
        // let worstSeller = [];
        // let worstSellerMin = 100;
        // let indexWorst = 0;


    // Display the products catalog with inventory information
    let productsCatalogDiv = document.getElementById("productsCatalog");
    for (let row = 0; row < catalogMatrix.length; row++) {
    let productInfo = (row + 1) + ") " + catalogMatrix[row][0] + " Price: $" + catalogMatrix[row][1] + " Quantity: " + catalogMatrix[row][2] + " Revenue: $" + catalogMatrix[row][3] + " Units sold: " + catalogMatrix[row][4];


    // Adding the product image to the product card
    let productCard = document.createElement("div");
    productCard.classList.add("product-card");


    let productImage = document.createElement("img");


    // Set the "src" attribute to the corresponding image path for each product
    productImage.src = "Images/" + productImages[row];


    productImage.alt = products[row];
    productImage.classList.add("product-image");
    productCard.appendChild(productImage);


    let productInfoDiv = document.createElement("div");
    productInfoDiv.classList.add("product-info");
    productInfoDiv.innerHTML = productInfo;


    productCard.appendChild(productInfoDiv);
    productsCatalogDiv.appendChild(productCard);
}




    function processOrder() {
        let productNumberInput = document.getElementById("productNumber");
        let quantityInput = document.getElementById("quantity");
        let productNumber = parseInt(productNumberInput.value);
        let quantity = parseInt(quantityInput.value);
        document.getElementById("TotalCompra").textContent = "";


            if (!isNaN(productNumber) && productNumber > 0 && productNumber <= catalogMatrix.length) {
                if (!isNaN(quantity) && quantity > 0) {
                    if (quantity <= catalogMatrix[productNumber - 1][2]) {
                        // Check if the product is already in the shopping cart
                        let position = -1;
                        for (let i = 0; i < shoppingCart.length; i++) {
                            if (shoppingCart[i][0] === productNumber) {
                                position = i;
                                break;
                            }
                        }


                if (position !== -1) {
                    // Product already exists in the cart, calculate the new quantity
                    let newQuantity = shoppingCart[position][1] + quantity;
                    if (newQuantity <= catalogMatrix[productNumber - 1][2]) {
                        // Update the quantity in the shopping cart
                        shoppingCart[position][1] = newQuantity;
                        document.getElementById("orderStatus").textContent = "The desired quantity is available and has been updated in your shopping cart";
                    } else {
                        // Show the maximum available quantity for that product
                        document.getElementById("orderStatus").textContent = "The desired amount is not available. Select a quantity less or equal to " + catalogMatrix[productNumber - 1][2];
                    }
                } else {
                    // Product does not exist in the cart, add it
                    shoppingCart.push([productNumber, quantity]);
                    document.getElementById("orderStatus").textContent = "The desired quantity is available and has been added to your shopping cart";
                }


                // Update the content of the "currentShoppingCart" element
                let cartContent = " ";
                for (let x = 0; x < shoppingCart.length; x++) {
                    let productIndex = shoppingCart[x][0] - 1; // Subtract 1 to get the correct index
                    let product = products[productIndex]; // Look up the product name from the 'products' array
                    let qty = shoppingCart[x][1];


                    cartContent += `${product} - Quantity: ${qty}<br>`;
                }
                document.getElementById("currentShoppingCart").innerHTML = cartContent;


            } else {
                document.getElementById("orderStatus").textContent = "The desired amount is not available. Select a quantity less or equal to " + catalogMatrix[productNumber - 1][2];
            }
        } else {
            document.getElementById("orderStatus").textContent = "Invalid quantity entered. Please enter a valid number.";
        }
    } else {
        document.getElementById("orderStatus").textContent = "Invalid product number entered. Please enter a valid number.";
    }
}


        function checkOut() {
    // Code to calculate the total of your purchase
    let total = 0;
    for (let x = 0; x < shoppingCart.length; x++) {
        let checkProduct = shoppingCart[x][0];
        let price = parseFloat(catalogMatrix[checkProduct - 1][1]); // Subtract 1 to get the correct index
        total += price * shoppingCart[x][1];


        // Code to update inventory quantities
        catalogMatrix[checkProduct - 1][2] -= shoppingCart[x][1];


        // Code to refill inventory automatically if products fall under 5 units
        if (catalogMatrix[checkProduct - 1][2] < 5) {
            catalogMatrix[checkProduct - 1][2] = 30;
        }


        // Code to track revenue per product
        catalogMatrix[checkProduct - 1][3] += price * shoppingCart[x][1];


        // Code to track the number of units sold
        catalogMatrix[checkProduct - 1][4] += shoppingCart[x][1];
    }


    let bestSeller = 0;
    let indexBest = -1;
    let worstSeller = [];
    let worstSellerMin = Number.MAX_SAFE_INTEGER;
    let indexWorst = -1;


    for (let x = 0; x < 10; x++) {
        // Obtains the best seller product number
        if (catalogMatrix[x][4] > bestSeller) {
            bestSeller = catalogMatrix[x][4];
            indexBest = x;
        }


        if (catalogMatrix[x][4] == 0) {
            worstSeller.push(x);
        } else if (catalogMatrix[x][4] < worstSellerMin) {
            worstSellerMin = catalogMatrix[x][4];
            indexWorst = x;
        }
    }


    if (worstSeller.length === 0) {
        document.getElementById("WorstSeller").textContent = " ";
        document.getElementById("WorstSeller").textContent = " :( The worst seller product is " + catalogMatrix[indexWorst][0] + " . :-( )";
    } else {
        document.getElementById("WorstSeller").textContent = " ";
        let allWorstProducts = [];
        for (let i = 0; i < worstSeller.length; i++) {
            allWorstProducts.push(catalogMatrix[worstSeller[i]][0]);
        }
        let allWorstAsString = allWorstProducts.join(', ');
        document.getElementById("WorstSeller").textContent = " :( The worst seller products are " + allWorstAsString + ". ):";
    }


    document.getElementById("BestSeller").textContent = " $$$$ The best seller product is " + catalogMatrix[indexBest][0] + ". $$$$";


    document.getElementById("TotalCompra").textContent = "Your total was $" + total.toFixed(2) + " and has been charged to your card. A confirmation email has been sent to you. Thank you for choosing Gadget Genie! Until next time.";


    // Clear the products catalog display before updating it
    productsCatalogDiv.innerHTML = "";


    // Update the products catalog display after checkout
    for (let row = 0; row < catalogMatrix.length; row++) {
    let productInfo = (row + 1) + ") " + catalogMatrix[row][0] + " Price: $" + catalogMatrix[row][1] + " Quantity: " + catalogMatrix[row][2] + " Revenue: $" + catalogMatrix[row][3].toFixed(2) + " Units sold: " + catalogMatrix[row][4];


    // Adding the product image to the product card
    let productCard = document.createElement("div");
    productCard.classList.add("product-card");


    let productImage = document.createElement("img");


    // Set the "src" attribute to the corresponding image path for each product
    productImage.src = "Images/" + productImages[row];


    productImage.alt = products[row];
    productImage.classList.add("product-image");
    productCard.appendChild(productImage);


    let productInfoDiv = document.createElement("div");
    productInfoDiv.classList.add("product-info");
    productInfoDiv.innerHTML = productInfo;


    productCard.appendChild(productInfoDiv);
    productsCatalogDiv.appendChild(productCard);
}




    // Clear the current shopping cart after checkout
    shoppingCart = [];
    document.getElementById("currentShoppingCart").innerHTML = "";
    document.getElementById("orderStatus").textContent = "";
}









