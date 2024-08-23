document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const novelGrid = document.getElementById('novel-grid');
    const novelItems = Array.from(document.querySelectorAll('.novel-item'));

    function rankTitles(query, titles) {
        return titles.map(title => {
            const lowerTitle = title.toLowerCase();
            const lowerQuery = query.toLowerCase();
            let rank = 0;
            
            // Ranking by the number of matching characters and positions
            if (lowerTitle.includes(lowerQuery)) {
                rank += 10; // Higher rank if the title includes the query
            } else {
                const titleIndex = lowerTitle.indexOf(lowerQuery);
                if (titleIndex !== -1) {
                    rank += (lowerTitle.length - titleIndex) / lowerTitle.length * 10;
                }
            }
            
            return { title, rank };
        }).sort((a, b) => b.rank - a.rank);
    }

    function updateSearchResults(query) {
        if (query === '') {
            novelItems.forEach(item => item.style.display = 'block');
            return;
        }
        
        const rankedTitles = rankTitles(query, novelItems.map(item => item.querySelector('p').textContent));
        
        // Clear the grid and display ranked titles
        novelGrid.innerHTML = '';
        rankedTitles.forEach(({ title }) => {
            const item = novelItems.find(item => item.querySelector('p').textContent === title);
            if (item) {
                item.style.display = 'block';
                novelGrid.appendChild(item); // Move item to the end of the grid
            }
        });

        novelItems.forEach(item => {
            if (!rankedTitles.some(({ title }) => item.querySelector('p').textContent === title)) {
                item.style.display = 'none';
            }
        });
    }

    searchInput.addEventListener('input', () => {
        updateSearchResults(searchInput.value.trim());
    });

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission behavior
            const query = searchInput.value.trim();
            updateSearchResults(query); // Ensure results are updated on Enter
        }
    });
});


