"use strict";

const gitAPI = "https://api.github.com/users/";
const card = document.createElement("div");
const main = document.getElementById("main");
const input = document.getElementById("input");
const form = document.getElementById("form");

async function getUser(username) {
  const resp = await fetch(gitAPI + username);
  const respData = await resp.json();
  if (respData.message === "Not Found") {
    noUser();
  } else {
    createUserCard(respData);
    getRepos(username);
  }
}
// ===== create user card =====

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

// ===== get API and convert to json =====

async function getRepos(username) {
  const resp = await fetch(gitAPI + username + "/repos");
  const respData = await resp.json();
  addReposToCard(respData);
}

// ===== add repos to the card =====

const addReposToCard = function (repos) {
  const repoEl = document.getElementById("repos");

  repos.forEach((repo) => {
    const elem = document.createElement("a");
    elem.classList.add("link");

    elem.href = repo.html_url;
    elem.traget = "_blank";
    elem.innerText = repo.name;

    repoEl.appendChild(elem);
  });
};
// ===== no user found =====

const noUser = function () {
  const title = `<h3>User Not Found</h3>`;
  main.innerHTML = title;
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = input.value;

  if (user) {
    getUser(user);

    input.value = "";
  }
});
