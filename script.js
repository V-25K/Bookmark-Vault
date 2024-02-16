// Get the stored leads from local storage or set it to an empty array if nothing is found
try {
  myLeads = JSON.parse(localStorage.getItem("myLeads")) || [];
} catch (error) {
  console.error("Error parsing leads from localStorage:", error);
  myLeads = []; // Set to empty array if parsing fails
}

// Render the list of leads
renderList(myLeads);

/*
Function to render the list of leads
@parameter {Array} leads - The array of leads to be displayed
*/
function renderList(leads) {
  // Get the list element from the HTML
  const list = document.getElementById("listElement");
  let listItem = ""; // Initialize an empty string to store the list items

  // Loop through the leads array
  for (let i = 0; i < leads.length; i++) {
    try {
      listItem += `<li> <a target = "_blank" href = "${leads[i]}"> ${leads[i]} </a>
            </li>`; // Close the list item
    } catch (error) {
      console.error("Error rendering lead:", error);
      // Handle the error gracefully, e.g., display a message to the user
    }
  }

  // Set the innerHTML of the list element to the list items
  list.innerHTML = listItem;

  // Call the saveBtn function
  saveBtn();
  deleteBtn();
  saveCurrentTab();
}

/*
Function to save a new lead to the myLeads array and local storage
*/
function saveBtn() {
  const inputText = document.getElementById("input"); // Get the input element
  const inputBtn = document.getElementById("input-btn"); // Get the input button element
  let isClicked = false;

  // Add an event listener to the input button
  inputBtn.addEventListener("click", () => {
    if (!isClicked) {
      try {
        myLeads.push(inputText.value); // Add the input value to the myLeads array
        inputText.value = ""; // Clear the input value
        clearEmptyIndex(myLeads); // Call the clearEmptyIndex function
        localStorage.setItem("myLeads", JSON.stringify(myLeads)); // Save the updated myLeads array to local storage
      } catch (error) {
        console.error("Error saving lead:", error);
        // Handle the error gracefully, e.g., display a message to the user
      }
      setTimeout(() => {
        inputBtn.disabled = false;
      }, 500);
    }
  });
}

/* Function to save the url of current tab in the myLeads array*/
function saveCurrentTab() {
  const currentTab = document.getElementById("tab-btn");
  let isClicked = false;
  //get access to the url of the current tab
  currentTab.addEventListener("click", () => {
    if (!isClicked) {
      isClicked = true;
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        try {
          myLeads.push(tabs[0].url);
          localStorage.setItem("myLeads", JSON.stringify(myLeads));
          renderList(myLeads);
        } catch (error) {
          console.error("Error saving lead:", error);
        }
      });
      setTimeout(() => {
        isClicked = false;
      }, 500);
    }
  });
}

/*
Function to remove empty elements from the myLeads array
@parameter {Array} leads - The array of leads
*/
function clearEmptyIndex(leads) {
  for (let i = 0; i < leads.length; i++) {
    // Loop through the leads array
    if (leads[i] === "") {
      // If the current element is empty
      leads.splice(i, 1); // Remove it from the array
      i--; // Decrement the index to account for the removed element
    }
  }
  renderList(leads); // Call the renderList function to update the displayed list
}

/*
Function to delete all leads from the myLeads array and local storage
*/
function deleteBtn() {
  const delBtns = document.getElementById("del-btn"); // Get the delete button element

  // Add an event listener to the delete button
  delBtns.addEventListener("click", () => {
    try {
      localStorage.clear(); // Clear local storage
      myLeads = []; // Empty the myLeads array
      renderList(myLeads); // Call the renderList function to update the displayed list
    } catch (error) {
      console.error("Error deleting leads:", error);
      // Handle the error gracefully, e.g., display a message to the user
    }
  });
}
