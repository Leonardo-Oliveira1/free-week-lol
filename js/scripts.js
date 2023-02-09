const latest_version = "13.1.1"
const api_key = "RGAPI-ff9dcd8b-7132-4b00-9727-178c180c0035"

const url_free_rotation = `https://br1.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=${api_key}`
const url_champions_id = `https://ddragon.leagueoflegends.com/cdn/${latest_version}/data/pt_BR/champion.json`

const free_week_container = document.querySelector("#free_week_container")
const champion_info = document.querySelector("#champion_info")
const loading = document.querySelector("#loading")

const url_search_params = new URLSearchParams(window.location.search)
const post_id = url_search_params.get("id")

async function getFreeRotationData() {
    const responseFreeRotation = await fetch(url_free_rotation)
    const dataFreeRotation = await responseFreeRotation.json();

    const responseChampionName = await fetch(url_champions_id)
    const dataChampionName = await responseChampionName.json();

    champions = dataFreeRotation.freeChampionIds;

    loading.classList.add("hide")

    champions.forEach(free_week_champion_key => {
        Object.keys(dataChampionName.data).map((champion) => {
            if (dataChampionName.data[champion].key == free_week_champion_key) {
                const champion_name_formatted = formatting_champions_name(dataChampionName.data[champion].name)
                show_free_week_champions(dataChampionName.data[champion], champion_name_formatted)
            }
        })
    });
}

function show_free_week_champions(champion, champion_name) {
    const link = document.createElement("a")
    const div = document.createElement("div")
    const img = document.createElement("img")
    const champion_name_text = document.createElement("p")

    champion_name_text.innerText = champion.name
    img.setAttribute("src", `http://ddragon.leagueoflegends.com/cdn/${latest_version}/img/champion/${champion_name}.png`)
    link.setAttribute("href", `champion_page.html?id=${champion.key}`)

    div.appendChild(img)
    div.appendChild(champion_name_text)

    free_week_container.appendChild(link)
    link.appendChild(div)
}

function show_champion_info(champion_data, champion_name) {
    const div = document.createElement("div")
    const img = document.createElement("img")
    const champion_name_text = document.createElement("h1")
    const champion_blurb = document.createElement("p")
    const champion_tag = document.createElement("p")
    const champion_title = document.createElement("p")
    const champion_difficulty = document.createElement("p")
    
    img.className = 'img-fluid';
    champion_name_text.id = 'champion-name'

    champion_name_text.innerText = champion_data[champion_name].name + ", " + champion_data[champion_name].title
    champion_blurb.innerText = champion_data[champion_name].blurb
    champion_tag.innerText = champion_data[champion_name].tags[0]

    if(champion_data[champion_name].info.difficulty <= 3){
        champion_difficulty.innerText = "Dificuldade: Baixa"
    }else if (champion_data[champion_name].info.difficulty <= 7){
        champion_difficulty.innerText = "Dificuldade: Média"
    }else if (champion_data[champion_name].info.difficulty >= 8) {
        champion_difficulty.innerText = "Dificuldade: Alta"
    }

    img.setAttribute("src", `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion_name}_0.jpg`)

    div.appendChild(img)
    div.appendChild(champion_name_text)
    div.appendChild(champion_blurb)
    div.appendChild(champion_tag)
    div.appendChild(champion_difficulty)

    champion_info.appendChild(div)

    
}

function formatting_champions_name(champion_name) {
    const remove_blank_space_and_apostrophe = champion_name.replace(/[\s']/g, '');

    const all_words_lowercase = remove_blank_space_and_apostrophe.toLowerCase()
    const first_uppercase = all_words_lowercase[0].toUpperCase() + all_words_lowercase.substring(1)

    if (champion_name == "Master Yi") {
        const remove_blank_space = champion_name.replace(/\s/g, '');

        return remove_blank_space
    }

    return first_uppercase;

}

async function get_champion_info(id) {
    const responseChampionName = await fetch(url_champions_id)
    const dataChampionName = await responseChampionName.json();

    Object.keys(dataChampionName.data).map((champion) => {
        if (dataChampionName.data[champion].key == id) {
            const champion_name_formatted = formatting_champions_name(dataChampionName.data[champion].name)

            show_champion_info(dataChampionName.data, champion_name_formatted)
        }
    })

}

if (!post_id) {
    getFreeRotationData()
} else {
    get_champion_info(post_id)
}