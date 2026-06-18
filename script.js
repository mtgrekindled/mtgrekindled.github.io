let playerData = {};
let rotated = false;

const layouts = [
    {
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
    },
    {
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
    },
];

function toggleSettings() {
    const settingsContainerEl = document.querySelector(".settings-container");
    const settingsButtonEl = document.querySelector(".toggle-settings-button");
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

function paintPlayer(id, player, mini = false) {
    const playerEl = document.createElement("div");
    playerEl.classList.add("player");
    playerEl.style.gridArea = id;

    const contentEl = document.createElement("div");
    contentEl.classList.add("content");
    playerEl.appendChild(contentEl);

    const playerDirection = player.direction || "bottom";

    if (mini) {
        contentEl.innerHTML += `
<svg class="player-svg player-svg-${playerDirection}" viewBox="0 0 100 100">
    <circle cx="50" cy="30" r="20" fill="currentColor"/>
    <path d="M10 100 C10 70 30 60 50 60 C70 60 90 70 90 100 Z" fill="currentColor"/>
</svg>`;
    } else {
        playerEl.id = `player-${id}`;

        if (playerDirection == "bottom" || playerDirection == "left") {
            contentEl.innerHTML += `<p class="symbol small rotate-${playerDirection}">-</p>`;
        } else {
            contentEl.innerHTML += `<p class="symbol small rotate-${playerDirection}">+</p>`;
        }

        const startingLife = player.startingLife || 40;
        contentEl.innerHTML += `<p class="life-total rotate-${playerDirection}">${startingLife}</p>`;

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
    }
    return playerEl;
}

function init(layout) {
    const playerContainerEl = document.querySelector("#player-container");
    playerContainerEl.style.gridTemplateColumns = `repeat(${layout.gridTemplateColumns}, 1fr)`;
    playerContainerEl.style.gridTemplateRows = `repeat(${layout.gridTemplateRows}, 1fr)`;
    playerContainerEl.style.gridTemplateAreas = layout.gridTemplateAreas;

    playerContainerEl.innerHTML = "";
    const playerIds = Object.keys(layout.players);
    for (let i = 0; i < playerIds.length; i++) {
        const id = playerIds[i];
        if (!playerData[id]) {
            playerData[id] = {};
        }
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

    if (setting.render) {
        contentEl.appendChild(setting.render);
    }
    contentEl.innerHTML += `<p class="life-total small word-wrap rotate-bottom">${setting.label || "[no label]"}</p>`;

    if (isSplit) {
        contentEl.innerHTML += `<p class="symbol small rotate-bottom">></p>`;
        contentEl.innerHTML += `<div class="left clickable" onclick="${setting.onLeft}"></div>
        <div class="right clickable" onclick="${setting.onRight}"></div>`;
    } else if (setting.onclick) {
        contentEl.innerHTML += `<div class="full clickable" onclick="${setting.onclick}"></div>`;
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
        if (currentSetting.length == 0) {
            const id = playerIds[availableSpace - 1];
            const child = paintSetting(exitSetting, id);
            settingsContainerEl.appendChild(child);
        }
    }
}

function backSettings() {
    currentSetting.pop();
    paintSettings(settings, settingLayout);
}

function paintMiniLayout(layout) {
    const playerContainerEl = document.createElement("div");
    playerContainerEl.classList.add("grid", "player-container", "mini");
    playerContainerEl.style.gridTemplateColumns = `repeat(${layout.gridTemplateColumns}, 1fr)`;
    playerContainerEl.style.gridTemplateRows = `repeat(${layout.gridTemplateRows}, 1fr)`;
    playerContainerEl.style.gridTemplateAreas = layout.gridTemplateAreas;
    playerContainerEl.style.background = `var(--color-background)`;

    const playerIds = Object.keys(layout.players);
    for (let i = 0; i < playerIds.length; i++) {
        const id = playerIds[i];
        player = layout.players[id];
        player.startingLife = layout.startingLife || 40;
        const child = paintPlayer(id, player, (mini = true));
        playerContainerEl.appendChild(child);
    }

    return playerContainerEl;
}

let layoutSettings = [];
for (let i = 0; i < layouts.length; i++) {
    const layout = layouts[i];
    const setting = {
        render: paintMiniLayout(layout),
        label: "layout",
    };
    layoutSettings.push(setting);
}

const settings = [
    { label: "change layout", children: layoutSettings },
    { label: "restart game" },
    layoutSettings[1],
];
let currentSetting = [];
const exitSetting = { label: "Exit", onclick: "toggleSettings()" };
const backSetting = { label: "Back", onclick: "backSettings()" };

const settingLayout = layouts[0]
const layout = layouts[1];
init(layout);
paintSettings(settings, settingLayout);
