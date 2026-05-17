const glow = document.querySelector(".background-glow");

document.addEventListener("mousemove", (e) => {

  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  glow.style.transform =
    `translate(${x * 80}px, ${y * 80}px)`;

});