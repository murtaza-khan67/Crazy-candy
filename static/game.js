let score = 0;
let currentLevel = 1;
let foreverMode = false;
const funnyComments = [
  "That move was SWEET! 🍬",
  "Tasty!", "Delicious!", "Yum yum! 🤪",
  "Are you the Candy King?", "Lol, what was THAT!?", "1 like = 1 candy :P", "OMG, combo!"
];

async function loadGrid(level = 1, forever = false) {
  let url = `/get_grid?level=${level}&forever=${forever}`;
  let resp = await fetch(url);
  let data = await resp.json();
  renderGrid(data.grid);
  document.getElementById('funny').textContent = funnyComments[Math.floor(Math.random() * funnyComments.length)];
}

function renderGrid(grid) {
  let gridDiv = document.getElementById('game-grid');
  gridDiv.innerHTML = '';
  for (let i = 0; i < grid.length; i++) {
    let row = document.createElement('div');
    for (let j = 0; j < grid[i].length; j++) {
      let cell = document.createElement('span');
      cell.className = 'candy' + (grid[i][j] === '⬛' ? ' block' : '');
      cell.textContent = grid[i][j];
      cell.dataset.row = i;
      cell.dataset.col = j;
      if (grid[i][j] !== '⬛') {
        cell.onclick = () => selectCandy(i, j, cell);
      }
      row.appendChild(cell);
    }
    gridDiv.appendChild(row);
  }
}

let selected = null;
function selectCandy(i, j, el) {
  if (selected) {
    let [si, sj] = selected;
    if ((Math.abs(si-i) + Math.abs(sj-j)) === 1) {
      // swap and "match"
      makeMove(si, sj, i, j);
    }
    selected = null;
    document.querySelectorAll('.candy').forEach(c => c.style.background = null);
  } else {
    selected = [i, j];
    el.style.background = '#ffe900';
  }
}

function makeMove(si, sj, i, j) {
  // Fake match logic (demo):
  if (Math.random() > 0.4) { // 60% of the time a match happens
    score += 50;
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('funny').textContent = randomFunny();
    document.querySelector(`.candy[data-row='${i}'][data-col='${j}']`).textContent = '💥';
    setTimeout(() => loadGrid(currentLevel, foreverMode), 800);
  } else {
    document.getElementById('funny').textContent = "No match! Nice try! 😋";
  }
}

function randomFunny() {
  return funnyComments[Math.floor(Math.random() * funnyComments.length)];
}

document.getElementById('level-btn').onclick = () => {
  foreverMode = false;
  currentLevel += 1;
  loadGrid(currentLevel, false);
};
document.getElementById('forever-btn').onclick = () => {
  foreverMode = true;
  loadGrid(1, true);
};

// Initial load
loadGrid(1, false);
