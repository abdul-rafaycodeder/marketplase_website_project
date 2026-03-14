function createCard(){

let name = document.getElementById("name").value;
let title = document.getElementById("title").value;
let image = document.getElementById("image").value;
let desc = document.getElementById("desc").value;

if(name === "" || title === "" || image === "" || desc === ""){
alert("Please fill all fields");
return;
}

let card = `
<div class="card">

<img src="${image}">

<div class="card-content">

<h3>${name}</h3>

<h4>${title}</h4>

<p>${desc}</p>

</div>

</div>
`;

document.getElementById("cardContainer").innerHTML += card;

}