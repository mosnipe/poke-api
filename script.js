async function spinGacha() {
    const resultSection = document.getElementById("resultSection");
    resultSection.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        const pokemonData = await getPokemonData();
        displayPokemonResult(resultSection, pokemonData);
    }

    document.getElementById("gachaButton").style.display = "none";
    document.getElementById("resetButton").style.display = "block";
}

async function resetGacha() {
    const resultSection = document.getElementById("resultSection");
    resultSection.innerHTML = "";

    // もう一度ガチャを回す処理
    await spinGacha();
}


async function getPokemonData() {
    const pokemonId = Math.floor(Math.random() * 898) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = await response.json();

    return {
        name: data.name,
        image: data.sprites.front_default,
        description: await getPokemonDescription(pokemonId)
    };
}

async function getPokemonDescription(pokemonId) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
    const data = await response.json();
    const description = data.flavor_text_entries.find(entry => entry.language.name === "ja").flavor_text;

    return description;
}

function displayPokemonResult(resultSection, pokemonData) {
    const pokemonElement = document.createElement("div");
    pokemonElement.classList.add("pokemon");

    const ballElement = document.createElement("div");
    ballElement.classList.add("monster-ball");

    const imageElement = document.createElement("img");
    imageElement.src = pokemonData.image;
    imageElement.alt = pokemonData.name;

    const nameElement = document.createElement("p");
    nameElement.textContent = pokemonData.name;

    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = pokemonData.description;

    pokemonElement.appendChild(ballElement);
    pokemonElement.appendChild(imageElement);
    pokemonElement.appendChild(nameElement);
    pokemonElement.appendChild(descriptionElement);

    resultSection.appendChild(pokemonElement);
}
