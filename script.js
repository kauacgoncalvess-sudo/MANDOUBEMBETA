const shops=[
{name:'Padaria do João',cat:'Padaria',emoji:'🥐',rating:'4,9',distance:'0,8 km',points:'1 ponto a cada R$ 1',desc:'Pães artesanais, cafés e doces feitos todos os dias.'},
{name:'Burger House',cat:'Alimentação',emoji:'🍔',rating:'4,8',distance:'1,2 km',points:'1 ponto a cada R$ 1',desc:'Hambúrguer artesanal e combos especiais.'},
{name:'Studio Bella',cat:'Beleza',emoji:'💆',rating:'5,0',distance:'1,6 km',points:'2 pontos a cada R$ 1',desc:'Beleza, estética e cuidados para você.'},
{name:'Auto Prime',cat:'Automotivo',emoji:'🚗',rating:'4,7',distance:'2,1 km',points:'1 ponto a cada R$ 2',desc:'Serviços, acessórios e cuidados automotivos.'},
{name:'Casa & Cia',cat:'Compras',emoji:'🛍️',rating:'4,9',distance:'2,4 km',points:'1 ponto a cada R$ 1',desc:'Produtos para sua casa e presentes.'},
{name:'Conserta Fácil',cat:'Serviços',emoji:'🔧',rating:'4,8',distance:'2,8 km',points:'1 ponto a cada R$ 1',desc:'Serviços para facilitar sua rotina.'}];

const rewards=[
['☕','Café + pão de queijo','Padaria do João',300],
['🍔','Batata grátis','Burger House',500],
['💆','R$ 30 de desconto','Studio Bella',800],
['🧼','Lavagem simples','Auto Prime',1000],
['🎁','Kit surpresa','Casa & Cia',1200],
['🍰','Sobremesa grátis','Burger House',700]];

const avatars={
 explorador:{emoji:'🧑🏻‍🚀',name:'Explorador'},
 aventureira:{emoji:'👩🏻‍🦰',name:'Aventureira'},
 radical:{emoji:'🧑🏽‍🎨',name:'Radical'}
};

let pts=1280;
let selectedAvatar='explorador';

/* Login + avatar */
$('#loginBtn').onclick=()=>{
  $('#loginScreen').classList.remove('active');
  $('#avatarScreen').classList.add('active');
};
document.querySelectorAll('.avatarOption').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.avatarOption').forEach(x=>x.classList.remove('selected'));
  b.classList.add('selected');
  selectedAvatar=b.dataset.avatar;
});
$('#avatarBtn').onclick=()=>{
  $('#avatarScreen').classList.remove('active');
  $('#app').classList.remove('appHidden');
  applyAvatar();
  updateJourney();
};

const $=s=>document.querySelector(s);

function applyAvatar(){
  const a=avatars[selectedAvatar];
  $('#homeAvatar').textContent=a.emoji;
  $('#journeyAvatar').textContent=a.emoji;
  $('#profileAvatar').textContent=a.emoji;
  $('#avatarName').textContent=a.name;
}

function card(x){return `<article class="card"><div class="cover">${x.emoji}</div><div class="cardbody"><div class="cardtop"><h3>${x.name}</h3><span class="rating">★ ${x.rating}</span></div><p>${x.cat} • ${x.distance}<br>${x.desc}</p><div class="foot"><span class="points">● ${x.points}</span><button class="open" onclick="detail('${x.name}')">Ver loja</button></div></div></article>`}

function render(list=shops){
  $('#featured').innerHTML=list.slice(0,3).map(card).join('');
  $('#all').innerHTML=list.map(card).join('');
}

function renderRewards(){
  $('#rewards').innerHTML=rewards.map((r,i)=>`<article class="reward"><div class="rewardIcon">${r[0]}</div><h3>${r[1]}</h3><p>${r[2]}<br>Benefício demonstrativo do protótipo.</p><div class="rewardfoot"><b>${r[3]} pontos</b><button class="redeem" onclick="redeem(${i})">Resgatar</button></div></article>`).join('');
}

function renderIslandMap(){
  // No protótipo, estes marcos simulam uma configuração do comerciante.
  // No sistema real, serão carregados do painel do estabelecimento.
  const islands=[
    {points:0,emoji:'🏝️',name:'Começo',status:'start'},
    {points:1000,emoji:'🌴',name:'Ilha 1',status:''},
    {points:2000,emoji:'🏖️',name:'Ilha 2',status:''},
    {points:3500,emoji:'🌺',name:'Ilha 3',status:''},
    {points:5000,emoji:'🏝️',name:'Ilha 4',status:''}
  ];
  const max=5000;
  const currentIndex=islands.reduce((acc,x,i)=>pts>=x.points?i:acc,0);
  $('#islandMap').innerHTML='<div class="pathLine"></div>'+islands.map((x,i)=>{
    const unlocked=pts>=x.points;
    const current=i===currentIndex;
    return `<div class="island ${unlocked?'unlocked':'locked'} ${current?'current':''}">
      <div class="islandBubble">${x.emoji}${current?`<span class="islandAvatar">${avatars[selectedAvatar].emoji}</span>`:''}</div>
      <div class="islandLabel"><b>${x.name}</b><small>${x.points===0?'Início':x.points.toLocaleString('pt-BR')+' pontos'}</small></div>
      <span class="islandBadge">${unlocked?(current?'VOCÊ ESTÁ AQUI':'DESBLOQUEADA'):'🔒 BLOQUEADA'}</span>
    </div>`;
  }).join('');
}

function updateJourney(){
  $('#heroPoints').textContent=pts.toLocaleString('pt-BR');
  $('#points').textContent=pts.toLocaleString('pt-BR');
  $('#journeyPoints').textContent=pts.toLocaleString('pt-BR');

  const next=[1000,2000,3500,5000,7000].find(x=>x>pts);
  const previous=[0,1000,2000,3500,5000].filter(x=>x<=pts).pop()||0;
  const range=(next||previous+1000)-previous;
  const progress=next?Math.min(100,((pts-previous)/range)*100):100;
  $('#miniBar').style.width=progress+'%';
  $('#nextIsland').textContent=next?(next-pts).toLocaleString('pt-BR'):'0';
  $('#islandsUnlocked').textContent=[0,1000,2000,3500,5000].filter(x=>pts>=x).length-1;
  renderIslandMap();
}

function view(id){
  document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));
  $('#'+id).classList.add('active');
  document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('active',x.dataset.view===id));
  if(id==='recompensas') updateJourney();
  scrollTo(0,0);
}

document.addEventListener('click',e=>{
  let b=e.target.closest('[data-view]');
  if(b)view(b.dataset.view);
});

document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{
  view('explorar');$('#filter').value=b.dataset.filter;filter();
});

function filter(){
  let q=$('#exploreSearch').value.toLowerCase(),c=$('#filter').value;
  render(shops.filter(x=>(!c||x.cat===c)&&(x.name+' '+x.desc).toLowerCase().includes(q)));
}

$('#search').oninput=e=>render(shops.filter(x=>(x.name+' '+x.cat+' '+x.desc).toLowerCase().includes(e.target.value.toLowerCase())));
$('#exploreSearch').oninput=filter;
$('#filter').onchange=filter;

function detail(name){
  let x=shops.find(s=>s.name===name);
  $('#detail').innerHTML=`<div class="detail"><div class="detailcover">${x.emoji}</div><div class="detailbody"><small>${x.cat.toUpperCase()}</small><h1>${x.name}</h1><p>★ ${x.rating} • ${x.distance} • Aberto hoje</p><span class="detailpoints">● ${x.points}</span><p>${x.desc}</p><h3>Como funciona</h3><p>Faça sua compra neste estabelecimento e os pontos serão registrados na sua conta MANDOU BEM.</p><button class="open" onclick="toast('Nesta etapa, aqui entrará o catálogo do estabelecimento.')">Ver produtos e serviços</button></div></div>`;
  view('detalhe');
}

function redeem(i){
  let r=rewards[i];
  if(pts<r[3])return toast('Você ainda não tem pontos suficientes.');
  pts-=r[3];
  updateJourney();
  toast('Recompensa resgatada com sucesso!');
}

function toast(m){
  let t=$('#toast');t.textContent=m;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2500);
}

render();
renderRewards();
