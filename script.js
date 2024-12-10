// DOM Elements
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const pokemonInfo = document.getElementById('pokemon-info');

// Map Pokémon types to colors
const typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD'
};

// Fetch Pokémon Data
async function fetchPokemon(pokemon) {
    // Display loading alert
    Swal.fire({
        title: 'Searching...',
        text: 'Fetching Pokémon data, please wait.',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        // API Request for Pokémon data
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`);
        if (!response.ok) throw new Error('Pokémon not found');

        const data = await response.json();
        
        // API Request for Evolution Chain data
        const evolutionResponse = await fetch(data.species.url);
        const evolutionData = await evolutionResponse.json();
        const evolutionChainUrl = evolutionData.evolution_chain.url;
        
        // Fetch evolution chain
        const evolutionResponseData = await fetch(evolutionChainUrl);
        const evolutionChain = await evolutionResponseData.json();

        // Show success alert
        Swal.fire({
            title: 'Success!',
            text: `${data.name.toUpperCase()} found!`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });

        // Display Pokémon and Evolution data
        displayPokemon(data, evolutionChain);
    } catch (error) {
        // Show error alert
        Swal.fire({
            title: 'Error!',
            text: 'Pokémon not found. Please check the name or ID and try again.',
            icon: 'error',
            confirmButtonText: 'OK'
        });

        // Clear Pokémon info display
        pokemonInfo.innerHTML = '';
    }
}

// Display Pokémon Data and Evolution Chain
function displayPokemon(data, evolutionChain) {
    const { name, sprites, abilities, types, stats } = data;
    
    // Create formatted lists for abilities, types, and stats
    const abilitiesList = abilities.map(a => a.ability.name).join(', ');
    const typesList = types.map(t => t.type.name).join(', ');
    const statsList = stats.map(s => `<li>${s.stat.name}: ${s.base_stat}</li>`).join('');

    // Set background color based on Pokémon's first type
    const primaryType = types[0].type.name; // Use the first type as the primary type
    const backgroundColor = typeColors[primaryType] || '#fff'; // Default to white if type not found
    document.body.style.backgroundColor = backgroundColor;

    // Display the Pokémon info
    pokemonInfo.innerHTML = `
        <h2>${name.toUpperCase()}</h2>
        <img src="${sprites.front_default}" alt="${name}">
        <p><strong>Abilities:</strong> ${abilitiesList}</p>
        <p><strong>Types:</strong> ${typesList}</p>
        <ul><strong>Stats:</strong>${statsList}</ul>
        <div id="evolution-chain"><strong>Evolution Chain:</strong></div>
    `;

    // Display Evolution Chain
    displayEvolutionChain(evolutionChain);
}

// Display Evolution Chain with Pokémon Images
async function displayEvolutionChain(chain) {
    const evolutionChainContainer = document.getElementById('evolution-chain');
    evolutionChainContainer.innerHTML = ''; // Clear previous data

    // Function to create the evolution chain elements
    const createEvolutionElement = async (evolution) => {
        const evolutionElement = document.createElement('div');
        evolutionElement.classList.add('evolution-stage');
        
        // Fetch the Pokémon's official artwork
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${evolution.species.name}`);
        const pokemonData = await pokemonResponse.json();
        
        // Create the HTML content with the name and image of the Pokémon
        evolutionElement.innerHTML = `
            <p>${evolution.species.name.toUpperCase()}</p>
            <img src="${pokemonData.sprites.other['official-artwork'].front_default}" alt="${evolution.species.name}">
        `;
        return evolutionElement;
    };

    let currentEvolution = chain.chain;
    while (currentEvolution) {
        // Create and append the evolution element with the Pokémon's image
        const evolutionElement = await createEvolutionElement(currentEvolution);
        evolutionChainContainer.appendChild(evolutionElement);
        
        // Move to the next evolution stage (if it exists)
        currentEvolution = currentEvolution.evolves_to[0];
    }
}

// Event Listener for Search Button
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) fetchPokemon(query); // Fetch Pokémon data if input is not empty
});

// Welcome message when the page is loaded
window.onload = () => {
    Swal.fire({
        title: 'Welcome Pokemon Trainer!',
        text: 'Find the Pokemon you want by searching their name or ID.',
        icon: 'info',
        confirmButtonText: 'Let\'s Go!',
        allowOutsideClick: false
    });
};
