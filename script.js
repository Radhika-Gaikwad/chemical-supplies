let tableData = [
  { id: 1, chemicalName: "Ammonium Persulfate", vendor: "LG Chem", density: "3525.92", viscosity: "60.63", packaging: "Bag", packSize: "100.00", unit: "kg", quantity: "6495.18" },
  { id: 2, chemicalName: "Caustic Potash", vendor: "Formosa", density: "3172.15", viscosity: "48.22", packaging: "Bag", packSize: "100.00", unit: "kg", quantity: "8751.90" },
  { id: 3, chemicalName: "Dimethylaminopropylamino", vendor: "LG Chem", density: "8435.37", viscosity: "12.62", packaging: "Barrel", packSize: "75.00", unit: "L", quantity: "5964.61" },
  { id: 4, chemicalName: "Mono Ammonium Phosphate", vendor: "Sinopec", density: "1597.65", viscosity: "76.51", packaging: "Bag", packSize: "105.00", unit: "kg", quantity: "8183.73" },
  { id: 5, chemicalName: "Ferric Nitrate", vendor: "DowDuPont", density: "364.04", viscosity: "14.90", packaging: "Bag", packSize: "105.00", unit: "kg", quantity: "4154.33" },
  { id: 6, chemicalName: "n-Pentane", vendor: "Sinopec", density: "4535.26", viscosity: "66.76", packaging: "N/A", packSize: "N/A", unit: "t", quantity: "6272.34" },
{ id: 7, chemicalName: "Glycol Ether PM", vendor: "LG Chem", density: "6495.18", viscosity: "72.12", packaging: "Bag", packSize: "250.00", unit: "kg", quantity: "8749.54" }

];




// if (!tableData || tableData.length === 0) {
//   tableData = defaultTableData;
// }

const storedData = JSON.parse(localStorage.getItem('tableData'));
if (storedData && storedData.length > 0) {
  tableData = storedData;
}



const initialTableData = JSON.parse(JSON.stringify(tableData));



function saveDataToLocalStorage() {
  localStorage.setItem('tableData', JSON.stringify(tableData));
}


let selectedRows = new Set();
// Track the most recent single row selection
let currentSelectedRow = null; 

let unsavedChanges = [];

// Function to toggle row selection and highlighting
function toggleRowSelection(id, tr, event) {
  // Prevent row selection if clicked inside a contenteditable element
  if (event.target.getAttribute('contenteditable') === 'true') {
    return; 
  }

  if (selectedRows.has(id)) {
    selectedRows.delete(id);
    // Reset color if deselected
    tr.style.backgroundColor = ""; 
  } else {
    selectedRows.add(id);
    // Highlight selected row
  }
    tr.style.backgroundColor = "lightblue"; 

  currentSelectedRow = selectedRows.size === 1 ? id : null;
  renderTableData();
}

// Function to update the edited table data
function updateTableData(event, rowId, columnKey) {
  const newValue = event.target.innerText;
  const rowIndex = tableData.findIndex(row => row.id === rowId);
  if (rowIndex !== -1) {
    tableData[rowIndex][columnKey] = newValue;
    if (!unsavedChanges.includes(rowId)) {
      unsavedChanges.push(rowId); // Track the row as unsaved
    }
  }
}

document.getElementById('saveData').addEventListener('click', () => {
  const confirmSave = confirm("Do you want to save the data?"); // Show confirmation dialog
  if (confirmSave) {
    saveDataToLocalStorage();
    // Save data if user confirms
    unsavedChanges = []; 
    alert("Data saved successfully!");
  }
});



// Function to render the table data
function renderTableData() {
  const tbody = document.querySelector("#chemTable tbody");
  tbody.innerHTML = "";

  tableData.forEach((row) => {
    const tr = document.createElement("tr");
    tr.setAttribute("data-id", row.id);

    // Set the background color of the selected row
    if (selectedRows.has(row.id)) {
      tr.style.backgroundColor = "lightblue";
    }

    tr.innerHTML = `
      <td><input type="checkbox" class="row-select" data-id="${row.id}" ${selectedRows.has(row.id) ? 'checked' : ''}></td>
      <td>${row.id}</td>
      <td contenteditable="true" data-column="chemicalName">${row.chemicalName}</td>
      <td contenteditable="true" data-column="vendor">${row.vendor}</td>
      <td contenteditable="true" data-column="density">${row.density}</td>
      <td contenteditable="true" data-column="viscosity">${row.viscosity}</td>
      <td contenteditable="true" data-column="packaging">${row.packaging}</td>
      <td contenteditable="true" data-column="packSize">${row.packSize}</td>
      <td contenteditable="true" data-column="unit">${row.unit}</td>
      <td contenteditable="true" data-column="quantity">${row.quantity}</td>
    `;

    // Event listener for row click
    tr.addEventListener("click", function (event) {
      toggleRowSelection(row.id, tr, event);
    });

    // Add event listeners for each contenteditable cell to update table data
    tr.querySelectorAll('[contenteditable="true"]').forEach(cell => {
      const columnKey = cell.getAttribute('data-column'); // Get the corresponding column key
      cell.addEventListener('input', function (event) {
        updateTableData(event, row.id, columnKey);
      });
    });

    tbody.appendChild(tr);
  });

  // Event listeners for checkbox state changes
  document.querySelectorAll('.row-select').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const rowId = parseInt(this.dataset.id);
      if (this.checked) {
        selectedRows.add(rowId);
      } else {
        selectedRows.delete(rowId);
      }
      currentSelectedRow = selectedRows.size === 1 ? rowId : null;
      renderTableData(); 
    });
  });
}

// Add new row after selected row or at the bottom if no row is selected
document.getElementById('addRow').addEventListener('click', () => {
  const newRow = {
    id: null,
    chemicalName: '',
    vendor: '',
    density: '',
    viscosity: '',
    packaging: '',
    packSize: '',
    unit: '',
    quantity: ''
  };

  if (currentSelectedRow) {
    const selectedIndex = tableData.findIndex(row => row.id === currentSelectedRow);
    tableData.splice(selectedIndex + 1, 0, newRow);
  } else {
    tableData.push(newRow);
    
  }
  updateRowIDs(); 
  
  renderTableData();
   // Rerender the table after adding the new row
});

// Select/Deselect all rows when the header checkbox is clicked
document.querySelector('#selectAll').addEventListener('change', function () {
  const isChecked = this.checked; // Get the checked state of the header checkbox

  // Update selectedRows set and the state of each checkbox
  document.querySelectorAll('.row-select').forEach(checkbox => {
    checkbox.checked = isChecked; // Set checkbox checked state
    const rowId = parseInt(checkbox.dataset.id);

    if (isChecked) {
      selectedRows.add(rowId);
    } else {
      selectedRows.delete(rowId); 
    }
  });

  renderTableData(); 
});

// Delete selected row(s)
document.getElementById('deleteRow').addEventListener('click', () => {
  if (selectedRows.size === 0) {
    alert('Please select a row to delete');
    return;
  }

  tableData = tableData.filter(row => !selectedRows.has(row.id));
  selectedRows.clear();
  updateRowIDs();
 
  renderTableData();
});

// Move row up (all the way to the top)
document.getElementById('moveUp').addEventListener('click', () => {
  if (selectedRows.size !== 1) {
    alert('Please select a single row to move');
    return;
  }

  const selectedIndex = tableData.findIndex(row => row.id === currentSelectedRow);
  if (selectedIndex > 0) {
    const tempRow = tableData.splice(selectedIndex, 1)[0];
    tableData.unshift(tempRow); 
    updateRowIDs();
    
    renderTableData();
  }
});

// Move row down (all the way to the bottom)
document.getElementById('moveDown').addEventListener('click', () => {
  if (selectedRows.size !== 1) {
    alert('Please select a single row to move');
    return;
  }

  const selectedIndex = tableData.findIndex(row => row.id === currentSelectedRow);
  if (selectedIndex < tableData.length - 1) {
    const tempRow = tableData.splice(selectedIndex, 1)[0];
    tableData.push(tempRow);
    updateRowIDs();
    
    renderTableData();
  }
});

// Object to track sort order for each column

let sortOrder = {}; 

// Sort function for table headers
document.querySelectorAll('th[data-sort]').forEach(th => {
  th.addEventListener('click', function () {
    const sortBy = this.dataset.sort;
    const isNumeric = !isNaN(tableData[0][sortBy]);
    sortOrder[sortBy] = !sortOrder[sortBy];

    tableData.sort((a, b) => {
      if (isNumeric) {
        return sortOrder[sortBy] ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy];
      } else {
        return sortOrder[sortBy] ? b[sortBy].localeCompare(a[sortBy]) : a[sortBy].localeCompare(b[sortBy]);
      }
    });

    renderTableData(); 
  });
});

document.getElementById('refreshTable').addEventListener('click', () => {
  const confirmRefresh = confirm("Are you sure you want to refresh the table? All unsaved changes will be lost."); 
  if (confirmRefresh) {
    // Fetch the latest data from localStorage
    const storedData = JSON.parse(localStorage.getItem('tableData')) || initialTableData;
    unsavedChanges = [];
    tableData = storedData; 
    selectedRows.clear(); 
    console.log("Data after refresh:", tableData); 
    renderTableData(); 
  }
});


// Function to update row IDs
function updateRowIDs() {
  tableData.forEach((row, index) => {
    row.id = index + 1;
  });
}

// Render the table initially
renderTableData();
