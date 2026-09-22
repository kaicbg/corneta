const calls = [
  ["Atenção", "atencao.mp3", "atencao.mp4", "Toque de atenção"],
  ["Sentido", "sentido.mp3", "sentido.mp4", "Toque de formação"],
  ["Ombro arma", "ombro-arma.mp3", "ombro-arma.mp4", "Comando de arma"],
  ["Apresentar arma", "apresentar-arma.mp3", "apresentar-arma.mp4", "Comando de arma"],
  ["Descansar arma", "descansar-arma.mp3", "descansar-arma.mp4", "Comando de arma"],
  ["Descansar", "descansar.mp3", "descansar.mp4", "Toque de formação"],
  ["Cruzar arma", "cruzar-arma.mp3", "cruzar-arma.mp4", "Comando de arma"],
  ["Armar baioneta", "armar-baioneta.mp3", "armar-baioneta.mp4", "Comando de arma"],
  ["Desarmar baioneta", "desarmar-baioneta.mp3", "desarmar-baioneta.mp4", "Comando de arma"],
  ["Esquerda volver", "esquerda-volver.mp3", "esquerda-volver.mp4", "Comando de formação"],
  ["Direita volver", "direita-volver.mp3", "direita-volver.mp4", "Comando de formação"],
  ["Meia volta volver", "meia-volta-volver.mp3", "meia-volta-volver.mp4", "Comando de formação"],
  ["Voltas volver", "voltas-volver.mp3", "voltas-volver.mp4", "Comando de formação"],
  ["Oficial superior", "oficial-superior.mp3", "oficial-superior.mp4", "Honras militares"],
  ["Oficiais", "oficiais.mp3", "oficiais.mp4", "Honras militares"],
  ["Subtenente", "subtenente.mp3", "subtenente.mp4", "Honras militares"],
  ["Sargento", "sargento.mp3", "sargento.mp4", "Honras militares"],
  ["Sargenteante", "sargenteante.mp3", "sargenteante.mp4", "Honras militares"],
  ["CMT Chefe / Diretor", "cmt-chefe-diretor.mp3", "cmt-chefe-diretor.mp4", "Honras militares"],
  ["Sub Comandante", "sub-comandante.mp3", "sub-comandante.mp4", "Honras militares"],
  ["Ordinário marche", "ordinario-marche.mp3", "ordinario-marche.mp4", "Comando de marcha"],
  ["Acelerado", "acelerado.mp3", "acelerado.mp4", "Comando de marcha"],
  ["Alvorada", "alvorada.mp3", "alvorada.mp4", "Toque de rotina"],
  ["Silêncio", "silencio.mp3", "silencio.mp4", "Toque de silêncio"],
  ["Continência à Bandeira", "continencia-bandeira.mp3", "continencia-bandeira.mp4", "Cerimonial"],
  ["Cobrir", "cobrir.mp3", "cobrir.mp4", "Comando de formação"],
  ["Firme", "firme.mp3", "firme.mp4", "Comando de formação"],
  ["Alto", "alto.mp3", "alto.mp4", "Comando de formação"],
  ["A vontade", "a-vontade.mp3", "a-vontade.mp4", "Comando de formação"],
  ["Olhar à direita", "olhar-a-direita.mp3", "olhar-a-direita.mp4", "Comando de formação"],
  ["Olhar frente", "olhar-frente.mp3", "olhar-frente.mp4", "Comando de formação"],
  ["Início de expediente", "inicio-expediente.mp3", "inicio-expediente.mp4", "Toque de rotina"],
  ["Término de expediente", "termino-expediente.mp3", "termino-expediente.mp4", "Toque de rotina"],
  ["Avançar ao rancho", "avancar-ao-rancho.mp3", "avancar-ao-rancho.mp4", "Toque de rotina"],
  ["Oficial general", "oficial-general.mp3", "oficial-general.mp4", "Honras militares"],
  ["Toque do 20º BIB", "toque-20-bib.mp3", "toque-20-bib.mp4", "Toque tradicional"]
];

const $ = s => document.querySelector(s);
let played = Number(localStorage.getItem("played")||0);
let correct = Number(localStorage.getItem("correct")||0);
let streak = Number(localStorage.getItem("streak")||0);
let currentQuiz = null;
let quizAnswered = false;

function updateStats(){
  $("#played").textContent=played;
  $("#correct").textContent=correct;
  $("#streak").textContent=streak;
  localStorage.setItem("played",played);
  localStorage.setItem("correct",correct);
  localStorage.setItem("streak",streak);
}

function playCall(call){
  document.querySelectorAll("audio").forEach(a=>{a.pause();a.currentTime=0});
  const audio = new Audio("assets/audio/"+call[1]);
  audio.play().catch(()=>alert("Adicione o arquivo "+call[1]+" na pasta assets/audio para ouvir o toque."));
  played++; updateStats();
}

function render(filter=""){
  const grid=$("#calls");
  grid.innerHTML="";
  calls.filter(c=>c[0].toLowerCase().includes(filter.toLowerCase())).forEach((c,i)=>{
    const card=document.createElement("button");
    card.className="call-card";
    card.innerHTML=`<div class="thumb">
      <video muted playsinline preload="metadata" poster="assets/img/corneta-${(i%4)+1}.svg">
        <source src="assets/video/${c[2]}" type="video/mp4">
      </video>
      <span class="play">▶</span>
    </div><div class="call-info"><h3>${c[0]}</h3><p>${c[3]} • clique para ouvir</p></div>`;
    card.onclick=()=>playCall(c);
    grid.appendChild(card);
  });
}
render();
updateStats();

$("#search").addEventListener("input",e=>render(e.target.value));

function newQuiz(){
  currentQuiz=calls[Math.floor(Math.random()*calls.length)];
  quizAnswered=false;
  $("#quizStatus").textContent="Ouça e reconheça";
  $("#quizTitle").textContent="Que toque é este?";
  $("#answer").textContent="";
  playCall(currentQuiz);
  if($("#revealToggle").checked) $("#answer").textContent=currentQuiz[0];
}
$("#newQuiz").onclick=newQuiz;
$("#randomHero").onclick=newQuiz;
$("#answerBtn").onclick=()=>{
  if(!currentQuiz){$("#answer").textContent="Primeiro clique em “Novo toque”.";return}
  $("#answer").textContent=currentQuiz[0];
  if(!quizAnswered){correct++;streak++;quizAnswered=true;updateStats();}
};
$("#revealToggle").onchange=()=>{if($("#revealToggle").checked&&currentQuiz)$("#answer").textContent=currentQuiz[0]};
$("#stopAll").onclick=()=>{document.querySelectorAll("audio").forEach(a=>{a.pause();a.currentTime=0})};

$("#themeBtn").onclick=()=>{
  document.body.classList.toggle("dark");
  localStorage.setItem("dark",document.body.classList.contains("dark"));
  $("#themeBtn").textContent=document.body.classList.contains("dark")?"☀":"☾";
};
if(localStorage.getItem("dark")==="true"){document.body.classList.add("dark");$("#themeBtn").textContent="☀"}

$("#fileNames").innerHTML=calls.map(c=>`<span>${c[1]}</span>`).join("");
