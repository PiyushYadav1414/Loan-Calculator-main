// Get references to the HTML elements where input values will be entered and displayed
const loanAmountInput = document.querySelector(".loan-amount"); // Input for loan amount
const interestRateInput = document.querySelector(".interest-rate"); // Input for interest rate
const loanTenureInput = document.querySelector(".loan-tenure"); // Input for loan tenure (in months)

const loanEMIValue = document.querySelector(".loan-emi .value"); // Display element for EMI value
const totalInterestValue = document.querySelector(".total-interest .value"); // Display element for total interest
const totalAmountValue = document.querySelector(".total-amount .value"); // Display element for total loan amount

const calculateBtn = document.querySelector(".calculate-btn"); // Button to trigger EMI calculation

// Initial values based on input fields, converted to numbers
let loanAmount = parseFloat(loanAmountInput.value); // Convert loan amount to a float
let interestRate = parseFloat(interestRateInput.value); // Convert interest rate to a float
let loanTenure = parseFloat(loanTenureInput.value); // Convert loan tenure to a float

// Convert the annual interest rate to a monthly interest rate (dividing by 12 and converting to a decimal)
let interest = interestRate / 12 / 100;

let myChart; // Variable to hold the chart object

// Function to validate input values and set default values if they are incorrect
const checkValues = () => {
  let loanAmountValue = loanAmountInput.value;
  let interestRateValue = interestRateInput.value;
  let loanTenureValue = loanTenureInput.value;

  // Regular expression to check if the input is a whole number
  let regexNumber = /^[0-9]+$/;
  if (!loanAmountValue.match(regexNumber)) {
    loanAmountInput.value = "10000"; // Set a default value if input is invalid
  }

  if (!loanTenureValue.match(regexNumber)) {
    loanTenureInput.value = "12"; // Set a default value for tenure if input is invalid
  }

  // Regular expression to check if the input is a decimal number
  let regexDecimalNumber = /^(\d*\.)?\d+$/;
  if (!interestRateValue.match(regexDecimalNumber)) {
    interestRateInput.value = "7.5"; // Set a default value for interest rate if input is invalid
  }
};

// Function to display the pie chart with interest and principal breakdown
const displayChart = (totalInterestPayableValue) => {
  const ctx = document.getElementById("myChart").getContext("2d"); // Get the canvas context
  myChart = new Chart(ctx, {
    type: "pie", // Set the chart type to pie chart
    data: {
      labels: ["Total Interest", "Principal Loan Amount"], // Labels for the slices
      datasets: [
        {
          data: [totalInterestPayableValue, loanAmount], // Data for interest and principal
          backgroundColor: ["#e63946", "#14213d"], // Colors for the slices
          borderWidth: 0, // No border between slices
        },
      ],
    },
  });
};

// Function to update the pie chart with new data (interest and principal)
const updateChart = (totalInterestPayableValue) => {
  myChart.data.datasets[0].data[0] = totalInterestPayableValue; // Update the interest slice
  myChart.data.datasets[0].data[1] = loanAmount; // Update the principal slice
  myChart.update(); // Refresh the chart to display updated values
};

// Function to refresh input values after the user makes changes
const refreshInputValues = () => {
  loanAmount = parseFloat(loanAmountInput.value); // Get updated loan amount
  interestRate = parseFloat(interestRateInput.value); // Get updated interest rate
  loanTenure = parseFloat(loanTenureInput.value); // Get updated loan tenure
  interest = interestRate / 12 / 100; // Recalculate the monthly interest rate
};

// Function to calculate the EMI (Equated Monthly Installment)
const calculateEMI = () => {
  checkValues(); // Check if input values are valid
  refreshInputValues(); // Refresh input values based on the user input

  // EMI formula based on loan amount, interest rate, and tenure
  let emi =
    loanAmount *
    interest *
    (Math.pow(1 + interest, loanTenure) /
      (Math.pow(1 + interest, loanTenure) - 1));

  return emi; // Return the calculated EMI value
};

// Function to update the displayed values (EMI, total amount, total interest) and the chart
const updateData = (emi) => {
  loanEMIValue.innerHTML = Math.round(emi); // Display the calculated EMI value (rounded)

  let totalAmount = Math.round(loanTenure * emi); // Calculate total loan amount (EMI * loan tenure)
  totalAmountValue.innerHTML = totalAmount; // Display the total amount

  let totalInterestPayable = Math.round(totalAmount - loanAmount); // Calculate total interest (total amount - loan amount)
  totalInterestValue.innerHTML = totalInterestPayable; // Display total interest payable

  if (myChart) {
    updateChart(totalInterestPayable); // If chart already exists, update it
  } else {
    displayChart(totalInterestPayable); // If chart doesn't exist, create it
  }
};

// Function to initialize and calculate everything when the page loads or user clicks calculate
const init = () => {
  let emi = calculateEMI(); // Calculate the EMI
  updateData(emi); // Update the displayed data and chart with the calculated EMI
};

// Call the init function when the page loads to display the initial calculation
init();

// Event listener for the calculate button
calculateBtn.addEventListener("click", init); // When button is clicked, re-calculate and update the chart
