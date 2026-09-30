
(function(){
"use strict";

const DEP_ISO = "2026-10-02T20:50:00-03:00";
const DEP_DATE = "2026-10-02";

/* ======================= DADOS ======================= */
function defaults(){ return updateHotels({
v:4,

legs:[
 { id:"l-muc", city:"Munique", tag:"03–04/10 · 1 noite", color:"#fbbf24", from:"2026-10-03", to:"2026-10-04", nights:"1 noite", short:"Munique",
   arriveK:"Voo", arriveT:"GRU → MUC", arriveD:"Saída 02/10 20h50 · chegada 03/10 13h15 · decola para Xangai 04/10 12h10",
   hotel:"Hampton by Hilton Munich Airport South", hotelStatus:"ok",
   hotelD:"<b>Reservado ·</b> · S-Bahn S8 Hallbergmoos ↔ Theresienwiese (~45 min) · bilhete Gruppen-Tageskarte (zonas M-5)",
   spotsT:"Oktoberfest", chips:["Theresienwiese","Augustiner","Paulaner","Oide Wiesn","bolsa máx. 3L"],
   alertT:"Pico absoluto da festa", alertD:"03/10 é sábado, Dia da Unidade Alemã e o último sábado da Oktoberfest 2026 (19/09 a 04/10). Tenda sem reserva é impossível: elas fecham por lotação de manhã. Plano real: <b>Biergärten ao ar livre + Oide Wiesn</b>.",
   extraT:"", extraD:"" },

 { id:"l-pek", city:"Pequim", tag:"05–09/10 · 4 noites", color:"#f87171", from:"2026-10-05", to:"2026-10-09", nights:"4 noites", short:"Pequim",
   arriveK:"Chegada", arriveT:"PVG → Hongqiao → Beijing South",
   arriveD:"Pouso 05h10 · imigração até ~07h · metrô L2/DiDi até Hongqiao (~1h15) · <b>trem Fuxing ~09h</b> (~4h20) → Pequim ~13h30",
   hotel:"Live Fortuna Hotel Beijing", hotelStatus:"crit", hotelD:"<b>A reservar.</b> Golden Week (01–07/10) esgota Pequim — é a reserva mais urgente da viagem.",
   spotsT:"Muralha, história & pandas", chips:["Mutianyu + tobogã","Cidade Proibida","Tiananmen","Templo do Céu","Jingshan","Zoo (pandas)","Hutongs","Pato laqueado"],
   alertT:"O trecho mais frágil da viagem", alertD:"Pousar 05h10 e pegar trem-bala às 09h em plena Golden Week, com bilhete comprado só 15 dias antes. <b>Plano B:</b> voo PVG/SHA → PEK no mesmo dia.",
   extraT:"", extraD:"" },

 { id:"l-szx", city:"Shenzhen", tag:"09–12/10 · 3 noites", color:"#22d3ee", from:"2026-10-09", to:"2026-10-12", nights:"3 noites", short:"Shenzhen",
   arriveK:"Voo doméstico", arriveT:"PEK/PKX → SZX", arriveD:"~3h20",
   hotel:"Grand Skylight Garden", hotelStatus:"wait", hotelD:"Distrito Futian · a reservar com cancelamento grátis",
   spotsT:"Tecnologia & arte", chips:["Huaqiangbei","Lianhuashan","Show de Luzes Futian","OCT-LOFT"],
   alertT:"", alertD:"", extraT:"", extraD:"" },

 { id:"l-dad", city:"Da Nang & Hoi An", tag:"12–17/10 · 5 noites", color:"#34d399", from:"2026-10-12", to:"2026-10-17", nights:"5 noites", short:"Hoi An",
   arriveK:"Voo internacional", arriveT:"SZX → DAD", arriveD:"~2h a 3h30 · <b>entrada no Vietnã pela porta DAD</b> do eVisa",
   hotel:"RMH LE Belhamy Beach Resort", hotelStatus:"wait", hotelD:"Praia Ha My · base de descanso · a reservar",
   spotsT:"Praia, história & lanternas", chips:["Hoi An noturna","Alfaiates","My Son","Marble Mountains","Ponte do Dragão"],
   alertT:"Estação de chuvas", alertD:"Outubro é temporada de chuva no Vietnã Central, com risco de tufão. Deixe My Son e Marble Mountains com data flexível.",
   extraT:"", extraD:"" },

 { id:"l-han", city:"Hanói + Halong Bay", tag:"17–21/10 · 3+1 noites", color:"#e879f9", from:"2026-10-17", to:"2026-10-21", nights:"3+1 noites", short:"Hanói",
   arriveK:"Voo doméstico", arriveT:"DAD → HAN", arriveD:"~1h20",
   hotel:"Solaria Hotel Hanoi", hotelStatus:"wait", hotelD:"Old Quarter · a reservar",
   spotsT:"Cultura & café", chips:["Hoan Kiem","Ngoc Son","Train Street","Templo da Literatura","Prisão Hoa Lo","Egg Coffee (Giảng)","Phở · Bún Chả"],
   alertT:"", alertD:"",
   extraT:"Cruzeiro 20–21/10 · Peony / Mon Chéri",
   extraD:"<b>A fechar.</b> Van limousine Hanói → Marina Tuan Chau (~2h30) · malas de 23 kg ficam no lounge VIP, a bordo só mochila · pensão completa, caiaque, cavernas · <b>exigir o drop-off no aeroporto HAN por escrito</b>" },

 { id:"l-sha", city:"Xangai · Retorno", tag:"21–24/10 · 3 noites", color:"#a78bfa", from:"2026-10-21", to:"2026-10-24", nights:"3 noites", short:"Xangai",
   arriveK:"Logística estratégica", arriveT:"Halong → HAN → PVG",
   arriveD:"Desembarque 11h30 · van drop-off em HAN 14h30 · <b>voo direto 17h30 → PVG 21h45</b> · 2ª entrada na China abre janela nova de isenção",
   hotel:"UrCove by Hyatt West Riverside", hotelStatus:"wait", hotelD:"Jing'an · a reservar",
   spotsT:"The Bund & Pudong", chips:["The Bund","Shanghai Tower","Yu Garden","Tianzifang","Xintiandi","Templo Jing'an"],
   alertT:"", alertD:"",
   extraT:"Volta · PVG → FRA → GRU", extraD:"24/10 11h05 → FRA 17h15 / 22h05 → <b>GRU 25/10 04h50</b> · sair do hotel às 08h no máximo" }
],

flights:[
 { id:"f0",  route:"CWB → GRU", when:"02/10 · chegar até ~17h", kind:"Doméstico", note:"Conexão para o internacional das 20h50. Sem folga aqui, você perde a viagem inteira.", status:"crit", tag:"comprar já" },
 { id:"f1",  route:"GRU → MUC", when:"02/10 20h50 → 03/10 13h15", kind:"Lufthansa", note:"Stopover de ~23h na Oktoberfest", status:"ok", tag:"comprado" },
 { id:"f2",  route:"MUC → PVG", when:"04/10 12h10 → 05/10 05h10", kind:"Lufthansa", note:"1 noite em Munique confirmada — sem diária extra", status:"ok", tag:"comprado" },
 { id:"f3",  route:"Hongqiao → Pequim", when:"05/10 ~09h → ~13h30", kind:"Trem Fuxing · 12306", note:"Venda abre 15 dias antes (21/09), em horário próprio da estação — conferir no app 12306 em Meu → Serviços → Horário de venda", status:"crit", tag:"21/09" },
 { id:"f4",  route:"PEK/PKX → SZX", when:"09/10 · ~3h20", kind:"Doméstico CN", note:"Janela de compra já passou — comprar esta semana", status:"crit", tag:"atrasado" },
 { id:"f5",  route:"SZX → DAD", when:"12/10 · ~2h–3h30", kind:"Internacional", note:"Porta de entrada do eVisa: Da Nang", status:"crit", tag:"atrasado" },
 { id:"f6",  route:"DAD → HAN", when:"17/10 · ~1h20", kind:"Doméstico VN", note:"—", status:"crit", tag:"atrasado" },
 { id:"f7",  route:"HAN → PVG", when:"21/10 17h30 → 21h45", kind:"Voo direto · 3h15", note:"O mais crítico dos internos: sem ele o roteiro quebra. Van do cruzeiro entrega em HAN às 14h30", status:"crit", tag:"atrasado" },
 { id:"f8",  route:"PVG → FRA → GRU", when:"24/10 11h05 → 25/10 04h50", kind:"Lufthansa", note:"Chegada a tempo do 2º turno", status:"ok", tag:"comprado" },
 { id:"f9",  route:"GRU → CWB", when:"25/10 · depois das 04h50", kind:"Doméstico", note:"Deixar folga: bagagem despachada em voo internacional demora", status:"crit", tag:"comprar já" }
],

budget:[
 { id:"m1",  label:"Voos internacionais Lufthansa", sub:"casal · já comprado — preencha o valor real", value:0,    color:"#8b98ad", status:"ok" },
 { id:"m2",  label:"Hospedagens na Ásia", sub:"19 noites · 5 hotéis a reservar", value:0, color:"#34d399", status:"crit" },
 { id:"m3",  label:"Alimentação", sub:"restaurantes, comida de rua, cervejas e cafés", value:0, color:"#22d3ee", status:"wait" },
 { id:"m4",  label:"Voos internos da Ásia + trem-bala", sub:"4 trechos aéreos + Hongqiao → Pequim", value:0, color:"#fbbf24", status:"crit" },
 { id:"m5",  label:"Cruzeiro Halong Bay", sub:"pensão completa, cabine com varanda", value:0, color:"#e879f9", status:"crit" },
 { id:"m6",  label:"Passeios, ingressos e transporte urbano", sub:"metrô, DiDi, Grab, entradas", value:0, color:"#a78bfa", status:"wait" },
 { id:"m7",  label:"Voos CWB ⇄ GRU", sub:"casal, ida e volta · estimativa", value:0, color:"#f87171", status:"crit" },
 { id:"m8",  label:"Hotel Munique", sub:"1 diária · Hampton Airport South · reservado", value:0,  color:"#34d399", status:"ok" },
 { id:"m9",  label:"eSIM Jetpac", sub:"2 chips · 15 GB China + 10 GB Vietnã", value:0,  color:"#a78bfa", status:"wait" },
 { id:"m10", label:"eVisa Vietnã", sub:"taxa oficial · 2 pessoas", value:0,  color:"#f87171", status:"crit" },
 { id:"m11", label:"LetsVPN Platinum", sub:"1 mês", value:0,  color:"#a78bfa", status:"wait" }
],

tasks:[
 { id:"t1",  label:"Comprar voos CWB ⇄ GRU", due:"2026-09-09", done:false, sub:"Ida com folga para o internacional das 20h50; volta depois das 04h50 de 25/10" },
 { id:"t2",  label:"Reservar os 5 hotéis da Ásia com cancelamento grátis", due:"2026-09-09", done:false, sub:"Pequim primeiro — Golden Week de 01 a 07/10" },
 { id:"t3",  label:"Emitir o eVisa do Vietnã (casal)", due:"2026-09-12", done:false, sub:"evisa.gov.vn · entrada Da Nang, saída Noi Bai" },
 { id:"t4",  label:"Fechar o cruzeiro de Halong com drop-off no HAN", due:"2026-09-12", done:false, sub:"Por escrito: desembarque 11h30, entrega no aeroporto às 14h30" },
 { id:"t5",  label:"Comprar os 4 voos internos da Ásia", due:"2026-09-15", done:false, sub:"PEK→SZX · SZX→DAD · DAD→HAN · HAN→PVG (direto, 17h30)" },
 { id:"t6",  label:"Comprar o trem-bala Hongqiao → Pequim", due:"2026-09-21", done:false, sub:"Abre 15 dias antes, em horário próprio da estação — conferir no app 12306" },
 { id:"t7",  label:"Imprimir a pasta de comprovantes em papel", due:"2026-09-25", done:false, sub:"Bilhetes de saída da China + reservas de hotel, em inglês. Cobrado no check-in da cia aérea" },
 { id:"t8",  label:"Assinar e testar o LetsVPN no Brasil", due:"2026-09-28", done:false, sub:"Dentro da China não dá para baixar app de VPN" },
 { id:"t9",  label:"Instalar os eSIM Jetpac nos dois aparelhos", due:"2026-09-28", done:false, sub:"Perfil instalado e desativado; ligar só ao pousar em Munique" },
 { id:"t10", label:"Cadastrar Visa + Mastercard no Alipay e no WeChat Pay", due:"2026-09-28", done:false, sub:"Se um emissor bloquear na Ásia, o outro assume" },
 { id:"t11", label:"Comprar ingressos da Cidade Proibida", due:"2026-09-30", done:false, sub:"7 dias antes da data escolhida, à 00h00 de Pequim = 13h00 de Curitiba do dia anterior" },
 { id:"t12", label:"Conferir as etiquetas dos power banks", due:"2026-09-30", done:false, sub:"Máx. 100 Wh · só na mala de mão · etiqueta apagada = confisco no raio-X" },
 { id:"t13", label:"Avisar os bancos sobre viagem a DE, CN e VN", due:"2026-09-30", done:false, sub:"" },
 { id:"t14", label:"Baixar mapas e pacotes de idioma offline", due:"2026-10-01", done:false, sub:"Chinês e vietnamita no tradutor, Amap/Apple Maps, MetroMan" }
],

alerts:[
 { id:"a1", tone:"mint",  head:"🛂 China: agora são 240 horas, não 144",
   body:"A política vigente é a de trânsito sem visto de <b>240 horas (10 dias)</b>, e o Brasil está na lista. É o que salva o roteiro: sua 1ª entrada dura 7 dias (05 a 12/10) e estouraria o limite antigo de 144 h. A 2ª entrada, em 21/10, abre janela nova. Exige bilhete de saída para terceiro país dentro da janela — <b>confirme no consulado antes de embarcar</b>, essa política muda." },
 { id:"a2", tone:"",      head:"📄 Comprovantes em papel",
   body:"Bilhetes de saída da China e reservas de hotel <b>impressos, em inglês</b>. Quem cobra é o balcão da companhia aérea no check-in — sem eles você não embarca." },
 { id:"a3", tone:"",      head:"🪪 eVisa Vietnã: as portas têm que bater",
   body:"Entrada <b>Da Nang (DAD)</b>, saída <b>Noi Bai — Hanói (HAN)</b>. Divergência com o bilhete = embarque barrado." },
 { id:"a4", tone:"",      head:"🔋 Power banks na China",
   body:"Máx. 100 Wh (~20.000 mAh), <b>somente na mala de mão</b>, com mAh e voltagem legíveis de fábrica na carcaça. Texto apagado pelo uso = confisco no raio-X do aeroporto e da estação de trem." },
 { id:"a5", tone:"amber", head:"🍺 Oktoberfest 2026 · 19/09 a 04/10",
   body:"Você chega no <b>sábado 03/10</b> — Dia da Unidade Alemã e último fim de semana da festa. Bolsas acima de 3 L (10×20×15 cm) barradas. Malas ficam no Hampton; vá com celular e carteira." },
 { id:"a6", tone:"cyan",  head:"💳 Pagamentos redundantes",
   body:"Mínimo <b>2 cartões de bandeiras diferentes</b> (Visa + Mastercard — Nomad/Wise/tradicionais) no Alipay e no WeChat Pay. Na China quase nada aceita cartão físico." },
 { id:"a7", tone:"amber", head:"🏮 Golden Week · 01 a 07/10",
   body:"Feriado nacional chinês bate em cheio nos primeiros dias em Pequim: hotel esgotado, trem-bala vendido em minutos e Cidade Proibida à 00h00 de Pequim. O dia 08/10 é o pico do movimento de volta." },
 { id:"a8", tone:"",      head:"⚠️ Divergência não resolvida",
   body:"Havia registro de uma passagem <b>Air China com ida em 30/09</b>, comprada em agosto. Todo este painel está montado sobre a <b>Lufthansa com ida em 02/10</b> (é o que sustenta o stopover em Munique). Se o bilhete da Air China ainda estiver de pé, o roteiro inteiro escorrega e Munique some. <b>Confirmar.</b>" }
],

tech:[
 { id:"g1", head:"Conectividade (fechado)", items:[
   "<b>Jetpac eSIM China — 15 GB</b> por aparelho",
   "<b>Jetpac eSIM Vietnã — 10 GB</b> por aparelho",
   "<b>LetsVPN Platinum (mensal)</b> — bypass no Wi-Fi dos hotéis e no notebook",
   "Jetpac roteia por fora da China → dados móveis já furam o firewall (WhatsApp/Google direto)",
   "Instalar e testar tudo <b>ainda no Brasil</b>" ]},
 { id:"g2", head:"China — pagamentos & transporte", items:[
   "<b>Alipay</b> com cartão internacional vinculado",
   "<b>WeChat Pay</b> — 2º cartão de contingência",
   "<b>DiDi</b> — mini-app dentro do Alipay",
   "<b>MetroMan</b> — metrô offline (Pequim, Shenzhen, Xangai)" ]},
 { id:"g3", head:"China — navegação & tradução", items:[
   "<b>Amap / Apple Maps</b> — Google Maps não funciona direito lá",
   "<b>Google Tradutor</b> com pacote de chinês offline",
   "<b>Trip.com / 12306</b> — trem-bala e voos internos" ]},
 { id:"g4", head:"Vietnã & Alemanha", items:[
   "<b>Grab</b> — transporte e delivery no Vietnã",
   "<b>Google Tradutor</b> com vietnamita offline",
   "<b>MVV / DB Navigator</b> — S-Bahn S8 em Munique",
   "Wi-Fi dos resorts cobre o resto" ]}
]
});}


// Atualização baseada nos seis comprovantes de hotel fornecidos em 17/09/2026.
function updateHotels(state){
 if(state.hotelReceiptsVersion===1) return updateFlights(state);
 const hotels=[{"id": "l-muc", "city": "Munique", "hotel": "Hampton by Hilton Munich Airport South", "value": 0, "dates": "03–04/10 · 1 noite", "address": "Am Soldnermoos 2, Hallbergmoos, BY, 85399 Alemanha", "room": "Quarto, 1 cama Queen", "hours": "Horários não informados no recibo"}, {"id": "l-pek", "city": "Pequim", "hotel": "LiveFortuna Hotel", "value": 0, "dates": "05–09/10 · 4 noites", "address": "No. 5 Ya Bao Road Jia, Chao Yang Qu, Beijing, 100020 China", "room": "Quarto casal standard · café da manhã para 2 pessoas", "hours": "Check-in 14h · check-out 12h"}, {"id": "l-szx", "city": "Shenzhen", "hotel": "Fuqinglong Huatian Holiday Hotel", "value": 0, "dates": "09–12/10 · 3 noites", "address": "No.2030 Caitian South Road, 206, Shenzhen, saling, 518000 China", "room": "Suíte empresarial, vista para a cidade", "hours": "Check-in a partir das 14h · check-out 12h"}, {"id": "l-dad", "city": "Da Nang", "hotel": "Chicland Danang Beach Hotel", "value": 0, "dates": "12–17/10 · 5 noites", "address": "210 Vo Nguyen Giap, Son Tra, Da Nang, 550000 Vietnã", "room": "Quarto casal luxo · café da manhã incluído", "hours": "Check-in 15h–00h · check-out 12h"}, {"id": "l-han", "city": "Hanói", "hotel": "Victor Metropolis Hotel & Rooftop bar", "value": 0, "dates": "17–20/10 · 3 noites", "address": "58 Hang Gai Street, Hang Gai Ward, Hanoi, 100000 Vietnã", "room": "Quarto casal clássico (Internal window)", "hours": "Check-in a partir das 14h · check-out 12h"}, {"id": "l-sha", "city": "Xangai", "hotel": "Shanghai Elong Hotel by the Nanjing Road", "value": 0, "dates": "21–24/10 · 3 noites", "address": "Floor M, 6-11, No.595 Jiujiang rd., Shanghai, 200000 China", "room": "Quarto duplo executivo, vista para a cidade · café da manhã para 2 pessoas · minibar grátis", "hours": "Check-in a partir das 14h · check-out 14h"}];
 for(const h of hotels){
  const leg=state.legs.find(x=>x.id===h.id); if(!leg) continue;
  leg.hotel=h.hotel; leg.hotelStatus="ok";
  leg.hotelD="<b>Reservado ✓</b><br>"+h.dates+"<br>"+h.address+"<br>"+h.room+"<br>"+h.hours;
  if(h.id==='l-dad'){leg.short='Da Nang';leg.city='Da Nang & Hoi An';}
 }
 state.budget=state.budget.filter(x=>!['m2','m8'].includes(x.id)&&!x.id.startsWith('hotel-'));
 hotels.forEach(h=>state.budget.push({id:'hotel-'+h.id,label:'Hotel · '+h.city,sub:h.hotel+' · '+h.dates+' · pago (total do comprovante)',value:h.value,color:'#34d399',status:'ok'}));
 const task=state.tasks.find(x=>x.id==='t2'); if(task){task.done=true;task.label='Reservar os hotéis da Ásia';task.sub='Cinco hotéis confirmados e pagos; comprovantes conferidos em 17/09/2026. Cruzeiro separado.';}
 state.hotelReceiptsVersion=1;
 return updateFlights(state);
}


function updateFlights(state){
 if(state.flightReceiptVersion===1) return updatePlan(state);
 const notes={
 f1:{kind:'Air China · operado por Lufthansa',note:'CA6218 · reserva no app · confirmado no comprovante. Horário de chegada a Munique mantido do roteiro; não detalhado no PDF.'},
 f2:{kind:'Air China',note:'CA828 · reserva no app · chegada a PVG em 05/10 às 05h10 confirmada. Saída de Munique mantida do roteiro; não detalhada no PDF.'},
 f8:{kind:'Air China / Lufthansa',note:'CA935 + CA6251 (este operado por Lufthansa) · reserva no app · saída PVG 24/10 11h05 e chegada GRU 25/10 04h50 confirmadas. Conexão via Frankfurt mantida do roteiro; horários intermediários não detalhados no PDF.'}
 };
 for(const [id,info] of Object.entries(notes)){ const f=state.flights.find(x=>x.id===id);if(f)Object.assign(f,info,{status:'ok',tag:'comprado'});}
 const b=state.budget.find(x=>x.id==='m1');if(b)Object.assign(b,{label:'Voos internacionais · Air China / Lufthansa',sub:'Casal:+ parcelamento· total do comprovante',value:0,status:'ok'});
 state.alerts=state.alerts.filter(x=>x.id!=='a8');
 state.alerts.push({id:'flight-checkin',tone:'cyan',head:'Check-in · reserva no app',body:'Reserva confirmada: ida 02/10/2026 às 20h50 (GRU) e volta 24/10 às 11h05 (PVG). Voos CA6218 / CA828 e CA935 / CA6251. CA6218 e CA6251 operados pela Lufthansa. Consulte a companhia operadora para abertura e procedimento de check-in; o comprovante não informa o prazo. Use a referência ; se não reconhecida, solicite o localizador da operadora.'});
 state.alerts.push({id:'flight-tickets',tone:'cyan',head:'E-tickets · casal',body:'Barbara Nogueira de Sousa: <b>9995232359333</b><br>Kiryan Mello: <b>9995232359332</b><br>Dados dos e-tickets fornecidos pelo viajante.'});
 state.alerts.push({id:'flight-baggage',tone:'mint',head:'Bagagem · conforme comprovante',body:'Por sentido, para o casal: 2 itens pessoais, 2 bagagens de mão (20 × 40 × 55 cm, até 5 kg cada) e 2 malas despachadas (até 23 kg cada). Assentos registrados: ida 57L / 57K; volta 59L / 59K. O PDF não identifica a qual trecho pertencem; há também trechos sem assento selecionado.'});
 state.flightReceiptVersion=1;return updatePlan(state);
}


function updateCostDetails(state){
 if(state.costDetailsVersion===1)return updateSpTransfer(state);
 const group=state.budget.find(x=>x.id==='m4');
 if(group){group.value=Math.max(0,Math.round(((Number(group.value)||0)-1500)*100)/100);group.label='DAD→HAN + HAN→PVG · saldo antigo a revisar';group.sub='Valor residual da previsão original, NÃO cotação dos dois voos. Orçamento insuficiente: atualizar após pesquisa/compra.';group.status='crit';}
 if(!state.budget.some(x=>x.id==='flight-pek-szx'))state.budget.push({id:'flight-pek-szx',label:'Pequim → Shenzhen · cotação informada',sub:'09/10 · casal ·informado pelo viajante; não é compra confirmada. Conferir bagagem.',value:0,status:'wait',color:'#fbbf24'});
 if(!state.alerts.some(x=>x.id==='budget-review'))state.alerts.push({id:'budget-review',tone:'amber',head:'Budget: total ainda subestimado',body:'Trem; HKG→DAD; GRU→CWBregistrados conforme print. PEK→SZXé cotação. No orçamento original, sobram apenaspara DAD→HAN + HAN→PVG: NÃO representa o custo esperado desses voos. Transfers ainda sem cotação e revisão de passeios não estão incorporados.'});
 state.costDetailsVersion=1;return updateSpTransfer(state);
}

function updateSpTransfer(state){
 if(state.spTransferVersion===1)return updatePekSzx(state);
 const find=(k,id)=>(state[k]||[]).find(x=>x.id===id);
 const set=(k,id,f)=>{const it=find(k,id);if(it)Object.assign(it,f);};
 const tips='<b>Plano CGH → GRU (Uber):</b> 1) check-in online da Lufthansa na véspera; 2) chamar o Uber enquanto esperam as malas na esteira; 3) pedir para ir pela Marginal Tietê direto ao Terminal 3.';
 set('alerts','cgh-gru',{tone:'',head:'02/10: Congonhas → Guarulhos de Uber',body:'LA3193 pousa em Congonhas 16h15; internacional em Guarulhos 20h50. Despacho Lufthansa fecha 19h50. Trajeto de sexta à tarde: 1h–1h45; meta Terminal 3 entre 18h e 18h30. '+tips});
 set('flights','f0',{note:'reserva no app · casal · pago. Chega em Congonhas; segue de Uber para GRU (Marginal Tietê → Terminal 3). Corrigir documento do Kiryan na reserva (aparece 00000000).'});
 set('budget','transfer-sp',{label:'Transfer CGH → GRU · Uber na hora',sub:'Decidido em 24/09: Uber saindo de Congonhas. Valor pago no dia.'});
 set('tasks','t1',{label:'Revisar conexão de volta GRU → CWB (só 1h30)',sub:'Ida resolvida: Uber CGH→GRU. Volta: Azul AD4826 GRU 06h20 após internacional 04h50 — avaliar troca para voo depois das 08h.'});
 if(!find('tasks','t-lh-checkin'))state.tasks.push({id:'t-lh-checkin',label:'Check-in online Lufthansa (véspera, 01/10)',due:'2026-10-01',done:false,sub:'Agiliza o despacho em GRU; despacho fecha 19h50 do dia 02/10.'});
 set('tasks','t3',{done:true,sub:'eVisa emitido (confirmado em 24/09). Entrada Da Nang, saída Noi Bai.'});
 set('budget','m10',{status:'ok'});
 set('tasks','t6',{done:true,label:'Trem Xangai → Pequim comprado',sub:'05/10 Shanghai Hongqiao 11h00 → Beijingnan 15h31 · casal(confirmado em 24/09).'});
 set('budget','train-shanghai-beijing',{status:'ok'});
 set('budget','flight-hkg-dad',{status:'ok',sub:'Casal · UO558 · comprado (confirmado em 24/09).'});
 set('tasks','t-transfer-hkg',{label:'Reservar transfer Shenzhen → HKG',sub:'12/10 voo UO558 16h30 já comprado; chegar ao HKG ~13h30 com margem para fronteira.'});
 set('tasks','t5',{sub:'Faltam PEK/PKX→SZX, DAD→HAN e HAN→PVG. HKG→DAD UO558 comprado.'});
 state.spTransferVersion=1;return updatePekSzx(state);
}

function updatePekSzx(state){
 if(state.pekSzxVersion===1)return updateDadHan(state);
 const find=(k,id)=>(state[k]||[]).find(x=>x.id===id);
 const set=(k,id,f)=>{const it=find(k,id);if(it)Object.assign(it,f);};
 set('flights','f4',{route:'PEK T3 → SZX T3',when:'09/10 16h15 → 19h40',kind:'Air China CA1337 · Boeing 777-300 · refeição',note:'Comprado em 24/09 · casal ·(Visa). Sair do hotel ~13h15; chegar ao PEK T3 até 14h15.',status:'ok',tag:'comprado'});
 set('budget','flight-pek-szx',{label:'Pequim → Shenzhen · Air China CA1337',sub:'09/10 · casal ·no Visa (tarifa, taxa de aviação, combustível e IOF).',value:0,status:'ok'});
 set('legs','l-szx',{arriveT:'PEK T3 → SZX T3 · Air China CA1337',arriveD:'09/10 · 16h15 → 19h40 · check-in no Fuqinglong Huatian por volta de 21h.'});
 set('tasks','t5',{sub:'Faltam DAD→HAN e HAN→PVG. Comprados: PEK→SZX CA1337 e HKG→DAD UO558.'});
 const al=find('alerts','budget-review');if(al)al.body=al.body.replace('PEK→SZXé cotação.','PEK→SZX(CA1337).');
 state.pekSzxVersion=1;return updateDadHan(state);
}

function updateDadHan(state){
 if(state.dadHanVersion===1)return updateHkMetro(state);
 const find=(k,id)=>(state[k]||[]).find(x=>x.id===id);
 const set=(k,id,f)=>{const it=find(k,id);if(it)Object.assign(it,f);};
 set('flights','f6',{route:'DAD T1 → HAN T1',when:'17/10 14h30 → 15h50',kind:'Doméstico VN · 1h20',note:'Comprado em 24/09 · casal · item pessoal, mala de mão e mala despachada inclusos. Sair do Chicland ~12h45.',status:'ok',tag:'comprado'});
 const g=find('budget','m4');
 if(g){g.value=Math.max(0,Math.round(((Number(g.value)||0)-388.94)*100)/100);g.label='HAN → PVG · saldo antigo a revisar';g.sub='Único voo da Ásia ainda sem compra (21/10, sugerido CA756 18h15). Valor residual da previsão original, não cotação.';}
 if(!find('budget','flight-dad-han'))state.budget.push({id:'flight-dad-han',label:'Da Nang → Hanói',sub:'17/10 14h30–15h50 · casal · bagagens incluídas.',value:0,status:'ok',color:'#34d399'});
 set('legs','l-han',{arriveT:'DAD T1 → HAN T1',arriveD:'17/10 · 14h30 → 15h50 · Victor Metropolis por volta de 17h.'});
 set('tasks','t5',{sub:'Falta só HAN→PVG (21/10) — sugerido Air China CA756 18h15, junto com o cruzeiro e transfer privativo porto → Noi Bai. Comprados: PEK→SZX, HKG→DAD e DAD→HAN.'});
 state.dadHanVersion=1;return updateHkMetro(state);
}

function updateHkMetro(state){
 if(state.hkMetroVersion===1)return updateCruise(state);
 const find=(k,id)=>(state[k]||[]).find(x=>x.id===id);
 const set=(k,id,f)=>{const it=find(k,id);if(it)Object.assign(it,f);};
 const plan='09h30 metrô até Futian Port (linhas 4/10) → fronteira a pé → MTR East Rail Lok Ma Chau → Admiralty → Central. Almoço no Tim Ho Wan da Hong Kong Station e Airport Express (24 min) → HKG ~14h. Voo UO558 16h30.';
 set('legs','l-szx',{extraT:'12/10 · Shenzhen → Hong Kong de metrô',extraD:plan});
 set('budget','transfer-hkg',{label:'Shenzhen → aeroporto HKG · metrô + Airport Express',sub:'Decidido em 26/09: metrô + fronteira a pé + MTR + Airport Express. Valor pago no dia.'});
 set('tasks','t-transfer-hkg',{done:true,label:'Shenzhen → HKG definido: metrô + MTR + Airport Express',sub:plan});
 state.hkMetroVersion=1;return updateCruise(state);
}

function updateCruise(state){
 if(state.cruiseVersion===1)return updateAllTickets(state);
 const find=(k,id)=>(state[k]||[]).find(x=>x.id===id);
 const set=(k,id,f)=>{const it=find(k,id);if(it)Object.assign(it,f);};
 const info='<b>Verdure Lotus Classic Cruise · Lan Ha Bay</b> · reservado e pago, 1 cabine, 1 noite). Embarque 20/10 11h30–12h00 no Píer/Lô 28A, Tuan Chau. Check-out da cabine 21/10 09h00–09h30. Contato: +84 84 796 708 486 · verdurelotus.3wesled58zr30rt@htlpartner.trip.com. <b>A confirmar por escrito:</b> van Hanói → Tuan Chau em 20/10 e carro direto Tuan Chau → aeroporto Noi Bai em 21/10.';
 set('legs','l-han',{extraT:'Cruzeiro 20–21/10 · Verdure Lotus Classic',extraD:info});
 set('budget','m5',{label:'Cruzeiro Halong · Verdure Lotus Classic',sub:'Lan Ha Bay · 20–21/10 · pago(incluide impostos). Transfers a confirmar.',value:0,status:'ok'});
 set('tasks','t4',{done:true,label:'Cruzeiro Halong reservado: Verdure Lotus Classic',sub:'Pago. Embarque 20/10 11h30 em Tuan Chau; check-out 21/10 09h00–09h30.'});
 if(!find('tasks','t-cruise-transfer'))state.tasks.push({id:'t-cruise-transfer',label:'Confirmar transfers do cruzeiro (Hanói → porto e porto → aeroporto HAN)',due:'2026-09-30',done:false,sub:'Pedir por escrito: van de ida em 20/10 no Victor Metropolis e carro/van direto a Noi Bai em 21/10, com horário de desembarque.'});
 set('tasks','t5',{sub:'Falta só HAN→PVG (21/10). Com cruzeiro confirmado (check-out 09h–09h30): comprar Air China CA756 18h15.'});
 set('flights','f7',{when:'21/10 · comprar CA756 18h15',note:'Cruzeiro fechado: desembarque ~10h30–11h em Tuan Chau → Noi Bai ~13h30–14h. Voo ainda NÃO comprado.'});
 set('legs','l-sha',{arriveT:'Halong → HAN → PVG',arriveD:'21/10 · desembarque em Tuan Chau ~10h30–11h · carro até Noi Bai (~2h30) · voo sugerido Air China CA756 18h15 → PVG ~22h50 (a comprar).'});
 state.cruiseVersion=1;return updateAllTickets(state);
}

function updateAllTickets(state){
 if(state.allTicketsVersion===1)return updatePalace(state);
 const find=(k,id)=>(state[k]||[]).find(x=>x.id===id);
 const set=(k,id,f)=>{const it=find(k,id);if(it)Object.assign(it,f);};
 set('flights','f7',{route:'HAN T2 → PVG',when:'21/10 18h15 → 22h25',kind:'Air China CA756',note:'Comprado em 29/09 · casal · Trip.com (emitindo). Chegar a Noi Bai ~14h.',status:'ok',tag:'comprado'});
 const g=find('budget','m4');if(g){g.value=0;g.label='Voos da Ásia · previsão antiga zerada';g.sub='Todos os voos internos comprados; valores reais nas linhas próprias.';g.status='ok';}
 if(!find('budget','flight-han-pvg'))state.budget.push({id:'flight-han-pvg',label:'Hanói → Xangai · Air China CA756',sub:'21/10 18h15–22h25 · casal ·.',value:0,status:'ok',color:'#34d399'});
 set('budget','flight-pek-szx',{value:0,sub:'09/10 · casal ·conforme Trip.com .'});
 set('flights','f4',{note:'Comprado · casal · Trip.com. Sair do hotel ~13h15; chegar ao PEK T3 até 14h15.'});
 set('tasks','t5',{done:true,label:'Todos os voos internos da Ásia comprados',sub:'PEK→SZX CA1337 · HKG→DAD UO558 · DAD→HAN 9G924 · HAN→PVG CA756.'});
 set('tasks','t-pandas',{done:true,label:'Ingresso zoo + Casa dos Pandas 07/10 (confirmando)',sub:'Trip.com · status "confirmando". Conferir se são 2 ingressos (casal).'});
 set('tasks','t6',{sub:'05/10 Hongqiao 11h00 → Beijingnan 15h31 · casal· Trip.com.'});
 set('legs','l-sha',{arriveD:'21/10 · desembarque em Tuan Chau ~10h30–11h · carro até Noi Bai (~2h30) · Air China CA756 18h15 → PVG 22h25 (comprado) · táxi/DiDi ao hotel.'});
 if(!find('budget','pandas'))state.budget.push({id:'pandas',label:'Zoo de Pequim + Casa dos Pandas',sub:'07/10 · confirmar se cobre o casal.',value:0,status:'ok',color:'#34d399'});
 state.allTicketsVersion=1;return updatePalace(state);
}

function updatePalace(state){
 if(state.palaceVersion===1)return updateVisaSplit(state);
 const find=(k,id)=>(state[k]||[]).find(x=>x.id===id);
 const set=(k,id,f)=>{const it=find(k,id);if(it)Object.assign(it,f);};
 set('tasks','t11',{done:true,label:'Cidade Proibida 06/10 reservada',sub:'pedido no e-mail · ¥160 (2 entradas + Relógios + Tesouro + expo Tang/Song). PAGAR no guichê do Visitor Service Center (oeste da Praça Duanmen) com os passaportes originais. Validar até 12h.'});
 if(!find('budget','palace'))state.budget.push({id:'palace',label:'Cidade Proibida · 2 pessoas',sub:'¥160 · pagar no guichê em 06/10 com passaporte.',value:0,status:'wait',color:'#fbbf24'});
 set('tasks','t-mutianyu',{label:'Comprar Mutianyu 08/10 (ingresso + transfer)',sub:'NÃO encontrado nas reservas em 29/09. Comprar já: ingresso + ônibus/teleférico, ou tour com busca no hotel.'});
 state.palaceVersion=1;return updateVisaSplit(state);
}

function updateVisaSplit(state){
 if(state.visaSplitVersion===1)return updateBudget0929(state);
 const find=(k,id)=>(state[k]||[]).find(x=>x.id===id);
 const set=(k,id,f)=>{const it=find(k,id);if(it)Object.assign(it,f);};
 set('tasks','t3',{done:false,label:'eVisa Vietnã: Kiryan ✅ · Bárbara pendente',sub:'Kiryan: , válido 11/10–23/10/2026, entrada única (arquivo em Desktop\\CHINA\\Documentos). Bárbara: previsto para 30/09 — imprimir os dois.'});
 set('budget','m10',{sub:'Kiryan pagoem 24/09 · Bárbara em andamento',status:'wait'});
 state.visaSplitVersion=1;return updateBudget0929(state);
}

function updateBudget0929(state){
 if(state.budget0929Version===1)return updateGaps(state);
 const find=(k,id)=>(state[k]||[]).find(x=>x.id===id);
 const set=(k,id,f)=>{const it=find(k,id);if(it)Object.assign(it,f);};
 const add=(o)=>{if(!find('budget',o.id))state.budget.push(o);else set('budget',o.id,o);};
 /* câmbio de referência 29/09/2026: ¥1 · */
 set('budget','train-shanghai-beijing',{sub:'05/10 11h00–15h31 · casal · Trip.com.'});
 set('budget','m10',{value:0,status:'wait',sub:'Kiryan pago em 24/09· Bárbara, sai em 30/09.'});
 set('budget','palace',{value:0,sub:'¥160 (2 entradas + Relógios + Tesouro)· pagar no guichê em 06/10 com passaporte.'});
 set('budget','transfer-sp',{value:0,sub:'Uber Congonhas → Guarulhos T3 em 02/10 · estimativa'});
 set('budget','transfer-hkg',{value:0,sub:'Metrô + MTR + Airport Express · estimativa casal'});
 add({id:'mutianyu',label:'Muralha de Mutianyu · ingresso + teleférico/tobogã + transfer',sub:'08/10 · AINDA NÃO COMPRADO · estimativa de tour com busca no hotel.',value:0,status:'wait',color:'#f87171'});
 add({id:'van-halong',label:'Van Hanói → Tuan Chau',sub:'20/10 · van executiva· a reservar ·.',value:0,status:'wait',color:'#fbbf24'});
 add({id:'car-noibai',label:'Carro Tuan Chau → aeroporto Noi Bai',sub:'21/10 · carro privativo· a reservar ·',value:0,status:'wait',color:'#fbbf24'});
 state.budget0929Version=1;return updateGaps(state);
}

function updateGaps(state){
 if(state.gapsVersion===1)return updateBagHk(state);
 const find=(k,id)=>(state[k]||[]).find(x=>x.id===id);
 const set=(k,id,f)=>{const it=find(k,id);if(it)Object.assign(it,f);};
 const add=(o)=>{if(!find('budget',o.id))state.budget.push(o);else set('budget',o.id,o);};
 set('budget','m6',{label:'Outros ingressos e transporte urbano',value:0,status:'wait',sub:'Reestimado em 29/09: entradas: Templo do Céu, Hoi An, aula de culinária, My Son, marionetes, observatório, Maglev) + transfers de aeroporto/estação + metrô/DiDi/Grab/dia.'});
 add({id:'shopping',label:'Reserva para compras',sub:'NÃO estava no orçamento original. Sugestão: eletrônicos em Shenzhen, alfaiataria em Hoi An, mercados e lembranças. Ajuste o valor.',value:0,status:'wait',color:'#f472b6'});
 add({id:'insurance',label:'Seguro viagem',sub:'NÃO previsto. Estimativa casal 23 dias. Zerar se o cartão (ex.: Visa Infinite/Mastercard Black) já cobre — confirmar a apólice.',value:0,status:'wait',color:'#f87171'});
 add({id:'iof',label:'IOF 3,5% + spread do câmbio',sub:'NÃO previsto. ~5% sobremil de gastos no exterior (comida, passeios, compras). Menor com conta global/Wise/Nomad.',value:0,status:'wait',color:'#f87171'});
 add({id:'tips',label:'Gorjetas',sub:'NÃO previsto. Tripulação do cruzeiro, motoristas, guias, garçons em Munique.',value:0,status:'wait',color:'#fbbf24'});
 add({id:'bag-hk',label:'Risco: mala despachada HK Express',sub:'UO558: tarifas Ultra Lite/Lite não incluem mala (só 7 kg). Conferir na reserva; se não tiver, comprar online antes (no aeroporto é mais caro). Zerar se já incluída.',value:0,status:'wait',color:'#f87171'});
 const cats={m1:'intl','hotel-l-muc':'hotel','hotel-l-pek':'hotel','hotel-l-szx':'hotel','hotel-l-dad':'hotel','hotel-l-han':'hotel','hotel-l-sha':'hotel','train-shanghai-beijing':'asia','flight-pek-szx':'asia','flight-hkg-dad':'asia','flight-dad-han':'asia','flight-han-pvg':'asia','transfer-hkg':'asia',m4:'asia',m7:'br','return-cwb':'br','transfer-sp':'br',m5:'cruise','van-halong':'cruise','car-noibai':'cruise',m6:'tours',palace:'tours',pandas:'tours',mutianyu:'tours',m3:'food',m9:'docs',m10:'docs',m11:'docs',shopping:'new',insurance:'new',iof:'new',tips:'new','bag-hk':'new'};
 state.budget.forEach(b=>{if(cats[b.id])b.cat=cats[b.id];});
 state.gapsVersion=1;return updateBagHk(state);
}

function updateBagHk(state){
 if(state.bagHkVersion===1)return updateBanaHills(state);
 const it=(state.budget||[]).find(x=>x.id==='bag-hk');
 if(it)Object.assign(it,{label:'Bagagem HK Express · incluída',value:0,status:'ok',color:'#34d399',sub:'Conferido em 29/09: 1 mala de 32 kg despachada por pessoa incluída. Mão: 7 kg NO TOTAL (mala 56×36×23 + item pessoal 40×25×20).'});
 const f=(state.flights||[]).find(x=>x.id==='f5');
 if(f&&f.note&&f.note.indexOf('32 kg')<0)f.note+=' · Mala 32 kg incluída; mão 7 kg no total.';
 state.bagHkVersion=1;return updateBanaHills(state);
}

function updateBanaHills(state){
 if(state.banaVersion===1)return state;
 const it=(state.budget||[]).find(x=>x.id==='m6');
 if(it)Object.assign(it,{value:0,sub:'Reestimado: entradas: Templo do Céu, Hoi An, aula de culinária, marionetes, observatório, Maglev, UCCA) + transfers de aeroporto/estação + metrô/DiDi/Grab/dia. Ba Na Hills em linha própria.'});
 if(!(state.budget||[]).find(x=>x.id==='bana'))state.budget.push({id:'bana',cat:'tours',label:'Ba Na Hills · 15/10',sub:'Teleférico + Grab ida e volta + almoço buffet opcional. Substitui My Son.',value:0,status:'wait',color:'#fbbf24'});
 if(!(state.tasks||[]).find(x=>x.id==='t-bana'))state.tasks.push({id:'t-bana',label:'Comprar Ba Na Hills online (15/10)',due:'2026-10-10',done:false,sub:'Online saimais barato por pessoa. Olhar a previsão na véspera: com neblina/chuva forte, trocar com 14 ou 16/10.'});
 state.banaVersion=1;return state;
}

function updateSeptemberReceipts(state){
 if(state.septemberReceiptsVersion===1)return updateCostDetails(state);
 const set=(arr,id,data)=>{const x=state[arr].find(x=>x.id===id);if(x)Object.assign(x,data);};
 set('flights','f3',{route:'Shanghai Hongqiao → Beijingnan (Pequim Sul)',when:'05/10 11h00 → 15h31',kind:'Trem-bala · 4h31',note:'2 passageiros ·no print. Número do trem, assentos e status de emissão não aparecem no recorte.',status:'wait',tag:'reserva no app'});
 set('flights','f5',{route:'HKG → DAD',when:'12/10 16h30 → 17h25',kind:'HK Express · UO558',note:'2 passageiros ·. Print: emitindo as passagens. Saída de Hong Kong exige transfer desde Shenzhen. Horários locais; bagagem não informada neste recorte.',status:'wait',tag:'em emissão'});
 set('flights','f9',{route:'GRU → CWB',when:'25/10 06h20 → 07h20',kind:'Azul · AD4826',note:'2 passageiros · passagem emitida no print. Apenas 1h30 após chegada internacional prevista às 04h50: verificar imigração, retirada de malas, despacho e prazo de embarque.',status:'ok',tag:'emitido'});
 set('budget','train-shanghai-beijing',{value:0,sub:'Casal · 05/10 11h00–15h31 · valor do print substituiEmissão não visível no recorte.',status:'wait'});
 const group=state.budget.find(x=>x.id==='m4');
 if(group){group.value=Math.max(0,(Number(group.value)||0)-1606.16);group.label='Três voos da Ásia · previsão restante';group.sub='PEK/PKX→SZX · DAD→HAN · HAN→PVG. Saldo do orçamento antigo, NÃO cotação; revisar porque está apertado.';}
 if(!state.budget.some(x=>x.id==='flight-hkg-dad'))state.budget.push({id:'flight-hkg-dad',label:'Hong Kong → Da Nang · HK Express',sub:'Casal · UO558 ·no print; emissão em andamento.',value:0,status:'wait',color:'#fbbf24'});
 set('budget','return-cwb',{value:0,status:'ok',label:'GRU → CWB · Azul AD4826',sub:'Casal · 25/10 06h20–07h20 · emitido conforme print; incluído no total.'});
 if(!state.budget.some(x=>x.id==='transfer-hkg'))state.budget.push({id:'transfer-hkg',label:'Shenzhen → aeroporto HKG · a cotar',sub:'12/10: deslocamento com fronteira. Valor ainda NÃO incluído no subtotal.',value:0,status:'wait',color:'#fbbf24'});
 set('legs','l-pek',{arriveD:'PVG 05h10 → imigração e malas → deslocamento a Shanghai Hongqiao. Trem no app: 05/10 11h00 → Beijingnan 15h31. Check-in depois do deslocamento ao hotel.',alertT:'Chegada e compras',alertD:'Hongqiao Market apenas se sobrar tempo após hotel; alternativa 07/10. Conferir emissão do trem e assentos no app.'});
 set('legs','l-szx',{extraT:'12/10 · saída pelo aeroporto de Hong Kong',extraD:'Check-out e transfer Shenzhen → HKG com travessia de fronteira. Voo UO558 16h30. Transporte ainda a reservar; planejar chegada ao aeroporto por volta de 13h30.'});
 set('legs','l-dad',{arriveT:'Hong Kong (HKG) → Da Nang (DAD)',arriveD:'12/10 · HK Express UO558 · 16h30 → 17h25, horários locais. Emissão em andamento no print. Imigração e transfer ao Chicland após chegada.'});
 set('legs','l-sha',{extraD:'24/10 PVG 11h05 → GRU 25/10 04h50. Azul AD4826 GRU 06h20 → CWB 07h20 emitido: intervalo de apenas 1h30; verificar viabilidade operacional com bagagens.'});
 set('tasks','t6',{label:'Conferir emissão e assentos do trem de 05/10',sub:'Shanghai Hongqiao 11h00 → Beijingnan 15h31;casal. Status não aparece no print.',done:false});
 set('tasks','t5',{label:'Comprar voos PEK/PKX→SZX, DAD→HAN e HAN→PVG',sub:'HKG→DAD UO558 12/10 16h30–17h25 já em emissão no app; acompanhar confirmação.',done:false});
 set('tasks','t1',{label:'Resolver transfer CGH→GRU e revisar conexão de volta',sub:'Retorno Azul AD4826 já emitido: GRU 25/10 06h20 → CWB 07h20. Só 1h30 após internacional 04h50; conferir prazos com bagagens.',done:false});
 if(!state.tasks.some(x=>x.id==='t-transfer-hkg'))state.tasks.push({id:'t-transfer-hkg',label:'Reservar transfer Shenzhen → HKG e confirmar UO558',due:'2026-09-24',done:false,sub:'12/10 voo 16h30; planejar chegada HKG ~13h30 e margem para fronteira. Conferir bagagem e emissão.'});
 if(!state.alerts.some(x=>x.id==='return-short'))state.alerts.unshift({id:'return-short',tone:'amber',head:'25/10 · GRU: intervalo de apenas 1h30',body:'Internacional previsto 04h50; Azul AD4826 parte 06h20. Reserva doméstica separada no app. Conferir proteção da conexão, imigração, retirada/redespacho de malas e fechamento do check-in. Não tratar este intervalo como conexão garantida.'});
 state.septemberReceiptsVersion=1;return updateCostDetails(state);
}

function updateGoldenWeekPlan(state){
 if(state.goldenWeekPlanVersion===1)return updateSeptemberReceipts(state);
 const set=(id,fields)=>{const item=state.tasks.find(x=>x.id===id);if(item)Object.assign(item,fields);};
 set('t-mutianyu',{label:'Reservar Mutianyu 08/10 e transfer',due:'2026-09-23',sub:'Após Golden Week 01–07/10. Conferir abertura 23–24/09 conforme janela de 15 dias do portal. Sair cedo; se já comprado para outra data, conferir remarcação.'});
 set('t11',{due:'2026-09-29',sub:'Cidade Proibida 06/10: venda 29/09 às 09h Brasília (20h Pequim). Ainda no feriado; reservar na abertura.'});
 set('t-tiananmen',{label:'Reservar Tiananmen para 06/10',due:'2026-09-29',sub:'Conferir janela 29/09–05/10 e regras específicas do feriado. Levar passaportes.'});
 const a=state.alerts.find(x=>x.id==='a7');if(a)a.body='Feriado oficial 01–07/10/2026. Mutianyu em 08/10 para tentar reduzir lotação, sem garantia. Cidade Proibida 06/10: venda 29/09 às 20h Pequim (09h Brasília). Pandas mantidos em 07/10.';
 state.goldenWeekPlanVersion=1;return updateSeptemberReceipts(state);
}

function updateTrainBudget(state){
 if(state.trainBudgetVersion===1)return updateGoldenWeekPlan(state);
 const group=state.budget.find(x=>x.id==='m4');
 if(group){group.value=Math.max(0,(Number(group.value)||0)-1299);group.label='Quatro voos da Ásia · previsão restante';group.sub='PEK/PKX→SZX · SZX→DAD · DAD→HAN · HAN→PVG; saldo da previsão após separar o trem';}
 if(!state.budget.some(x=>x.id==='train-shanghai-beijing'))state.budget.push({id:'train-shanghai-beijing',label:'Trem-bala Xangai → Pequim',sub:'05/10 ·informado em 22/09; considerado total do casal. Pagamento/emissão a confirmar.',value:0,color:'#fbbf24',status:'wait'});
 state.trainBudgetVersion=1;return updateGoldenWeekPlan(state);
}

function updateBeijing(state){
 if(state.beijingPlanVersion===1)return updateTrainBudget(state);
 const wall=state.tasks.find(x=>x.id==='t-mutianyu');
 if(wall)Object.assign(wall,{label:'Reservar Mutianyu 06/10 e transfer',due:'2026-09-21',sub:'Data antecipada para liberar pandas em 07/10. Conferir venda desde 21/09; se já comprado para 07/10, verificar remarcação com o operador.'});
 const palace=state.tasks.find(x=>x.id==='t11');
 if(palace)palace.sub='Visita proposta 08/10. Compra 01/10 às 09h Brasília = 20h Pequim. Dia 07/10 reservado para pandas e Templo do Céu.';
 if(!state.tasks.some(x=>x.id==='t-pandas'))state.tasks.push({id:'t-pandas',label:'Conferir ingresso zoo + pandas para 07/10',due:'2026-10-01',done:false,sub:'Visita às 8h. Referência ¥19/adulto, ¥38 casal; reconfirmar preço, venda e passaportes. Não comprado; referência não adicionada como despesa ao budget.'});
 const leg=state.legs.find(x=>x.id==='l-pek');
 if(leg&&!leg.chips.includes('Hongqiao Market'))leg.chips.push('Hongqiao Market');
 state.beijingPlanVersion=1;return updateTrainBudget(state);
}

function updateVisualInfo(state){
 if(state.visualInfoVersion===1)return updateBeijing(state);
 const a=state.alerts.find(x=>x.id==='cgh-gru');if(a)a.body='LA3193: Congonhas 16h15 → voo internacional em Guarulhos 20h50. Meta: chegar ao Terminal 3 até 18h. Lufthansa informa encerramento de check-in e despacho 60 min antes, às 19h50; até esse horário, malas já entregues. Transfer e retirada das malas precisam caber na margem. Fonte: consulta oficial Lufthansa, 17/09/2026.';
 state.visualInfoVersion=1;return updateBeijing(state);
}
function updatePlan(state){
 if(state.planVersion===1)return updateVisualInfo(state);
 const f=state.flights.find(x=>x.id==='f0');Object.assign(f,{route:'CWB → CGH',when:'02/10 15h10 → 16h15',kind:'LATAM LA3193',note:'reserva no app · casal · pago. Chega em Congonhas; transfer para GRU é necessário antes do internacional 20h50.',status:'ok',tag:'comprado'});
 const back=state.flights.find(x=>x.id==='f9');Object.assign(back,{when:'25/10 · buscar a partir de 09h–10h',note:'Pendente. Priorizar GRU para evitar troca de aeroporto; horário sugerido, ainda sem cotação.',status:'wait',tag:'a cotar'});
 const b=state.budget.find(x=>x.id==='m7');Object.assign(b,{label:'CWB → CGH · LATAM',sub:'LA3193 · casal · pago conforme comprovante',value:0,status:'ok'});
 state.budget.push({id:'return-cwb',label:'GRU → CWB · a cotar',sub:'Volta 25/10 não comprada; valor NÃO incluído no subtotal',value:0,status:'wait',color:'#f87171'});
 state.budget.push({id:'transfer-sp',label:'Transfer CGH → GRU · a cotar',sub:'Não incluído; avaliar antecipação/remarcação da ida',value:0,status:'wait',color:'#f87171'});
 const t=state.tasks.find(x=>x.id==='t1');Object.assign(t,{label:'Resolver troca CGH→GRU e comprar retorno GRU→CWB',due:'2026-09-18',done:false,sub:'Ida LATAM já paga. Intervalo CGH 16h15 → GRU 20h50: 4h35 para bagagens, transfer e despacho. Avaliar voo mais cedo.'});
 Object.assign(state.tasks.find(x=>x.id==='t6'),{sub:'Para 05/10: abre 21/09. Conferir horário da estação no 12306. Buscar trem a partir de 10h30, não presumir 09h.'});
 Object.assign(state.tasks.find(x=>x.id==='t11'),{due:'2026-10-01',sub:'Visita proposta 08/10. Compra 01/10 às 09h Brasília = 20h Pequim. Alternativa 07/10: abre 30/09 09h.'});
 state.tasks.push({id:'t-mutianyu',label:'Reservar Mutianyu 07/10 e transfer',due:'2026-09-23',done:false,sub:'Verificar disponibilidade desde 22/09; portal informa janela de 15 dias. Definir teleférico/tobogã e transfer.'});
 state.tasks.push({id:'t-tiananmen',label:'Reservar Tiananmen para 08/10',due:'2026-10-01',done:false,sub:'Janela 1–7 dias antes. Levar passaportes.'});
 Object.assign(state.flights.find(x=>x.id==='f3'),{when:'05/10 · buscar 10h30–11h30',note:'Janela sugerida; emissão abre 21/09. Chegada depende do trem escolhido.'});
 Object.assign(state.flights.find(x=>x.id==='f7'),{when:'21/10 · preferir após 18h30',note:'Horário sugerido, não confirmado. Cotar direto HAN→PVG junto do transfer do cruzeiro; antigo 17h30 não é reserva.'});
 Object.assign(state.legs.find(x=>x.id==='l-pek'),{arriveD:'PVG 05h10 → imigração/malas → Airport Link até Hongqiao e acesso à estação. Buscar trem a partir de 10h30. Chegada a Pequim conforme trem emitido.',alertD:'Evitar trem 09h com chegada internacional 05h10. Planejar margem e alternativa aérea a partir de PVG.'});
 Object.assign(state.legs.find(x=>x.id==='l-sha'),{arriveD:'Cruzeiro → transfer privativo para HAN → voo direto para PVG, ainda a comprar. Preferir após 18h30, se disponível.',extraD:'24/10 PVG 11h05 → GRU 25/10 04h50. Planejar chegada ao aeroporto ~08h05 e calcular saída do hotel.'});
 const a=state.alerts.find(x=>x.id==='a1');Object.assign(a,{head:'China: isenção de 30 dias para brasileiros',body:'Passaporte brasileiro comum: turismo até 30 dias por entrada, política vigente até 31/12/2026. Roteiro 05–12/10 e 21–24/10 enquadra-se. Fonte: Embaixada da China no Brasil.'});
 state.alerts.unshift({id:'cgh-gru',tone:'',head:'02/10: chegada CGH, saída GRU',body:'LA3193 chega Congonhas 16h15; internacional Guarulhos 20h50. Intervalo 4h35, com malas e transfer por conta própria. Prioridade: avaliar voo mais cedo/direto para GRU. Não é conexão no mesmo aeroporto.'});
 state.alerts.find(x=>x.id==='a7').body='Golden Week 01–07/10. Reservar trem na abertura; Cidade Proibida proposta 08/10, com venda em 01/10 às 20h Pequim (09h Brasília).';
 state.alerts.find(x=>x.id==='a5').head='Oktoberfest 2026 · 19/09 a 04/10';
 state.planVersion=1;return updateVisualInfo(state);
}

/* ======================= ESTADO ======================= */
const LS_KEY="expedicao-asia-2026-barbara";
let S=null, remoteDoc=null, saveTimer=null, applyingRemote=false;

function loadLocal(){ try{ const r=localStorage.getItem(LS_KEY); if(r){ const o=JSON.parse(r); if(o&&o.v===4) return o; } }catch(e){} return null; }
function saveLocal(){ try{ localStorage.setItem(LS_KEY,JSON.stringify(S)); }catch(e){} }
function setSync(t){ const e=document.getElementById("sync"); if(e) e.textContent=t; }
function save(){
  if(applyingRemote) return;
  saveLocal;
  clearTimeout(saveTimer);
  saveTimer=setTimeout(()=>{
    if(remoteDoc) remoteDoc.set({payload:JSON.stringify(S),at:new Date.toISOString()})
      .then(()=>setSync("sincronizado")).catch(()=>setSync("salvo neste aparelho"));
  },500);
}
async function initRemote(){
  try{
    if(!(window.claude&&typeof window.claude.use==="function")){ setSync("salvo neste aparelho"); return; }
    const db=await window.claude.use("db");
    if(!db){ setSync("salvo neste aparelho"); return; }
    remoteDoc=db.doc("trip/state");
    remoteDoc.onSnapshot(snap=>{
      if(!snap.exists){ save; return; }
      if(snap.metadata&&snap.metadata.hasPendingWrites) return;
      const d=snap.data; if(!d||!d.payload) return;
      try{
        const inc=JSON.parse(d.payload);
        if(inc&&inc.v===4&&JSON.stringify(inc)!==JSON.stringify(S)){
          applyingRemote=true; S=inc; saveLocal; renderAll; applyingRemote=false;
          setSync("atualizado de outro aparelho");
        } else setSync("sincronizado");
      }catch(e){}
    },()=>setSync("salvo neste aparelho"));
  }catch(e){ setSync("salvo neste aparelho"); }
}

/* ======================= UTIL ======================= */
const MES=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
function today(){ const d=new Date; return new Date(d.getFullYear,d.getMonth,d.getDate()); }
function parseD(s){ if(!s) return null; const p=String(s).split("-"); if(p.length!==3) return null;
  const d=new Date(+p[0],+p[1]-1,+p[2]); return isNaN(d)?null:d; }
function dias(a,b){ return Math.round((b-a)/86400000); }
function fmtDM(s){ const d=parseD(s); return d? String(d.getDate()).padStart(2,"0")+" "+MES[d.getMonth()] : "—"; }
function brl(n){ return "R$ "+Number(n||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}); }
function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function uid(p){ return p+"-"+Math.random.toString(36).slice(2,8); }
function lines(v){ return String(v||"").split("\n").map(s=>s.trim()).filter(Boolean); }
const ST={ok:{c:"st-ok",t:"confirmado"},wait:{c:"st-pend",t:"pendente"},crit:{c:"st-crit",t:"urgente"}};
function stTag(s,txt){ const o=ST[s]||ST.wait; return '<span class="st '+o.c+'">'+esc(txt||o.t)+'</span>'; }
function toast(m){ const h=document.getElementById("toastHost"); h.innerHTML='<div class="toast">'+esc(m)+'</div>';
  clearTimeout(toast._t); toast._t=setTimeout(()=>h.innerHTML="",2000); }
/* campos de conteúdo aceitam <b> e <br>; o resto é escapado */
function rich(s){ return esc(s).replace(/&lt;(\/?)(b|br|i|u)&gt;/g,"<$1$2>"); }

/* ======================= COUNTDOWN + TICKER ======================= */
const dep=new Date(DEP_ISO);
function tickClock(){
  const d=dep-new Date, el=document.getElementById("countdown");
  if(!el) return;
  if(d<=0){ el.textContent="EM VIAGEM ✈"; return; }
  const dd=Math.floor(d/864e5), h=Math.floor(d%864e5/36e5), m=Math.floor(d%36e5/6e4);
  el.textContent="T-"+dd+"d "+String(h).padStart(2,"0")+"h "+String(m).padStart(2,"0")+"m para o embarque";
}

function stationMessage(text,index){
 const chunks=text.split('•').map(x=>x.trim());
 return '<span class="station-message"><span class="station-service led-'+(index%4)+'">'+esc(chunks.shift())+'</span>'+chunks.map((x,j)=>'<span class="station-field '+(j%2?'led-white':'led-'+((index+1)%4))+'">'+esc(x)+'</span>').join('')+'<span class="station-end" aria-hidden="true">▏</span></span>';
}
function renderTicker(){
 const d=Math.max(0,dias(today,parseD(DEP_DATE)));
 const sets=[
 ['EMBARQUE EM '+d+' DIAS • 02 OUT 2026','CWB 15:10 → CGH 16:15 • LATAM CONFIRMADO','GRU T3 • META 18:00 • DESPACHO ATÉ 19:50','MUNIQUE → PEQUIM → SHENZHEN → VIETNÃ → XANGAI'],
 ['BÁRBARA & KIKO • PRÓXIMA PARADA: BOAS HISTÓRIAS','PEQUIM • HUTONGS + GUIJIE + PATO LAQUEADO','SHENZHEN • ARTE + SEA WORLD + MÚSICA','HOI AN • COZINHAR + LANTERNAS • HANÓI • CAFÉS + BIA HOI','XANGAI • MUSEU + BUND + JAZZ'],
 ['21 SET • ABERTURA DO TREM PARA 05 OUT • HORÁRIO NO 12306','01 OUT • 09:00 BRASÍLIA • CIDADE PROIBIDA 08 OUT','PENDENTES • VOOS ÁSIA + CRUZEIRO + RETORNO CWB','E-VISA VIETNÃ • 12–21 OUT • UM PEDIDO POR PESSOA']
 ];
 sets.push(S.legs.filter(l=>HOTEL_PHOTOS[l.id]).map(l=>fmtDM(l.from)+' – '+fmtDM(l.to)+' • '+(l.short||l.city)+' • '+l.hotel+' • CONFIRMADO'));
 sets.forEach((messages,i)=>{const el=document.getElementById('station-'+(i+1));if(!el)return;const group=messages.map((x,j)=>stationMessage(x,j)).join('');el.innerHTML='<div class="station-group">'+group+'</div><div class="station-group" aria-hidden="true">'+group+'</div>';});
}
document.addEventListener('click',e=>{
 const pause=e.target.closest('[data-board]');if(pause){const track=document.getElementById(pause.dataset.board);const active=track.classList.toggle('is-paused');pause.setAttribute('aria-pressed',String(active));pause.setAttribute('aria-label',(active?'Retomar':'Pausar')+' painel');pause.textContent=active?'▶':'Ⅱ';}
 const filter=e.target.closest('[data-day-city]');if(filter){document.querySelectorAll('[data-day-city]').forEach(b=>b.setAttribute('aria-pressed',String(b===filter)));document.querySelectorAll('[data-daily-city]').forEach(c=>c.hidden=filter.dataset.dayCity!=='Todos'&&filter.dataset.dayCity!==c.dataset.dailyCity);document.querySelectorAll('.day-grid>.love-note').forEach(n=>n.hidden=filter.dataset.dayCity!=='Todos');}
});

/* ======================= KPIs ======================= */
function renderKPIs(){
  const t=today, d=dias(t,parseD(DEP_DATE));
  const late=S.tasks.filter(x=>!x.done&&parseD(x.due)&&dias(t,parseD(x.due))<0).length;
  const open=S.tasks.filter(x=>!x.done).length;
  const naoComprado=S.flights.filter(f=>f.status!=="ok").length;
  const total=S.budget.reduce((a,b)=>a+(+b.value||0),0);
  document.getElementById("kpiStrip").innerHTML=[
    '<div class="kpi '+(d<=30?'rose':'cyan')+'"><div class="label">Embarque</div><div class="v">'+(d>0?("T-"+d+(d===1?" dia":" dias")):(d===0?"hoje":"em viagem"))+'</div><div class="label" style="margin-top:4px">02/10 → 25/10 · 23 dias</div></div>',
    '<div class="kpi"><div class="label">Rota</div><div class="v">3 <small>DE · CN · VN</small></div><div class="label" style="margin-top:4px">'+S.legs.length+' paradas · 20 noites</div></div>',
    '<div class="kpi '+(late?'rose':'mint')+'"><div class="label">'+(late?'Tarefas atrasadas':'Tarefas abertas')+'</div><div class="v">'+(late||open)+'</div><div class="label" style="margin-top:4px">'+open+' abertas de '+S.tasks.length+'</div></div>',
    '<div class="kpi amber"><div class="label">Trechos a comprar</div><div class="v">'+naoComprado+'</div><div class="label" style="margin-top:4px">de '+S.flights.length+' no total</div></div>',
    '<div class="kpi mint"><div class="label">Viagem</div><div class="v">24 <small>dias</small></div><div class="label" style="margin-top:4px">02 → 25 de outubro</div></div>'
  ].join("");
}

/* ======================= ROTA ======================= */
function renderRoute(){
  document.getElementById("routeBar").innerHTML=S.legs.map(l=>
    '<div class="leg" style="--c:'+esc(l.color)+'"><div class="dotline"><div class="dot"></div><div class="bar"></div></div>'+
    '<div class="city">'+esc(l.short||l.city)+'</div>'+
    '<div class="dates">'+esc(fmtDM(l.from))+' – '+esc(fmtDM(l.to))+'</div>'+
    '<div class="nights">'+esc(l.nights)+'</div></div>').join("");

  document.getElementById("kanban").innerHTML=S.legs.map(l=>{
    const cards=[];
    cards.push('<div class="card c-flight"><div class="k"><span>'+rich(l.arriveK)+'</span></div>'+
      '<div class="t">'+rich(l.arriveT)+'</div><div class="d">'+rich(l.arriveD)+'</div></div>');
    cards.push('<div class="card c-hotel"><div class="k"><span>Hotel</span>'+stTag(l.hotelStatus)+'</div>'+
      '<div class="t">'+rich(l.hotel)+'</div><div class="d">'+rich(l.hotelD)+'</div></div>');
    if(l.extraT) cards.push('<div class="card c-cruise"><div class="k"><span>Extra</span></div>'+
      '<div class="t">'+rich(l.extraT)+'</div><div class="d">'+rich(l.extraD)+'</div></div>');
    if((l.chips||[]).length) cards.push('<div class="card c-tour"><div class="k"><span>Atrações</span></div>'+
      '<div class="t">'+rich(l.spotsT)+'</div><div class="chips">'+l.chips.map(c=>'<span class="chip">'+esc(c)+'</span>').join("")+'</div></div>');
    if(l.alertT) cards.push('<div class="card c-alert"><div class="k"><span>Ponto frágil</span></div>'+
      '<div class="t">'+rich(l.alertT)+'</div><div class="d">'+rich(l.alertD)+'</div></div>');
    return '<div class="col" style="--c:'+esc(l.color)+'">'+cityIllustration(l.id)+
      '<div class="col-top"><h3>'+rich(l.city)+'</h3><div class="right"><span class="tag">'+esc(l.tag)+'</span>'+
      '<button class="b" data-edit="legs" data-id="'+l.id+'">editar</button></div></div>'+cards.join("")+'</div>';
  }).join("");
}

/* ======================= VOOS ======================= */
function renderFlights(){
  document.getElementById("flightRows").innerHTML=S.flights.map(f=>
    '<tr><td class="route-code">'+esc(f.route)+'</td><td class="nw">'+esc(f.when)+'</td>'+
    '<td class="nw">'+esc(f.kind)+'</td><td style="color:var(--muted)">'+rich(f.note)+'</td>'+
    '<td>'+stTag(f.status,f.tag)+'</td>'+
    '<td style="text-align:right"><button class="b" data-edit="flights" data-id="'+f.id+'">editar</button></td></tr>').join("");
}

/* ======================= ORÇAMENTO ======================= */
const PLAN_CATS=[
 {id:'intl',label:'Voos internacionais',plan:0,note:'comprados antes do orçamento'},
 {id:'hotel',label:'Hospedagem (6 hotéis)',plan:0},
 {id:'asia',label:'Voos internos + trem (+ metrô até Hong Kong)',plan:0},
 {id:'br',label:'Curitiba ⇄ São Paulo (+ Uber CGH→GRU)',plan:0},
 {id:'cruise',label:'Cruzeiro Halong + transfers',plan:0},
 {id:'tours',label:'Passeios, ingressos e transporte',plan:0},
 {id:'food',label:'Alimentação',plan:0},
 {id:'docs',label:'eSIM, VPN e eVisa',plan:0},
 {id:'new',label:'Não previstos (compras, seguro, IOF, gorjetas, bagagem)',plan:0}
];
function renderPlanVsReal(){ return;
  const el=document.getElementById("planVsReal"); if(!el) return;
  const known=new Set(PLAN_CATS.map(c=>c.id));
  const sum=(f)=>S.budget.filter(f).reduce((a,b)=>a+(+b.value||0),0);
  let tp=0,tr=0,tpaid=0;
  const rows=PLAN_CATS.map(c=>{
    const inCat=b=>(b.cat||'new')===c.id || (c.id==='new' && !known.has(b.cat||'new'));
    const real=sum(inCat), paid=sum(b=>inCat(b)&&b.status==='ok');
    tp+=c.plan; tr+=real; tpaid+=paid;
    const d=real-c.plan, pct=c.plan?((d/c.plan)*100):null;
    const cls=d>1?'over':(d<-1?'under':'even');
    return '<tr><td>'+esc(c.label)+(c.note?'<span class="sub">'+esc(c.note)+'</span>':'')+'</td>'+
      '<td class="n">'+brl(c.plan)+'</td><td class="n">'+brl(real)+'<span class="sub">pago '+brl(paid)+'</span></td>'+
      '<td class="n '+cls+'">'+(d>0?'+':'')+brl(d)+(pct!==null&&Math.abs(d)>1?'<span class="sub">'+(d>0?'+':'')+pct.toFixed(0)+'%</span>':'')+'</td></tr>';
  }).join("");
  const d=tr-tp, pct=(d/tp*100);
  const shop=sum(b=>b.id==='shopping');
  el.innerHTML='<div class="pv-head"><div><div class="label">Previsto × atual</div>'+
    '<div class="pv-big '+(d>0?'over':'under')+'">'+(d>0?'+':'')+brl(d)+' <small>('+(d>0?'+':'')+pct.toFixed(0)+'%)</small></div>'+
    '<div class="note">Previsto '+brl(tp)+' → agora '+brl(tr)+'. Sem a reserva de compras, o estouro é de '+brl(d-shop)+' ('+((d-shop)/tp*100).toFixed(0)+'%).</div></div>'+
    '<div class="pv-mini"><div class="mini"><div class="label">Já pago</div><div class="mv" style="color:var(--mint)">'+brl(tpaid)+'</div></div>'+
    '<div class="mini"><div class="label">Ainda a gastar</div><div class="mv" style="color:var(--amber)">'+brl(tr-tpaid)+'</div></div></div></div>'+
    '<div class="pv-wrap"><table class="pv"><thead><tr><th>Categoria</th><th class="n">Previsto</th><th class="n">Agora</th><th class="n">Diferença</th></tr></thead><tbody>'+rows+
    '</tbody><tfoot><tr><td>Total</td><td class="n">'+brl(tp)+'</td><td class="n">'+brl(tr)+'</td><td class="n '+(d>0?'over':'under')+'">'+(d>0?'+':'')+brl(d)+'</td></tr></tfoot></table></div>';
}
function renderBudget(){ if(!document.getElementById("budgetBars")) return;
  renderPlanVsReal;
  const rows=S.budget.slice.sort((a,b)=>(+b.value||0)-(+a.value||0));
  const total=S.budget.reduce((a,b)=>a+(+b.value||0),0);
  const pago=S.budget.filter(b=>b.status==="ok").reduce((a,b)=>a+(+b.value||0),0);
  const max=Math.max.apply(null,rows.map(r=>+r.value||0).concat([1]));
  document.getElementById("budgetBars").innerHTML=rows.map(r=>{
    const share=total?(((+r.value||0)/total)*100).toFixed(1):"0.0";
    return '<div class="brow"><div class="bl">'+
      '<span class="nm" data-edit="budget" data-id="'+r.id+'" tabindex="0" role="button">'+esc(r.label)+
        (r.sub?'<span class="sub">'+esc(r.sub)+'</span>':'')+'</span>'+
      '<b style="color:'+esc(r.color)+'">'+brl(r.value)+'</b></div>'+
      '<div class="btr" title="'+share+'% do total"><div class="bf" data-w="'+((+r.value||0)/max*100)+'" style="background:'+esc(r.color)+'"></div></div></div>';
  }).join("");
  requestAnimationFrame(()=>setTimeout(()=>document.querySelectorAll(".bf").forEach(b=>b.style.width=b.dataset.w+"%"),60));

  const abertas=S.budget.filter(b=>b.status!=="ok").length;
  document.getElementById("totalBox").innerHTML=
    '<div class="label">Subtotal conhecido / estimado</div>'+
    '<div class="big">'+brl(total)+'</div>'+
    '<div class="note">Casal, 23 dias, incluindo os voos internacionais e a taxa de parcelamento.</div>'+
    '<div class="minigrid">'+
      '<div class="mini"><div class="label">Já pago</div><div class="mv" style="color:var(--mint)">'+brl(pago)+'</div></div>'+
      '<div class="mini"><div class="label">A desembolsar</div><div class="mv" style="color:var(--amber)">'+brl(total-pago)+'</div></div>'+
      '<div class="mini"><div class="label">Por dia · casal</div><div class="mv">'+brl(Math.round(total/23))+'</div></div>'+
      '<div class="mini"><div class="label">Linhas abertas</div><div class="mv" style="color:var(--red)">'+abertas+'</div></div>'+
    '</div>'+
    '<div class="warn-line">Atualizado em 29/09/2026. Todos os voos, trem, hotéis e cruzeiro estão pagos. Linhas em amarelo/vermelho são estimativas ou a pagar no dia (câmbio de referência: ¥1·. Falta comprar: Mutianyu, van Hanói→Tuan Chau e carro Tuan Chau→Noi Bai.</div>';
}

/* ======================= PRAZOS ======================= */
function renderTasks(){
  const t=today;
  const groups={};
  S.tasks.forEach(x=>{ (groups[x.due]=groups[x.due]||[]).push(x); });
  const keys=Object.keys(groups).sort;
  document.getElementById("phases").innerHTML=keys.map(k=>{
    const d=parseD(k), diff=d?dias(t,d):null;
    const allDone=groups[k].every(x=>x.done);
    const late=diff!==null&&diff<0&&!allDone;
    const soon=diff!==null&&diff>=0&&diff<=7&&!allDone;
    const cor=allDone?"var(--mint)":late?"var(--red)":soon?"var(--amber)":"var(--cyan)";
    const pl=n=>n+(n===1?" dia":" dias");
    const rel=diff===null?"":diff<0?("venceu há "+pl(Math.abs(diff))):diff===0?"vence hoje":("em "+pl(diff));
    return '<div class="phase'+(late?" late":"")+'">'+
      '<h4 style="color:'+cor+'">'+esc(fmtDM(k))+(allDone?" · concluído":"")+'</h4>'+
      '<div class="deadline">'+esc(rel)+'</div><ul class="ck">'+
      groups[k].map(x=>'<li class="'+(x.done?"done":(late?"urgent":""))+'">'+
        '<button class="box" role="checkbox" aria-checked="'+(!!x.done)+'" data-toggle="'+x.id+'" aria-label="concluir"></button>'+
        '<span class="txt" data-edit="tasks" data-id="'+x.id+'" tabindex="0" role="button">'+esc(x.label)+
          (x.sub?'<span class="sub">'+esc(x.sub)+'</span>':'')+'</span></li>').join("")+
      '</ul></div>';
  }).join("");
  const done=S.tasks.filter(x=>x.done).length;
  document.getElementById("ckProgress").innerHTML='<b style="color:var(--mint)">'+done+'/'+S.tasks.length+'</b> concluídas';
}

/* ======================= ALERTAS + TECH ======================= */
function renderAlerts(){
  document.getElementById("alertGrid").innerHTML=S.alerts.map(a=>
    '<div class="alert '+esc(a.tone||"")+'"><h5><span>'+rich(a.head)+'</span>'+
    '<button class="b" data-edit="alerts" data-id="'+a.id+'">editar</button></h5>'+
    '<p>'+rich(a.body)+'</p></div>').join("");
}
function renderTech(){
  document.getElementById("techGrid").innerHTML=S.tech.map(g=>
    '<div class="tcard"><h5><span>'+rich(g.head)+'</span>'+
    '<button class="b" data-edit="tech" data-id="'+g.id+'">editar</button></h5>'+
    '<ul>'+(g.items||[]).map(i=>'<li>'+rich(i)+'</li>').join("")+'</ul></div>').join("");
}


const HOTEL_PHOTOS={"l-muc": {"hotel": "Hampton by Hilton Munich Airport South", "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Hampton_by_Hilton_Munich_Airport_South.jpg/760px-Mapcarta.jpg", "source": "https://mapcarta.com/18168738", "credit": "Wikimedia Commons / Mapcarta", "view": "Fachada"}, "l-pek": {"hotel": "LiveFortuna Hotel", "url": "https://aw-d.tripcdn.com/images/02002120009zj7ca3EE7F.jpg", "source": "https://www.trip.com/hotels/beijing-hotel-detail-821303/livefortuna-beijing/review.html", "credit": "Trip.com", "view": "Entrada"}, "l-szx": {"hotel": "Fuqinglong Huatian Holiday Hotel", "url": "https://images.trvl-media.com/lodging/107000000/106150000/106142300/106142279/9fa85d55.jpg?impolicy=resizecrop&ra=fill&rh=575&rw=575", "source": "https://in.hotels.com/ho3397552928/", "credit": "Hotels.com", "view": "Fachada"}, "l-dad": {"hotel": "Chicland Danang Beach Hotel", "url": "https://www.chiclandhotel.com/files/thumb?h=985&src=%2Fuploads%2F%2FAnh+hotel+moi%2F7327.jpg&w=818", "source": "https://www.chiclandhotel.com/press.html", "credit": "Chicland Hotel", "view": "Fachada e praia"}, "l-han": {"hotel": "Victor Metropolis Hotel & Rooftop bar", "url": "https://cdn.media.dulich24.com.vn/khachsan/victor-metropolis-hotel-rooftop-bar.jpg", "source": "https://dulich24.com.vn/khach-san-tai-quan-hoan-kiem/victor-metropolis-hotel-rooftop-bar-hid-86266", "credit": "Dulich24", "view": "Rooftop"}, "l-sha": {"hotel": "Shanghai Elong Hotel by the Nanjing Road", "url": "https://pavo.elongstatic.com/i/tHotel800_600/nw_ZtW4BbIsEM.jpg", "source": "https://elong.hotelshanghai.cn/cn", "credit": "Elong / HotelShanghai", "view": "Fachada · Jiujiang Road 595"}};
function cityIllustration(id){const h=HOTEL_PHOTOS[id];if(!h)return '';return '<figure class="real-hotel"><a href="'+esc(h.source)+'" target="_blank" rel="noopener"><img src="'+esc(h.url)+'" alt="'+esc(h.view+' — '+h.hotel)+'" loading="lazy" decoding="async" referrerpolicy="no-referrer"></a><figcaption>'+esc(h.view)+' · Foto: <a href="'+esc(h.source)+'" target="_blank" rel="noopener">'+esc(h.credit)+'</a></figcaption><p class="photo-fallback" hidden>Foto indisponível no momento. <a href="'+esc(h.source)+'" target="_blank" rel="noopener">Ver na fonte ↗</a></p></figure>';}
document.addEventListener('error',e=>{if(e.target.matches&&e.target.matches('.real-hotel img')){e.target.hidden=true;const f=e.target.closest('.real-hotel');f.querySelector('.photo-fallback').hidden=false;}},true);

function renderWishes(){const w=S.experienceWishes||[];document.querySelectorAll('[data-wish]').forEach(b=>{const on=w.includes(b.dataset.wish);b.setAttribute('aria-pressed',String(on));b.textContent=on?'♥ Na nossa lista':'♡ Quero fazer';});document.getElementById('savedCount').textContent=w.length+' experiências na nossa lista';}
document.addEventListener('click',e=>{const f=e.target.closest('[data-city]');if(f){document.querySelectorAll('[data-city]').forEach(b=>b.setAttribute('aria-pressed',String(b===f)));document.querySelectorAll('[data-exp-city]').forEach(c=>{c.hidden=f.dataset.city!=='Todos'&&c.dataset.expCity!==f.dataset.city;});}
const w=e.target.closest('[data-wish]');if(w){S.experienceWishes=S.experienceWishes||[];const id=w.dataset.wish;S.experienceWishes=S.experienceWishes.includes(id)?S.experienceWishes.filter(x=>x!==id):[...S.experienceWishes,id];save;renderWishes;}});

function renderAll(){ S=updateHotels(S); renderTicker; renderKPIs; renderRoute; renderFlights; renderBudget; renderTasks; renderAlerts; renderTech; tickClock; renderWishes; }

/* ======================= MODAL ======================= */
const FORMS={
 legs:{ title:"Trecho da rota", fields:[
   {k:"city",l:"Cidade"},{k:"short",l:"Nome curto (linha do tempo)"},
   {k:"tag",l:"Etiqueta",h:"ex.: 05–09/10 · 4 noites"},{k:"nights",l:"Noites (texto)"},
   {k:"from",l:"Chegada",t:"date",half:1},{k:"to",l:"Saída",t:"date",half:1},
   {k:"color",l:"Cor",t:"color",half:1},{k:"hotelStatus",l:"Status do hotel",t:"status",half:1},
   {k:"arriveK",l:"Rótulo do 1º card",h:"Voo, Chegada, Logística…"},
   {k:"arriveT",l:"Trecho"},{k:"arriveD",l:"Detalhe do deslocamento",t:"area"},
   {k:"hotel",l:"Hotel"},{k:"hotelD",l:"Detalhe do hotel",t:"area"},
   {k:"spotsT",l:"Título das atrações"},{k:"chips",l:"Atrações",t:"list",h:"uma por linha"},
   {k:"extraT",l:"Card extra — título",h:"deixe vazio para ocultar"},{k:"extraD",l:"Card extra — texto",t:"area"},
   {k:"alertT",l:"Ponto frágil — título",h:"deixe vazio para ocultar"},{k:"alertD",l:"Ponto frágil — texto",t:"area"} ]},
 flights:{ title:"Trecho aéreo / ferroviário", fields:[
   {k:"route",l:"Trecho",h:"ex.: PEK → SZX"},{k:"when",l:"Data / horário"},
   {k:"kind",l:"Tipo",half:1},{k:"status",l:"Status",t:"status",half:1},
   {k:"tag",l:"Etiqueta do status",h:"comprado, atrasado, 21/09…"},
   {k:"note",l:"Observações",t:"area"} ]},
 budget:{ title:"Linha do orçamento", fields:[
   {k:"label",l:"Categoria"},{k:"sub",l:"Detalhe"},
   {k:"value",l:"Valor (R$)",t:"number",half:1},{k:"status",l:"Status",t:"status",half:1},
   {k:"color",l:"Cor da barra",t:"color"} ]},
 tasks:{ title:"Tarefa", fields:[
   {k:"label",l:"Tarefa"},{k:"due",l:"Vence em",t:"date",half:1},{k:"done",l:"Concluída",t:"bool",half:1},
   {k:"sub",l:"Detalhe",t:"area"} ]},
 alerts:{ title:"Regra de fronteira", fields:[
   {k:"head",l:"Título"},{k:"tone",l:"Cor da borda",t:"tone"},{k:"body",l:"Texto",t:"area",h:"aceita <b> para negrito"} ]},
 tech:{ title:"Bloco do stack", fields:[
   {k:"head",l:"Título"},{k:"items",l:"Itens",t:"list",h:"um por linha · aceita <b>"} ]}
};
const NEW_DEFAULTS={
 legs:{color:"#22d3ee",hotelStatus:"wait",chips:[],nights:"1 noite"},
 flights:{status:"wait",tag:"pendente"},
 budget:{color:"#22d3ee",status:"wait",value:0},
 tasks:{done:false,due:"2026-09-30"},
 alerts:{tone:""},
 tech:{items:[]}
};

function openModal(coll,id){
  const form=FORMS[coll]; if(!form) return;
  const isNew=!id;
  const item=isNew?Object.assign({},NEW_DEFAULTS[coll]):S[coll].find(x=>x.id===id);
  if(!item) return;
  const parts=form.fields.map(fd=>{
    let val=item[fd.k]; if(fd.t==="list") val=(val||[]).join("\n");
    const v=esc(val==null?"":val);
    let inp;
    if(fd.t==="area"||fd.t==="list") inp='<textarea data-k="'+fd.k+'">'+v+'</textarea>';
    else if(fd.t==="status") inp='<select data-k="'+fd.k+'">'+["ok","wait","crit"].map(s=>'<option value="'+s+'"'+(val===s?" selected":"")+'>'+ST[s].t+'</option>').join("")+'</select>';
    else if(fd.t==="bool") inp='<select data-k="'+fd.k+'"><option value="no"'+(!val?" selected":"")+'>não</option><option value="yes"'+(val?" selected":"")+'>sim</option></select>';
    else if(fd.t==="tone") inp='<select data-k="'+fd.k+'">'+[["","vermelho"],["amber","âmbar"],["cyan","ciano"],["mint","verde"]].map(o=>'<option value="'+o[0]+'"'+((val||"")===o[0]?" selected":"")+'>'+o[1]+'</option>').join("")+'</select>';
    else inp='<input data-k="'+fd.k+'" type="'+(fd.t==="number"?"number":fd.t==="date"?"date":fd.t==="color"?"color":"text")+'" value="'+v+'">';
    return '<div class="fld"'+(fd.half?' data-half="1"':'')+'><label>'+esc(fd.l)+'</label>'+inp+(fd.h?'<div class="hint">'+esc(fd.h)+'</div>':'')+'</div>';
  });
  const out=[]; let i=0;
  while(i<parts.length){
    const a=parts[i].indexOf('data-half="1"')>-1, b=i+1<parts.length&&parts[i+1].indexOf('data-half="1"')>-1;
    if(a&&b){ out.push('<div class="row2">'+parts[i]+parts[i+1]+'</div>'); i+=2; } else { out.push(parts[i]); i++; }
  }
  document.getElementById("modalHost").innerHTML=
   '<div class="scrim" data-scrim><div class="modal" role="dialog" aria-modal="true" aria-label="'+esc(form.title)+'">'+
     '<div class="mh"><h3>'+esc(isNew?("Novo — "+form.title):form.title)+'</h3><button class="b" data-close>fechar</button></div>'+
     '<div class="mb">'+out.join("")+'</div>'+
     '<div class="mf">'+(isNew?"":'<button class="b dg" data-del style="margin-right:auto">excluir</button>')+
       '<button class="b" data-close>cancelar</button><button class="b go" data-save>salvar</button></div>'+
   '</div></div>';
  const host=document.getElementById("modalHost");
  const scrim=host.querySelector("[data-scrim]");
  const close=()=>{host.innerHTML="";};
  const f0=host.querySelector("input,select,textarea"); if(f0) f0.focus;
  scrim.addEventListener("click",e=>{
    if(e.target===scrim||e.target.closest("[data-close]")){ close; return; }
    if(e.target.closest("[data-del]")){ S[coll]=S[coll].filter(x=>x.id!==id); close; save; renderAll; toast("Removido"); return; }
    if(e.target.closest("[data-save]")){
      const obj=isNew?Object.assign({id:uid(coll.slice(0,2))},NEW_DEFAULTS[coll]):item;
      scrim.querySelectorAll("[data-k]").forEach(el=>{
        const k=el.getAttribute("data-k"), fd=form.fields.find(x=>x.k===k); let val=el.value;
        if(fd.t==="number") val=Number(val)||0;
        else if(fd.t==="list") val=lines(val);
        else if(fd.t==="bool") val=(val==="yes");
        obj[k]=val;
      });
      if(isNew) S[coll].push(obj);
      close; save; renderAll; toast("Salvo");
    }
  });
  scrim.addEventListener("keydown",e=>{ if(e.key==="Escape") close; });
}

/* ======================= BACKUP ======================= */
let dl=null, dlTried=false;
async function exportBackup(){
  const json=JSON.stringify(S,null,2), name="expedicao-asia-2026.json";
  if(!dlTried&&window.claude&&typeof window.claude.use==="function"){
    dlTried=true; try{ dl=await window.claude.use("downloads"); }catch(e){ dl=null; }
  }
  if(dl&&typeof dl.save==="function"){
    try{ await dl.save({filename:name,data:json}); toast("Backup salvo"); }
    catch(err){ toast(err&&err.code==="declined"?"Download cancelado":"Não foi possível baixar aqui"); }
    return;
  }
  const blob=new Blob([json],{type:"application/json"}), u=URL.createObjectURL(blob), a=document.createElement("a");
  a.href=u; a.download=name; document.body.appendChild(a); a.click; a.remove;
  setTimeout(()=>URL.revokeObjectURL(u),1000); toast("Backup baixado");
}

/* ======================= EVENTOS ======================= */
document.addEventListener("click",e=>{
  const ed=e.target.closest("[data-edit]"); if(ed){ openModal(ed.getAttribute("data-edit"),ed.getAttribute("data-id")); return; }
  const ad=e.target.closest("[data-add]"); if(ad){ openModal(ad.getAttribute("data-add"),null); return; }
  const tg=e.target.closest("[data-toggle]");
  if(tg){ const t=S.tasks.find(x=>x.id===tg.getAttribute("data-toggle")); if(t){ t.done=!t.done; save; renderAll; } return; }
  const ac=e.target.closest("[data-act]");
  if(ac){
    const a=ac.getAttribute("data-act");
    if(a==="export") exportBackup;
    if(a==="import") document.getElementById("fileIn").click;
    if(a==="print") window.print;
    if(a==="reset"&&confirm("Voltar todos os dados ao estado original? Suas edições serão perdidas.")){ S=defaults; save; renderAll; toast("Dados restaurados"); }
  }
});
document.addEventListener("keydown",e=>{
  if(e.key!=="Enter"&&e.key!==" ") return;
  const el=e.target.closest&&e.target.closest('[data-edit][role="button"]');
  if(el){ e.preventDefault; openModal(el.getAttribute("data-edit"),el.getAttribute("data-id")); }
});
document.getElementById("fileIn").addEventListener("change",e=>{
  const f=e.target.files&&e.target.files[0]; if(!f) return;
  const r=new FileReader;
  r.onload=()=>{ try{ const o=JSON.parse(r.result);
    if(o&&o.legs&&o.tasks&&o.budget){ S=o; S.v=4; save; renderAll; toast("Backup restaurado"); }
    else toast("Arquivo não reconhecido"); }catch(err){ toast("Arquivo inválido"); } };
  r.readAsText(f); e.target.value="";
});

/* ======================= BOOT ======================= */
S=loadLocal()||defaults;
renderAll;
setInterval(tickClock,30000);
setSync("salvo neste aparelho");
initRemote;

});
