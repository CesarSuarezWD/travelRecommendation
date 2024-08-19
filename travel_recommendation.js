document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const suggestionsContainer = document.getElementById('suggestions-container');
    const clearButton = document.getElementById('clear-button');

    let data = {
        countries: [],
        temples: [],
        beaches: []
    };


    async function loadData() {
        try {
            const response = await fetch('./travel_recommendation_api.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            data = await response.json();
            console.log('data: ', data);
            
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }


    function normalizeText(text) {
        return text.toLowerCase().replace(/[\s,.]+/g, '');
    }


    function filterData(term) {
        const normalizedTerm = normalizeText(term);
        const results = [];

        function addMatches(items) {
            items.forEach(item => {
                const normalizedName = normalizeText(item.name);
                if (normalizedName.includes(normalizedTerm)) {
                    results.push(item);
                }
            });
        }

        addMatches(data.countries.flatMap(c => c.cities));
        addMatches(data.temples);
        addMatches(data.beaches);

        return results;
    }


    function displaySuggestions(suggestions) {
        suggestionsContainer.innerHTML = '';

        if (suggestions.length === 0) {
            suggestionsContainer.innerHTML = '<p>No results found</p>';
            return;
        }

        suggestions.forEach(item => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <strong>${item.name}</strong>
                <div class="description">${item.description}</div>
                <button class="view-button" data-name="${item.name}">Ver</button>
            `;
            suggestionsContainer.appendChild(div);
        });


        const viewButtons = document.querySelectorAll('.view-button');
        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const name = button.getAttribute('data-name');
                alert(`You clicked on view for: ${name}`);
            });
        });
    }


    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value;
        if (searchTerm.length > 0) {
            const suggestions = filterData(searchTerm);
            displaySuggestions(suggestions);
        } else {
            suggestionsContainer.innerHTML = '';
        }
    });


    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        suggestionsContainer.innerHTML = '';
    });


    loadData().then(() => {
        console.log('Data loaded successfully');
    }).catch((error) => {
        console.error('Error loading data:', error);
    });
});
