let costArray = [];
let filter = document.querySelector(`#filter`);
let firstForm = document.querySelector(`#incomeForm`);
let cost = totalSumOfNumberCost(costArray);
let expensesForm = document.querySelector(`#expensesForm`);
let pieButton = document.querySelector(`#pieButton`);
let chartContainer = document.querySelector(`#chartContainer`);
//This is posting the remaining income after submit

firstForm.addEventListener("submit", displayIncome);

function displayIncome(e) {
  e.preventDefault();
  let data = new FormData(firstForm);
  let income = data.get("expensesNumber");
  let remainingIncome = +income - +totalSumOfNumberCost(costArray);
  let incomeTotal = document.querySelector("#incomeTotal");
  let firstSubmitbutton = document.querySelector(`#firstSubmitbutton`)
  let pastElement = document.createElement("p");
  if(firstSubmitbutton.innerText === `Refresh`) {
    location.reload();
  }

  pastElement.innerText = `Weekly Budget Remaining: $${remainingIncome}`;
  incomeTotal.innerHTML = "";
  incomeTotal.appendChild(pastElement);
  firstSubmitbutton.innerText =`Refresh`
}

// this adds cost to costArray and updates the remaining income variable
expensesForm.addEventListener(`submit`, (e) => {
  e.preventDefault();
  let data2 = new FormData(firstForm);
  let income = data2.get("expensesNumber");
  let data = new FormData(expensesForm);
  let typeCost = document.querySelector(`#expensesType`);
  let numberCost = data.get(`expenseNumber`);
  let ExpensesTotalDiv = document.querySelector("#incomeTotal");
  let pastElement = document.createElement("p");
  let newCost = {
    numberCost: +numberCost,
    typeCost: typeCost.value,
  };

  costArray.push(newCost);

  if (income - totalSumOfNumberCost(costArray) < 0) {
                                  // This if statment checks to see if the sum of all expenses is in the negative
    alert(`Insufficient funds.`); // and if it is, it will pop the last entry that made that happen out before updating displays
    costArray.pop();
    return;
  }

  setFilter() // goes through the list and prints them to a <ul>

  pastElement.innerText = `Weekly Budget Remaining: $${
    +income - totalSumOfNumberCost(costArray)
  }`;
  ExpensesTotalDiv.innerHTML = "";
  ExpensesTotalDiv.appendChild(pastElement);
  console.log(totalSumOfNumberCost(costArray));
  if (pieButton.innerText === `Remove`) {
    chartContainer.innerHTML = `<canvas id="myChart"></canvas>`;
    pieButton.innerText = ``;
    displayChart();
  }
});

// this finds the sum of the cost of ever item in the array
function totalSumOfNumberCost(array) {
  let totalSum = 0;
  for (i of array) {
    totalSum += i.numberCost;
  }
  return totalSum;
}

function makeExpenseList(index) {
  console.log()
  let filterDisplay = document.querySelector(`#filterDisplay`);
  let elem = document.createElement("li");
  console.log(filterDisplay)
  console.log(elem)
  elem.innerText = `amount: $${index.numberCost} | expense type: ${index.typeCost}`;
  filterDisplay.appendChild(elem);
  
}

filter.addEventListener(`click`, setFilter);

function setFilter() {
  let filterSetting = document.querySelector(`#expensesFilter`);
  let filterDisplay = document.querySelector(`#filterDisplay`);
  
  console.log(filterSetting.value)
  if (filterSetting.value === `all`) {
    
    filterDisplay.innerHTML = "";
    for (let index of costArray) {
      makeExpenseList(index);
    }
    let elemSum = document.createElement(`p`);
    elemSum.innerText = `The total cost of all expenses: $${totalSumOfNumberCost(
      costArray
    )}`;
    filterDisplay.appendChild(elemSum);
  }
  if (filterSetting.value === `entertainment`) {
    forFilterDisplay(`entertainment`, filterDisplay, filterSetting);
  }
  if (filterSetting.value === `food`) {
    forFilterDisplay(`food`, filterDisplay, filterSetting);
  }
  if (filterSetting.value === `clothing`) {
    forFilterDisplay(`clothing`, filterDisplay, filterSetting);
  }
  if (filterSetting.value === `bills`) {
    forFilterDisplay(`bills`, filterDisplay, filterSetting);
  }
  if (pieButton.innerText === ``) {
    chartContainer.innerHTML = `<canvas id="myChart"></canvas>`;
    displayChart();
  }
}

function forFilterDisplay(expenseType, filterDisplay, filterSetting) {
  if (filterSetting.value === `${expenseType}`) {
    let result = costArray.filter((i) => i.typeCost === `${expenseType}`);
    filterDisplay.innerHTML = ``;
    let sum = 0;
    for (index of result) {
      sum += index.numberCost;
      let elem = document.createElement("li");
      elem.innerText = `$${index.numberCost} | Expense Type: ${index.typeCost}`;
      filterDisplay.appendChild(elem);
    }
    let elemSum = document.createElement(`p`);
    elemSum.innerText = `The total cost of ${expenseType}: $${sum}`;
    filterDisplay.appendChild(elemSum);
  }
}

function findSumOfFilter(expenseType) {
  let result = costArray.filter((i) => i.typeCost === `${expenseType}`);
  let sum = 0;
  for (index of result) {
    sum += index.numberCost;
  }
  return sum;
}

pieButton.addEventListener(`click`, displayChart);
function displayChart() {
  if (pieButton.innerText === `Remove`) {
    // This listener Makes the chart on click then removes it the next click
    chartContainer.innerHTML = `<canvas id="myChart"></canvas>`;
    pieButton.innerText = `Your Expenses Breakdown`;
    return;
  }
  pieButton.innerText = `Remove`;
  let data = new FormData(firstForm);
  let income = data.get("expensesNumber");
  let remainingIncome = +income - +totalSumOfNumberCost(costArray);
  let entertainment = findSumOfFilter(`entertainment`);
  let food = findSumOfFilter(`food`);
  let clothing = findSumOfFilter(`clothing`);
  let bills = findSumOfFilter(`bills`);
  const ctx = document.getElementById("myChart");

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: [
        "remaining budget",
        "entertainment",
        "food",
        "clothing",
        "bills",
      ],
      datasets: [
        {
          data: [remainingIncome, entertainment, food, clothing, bills],
          borderWidth: 1,
        },
      ],
    },
    options: {},
  });
}

