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
        const response = await fetch(`http://localhost:8080/search/patients?query=${query}&page=${pageN}`);
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
                gender,
                birth_date: { day, month, year },
                properties: {
                    allergies = [],
                    blood_type = { blood_type: 'Unknown' },
                    current_diseases = [],
                    current_medicaments = [],
                    insurance = { insurance: 'No insurance' },
                    medical_history = [],
                    vaccines = [],
                },
            } = item;

            // Create the result card
            const card = document.createElement('div');
            card.classList.add('result-card');

            // Generate the allergies list
            const allergiesList = allergies
                .map((allergy) => `<li>${allergy}</li>`)
                .join('');

            // Generate the medical history list
            const medicalHistoryList = medical_history
                .map(
                    (entry) =>
                        `<li>Disease ID: ${entry.disease_id} (Start: ${entry.start_date}, End: ${entry.end_date})</li>`
                )
                .join('');

            // Generate the vaccines list
            const vaccinesList = vaccines
                .map((vaccine) => `<li>${vaccine}</li>`)
                .join('');

            // Populate the card
            card.innerHTML = `
                <h3>${name} (ID: ${id})</h3>
                <p><strong>Gender:</strong> ${gender}</p>
                <p><strong>Date of Birth:</strong> ${day}-${month}-${year}</p>
                <p><strong>Blood Type:</strong> ${blood_type.blood_type}</p>
                <p><strong>Insurance:</strong> ${insurance.insurance}</p>
                <p><strong>Allergies:</strong></p>
                <ul>${allergiesList || '<li>No allergies reported</li>'}</ul>
                <p><strong>Current Diseases (IDs):</strong> ${current_diseases.join(', ') || 'None'}</p>
                <p><strong>Current Medicaments (IDs):</strong> ${current_medicaments.join(', ') || 'None'}</p>
                <p><strong>Medical History:</strong></p>
                <ul>${medicalHistoryList || '<li>No medical history available</li>'}</ul>
                <p><strong>Vaccines:</strong></p>
                <ul>${vaccinesList || '<li>No vaccines administered</li>'}</ul>
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