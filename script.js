let japaneseNames;

// JSON ファイルを読み込んでポケモンの日本語名を取得
fetch('names.json')
    .then(response => response.json())
    .then(data => {
        // 英語名と日本語名の対応表を小文字に変換して格納
        japaneseNames = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key.toLowerCase(), value])
        );

        // 初期表示時にもう一度回すボタンを非表示に設定
        toggleButtonDisplay('resetButton', false);
    });

async function spinGacha() {
    const resultSection = document.getElementById("resultSection");
    resultSection.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        const pokemonData = await getPokemonData();
        displayPokemonResult(resultSection, pokemonData);
    }

    // もう一度回すボタンを表示にし、ガチャボタンを非表示にする
    toggleButtonDisplay('resetButton', true);
    toggleButtonDisplay('gachaButton', false);
}

async function getPokemonData() {
    const pokemonId = Math.floor(Math.random() * 898) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = await response.json();

    return {
        id: pokemonId,
        name: getJapaneseName(data.name.toLowerCase()), // 小文字に変換してから日本語名を取得
        image: data.sprites.front_default,
        description: await getPokemonDescription(pokemonId)
    };
}

function getJapaneseName(englishName) {
    // 小文字に変換した英語名で日本語名を取得
    return japaneseNames[englishName] || englishName;
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

    const imageElement = document.createElement("img");
    imageElement.src = pokemonData.image;
    imageElement.alt = pokemonData.name;

    const nameElement = document.createElement("p");
    nameElement.textContent = pokemonData.name;

    const descriptionElement = document.createElement("div");
    descriptionElement.classList.add("description");
    descriptionElement.textContent = pokemonData.description;

    pokemonElement.appendChild(imageElement);
    pokemonElement.appendChild(nameElement);
    pokemonElement.appendChild(descriptionElement);

    resultSection.appendChild(pokemonElement);
}


function toggleButtonDisplay(buttonId, isVisible) {
    // ボタンの表示を切り替えるヘルパー関数
    document.getElementById(buttonId).style.display = isVisible ? "block" : "none";
}
