// Initialize Firebase
var config = {
  apiKey: "AIzaSyALuwRjP3lIC5MAI9okxueI-H9wHz8oZuE",
  authDomain: "erne-library.firebaseapp.com",
  databaseURL: "https://erne-library.firebaseio.com",
  projectId: "erne-library",
  storageBucket: "erne-library.appspot.com",
  messagingSenderId: "736628134509"
};
firebase.initializeApp(config);

function Book(title, author, pages, status) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.status = status;
}

function addBookToLibrary(e) {
  let bookTitle = e.target[0].value;
  let bookAuthor = e.target[1].value;
  let bookPages = e.target[2].value;
  let readStatus = e.target[3].checked;
  let book = new Book(bookTitle, bookAuthor, bookPages, readStatus);
  firebase.database().ref().push(book);
  window.location.replace('/#');
}

function processForm(e) {
  if (e.preventDefault) e.preventDefault();
  addBookToLibrary(e);
}

var form = document.getElementById('newBookForm');
if (form.attachEvent) {
  form.attachEvent("submit", processForm);
} else {
  form.addEventListener("submit", processForm);
}

//render book cards
let library = firebase.database().ref();
library.on('child_added', snap => {
  let libraryObj = snap.val();
  let cardKey = snap.key;
  let bookCard = document.createElement("div");
  bookCard.id = cardKey;
  bookCard.className = 'book-card';
  document.querySelector(".container").appendChild(bookCard);
  let cardTL = document.createElement("div");
  cardTL.className = 'card-top-left';
  let cardT = document.createElement("div");
  cardT.className = 'card-top';
  let title = document.createElement("p");
  title.className = "title";
  title.innerText = libraryObj.title;
  cardT.appendChild(title);
  let cardL = document.createElement("div");
  cardL.className = 'card-left';
  let cardBody = document.createElement("div");
  cardBody.className = 'card-body';
  bookCard.appendChild(cardTL);
  bookCard.appendChild(cardT);
  bookCard.appendChild(cardL);
  bookCard.appendChild(cardBody);

  for (const prop in libraryObj) {
    let properties = document.createElement('p');
    if(prop !== "title"){
      properties.className = prop;
      properties.innerText = `${prop}: ${libraryObj[prop]}`;
      if (prop === "status") {
        properties.id = cardKey + "-status";
        if (libraryObj[prop] === true) {
          properties.innerText = `${prop}: read`;
        } else {
          properties.innerText = `${prop}: not read`;
          properties.classList.add("not-read");
        }
      }
    }
    cardBody.appendChild(properties);
  }
  let btn = document.createElement('button');
//   btn.id = cardKey;
  btn.id = cardKey + "-button";
  btn.innerHTML = `<i class="far fa-trash-alt"></i>`;
  cardBody.appendChild(btn);
  
  document.getElementById(btn.id).addEventListener('click', deleteCard);
  document.getElementById(cardKey + "-status").addEventListener('click', updateCard);
});

library.on('child_removed', snap => {
  let targetElement = document.getElementById(snap.key).remove();
});

library.on('child_changed', snap => {
  //console.log(snap.val().status);
  let element = document.querySelector("#" + snap.key + "-status");
  if (snap.val().status) {
    element.innerText = "status: read";
    element.classList.remove("not-read");
  } else {
    element.innerText = "status: not read";
    element.classList.add("not-read");
  }
});

function deleteCard(e) {
  if (navigator.userAgent.indexOf("Firefox") > 0) {
    firebase.database().ref(e.target.parentNode.parentNode.id).remove();
  }
  else {
      firebase.database().ref(e.target.parentNode.parentNode.parentNode.id).remove();
  }
}

function updateCard(e) {
//   console.log(e.target.parentNode.parentNode.id);
  if (e.target.innerText == 'Status: Not Read'){
    firebase.database().ref(e.target.parentNode.parentNode.id).update({status: true});
  } else {
    firebase.database().ref(e.target.parentNode.parentNode.id).update({status: false});
  }
}