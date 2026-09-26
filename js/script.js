const calls = [
  ["00 - Atenção", "atencao.mp3", "turma.png", "Toque de comando"],
  ["01 - Sentido", "sentido.mp3", "turma.png", "Toque de formação"],
  ["02 - Ombro arma", "ombro-arma.mp3", "turma.png", "Comando de arma"],
  ["03 - Apresentar arma", "apresentar-arma.mp3", "turma.png", "Comando de arma"],
  ["04 - Descansar arma", "descansar-arma.mp3", "turma.png", "Comando de arma"],
  ["05 - Descansar", "descansar.mp3", "turma.png", "Toque de formação"],
  ["06 - Esquerda volver", "esquerda-volver.mp3", "turma.png", "Comando de formação"],
  ["07 - Direita volver", "direita-volver.mp3", "turma.png", "Comando de formação"],
  ["08 - Meia volta volver", "meia-volta-volver.mp3", "turma.png", "Comando de formação"],
  ["09 - Voltas volver", "voltas-volver.mp3", "turma.png", "Comando de formação"],
  ["10 - Oficial superior", "oficial-superior.mp3", "turma.png", "Honras militares"],
  ["11 - Oficiais", "oficiais.mp3", "turma.png", "Honras militares"],
  ["12 - CMT Chefe / Diretor", "cmt-chefe-diretor.mp3", "turma.png", "Honras militares"],
  ["13 - Sub Comandante", "sub-comandante.mp3", "turma.png", "Honras militares"],
  ["14 - Ordinário marche", "ordinario-marche.mp3", "turma.png", "Comando de marcha"],
  ["15 - Acelerado", "acelerado.mp3", "turma.png", "Comando de marcha"],
  ["16 - Alvorada", "alvorada.mp3", "turma.png", "Toque de rotina"],
  ["17 - Silêncio", "silencio.mp3", "turma.png", "Toque de silêncio"],
  ["18 - Continência à Bandeira", "continencia-bandeira.mp3", "turma.png", "Cerimonial"],
  ["19 - Cobrir", "cobrir.mp3", "turma.png", "Comando de formação"],
  ["20 - Firme", "firme.mp3", "turma.png", "Comando de formação"],
  ["21 - Alto", "alto.mp3", "turma.png", "Comando de formação"],
  ["22 - A vontade", "a-vontade.mp3", "turma.png", "Comando de formação"],
  ["23 - Olhar à direita", "olhar-a-direita.mp3", "turma.png", "Comando de formação"],
  ["24 - Olhar frente", "olhar-frente.mp3", "turma.png", "Comando de formação"],
  ["25 - Início de expediente", "inicio-expediente.mp3", "turma.png", "Toque de rotina"],
  ["26 - Término de expediente", "termino-expediente.mp3", "turma.png", "Toque de rotina"],
  ["27 - Avançar ao rancho", "avancar-ao-rancho.mp3", "turma.png", "Toque de rotina"],
  ["28 - Marcar passo", "marcar-passo.mp3", "turma.png", "Comando de marcha"],
  ["29 - Oficial general", "oficial-general.mp3", "turma.png", "Honras militares"]
];

const $ = s => document.querySelector(s);

let currentQuiz = null;
let currentAudio = null;

function stopAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

function playCall(call) {
  stopAudio();
  currentAudio = new Audio("assets/audio/" + call[1]);

  currentAudio.play().catch(() => {
    alert(
      "Não foi possível encontrar ou reproduzir o arquivo:\n\n" +
      "assets/audio/" + call[1]
    );
  });
}

function render(filter = "") {
  const grid = $("#calls");
  if (!grid) return;

  grid.innerHTML = "";
  const search = filter.toLowerCase().trim();

  calls
    .filter(c => c[0].toLowerCase().includes(search))
    .forEach(c => {
      const card = document.createElement("button");
      card.className = "call-card";
      card.type = "button";

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
          <p>${c[3]} • ouvir</p>
        </div>
      `;

      card.onclick = () => playCall(c);
      grid.appendChild(card);
    });
}

const searchInput = $("#search");
if (searchInput) {
  searchInput.addEventListener("input", e => render(e.target.value));
}

function newQuiz() {
  stopAudio();

  currentQuiz = calls[Math.floor(Math.random() * calls.length)];

  if ($("#quizStatus")) {
    $("#quizStatus").textContent = "Ouça com atenção e reconheça o toque";
  }

  if ($("#quizTitle")) {
    $("#quizTitle").textContent = "Que toque é este?";
  }

  if ($("#answer")) {
    $("#answer").textContent = "";
  }

  playCall(currentQuiz);

  if ($("#revealToggle")?.checked && $("#answer")) {
    $("#answer").textContent = currentQuiz[0];
  }
}

const newQuizButton = $("#newQuiz");
if (newQuizButton) newQuizButton.onclick = newQuiz;

// Repetir o mesmo toque do simulado sem sortear outro
const repeatQuizButton = $("#repeatQuiz");
if (repeatQuizButton) {
  repeatQuizButton.onclick = () => {
    if (!currentQuiz) {
      if ($("#answer")) {
        $("#answer").textContent = "Primeiro clique em “Novo toque”.";
      }
      return;
    }

    playCall(currentQuiz);
  };
}

const randomHero = $("#randomHero");
if (randomHero) randomHero.onclick = newQuiz;

const answerButton = $("#answerBtn");
if (answerButton) {
  answerButton.onclick = () => {
    if (!currentQuiz) {
      if ($("#answer")) {
        $("#answer").textContent = "Primeiro clique em “Novo toque”.";
      }
      return;
    }

    if ($("#answer")) {
      $("#answer").textContent = currentQuiz[0];
    }
  };
}

const revealToggle = $("#revealToggle");
if (revealToggle) {
  revealToggle.onchange = () => {
    if (revealToggle.checked && currentQuiz) {
      if ($("#answer")) $("#answer").textContent = currentQuiz[0];
    } else if (!revealToggle.checked && $("#answer")) {
      $("#answer").textContent = "";
    }
  };
}

const stopButton = $("#stopAll");
if (stopButton) stopButton.onclick = stopAudio;

const themeButton = $("#themeBtn");
if (themeButton) {
  themeButton.onclick = () => {
    document.body.classList.toggle("dark");
    const dark = document.body.classList.contains("dark");
    localStorage.setItem("dark", dark);
    themeButton.textContent = dark ? "☀" : "☾";
  };
}

if (localStorage.getItem("dark") === "true") {
  document.body.classList.add("dark");
  if (themeButton) themeButton.textContent = "☀";
}

render();

let deferredInstallPrompt = null;
const installButton = $("#installBtn");

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (installButton) installButton.hidden = false;
});

if (installButton) {
  installButton.onclick = async () => {
    if (!deferredInstallPrompt) return;

    deferredInstallPrompt.prompt();
    const result = await deferredInstallPrompt.userChoice;

    console.log("Resultado da instalação:", result.outcome);

    deferredInstallPrompt = null;
    installButton.hidden = true;
  };
}

window.addEventListener("appinstalled", () => {
  console.log("Aplicativo instalado.");
  if (installButton) installButton.hidden = true;
});

if ("serviceWorker" in navigator) {

  window.addEventListener("load", async () => {

    try {

      const registration =
        await navigator.serviceWorker.register(
          "./service-worker.js"
        );

      console.log(
        "Service Worker registrado."
      );

      // Verifica se existe uma versão nova
      registration.update();

    } catch (error) {

      console.error(
        "Erro ao registrar Service Worker:",
        error
      );

    }

  });

}
