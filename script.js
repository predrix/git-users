"use strict";

const gitApi = "https://api.github.com/users/";
const card = document.createElement("div");
const main = document.getElementById("main");
const input = document.getElementById("input");
const form = document.getElementById("form");

/*const getJSON = function (url, errorMsg = "Something went wrong") {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
}; */
async function getUser(username) {
  const resp = await fetch(gitApi + username);
  const respData = await resp.json();
  if (respData.message === "Not Found") {
    noUser();
  } else {
    createUserCard(respData);
    getRepos(username);
  }
}
function createUserCard(user) {
  const card = `
    <div class="card">
        <div class="avatar">
            <img src="${user.avatar_url}" alt="${user.name}" />
        </div>
        <div class="user">
            <h1>${user.name}</h1>
            <p class="about">${user.bio}</p>
            <ul>
                <li><p>followers:</p> ${user.followers}</li>
                <li><p>following:</p> ${user.following}</li>
                <li><p>repos:</p> ${user.public_repos}</li>
            </ul>
            <h2>Repositories</h2>
            <div id="repos" class="repo"></div>
        </div>
    </div>
    `;
  main.innerHTML = card;
}
async function getRepos(username) {
  const resp = await fetch(gitApi + username + "/repos");
  const respData = await resp.json();
  addReposToCard(respData);
}

function addReposToCard(repos) {
  const repoEl = document.getElementById("repos");

  repos.forEach((repo) => {
    const elem = document.createElement("a");
    elem.classList.add("link");

    elem.href = repo.html_url;
    elem.traget = "_blank";
    elem.innerText = repo.name;

    repoEl.appendChild(elem);
  });
}
function noUser() {
  const title = `<h3>User Not Found</h3>`;
  main.innerHTML = title;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = input.value;

  if (user) {
    getUser(user);

    input.value = "";
  }
});
