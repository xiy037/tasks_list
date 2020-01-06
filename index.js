loadAll();

function loadAll() {
  let main = document.getElementById("list-container");
  let str = ``;
  axios.get("http://localhost:3007/lists").then((response) => {
    let data = response.data;
    for (let i = 0; i < data.length; i++) {
      str += `<div class="list" id=${data[i].id}  onclick="deletelistItem()">
      <div class="task-number">项目${data[i].taskNumber}</div>
      <div class="task-content">${data[i].content}</div>
      <div class="status">${data[i].status}</div>
      <div class="buttons-box"><input type="button" value="delete" class="button"></input></div>
      </div>`;
    }
    main.innerHTML += str;
    countNumber(data);
  }).catch((error) => console.log(error));
}

function deletelistItem() {
  if (event.target.type === "button") {
    event.currentTarget.remove();
    let id = event.currentTarget.id;
    axios.delete(`http://localhost:3007/lists/${id}`).then((response) => {
      console.log(response.status, response.data);
    })
  }
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