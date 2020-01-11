let data = [];
loadAll();

function loadAll() {
  axios.get("http://localhost:3007/lists").then((response) => {
    data = response.data;
    listTasks(data);
    countNumber(data);
  }).catch((error) => console.log(error));
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
  for (let i = 0 ; i < array.length; i++) {
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
  let searchResult = [];
  for (let i = 0; i < data.length; i++) {
    if (isInTaskObj(data[i])) {
      searchResult.push(data[i]);
    }
  }
  listTasks(searchResult);
}

function isInTaskObj(obj) {
  let input = document.getElementById("input");
  for (x in obj) {
    if (obj[x].toString().includes(input.value)) {
      return true;
    }
  }
  return false;
}