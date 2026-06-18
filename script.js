let playerData = {};
let rotated = false;

const layout = {
    orientation: "portrait",
    gridTemplateAreas: `"a b" "c d"`,
    gridTemplateColumns: 2,
    gridTemplateRows: 2,
    players: {
        a: { direction: "left" },
        b: { direction: "right" },
        c: { direction: "left" },
        d: { direction: "right" },
    },
};
const layout2 = {
    orientation: "portrait",
    gridTemplateAreas: `"a a" "b c" "b c" "d d"`,
    gridTemplateColumns: 2,
    gridTemplateRows: 4,
    players: {
        a: { direction: "top" },
        b: { direction: "left" },
        c: { direction: "right" },
        d: { direction: "bottom" },
    },
};

function toggleSettings() {
    const settingsContainerEl = document.querySelector(".settings-container");
    const settingsButtonEl = document.querySelector('.toggle-settings-button')
    if (settingsContainerEl.classList.contains("hidden")) {
        settingsContainerEl.classList.remove("hidden");
        settingsButtonEl.classList.add("hidden");
    } else {
        settingsContainerEl.classList.add("hidden");
        settingsButtonEl.classList.remove("hidden");
    }
}

function incrementLife(id, amount = 1) {
    const playerEl = document.getElementById(`player-${id}`);
    const lifeTotalDisplay = playerEl.querySelector(".life-total");
    playerData[id].lifeTotal += amount;
    lifeTotalDisplay.innerHTML = playerData[id].lifeTotal;
}

function paintPlayer(id, player) {
    const playerEl = document.createElement("div");
    playerEl.classList.add("player");
    playerEl.id = `player-${id}`;
    playerEl.style.gridArea = id;

    const contentEl = document.createElement("div");
    contentEl.classList.add("content");
    playerEl.appendChild(contentEl);

    const playerDirection = player.direction || "bottom";

    if (playerDirection == "bottom" || playerDirection == "left") {
        contentEl.innerHTML += `<p class="symbol small rotate-${playerDirection}">-</p>`;
    } else {
        contentEl.innerHTML += `<p class="symbol small rotate-${playerDirection}">+</p>`;
    }

    contentEl.innerHTML += `<p class="life-total rotate-${playerDirection}">40</p>`;

    if (playerDirection == "bottom" || playerDirection == "left") {
        contentEl.innerHTML += `<p class="symbol small rotate-${playerDirection}">+</p>`;
    } else {
        contentEl.innerHTML += `<p class="symbol small rotate-${playerDirection}">-</p>`;
    }

    if (playerDirection == "bottom") {
        playerEl.classList.add("dark-right");
        loseLifeClass = "left";
        gainLifeClass = "right";
    } else if (playerDirection == "top") {
        playerEl.classList.add("dark-left");
        loseLifeClass = "right";
        gainLifeClass = "left";
    } else if (playerDirection == "right") {
        playerEl.classList.add("dark-top");
        loseLifeClass = "bottom";
        gainLifeClass = "top";
    } else if (playerDirection == "left") {
        playerEl.classList.add("dark-bottom");
        loseLifeClass = "top";
        gainLifeClass = "bottom";
    }

    if (playerDirection == "left" || playerDirection == "right") {
        contentEl.classList.add("flex-col");
    }

    contentEl.innerHTML += `<div class="${loseLifeClass} clickable" onclick="incrementLife('${id}', -1)"></div>
        <div class="${gainLifeClass} clickable" onclick="incrementLife('${id}', 1)"></div>`;

    return playerEl;
}

function init(layout) {
    const playerContainerEl = document.querySelector(".player-container");
    playerContainerEl.style.gridTemplateColumns = `repeat(${layout.gridTemplateColumns}, 1fr)`;
    playerContainerEl.style.gridTemplateRows = `repeat(${layout.gridTemplateRows}, 1fr)`;
    playerContainerEl.style.gridTemplateAreas = layout.gridTemplateAreas;

    playerContainerEl.innerHTML = "";
    const playerIds = Object.keys(layout.players);
    for (let i = 0; i < playerIds.length; i++) {
        const id = playerIds[i];
        playerData[id] = {};
        if (!playerData[id].lifeTotal !== null) {
            playerData[id].lifeTotal = layout.startingLife || 40;
        }
        const child = paintPlayer(id, layout.players[id]);
        playerContainerEl.appendChild(child);
    }
}

function paintSetting(setting, playerId) {
    const settingEl = document.createElement("div");
    settingEl.classList.add("player");
    settingEl.id = `setting-${setting.label}`;
    settingEl.style.gridArea = playerId;

    const contentEl = document.createElement("div");
    contentEl.classList.add("content");
    settingEl.appendChild(contentEl);

    const isSplit = setting.split;

    if (isSplit) {
        contentEl.innerHTML += `<p class="symbol small rotate-bottom"><</p>`;
        settingEl.classList.add("dark-right");
    }

    contentEl.innerHTML += `<p class="life-total rotate-bottom">${setting.label || "[no label]"}</p>`;

    if (isSplit) {
        contentEl.innerHTML += `<p class="symbol small rotate-bottom">></p>`;
        contentEl.innerHTML += `<div class="left clickable" onclick="${setting.onLeft}"></div>
        <div class="right clickable" onclick="${setting.onRight}"></div>`;
    }

    return settingEl;
}

function getAtPosition(tree, position) {
    let current = tree;
    for (let i = 0; i < position.length; i++) {
        current = current.children[position[i]];
    }
    return current;
}

function paintSettings(settings, layout) {
    const settingsContainerEl = document.querySelector(".settings-container");
    settingsContainerEl.style.gridTemplateColumns = `repeat(${layout.gridTemplateColumns}, 1fr)`;
    settingsContainerEl.style.gridTemplateRows = `repeat(${layout.gridTemplateRows}, 1fr)`;
    settingsContainerEl.style.gridTemplateAreas = layout.gridTemplateAreas;
    settingsContainerEl.innerHTML = "";

    subSettings = getAtPosition(settings, currentSetting);

    const playerIds = Object.keys(layout.players);
    const availableSpace = playerIds.length;
    if (subSettings.length < availableSpace) {
        for (let i = 0; i < subSettings.length; i++) {
            const id = playerIds[i];
            const setting = subSettings[i];
            const child = paintSetting(setting, id);
            settingsContainerEl.appendChild(child);
        }
    }
}

function backSettings() {
    currentSetting.pop();
    paintSettings(settings, layout);
}

const settings = [
    { label: "Layout" },
    { label: "Restart" },
    { label: "[empty]" },
];
let currentSetting = [];
const exitSetting = { label: "Exit", onclick: "toggleSettings()" };
const backSetting = { label: "Back", onclick: "backSettings()" };

init(layout);
paintSettings(settings, layout)