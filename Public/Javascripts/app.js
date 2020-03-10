let state = {};

fetch("./objects.json")
  .then(function(resp) {
    return resp.json();
  })
  .then(function(data) {
    console.log(data);
    state = data.boolstate;
  });

function menutoggle() {
  if (state === false) {
    state = true;
    document.querySelector("#js-menu-dropdown").style.display = "flex";
  } else {
    state = false;
    document.querySelector("#js-menu-dropdown").style.display = "none";
  }
}
