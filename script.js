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
}

function incrementLife(player, amount = 1) {
    const playerEl = document.getElementById(player);
    const lifeTotalDisplay = playerEl.querySelector(".life-total");
    playerData[player].lifeTotal += amount;
    lifeTotalDisplay.innerHTML = playerData[player].lifeTotal;
}

function paintPlayer(id, player) {
    const playerEl = document.createElement("div");
    playerEl.classList.add("player");
    playerEl.id = id;
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
        playerData[id].lifeTotal = layout.startingLife || 40;
        const child = paintPlayer(id, layout.players[id]);
        playerContainerEl.appendChild(child);
    }
}

init(layout);
