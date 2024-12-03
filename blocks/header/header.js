
export async function loadHeader() {

    const response = await fetch('/blocks/header/header.html'); // Fetch header content
    if (!response.ok) throw new Error('Header not found'); // Handle fetch errors
    const headerContent = await response.text(); // Read the header content as text
    document.body.insertAdjacentHTML('afterbegin', headerContent); // Insert at the top of the body
}

export function initializeHeader() {
    const searchInput = document.querySelector('.navigator-input-search');
    const searchBox = document.querySelector('.navigator-search-box');
    const suggestion = document.querySelector('.navigate-search-suggestion');
    if (!searchInput || !searchBox) {
        console.error('Search box or input not found in header.');
        return;
    }

    // List of site pages
    const sitePages = [
        {name: 'Main Page', url: '/index.html'},
        {name: 'Disease Search', url: '/pages/disease_search/disease_search.html'},
        {name: 'Medicament Search', url: '/pages/medicament_search/medicament_search.html'},
        {name: 'Patients Search', url: '/pages/patient_search/patient_search.html'},
        {name: 'Organizations Search', url: '/pages/organization_search/organization_search.html'}
    ];

    // Create a dropdown for suggestions
    const dropdown = document.createElement('div');
    dropdown.classList.add('navigate-search-dropdown');
    searchBox.appendChild(dropdown);

    // Filter and display suggestions
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        dropdown.innerHTML = ''; // Clear previous results

        if (query) {
            const filteredPages = sitePages.filter(page =>
                page.name.toLowerCase().includes(query)
            );

            if (filteredPages.length === 0) {
                dropdown.innerHTML = '<div class="navigate-search-suggestion">No results found</div>';
            } else {
                filteredPages.forEach(page => {
                    const suggestion = document.createElement('div');
                    suggestion.classList.add('navigate-search-suggestion');
                    suggestion.textContent = page.name;

                    // Add click event for navigation
                    suggestion.addEventListener('click', () => {
                        window.location.href = page.url; // Navigate to the page
                    });

                    dropdown.appendChild(suggestion);
                });
            }
        }
    });

    // Navigate on Enter key press
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && dropdown.firstChild) {
            const firstSuggestion = dropdown.firstChild.textContent;
            const matchedPage = sitePages.find(page => page.name === firstSuggestion);
            if (matchedPage) {
                window.location.href = matchedPage.url; // Navigate to the page
            }
        }
    });
    suggestion.addEventListener('click', () => {
        window.location.href = page.url; // Navigate to the page
    });

    // Hide dropdown if input loses focus
    searchInput.addEventListener('blur', () => {
        setTimeout(() => {
            dropdown.innerHTML = ''; // Delay to ensure click events work
        }, 100);
    });
}
