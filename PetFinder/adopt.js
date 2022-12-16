const petForm = document.querySelector("#forum");

petForm.addEventListener("submit", fetchAnimals);

// gets animals from API
function fetchAnimals(e) {
  e.preventDefault();

  // Handles user Input; assigns it to variables that will be used to retrieve data
  const animal = document.querySelector("#animal").value;
  const zipcode = document.querySelector("#zipcode").value;
  const key = "Nytat2tUTuiCubN3t52DXkAVvfUULpxE9LweQc1TAaVzUBT7BM";
  const secret = "WoybZQuWXzFL29KoMQx34kc9ZrWthfyTX759PRe7";
  var token;

  // get authorization token
  fetch("https://api.petfinder.com/v2/oauth2/token", {
    method: "POST",
    body:
      "grant_type=client_credentials&client_id=" +
      key +
      "&client_secret=" +
      secret,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      token = data.access_token;
    })
    .then(() => {
      fetch(
        `https://api.petfinder.com/v2/animals?type=${animal}&location=${zipcode}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => showPets(data.animals));
    });
}

// show listings of pets
function showPets(pets) {
  const adoptablePets = document.querySelector("#adoptablePets");
  adoptablePets.innerHTML = "";

  for (let i = 0; i < pets.length; i++) {
    const pet = pets[i];
    const div = document.createElement("div");
    div.classList.add("card", "card-body", "mb-3");
    div.innerHTML = `
    <div class="row">
      <div class="col-sm-6">
        <p class="text-secondary">${pet.breeds.primary}</p>
        <p>${pet.contact.address.city}, ${pet.contact.address.state} ${
      pet.contact.address.postcode
    }</p>
        <ul class="list-group">
          <li class="list-group-item">${
            pet.contact.phone
              ? `<li class="list-group-item">Phone: ${pet.contact.phone}</li>`
              : ``
          }</li>
          ${
            pet.contact.email
              ? `<li class="list-group-item">Email: ${pet.contact.email}</li>`
              : ``
          }
          <li class="list-group-item">Shelter ID: ${pet.organization_id}</li>
        </ul>
      
      </div>
      <div class="col-sm-6">
      <img class="img-fluid mt-2" src="${
        pet.photos[0] ? pet.photos[0].medium : ""
      }">

      </div>
    </div>

  `;
    adoptablePets.appendChild(div);
  }
}
