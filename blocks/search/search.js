// search.js



export async function loadSearchBlock(containerSelector) {
    const response = await fetch('/blocks/search/search.html');
    if (!response.ok) throw new Error('Search block not found');

    const searchContent = await response.text();
    const container = document.querySelector(containerSelector);

    if (container) {
        container.insertAdjacentHTML('beforeend', searchContent)
    } else {
        throw new Error(`Container not found: ${containerSelector}`);
    }
}
// search.js
export const attachSearchEventListeners = (handleSearch) => {
    // const url = new URL(window.location);
    // const q = url.searchParams.get('query');
    // if(q){
    //     handleSearch(q, currentPage);
    // }

    let currentPage = 1;

    document.getElementById('searchButton').addEventListener('click', () => {
        currentPage = 1;
        const query = document.getElementById('searchInput').value.trim();
        handleSearch(query, currentPage);
    });

    document.getElementById('searchInput').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            currentPage = 1;
            const query = document.getElementById('searchInput').value.trim();
            handleSearch(query, currentPage);
        }
    });

    document.getElementById('firstPageButton').addEventListener('click', () => {
        currentPage = 1;
        const query = document.getElementById('searchInput').value.trim();
        handleSearch(query, currentPage);
    });

    document.getElementById('nextButton').addEventListener('click', () => {
        currentPage += 1;
        const query = document.getElementById('searchInput').value.trim();
        handleSearch(query, currentPage);
    });

    document.getElementById('superNextButton').addEventListener('click', () => {
        currentPage += 2;
        const query = document.getElementById('searchInput').value.trim();
        handleSearch(query, currentPage);
    });

    document.getElementById('prevButton').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage -= 1;
            const query = document.getElementById('searchInput').value.trim();
            handleSearch(query, currentPage);
        }
    });
};

