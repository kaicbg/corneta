const calls = [
  ["00 - Atenção", "atencao.mp3", "turma.png", "Toque de comando"],

  ["01 - Sentido", "sentido.mp3", "turma.png", "Toque de formação"],
  ["02 - Ombro arma", "ombro-arma.mp3", "turma.png", "Comando de arma"],
  ["03 - Apresentar arma", "apresentar-arma.mp3", "turma.png", "Comando de arma"],
  ["04 - Descansar arma", "descansar-arma.mp3", "turma.png", "Comando de arma"],
  ["05 - Descansar", "descansar.mp3", "turma.png", "Toque de formação"],
  ["06 - Cruzar arma", "cruzar-arma.mp3", "turma.png", "Comando de arma"],
  ["07 - Armar baioneta", "armar-baioneta.mp3", "turma.png", "Comando de arma"],
  ["08 - Desarmar baioneta", "desarmar-baioneta.mp3", "turma.png", "Comando de arma"],

  ["09 - Esquerda volver", "esquerda-volver.mp3", "turma.png", "Comando de formação"],
  ["10 - Direita volver", "direita-volver.mp3", "turma.png", "Comando de formação"],
  ["11 - Meia volta volver", "meia-volta-volver.mp3", "turma.png", "Comando de formação"],
  ["12 - Voltas volver", "voltas-volver.mp3", "turma.png", "Comando de formação"],

  ["13 - Oficial superior", "oficial-superior.mp3", "turma.png", "Honras militares"],
  ["14 - Oficiais", "oficiais.mp3", "turma.png", "Honras militares"],
  ["15 - Subtenente", "subtenente.mp3", "turma.png", "Honras militares"],
  ["16 - Sargento", "sargento.mp3", "turma.png", "Honras militares"],
  ["17 - Sargenteante", "sargenteante.mp3", "turma.png", "Honras militares"],
  ["18 - CMT Chefe / Diretor", "cmt-chefe-diretor.mp3", "turma.png", "Honras militares"],
  ["19 - Sub Comandante", "sub-comandante.mp3", "turma.png", "Honras militares"],

  ["20 - Ordinário marche", "ordinario-marche.mp3", "turma.png", "Comando de marcha"],
  ["21 - Acelerado", "acelerado.mp3", "turma.png", "Comando de marcha"],
  ["22 - Alvorada", "alvorada.mp3", "turma.png", "Toque de rotina"],
  ["23 - Silêncio", "silencio.mp3", "turma.png", "Toque de silêncio"],
  ["24 - Continência à Bandeira", "continencia-bandeira.mp3", "turma.png", "Cerimonial"],
  ["25 - Cobrir", "cobrir.mp3", "turma.png", "Comando de formação"],
  ["26 - Firme", "firme.mp3", "turma.png", "Comando de formação"],
  ["27 - Alto", "alto.mp3", "turma.png", "Comando de formação"],
  ["28 - A vontade", "a-vontade.mp3", "turma.png", "Comando de formação"],
  ["29 - Olhar à direita", "olhar-a-direita.mp3", "turma.png", "Comando de formação"],
  ["30 - Olhar frente", "olhar-frente.mp3", "turma.png", "Comando de formação"],
  ["31 - Início de expediente", "inicio-expediente.mp3", "turma.png", "Toque de rotina"],
  ["32 - Término de expediente", "termino-expediente.mp3", "turma.png", "Toque de rotina"],
  ["33 - Avançar ao rancho", "avancar-ao-rancho.mp3", "turma.png", "Toque de rotina"],
  ["34 - Oficial general", "oficial-general.mp3", "turma.png", "Honras militares"],
];

const $ = s => document.querySelector(s);

let played = Number(localStorage.getItem("played") || 0);
let correct = Number(localStorage.getItem("correct") || 0);
let streak = Number(localStorage.getItem("streak") || 0);

let currentQuiz = null;
let quizAnswered = false;
let currentAudio = null;


// ==============================
// ESTATÍSTICAS
// ==============================

function updateStats() {

  if ($("#played")) {
    $("#played").textContent = played;
  }

  if ($("#correct")) {
    $("#correct").textContent = correct;
  }

  if ($("#streak")) {
    $("#streak").textContent = streak;
  }

  localStorage.setItem("played", played);
  localStorage.setItem("correct", correct);
  localStorage.setItem("streak", streak);
}


// ==============================
// PARAR ÁUDIO
// ==============================

function stopAudio() {

  if (currentAudio) {

    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;

  }

}


// ==============================
// TOCAR TOQUE
// ==============================

function playCall(call) {

  stopAudio();

  currentAudio = new Audio(
    "assets/audio/" + call[1]
  );

  currentAudio.play().catch(() => {

    alert(
      "Não foi possível encontrar ou reproduzir o arquivo:\n\n" +
      "assets/audio/" + call[1]
    );

  });

  played++;

  updateStats();
}


// ==============================
// RENDERIZAR LISTA
// ==============================

function render(filter = "") {

  const grid = $("#calls");

  if (!grid) return;

  grid.innerHTML = "";

  const search = filter
    .toLowerCase()
    .trim();

  calls
    .filter(c =>
      c[0]
        .toLowerCase()
        .includes(search)
    )
    .forEach(c => {

      const card =
        document.createElement("button");

      card.className = "call-card";

      card.innerHTML = `

        <div class="thumb">

          <img
            src="assets/images/${c[2]}"
            alt="${c[0]}"
            loading="lazy"
          >

          <span class="play">▶</span>

        </div>

        <div class="call-info">

          <h3>${c[0]}</h3>

          <p>
            ${c[3]} • clique para ouvir
          </p>

        </div>

      `;

      card.onclick = () => playCall(c);

      grid.appendChild(card);

    });

}


// ==============================
// PESQUISA
// ==============================

const searchInput = $("#search");

if (searchInput) {

  searchInput.addEventListener(
    "input",
    e => {

      render(e.target.value);

    }
  );

}


// ==============================
// QUIZ
// ==============================

function newQuiz() {

  stopAudio();

  currentQuiz =
    calls[
      Math.floor(
        Math.random() * calls.length
      )
    ];

  quizAnswered = false;

  if ($("#quizStatus")) {

    $("#quizStatus").textContent =
      "Ouça e reconheça";

  }

  if ($("#quizTitle")) {

    $("#quizTitle").textContent =
      "Que toque é este?";

  }

  if ($("#answer")) {

    $("#answer").textContent = "";

  }

  playCall(currentQuiz);

  if (
    $("#revealToggle") &&
    $("#revealToggle").checked
  ) {

    $("#answer").textContent =
      currentQuiz[0];

  }

}


// ==============================
// BOTÃO NOVO QUIZ
// ==============================

const newQuizButton = $("#newQuiz");

if (newQuizButton) {

  newQuizButton.onclick =
    newQuiz;

}


// ==============================
// BOTÃO ALEATÓRIO
// ==============================

const randomHero = $("#randomHero");

if (randomHero) {

  randomHero.onclick =
    newQuiz;

}


// ==============================
// MOSTRAR RESPOSTA
// ==============================

const answerButton = $("#answerBtn");

if (answerButton) {

  answerButton.onclick = () => {

    if (!currentQuiz) {

      if ($("#answer")) {

        $("#answer").textContent =
          "Primeiro clique em “Novo toque”.";

      }

      return;

    }

    if ($("#answer")) {

      $("#answer").textContent =
        currentQuiz[0];

    }

    if (!quizAnswered) {

      correct++;
      streak++;
      quizAnswered = true;

      updateStats();

    }

  };

}


// ==============================
// MOSTRAR RESPOSTA AUTOMATICAMENTE
// ==============================

const revealToggle =
  $("#revealToggle");

if (revealToggle) {

  revealToggle.onchange = () => {

    if (
      revealToggle.checked &&
      currentQuiz
    ) {

      if ($("#answer")) {

        $("#answer").textContent =
          currentQuiz[0];

      }

    }

  };

}


// ==============================
// BOTÃO PARAR
// ==============================

const stopButton =
  $("#stopAll");

if (stopButton) {

  stopButton.onclick = () => {

    stopAudio();

  };

}


// ==============================
// TEMA ESCURO
// ==============================

const themeButton =
  $("#themeBtn");

if (themeButton) {

  themeButton.onclick = () => {

    document.body.classList.toggle(
      "dark"
    );

    const dark =
      document.body.classList.contains(
        "dark"
      );

    localStorage.setItem(
      "dark",
      dark
    );

    themeButton.textContent =
      dark ? "☀" : "☾";

  };

}


// ==============================
// RESTAURAR TEMA
// ==============================

if (
  localStorage.getItem("dark") === "true"
) {

  document.body.classList.add("dark");

  if (themeButton) {

    themeButton.textContent = "☀";

  }

}


// ==============================
// LISTA DE ARQUIVOS
// ==============================

const fileNames =
  $("#fileNames");

if (fileNames) {

  fileNames.innerHTML =
    calls
      .map(c =>
        `<span>${c[1]}</span>`
      )
      .join("");

}


// ==============================
// INICIALIZAÇÃO
// ==============================

render();

updateStats();


// ==============================
// INSTALAÇÃO DO APLICATIVO - PWA
// ==============================

let deferredInstallPrompt = null;

const installButton =
  $("#installBtn");

window.addEventListener(
  "beforeinstallprompt",
  event => {

    event.preventDefault();

    deferredInstallPrompt = event;

    if (installButton) {

      installButton.hidden = false;

    }

  }
);


if (installButton) {

  installButton.onclick =
    async () => {

      if (!deferredInstallPrompt)
        return;

      deferredInstallPrompt.prompt();

      const result =
        await deferredInstallPrompt.userChoice;

      console.log(
        "Resultado da instalação:",
        result.outcome
      );

      deferredInstallPrompt = null;

      installButton.hidden = true;

    };

}


window.addEventListener(
  "appinstalled",
  () => {

    console.log(
      "Aplicativo instalado."
    );

    if (installButton) {

      installButton.hidden = true;

    }

  }
);


// ==============================
// SERVICE WORKER / PWA
// ==============================

if ("serviceWorker" in navigator) {

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker
        .register(
          "./service-worker.js"
        )
        .then(() => {

          console.log(
            "Service Worker registrado com sucesso."
          );

        })
        .catch(error => {

          console.error(
            "Erro ao registrar o Service Worker:",
            error
          );

        });

    }
  );

}
