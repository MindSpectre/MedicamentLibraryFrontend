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
        const response = await fetch(`http://localhost:8080/search/medicaments?query=${query}&page=${pageN}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();

        if (!data.length) {
            resultsContainer.innerHTML = '<p>No results found.</p>';
            return;
        }

        data.forEach((item) => {
            const {
                id, name, approval_number, approval_status, atc_code, manufacturer_id, prescription, type, properties: {
                    active_ingredients = [],
                    inactive_ingredients = [],
                    dosage_form = {description: 'Not specified'},
                    prescription: prescriptionInfo = {description: 'No information'},
                    side_effects = ['No known side effects'],
                    strength = {description: 'Not specified'},
                },
            } = item;

            // Create the result card
            const card = document.createElement('div');
            card.classList.add('result-card');

            // Generate the active ingredients list
            const activeIngredientsList = active_ingredients
                .map((ingredient) => `<li>${ingredient.name} (Risk Level: ${ingredient.risk_level})</li>`)
                .join('');

            // Generate the inactive ingredients list
            const inactiveIngredientsList = inactive_ingredients
                .map((ingredient) => `<li>${ingredient.name} (Risk Level: ${ingredient.risk_level})</li>`)
                .join('');

            // Generate the side effects list
            const sideEffectsList = side_effects
                .map((effect) => `<li>${effect}</li>`)
                .join('');

            // Populate the card
            card.innerHTML = `
                <h3>${name} (ID: ${id})</h3>
                <p><strong>Type:</strong> ${type}</p>
                <p><strong>Approval Number:</strong> ${approval_number}</p>
                <p><strong>Approval Status:</strong> ${approval_status}</p>
                <p><strong>ATC Code:</strong> ${atc_code}</p>
                <p><strong>Manufacturer ID:</strong> ${manufacturer_id}</p>
                <p><strong>Prescription Required:</strong> ${prescription ? 'Yes' : 'No'}</p>
                <p><strong>Prescription Info:</strong> ${prescriptionInfo.description}</p>
                <p><strong>Dosage Form:</strong> ${dosage_form.description}</p>
                <p><strong>Strength:</strong> ${strength.description}</p>
                <p><strong>Active Ingredients:</strong></p>
                <ul>${activeIngredientsList || '<li>No active ingredients</li>'}</ul>
                <p><strong>Inactive Ingredients:</strong></p>
                <ul>${inactiveIngredientsList || '<li>No inactive ingredients</li>'}</ul>
                <p><strong>Side Effects:</strong></p>
                <ul>${sideEffectsList || '<li>No known side effects</li>'}</ul>
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