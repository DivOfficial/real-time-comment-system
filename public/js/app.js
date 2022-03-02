// const moment = require("moment");

let username;
let socket = io()

do {
     username = prompt("Enter Your Name");
} while (!username);

const textArea = document.querySelector('#textarea');
const postButton = document.querySelector('#submitBtn');
const commentBox = document.querySelector('.comment_box')

postButton.addEventListener('click', (e) => {
     e.preventDefault();
     let comment = textArea.value;
     if (!comment) {
          return;
     }
     postComment(comment);

})

function postComment(comment) {
     // append comment to dom-------------------------
     // console.log(comment);
     let data = {
          username: username,
          comment: comment
     }
     // console.log(data);
     appendToDom(data);
     textArea.value = ""

     // broadcast ---------------------------
     broadcastComment(data);

     // sync with db-----------
     syncWithDb(data)
}

function appendToDom(data) {
     let liTag = document.createElement('li');
     liTag.classList.add('comment', 'mb-3')

     let markup =
          `<div class="card border-light mb-3">
               <div class="card-body">
                    <h6>${data.username}</h6>
                    <p>${data.comment}</p>
                    <div>
                         <img src="/img/clock.png" alt="clock">
                         <small>${moment(data.time).format('LT')}</small>
                    </div>
               </div>
          </div>`

     liTag.innerHTML = markup
     commentBox.prepend(liTag)
}

function broadcastComment(data) {
     // socket work
     socket.emit('comment', data);
}

let timerId = null;
function debounce(func, timer) {
     if (timerId) {
          clearTimeout(timerId)
     }
     
     timerId = setTimeout(() => {
          func()
     }, timer);
}

// receiving========================

socket.on('comment', (data) => {
     appendToDom(data)
})

let typingDiv = document.querySelector('.typing')
socket.on('typing', (data) => {
     typingDiv.innerText = `${data.username} is typing...`;
     debounce(function () {
          typingDiv.innerText = ""
     }, 1000)
})



textArea.addEventListener('keyup', (e) => {
     socket.emit('typing', { username })
})

// api calls
function syncWithDb(data){
     const headers= {
          'Content-Type': 'application/json'
     }
     fetch('/api/comments', {method: 'Post', body: JSON.stringify(data),headers})
     .then(resp=>resp.json())
     .then(result=>{
          console.log(result);
     })
}

// 

function fetchComments(){
     fetch('/api/comments')
     .then(resp=>resp.json())
     .then(result=>{
          result.forEach((comment)=>{
               comment.time = comment.createdAt;
               appendToDom(comment)
          })
     })
}

window.onload = fetchComments()