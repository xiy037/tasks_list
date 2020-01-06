loadAll();

function loadAll() {
  let main = document.getElementById("list-container");
  let str = ``;
  axios.get("http://localhost:3007/lists").then((response) => {
    let data = response.data;
    for (let i = 0; i < data.length; i++) {
      str += `<div class="list" id=${data[i].id} onclick="deletelistItem()">
      <div class="task-number">项目${data[i].taskNumber}</div>
      <div class="task-content">${data[i].content}</div>
      <div class="status">${data[i].status}</div>
      <div class="buttons-box"><input type="button" value="delete" class="button"></input></div>
      </div>`;
    }
    main.innerHTML += str;
  }).catch((error) => console.log(error));
}

function deletelistItem() {
  event.currentTarget.remove();
  let id = event.currentTarget.id;
  axios.delete(`http://localhost:3007/lists/${id}`).then((response) => {
    console.log(response.status, response.data);
  })
}