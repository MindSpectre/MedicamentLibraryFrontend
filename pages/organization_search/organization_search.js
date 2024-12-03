// main.js
import {attachSearchEventListeners, loadSearchBlock} from '/blocks/search/search.js';
import { updateURL } from '/js/utils.js';
import {loadHeader, initializeHeader} from "/blocks/header/header.js";

const handleSearch = async (pageN) => {
    const query = document.getElementById('searchInput').value.trim();
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (!query) {
        resultsContainer.innerHTML = '<p>Please enter a search term.</p>';
        return;
    }

    // Update the URL to reflect the current query and page
    updateURL(query, pageN);

    try {
        const response = await fetch(`http://localhost:8080/search/organizations?query=${query}&page=${pageN}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();

        if (!data.length) {
            resultsContainer.innerHTML = '<p>No results found.</p>';
            return;
        }

        // Display results
        data.forEach((item) => {
            const {
                id,
                name,
                contact_details,
                country,
                type,
                properties: {
                    license = { license_key: 'N/A', license_name: 'No License' },
                },
            } = item;

            // Create the result card
            const card = document.createElement('div');
            card.classList.add('result-card');

            // Populate the card
            card.innerHTML = `
                <h3>${name} (ID: ${id})</h3>
                <p><strong>Type:</strong> ${type}</p>
                <p><strong>Country:</strong> ${country}</p>
                <p><strong>Contact Details:</strong> ${contact_details}</p>
                <p><strong>License Key:</strong> ${license.license_key}</p>
                <p><strong>License Name:</strong> ${license.license_name}</p>
            `;

            // Append the card to the results container
            resultsContainer.appendChild(card);
        });

    } catch (error) {
        resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    await loadSearchBlock("#search-container");
    await loadHeader();


    attachSearchEventListeners(handleSearch); // Attach event listeners for search functionality
    initializeHeader();

});