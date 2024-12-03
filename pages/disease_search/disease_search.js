// main.js
import {attachSearchEventListeners, loadSearchBlock} from '/blocks/search/search.js';
import {updateURL} from '/js/utils.js';
import {loadHeader, initializeHeader} from "/blocks/header/header.js";


const handleSearch = async (query, pageN) => {

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (!query) {
        resultsContainer.innerHTML = '<p>Please enter a search term.</p>';
        return;
    }

    // Update the URL to reflect the current query and page
    updateURL(query, pageN);

    try {
        const response = await fetch(`http://localhost:3000/search/diseases?query=${query}&page=${pageN}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();

        if (!data.length) {
            resultsContainer.innerHTML = '<p>No results found.</p>';
            return;
        }

        // Display results in the grid
        data.forEach((item) => {
            const {
                id,
                name,
                is_infectious,
                type,
                properties: {
                    affected_age_groups = ['No data'],
                    complications = [],
                    curative_drugs = [],
                    risk_factors = [],
                    symptoms = [],
                } = {},
            } = item;

            // Create the result card
            const card = document.createElement('div');
            card.classList.add('result-card');

            // Generate the affected age groups
            const ageGroups = affected_age_groups.length
                ? affected_age_groups.join(', ')
                : 'No data';

            // Generate the complications list
            const complicationsList = complications.length
                ? complications.join(', ')
                : 'No known complications';

            // Generate the risk factors list
            const riskFactorsList = risk_factors.length
                ? risk_factors.join(', ')
                : 'No risk factors';

            // Generate the curative drugs list
            const curativeDrugsList = curative_drugs.length
                ? curative_drugs.map((drug) => `<li>Drug ID: ${drug}</li>`).join('')
                : '<li>No curative drugs</li>';

            // Generate the symptoms list
            const symptomsList = symptoms.length
                ? symptoms
                    .map(
                        (symptom) =>
                            `<li class = "spoiler"><strong>${symptom.name}</strong>: ${symptom.description} (Type: ${symptom.type}, Severity: ${symptom.severity}, Duration: ${symptom.duration})</li>`
                    )
                    .join('')
                : '<li class = "spoiler">No symptoms listed</li>';

            // Populate the card
            card.innerHTML = `
                <h3>${name} (ID: ${id})</h3>
                <a href="/wiki/diseases?id=${id}">Disease ID: ${id}</a>
                <p><strong>Type:</strong> ${type}</p>
                <p><strong>Infectious:</strong> ${is_infectious ? 'Yes' : 'No'}</p>
                <p><strong>Affected Age Groups:</strong> ${ageGroups}</p>
                <p><strong>Complications:</strong> ${complicationsList}</p>
                <p><strong>Risk Factors:</strong> ${riskFactorsList}</p>
                <p><strong>Curative Drugs:</strong></p>
                <ul>${curativeDrugsList}</ul>
                <p><strong>Symptoms:</strong></p>
                <ul>${symptomsList}</ul>
            `;

            // Append the card to the results container
            resultsContainer.appendChild(card);


        });
    } catch (error) {
        resultsContainer.innerHTML = `<p>Error fetching results: ${error.message}</p>`;
    }
};
document.addEventListener('DOMContentLoaded', async () => {
    await loadSearchBlock('#search-container');
    await loadHeader();


    attachSearchEventListeners(handleSearch); // Attach event listeners for search functionality
    initializeHeader();

});
