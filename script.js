// const gif = require('./assets/spinner.svg')
const container = document.querySelector("#container");
const thead = document.querySelector("#thead");
const tbody = document.querySelector("#tbody");
const urlDiv = document.querySelector("#url");
const respostaDiv = document.querySelector("#resposta");
const nameDiv = document.querySelector("#name-head");
const btn = document.querySelector("button#submit");
// const spinner = document.querySelector("loading-spinner")

// let nameInput = document.querySelector('#name-input').value;

function sendRequest(event) {
  event.preventDefault();

  if (tbody.childElementCount > 1) {
    tbody.innerHTML = "";
    thead.innerHTML = "";
    urlDiv.innerHTML = "";
    respostaDiv.innerHTML = "";
    nameDiv.innerHTML = "";

    // const loadingImg = document.createElement('img');
    // spinner.appendChild(loadingImg);
    // spinner.setAttribute('src', gif)
  }

  const name = event.target["name"].value;
  const sex = event.target["sex"].value;
  const url = `https://servicodados.ibge.gov.br/api/v2/censos/nomes/${name}?sexo=${sex}`;
  console.log(name);
  console.log(sex);

  if (name.length <= 1) {
    alert("nome tem que ter no mínimo duas letras");
  }

  if (name.length > 2 && sex) {
    btn.setAttribute("disabled", true);
    fetch(url)
      .then((data) => data.json())
      .then((response) => {
        btn.removeAttribute("disabled");

        const results = response[0].res.map((obj) => obj);

        console.log(results);
        const reduced = results.reduce((acc, current) => {
          return (acc += current.frequencia);
        }, 0);

        urlDiv.textContent = url;

        const th1 = document.createElement("th");
        const th2 = document.createElement("th");
        th1.textContent = "Período";
        th2.textContent = "Quantidade";

        thead.appendChild(th1);
        thead.appendChild(th2);
        respostaDiv.innerHTML = `Há um total de ${reduced} ${captalize(name)}${
          isPlural(name) ? "" : "s"
        } no Brasil.`;
        nameDiv.textContent = captalize(name);

        results.map((item) => {
          const tr = document.createElement("tr");
          const td1 = document.createElement("td");
          const td2 = document.createElement("td");

          td1.textContent = item.periodo
            .replace("[", " ")
            .replace(",", "-")
            .replace("[", " ");
          td2.textContent = item.frequencia;

          tbody.appendChild(tr);
          tr.appendChild(td1);
          tr.appendChild(td2);
        });
      });

    function isPlural(name) {
      const nameArray = name.split("");
      return nameArray[nameArray.length - 1] === "s";
    }
    function captalize(name) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
  }
}
