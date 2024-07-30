document.addEventListener('DOMContentLoaded', () => {
    const salesChartCtx = document.getElementById('salesChart').getContext('2d');
    const expensesChartCtx = document.getElementById('expensesChart').getContext('2d');
    const comparisonChartCtx = document.getElementById('comparisonChart').getContext('2d');
    const resizeBtn = document.querySelector("[data-resize-btn]");
    resizeBtn.addEventListener("click", function (e) {
        e.preventDefault();
        document.body.classList.toggle("sb-expanded");
    });
    function fetchData() {
        fetch('https://wizzypos.netlify.app/api/statistics')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    initCharts(data.statistics);
                } else {
                    console.error('Error fetching statistics:', data.message);
                }
            })
            .catch(error => console.error('Error fetching statistics:', error));
    }

    function initCharts(statistics) {
        const salesData = statistics.sales || [];
        const expenses = statistics.expenses || 0;

        // Prepare data for the sales chart
        const salesLabels = salesData.map(d => new Date(d._id).toLocaleDateString());
        const salesValues = salesData.map(d => d.total);

        // Create Sales Line Chart
        new Chart(salesChartCtx, {
            type: 'line',
            data: {
                labels: salesLabels,
                datasets: [{
                    label: 'Sales',
                    data: salesValues,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Sales: $${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Amount ($)'
                        },
                        beginAtZero: true
                    }
                }
            }
        });

        // Create Expenses Bar Chart
        new Chart(expensesChartCtx, {
            type: 'bar',
            data: {
                labels: ['Total Expenses'],
                datasets: [{
                    label: 'Expenses',
                    data: [expenses],
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Expenses: $${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Category'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Amount ($)'
                        },
                        beginAtZero: true
                    }
                }
            }
        });

        // Prepare data for the comparison chart
        const comparisonLabels = salesLabels; // Use the same labels as sales
        const comparisonSales = salesValues;
        const comparisonExpenses = new Array(comparisonLabels.length).fill(expenses);

        // Create Comparison Chart
        new Chart(comparisonChartCtx, {
            type: 'bar',
            data: {
                labels: comparisonLabels,
                datasets: [{
                    label: 'Sales',
                    data: comparisonSales,
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    barThickness: 12
                }, {
                    label: 'Expenses',
                    data: comparisonExpenses,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    barThickness: 12
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: $${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Amount ($)'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    fetchData();
});
