// === UTILITY FUNCTIONS ===

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// === ANIMATION STATE ===
let animationState = {
    inProgress: false,
    canSkip: false,
    currentResolve: null,
    mode: 'autoplay' // 'autoplay' or 'step'
};

// === ANIMATION STEP BUILDER ===
// Each step shows: comment above current expression, then writes terms one by one
class AnimationStep {
    constructor(comment, terms) {
        this.comment = comment; // Text to show above
        this.terms = terms; // Array of {highlightIndices: [], text: ""} objects
    }
}

// Helper to create a term
class AnimationTerm {
    constructor(highlightIndices, text) {
        this.highlightIndices = highlightIndices; // Which terms to highlight in original
        this.text = text; // Text to write
    }
}

// === EXERCISE GENERATORS WITH ANIMATION STEPS ===

// Helper to parse expression into highlightable terms
const parseExpression = (expr) => {
    const parts = [];
    let current = '';

    for (let i = 0; i < expr.length; i++) {
        const char = expr[i];
        if (char === '+' || char === '-' || char === '·' || char === '/' || char === '(' || char === ')' || char === '=' || char === '²') {
            if (current) {
                parts.push(current);
                current = '';
            }
            parts.push(char);
        } else if (char !== ' ') {
            current += char;
        }
    }
    if (current) parts.push(current);
    return parts;
};

// 1. HODNOTY VÝRAZŮ
const generateEx1 = (count) => {
    const items = [];
    for (let i = 1; i <= count; i++) {
        const type = i % 8; // 8 různých typů příkladů
        let q, params, animSteps, res;

        if (type === 0) {
            // Jednoduchý: a(x + b)
            const a = getRandomInt(2, 5);
            const b = getRandomInt(2, 5);
            const x = getRandomInt(-5, 5);

            q = `${a}(x + ${b})`;
            params = `x = ${x}`;

            animSteps = [
                new AnimationStep(
                    `Dosadíme za x hodnotu ${x}`,
                    [new AnimationTerm([], `${a}(${x} + ${b})`)]
                ),
                new AnimationStep(
                    `Vynásobíme`,
                    [new AnimationTerm([], `<span class="color-blue">${a}·${x}</span> + <span class="color-green">${a}·${b}</span>`)]
                ),
                new AnimationStep(
                    `Vypočítáme součiny`,
                    [new AnimationTerm([], `<span class="color-blue">${a * x}</span> + <span class="color-green">${a * b}</span>`)]
                ),
                new AnimationStep(
                    `Sečteme`,
                    [new AnimationTerm([], `${a * x + a * b}`)]
                )
            ];
            res = `${a * x + a * b}`;

        } else if (type === 1) {
            // Typ: ax(x + b) - cy + d - y
            const a = getRandomInt(2, 5);
            const b = getRandomInt(1, 4);
            const c = getRandomInt(2, 7);
            const d = getRandomInt(3, 8);
            const x = getRandomInt(1, 4);
            const y = getRandomInt(1, 4);

            q = `${a}x(x + ${b}) - ${c}y + ${d} - y`;
            params = `x = ${x}, y = ${y}`;

            animSteps = [
                new AnimationStep(
                    `Dosadíme x = ${x}, y = ${y}`,
                    [new AnimationTerm([], `${a}·${x}(${x} + ${b}) - ${c}·${y} + ${d} - ${y}`)]
                ),
                new AnimationStep(
                    `Vypočítáme závorku`,
                    [new AnimationTerm([], `${a}·${x}·<span class="color-blue">${x + b}</span> - ${c}·${y} + ${d} - ${y}`)]
                ),
                new AnimationStep(
                    `Vynásobíme`,
                    [new AnimationTerm([], `<span class="color-orange">${a * x * (x + b)}</span> - ${c * y} + ${d} - ${y}`)]
                ),
                new AnimationStep(
                    `Sečteme členy s y`,
                    [new AnimationTerm([], `${a * x * (x + b)} - <span class="color-green">${c * y + y}</span> + ${d}`)]
                ),
                new AnimationStep(
                    `Vypočítáme`,
                    [new AnimationTerm([], `${a * x * (x + b) - c * y - y + d}`)]
                )
            ];
            res = `${a * x * (x + b) - c * y - y + d}`;

        } else if (type === 2) {
            // Typ: (x - a - y) / (x·y + b)
            const a = getRandomInt(10, 20);
            const b = getRandomInt(20, 30);
            const x = getRandomInt(5, 9);
            const y = getRandomInt(2, 5);

            q = `(x - ${a} - y) / (x·y + ${b})`;
            params = `x = ${x}, y = ${y}`;

            const numerator = x - a - y;
            const denominator = x * y + b;

            animSteps = [
                new AnimationStep(
                    `Dosadíme x = ${x}, y = ${y}`,
                    [new AnimationTerm([], `(${x} - ${a} - ${y}) / (${x}·${y} + ${b})`)]
                ),
                new AnimationStep(
                    `Vypočítáme čitatel`,
                    [new AnimationTerm([], `<span class="color-blue">${numerator}</span> / (${x}·${y} + ${b})`)]
                ),
                new AnimationStep(
                    `Vypočítáme jmenovatel`,
                    [new AnimationTerm([], `${numerator} / <span class="color-green">${denominator}</span>`)]
                ),
                new AnimationStep(
                    `Vydělíme`,
                    [new AnimationTerm([], `${numerator / denominator}`)]
                )
            ];
            res = `${numerator / denominator}`;

        } else if (type === 3) {
            // Typ: (x/a + y/b)
            const a = getRandomInt(2, 4);
            const b = getRandomInt(3, 6);
            const x = getRandomInt(4, 12);
            const y = getRandomInt(6, 15);

            q = `x/${a} + y/${b}`;
            params = `x = ${x}, y = ${y}`;

            animSteps = [
                new AnimationStep(
                    `Dosadíme x = ${x}, y = ${y}`,
                    [new AnimationTerm([], `${x}/${a} + ${y}/${b}`)]
                ),
                new AnimationStep(
                    `Vydělíme`,
                    [new AnimationTerm([], `<span class="color-blue">${x / a}</span> + <span class="color-green">${y / b}</span>`)]
                ),
                new AnimationStep(
                    `Sečteme`,
                    [new AnimationTerm([], `${x / a + y / b}`)]
                )
            ];
            res = `${x / a + y / b}`;

        } else if (type === 4) {
            // Typ: ((-x)² + y) - x³
            const x = getRandomInt(1, 4);
            const y = getRandomInt(5, 15);

            q = `((-x)² + y) - x³`;
            params = `x = ${x}, y = ${y}`;

            animSteps = [
                new AnimationStep(
                    `Dosadíme x = ${x}, y = ${y}`,
                    [new AnimationTerm([], `((-${x})² + ${y}) - ${x}³`)]
                ),
                new AnimationStep(
                    `Vypočítáme mocniny`,
                    [new AnimationTerm([], `(<span class="color-blue">${x * x}</span> + ${y}) - <span class="color-orange">${x * x * x}</span>`)]
                ),
                new AnimationStep(
                    `Vypočítáme závorku`,
                    [new AnimationTerm([], `<span class="color-green">${x * x + y}</span> - ${x * x * x}`)]
                ),
                new AnimationStep(
                    `Odečteme`,
                    [new AnimationTerm([], `${x * x + y - x * x * x}`)]
                )
            ];
            res = `${x * x + y - x * x * x}`;

        } else if (type === 5) {
            // Typ: ((x-y)² + x) - x³ + y
            const x = getRandomInt(2, 5);
            const y = getRandomInt(1, 3);

            q = `((x - y)² + x) - x³ + y`;
            params = `x = ${x}, y = ${y}`;

            const diff = x - y;

            animSteps = [
                new AnimationStep(
                    `Dosadíme x = ${x}, y = ${y}`,
                    [new AnimationTerm([], `((${x} - ${y})² + ${x}) - ${x}³ + ${y}`)]
                ),
                new AnimationStep(
                    `Vypočítáme rozdíl`,
                    [new AnimationTerm([], `(<span class="color-blue">${diff}</span>² + ${x}) - ${x}³ + ${y}`)]
                ),
                new AnimationStep(
                    `Vypočítáme mocniny`,
                    [new AnimationTerm([], `(<span class="color-orange">${diff * diff}</span> + ${x}) - <span class="color-purple">${x * x * x}</span> + ${y}`)]
                ),
                new AnimationStep(
                    `Vypočítáme závorku`,
                    [new AnimationTerm([], `<span class="color-green">${diff * diff + x}</span> - ${x * x * x} + ${y}`)]
                ),
                new AnimationStep(
                    `Vypočítáme výsledek`,
                    [new AnimationTerm([], `${diff * diff + x - x * x * x + y}`)]
                )
            ];
            res = `${diff * diff + x - x * x * x + y}`;

        } else if (type === 6) {
            // Typ: (a·x - b·y)²
            const a = getRandomInt(2, 4);
            const b = getRandomInt(2, 4);
            const x = getRandomInt(1, 4);
            const y = getRandomInt(1, 4);

            q = `(${a}x - ${b}y)²`;
            params = `x = ${x}, y = ${y}`;

            const term1 = a * x;
            const term2 = b * y;
            const inner = term1 - term2;

            animSteps = [
                new AnimationStep(
                    `Dosadíme x = ${x}, y = ${y}`,
                    [new AnimationTerm([], `(${a}·${x} - ${b}·${y})²`)]
                ),
                new AnimationStep(
                    `Vynásobíme členy v závorce`,
                    [new AnimationTerm([], `(<span class="color-blue">${term1}</span> - <span class="color-green">${term2}</span>)²`)]
                ),
                new AnimationStep(
                    `Odečteme`,
                    [new AnimationTerm([], `(<span class="color-orange">${inner}</span>)²`)]
                ),
                new AnimationStep(
                    `Umocníme`,
                    [new AnimationTerm([], `${inner * inner}`)]
                )
            ];
            res = `${inner * inner}`;

        } else {
            // Typ: x/y - y/x
            const x = getRandomInt(2, 6) * 2; // sudá čísla pro hezčí krácení
            let y = getRandomInt(2, 6);

            // Zajistíme aby x a y nebyly stejné (aby výsledek nebyl 0)
            while (x === y) y++;

            q = `x/y - y/x`;
            params = `x = ${x}, y = ${y}`;

            const resVal = (x / y) - (y / x);
            // Zaokrouhlení na 2 desetinná místa pro zobrazení, pokud není celé
            const resDisplay = Number.isInteger(resVal) ? resVal : resVal.toFixed(2);

            animSteps = [
                new AnimationStep(
                    `Dosadíme x = ${x}, y = ${y}`,
                    [new AnimationTerm([], `${x}/${y} - ${y}/${x}`)]
                ),
                new AnimationStep(
                    `Vydělíme (nebo převedeme na společného jmenovatele)`,
                    [new AnimationTerm([], `<span class="color-blue">${Number.isInteger(x / y) ? x / y : (x / y).toFixed(2)}</span> - <span class="color-green">${Number.isInteger(y / x) ? y / x : (y / x).toFixed(2)}</span>`)]
                ),
                new AnimationStep(
                    `Odečteme`,
                    [new AnimationTerm([], `${resDisplay}`)]
                )
            ];
            res = `${resDisplay}`;
        }

        items.push({ id: i, q, params, animSteps, res });
    }
    return items;
};

// 2. PODMÍNKY
const generateEx2 = (count) => {
    const items = [];
    for (let i = 1; i <= count; i++) {
        const type = i % 7; // 7 různých typů příkladů
        let q, params, animSteps, res;

        if (type === 0) {
            // Jednoduchý: k / (ax - b)
            const k = getRandomInt(1, 9);
            const a = getRandomInt(2, 5);
            const b = a * getRandomInt(1, 4);

            q = `${k} / (${a}x - ${b})`;
            params = "Urči podmínky";

            animSteps = [
                new AnimationStep(
                    `Jmenovatel ≠ 0`,
                    [new AnimationTerm([], `<span class="color-blue">${a}x - ${b}</span> ≠ 0`)]
                ),
                new AnimationStep(
                    `Převedeme číslo`,
                    [new AnimationTerm([], `${a}x ≠ ${b}`)]
                ),
                new AnimationStep(
                    `Vydělíme ${a}`,
                    [new AnimationTerm([], `x ≠ ${b / a}`)]
                )
            ];
            res = `x ≠ ${b / a}`;

        } else if (type === 1) {
            // Typ: (a + x) / (x - b)
            const a = getRandomInt(2, 9);
            const b = getRandomInt(3, 12);

            q = `(${a} + x) / (x - ${b})`;
            params = "Urči podmínky";

            animSteps = [
                new AnimationStep(
                    `Jmenovatel ≠ 0`,
                    [new AnimationTerm([], `<span class="color-blue">x - ${b}</span> ≠ 0`)]
                ),
                new AnimationStep(
                    `Převedeme`,
                    [new AnimationTerm([], `x ≠ ${b}`)]
                )
            ];
            res = `x ≠ ${b}`;

        } else if (type === 2) {
            // Typ: (a - y) / (by + c)
            const a = getRandomInt(10, 20);
            const b = getRandomInt(2, 5);
            const c = getRandomInt(5, 15);

            q = `(${a} - y) / (${b}y + ${c})`;
            params = "Urči podmínky";

            animSteps = [
                new AnimationStep(
                    `Jmenovatel ≠ 0`,
                    [new AnimationTerm([], `<span class="color-blue">${b}y + ${c}</span> ≠ 0`)]
                ),
                new AnimationStep(
                    `Převedeme číslo`,
                    [new AnimationTerm([], `${b}y ≠ -${c}`)]
                ),
                new AnimationStep(
                    `Vydělíme ${b}`,
                    [new AnimationTerm([], `y ≠ ${-c / b}`)]
                )
            ];
            res = `y ≠ ${-c / b}`;

        } else if (type === 3) {
            // Typ: (x - a)² / b²
            const a = getRandomInt(2, 8);
            const b = getRandomInt(3, 9);

            q = `(x - ${a})² / ${b}²`;
            params = "Urči podmínky";

            animSteps = [
                new AnimationStep(
                    `Jmenovatel ≠ 0`,
                    [new AnimationTerm([], `<span class="color-blue">${b}²</span> ≠ 0`)]
                ),
                new AnimationStep(
                    `${b}² = ${b * b} ≠ 0`,
                    [new AnimationTerm([], `Podmínka je splněna vždy`)]
                )
            ];
            res = `x ∈ ℝ`;

        } else if (type === 4) {
            // Typ: ((−x)² + a) / (x³ − b)
            const a = getRandomInt(5, 20);
            const b = getRandomInt(8, 27);

            q = `((−x)² + ${a}) / (x³ − ${b})`;
            params = "Urči podmínky";

            // Najdeme třetí odmocninu z b (pokud je to celé číslo)
            const cubeRoot = Math.round(Math.cbrt(b));
            const isCube = cubeRoot * cubeRoot * cubeRoot === b;

            animSteps = [
                new AnimationStep(
                    `Jmenovatel ≠ 0`,
                    [new AnimationTerm([], `<span class="color-blue">x³ − ${b}</span> ≠ 0`)]
                ),
                new AnimationStep(
                    `Převedeme`,
                    [new AnimationTerm([], `x³ ≠ ${b}`)]
                ),
                new AnimationStep(
                    `Odmocníme`,
                    [new AnimationTerm([], isCube ? `x ≠ ${cubeRoot}` : `x ≠ ³√${b}`)]
                )
            ];
            res = isCube ? `x ≠ ${cubeRoot}` : `x ≠ ³√${b}`;

        } else if (type === 5) {
            // Typ: 1 / (x · (x - a))
            const a = getRandomInt(2, 8);

            q = `1 / (x · (x - ${a}))`;
            params = "Urči podmínky";

            animSteps = [
                new AnimationStep(
                    `Jmenovatel ≠ 0 (součin)`,
                    [new AnimationTerm([], `<span class="color-blue">x · (x - ${a})</span> ≠ 0`)]
                ),
                new AnimationStep(
                    `První činitel ≠ 0`,
                    [new AnimationTerm([], `x ≠ 0`)]
                ),
                new AnimationStep(
                    `Druhý činitel ≠ 0`,
                    [new AnimationTerm([], `x - ${a} ≠ 0`)]
                ),
                new AnimationStep(
                    `Výsledek`,
                    [new AnimationTerm([], `x ≠ 0; x ≠ ${a}`)]
                )
            ];
            res = `x ≠ 0; x ≠ ${a}`;

        } else {
            // Typ: (x + a) / (x² - b²)
            const a = getRandomInt(2, 9);
            const b = getRandomInt(2, 9);
            const bSq = b * b;

            q = `(${a} + x) / (x² - ${bSq})`;
            params = "Urči podmínky";

            animSteps = [
                new AnimationStep(
                    `Jmenovatel ≠ 0`,
                    [new AnimationTerm([], `<span class="color-blue">x² - ${bSq}</span> ≠ 0`)]
                ),
                new AnimationStep(
                    `Rozložíme podle vzorce`,
                    [new AnimationTerm([], `(x - ${b})(x + ${b}) ≠ 0`)]
                ),
                new AnimationStep(
                    `Jednotlivé závorky ≠ 0`,
                    [new AnimationTerm([], `x ≠ ${b}; x ≠ -${b}`)]
                )
            ];
            res = `x ≠ ±${b}`;
        }

        items.push({ id: i, q, params, animSteps, res });
    }
    return items;
};

// 3. MNOHOČLENY
const generateEx3 = (count) => {
    const items = [];
    for (let i = 1; i <= count; i++) {
        const type = i % 8; // 8 různých typů příkladů
        let q, params, animSteps, res;

        if (type === 0) {
            // Typ: (ax + b) + (cx + d)
            const a1 = getRandomInt(1, 5);
            const b1 = getRandomInt(1, 5);
            const a2 = getRandomInt(1, 5);
            const b2 = getRandomInt(1, 5);

            q = `(${a1}x + ${b1}) + (${a2}x + ${b2})`;
            params = "";

            animSteps = [
                new AnimationStep(
                    `Odstraníme závorky`,
                    [new AnimationTerm([], `${a1}x + ${b1} + ${a2}x + ${b2}`)]
                ),
                new AnimationStep(
                    `Sečteme členy s x`,
                    [new AnimationTerm([], `<span class="color-blue">${a1}x + ${a2}x</span> + ${b1} + ${b2}`)]
                ),
                new AnimationStep(
                    `Výsledek sčítání členů s x`,
                    [new AnimationTerm([], `<span class="color-blue">${a1 + a2}x</span> + ${b1} + ${b2}`)]
                ),
                new AnimationStep(
                    `Sečteme čísla`,
                    [new AnimationTerm([], `${a1 + a2}x + <span class="color-green">${b1} + ${b2}</span>`)]
                ),
                new AnimationStep(
                    `Výsledek sčítání čísel`,
                    [new AnimationTerm([], `${a1 + a2}x + <span class="color-green">${b1 + b2}</span>`)]
                )
            ];
            res = `${a1 + a2}x + ${b1 + b2}`;

        } else if (type === 1) {
            // Typ: (ax + b) - (cx + d)
            const a1 = getRandomInt(3, 7);
            const b1 = getRandomInt(3, 7);
            const a2 = getRandomInt(1, a1);
            const b2 = getRandomInt(1, b1);

            q = `(${a1}x + ${b1}) - (${a2}x + ${b2})`;
            params = "";

            animSteps = [
                new AnimationStep(
                    `Odstraníme závorky (pozor na mínus!)`,
                    [new AnimationTerm([], `${a1}x + ${b1} - ${a2}x - ${b2}`)]
                ),
                new AnimationStep(
                    `Odečteme členy s x`,
                    [new AnimationTerm([], `<span class="color-blue">${a1}x - ${a2}x</span> + ${b1} - ${b2}`)]
                ),
                new AnimationStep(
                    `Výsledek odčítání členů s x`,
                    [new AnimationTerm([], `<span class="color-blue">${a1 - a2}x</span> + ${b1} - ${b2}`)]
                ),
                new AnimationStep(
                    `Odečteme čísla`,
                    [new AnimationTerm([], `${a1 - a2}x + <span class="color-green">${b1} - ${b2}</span>`)]
                ),
                new AnimationStep(
                    `Výsledek odčítání čísel`,
                    [new AnimationTerm([], `${a1 - a2}x + <span class="color-green">${b1 - b2}</span>`)]
                )
            ];
            res = `${a1 - a2}x + ${b1 - b2}`;

        } else if (type === 2) {
            // Typ: ax - by + cx² - dy² - (-ex + fy²)
            const a = getRandomInt(2, 5);
            const b = getRandomInt(2, 5);
            const c = getRandomInt(2, 5);
            const d = getRandomInt(2, 5);
            const e = getRandomInt(2, 5);
            const f = getRandomInt(2, 5);

            q = `${a}x - ${b}y + ${c}x² - ${d}y² - (-${e}x + ${f}y²)`;
            params = "";

            animSteps = [
                new AnimationStep(
                    `Odstraníme závorky`,
                    [new AnimationTerm([], `${a}x - ${b}y + ${c}x² - ${d}y² + ${e}x - ${f}y²`)]
                ),
                new AnimationStep(
                    `Sečteme členy s x`,
                    [new AnimationTerm([], `<span class="color-blue">${a}x + ${e}x</span> - ${b}y + ${c}x² - ${d}y² - ${f}y²`)]
                ),
                new AnimationStep(
                    `Výsledek pro x`,
                    [new AnimationTerm([], `<span class="color-blue">${a + e}x</span> - ${b}y + ${c}x² - ${d}y² - ${f}y²`)]
                ),
                new AnimationStep(
                    `Sečteme členy s y²`,
                    [new AnimationTerm([], `${a + e}x - ${b}y + ${c}x² <span class="color-orange">- ${d}y² - ${f}y²</span>`)]
                ),
                new AnimationStep(
                    `Výsledek pro y²`,
                    [new AnimationTerm([], `${a + e}x - ${b}y + ${c}x² - <span class="color-orange">${d + f}y²</span>`)]
                )
            ];
            res = `${a + e}x - ${b}y + ${c}x² - ${d + f}y²`;

        } else if (type === 3) {
            // Typ: (ax - b²) - [cx² - d - (e + fx)]
            const a = getRandomInt(2, 5);
            const b = getRandomInt(2, 4);
            const c = getRandomInt(2, 5);
            const d = getRandomInt(3, 7);
            const e = getRandomInt(2, 5);
            const f = getRandomInt(2, 5);

            q = `(${a}x - ${b}²) - [${c}x² - ${d} - (${e} + ${f}x)]`;
            params = "";

            animSteps = [
                new AnimationStep(
                    `Odstraníme vnitřní závorky`,
                    [new AnimationTerm([], `(${a}x - ${b * b}) - [${c}x² - ${d} - ${e} - ${f}x]`)]
                ),
                new AnimationStep(
                    `Zjednodušíme v hranaté závorce`,
                    [new AnimationTerm([], `(${a}x - ${b * b}) - [${c}x² - ${f}x - ${d + e}]`)]
                ),
                new AnimationStep(
                    `Odstraníme závorky`,
                    [new AnimationTerm([], `${a}x - ${b * b} - ${c}x² + ${f}x + ${d + e}`)]
                ),
                new AnimationStep(
                    `Sečteme členy s x`,
                    [new AnimationTerm([], `<span class="color-blue">${a}x + ${f}x</span> - ${c}x² - ${b * b} + ${d + e}`)]
                ),
                new AnimationStep(
                    `Výsledek`,
                    [new AnimationTerm([], `-${c}x² + <span class="color-blue">${a + f}x</span> + ${d + e - b * b}`)]
                )
            ];
            res = `-${c}x² + ${a + f}x + ${d + e - b * b}`;

        } else if (type === 4) {
            // Typ: -[-[-(ax - by + cab²) + dx - y] - c]
            const a = getRandomInt(2, 5);
            const b = getRandomInt(2, 5);
            const c = getRandomInt(2, 5);
            const d = getRandomInt(2, 5);

            q = `-[-[-(${a}x - ${b}y + ${c}) + ${d}x - y] - ${c}]`;
            params = "";

            animSteps = [
                new AnimationStep(
                    `Odstraníme nejv nitřnější závorky`,
                    [new AnimationTerm([], `-[-[${-a}x + ${b}y - ${c} + ${d}x - y] - ${c}]`)]
                ),
                new AnimationStep(
                    `Sečteme uvnitř`,
                    [new AnimationTerm([], `-[-[${d - a}x + ${b - 1}y - ${c}] - ${c}]`)]
                ),
                new AnimationStep(
                    `Odstraníme další závorky`,
                    [new AnimationTerm([], `-[${-(d - a)}x - ${b - 1}y + ${c} - ${c}]`)]
                ),
                new AnimationStep(
                    `Zjednodušíme`,
                    [new AnimationTerm([], `-[${a - d}x - ${b - 1}y]`)]
                ),
                new AnimationStep(
                    `Odstraníme poslední závorky`,
                    [new AnimationTerm([], `${d - a}x + ${b - 1}y`)]
                )
            ];
            res = `${d - a}x + ${b - 1}y`;

        } else if (type === 5) {
            // Typ: (a/b·x + c/d·x³)·(e/f·x² + g/h)
            q = `(3/4·x + 1/2·x³)·(1/6·x² + 2/3)`;
            params = "";

            animSteps = [
                new AnimationStep(
                    `Vynásobíme každý člen s každým`,
                    [new AnimationTerm([], `<span class="color-blue">3/4·x · 1/6·x²</span> + <span class="color-green">3/4·x · 2/3</span> + <span class="color-orange">1/2·x³ · 1/6·x²</span> + <span class="color-purple">1/2·x³ · 2/3</span>`)]
                ),
                new AnimationStep(
                    `Vypočítáme součiny`,
                    [new AnimationTerm([], `<span class="color-blue">1/8·x³</span> + <span class="color-green">1/2·x</span> + <span class="color-orange">1/12·x⁵</span> + <span class="color-purple">1/3·x³</span>`)]
                ),
                new AnimationStep(
                    `Sečteme členy s x³`,
                    [new AnimationTerm([], `1/12·x⁵ + <span class="color-cyan">(1/8·x³ + 1/3·x³)</span> + 1/2·x`)]
                ),
                new AnimationStep(
                    `Výsledek`,
                    [new AnimationTerm([], `1/12·x⁵ + <span class="color-cyan">11/24·x³</span> + 1/2·x`)]
                )
            ];
            res = `1/12·x⁵ + 11/24·x³ + 1/2·x`;

        } else if (type === 6) {
            // Typ: (ax² + bx + c) - (dx² + ex + f)
            const a = getRandomInt(3, 7);
            const b = getRandomInt(3, 7);
            const c = getRandomInt(3, 7);
            const d = getRandomInt(1, a);
            const e = getRandomInt(1, b);
            const f = getRandomInt(1, c);

            q = `(${a}x² + ${b}x + ${c}) - (${d}x² + ${e}x + ${f})`;
            params = "";

            animSteps = [
                new AnimationStep(
                    `Odstraníme závorky`,
                    [new AnimationTerm([], `${a}x² + ${b}x + ${c} - ${d}x² - ${e}x - ${f}`)]
                ),
                new AnimationStep(
                    `Odečteme členy s x²`,
                    [new AnimationTerm([], `<span class="color-blue">${a}x² - ${d}x²</span> + ${b}x + ${c} - ${e}x - ${f}`)]
                ),
                new AnimationStep(
                    `Výsledek pro x²`,
                    [new AnimationTerm([], `<span class="color-blue">${a - d}x²</span> + ${b}x - ${e}x + ${c} - ${f}`)]
                ),
                new AnimationStep(
                    `Odečteme členy s x`,
                    [new AnimationTerm([], `${a - d}x² + <span class="color-green">${b}x - ${e}x</span> + ${c} - ${f}`)]
                ),
                new AnimationStep(
                    `Výsledek pro x`,
                    [new AnimationTerm([], `${a - d}x² + <span class="color-green">${b - e}x</span> + ${c} - ${f}`)]
                ),
                new AnimationStep(
                    `Odečteme konstanty`,
                    [new AnimationTerm([], `${a - d}x² + ${b - e}x + <span class="color-orange">${c} - ${f}</span>`)]
                ),
                new AnimationStep(
                    `Výsledek`,
                    [new AnimationTerm([], `${a - d}x² + ${b - e}x + <span class="color-orange">${c - f}</span>`)]
                )
            ];
            res = `${a - d}x² + ${b - e}x + ${c - f}`;

        } else {
            // Typ: (ax + b)(cx + d) - násobení závorek
            const a = getRandomInt(2, 5);
            const b = getRandomInt(2, 5);
            const c = getRandomInt(2, 5);
            const d = getRandomInt(2, 5);

            q = `(${a}x + ${b})(${c}x + ${d})`;
            params = "";

            animSteps = [
                new AnimationStep(
                    `Vynásobíme každý člen s každým`,
                    [new AnimationTerm([], `<span class="color-blue">${a}x · ${c}x</span> + <span class="color-green">${a}x · ${d}</span> + <span class="color-orange">${b} · ${c}x</span> + <span class="color-purple">${b} · ${d}</span>`)]
                ),
                new AnimationStep(
                    `Vypočítáme součiny`,
                    [new AnimationTerm([], `<span class="color-blue">${a * c}x²</span> + <span class="color-green">${a * d}x</span> + <span class="color-orange">${b * c}x</span> + <span class="color-purple">${b * d}</span>`)]
                ),
                new AnimationStep(
                    `Sečteme členy s x`,
                    [new AnimationTerm([], `${a * c}x² + <span class="color-cyan">${a * d}x + ${b * c}x</span> + ${b * d}`)]
                ),
                new AnimationStep(
                    `Výsledek`,
                    [new AnimationTerm([], `${a * c}x² + <span class="color-cyan">${a * d + b * c}x</span> + ${b * d}`)]
                )
            ];
            res = `${a * c}x² + ${a * d + b * c}x + ${b * d}`;
        }

        items.push({ id: i, q, params, animSteps, res });
    }
    return items;
};

// 4. ZJEDNODUŠOVÁNÍ (mnohem složitější!)
const generateEx4 = (count) => {
    const items = [];
    for (let i = 1; i <= count; i++) {
        const type = i % 8; // 8 různých typů příkladů
        let q, res, animSteps;

        if (type === 0) {
            // Typ: 3x - 6y + 3x² - 7y² - (-3x + 6y²)
            const a = getRandomInt(2, 5);
            const b = getRandomInt(2, 5);
            const c = getRandomInt(2, 5);
            const d = getRandomInt(2, 5);
            const e = getRandomInt(2, 5);
            const f = getRandomInt(2, 5);

            q = `${a}x - ${b}y + ${c}x² - ${d}y² - (-${e}x + ${f}y²)`;

            animSteps = [
                new AnimationStep(
                    `Odstraníme závorky`,
                    [new AnimationTerm([], `${a}x - ${b}y + ${c}x² - ${d}y² + ${e}x - ${f}y²`)]
                ),
                new AnimationStep(
                    `Sečteme členy s x`,
                    [new AnimationTerm([], `${a + e}x - ${b}y + ${c}x² - ${d}y² - ${f}y²`)]
                ),
                new AnimationStep(
                    `Sečteme členy s y²`,
                    [new AnimationTerm([], `${a + e}x - ${b}y + ${c}x² - ${d + f}y²`)]
                )
            ];
            res = `${a + e}x - ${b}y + ${c}x² - ${d + f}y²`;

        } else if (type === 1) {
            // Typ: (3x - x²)·[3x² - 6·(6 + 2x)]
            const a = getRandomInt(2, 4);
            const b = getRandomInt(2, 4);
            const c = getRandomInt(2, 4);

            q = `(${a}x - x²)·[${b}x² - ${c}·(${c} + ${a}x)]`;

            const inner = b * c * c - c * a; // bx² - c(c + ax) = bx² - c² - acx

            animSteps = [
                new AnimationStep(
                    `Vynásobíme vnitřní závorku`,
                    [new AnimationTerm([], `(${a}x - x²)·[${b}x² - ${c * c} - ${c * a}x]`)]
                ),
                new AnimationStep(
                    `Upravíme pořadí`,
                    [new AnimationTerm([], `(${a}x - x²)·(${b}x² - ${c * a}x - ${c * c})`)]
                ),
                new AnimationStep(
                    `Vynásobíme závorky`,
                    [new AnimationTerm([], `-${b}x⁴ + ${a * b + c * a}x³ - ${a * c * a - c * c}x² - ${a * c * c}x`)]
                )
            ];
            res = `-${b}x⁴ + ${a * b + c * a}x³ - ${a * c * a - c * c}x² - ${a * c * c}x`;

        } else if (type === 2) {
            // Typ: [-[-(3x - 6y + 2ab²) + 2x - y] - 2] + ab²
            const a = getRandomInt(2, 5);
            const b = getRandomInt(2, 5);
            const c = getRandomInt(2, 5);

            q = `[-[-(${a}x - ${b}y + ${c}ab²) + ${a}x - y] - ${c}] + ab²`;

            animSteps = [
                new AnimationStep(
                    `Odstraníme vnitřní závorky`,
                    [new AnimationTerm([], `[-[${-a}x + ${b}y - ${c}ab² + ${a}x - y] - ${c}] + ab²`)]
                ),
                new AnimationStep(
                    `Sečteme`,
                    [new AnimationTerm([], `[-[${b - 1}y - ${c}ab²] - ${c}] + ab²`)]
                ),
                new AnimationStep(
                    `Odstraníme závorky`,
                    [new AnimationTerm([], `-${b - 1}y + ${c}ab² - ${c} + ab²`)]
                )
            ];
            res = `-${b - 1}y + ${c + 1}ab² - ${c}`;

        } else if (type === 3) {
            // Typ: (9x²a² - 6x⁴a³b³ + 24a³x⁴)·3ax
            const a = getRandomInt(2, 4);
            const b = getRandomInt(2, 4);
            const c = getRandomInt(2, 4);

            q = `(${a * 3}x²a² - ${b * 2}x⁴a³b³ + ${c * 8}a³x⁴)·${a}ax`;

            animSteps = [
                new AnimationStep(
                    `Vynásobíme každý člen`,
                    [new AnimationTerm([], `${a * 3 * a}x³a³ - ${b * 2 * a}x⁵a⁴b³ + ${c * 8 * a}a⁴x⁵`)]
                )
            ];
            res = `${a * 3 * a}x³a³ - ${b * 2 * a}x⁵a⁴b³ + ${c * 8 * a}a⁴x⁵`;

        } else if (type === 4) {
            // Typ: (3/4·x + 6/12·x³)·(2/36·x² + 3/8)
            q = `(3/4·x + 1/2·x³)·(1/18·x² + 3/8)`;

            animSteps = [
                new AnimationStep(
                    `Vynásobíme zlomky`,
                    [new AnimationTerm([], `1/24·x³ + 9/32·x + 1/36·x⁵ + 3/16·x³`)]
                ),
                new AnimationStep(
                    `Sečteme členy s x³`,
                    [new AnimationTerm([], `1/36·x⁵ + 31/96·x³ + 9/32·x`)]
                )
            ];
            res = `1/36·x⁵ + 31/96·x³ + 9/32·x`;

        } else if (type === 5) {
            // Jednodušší: a(x + b) + c(x + d)
            const a = getRandomInt(2, 5);
            const b = getRandomInt(2, 5);
            const c = getRandomInt(2, 5);
            const d = getRandomInt(2, 5);

            q = `${a}(x + ${b}) + ${c}(x + ${d})`;

            animSteps = [
                new AnimationStep(
                    `Vynásobíme`,
                    [new AnimationTerm([], `${a}x + ${a * b} + ${c}x + ${c * d}`)]
                ),
                new AnimationStep(
                    `Sečteme členy s x`,
                    [new AnimationTerm([], `${a + c}x + ${a * b} + ${c * d}`)]
                ),
                new AnimationStep(
                    `Sečteme čísla`,
                    [new AnimationTerm([], `${a + c}x + ${a * b + c * d}`)]
                )
            ];
            res = `${a + c}x + ${a * b + c * d}`;

        } else if (type === 6) {
            // Typ: (ax + b)(cx + d)
            const a = getRandomInt(2, 5);
            const b = getRandomInt(2, 5);
            const c = getRandomInt(2, 5);
            const d = getRandomInt(2, 5);

            q = `(${a}x + ${b})(${c}x + ${d})`;

            animSteps = [
                new AnimationStep(
                    `Vynásobíme`,
                    [new AnimationTerm([], `${a * c}x² + ${a * d}x + ${b * c}x + ${b * d}`)]
                ),
                new AnimationStep(
                    `Sečteme členy s x`,
                    [new AnimationTerm([], `${a * c}x² + ${a * d + b * c}x + ${b * d}`)]
                )
            ];
            res = `${a * c}x² + ${a * d + b * c}x + ${b * d}`;

        } else {
            // Typ: ax² + bx + c - (dx² + ex + f)
            const a = getRandomInt(2, 5);
            const b = getRandomInt(2, 5);
            const c = getRandomInt(2, 5);
            const d = getRandomInt(1, a);
            const e = getRandomInt(1, b);
            const f = getRandomInt(1, c);

            q = `${a}x² + ${b}x + ${c} - (${d}x² + ${e}x + ${f})`;

            animSteps = [
                new AnimationStep(
                    `Odstraníme závorky`,
                    [new AnimationTerm([], `${a}x² + ${b}x + ${c} - ${d}x² - ${e}x - ${f}`)]
                ),
                new AnimationStep(
                    `Sečteme`,
                    [new AnimationTerm([], `${a - d}x² + ${b - e}x + ${c - f}`)]
                )
            ];
            res = `${a - d}x² + ${b - e}x + ${c - f}`;
        }

        items.push({ id: i, q, params: '', animSteps, res });
    }
    return items;
};

// 5. VYTÝKÁNÍ (mnohem složitější!)
const generateEx5 = (count) => {
    const items = [];
    for (let i = 1; i <= count; i++) {
        const type = i % 10; // 10 různých typů příkladů
        let q, res, animSteps;

        if (type === 0) {
            // Typ: xy² - x²y
            const exp1 = getRandomInt(1, 3);
            const exp2 = getRandomInt(2, 4);

            q = `xy² - x²y`;

            animSteps = [
                new AnimationStep(
                    `Hledáme NSD (společnou část)`,
                    [new AnimationTerm([], `NSD = <span class="color-green">x</span><span class="color-orange">y</span>`)]
                ),
                new AnimationStep(
                    `Vytkneme xy`,
                    [new AnimationTerm([], `<span class="color-green">x</span><span class="color-orange">y</span>(y - x)`)]
                )
            ];
            res = `xy(y - x)`;

        } else if (type === 1) {
            // Typ: x⁴ + 5x² + x³y
            const a = getRandomInt(2, 6);

            q = `x⁴ + ${a}x² + x³y`;

            animSteps = [
                new AnimationStep(
                    `Hledáme NSD (společnou část)`,
                    [new AnimationTerm([], `NSD = <span class="color-blue">x²</span>`)]
                ),
                new AnimationStep(
                    `Vytkneme x²`,
                    [new AnimationTerm([], `<span class="color-blue">x²</span>(x² + ${a} + xy)`)]
                )
            ];
            res = `x²(x² + ${a} + xy)`;

        } else if (type === 2) {
            // Typ: a³b³ + a²b³
            const exp1 = getRandomInt(2, 4);
            const exp2 = getRandomInt(2, 4);

            q = `a³b³ + a²b³`;

            animSteps = [
                new AnimationStep(
                    `Hledáme NSD (společnou část)`,
                    [new AnimationTerm([], `NSD = <span class="color-purple">a²</span><span class="color-orange">b³</span>`)]
                ),
                new AnimationStep(
                    `Vytkneme a²b³`,
                    [new AnimationTerm([], `<span class="color-purple">a²</span><span class="color-orange">b³</span>(a + 1)`)]
                )
            ];
            res = `a²b³(a + 1)`;

        } else if (type === 3) {
            // Typ: a³b⁴c⁴d⁶ - a⁵b⁵c⁴d⁴
            q = `a³b⁴c⁴d⁶ - a⁵b⁵c⁴d⁴`;

            animSteps = [
                new AnimationStep(
                    `Hledáme NSD`,
                    [new AnimationTerm([], `NSD = a³b⁴c⁴d⁴`)]
                ),
                new AnimationStep(
                    `Vytkneme a³b⁴c⁴d⁴`,
                    [new AnimationTerm([], `a³b⁴c⁴d⁴(d² - a²b)`)]
                )
            ];
            res = `a³b⁴c⁴d⁴(d² - a²b)`;

        } else if (type === 4) {
            // Typ: x²t⁴u⁴v⁴ + x³t²v²
            q = `x²t⁴u⁴v⁴ + x³t²v²`;

            animSteps = [
                new AnimationStep(
                    `Hledáme NSD`,
                    [new AnimationTerm([], `NSD = x²t²v²`)]
                ),
                new AnimationStep(
                    `Vytkneme x²t²v²`,
                    [new AnimationTerm([], `x²t²v²(t²u⁴v² + x)`)]
                )
            ];
            res = `x²t²v²(t²u⁴v² + x)`;

        } else if (type === 5) {
            // Typ: 9m² - 12m + 6
            const a = getRandomInt(2, 4);
            const gcd = a * 3;

            q = `${gcd * 3}m² - ${gcd * 4}m + ${gcd * 2}`;

            animSteps = [
                new AnimationStep(
                    `Hledáme NSD`,
                    [new AnimationTerm([], `NSD = ${gcd}`)]
                ),
                new AnimationStep(
                    `Vytkneme ${gcd}`,
                    [new AnimationTerm([], `${gcd}(3m² - 4m + 2)`)]
                )
            ];
            res = `${gcd}(3m² - 4m + 2)`;

        } else if (type === 6) {
            // Typ: 36a²b⁴ + 60u² - 24u³v⁴
            const gcd = getRandomInt(2, 4) * 6;

            q = `${gcd * 6}a²b⁴ + ${gcd * 10}u² - ${gcd * 4}u³v⁴`;

            animSteps = [
                new AnimationStep(
                    `Hledáme NSD`,
                    [new AnimationTerm([], `NSD = ${gcd}`)]
                ),
                new AnimationStep(
                    `Vytkneme ${gcd}`,
                    [new AnimationTerm([], `${gcd}(6a²b⁴ + 10u² - 4u³v⁴)`)]
                )
            ];
            res = `${gcd}(6a²b⁴ + 10u² - 4u³v⁴)`;

        } else if (type === 7) {
            // Typ: 8x³y³ + 6x⁴y⁴ - 4x²y⁵
            const gcd = getRandomInt(1, 3) * 2;

            q = `${gcd * 4}x³y³ + ${gcd * 3}x⁴y⁴ - ${gcd * 2}x²y⁵`;

            animSteps = [
                new AnimationStep(
                    `Hledáme NSD`,
                    [new AnimationTerm([], `NSD = ${gcd}x²y³`)]
                ),
                new AnimationStep(
                    `Vytkneme ${gcd}x²y³`,
                    [new AnimationTerm([], `${gcd}x²y³(4x + 3x²y - 2y²)`)]
                )
            ];
            res = `${gcd}x²y³(4x + 3x²y - 2y²)`;

        } else if (type === 8) {
            // Jednodušší: ax + ay
            const a = getRandomInt(2, 9);
            const vars = ['x', 'y', 'z', 'a', 'b'];
            const v1 = vars[getRandomInt(0, 4)];
            const v2 = vars[getRandomInt(0, 4)];

            q = `${a}${v1} + ${a}${v2}`;

            animSteps = [
                new AnimationStep(
                    `Hledáme NSD (společnou část)`,
                    [new AnimationTerm([], `NSD = <span class="color-red">${a}</span>`)]
                ),
                new AnimationStep(
                    `Vytkneme ${a}`,
                    [new AnimationTerm([], `<span class="color-red">${a}</span>(${v1} + ${v2})`)]
                )
            ];
            res = `${a}(${v1} + ${v2})`;

        } else {
            // Typ: ax² + bx
            const a = getRandomInt(2, 9);
            const b = getRandomInt(2, 9);
            const gcd = getRandomInt(1, Math.min(a, b));

            q = `${a}x² + ${b}x`;

            animSteps = [
                new AnimationStep(
                    `Hledáme NSD`,
                    [new AnimationTerm([], `NSD = ${gcd}x`)]
                ),
                new AnimationStep(
                    `Vytkneme ${gcd}x`,
                    [new AnimationTerm([], `${gcd}x(${a / gcd}x + ${b / gcd})`)]
                )
            ];
            res = `${gcd}x(${a / gcd}x + ${b / gcd})`;
        }

        items.push({ id: i, q, params: '', animSteps, res });
    }
    return items;
};

// === DATA STORAGE ===
let allData = {
    cv1: [],
    cv2: [],
    cv3: [],
    cv4: [],
    cv5: []
};

let expandedCards = new Set();

// === INITIALIZATION ===


function generateAllData() {
    allData.cv1 = generateEx1(100);
    console.log('CV1 Items:', allData.cv1.length);
    allData.cv2 = generateEx2(100);
    allData.cv3 = generateEx3(100);
    allData.cv4 = generateEx4(100);
    allData.cv5 = generateEx5(100);
}

function regenerateAll() {
    expandedCards.clear();
    generateAllData();
    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
    renderContent(activeTab);
}

// === GAMIFICATION STATE ===
let gameState = {
    score: 0,
    maxScore: 20,
    rankIndex: 0
};

const RANKS = [
    { name: "Začátečník", min: 0, color: "#94a3b8" },    // Noob (Gray)
    { name: "Učeň", min: 5, color: "#3b82f6" },          // Apprentice (Blue)
    { name: "Počtář", min: 10, color: "#8b5cf6" },       // Calculator (Purple)
    { name: "Mistr", min: 15, color: "#f59e0b" },        // Master (Orange)
    { name: "Legenda", min: 20, color: "#ef4444" }       // Legend (Red)
];

// === SCORE LOGIC ===
function updateScore(change) {
    const oldScore = gameState.score;
    gameState.score += change;

    // Limits
    if (gameState.score < 0) gameState.score = 0;
    if (gameState.score > gameState.maxScore) gameState.score = gameState.maxScore;

    // Check Rank Up/Down
    updateRank();
    updateProgressBar();

    // Animation for score change could be added here
}

function updateRank() {
    let newRankIndex = 0;
    for (let i = 0; i < RANKS.length; i++) {
        if (gameState.score >= RANKS[i].min) {
            newRankIndex = i;
        }
    }

    if (newRankIndex !== gameState.rankIndex) {
        // Rank changed!
        gameState.rankIndex = newRankIndex;
        // Could trigger celebration here
    }
}

function updateProgressBar() {
    const barFill = document.getElementById('progress-fill');
    const scoreText = document.getElementById('score-text');
    const rankText = document.getElementById('rank-text');

    if (barFill && scoreText && rankText) {
        const percentage = (gameState.score / gameState.maxScore) * 100;
        barFill.style.width = `${percentage}%`;
        barFill.style.backgroundColor = RANKS[gameState.rankIndex].color;

        scoreText.textContent = `${gameState.score} / ${gameState.maxScore}`;
        rankText.textContent = RANKS[gameState.rankIndex].name;
        rankText.style.color = RANKS[gameState.rankIndex].color;
    }
}

// === ANSWER CHECKING ===
function checkAnswer(tabId, index, btnElement) {
    const item = allData[tabId][index];
    const card = btnElement.closest('.question-card');
    const input = card.querySelector('.result-input');
    const userVal = input.value.trim();
    const correctVal = item.res.trim();

    // Check if answers are equivalent (handles multiple formats)
    const equivalenceResult = areAnswersEquivalent(userVal, correctVal, true); // Pass true to get detailed result

    if (equivalenceResult === true || (equivalenceResult && equivalenceResult.fullMatch)) {
        // Fully Correct
        if (!card.classList.contains('solved')) {
            updateScore(2);
            card.classList.add('solved');
            input.classList.add('correct');
            input.disabled = true;
            btnElement.textContent = "Správně!";
            btnElement.disabled = true;
        }
    } else if (equivalenceResult && equivalenceResult.partialMatch) {
        // Partially Correct (some conditions match)
        if (!card.classList.contains('solved') && !card.classList.contains('partial')) {
            updateScore(1); // Award 1 point for partial
            card.classList.add('partial');
            input.classList.add('partial-correct');

            // Show hint about missing conditions
            const hintDiv = card.querySelector('.answer-hint') || document.createElement('div');
            hintDiv.className = 'answer-hint';
            hintDiv.innerHTML = `
                <span class="hint-icon">⚠️</span>
                <span class="hint-text">Správně! Ale chybí ještě: <strong>${equivalenceResult.missing.join(', ')}</strong></span>
            `;

            // Insert hint after input
            const resultRow = card.querySelector('.result-row');
            if (!card.querySelector('.answer-hint')) {
                resultRow.parentNode.insertBefore(hintDiv, resultRow);
            }

            btnElement.textContent = "Zkus doplnit";
        }
    } else {
        // Incorrect
        if (!card.classList.contains('solved') && !card.classList.contains('partial')) {
            updateScore(-1);
            input.classList.add('shake');
            input.classList.add('incorrect');
            setTimeout(() => {
                input.classList.remove('shake');
                input.classList.remove('incorrect');
            }, 500);
        }
    }
}

// Helper function to check if two answers are equivalent
function areAnswersEquivalent(userAnswer, correctAnswer, returnDetails = false) {
    // Normalize both answers (remove spaces, lowercase)
    const user = userAnswer.replace(/\s/g, '').toLowerCase();
    const correct = correctAnswer.replace(/\s/g, '').toLowerCase();

    // 1. Exact match
    if (user === correct) return returnDetails ? { fullMatch: true } : true;

    // 2. Try numerical evaluation (handles fractions and decimals)
    const userNum = evaluateExpression(user);
    const correctNum = evaluateExpression(correct);

    if (userNum !== null && correctNum !== null) {
        // Both are numbers, compare with small tolerance for floating point
        const match = Math.abs(userNum - correctNum) < 0.0001;
        return returnDetails ? (match ? { fullMatch: true } : false) : match;
    }

    // 3. Try algebraic normalization (handles commutativity like 2x+1 = 1+2x)
    const userNorm = normalizeAlgebraic(user);
    const correctNorm = normalizeAlgebraic(correct);

    if (userNorm === correctNorm) return returnDetails ? { fullMatch: true } : true;

    // 4. Try multiple conditions (handles x≠0; x≠4 vs x≠0 x≠4)
    const conditionResult = areMultipleConditionsEquivalent(user, correct, returnDetails);
    if (conditionResult) return conditionResult;

    // 5. No match
    return returnDetails ? false : false;
}

// Check if multiple conditions are equivalent (ignoring punctuation and order)
function areMultipleConditionsEquivalent(user, correct, returnDetails = false) {
    // Split by common separators: semicolon, comma, 'and', or space between conditions
    // Use a more sophisticated split that handles: x≠0 x≠4 or x≠0; x≠4 or x≠0, x≠4
    const splitConditions = (str) => {
        // First try splitting by semicolon or comma
        let conditions = str.split(/[;,]/).map(c => c.trim()).filter(c => c.length > 0);

        // If we only got one condition, try splitting by 'and'
        if (conditions.length === 1) {
            conditions = str.split(/\s+and\s+/).map(c => c.trim()).filter(c => c.length > 0);
        }

        // If we still only have one condition, try splitting by spaces between complete conditions
        // Look for pattern: (condition)(space)(condition)
        // A condition is: variable + operator + value
        if (conditions.length === 1) {
            const conditionPattern = /([a-z]+[≠=∈<>≤≥][^\s;,]+)/g;
            const matches = str.match(conditionPattern);
            if (matches && matches.length > 1) {
                conditions = matches;
            }
        }

        return conditions.map(c => c.trim()).filter(c => c.length > 0);
    };

    const userConditions = splitConditions(user);
    const correctConditions = splitConditions(correct);

    if (userConditions.length === 0 || correctConditions.length === 0) return false;

    // Normalize each condition (evaluate fractions, simplify)
    const normalizeCondition = (cond) => {
        // Match patterns like: x≠-8/4, y≠5, x∈ℝ, etc.
        // Split by operator (≠, =, ∈, <, >, ≤, ≥)
        const match = cond.match(/^([a-z]+)(≠|=|∈|<|>|≤|≥)(.+)$/);
        if (match) {
            const variable = match[1];
            const operator = match[2];
            let value = match[3];

            // Try to evaluate the value (handles fractions like -8/4)
            const numValue = evaluateExpression(value);
            if (numValue !== null) {
                value = numValue.toString();
            }

            return { normalized: `${variable}${operator}${value}`, variable, operator, value };
        }
        return { normalized: cond, variable: '', operator: '', value: '' };
    };

    const userNormalized = userConditions.map(normalizeCondition);
    const correctNormalized = correctConditions.map(normalizeCondition);

    // Find matches
    const userNormStrings = userNormalized.map(c => c.normalized).sort();
    const correctNormStrings = correctNormalized.map(c => c.normalized).sort();

    // Check for full match
    if (userNormStrings.length === correctNormStrings.length) {
        let allMatch = true;
        for (let i = 0; i < userNormStrings.length; i++) {
            if (userNormStrings[i] !== correctNormStrings[i]) {
                allMatch = false;
                break;
            }
        }
        if (allMatch) {
            return returnDetails ? { fullMatch: true } : true;
        }
    }

    // Check for partial match (if returnDetails is true)
    if (returnDetails) {
        const matched = correctNormStrings.filter(c => userNormStrings.includes(c));

        if (matched.length > 0 && matched.length < correctNormStrings.length) {
            // Partial match! Find missing conditions
            const missing = correctNormalized
                .filter(c => !userNormStrings.includes(c.normalized))
                .map(c => `${c.variable} ${c.operator} ???`);

            return {
                partialMatch: true,
                fullMatch: false,
                matched: matched.length,
                total: correctNormStrings.length,
                missing: missing
            };
        }
    }

    return false;
}

// Evaluate simple numerical expressions (including fractions and arithmetic)
function evaluateExpression(expr) {
    try {
        // Handle simple fractions like -9/4
        if (/^-?\d+\/\d+$/.test(expr)) {
            const parts = expr.split('/');
            return parseFloat(parts[0]) / parseFloat(parts[1]);
        }

        // Handle decimals
        if (/^-?\d+\.?\d*$/.test(expr)) {
            return parseFloat(expr);
        }

        // Handle arithmetic expressions with fractions (e.g., 4+5/3, 8/2+10/6)
        // First, replace all fractions with their decimal values
        let processed = expr.replace(/(-?\d+)\/(\d+)/g, (match, num, denom) => {
            return (parseFloat(num) / parseFloat(denom)).toString();
        });

        // Now evaluate simple arithmetic (only +, -, *, / with numbers)
        // Security: Only allow numbers, operators, and parentheses
        if (/^[\d\.\+\-\*\/\(\)\s]+$/.test(processed)) {
            // Use Function constructor (safer than eval)
            const result = Function('"use strict"; return (' + processed + ')')();
            if (typeof result === 'number' && !isNaN(result)) {
                return result;
            }
        }

        return null;
    } catch (e) {
        return null;
    }
}

// Normalize algebraic expressions for comparison
function normalizeAlgebraic(expr) {
    // Remove all spaces
    expr = expr.replace(/\s/g, '');

    // Replace common variations
    expr = expr.replace(/·/g, '*');
    expr = expr.replace(/×/g, '*');

    // Split by + and - while keeping the operators
    // This regex splits but keeps delimiters
    const terms = [];
    let currentTerm = '';
    let currentSign = '+';

    for (let i = 0; i < expr.length; i++) {
        const char = expr[i];

        if ((char === '+' || char === '-') && i > 0 && expr[i - 1] !== '(') {
            // Found a term boundary
            if (currentTerm) {
                terms.push(currentSign + currentTerm);
            }
            currentSign = char;
            currentTerm = '';
        } else {
            currentTerm += char;
        }
    }

    // Add the last term
    if (currentTerm) {
        terms.push(currentSign + currentTerm);
    }

    // Sort terms alphabetically (this handles commutativity)
    terms.sort();

    // Join back together
    let normalized = terms.join('');

    // Clean up leading +
    if (normalized.startsWith('+')) {
        normalized = normalized.substring(1);
    }

    return normalized;
}


// === RENDERING ===
function renderContent(tabId) {
    const data = allData[tabId];
    const container = document.getElementById(`content-${tabId}`);

    container.innerHTML = data.map(item => createQuestionCard(item, tabId)).join('');
}

function createQuestionCard(item, tabId) {
    const cardId = `${tabId}-${item.id}`;
    const isExpanded = expandedCards.has(cardId);

    return `
        <div class="question-card ${isExpanded ? 'expanded' : ''}" data-card-id="${cardId}" data-tab="${tabId}" data-index="${item.id - 1}">
            <div class="card-header-row">
                <div class="solution-controls">
                    <button class="show-solution-btn js-show-solution" data-card-id="${cardId}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2"/>
                            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2"/>
                        </svg>
                        Ukáž postup
                    </button>
                    <div class="mode-toggle-mini">
                        <button class="mini-mode-btn js-mini-mode-btn ${animationState.mode === 'autoplay' ? 'active' : ''}" data-mode="autoplay" title="Automatický postup">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14">
                                <path d="M5 3l14 9-14 9V3z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <button class="mini-mode-btn js-mini-mode-btn ${animationState.mode === 'step' ? 'active' : ''}" data-mode="step" title="Krok po kroku">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14">
                                <path d="M19 13l-7 7-7-7m14-8l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                ${item.params ? `<div class="card-params">${item.params}</div>` : ''}
            </div>
            
            <div class="card-question" id="question-${cardId}">
                <div class="expression-line" id="line-${cardId}-0">
                    <span class="original-expression" id="original-${cardId}">${item.q}</span>
                </div>
            </div>

            <div class="interactive-area">
                <div class="calc-header">
                    <label>Mé výpočty:</label>
                    <button class="copy-question-btn js-copy-question" data-card-id="${cardId}" data-question="${item.q.replace(/"/g, '&quot;')}" title="Zkopíruj zadání do mých výpočtů">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14">
                            <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" stroke-width="2"/>
                        </svg>
                        Zkopíruj zadání
                    </button>
                </div>
                <textarea class="calc-area" placeholder="Zde si můžeš vypočítat příklad krok po kroku..."></textarea>
                <div class="result-row">
                    <input type="text" class="result-input" placeholder="Tvůj výsledek (např. 2x+1)">
                    <button class="check-btn js-check-btn" data-tab="${tabId}" data-index="${item.id - 1}">
                        Zkontrolovat
                    </button>
                </div>
            </div>
        </div>
    `;
}

// === EVENT HANDLERS & DELEGATION ===

function setupEventListeners() {
    // 1. Static Elements (Header & Nav)

    // Mode Toggles
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mode = e.currentTarget.dataset.mode;
            setAnimationMode(mode);
        });
    });

    // Regenerate Button
    const regenBtn = document.getElementById('regenerate-btn');
    if (regenBtn) {
        regenBtn.addEventListener('click', regenerateAll);
    }

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabId = e.currentTarget.dataset.tab;
            switchTab(tabId);
        });
    });


    // 2. Dynamic Elements (Event Delegation)
    document.addEventListener('click', (e) => {
        const target = e.target;

        // A. Mini Mode Buttons inside cards
        if (target.closest('.js-mini-mode-btn')) {
            e.stopPropagation();
            const btn = target.closest('.js-mini-mode-btn');
            const mode = btn.dataset.mode;
            setAnimationMode(mode);
            return;
        }

        // B. Show Solution Button
        if (target.closest('.js-show-solution')) {
            e.stopPropagation();
            const btn = target.closest('.js-show-solution');
            const cardId = btn.dataset.cardId;
            const card = document.querySelector(`[data-card-id="${cardId}"]`);
            if (card) {
                const tabId = card.dataset.tab;
                const index = parseInt(card.dataset.index);
                handleCardClickDelegated(card, tabId, index);
            }
            return;
        }

        // C. Copy Question Button
        if (target.closest('.js-copy-question')) {
            e.stopPropagation();
            const btn = target.closest('.js-copy-question');
            const question = btn.dataset.question;
            const cardId = btn.dataset.cardId;
            const card = document.querySelector(`[data-card-id="${cardId}"]`);
            if (card) {
                const textarea = card.querySelector('.calc-area');
                if (textarea) {
                    // Add question to textarea (append if there's already content)
                    const currentContent = textarea.value.trim();
                    if (currentContent) {
                        textarea.value = currentContent + '\n\n' + question;
                    } else {
                        textarea.value = question;
                    }
                    textarea.focus();
                }
            }
            return;
        }

        // D. Check Answer Button
        if (target.closest('.js-check-btn')) {
            e.stopPropagation();
            const btn = target.closest('.js-check-btn');
            const tabId = btn.dataset.tab;
            const index = parseInt(btn.dataset.index);
            checkAnswer(tabId, index, btn);
            return;
        }

        // E. Interactive Area (TextBox, etc.) - Stop Propagation to prevent card expand
        if (target.closest('.interactive-area') || target.closest('.card-header-row') || target.closest('.solution-controls')) {
            e.stopPropagation();
            return;
        }

        // D. Question Card (Expansion)
        const card = target.closest('.question-card');
        if (card) {
            const tabId = card.dataset.tab;
            const index = parseInt(card.dataset.index); // Note: index was item.id - 1
            // We need to pass the event to handleCardClick or call it directly
            // handleCardClick expects (tabId, index, event)

            // To be consistent with data, we need the actual array index. 
            // In createQuestionCard we used `item.id - 1` for index data-attr?
            // Yes: data-index="${item.id - 1}"

            if (tabId && !isNaN(index)) {
                // Manually reconstructing a simpler event object or just passing 'card' reference logic
                // reusing existing function logic requires strict args.
                // handleCardClick uses `event.currentTarget` as card.

                // Let's modify handleCardClick to be cleaner or wrap it here.
                // For now, let's call it. We need to mock 'event' to have currentTarget = card
                // But wait, in delegation 'e.currentTarget' is document. 
                // We must change handleCardClick to accept the card element directly or bind scope.

                handleCardClickDelegated(card, tabId, index);
            }
        }
    });
}

// Updated handler for delegation
async function handleCardClickDelegated(card, tabId, index) {
    const item = allData[tabId][index];
    const cardId = `${tabId}-${item.id}`;

    // If animation in progress, skip to next step
    if (animationState.inProgress && animationState.canSkip) {
        if (animationState.currentResolve) {
            animationState.currentResolve();
            animationState.currentResolve = null;
        }
        return;
    }

    // If already expanded and animation done, close it
    if (expandedCards.has(cardId) && !animationState.inProgress) {
        expandedCards.delete(cardId);
        card.classList.remove('expanded');
        renderContent(tabId);
        return;
    }

    // Start new animation (HINT)
    if (!expandedCards.has(cardId)) {
        // PENALTY Logic:
        // If the card is not solved yet, showing the animation counts as a hint
        if (!card.classList.contains('solved')) {
            updateScore(-1);
        }

        expandedCards.add(cardId);
        card.classList.add('expanded');
        await animateSolution(cardId, item);
    }
}


// === ANIMATION ENGINE ===
async function animateSolution(cardId, item) {
    animationState.inProgress = true;
    animationState.canSkip = false;

    const questionDiv = document.getElementById(`question-${cardId}`);

    // Get the initial line (question) to start attaching comments to
    let lastLine = questionDiv.querySelector('.expression-line');

    // Animate through steps
    for (let stepIdx = 0; stepIdx < item.animSteps.length; stepIdx++) {
        const step = item.animSteps[stepIdx];

        // PHASE 1: Show Comment on the PREVIOUS line (explaining what we are about to do)

        // Wait based on mode
        if (animationState.mode === 'autoplay') {
            await sleep(stepIdx === 0 ? 500 : 1000); // Shorter delay for first step
        } else {
            // Step mode - wait for click to show comment
            animationState.canSkip = true;
            await waitForClick();
            animationState.canSkip = false;
        }

        // Create and append the comment to the LAST line
        const commentSpan = document.createElement('span');
        commentSpan.className = 'step-comment-inline';
        // Add left arrow as requested
        commentSpan.innerHTML = `<span class="comment-arrow">←</span> ${step.comment}`;
        lastLine.appendChild(commentSpan);

        // PHASE 2: Show the Result (New Line)

        // Wait based on mode
        if (animationState.mode === 'autoplay') {
            await sleep(1000);
        } else {
            // Step mode - wait for click to show result
            animationState.canSkip = true;
            await waitForClick();
            animationState.canSkip = false;
        }

        // Create new line for this step
        const newLine = document.createElement('div');
        newLine.className = 'expression-line';

        // Add equals sign
        const equalsSpan = document.createElement('span');
        equalsSpan.className = 'equals';
        equalsSpan.textContent = '=';
        newLine.appendChild(equalsSpan);

        // Add the expression for this step
        const exprSpan = document.createElement('span');
        exprSpan.className = 'step-expression';

        // Combine all terms from this step into one expression
        const fullExpression = step.terms.map(t => t.text).join('');
        exprSpan.innerHTML = fullExpression; // Use innerHTML to support HTML tags

        newLine.appendChild(exprSpan);
        questionDiv.appendChild(newLine);

        // Update lastLine for the next iteration
        lastLine = newLine;
    }

    // Enhance the last line as the final result (instead of creating duplicate)
    // Wait based on mode before showing final styling
    if (animationState.mode === 'autoplay') {
        await sleep(500);
    } else {
        animationState.canSkip = true;
        await waitForClick();
        animationState.canSkip = false;
    }

    // Add "Výsledek" label and styling to the last line
    if (lastLine) {
        lastLine.classList.add('final-line');

        // Add result label
        const resultLabel = document.createElement('span');
        resultLabel.className = 'result-label';
        resultLabel.textContent = ' ← Výsledek';
        lastLine.appendChild(resultLabel);

        // Add click hint
        await sleep(300);
        const hint = document.createElement('span');
        hint.className = 'click-hint';
        hint.textContent = ' (klikni pro zavření)';
        lastLine.appendChild(hint);
    }

    animationState.inProgress = false;
}


// Helper function to wait for click in step mode
function waitForClick() {
    return new Promise(resolve => {
        animationState.currentResolve = resolve;
    });
}

// Helper function to wait or skip on click (Unused now but kept)
function waitOrSkip(ms) {
    return new Promise(resolve => {
        animationState.currentResolve = resolve;
        const timeout = setTimeout(() => {
            animationState.currentResolve = null;
            resolve();
        }, ms);
    });
}


// === TAB SWITCHING ===
function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `content-${tabId}`);
    });

    const container = document.getElementById(`content-${tabId}`);
    if (container.children.length === 0) {
        renderContent(tabId);
    }
}


// === UI HELPERS ===
function setAnimationMode(mode) {
    animationState.mode = mode;

    // Update main toggle buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // Update mini toggle buttons in cards
    document.querySelectorAll('.mini-mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
}

// === EXPOSE GLOBALS FOR INLINE HANDLERS (Validation Fallback) ===
window.setAnimationMode = setAnimationMode;
window.regenerateAll = regenerateAll;
window.switchTab = switchTab;
// Fix: assign the delegated version to the global name expected by HTML
window.handleCardClick = handleCardClickDelegated;
window.checkAnswer = checkAnswer;

// === VIRTUAL KEYBOARD LOGIC ===
let activeInput = null;

function setupKeyboard() {
    const keyboard = document.getElementById('math-keyboard');
    const closeBtn = document.getElementById('btn-close-keyboard');
    const allKeys = document.querySelectorAll('.key-btn[data-key]');
    const powerBtn = document.getElementById('btn-to-power');

    if (!keyboard) return;

    // Show keyboard when any result input or textarea is focused
    // We use delegation on document because inputs are dynamic
    document.addEventListener('focusin', (e) => {
        if (e.target.classList.contains('result-input') || e.target.classList.contains('calc-area')) {
            activeInput = e.target;
            keyboard.classList.remove('hidden');
            // Ensure content isn't covered by keyboard (simple padding adjustment)
            document.body.style.paddingBottom = '150px';
        }
    });

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            keyboard.classList.add('hidden');
            document.body.style.paddingBottom = '0';
            activeInput = null;
        });
    }

    // Key presses
    allKeys.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent focus loss if possible, though focusin handles it

            if (!activeInput) return;

            const char = btn.dataset.key;
            insertTextAtCursor(activeInput, char);
        });
    });

    // Power conversion button: "aⁿ"
    if (powerBtn) {
        powerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!activeInput) return;
            convertSelectionToSuperscript(activeInput);
        });
    }

    // Backspace button
    const backspaceBtn = document.getElementById('btn-backspace');
    if (backspaceBtn) {
        backspaceBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!activeInput) return;

            const start = activeInput.selectionStart;
            const end = activeInput.selectionEnd;

            if (start !== end) {
                // Delete selection
                activeInput.value = activeInput.value.substring(0, start) + activeInput.value.substring(end);
                activeInput.selectionStart = activeInput.selectionEnd = start;
            } else if (start > 0) {
                // Delete character before cursor
                activeInput.value = activeInput.value.substring(0, start - 1) + activeInput.value.substring(start);
                activeInput.selectionStart = activeInput.selectionEnd = start - 1;
            }
            activeInput.focus();
        });
    }

    // Back arrow button (move cursor left)
    const backBtn = document.getElementById('btn-back');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!activeInput) return;

            const pos = activeInput.selectionStart;
            if (pos > 0) {
                activeInput.selectionStart = activeInput.selectionEnd = pos - 1;
            }
            activeInput.focus();
        });
    }
}

function insertTextAtCursor(input, text) {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const val = input.value;

    // Insert text
    input.value = val.substring(0, start) + text + val.substring(end);

    // Move cursor after inserted text
    input.selectionStart = input.selectionEnd = start + text.length;
    input.focus();
}

function convertSelectionToSuperscript(input) {
    const start = input.selectionStart;
    const end = input.selectionEnd;

    if (start === end) {
        // No selection? Maybe try to convert the character BEFORE cursor?
        if (start > 0) {
            const charBefore = input.value[start - 1];
            const superChar = toSuperscript(charBefore);
            if (superChar !== charBefore) {
                // It was a convertible number!
                input.value = input.value.substring(0, start - 1) + superChar + input.value.substring(start);
                input.selectionStart = input.selectionEnd = start; // Cursor stays after modified char
                return;
            }
        }
        return; // Nothing to convert
    }

    const selection = input.value.substring(start, end);
    let converted = '';

    for (let char of selection) {
        converted += toSuperscript(char);
    }

    // Replace selection
    input.value = input.value.substring(0, start) + converted + input.value.substring(end);

    // Keep selection selected? Or move after? Moving after is standard for typing.
    input.selectionStart = input.selectionEnd = start + converted.length;
    input.focus();
}

const SUPERSCRIPT_MAP = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    '+': '⁺', '-': '⁻', 'x': 'ˣ', 'y': 'ʸ', '(': '⁽', ')': '⁾'
};

function toSuperscript(char) {
    return SUPERSCRIPT_MAP[char] || char; // Return original if no mapping
}


// === START APP ===
function initializeApp() {
    console.log("Initializing App via Event Listeners...");
    setupEventListeners();
    setupKeyboard(); // Initialize keyboard
    generateAllData();
    renderContent('cv1');
    updateProgressBar();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
