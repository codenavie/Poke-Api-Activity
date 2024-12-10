async function fetchPokemon(pokemon) {
    // Show loading alert while fetching data
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
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`);
        if (!response.ok) throw new Error('Pokemon not found');
        const data = await response.json();

        // Close loading alert and show success alert
        Swal.fire({
            title: 'Success!',
            text: `${data.name.toUpperCase()} found!`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });

        displayPokemon(data);
    } catch (error) {
        // Close loading alert and show error alert
        Swal.fire({
            title: 'Error!',
            text: 'Pokémon not found. Please check the name or ID and try again.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        document.querySelector('.pokemon-info').innerHTML = '';
    }
}
