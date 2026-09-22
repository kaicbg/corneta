const calls = [
  ["Alvorada","alvorada.mp3","alvorada.mp4","Toque de alvorada"],
  ["Rancho","rancho.mp3","rancho.mp4","Toque de rotina"],
  ["Silêncio","silencio.mp3","silencio.mp4","Toque de silêncio"],
  ["Revista","revista.mp3","revista.mp4","Toque de revista"],
  ["Sentido","sentido.mp3","sentido.mp4","Toque de formação"],
  ["Descansar","descansar.mp3","descansar.mp4","Toque de formação"],
  ["Atenção","atencao.mp3","atencao.mp4","Toque de comando"],
  ["Reunir","reunir.mp3","reunir.mp4","Toque de reunião"],
  ["Rancho geral","rancho-geral.mp3","rancho-geral.mp4","Rotina"],
  ["Bandeira","bandeira.mp3","bandeira.mp4","Cerimonial"],
  ["Hino à Bandeira","hino-bandeira.mp3","hino-bandeira.mp4","Cerimonial"],
  ["Parada","parada.mp3","parada.mp4","Cerimonial"]
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
