class PageScroller {
    constructor(baseURL, query, containerId, maxPages = 10) {
        this.baseURL = baseURL;
        this.query = query;
        this.container = document.getElementById(containerId);
        this.maxPages = maxPages;
        this.currentPage = 1;
        this.totalPages = 1; // Will update based on server response
    }

    async fetchData(page) {
        try {
            const response = await fetch(`${this.baseURL}?query=${this.query}&page=${page}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.totalPages = data.totalPages; // Update total pages if returned by server
            this.currentPage = page;
            this.renderScroller();
            this.displayResults(data.results);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    displayResults(results) {
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = ""; // Clear previous results
        results.forEach(result => {
            const div = document.createElement('div');
            div.textContent = result.name; // Adjust based on your data structure
            resultsContainer.appendChild(div);
        });
    }

    renderScroller() {
        this.container.innerHTML = ""; // Clear previous buttons

        const createButton = (text, page) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.disabled = page === this.currentPage || page < 1 || page > this.totalPages;
            button.addEventListener('click', () => this.fetchData(page));
            return button;
        };

        // Add "<<", previous pages, current, next pages, ">>"
        this.container.appendChild(createButton("<<", 1));
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(this.totalPages, this.currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            this.container.appendChild(createButton(i.toString(), i));
        }

        this.container.appendChild(createButton(">>", this.totalPages));
    }

    init() {
        this.fetchData(1); // Fetch first page on init
    }
}