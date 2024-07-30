document.addEventListener("DOMContentLoaded", function () {
    const salesList = document.getElementById("salesList");
    const totalSalesElement = document.getElementById("totalSales");
    const totalOrdersElement = document.getElementById("totalOrders");
    const checkoutPopup = document.getElementById("checkoutPopup");
    const printButton = document.getElementById("printButton");
    const closePopupButton = document.getElementById("closePopupButton");
    const invoiceTableBody = document.getElementById("invoiceTableBody");
    const customerNameInput = document.getElementById("customerName");
    const customerEmailInput = document.getElementById("customerEmail");
    const customerPhoneInput = document.getElementById("customerPhone");

    // Fetch sales data from the server
    const fetchSalesData = async () => {
        try {
            const response = await fetch("https://wizzypos.vercel.app/api/sales"); // Ensure this endpoint is correct
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Sales Data:", data); // Debugging line to see the fetched data
            updateSalesHistory(data);
            updateTotalSalesAndOrders(data);
        } catch (error) {
            console.error("Error fetching sales data:", error);
        }
    };

    // Update the sales history section with fetched data
    const updateSalesHistory = (data) => {
        if (data && Array.isArray(data)) {
            salesList.innerHTML = data.map(sale => `
                <div class="sale-card">
                    <p><strong>Sale Number:</strong> ${sale.saleId}</p>
                    <p><strong>Date:</strong> ${new Date(sale.timestamp).toLocaleDateString()}</p>
                    <p><strong>Total Price:</strong> $${sale.totalPrice.toFixed(2)}</p>
                    <p><strong>Change Given:</strong> $${sale.change.toFixed(2)}</p>
                    <button data-sale-id="${sale.saleId}">View Details</button>
                </div>
            `).join("");

            document.querySelectorAll(".sale-card button").forEach(button => {
                button.addEventListener("click", function () {
                    const saleId = this.getAttribute("data-sale-id");
                    if (saleId) {
                        showPopup(saleId);
                    } else {
                        console.error("Sale ID not found for button");
                    }
                });
            });
        } else {
            console.error("Invalid data format:", data);
        }
    };

    // Update the total sales and total orders
    const updateTotalSalesAndOrders = (data) => {
        if (data && Array.isArray(data)) {
            const totalSales = data.reduce((sum, sale) => sum + sale.totalPrice, 0);
            const totalOrders = data.length;

            totalSalesElement.textContent = `$${totalSales.toFixed(2)}`;
            totalOrdersElement.textContent = totalOrders;
        } else {
            console.error("Invalid data format for total calculation:", data);
        }
    };

    // Show the checkout popup with sale details
    const showPopup = async (saleId) => {
        console.log("Showing popup for Sale ID:", saleId); // Debugging line to see saleId
        try {
            if (typeof saleId !== "string" || !saleId.trim()) {
                throw new Error(`Invalid saleId: ${saleId}`);
            }
            const response = await fetch(`https://wizzypos.vercel.app/api/sales/${saleId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const saleData = await response.json();
            console.log("Sale Data:", saleData); // Debugging line to see the sale data
            populatePopup(saleData);
            checkoutPopup.classList.remove("hidden");
        } catch (error) {
            console.error("Error fetching sale details:", error);
        }
    };

    // Populate the checkout popup with sale details
    const populatePopup = (sale) => {
        if (sale && sale.items && Array.isArray(sale.items)) {
            invoiceTableBody.innerHTML = sale.items.map(item => {
                const price = item.price || 0; // Default to 0 if price is undefined
                const quantity = item.quantity || 0; // Default to 0 if quantity is undefined
                const total = (price * quantity).toFixed(2); // Use toFixed on a number
                
                return `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.code}</td>
                        <td>$${price.toFixed(2)}</td>
                        <td>${quantity}</td>
                        <td>$${total}</td>
                    </tr>
                `;
            }).join("");

            // Populate customer details
            customerNameInput.value = sale.customerName || '';
            customerEmailInput.value = sale.customerEmail || '';
            customerPhoneInput.value = sale.customerPhone || '';

        } else {
            console.error("Invalid sale data format:", sale);
        }
    };

    printButton.addEventListener("click", () => {
        window.print();
    });

    closePopupButton.addEventListener("click", () => {
        checkoutPopup.classList.add("hidden");
    });

    fetchSalesData();
    const resizeBtn = document.querySelector("[data-resize-btn]");
  resizeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      document.body.classList.toggle("sb-expanded");
  });
});
