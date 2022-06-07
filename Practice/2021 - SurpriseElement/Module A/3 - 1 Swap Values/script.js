
const inputA = document.querySelector('#a-val');
const inputB = document.querySelector('#b-val');
const outputBefore = document.querySelector('#bef-out');
const outputAfter = document.querySelector('#aft-out');

const submitVariables = () => {
  let A = inputA.value;
  let B = inputB.value;
  outputBefore.textContent = `
    A = ${A}
    B = ${B}
  `;
  [A, B] = [B, A];
  outputAfter.textContent = `
    A = ${A}
    B = ${B}
  `;
};