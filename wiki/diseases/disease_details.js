const updateURL = () => {
    const url = new URL(window.location);
    const id = url.searchParams.get('id'); // Extract the `id` from the query parameter
    if (id) {
        url.pathname += `/${id}`; // Append the `id` to the pathname
        url.search = ''; // Clear the query parameters
        window.history.pushState({}, '', url); // Update the browser URL
    }
};

// Function to fetch and render entity data
function loadEntityPage() {
    const url = new URL(window.location);
    const id = url.searchParams.get('id'); // Extract the `id` from the query parameter
    console.log(id);
    if (id) {
        fetch(`/wiki/diseases/${id}`) // Call backend API with the `id`
            .then((response) => {
                if (!response.ok) throw new Error('Failed to fetch entity data');
                return response.json();
            })
            .then((data) => {
                // Render the fetched data into the page
                document.getElementById('entity-details').innerHTML = `
                    <h1>${data.name}</h1>
                    <p>${data.description}</p>
                `;
            })
            .catch((error) => {
                console.error('Error:', error);
                document.getElementById('entity-details').innerHTML = `
                    <p>Failed to load entity details. Please try again later.</p>
                `;
            });
    } else {
        // Handle cases where `id` is missing
        document.getElementById('entity-details').innerHTML = `
            <p>Page not found or invalid URL.</p>
        `;
    }
}

// Load content when the page loads
document.addEventListener("DOMContentLoaded", loadEntityPage);
