function writeLog(e, showLog = false) {
    if (errorTimestamp) {
        const d = new Date();

        const date = d
            .toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            })
            .replace(",", "");
        document.querySelector("#error-log").innerHTML += `<br>[${date}] ${e}`;
    } else {
        document.querySelector("#error-log").innerHTML += `<br>${e}`;
    }
    if (showLog) {
        show(document.querySelector(".error-log-container"));
    }
}

let errorTimestamp = true;
let errorSource = false;

window.onerror = function (message, source, line, column, error) {
    writeLog(
        `${message} - line ${line}:${column} ${errorSource ? `- source ${source}` : ""}`,
        (showLog = true),
    );
};

if (!window.BUILD_INFO) {
    window.BUILD_INFO = {
        hash: "dev",
        timestamp: "local",
    };
}

writeLog("Error Log");

function testError() {
    throw new Error("testError");
}

function testCurrentBuild() {
    writeLog(`commit: ${BUILD_INFO.hash} (${BUILD_INFO.timestamp})`);
}
testCurrentBuild();

let playerData = {};
const original_layouts = [
    {
        gridTemplateAreas: `"a b" "c d"`,
        gridTemplateColumns: 2,
        gridTemplateRows: 2,
        players: {
            a: { direction: "left" },
            b: { direction: "right" },
            c: { direction: "left" },
            d: { direction: "right" },
        },
        maxRotations: 2,
    },
    {
        gridTemplateAreas: `"a a" "b c" "b c" "d d"`,
        gridTemplateColumns: 2,
        gridTemplateRows: 4,
        players: {
            a: { direction: "top" },
            b: { direction: "left" },
            c: { direction: "right" },
            d: { direction: "bottom" },
        },
        maxRotations: 2,
    },
    {
        gridTemplateAreas: `"a" "b"`,
        gridTemplateColumns: 1,
        gridTemplateRows: 2,
        players: {
            a: { direction: "top" },
            b: { direction: "bottom" },
        },
        startingLife: 20,
        maxRotations: 2,
    },
    {
        gridTemplateAreas: `"a"`,
        gridTemplateColumns: 1,
        gridTemplateRows: 1,
        players: {
            a: { direction: "bottom" },
        },
    },
    {
        gridTemplateAreas: `"a" "b"`,
        gridTemplateColumns: 1,
        gridTemplateRows: 2,
        players: {
            a: { direction: "left" },
            b: { direction: "left" },
        },
        startingLife: 20,
    },
    {
        gridTemplateAreas: `"a" "b"`,
        gridTemplateColumns: 1,
        gridTemplateRows: 2,
        players: {
            a: { direction: "left" },
            b: { direction: "right" },
        },
        startingLife: 20,
        maxRotations: 2,
    },
    {
        gridTemplateAreas: `"a b" "c ."`,
        gridTemplateColumns: 2,
        gridTemplateRows: 2,
        players: {
            a: { direction: "left" },
            b: { direction: "right" },
            c: { direction: "left" },
        },
    },
    {
        gridTemplateAreas: `"a b" "a b" "c c"`,
        gridTemplateColumns: 2,
        gridTemplateRows: 3,
        players: {
            a: { direction: "left" },
            b: { direction: "right" },
            c: { direction: "bottom" },
        },
    },
    {
        gridTemplateAreas: `"a b" "c d" "e f"`,
        gridTemplateColumns: 2,
        gridTemplateRows: 3,
        players: {
            a: { direction: "left" },
            b: { direction: "right" },
            c: { direction: "left" },
            d: { direction: "right" },
            e: { direction: "left" },
            f: { direction: "right" },
        },
        maxRotations: 2,
    },
    {
        gridTemplateAreas: `"a b" "c d" "e f" "g h"`,
        gridTemplateColumns: 2,
        gridTemplateRows: 4,
        players: {
            a: { direction: "left" },
            b: { direction: "right" },
            c: { direction: "left" },
            d: { direction: "right" },
            e: { direction: "left" },
            f: { direction: "right" },
            g: { direction: "left" },
            h: { direction: "right" },
        },
        maxRotations: 2,
    },
    {
        gridTemplateAreas: `"a b c d" "e . . f" "g . . h" "i j k l"`,
        gridTemplateColumns: 4,
        gridTemplateRows: 4,
        players: {
            a: { direction: "left" },
            b: { direction: "top" },
            c: { direction: "top" },
            d: { direction: "right" },
            e: { direction: "left" },
            f: { direction: "right" },
            g: { direction: "left" },
            h: { direction: "right" },
            i: { direction: "left" },
            j: { direction: "bottom" },
            k: { direction: "bottom" },
            l: { direction: "right" },
        },
        maxRotations: 2,
        uselessLayout: true,
    },
    {
        gridTemplateAreas: `"a  b  c  d  e  f" "g  h  i  j  k  l" "m  n  o  p  q  r" "s  t  u  v  w  x" "y  z  aa ab ac ad" "ae af ag ah ai aj"`,
        gridTemplateColumns: 6,
        gridTemplateRows: 6,
        players: {
            a: {},
            b: {},
            c: {},
            d: {},
            e: {},
            f: {},
            g: {},
            h: {},
            i: {},
            j: {},
            k: {},
            l: {},
            m: {},
            n: {},
            o: {},
            p: {},
            q: {},
            r: {},
            s: {},
            t: {},
            u: {},
            v: {},
            w: {},
            x: {},
            y: {},
            z: {},
            aa: {},
            ab: {},
            ac: {},
            ad: {},
            ae: {},
            af: {},
            ag: {},
            ah: {},
            ai: {},
            aj: {},
        },
        maxRotations: 1,
        uselessLayout: true,
    },
];

function rotateLayout90(layout) {
    const rows = layout.gridTemplateAreas
        .match(/"[^"]+"/g)
        .map((row) => replaceAll(row, '"', "").split(/\s+/));

    const rotated = rows[0].map((_, i) => rows.map((row) => row[i]).reverse());

    const newLayout = {
        ...layout,
        gridTemplateAreas: rotated.map((row) => `"${row.join(" ")}"`).join(" "),
        gridTemplateColumns: layout.gridTemplateRows,
        gridTemplateRows: layout.gridTemplateColumns,
        players: {},
    };

    const directionMap = {
        top: "right",
        right: "bottom",
        bottom: "left",
        left: "top",
    };

    for (const [id, player] of Object.entries(layout.players)) {
        newLayout.players[id] = {
            ...player,
            direction: directionMap[player.direction],
        };
    }

    return newLayout;
}

function rotateLayout(layout, rotations) {
    let current = layout;
    for (let i = 0; i < rotations % (layout.maxRotations || 4); i++) {
        current = rotateLayout90(current);
    }
    return current;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
function replaceAll(str, search, replacement) {
    return str.split(search).join(replacement);
}

function toggleSettings() {
    const settingsContainerEl = document.querySelector(".settings-container");
    if (settingsContainerEl.classList.contains("hidden")) {
        settingsContainerEl.classList.remove("hidden");
    } else {
        settingsContainerEl.classList.add("hidden");
        resetCurrentSetting();
    }
}

function exitSettings() {
    const settingsContainerEl = document.querySelector(".settings-container");
    settingsContainerEl.classList.add("hidden");
    resetCurrentSetting();
}

function enterSettings() {
    const settingsContainerEl = document.querySelector(".settings-container");
    settingsContainerEl.classList.remove("hidden");
}

function toggleHidden(el) {
    if (el.classList.contains("hidden")) {
        el.classList.remove("hidden");
    } else {
        el.classList.add("hidden");
    }
}

function show(el) {
    el.classList.remove("hidden");
}
function hide(el) {
    el.classList.add("hidden");
}

function incrementLife(id, amount = 1) {
    const playerEl = document.getElementById(`player-${id}`);
    const lifeTotalDisplay = playerEl.querySelector(".life-total");
    playerData[id].lifeTotal += amount;
    lifeTotalDisplay.innerHTML = playerData[id].lifeTotal;
}

function paintPlayer(id, player, mini = false, gridTemplateAreas = true) {
    const playerEl = document.createElement("div");
    playerEl.classList.add("player");
    if (gridTemplateAreas) {
        playerEl.style.gridArea = id;
    }

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
            contentEl.innerHTML += `<p class="symbol rotate-${playerDirection}">-</p>`;
        } else {
            contentEl.innerHTML += `<p class="symbol rotate-${playerDirection}">+</p>`;
        }

        const startingLife = player.startingLife || 40;
        contentEl.innerHTML += `<p class="life-total rotate-${playerDirection}">${startingLife}</p>`;
        // contentEl.innerHTML += `<div class="spacer"></div>`;

        if (playerDirection == "bottom" || playerDirection == "left") {
            contentEl.innerHTML += `<p class="symbol rotate-${playerDirection}">+</p>`;
        } else {
            contentEl.innerHTML += `<p class="symbol rotate-${playerDirection}">-</p>`;
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
        } else {
            contentEl.classList.add("flex-row");
        }

        contentEl.innerHTML += `<div class="${loseLifeClass} clickable" onclick="incrementLife('${id}', -1)"></div>
        <div class="${gainLifeClass} clickable" onclick="incrementLife('${id}', 1)"></div>`;
    }
    return playerEl;
}

function restartGame() {
    let layout = layouts[layoutIndex];
    const playerContainerEl = document.querySelector("#player-container");
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

function init() {
    let layout = layouts[layoutIndex];
    const playerContainerEl = document.querySelector("#player-container");
    playerContainerEl.style.gridTemplateColumns = `repeat(${layout.gridTemplateColumns}, 1fr)`;
    playerContainerEl.style.gridTemplateRows = `repeat(${layout.gridTemplateRows}, 1fr)`;
    playerContainerEl.style.gridTemplateAreas = layout.gridTemplateAreas;

    playerContainerEl.innerHTML = "";
    const playerIds = Object.keys(layout.players);
    for (let i = 0; i < playerIds.length; i++) {
        const id = playerIds[i];
        if (!(id in playerData)) {
            playerData[id] = {};
        }
        if (!playerData[id].lifeTotal && playerData[id].lifeTotal !== 0) {
            playerData[id].lifeTotal = layout.startingLife || 40;
        }
        const child = paintPlayer(id, layout.players[id]);
        playerContainerEl.appendChild(child);
    }
}

function paintSetting(setting, playerId, settingIndex) {
    const settingEl = document.createElement("div");
    settingEl.classList.add("player");
    if (setting.label) {
        settingEl.id = `setting-${setting.label}`;
    }
    settingEl.style.gridArea = playerId;

    const contentEl = document.createElement("div");
    contentEl.classList.add("content");
    settingEl.appendChild(contentEl);

    const isSplit = setting.split;

    if (isSplit) {
        const symbolLeft = setting.leftLabelFunction
            ? setting.leftLabelFunction()
            : "<";
        contentEl.innerHTML += `<p class="symbol rotate-bottom">${symbolLeft}</p>`;
        settingEl.classList.add("dark-right");
    }

    if (setting.render) {
        contentEl.appendChild(setting.render);
    }
    const label =
        (setting.toggle
            ? eval(setting.toggle)
                ? "disable "
                : "enable "
            : "") +
        (setting.labelFunction ? setting.labelFunction() : setting.label);
    contentEl.innerHTML += `<p class="life-total small word-wrap rotate-bottom">${label}</p>`;

    if (isSplit) {
        const symbolRight = setting.rightLabelFunction
            ? setting.rightLabelFunction()
            : ">";
        contentEl.innerHTML += `<p class="symbol rotate-bottom">${symbolRight}</p>`;
        contentEl.innerHTML += `<div class="left clickable" onclick="${setting.onLeft}"></div>
        <div class="right clickable" onclick="${setting.onRight}"></div>`;
    } else {
        let on_click = "";
        if (setting.toggle) {
            on_click += `${setting.toggle} = !${setting.toggle};`;
        }
        if (setting.onclick) {
            on_click += setting.onclick;
        }
        if (setting.children) {
            on_click += `currentPage = 0;totalPages = 0;currentSetting.push(${settingIndex});`;
        }
        if (on_click) {
            if (!setting.norepaint) {
                on_click += `paintSettings();`;
            }
            contentEl.innerHTML += `<div class="full clickable" onclick="${on_click}"></div>`;
        }
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

function paintSettings() {
    const settingsContainerEl = document.querySelector(".settings-container");
    settingsContainerEl.style.gridTemplateColumns = `repeat(${settingsLayout.gridTemplateColumns}, 1fr)`;
    settingsContainerEl.style.gridTemplateRows = `repeat(${settingsLayout.gridTemplateRows}, 1fr)`;
    settingsContainerEl.style.gridTemplateAreas =
        settingsLayout.gridTemplateAreas;
    settingsContainerEl.innerHTML = "";

    const subSetting = getAtPosition(settings, currentSetting);
    let subSettingChildren = subSetting.children;
    if (subSetting.childrenFunction) {
        subSettingChildren = subSetting.childrenFunction();
    }

    const playerIds = Object.keys(settingsLayout.players);
    const availableSpace = playerIds.length;
    if (subSettingChildren.length < availableSpace) {
        for (let i = 0; i < subSettingChildren.length; i++) {
            const id = playerIds[i];
            const setting = subSettingChildren[i];
            const child = paintSetting(setting, id, i);
            settingsContainerEl.appendChild(child);
        }
        i = availableSpace - 1;
        const id = playerIds[i];
        const child = paintSetting(backSetting, id, i);
        settingsContainerEl.appendChild(child);
    } else {
        totalPages =
            Math.ceil(subSettingChildren.length / (availableSpace - 1)) || 0;
        currentPage = clamp(currentPage, 0, totalPages) || 0;

        offset = currentPage * (availableSpace - 1);
        for (
            let i = 0;
            i < availableSpace - 1 && i + offset < subSettingChildren.length;
            i++
        ) {
            const id = playerIds[i];
            const setting = subSettingChildren[i + offset];
            const child = paintSetting(setting, id, i + offset);
            settingsContainerEl.appendChild(child);
        }

        i = availableSpace - 1;
        const id = playerIds[i];
        const child = paintSetting(pageSetting, id, i);
        settingsContainerEl.appendChild(child);
    }
}

function backSettings() {
    if (currentSetting.length == 0) {
        exitSettings();
    } else {
        currentSetting.pop();
        paintSettings();
    }
}

function resetCurrentSetting() {
    currentSetting = [];
    currentPage = 0;
    totalPages = 0;
    paintSettings();
}

function paintMiniLayout(layout) {
    const playerContainerEl = document.createElement("div");
    playerContainerEl.classList.add("grid", "player-container", "mini");
    playerContainerEl.style.gridTemplateColumns = `repeat(${layout.gridTemplateColumns}, 1fr)`;
    playerContainerEl.style.gridTemplateRows = `repeat(${layout.gridTemplateRows}, 1fr)`;
    playerContainerEl.style.gridTemplateAreas = layout.gridTemplateAreas;
    // playerContainerEl.style.background = `var(--color-background)`;

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

function generateRotateLayouts(currentLayout) {
    let children = [];
    const maxRotations = currentLayout.maxRotations || 4;
    for (let i = 1; i <= maxRotations - 1; i++) {
        let currentRotation = i % maxRotations;
        currentLayout = rotateLayout(currentLayout, 1);
        children.push(currentLayout);
    }
    return children;
}

let layouts = [];
for (let i = 0; i < original_layouts.length; i++) {
    const layout = original_layouts[i];
    layouts.push(layout);
    layouts.push(...generateRotateLayouts(layout));
}

let layoutSettings = new Map([
    [4, { label: "4 players", children: [] }],
    [2, { label: "1-2 players", children: [] }],
    [3, { label: "3 players", children: [] }],
    [5, { label: "5 players (soon)", children: [] }],
    [6, { label: "6 players", children: [] }],
    [8, { label: "8 players", children: [] }],
    [0, { label: "useless/funny layouts", children: [] }],
]);
for (let i = 0; i < layouts.length; i++) {
    const layout = layouts[i];
    const setting = {
        render: paintMiniLayout(layout),
        label: "",
        onclick: `layoutIndex = ${i};init();exitSettings();`,
    };
    const players = Object.keys(layout.players).length;
    if (layout.uselessLayout) {
        layoutSettings.get(0).children.push(setting);
    } else if (players === 1) {
        layoutSettings.get(2).children.push(setting);
    } else {
        layoutSettings.get(players).children.push(setting);
    }
}

let currentSetting = [];
let currentPage = 0;
let totalPages = 0;

function pageSettingLabel() {
    return `page ${currentPage + 1}/${totalPages}`;
}
function pageLeftLabel() {
    return currentPage <= 0 ? "back" : "<";
}
function pageRightLabel() {
    return currentPage + 1 >= totalPages ? "back" : ">";
}
function pageOnLeft() {
    if (currentPage <= 0) {
        backSettings();
        currentPage = 0;
        totalPages = 0;
    } else {
        currentPage -= 1;
    }
    paintSettings();
}
function pageOnRight() {
    if (currentPage + 1 >= totalPages) {
        backSettings();
        currentPage = 0;
        totalPages = 0;
    } else {
        currentPage += 1;
    }
    paintSettings();
}
function backSettingLabel() {
    return currentSetting.length == 0 ? "exit settings" : "back";
}

const pageSetting = {
    label: "page",
    labelFunction: pageSettingLabel,
    split: true,
    leftLabelFunction: pageLeftLabel,
    rightLabelFunction: pageRightLabel,
    onLeft: "pageOnLeft();",
    onRight: "pageOnRight();",
};
const backSetting = {
    label: "back",
    labelFunction: backSettingLabel,
    onclick: "backSettings();",
};

const settings = {
    children: [
        { label: "change layout", children: [...layoutSettings.values()] },
        {
            label: "restart game",
            children: [
                {
                    label: "confirm",
                    onclick: "restartGame();exitSettings();",
                },
            ],
        },
        {
            label: "more settings",
            children: [
                {
                    label: "debug",
                    children: [
                        {
                            label: "toggle debug",
                            onclick: `toggleHidden(document.querySelector('.error-log-container'));`,
                        },
                        {
                            label: "clear log",
                            onclick: `document.querySelector('#error-log').innerHTML = 'log cleared';`,
                        },
                        {
                            label: "log current build",
                            onclick: `testCurrentBuild();`,
                        },
                        {
                            label: "source",
                            onclick: `writeLog(\`source = \$\{errorSource\}\`);`,
                            toggle: `errorSource`,
                        },
                        {
                            label: "timestamp",
                            onclick: `writeLog(\`timestamp = \$\{errorTimestamp\}\`);`,
                            toggle: `errorTimestamp`,
                        },
                        {
                            label: "test error",
                            onclick: `testError();`,
                        },
                        {
                            label: "test write",
                            onclick: `writeLog('test');`,
                        },
                    ],
                },
            ],
        },
    ],
};

const settingsLayout = layouts[0];
let layoutIndex = 0;
init();
paintSettings();
