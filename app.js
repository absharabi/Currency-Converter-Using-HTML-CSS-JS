const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1";

document.addEventListener('DOMContentLoaded', (event) => {
    const dropdowns = document.querySelectorAll(".dropdown select");
    const btn = document.querySelector("form button");
    const fromCurr = document.querySelector(".from select");
    const toCurr = document.querySelector(".to select");
    const msg = document.querySelector(".msg");

    // Add event listeners for the dropdown selects
    dropdowns.forEach(select => {
        select.addEventListener("change", (evt) => {
            updateFlag(evt.target);
        });
    });

    // Populate the select elements with currency codes
    for (let select of dropdowns) {
        for (let currCode in countryList) {
            let newOption = document.createElement("option");
            newOption.innerText = currCode;
            newOption.value = currCode;
            if (select.name === "from" && currCode === "USD") {
                newOption.selected = "selected";
            } else if (select.name === "to" && currCode === "INR") {
                newOption.selected = "selected";
            }
            select.append(newOption);
        }
    }

    // Update the flag based on the selected currency
    const updateFlag = (element) => {
        let currCode = element.value;
        let countryCode = countryList[currCode];
        let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

        if (element.name === "from") {
            let img = document.querySelector("#from-img");
            if (img) {
                img.src = newSrc;
            } else {
                console.error("No image element found inside 'From' div.");
            }
        } else if (element.name === "to") {
            let img = document.querySelector("#to-img");
            if (img) {
                img.src = newSrc;
            } else {
                console.error("No image element found inside 'To' div.");
            }
        }
    };

    // Button click event listener
    btn.addEventListener("click", async (evt) => {
        evt.preventDefault();
        let amount = document.querySelector(".amount input");
        let amtvalue = amount.value;
        console.log(amtvalue);

        // Validate input
        if (amtvalue === "" || amtvalue < 1) {
            amtvalue = 0;
            amount.value = "Wrong input";
        }

        // Construct the URL based on the fromCurrency
        const fromCurrency = fromCurr.value.toLowerCase();
        const toCurrency = toCurr.value.toLowerCase();

        const URL = `${BASE_URL}/currencies/${fromCurrency}.json`;

        try {
            // Fetch the data from the API
            let response = await fetch(URL);
            
            // Check if the response is valid
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let data = await response.json();

            // Extract the exchange rate for the selected currencies
            let rate = data[fromCurrency][toCurrency];

            console.log(`Exchange rate from ${fromCurrency} to ${toCurrency}: ${rate}`);

            // Calculate and display the converted amount
            let convertedAmount = amtvalue * rate;
            msg.innerText = `${amtvalue} ${fromCurrency} = ${convertedAmount} ${toCurrency} `
            console.log(`Converted Amount: ${convertedAmount}`);
        } catch (error) {
            console.error("Error fetching or parsing the data:", error);
            alert("There was an error fetching the exchange rate. Please try again.");
        }
    });
});
