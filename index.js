// TODO:
//INCORPORATE WEIGHTING OF DIRECTIONAL MOVEMENT
//COMPONENT PROBABILITY

let globalFontSize = 9;

function GID(el) {
  return document.getElementById(el);
}

function compare(v, o, nv) {

  v = `${v}`;
  nv = `${nv}`
  if (v.match(/\d+/) || nv.match(/\d+/)) {
    v = parseInt(v);
    nv = parseInt(nv);
  }
  if (o === "===") {
    if (v === nv) {
      return true;
    } else {
      return false;
    }
  }
  if (o === ">") {
    if (v > nv) {
      return true
    } else {
      return false;
    }
  }
  if (o === ">=") {
    if (v >= nv) {
      return true
    } else {
      return false;
    }
  }
  if (o === "<") {
    if (v < nv) {
      return true;
    } else {
      return false
    }
  }
  if (o === "<=") {
    if (v <= nv) {
      return true;
    } else {
      return false;
    }
  }

  if (o === "!==") {
    if (v !== nv) {
      return true;
    } else {
      return false;
    }
  }
}

function variableCheck(c, e) {
  let equalityChecks = true;
  let workingArr = [];
  for (let i = 0; i < c.variables.length; i++) {
    let name = c.variables[i].name
    name = replaceVariable(e, name);
    let op = c.variables[i].operation;
    let value = c.variables[i].value;
    value = replaceVariable(e, value);
    let exists = false;
    if (e.variables.length === 0 && (op === "===" || op === "<" || op === ">" || op === ">=" || op === "<=")) {
      //can't compare if doesn't exist
      equalityChecks = false;
    } else if (e.variables.length === 0 && op === "!==") {
      equalityChecks = true;
    } else {
      for (let j = 0; j < e.variables.length; j++) {
        let eName = e.variables[j].name;
        if (eName === name) {
          exists = true;
          if (op === "===" || op === "<" || op === ">" || op === ">=" || op === "<=" || op === "!==") {

            equalityChecks = compare(e.variables[j].value, op, value)
          }
        }
      }
      if (exists === false) {
        if (op === "===" || op === "<" || op === ">" || op === ">=" || op === "<=") {
          equalityChecks = false;
        } else if (op === "!==") {
          equalityChecks = true;
        }
      }
    }
    if (equalityChecks === false) {
      return equalityChecks;
    }
  }
  return true;
}

function variableChange(c, e) {
  for (let i = 0; i < c.variables.length; i++) {
    let name = c.variables[i].name
    name = replaceVariable(e, name);
    let op = c.variables[i].operation;
    let value = c.variables[i].value;
    value = replaceVariable(e, value);
    if (op === "<" || op === ">" || op === "<=" || op === ">=" || op === "!==") {

    } else {
      let exists = false;
      if (e.variables.length === 0 && (op === "+=" || op === "-=")) {
        let newValue = doMath(0, op, value);
        let o = {};
        o.name = name;
        o.value = newValue;
        e.variables.push(o);
        exists = true;
      } else {
        for (let j = 0; j < e.variables.length; j++) {
          let eName = e.variables[j].name;
          if (eName === name) {
            exists = true;
            let newValue = doMath(e.variables[j].value, op, value);
            e.variables[j].value = newValue;
          }
        }
        if (exists === false) {
          let newValue = doMath(0, op, value);
          let o = {};
          o.name = name;
          o.value = newValue;
          e.variables.push(o)
        }
      }
    }
  }
}

function replaceVariable(e, localization) {
  let regex = /\$[\w\s\.]+\$/g;
  let l = localization;
  if (l && l.length > 0) {
    let matches = l.match(regex);
    if (matches) {
      for (let j = 0; j < matches.length; j++) {

        let noDollars = matches[j].replace(/\$/g, "")
        for (let n = 0; n <  e.variables.length; n++) {
          if (noDollars && e.variables[n].name === noDollars) {
            l = l.replace(matches[j], e.variables[n].value)
          }
        }
      }
    }
  }
  return l;
}

function getRandomInt(min, max) {
  //inclusive on both sides
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let g = {};
g.output = "";
g.choices = [];

function createGrid(n) {
  let grid = {};
  grid.name = n || "default";
  grid.currentX = 0;
  grid.currentY = 0;
  grid.magnification = 5;
  grid.cellArray = [];
  return grid;
}

let cellArray = [];

function GID(el) {
  return document.getElementById(el);
}


function startup() {
  g.grids = [];
  g.grids.push(createGrid())
  g.currentGrid = g.grids[0];
  g.magnification = 5
  buildGrid(g.magnification);
  drawGrid();
}
startup();

function normBrackets(s) {
  let arr = [];
  s = s.replace("[", "");
  s = s.replace("]", "")
  if (s.includes(",")) {
    s = s.split(/\,\s(?=[A-Za-z])/);
    for (let i = 0; i < s.length; i++) {
      if (s[i].charAt(0) === " ") {
        s[i] = s[i].substring(1);
      }
    }
    arr = s;
  } else {
    arr.push(s);
  }
  return arr;
}

function setVariableArray(v) {
  let arr = [];
  for (let i = 0; i < v.length; i++) {
    let variable = parseVariableFromText(v[i])
    if (variable !== "empty") {
      arr.push(variable);
    }
  }
  return arr;
}

function parseVariableFromText(t) {
  let matches = t.match(/\s?([\w\s\d\,\!\(\)\$\.]+)\s([\+\=\-\!\<\>]+)\s([\w\s\d\,\!\(\)\$\.]+)/);
  if (matches && matches.length > 0) {
    let o = {};
    o.name = matches[1];
    o.operation = matches[2];
    o.value = matches[3]; //edit here to parseint if messes up
    return o;
  } else {
    return "empty"
  }
}

function getChoiceFromMatch(m, coords) {
  let o = {};
  let rx = /x([\-\d]+)/
  let ry = /y([\-\d]+)/
  o.x = parseInt(coords.match(rx)[1]);
  o.y = parseInt(coords.match(ry)[1]);
  let parens = /\([\w\s\d\,\!\/\'\"\$\.\=\+\-\>\<\%]+\)/g;
  let  parensArr = m.match(parens) || [];
  //o.text = m.replace(parens, "");
  o.text = m;
  o.text = o.text.replace("choice: ", "")
  o.text = o.text.replace("[", "");
  o.text = o.text.replace("]", "")
  o.gridName = g.currentGrid.name;
  for (let z = 0; z < parensArr.length; z++) {
    if (parensArr[z].includes("=") || parensArr[z].includes("<") || parensArr[z].includes(">")) {
      let unp = parensArr[z].replace("(", "");
      unp = unp.replace(")", "");
      o.variables = normBrackets(unp);
      o.variables = setVariableArray(o.variables)
    } else {
      o.directions = normBrackets(parensArr[z])
      for (let n = 0; n < o.directions.length; n++) {
        o.directions[n] = o.directions[n].replace(")", "");
        o.directions[n] = o.directions[n].replace("(", "");
      }
    }
  }
  return o
}

function saveCell(g, coords) {
  let v = GID(`${coords}`).value
  if (v.length > 0) {
    let o = {};
    let exists = false;
    let total = /\[[\w\s\+\.\-\=\<\>\!\?\d\,\:\(\)\$\'\"\%]+\]/g
    let rx = /x([\-\d]+)/
    let ry = /y([\-\d]+)/

    for (let i = 0; i < g.currentGrid.cellArray.length; i++) {

      // existing cell => edit; you could do this just as well by creating object and replacing if necessary, that would avoid duplication
      // ALWAYS CHANGE BOTH UNTIL YOU FIX THIS AND PLACE IN ONE
      if (g.currentGrid.cellArray[i].coords === coords) {
        g.currentGrid.cellArray[i].unprocessed = v;
        let components = g.currentGrid.cellArray[i].unprocessed.split("*")
        let cArr = [];
        for (let j = 0; j < components.length; j++) {
          let c = {};
          c.variables = [];
          c.directions = [];
          c.choices = [];
          c.text = components[j].trim();
          c.text = c.text.replace(/\[[\w\s\=\<\>\+\.\-\!\?\,\:\d\(\)\$\'\"\%]+\]/g, "")
          let matches = components[j].match(total);
          if (matches) {
            for (let n = 0; n < matches.length; n++) {
              if (matches[n].includes("[START]")) {
                c.start = true;
              } else if (matches[n].includes("choice:")) {
                c.choices.push(getChoiceFromMatch(matches[n], coords))
              } else if (matches[n].includes("bg:")) {
                c.background = matches[n].replace("bg: ", "").replace("[", "").replace("]", "");
              } else if (matches[n].includes("color:")) {
                c.color = matches[n].replace("color: ", "").replace("[", "").replace("]", "")
              } else if (matches[n].includes("img:")) {
                c.img = matches[n].replace("img: ", "").replace("[", "").replace("]", "")
              } else if (matches[n].includes("=") || matches[n].includes("<") || matches[n].includes(">")) {
                let unprocessedVariables = normBrackets(matches[n])
                c.variables = setVariableArray(unprocessedVariables);
              } else {
                c.directions = normBrackets(matches[n])
              }
            }
          }
          cArr.push(c);
        }
        g.currentGrid.cellArray[i].components = cArr;
        exists = true;
      }
    }

    //non existant cell => create
    if (exists === false) {
      o.coords = coords
      let x = parseInt(o.coords.match(rx)[1]);
      let y = parseInt(o.coords.match(ry)[1]);
      o.x = x;
      o.y = y;
      o.unprocessed = v;
      let components = o.unprocessed.split("*")
      let cArr = [];
      for (let j = 0; j < components.length; j++) {
        let c = {};
        c.variables = [];
        c.directions = [];
        c.choices = [];
        c.text = components[j].trim();
        c.text = c.text.replace(/\[[\w\s\=\<\>\+\-\\!\?,\d\.\:\(\)\$\'\"\%]+\]/g, "")
        let matches = components[j].match(total);
        if (matches) {
          for (let n = 0; n < matches.length; n++) {
            if (matches[n].includes("[START]")) {
              c.start = true;
            } else if (matches[n].includes("choice:")) {
              c.choices.push(getChoiceFromMatch(matches[n], o.coords))
            } else if (matches[n].includes("bg:")) {
              c.background = matches[n].replace("bg: ", "").replace("[", "").replace("]", "");
            } else if (matches[n].includes("color:")) {
              c.color = matches[n].replace("color: ", "").replace("[", "").replace("]", "")
            } else if (matches[n].includes("img:")) {
              c.img = matches[n].replace("img: ", "").replace("[", "").replace("]", "")
            } else if (matches[n].includes("=") || matches[n].includes("<") || matches[n].includes(">")) {
              let unprocessedVariables = normBrackets(matches[n])
              c.variables = setVariableArray(unprocessedVariables);
            } else {
              c.directions = normBrackets(matches[n])
            }
          }
        }
        cArr.push(c);
      }
      o.components = cArr
      g.currentGrid.cellArray.push(o);
    }
  } else {
    //delete cell if it is later empty
    let rx = /x([\-\d]+)/
    let ry = /y([\-\d]+)/
    let x = parseInt(coords.match(rx)[1]);
    let y = parseInt(coords.match(ry)[1]);
    let deleteIndex = false
    for (let i = 0; i < g.currentGrid.cellArray.length; i++) {
      if (g.currentGrid.cellArray[i].coords === coords) {
        deleteIndex = i
      }
    }
    if (deleteIndex) {
      console.log(g.currentGrid.cellArray)
      g.currentGrid.cellArray.splice(deleteIndex, 1);
      console.log(g.currentGrid.cellArray)
    }
  }
}


function buildGrid(size) {

  let t = "<table class=big-table>"
  if (size === -1) {
    t += "<tr>"
    t += `<td class="event-map-cell"><textarea class="inner-cell" id="x${g.currentGrid.currentX}y${g.currentGrid.currentY}"></textarea></td>`
    t += "</tr>"
  } else {
    for (let i = g.currentGrid.currentY + size; i > g.currentGrid.currentY - size - 1; i--) {
      t += "<tr>"
      for (let j = g.currentGrid.currentX - size; j < g.currentGrid.currentX + size + 1; j++) {
        let cellCoords = `x${j}y${i}`
        t += `<td class="event-map-cell">
          <td><textarea class="inner-cell" id="${cellCoords}"></textarea></td>
        </td>`
      }
      t += "</tr>"
    }
  }
  t += "</table>"
  return t;
}



function drawGrid(fontSize) {
  GID("grid").innerHTML = buildGrid(g.currentGrid.magnification);
  for (let i = 0; i < g.currentGrid.cellArray.length; i++) {
    try {
      GID(`${g.currentGrid.cellArray[i].coords}`).value = g.currentGrid.cellArray[i].unprocessed;
    } catch {

    }
  }
  let els = document.getElementsByClassName("inner-cell")
  if (fontSize === "l") {
    if (g.currentGrid.magnification < 10) {
      globalFontSize += 3;
    }
  } else if (fontSize === "s") {
    if (globalFontSize !== 3) {
      globalFontSize -= 3;
    }
  }
  for (let i = 0; i < els.length; i++) {
    if (fontSize && fontSize === "l") {
      els[i].style.fontSize = `${globalFontSize}px`;
    } else if (fontSize && fontSize === "s") {
      els[i].style.fontSize = `${globalFontSize}px`;
    } else {
      els[i].style.fontSize = `${globalFontSize}px`;
    }
    els[i].onblur = function() {
      let coords = els[i].id;
      saveCell(g, coords);
    }
  }
}

GID("plusicon").onclick = function() {
  if (g.currentGrid.magnification >= 1) {
    g.currentGrid.magnification -= 1;
    if (g.currentGrid.magnification % 2 === 0) {
      g.currentGrid.magnification -= 1;
    }
    drawGrid("l");
  }
}
GID("minusicon").onclick = function() {
  g.currentGrid.magnification += 1;
  if (g.currentGrid.magnification % 2 === 0) {
    g.currentGrid.magnification += 1;
  }
  drawGrid("s");
}

function showHide(el) {
  let d = GID(el).style.display;
  if (d === "none") {
    GID(el).style.display = "block";
  } else {
    GID(el).style.display = "none";
  }
}

//otherwise, boxes only appear on second click...
GID("cell-box").style.display = "none";
GID("grid-select-box").style.display = "none";
GID("help-box").style.display = "none";
GID("settings-box").style.display = "none";

GID("writeicon").onclick = function() {
  showHide("cell-box")
}

GID("helpicon").onclick = function() {
  showHide("help-box");
}

GID("help-box").onclick = function() {
  showHide("help-box");
}

GID("settings-box").onclick = function() {
  showHide("settings-box");
}

GID("settingsicon").onclick = function() {
  showHide("settings-box");
}

GID("cell-box").onclick = function() {
  //showHide("cell-box");
}

GID("gridicon").onclick = function() {
  showHide("grid-select-box");
  GID("grid-select-box").innerHTML = "";
  let t = "";
  t += "<p id=add-grid-button>Add Grid</p>";
  for (let i = 0; i < g.grids.length; i++) {
    t += `<p class="grid-list">${g.grids[i].name}</p>`
  }
  GID("grid-select-box").innerHTML += t;
  let els = document.getElementsByClassName("grid-list");
  for (let i = 0; i < els.length; i++) {
    els[i].onclick = function() {
      g.currentGrid = g.grids[i]
      drawGrid();
      GID("grid-select-box").style.display = "none";
    }
  }
  GID("add-grid-button").onclick = function() {
    addGrid();
  }
}
let counter = 0

function addGrid() {
  let gridName = prompt("Name of Grid?")
  counter += 1;
  g.grids.push(createGrid(`${gridName}`))
  GID("grid-select-box").innerHTML = "";
  let t = "";
  t += "<p id=add-grid-button>Add Grid</p>";
  for (let i = 0; i < g.grids.length; i++) {
    t += `<p class="grid-list">${g.grids[i].name}</p>`
  }
  GID("grid-select-box").innerHTML += t;
  let els = document.getElementsByClassName("grid-list");
  for (let i = 0; i < els.length; i++) {
    els[i].onclick = function() {
      g.currentGrid = g.grids[i]
      drawGrid();
      GID("grid-select-box").style.display = "none";
    }
  }
  GID("add-grid-button").onclick = function() {
    addGrid();
  }
}

GID("add-grid-button").onclick = function() {
  addGrid();
}

function runGenerationProcess(grid, w) {
  GID("cell-box").innerHTML = "";
  g.output = "";
  if (grid && w) {
    let t = generate(grid, w, true);
    GID("cell-box").innerHTML += `<div id="output-box">${replaceVariable(g.lastWalker, t)}</div>`;
  } else {
    let t = generate();
    GID("cell-box").innerHTML += `<div id="output-box">${replaceVariable(g.lastWalker, t)}</div>`;
  }


  GID("cell-box").innerHTML += `<div id="choices-box"></div>`
  for (let n = 0; n < g.choices.length; n++) {
    let parens = /\([\w\s\d\,\!\$\.\=\+\-\>\<]+\)/g;
    //WORKING HERE
    let num = n;
    let t = g.choices[n].text.replace(parens, "")
    GID("choices-box").innerHTML += `<p class=choiceslist id=choice${num}>${replaceVariable(g.lastWalker, t)}</p>`
  }
  let els = document.getElementsByClassName("choiceslist");
  for (let n = 0; n < els.length; n++) {
    els[n].onclick = function() {
      let id = els[n].id.replace("choice", "");
      if (g.oldChoices[id].directions && g.oldChoices[id].directions.length > 0) {
        let walker = g.lastWalker;
        addChoiceToWalker(walker, g.oldChoices[id])
        let directions = g.oldChoices[id].directions;
        let nextDirection = directions[getRandomInt(0, directions.length - 1)];
        let possibleNextCells = createPossibleCellsArr(walker, g.oldChoices[id], g.oldChoices[id].x, g.oldChoices[id].y)
        let choiceGrid = g.oldChoices[id].gridName
        if (possibleNextCells.length > 0) {
          let nextCell = getRandomFromArr(possibleNextCells);
          walker.x = nextCell.x;
          walker.y = nextCell.y;
        }
        g.lastWalker = walker;
        runGenerationProcess(getGridByName(g, choiceGrid), walker);
      }
    }
  }
  g.oldChoices = g.choices;
  g.choices = [];
}

GID("generateicon").onclick = function() {
  runGenerationProcess();
}

GID("saveicon").onclick = function() {
  let n = prompt("What name should this generator be saved under?")
  localStorage.setItem(n, JSON.stringify(g))
}

GID("loadicon").onclick = function() {
  let n = prompt("What generator would you like to load?")
  g = JSON.parse(localStorage.getItem(n))
  drawGrid();
}

document.onkeydown = move

function move(e) {
  let c = e.keyCode;
  if (c === 38) {
    //north
    g.currentGrid.currentY += 1;
    drawGrid();
  }
  if (c === 37) {
    //west
    g.currentGrid.currentX -= 1;
    drawGrid();
  }
  if (c === 39) {
    //east
    g.currentGrid.currentX += 1;
    drawGrid();
  }
  if (c === 40) {
    //south
    g.currentGrid.currentY -= 1;
    drawGrid();
  }
}

function getCell(x, y) {
  for (let i = 0; i < g.currentGrid.cellArray.length; i++) {
    if (parseInt(g.currentGrid.cellArray[i].x) === parseInt(x) && parseInt(g.currentGrid.cellArray[i].y) === parseInt(y)) {
      return g.currentGrid.cellArray[i];
    }
  }
}

function getCellArr(component, x, y) {
  // TODO: incorporate weighting
  if (component.directions && component.directions.length > 0) {
    let dArr = [];
    for (let i = 0; i < component.directions.length; i++) {
      let targetX = parseInt(x);
      let targetY = parseInt(y);
      let validDirection = true;
      let d = component.directions[i];

      if (d === "E") {
        targetX += 1;
      } else if (d === "W") {
        targetX -= 1;
      } else if (d === "N") {
        targetY += 1;
      } else if (d === "S") {
        targetY -= 1;
      } else if (d === "NW") {
        targetY += 1;
        targetX -= 1;
      } else if (d === "NE") {
        targetY += 1;
        targetX += 1;
      } else if (d === "SE") {
        targetY -= 1;
        targetX += 1;
      } else if (d === "SW") {
        targetY -= 1;
        targetX -= 1;
      } else {
        validDirection = false;
      }
      if (validDirection === true) {
        let dir = get(targetX, targetY);

        if (dir !== undefined) {
          dArr.push(dir)
        }
      }
    }
    return dArr;
  } else {
    return "STOP";
  }
}

function getStarts() {
  let starts = [];
  for (let i = 0; i < g.currentGrid.cellArray.length; i++) {
    for (let j = 0; j < g.currentGrid.cellArray[i].components.length; j++) {
      if (g.currentGrid.cellArray[i].components[j].start) {
        starts.push(g.currentGrid.cellArray[i])
      }
    }
  }
  return starts;
}

function getRandomStart(starts) {
  let rand = getRandomInt(0, starts.length - 1);
  let start = starts[rand];
  return start;
}

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function doMath(num1, operator, num2) {

  if (operator === "=") {
    return num2;
  } else {
    if ((Number.isInteger(num1) || isNumeric(num1)) && (Number.isInteger(num2) || isNumeric(num2))) {
      num1 = parseInt(num1);
      num2 = parseInt(num2);
    }
    if (operator === "+=") {
      return num1 + num2;
    } else if (operator === "-=") {
      return num1 - num2;
    } else if (operator === "=") {
      return num2;
    }
  }
  return num2;
}


function getGridByName(g, n) {
  for (let i = 0; i < g.grids.length; i++) {
    if (g.grids[i].name === n) {
      return g.grids[i];
    }
  }
}

function setStart() {
  let starts = getStarts()
  let start = getRandomStart(starts);
  return start;
}

function getWalker(start, w) {
  let walker = {};
  if (w) {
    walker = w;
  } else {
    walker.text = "";
    walker.x = parseInt(start.x);
    walker.y = parseInt(start.y);
    walker.variables = [];
  }
  return walker;
}



function genLoop(walker) {
  let res = ""
  let generating = true;
  while (generating === true) {
    let currentCell = getCell(walker.x, walker.y);
    let possibleComponents = createPossibleComponentsArr(walker, currentCell.components);
    let currentComponent = getRandomFromArr(possibleComponents)

    //THIS WORKS BUT WILL REPLACE COMPONENT FOREVER, does not replace choices because choices are on walker



    addComponentTo(walker, currentComponent);
    if (currentComponent.text.includes("runGrid(")) {
      res += runGrids(walker, currentComponent.text)
      res = runFunctions(walker, res);
    } else {
      res += replaceVariable(walker, currentComponent.text);
      res = runFunctions(walker, res);
    }
    let possibleNextCells = createPossibleCellsArr(walker, currentComponent, walker.x, walker.y)
    if (possibleNextCells.length > 0) {
      let nextCell = getRandomFromArr(possibleNextCells);
      walker.x = nextCell.x;
      walker.y = nextCell.y;
    } else {
      generating = false;
    }
  }
  g.lastWalker = walker;
  return res;
}

function addChoiceToWalker(w, c) {
  if (c.variables) {
    for (let i = 0; i < c.variables.length; i++) {
      let exists = false;
      for (let j = 0; j < w.variables.length; j++) {
        if (variablesHaveSameName(w.variables[j], c.variables[i])) {
          exists = true;
          if (isComparisonOperator(c.variables[i].operation) === false) {
            let newValue = doMath(w.variables[j].value, c.variables[i].operation, c.variables[i].value)
            w.variables[j].value = newValue;
          }
        }
      }
      if (exists === false) {
        //address fact that some variables are strings.
        let o = {};
        o.name = c.variables[i].name;
        o.value = doMath(0, c.variables[i].operation, c.variables[i].value)
        w.variables.push(o);
      }
    }
  }
}

function runGrids(w, t) {
  let stillT = true;
  while (stillT === true) {
    console.log(t);
    t = `${t}`;
    if (t && t.includes("runGrid(")) {
      let m = t.match(/runGrid\(([\w\s\d,\!\$\.]+)\)/);
      for (let i = 1; i < m.length; i++) {
        let res = "";
        let lastGrid = g.currentGrid;
        let lastX = w.x;
        let lastY = w.y;
        let nextGrid = getGridByName(g, m[i]);
        res += generate(nextGrid, w);
        g.currentGrid = lastGrid;
        w.x = lastX;
        w.y = lastY;
        t = t.replace(/runGrid\(([\w\s\d,\!\$\.]+)\)/, res)
      }
    } else {
      stillT = false;
    }
  }
  return t;
}

function getRandomColor() {
  let randomColor = Math.floor(Math.random()*16777215).toString(16);
  return randomColor;
}

function runFunctions(w, t) {
  let stillT = true;
  while (stillT === true) {
    t = `${t}`
    if (t && t.includes("getRandomColor()")) {
      t = t.replace("getRandomColor()", getRandomColor());
      console.log(t);
    } else if (t && t.includes("indent(")) {
      let m = t.match(/indent\((\d+)\)/)
      if (m && m[1]){
        let d = parseInt(m[1]);
        let indent = "";
        for (let i = 0; i < d; i++) {
          indent += "&nbsp&nbsp";
        }
        t = t.replace(/indent\(\d+\)/, indent)
      }
    } else if (t && t.includes("C(")) {
      let m = t.match(/C\((\w+)\)/)
      if (m && m[1]) {
        t = t.replace(/C\((\w+)\)/, m[1].toUpperCase())
      }
    } else if (t && t.includes("getRandomInt(")) {
      let m = t.match(/getRandomInt\((\d+)\,\s?(\d+)\)/);
      console.log(m);
      if (m && m[1] && m[2])  {
        t = t.replace(/getRandomInt\((\d+)\,\s?(\d+)\)/, getRandomInt(parseInt(m[1]), parseInt(m[2])))
      } else {
        stillT = false;
      }
    } else {
      stillT = false;
    }
  }
  return t;
}

function addComponentTo(w, comp) {
  console.log(comp);
  if (comp.variables) {
    for (let i = 0; i < comp.variables.length; i++) {
      let exists = false;
      for (let j = 0; j < w.variables.length; j++) {
        let wv = w.variables[j];
        wv = replaceVariable(w, wv);
        let cv = comp.variables[i];
        cv = replaceVariable(w, cv);
        wv.name = runGrids(w, wv.name);
        cv.name = runGrids(w, cv.name)
        wv.name = runFunctions(w, wv.name);
        cv.name = runFunctions(w, cv.name)
        if (variablesHaveSameName(wv, cv)) {
          exists = true;
          if (isComparisonOperator(cv.operation) === false) {
            wv.value = runGrids(w, wv.value);
            cv.value = runGrids(w, cv.value);
            wv.value = runFunctions(w, wv.value);
            console.log(wv.value)
            //cv.value = runFunctions(w, cv.value);
            console.log(cv.value);
            let newValue = doMath(wv.value, cv.operation, cv.value)
            w.variables[j].value = replaceVariable(w, newValue);
          }
        }
      }
      if (exists === false) {
        //address fact that some variables are strings.
        let o = {};
        o.name = comp.variables[i].name;
        o.name = replaceVariable(w, o.name)
        o.name = runGrids(w, o.name)
        o.name = runFunctions(w, o.name)
        o.value = doMath(0, comp.variables[i].operation, runFunctions(w, comp.variables[i].value))
        o.value = replaceVariable(w, o.value)
        o.value = runGrids(w, o.value)
        o.value = runFunctions(w, o.value)
        w.variables.push(o);
      }
    }
  }
  if (comp.choices.length > 0) {
    for (let i = 0; i < comp.choices.length; i++) {
      let o = _.cloneDeep(comp.choices[i]);
      o.text = runGrids(w, o.text);
      o.text = runFunctions(w, o.text);
      console.log(o);
      g.choices.push(o);
    }
  }
  if (comp.background && comp.background.length > 0) {
    console.log("BACKGROUND")
    GID("cell-box").style.backgroundColor = `${comp.background}`
  }
  if (comp.color && comp.color.length > 0) {
    GID("cell-box").style.color = `${comp.color}`
  }
  if (comp.img && comp.img.length > 0) {
    GID("cell-box").style.backgroundImage = `url(${comp.img})`;
  }
}

function getRandomFromArr(arr) {
  return arr[getRandomInt(0, arr.length - 1)];
}

function createPossibleComponentsArr(w, c) {
  let arr = [];
  for (let i = 0; i < c.length; i++) {
    if (variablesConflict(w, c[i]) === false) {
      arr.push(c[i]);
    } else {
    }
  }
  return arr;
}

function isComparisonOperator(operator) {
  if (operator === "===" || operator.includes("<") || operator.includes(">")) {
    return true;
  } else {
    return false;
  }
}

function walkerIsEmptyButComponentCompares(w, c) {
  if (w.variables.length === 0 && isComparisonOperator(c.operation)) {
    return true;
  } else {
    return false;
  }
}

function variablesHaveSameName(v1, v2) {
  if (v1.name === v2.name) {
    return true;
  } else {
    return false;
  }
}

function variableComparisonsFail(w, compVar) {
  for (let i = 0; i < w.variables.length; i++) {
    if (variablesHaveSameName(w.variables[i], compVar)) {
      if (compare(w.variables[i].value, compVar.operation, compVar.value) === false) {
        return true;
      }
    }
  }
  return false;
}

function variablesConflict(w, c) {
  if (c) {
    for (let i = 0; i < c.variables.length; i++) {
      let compVar = c.variables[i]
      if (walkerIsEmptyButComponentCompares(w, compVar)) {
        return true;
      }
      if (variableComparisonsFail(w, compVar)) {
        return true;
      }
    }
  }
  return false;
}

function createPossibleCellsArr(w, component, x, y) {
  let gridHolder = g.currentGrid.name;
  if (component.gridName) {
    //deals with choices not being called until later
    g.currentGrid = getGridByName(g, component.gridName)
  }
  //component is a misnomer here, also can take choices
  if (component.directions && component.directions.length > 0) {
    let dArr = [];
    for (let i = 0; i < component.directions.length; i++) {
      let targetX = parseInt(x);
      let targetY = parseInt(y);
      let validDirection = true;
      let d = component.directions[i];

      if (d === "E") {
        targetX += 1;
      } else if (d === "W") {
        targetX -= 1;
      } else if (d === "N") {
        targetY += 1;
      } else if (d === "S") {
        targetY -= 1;
      } else if (d === "NW") {
        targetY += 1;
        targetX -= 1;
      } else if (d === "NE") {
        targetY += 1;
        targetX += 1;
      } else if (d === "SE") {
        targetY -= 1;
        targetX += 1;
      } else if (d === "SW") {
        targetY -= 1;
        targetX -= 1;
      } else {
        validDirection = false;
      }
      if (validDirection === true) {
        let dir = getCell(targetX, targetY);

        //check cell from direction to see if at least one component does not conflict
        let conflicts = true;


        for (let j = 0; j < dir.components.length; j++) {
          if (variablesConflict(w, dir.components[j]) === false) {
            conflicts = false;
          }
        }


        if (dir !== undefined && conflicts === false) {
          dArr.push(dir)
        }
      }
    }
    g.currentGrid = getGridByName(g, gridHolder);
    return dArr;
  } else {
    return [];
  }
}


function generate(grid, w, continuing) {
  let res = "";
  let lastGrid;
  if (grid) {
    lastGrid = g.currentGrid;
    g.currentGrid = grid;
  }
  let start = setStart();
  let walker = w || getWalker(start)
  if (continuing) {

  } else {
    walker.x = start.x;
    walker.y = start.y;
  }
  res += genLoop(walker);


  if (lastGrid !== undefined) {
    g.currentGrid = lastGrid
  }
  return res
}
