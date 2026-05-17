console.log("MailFlow carregado com sucesso!");

const emails = document.querySelectorAll(".email");
const sidebarItems = document.querySelectorAll(".sidebar-item");

const toast = document.getElementById("toast");

function showToast(message){

  if(!toast) return;

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);

}

emails.forEach(email => {

  email.addEventListener("click", () => {

    emails.forEach(item => {
      item.classList.remove("active-email");
    });

    email.classList.add("active-email");

    showToast("Email aberto");

  });

});

sidebarItems.forEach(item => {

  item.addEventListener("click", () => {

    sidebarItems.forEach(side => {
      side.classList.remove("active");
    });

    item.classList.add("active");

  });

});

const loginButton = document.getElementById("loginButton");
const createAccountButton = document.getElementById("createAccountButton");
const startButton = document.getElementById("startButton");
const composeButton = document.getElementById("composeButton");

if(loginButton){

  loginButton.addEventListener("click", () => {
    window.location.href = "login.html";
  });

}

if(createAccountButton){

  createAccountButton.addEventListener("click", () => {
    window.location.href = "register.html";
  });

}

if(startButton){

  startButton.addEventListener("click", () => {
    window.location.href = "dashboard.html";
  });

}

if(composeButton){

  composeButton.addEventListener("click", () => {
    window.location.href = "compose.html";
  });

}