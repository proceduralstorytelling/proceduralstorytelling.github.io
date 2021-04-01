// TODO:
//INCORPORATE WEIGHTING OF DIRECTIONAL MOVEMENT
//COMPONENT PROBABILITY

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
        console.log(value);
        let newValue = doMath(0, op, value);
        console.log(newValue);
        let o = {};
        o.name = name;
        o.value = newValue;
        console.log(o);
        e.variables.push(o);
        console.log(e.variables);
        exists = true;
      } else {
        for (let j = 0; j < e.variables.length; j++) {
          let eName = e.variables[j].name;
          if (eName === name) {
            exists = true;
            console.log(e.variables[j].value)
            console.log(op);
            let newValue = doMath(e.variables[j].value, op, value);
            console.log(newValue);
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
    s = s.split(",");
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
  let matches = t.match(/\s?([\w\s\d,\!\(\)\$\.]+)\s([\+\=\-\!\<\>]+)\s([\w\s\d,\!\(\)\$\.]+)/);
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

function saveCell(g, coords) {
  let v = GID(`${coords}`).value
  if (v.length > 0) {
    let o = {};
    let exists = false;
    let total = /\[[\w\s\+\.\-\=\<\>\!\d\,]+\]/g
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
          c.text = components[j].trim();
          c.text = c.text.replace(/\[[\w\s\=\<\>\+\.\-\!\,\d]+\]/g, "")
          let matches = components[j].match(total);
          if (matches) {
            for (let n = 0; n < matches.length; n++) {
              if (matches[n].includes("[START]")) {
                c.start = true;
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
        c.text = components[j].trim();
        c.text = c.text.replace(/\[[\w\s\=\<\>\+\-\\!,\d\.]+\]/g, "")
        let matches = components[j].match(total);
        if (matches) {
          for (let n = 0; n < matches.length; n++) {
            if (matches[n].includes("[START]")) {
              c.start = true;
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

function drawGrid() {
  GID("grid").innerHTML = buildGrid(g.currentGrid.magnification);
  for (let i = 0; i < g.currentGrid.cellArray.length; i++) {
    try {
      GID(`${g.currentGrid.cellArray[i].coords}`).value = g.currentGrid.cellArray[i].unprocessed;
    } catch {

    }
  }
  let els = document.getElementsByClassName("inner-cell")
  for (let i = 0; i < els.length; i++) {
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
    drawGrid();
  }
}
GID("minusicon").onclick = function() {
  g.currentGrid.magnification += 1;
  if (g.currentGrid.magnification % 2 === 0) {
    g.currentGrid.magnification += 1;
  }
  drawGrid();
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
  showHide("cell-box");
}

GID("gridicon").onclick = function() {
  showHide("grid-select-box");
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

GID("generateicon").onclick = function() {
  GID("cell-box").innerHTML = "";
  for (let i = 0; i < 100; i++) {
    g.output += `<p>Generation Run ${i}:</p>`;
    generate();
    GID("cell-box").innerHTML += g.output;
    g.output = "";
  }
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

function getComponent(walker, cell) {
  let possibleComponents = [];
  for (let i = 0; i < cell.components.length; i++) {

    if (variableCheck(walker, cell.components[i])) {
      possibleComponents.push(cell.components[i])
    }
  }
  let limit = possibleComponents.length - 1
  let rand = getRandomInt(0, limit)
  //THIS IS WHERE THE PROBLEM IS - YOU ARE RANDOMLY GETTING A COMPONENT FROM CELL EVEN THOUGH CELL MAY ONLY CONTAIN ONE MATCHING COMP
  return possibleComponents[rand];
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

function filterCellsByVariables(cArr, walker) {
  //prevents cells from being called if no components on cell are consistent w/ variables
  let resArr = [];
  for (let i = 0; i < cArr.length; i++) {
    let hasPossibleComponent = false;
    let cell = cArr[i];
    for (let j = 0; j < cell.components.length; j++) {
      hasPossibleComponent = variableCheck(walker, cell.components[j])
      if (hasPossibleComponent === true) {
        j = cell.components.length + 1;
        resArr.push(cell)
      }
    }
  }
  return resArr;
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
  let generating = true;
  while (generating === true) {
    let currentCell = getCell(walker.x, walker.y);
    let possibleComponents = createPossibleComponentsArr(walker, currentCell.components);
    let currentComponent = getRandomFromArr(possibleComponents)
    addComponentTo(walker, currentComponent);
    if (currentComponent.text.includes("runGrid(")) {
      let m = currentComponent.text.match(/runGrid\((\w+)\)/)
      let lastGrid = g.currentGrid;
      let lastX = walker.x;
      let lastY = walker.y;
      let nextGrid = getGridByName(g, m[1]);
      generate(nextGrid, walker);
      g.currentGrid = lastGrid;
      walker.x = lastX;
      walker.y = lastY;
    } else {
      g.output += replaceVariable(walker, currentComponent.text);
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
}

function addComponentTo(w, comp) {
  if (comp.variables) {
    for (let i = 0; i < comp.variables.length; i++) {
      let exists = false;
      for (let j = 0; j < w.variables.length; j++) {
        if (variablesHaveSameName(w.variables[j], comp.variables[i])) {
          exists = true;
          if (isComparisonOperator(comp.variables[i].operation) === false) {
            let newValue = doMath(w.variables[j].value, comp.variables[i].operation, comp.variables[i].value)
            w.variables[j].value = newValue;
          }
        }
      }
      if (exists === false) {
        //address fact that some variables are strings.
        let o = {};
        o.name = comp.variables[i].name;
        o.value = doMath(0, comp.variables[i].operation, comp.variables[i].value)
        w.variables.push(o);
      }
    }
  }
}

function getRandomFromArr(arr) {
  return arr[getRandomInt(0, arr.length - 1)];
}

function createPossibleComponentsArr(w, c) {
  let arr = [];
  for (let i = 0; i < c.length; i++) {
    console.log(c[i]);
    if (variablesConflict(w, c[i]) === false) {
      arr.push(c[i]);
    } else {
      console.log("CONFLICT!");
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
          if (variablesConflict(w, dir.components[i]) === false) {
            conflicts = false;
          }
        }

        if (dir !== undefined && conflicts === false) {
          dArr.push(dir)
        }
      }
    }
    return dArr;
  } else {
    return [];
  }
}



function generate(grid, w) {
  //having trouble with getting grids to run.
  //working on recursion
  console.log(w);
  let lastGrid;
  if (grid) {
    lastGrid = g.currentGrid;
    g.currentGrid = grid;
  }
  let start = setStart();
  let walker = w || getWalker(start)
  walker.x = start.x;
  walker.y = start.y;
  genLoop(walker);



  if (lastGrid !== undefined) {
    g.currentGrid = lastGrid
  }

  //deal with travel
}
