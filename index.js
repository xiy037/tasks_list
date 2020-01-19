let data = [];
let mode = "all";
let searchResult = [];
loadAll();

function loadAll() {
  axios.get("http://localhost:3007/lists").then((response) => {
    data = response.data;
    listTasks(data);
    countNumber(data);
  }).catch((error) => console.log(error));
  addKeyboardEventHandler();
}

function listTasks(array) {
  let main = document.getElementById("list-container");
  main.innerHTML = "";
  let str = ``;
  for (let i = 0; i < array.length; i++) {
    str += `<div class="list" id=${array[i].id}  onclick="showAlert()">
    <div class="task-number">项目${array[i].taskNumber}</div>
    <div class="task-content">${array[i].content}</div>
    <div class="status">${array[i].status}</div>
    <div class="endTime">${array[i].endTime}</div>
    <div class="buttons-box"><input type="button" value="delete" class="button"></input></div>
    </div>`;
  }
  main.innerHTML += str;
}

function showAlert() {
  if (event.target.type === "button") {
    let alert = document.getElementById("alert");
    alert.style.display = "block";
    let bg = document.getElementById("filter");
    bg.style.display = "block";
    let id = event.currentTarget.id;
    alert.onclick = () => {
      if (event.target.value === "确定") {
        deletelistItem(id);
        alert.style.display = "none";
        bg.style.display = "none";
      } else if (event.target.value === "取消") {
        alert.style.display = "none";
        bg.style.display = "none";
      }
    }
  }
}
function deletelistItem(id) {
  document.getElementById(id).remove();
  axios.delete(`http://localhost:3007/lists/${id}`).then((response) => {
    console.log(response.status, response.data);
  })
  let newData = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].id != id) {
      newData.push(data[i]);
    }
  }
  data = newData;
  countNumber(data);
}

function countNumber(array) {
  let all = document.getElementById("all-counter");
  let todo = document.getElementById("todo-counter");
  let active = document.getElementById("active-counter");
  let complete = document.getElementById("complete-counter");
  let allCount = 0;
  let todoCount = 0;
  let activeCount = 0;
  let completeCount = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i].status === "complete") {
      completeCount++;
    } else if (array[i].status === "active") {
      activeCount++;
    } else if (array[i].status === "to-do") {
      todoCount++;
    }
    allCount++;
  }
  all.innerHTML = allCount;
  todo.innerHTML = todoCount;
  active.innerHTML = activeCount;
  complete.innerHTML = completeCount;
}

function searchTask() {
  searchResult = [];
  for (let i = 0; i < data.length; i++) {
    if (isInTaskObj(data[i])) {
      let newItem = JSON.parse(JSON.stringify(data[i])); //copy data[i], otherwise the data[i] will be affected
      searchResult.push(newItem);
    }
  }
  for (let i = 0; i < searchResult.length; i++) {
    for (let x in searchResult[i]) {
      let input = document.getElementById("input").value;
      let regInput = new RegExp(input, "ig");
      if (x !== "id" && searchResult[i][x].match(regInput)) {
        searchResult[i][x] = highlightValue(searchResult[i][x], input);
      }
    }
  }
  listTasks(searchResult);
  mode = "search";
  document.getElementById("input").value = "";
}

//加keyboard event handler
function addKeyboardEventHandler() {
  document.getElementById("input").onkeydown = () => {
    if (event.key === "Enter") {
      searchHTML();
    }
    if (event.key === "Backspace") {
      clearInput();
    }
  }
}


function searchHTML() {
  let input = document.getElementById("input").value;
  let regInput = new RegExp(input, "ig");
  let myNodeList = document.querySelectorAll("div");
  myNodeList.forEach((divNode) => {
    if (divNode.children.length === 0) {
      if (divNode.innerHTML.match(regInput)) {
        divNode.innerHTML = highlightValue(divNode.innerHTML, input);
      }
    }
  });
  let resultNodes = [];
  document.querySelectorAll(".highlight").forEach((element) => {
    resultNodes.push(element);
  });
  let tempNodeList = [];
  document.getElementById("down").onclick = () => {
   scrollToNext(tempNodeList, resultNodes, "down");
  }
  document.getElementById("up").onclick = () => {
    scrollToNext(tempNodeList, resultNodes, "up");
  }
  document.getElementById("search-arrow").style.display = "flex";
}

function scrollToNext(tempNodeList, resultNodes, flag) {
  let node;
  let resultLen = resultNodes.length;
  let tempLen = tempNodeList.length;
  if (flag === "down" && resultLen !== 0) {
    node = resultNodes.shift();
    node.className = "highlight2";
    if (tempLen !== 0) {
      tempNodeList[tempLen - 1].className = "highlight";
    }
    tempNodeList.push(node);
    node.scrollIntoView();
  }
  if (flag === "up" && ![0, 1].includes(tempLen)) {
    node = tempNodeList.pop();
    node.className = "highlight";
    resultNodes.unshift(node);
    tempNodeList[tempLen - 2].className = "highlight2";
    node.scrollIntoView();
  }
}

function clearInput() {
  document.getElementById("input").value = "";
  listTasks(data);
  document.getElementById("search-arrow").style.display = "none";
  document.documentElement.scrollTop = 0;
}

function isInTaskObj(obj) {
  let input = document.getElementById("input").value;
  let regInput = new RegExp(input, "ig"); //case insensitive
  for (let x in obj) {
    if (obj[x].toString().match(regInput)) {
      return true;
    }
  }
  return false;
}

function highlightValue(item, subStr) {
  let regSubStr = new RegExp(subStr, "ig");
  let newStr = `<span class="highlight">${item.match(regSubStr)[0]}</span>`;
  return item.replace(regSubStr, newStr);
}



function sortAscendingDate() {
  if (mode === "all") {
    sortDate(data);
    listTasks(data);
  } else if (mode === "search") {
    sortDate(searchResult);
    listTasks(searchResult);
  }
}

function sortDescendingDate() {
  let descendArr = []
  if (mode === "all") {
    sortDate(data);
    for (let i = data.length - 1; i >= 0; i--) {
      descendArr.push(data[i]);
    }
    listTasks(descendArr);
  } else if (mode === "search") {
    sortDate(searchResult);
    for (let i = searchResult.length - 1; i >= 0; i--) {
      descendArr.push(searchResult[i]);
    }
    listTasks(descendArr);
  }
}

function sortDate(array) {
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = i; j < array.length - 1; j++) {
      if (array[j].endTime > array[j + 1].endTime) {
        let temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }
    }
  }
}