const night_verb = ['sleep', 'dream', 'wander', 'think', 'cry', 'feel', 'stare'];

const night_adv = [
    "calmly","comfortably","cozily","deeply","gently","mindfully",
    "peacefully","quietly","relaxedly","slowly","softly","thoughtfully",
    "warmly","silently","patiently","carefully","comfortingly",
    "funnily","angrily","frustratedly","anxiously","sadly","fearfully",
    "bitterly","harshly"
];

const day_verb = ['eat', 'swim', 'play', 'paint', 'sing', 'yap', 'stare'];

const day_adverb = [
    "actively","boldly","carefully","cheerfully","confidently","creatively",
    "curiously","energetically","freely","joyfully","patiently","playfully",
    "quickly","spontaneously","thoughtfully","unproductively","aimlessly",
    "restlessly","frantically","impulsively","hesitantly","carelessly","indecisively"
];

// ---- CLOCK SETUP ----
const center = { x: 100, y: 100 };
const hand = document.getElementById("hand");
const display = document.getElementById("display");
const result = document.getElementById("result");
const timeInput = document.getElementById("timeInput");

const numbers = document.getElementById("numbers");

for (let h = 0; h < 24; h++) {
    const angle = (h / 24) * Math.PI * 2 - Math.PI / 2;
    const r = 60;

    const x = center.x + Math.cos(angle) * r;
    const y = center.y + Math.sin(angle) * r;

    const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
    t.setAttribute("x", x);
    t.setAttribute("y", y);
    t.textContent = h;
    t.setAttribute("class", "hour-number");
    t.setAttribute("text-anchor", "middle");
    t.setAttribute("dominant-baseline", "middle");
    numbers.appendChild(t);
}

let currentHour = 0;
let dragging = false;

function updateFromEvent(e) {
    const rect = hand.ownerSVGElement.getBoundingClientRect();

    const x = e.clientX - rect.left - center.x;
    const y = e.clientY - rect.top - center.y;

    let angle = Math.atan2(y, x);

    let hour = Math.round(((angle + Math.PI / 2) / (Math.PI * 2)) * 24);
    if (hour < 0) hour += 24;

    currentHour = hour % 24;

    updateClock();
}

function updateClock() {
    const a = (currentHour / 24) * Math.PI * 2 - Math.PI / 2;

    const x2 = center.x + Math.cos(a) * 70;
    const y2 = center.y + Math.sin(a) * 70;

    hand.setAttribute("x2", x2);
    hand.setAttribute("y2", y2);

    const timeStr = String(currentHour).padStart(2, "0") + ":00";

    display.textContent = "Selected: " + timeStr;
    timeInput.value = timeStr;
}

hand.addEventListener("mousedown", () => dragging = true);
window.addEventListener("mouseup", () => dragging = false);

window.addEventListener("mousemove", (e) => {
    if (dragging) updateFromEvent(e);
});

window.addEventListener("touchmove", (e) => {
    if (e.touches.length) updateFromEvent(e.touches[0]);
});


function recommend(hour) {
    if (hour > 22 || hour < 9) {
        return randomChoice(night_verb) + " " + randomChoice(night_adv);
    } else {
        return randomChoice(day_verb) + " " + randomChoice(day_adverb);
    }
}

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

document.getElementById("generateBtn").addEventListener("click", () => {
    const hour = currentHour;
    result.textContent = recommend(hour);
});

updateClock();