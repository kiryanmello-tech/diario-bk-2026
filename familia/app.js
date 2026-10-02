document.querySelectorAll('[data-city],[data-day-city]').forEach(button=>button.addEventListener('click',()=>{const daily=button.hasAttribute('data-day-city'),attr=daily?'dayCity':'city',selector=daily?'[data-day-city]':'[data-city]',cards=daily?'[data-daily-city]':'[data-exp-city]',key=daily?'dailyCity':'expCity';document.querySelectorAll(selector).forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelectorAll(cards).forEach(c=>c.hidden=button.dataset[attr]!=='Todos'&&c.dataset[key]!==button.dataset[attr]);}));
// Cada experiência usa uma fotografia exclusiva, com créditos no HTML.
document.addEventListener('error',event=>{if(event.target.tagName==='IMG'){const img=event.target;img.hidden=true;const note=document.createElement('p');note.className='photo-fallback';note.textContent='Foto indisponível · '+img.alt;img.parentElement.append(note);}},true);
const video=document.querySelector('video');if(video){video.playbackRate=1.2;const label=document.createElement('label');label.className='video-speed';label.textContent='Ritmo do vídeo ';const select=document.createElement('select');select.setAttribute('aria-label','Velocidade do vídeo');[1,1.2,1.5].forEach(rate=>{const option=new Option(rate+'×',rate,rate===1.2,rate===1.2);select.add(option);});select.addEventListener('change',()=>video.playbackRate=Number(select.value));label.append(select);video.after(label);document.querySelector('#video h2').textContent='Nossa expedição em movimento';}
if(video){
 video.muted=true;video.defaultMuted=true;video.loop=true;video.playsInline=true;
 let visible=false;
 const play=()=>{const attempt=video.play();if(attempt&&typeof attempt.catch==='function')attempt.catch(()=>{video.controls=true;});};
 if(typeof IntersectionObserver!=='undefined'){
  video.pause();
  const observer=new IntersectionObserver(entries=>{for(const entry of entries){visible=entry.isIntersecting;if(visible&&!document.hidden)play();else video.pause();}},{threshold:0});
  observer.observe(video);
 }else{visible=true;play();}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else if(visible)play();});
 const sound=document.createElement('button');sound.className='video-sound';sound.type='button';sound.textContent='Ativar som';sound.setAttribute('aria-pressed','false');
 sound.addEventListener('click',()=>{video.muted=!video.muted;if(!video.muted)play();});
 video.addEventListener('volumechange',()=>{sound.textContent=video.muted?'Ativar som':'Desativar som';sound.setAttribute('aria-pressed',String(!video.muted));});
 video.after(sound);
}
const motion=document.querySelector('.motion-toggle');motion.addEventListener('click',()=>{const paused=document.body.classList.toggle('motion-paused');motion.setAttribute('aria-pressed',String(paused));motion.textContent=paused?'Retomar animações':'Pausar animações';});
document.querySelectorAll('.hd-nav a').forEach(link=>link.addEventListener('click',()=>{document.querySelectorAll('.hd-nav a').forEach(a=>a.removeAttribute('aria-current'));link.setAttribute('aria-current','location');}));
document.querySelectorAll('[data-board]').forEach(button=>button.addEventListener('click',()=>{const track=document.getElementById(button.dataset.board);const paused=track.classList.toggle('is-paused');button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',(paused?'Retomar':'Pausar')+' faixa');button.textContent=paused?'▶':'Ⅱ';}));


(function(){
 'use strict';
 const map=document.querySelector('.mission-map');if(!map)return;
 const prefers=window.matchMedia('(prefers-reduced-motion: reduce)'),fine=window.matchMedia('(hover: hover) and (pointer: fine)');
 const paused=()=>prefers.matches||document.body.classList.contains('motion-paused');
 const destinations=JSON.parse(document.getElementById('mission-destinations').textContent);
 const buttons=[...document.querySelectorAll('[data-map-stop]')],dots=[...document.querySelectorAll('[data-map-dot]')];
 let chosen=0;
 function selectDestination(index){
  if(!Number.isInteger(index)||!destinations[index])return;
  chosen=index;const place=destinations[index];
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.mapStop)===index)));
  dots.forEach(d=>{const active=Number(d.dataset.mapDot)===index;d.classList.toggle('selected',active);d.setAttribute('aria-pressed',String(active));});
  document.querySelectorAll('[data-route-to]').forEach(path=>path.classList.toggle('selected',Number(path.dataset.routeTo)===index));
  document.getElementById('destination-number').textContent=String(index+1).padStart(2,'0')+' / 07';
  document.getElementById('destination-name').textContent=place.city;
  document.getElementById('destination-dates').textContent=place.dates+' · 2026';
  const list=document.getElementById('destination-spots');list.replaceChildren(...place.spots.map(text=>{const item=document.createElement('li');item.textContent=text;return item;}));
  const panel=document.querySelector('.destination-panel');panel.classList.remove('destination-arriving');void panel.offsetWidth;panel.classList.add('destination-arriving');
 }
 buttons.forEach(b=>b.addEventListener('click',()=>selectDestination(Number(b.dataset.mapStop))));
 dots.forEach(dot=>{const choose=()=>selectDestination(Number(dot.dataset.mapDot));dot.addEventListener('click',choose);dot.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();choose();}});});
 selectDestination(0);
 document.querySelector('.map-plan-link').addEventListener('click',()=>{const city=destinations[chosen].city;const filter=[...document.querySelectorAll('[data-day-city]')].find(b=>b.dataset.dayCity===city);if(filter)filter.click();document.getElementById('plano').scrollIntoView({behavior:paused()?'auto':'smooth',block:'start'});});
 const hearts=document.querySelectorAll('.love-mark');hearts.forEach(el=>{el.innerHTML='<svg viewBox="0 0 60 60" aria-hidden="true"><path pathLength="1" d="M30 49C24 43 8 32 8 21C8 7 25 6 30 19C35 6 52 7 52 21C52 32 36 43 30 49Z"/></svg>';});
 document.querySelectorAll('.experience,.hotel,.day-card').forEach((card,i)=>{card.classList.add('holo-card');card.style.setProperty('--reveal-delay',Math.min(i%3*60,120)+'ms');});
 document.querySelectorAll('.love-note').forEach(note=>note.classList.add('cinematic-note'));
 const cards=[...document.querySelectorAll('.day-card')];
 cards.forEach((card,i)=>{const mark=document.createElement('span');mark.className='mission-day-number';mark.textContent='ETAPA '+String(i+1).padStart(2,'0');card.querySelector('.day-top').append(mark);});
 const plan=document.getElementById('plano'),grid=plan.querySelector('.day-grid');grid.classList.add('mission-timeline');
 const progress=document.createElement('div');progress.className='timeline-status';progress.innerHTML='<span class="timeline-orb"></span><span id="timeline-status-text">24 dias · role para explorar as etapas</span><span class="timeline-meter"><i></i></span>';plan.querySelector('.day-filters').after(progress);
 const targets=[...document.querySelectorAll('.holo-card,.cinematic-note,.mission-map')];
 if(typeof IntersectionObserver!=='undefined'){
  const reveal=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('motion-revealed');reveal.unobserve(entry.target);}});},{threshold:.08});targets.forEach(el=>{el.classList.add('motion-await');reveal.observe(el);});
 }
 const boardLabels=['familia-partidas','familia-descobertas','familia-hoteis'].map(id=>document.getElementById(id)?.closest('.station-board')).filter(Boolean);
 boardLabels.forEach(board=>{const status=document.createElement('span');status.className='station-switch';status.textContent='ROTA 01 / 07';board.querySelector('.station-label').append(status);});
 let boardStep=0;
 setInterval(()=>{if(paused()||document.hidden)return;boardStep=(boardStep+1)%destinations.length;boardLabels.forEach(board=>{const label=board.querySelector('.station-switch');label.textContent=destinations[boardStep].city.toUpperCase();label.classList.remove('switch-enter');void label.offsetWidth;label.classList.add('switch-enter');});},5500);
 const hero=document.querySelector('.family-hero'),heroImage=hero.querySelector('img'),heroCopy=hero.querySelector('.hero-copy'),stamp=hero.querySelector('.hero-stamp');
 let frame=0,visibleCards=new Set();
 const photos=[...document.querySelectorAll('.experience-art,.hotel-photo')];let visiblePhotos=new Set();
 if(typeof IntersectionObserver!=='undefined'){
  const near=new IntersectionObserver(entries=>{entries.forEach(e=>{const set=e.target.matches('.day-card')?visibleCards:visiblePhotos;if(e.isIntersecting){set.add(e.target);if(!e.target.matches('.day-card'))e.target.classList.add('photo-inview');}else{set.delete(e.target);e.target.classList.remove('photo-inview');}});schedule();},{rootMargin:'40px'});cards.forEach(el=>near.observe(el));photos.forEach(el=>near.observe(el));
 }else{cards.forEach(c=>visibleCards.add(c));photos.forEach(p=>visiblePhotos.add(p));}
 function scrollScene(){
  frame=0;const height=window.innerHeight;
  if(!paused()){
   const rect=hero.getBoundingClientRect();if(rect.bottom>0&&rect.top<height){const depth=Math.max(-65,Math.min(65,-rect.top*.12));heroImage.style.setProperty('--hero-depth',depth+'px');heroCopy.style.transform='translateY('+Math.max(-22,Math.min(22,rect.top*-.035))+'px)';stamp.style.transform='translateY('+Math.max(-18,Math.min(18,rect.top*-.05))+'px)';}
   visiblePhotos.forEach(el=>{const image=el.querySelector('img');if(!image)return;const rect=el.getBoundingClientRect();const journey=Math.max(-1,Math.min(1,(height*.5-rect.top-rect.height*.5)/(height*.6)));image.style.setProperty('--photo-depth',journey*24+'px');el.style.setProperty('--hud-depth',journey*-9+'px');el.style.setProperty('--photo-orbit',journey*(Number(el.style.getPropertyValue?.('--camera-direction'))||1)*1.2+'deg');});
  }
  let active=null;visibleCards.forEach(card=>{if(card.hidden)return;const rect=card.getBoundingClientRect();if(rect.top<height*.75&&rect.bottom>0){card.classList.add('day-lit');if(!active||rect.top<active.rect.top)active={card,rect};}});
  if(active){const current=cards.indexOf(active.card)+1;document.getElementById('timeline-status-text').textContent='ETAPA '+String(current).padStart(2,'0')+' / 24 · '+active.card.dataset.dailyCity;progress.querySelector('.timeline-meter i').style.width=(current/24*100)+'%';}
 }
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(scrollScene);};
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});document.querySelectorAll('[data-day-city]').forEach(b=>b.addEventListener('click',schedule));schedule();
 document.querySelectorAll('.holo-card').forEach(card=>{
  const reset=()=>{card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');card.style.setProperty('--photo-pointer-x','0px');card.style.setProperty('--photo-pointer-y','0px');card.classList.remove('touch-holo');};
  card.addEventListener('pointermove',e=>{if(paused()||!fine.matches||e.pointerType==='touch')return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.style.setProperty('--tilt-x',(2.2-y*4.4)+'deg');card.style.setProperty('--tilt-y',(x*4.4-2.2)+'deg');card.style.setProperty('--photo-pointer-x',(x-.5)*-16+'px');card.style.setProperty('--photo-pointer-y',(y-.5)*-10+'px');card.style.setProperty('--shine-x',x*100+'%');card.style.setProperty('--shine-y',y*100+'%');});
  card.addEventListener('pointerleave',reset);card.addEventListener('pointerup',reset);card.addEventListener('pointercancel',reset);
  card.addEventListener('pointerdown',e=>{if(paused())return;if(e.pointerType==='touch'){card.classList.add('touch-holo');card.style.setProperty('--tilt-x','1.5deg');}});
 });
 const svg=document.querySelector('.travel-map');
 function syncMotion(){if(paused()){svg.pauseAnimations?.();heroCopy.style.transform='';stamp.style.transform='';heroImage.style.setProperty('--hero-depth','0px');photos.forEach(el=>el.querySelector('img')?.style.setProperty('--photo-depth','0px'));document.querySelectorAll('.holo-card').forEach(el=>{el.style.setProperty('--tilt-x','0deg');el.style.setProperty('--tilt-y','0deg');});}else{svg.unpauseAnimations?.();schedule();}}
 document.querySelector('.motion-toggle').addEventListener('click',syncMotion);prefers.addEventListener('change',syncMotion);syncMotion();
})();

(function(){
 const panel=document.querySelector('.airport-panel');if(!panel)return;
 const rows=JSON.parse(document.getElementById('airport-data').textContent),host=panel.querySelector('.airport-rows'),pageLabel=panel.querySelector('.airport-page'),pause=panel.querySelector('.airport-pause');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');let page=0,held=false;const perPage=4,total=Math.ceil(rows.length/perPage);
 const inactive=()=>held||reduced.matches||document.body.classList.contains('motion-paused')||document.hidden;
 const pad=n=>String(n).padStart(2,'0');
 function nextIndex(){return rows.findIndex(r=>new Date(r.at).getTime()>Date.now());}
 function status(row,index){const next=nextIndex();if(index===next){const remaining=new Date(row.at)-Date.now();return remaining<=90*60000?'EMBARQUE PRÓXIMO':'PRÓXIMO TRECHO';}return new Date(row.at)<new Date()?'HORÁRIO PASSADO':'PROGRAMADO';}
 function flaps(text,limit){const cell=document.createElement('span');cell.className='split-flap';cell.setAttribute('aria-label',text);Array.from(text.toUpperCase().slice(0,limit)).forEach((letter,i)=>{const glyph=document.createElement('span');glyph.className='flap-letter';glyph.setAttribute('aria-hidden','true');glyph.textContent=letter===' '?'\u00a0':letter;glyph.style.setProperty('--flip-delay',(i*17)+'ms');cell.append(glyph);});return cell;}
 function render(){host.replaceChildren();const next=nextIndex();rows.slice(page*perPage,(page+1)*perPage).forEach((row,i)=>{const index=page*perPage+i,el=document.createElement('article');el.className='airport-row'+(index===next?' airport-row-next':'');const date=document.createElement('div');date.className='airport-date';const day=document.createElement('small');day.textContent=row.date;date.append(day,flaps(row.time,5));const route=document.createElement('div');route.className='airport-route';const origin=document.createElement('small');origin.textContent=row.origin+' →';route.append(origin,flaps(row.destination,38));const service=document.createElement('div');service.className='airport-service';service.append(flaps(row.service,23));const state=document.createElement('div');state.className='airport-state';state.textContent=status(row,index);el.append(date,route,service,state);host.append(el);});pageLabel.textContent='PAINEL '+pad(page+1)+' / '+pad(total)+' · '+rows.length+' TRECHOS';panel.classList.remove('airport-turn');void panel.offsetWidth;panel.classList.add('airport-turn');const n=rows[next];document.getElementById('airport-next-label').textContent=n?status(n,next):'ROTEIRO CONCLUÍDO NO CALENDÁRIO';document.getElementById('airport-next-flight').textContent=n?n.origin+' → '+n.destination+' · '+n.date+' '+n.time:'02–25 OUT 2026';}
 const advance=delta=>{page=(page+delta+total)%total;render();};
 panel.querySelector('[data-airport-prev]').addEventListener('click',()=>advance(-1));panel.querySelector('[data-airport-next]').addEventListener('click',()=>advance(1));pause.addEventListener('click',()=>{held=!held;pause.setAttribute('aria-pressed',String(held));pause.textContent=held?'Retomar painel':'Pausar painel';panel.classList.toggle('airport-held',held);});
 function clock(){panel.querySelector('.airport-clock').textContent=new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',hour:'2-digit',minute:'2-digit'}).format(new Date())+' / BRASÍLIA';}
 setInterval(()=>{if(!inactive())advance(1);},8000);setInterval(clock,30000);clock();render();
 document.querySelector('.motion-toggle').addEventListener('click',()=>panel.classList.toggle('airport-held',document.body.classList.contains('motion-paused')||held));
})();

(function(){
 'use strict';
 const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const short=date=>date.slice(8,10)+'/'+date.slice(5,7);
 const finite=value=>typeof value==='number'&&Number.isFinite(value);
 function dates(place){return place.dates.flatMap(([start,end])=>{const out=[];let date=start;while(date<=end){out.push(date);date=new Date(Date.parse(date+'T12:00:00Z')+86400000).toISOString().slice(0,10);}return out;});}
 function summarize(place,daily){
  const days=dates(place).map(date=>{const i=daily?.time?.indexOf(date)??-1;const min=daily?.temperature_2m_min?.[i],max=daily?.temperature_2m_max?.[i];return {date,min:finite(min)?min:null,max:finite(max)?max:null,rain:finite(daily?.precipitation_probability_max?.[i])?daily.precipitation_probability_max[i]:null,code:daily?.weather_code?.[i]??null,wind:finite(daily?.wind_speed_10m_max?.[i])?daily.wind_speed_10m_max[i]:null,available:finite(min)&&finite(max)};});
  const valid=days.filter(d=>d.available),rain=valid.map(d=>d.rain).filter(finite),wind=valid.map(d=>d.wind).filter(finite);
  return {days,covered:valid.length,total:days.length,min:valid.length?Math.min(...valid.map(d=>d.min)):null,max:valid.length?Math.max(...valid.map(d=>d.max)):null,rain:rain.length?Math.max(...rain):null,wind:wind.length?Math.max(...wind):null};
 }
 function condition(code){if(code===null)return ['pending','Sem previsão'];if(code>=95)return ['rain','Trovoadas'];if(code>=51)return [code>=71&&code<=77?'cloud':'rain',code>=71&&code<=77?'Neve':'Chuva'];if(code>=45)return ['cloud','Neblina'];if(code>=2)return ['cloud',code===3?'Nublado':'Sol entre nuvens'];return ['sun','Tempo aberto'];}
 const graphic=type=>'<div class="wx-scene wx-'+type+'" aria-hidden="true"><div class="wx-orbit"></div><div class="wx-sun"></div><div class="wx-cloud"></div><div class="wx-rain"><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="wx-scene-label">'+(type==='pending'?'NO HORIZONTE':'ATMOSFERA / EXPEDIÇÃO')+'</span></div>';
 function render(place,record,fetchedAt,now=new Date()){
  const age=now-new Date(fetchedAt),stale=!Number.isFinite(age)||age>48*3600000;
  const result=summarize(place,stale?null:record?.daily);
  const lead=result.days.find(d=>d.available),rainy=result.days.find(d=>d.available&&d.rain>=60);
  const [type]=condition((rainy||lead)?.code??null);
  const status=stale?'Consulta antiga · atualize':result.covered===0?'Aguardando previsão':result.covered===result.total?'Datas cobertas':'Cobertura parcial';
  const range=result.covered?Math.round(result.min)+'<span>—</span>'+Math.round(result.max)+'<small>°C</small>':'<span class="wx-soon">AINDA<br>NO HORIZONTE</span>';
  const coverage=result.covered?result.covered+' de '+result.total+' dias com temperaturas disponíveis':'As datas ainda não têm previsão disponível nesta consulta.';
  const stamp=new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',dateStyle:'short',timeStyle:'short'}).format(new Date(fetchedAt));
  return '<div class="wx-feature"><div class="wx-intro"><div class="wx-status">'+status+'</div><h3>'+esc(place.city)+'</h3><p class="wx-dates">'+esc(place.label)+' · 2026</p><div class="wx-temperature">'+range+'</div><p class="wx-range-label">'+(result.covered?'Menor mínima → maior máxima dos dias disponíveis':'Confira o contexto de época e as dicas de mala abaixo')+'</p></div>'+graphic(type)+'</div><div class="wx-metrics"><div><span>CHANCE DE CHUVA</span><strong>'+(result.rain===null?'—':result.rain+'%')+'</strong><small>Maior probabilidade diária disponível</small></div><div><span>VENTO</span><strong>'+(result.wind===null?'—':Math.round(result.wind)+'<small> km/h</small>')+'</strong><small>Maior vento médio horário previsto</small></div><div><span>COBERTURA</span><strong>'+result.covered+'<small> / '+result.total+' dias</small></strong><small>'+coverage+'</small></div></div><div class="wx-days" role="list" aria-label="Previsão nos dias da viagem">'+result.days.map(d=>{const [kind,label]=condition(d.code),distant=(Date.parse(d.date+'T12:00:00Z')-now.getTime())/86400000>7;return '<article class="wx-day '+(!d.available?'wx-missing':'')+'" role="listitem"><time datetime="'+d.date+'">'+short(d.date)+'</time><span class="wx-day-icon" aria-hidden="true">'+(!d.available?'◌':kind==='sun'?'☀':kind==='rain'?'☂':'☁')+'</span><b>'+(d.available?Math.round(d.min)+'° / '+Math.round(d.max)+'°':'Sem previsão')+'</b><span>'+(d.available?esc(label):'Aguardando dados')+'</span><small>'+(d.available&&d.rain!==null?'Chuva '+d.rain+'%':'Chuva —')+'</small><em>'+(d.available?(distant?'Tendência distante':'Previsão do modelo'):'')+'</em></article>';}).join('')+'</div><div class="wx-packing"><span aria-hidden="true">↗</span><div><h4>Vai na mala</h4><p>'+esc(place.tip)+'</p><p class="wx-season">'+esc(place.season)+(place.source?' <a href="'+esc(place.source)+'" target="_blank" rel="noopener">Contexto de época ↗</a>':'')+'</p></div></div><p class="wx-updated">Consulta: '+stamp+' (Brasília). Datas e temperaturas diárias no horário do destino. Previsão de modelo; os dias distantes são mais incertos. Não é um alerta meteorológico oficial.</p>';
 }
 if(typeof module!=='undefined'&&module.exports){module.exports={dates,summarize,render,condition};return;}
 const panel=document.querySelector('.climate-panel');if(!panel)return;
 const config=JSON.parse(document.getElementById('weather-config').textContent);
 let snapshot=JSON.parse(document.getElementById('weather-snapshot').textContent),selected=config[0].id;
 const output=document.getElementById('weather-display'),status=document.getElementById('weather-refresh-status'),refresh=document.getElementById('weather-refresh');
 function show(id){const place=config.find(p=>p.id===id);if(!place)return;selected=id;output.innerHTML=render(place,snapshot.places[id],snapshot.fetchedAt);panel.querySelectorAll('[data-weather-city]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.weatherCity===id)));document.getElementById('weather-extras').value=place.group==='Destinos'?'':id;}
 panel.querySelectorAll('[data-weather-city]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.weatherCity)));
 document.getElementById('weather-extras').addEventListener('change',event=>{if(event.target.value)show(event.target.value);});
 async function update(){refresh.disabled=true;status.textContent='Consultando previsão…';try{
  const params=new URLSearchParams({latitude:config.map(p=>p.lat).join(','),longitude:config.map(p=>p.lon).join(','),daily:'temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,wind_speed_10m_max',timezone:'auto',forecast_days:'16'});
  const response=await fetch('https://api.open-meteo.com/v1/forecast?'+params,{signal:AbortSignal.timeout(18000)});if(!response.ok)throw Error('HTTP '+response.status);
  const rows=await response.json();if(!Array.isArray(rows)||rows.length!==config.length||rows.some(r=>!r.daily?.time?.length))throw Error('Dados incompletos');
  const next={fetchedAt:new Date().toISOString(),places:{}};rows.forEach((row,i)=>next.places[config[i].id]={timezone:row.timezone,elevation:row.elevation,daily:row.daily});
  // Mountain weather uses elevation correction rather than a coastal city forecast.
  const mountain=config.find(p=>p.id==='bana');
  const mp=new URLSearchParams({latitude:mountain.lat,longitude:mountain.lon,elevation:mountain.elevation,daily:params.get('daily'),timezone:'auto',forecast_days:'16'});
  const mr=await fetch('https://api.open-meteo.com/v1/forecast?'+mp,{signal:AbortSignal.timeout(12000)});if(!mr.ok)throw Error('Montanha indisponível');const mountainRow=await mr.json();if(!mountainRow.daily?.time?.length)throw Error('Montanha sem dados');next.places.bana={timezone:mountainRow.timezone,elevation:mountainRow.elevation,daily:mountainRow.daily};
  snapshot=next;show(selected);status.textContent='Previsão consultada agora';
 }catch(error){show(selected);status.textContent='Sem atualização agora. Veja a data da última consulta abaixo.';}finally{refresh.disabled=false;}}
 refresh.addEventListener('click',update);show(selected);update();
})();
