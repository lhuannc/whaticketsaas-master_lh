/* =====================================================================
   Omnichannel Plus — Shared data (used by mobile + desktop builds)
   ===================================================================== */

const CONVERSATIONS = [
  { id:1, name:'Mariana Costa', color:'#7c3aed', channel:'wa', status:'open', funnel:'novo', tags:['Lead Quente','Plano Pro'], last:'Oi! Vi o anúncio do plano Pro e queria entender melhor…', time:'09:42', unread:2, ai:true, online:true, phone:'+55 21 99888-7766', email:'mariana.costa@email.com', deal:'2.964' },
  { id:2, name:'@joao.designer', color:'#db2777', channel:'ig', status:'open', funnel:'novo', tags:['Instagram'], last:'Vocês integram com o Instagram da minha loja?', time:'09:38', unread:1, ai:false, online:true, phone:'@joao.designer', email:'joao@studio.com', deal:'2.964' },
  { id:3, name:'Carlos — Loja Sul', color:'#2563eb', channel:'wa', status:'resolved', funnel:'ganho', tags:['Cliente'], last:'Fechado, pode emitir a nota 👍', time:'09:21', unread:0, ai:false, online:false, phone:'+55 11 98123-4567', email:'carlos@lojasul.com.br', deal:'5.928' },
  { id:4, name:'Beatriz Almeida', color:'#0891b2', channel:'wa', status:'pending', funnel:'qual', tags:['Suporte'], last:'A conexão caiu de novo, conseguem ver?', time:'08:55', unread:0, ai:true, online:false, phone:'+55 21 99111-2233', email:'bia@empresa.com', deal:'2.964' },
  { id:5, name:'@ana.makeup', color:'#e11d48', channel:'ig', status:'pending', funnel:'novo', tags:['Lead'], last:'Quanto fica o pacote pra 5 atendentes?', time:'08:40', unread:0, ai:false, online:true, phone:'@ana.makeup', email:'ana@makeupstore.com', deal:'5.928' },
  { id:6, name:'Rafael Mendes', color:'#ea580c', channel:'wa', status:'pending', funnel:'nego', tags:['Negociação'], last:'Vou conversar com meu sócio e te retorno.', time:'Ontem', unread:0, ai:false, online:false, phone:'+55 31 99777-8899', email:'rafael@mendes.com', deal:'2.964' },
];

const CONV_VIEWS = [
  { id:'open', label:'Abertas', hint:'Aguardando atendimento' },
  { id:'pending', label:'Em andamento', hint:'Em atendimento' },
  { id:'resolved', label:'Resolvidas', hint:'Encerradas' },
];

const THREAD = [
  { who:'lead', t:'Oi! Vi o anúncio do plano Pro e queria entender melhor o que está incluso.', time:'09:38' },
  { who:'ai',   t:'Olá, Mariana! 👋 Que bom te ver por aqui. O plano Pro inclui 3 conexões (WhatsApp + Instagram), IA Copilot completo, CRM Kanban e até 10 usuários. Posso te enviar um comparativo?', time:'09:39' },
  { who:'lead', t:'Pode sim! E tem teste grátis?', time:'09:40' },
  { who:'ai',   t:'Tem sim — 14 dias grátis, sem cartão de crédito. Quer que eu já deixe seu ambiente pré-configurado?', time:'09:40' },
  { who:'lead', t:'Quero! Mas prefiro falar com uma pessoa pra tirar umas dúvidas de migração.', time:'09:42' },
];

const COMMENTS = [
  { id:1, user:'lucas.fit', color:'#16a34a', t:'Esse produto funciona pra quem tem loja só no Instagram?', time:'12 min', likes:3 },
  { id:2, user:'mari.boutique', color:'#db2777', t:'Acabei de assinar o Pro, recomendo demais! 🔥', time:'25 min', likes:12 },
  { id:3, user:'pedro.tech', color:'#2563eb', t:'Quanto custa o plano pra 10 atendentes?', time:'1 h', likes:1 },
  { id:4, user:'spam.promo23', color:'#6b7280', t:'GANHE DINHEIRO FÁCIL clique no meu link 💰💰', time:'1 h', likes:0, spam:true },
  { id:5, user:'julia.decor', color:'#7c3aed', t:'Adorei! Já indiquei pra três amigas que têm e-commerce.', time:'2 h', likes:8 },
];

const STAGES = [
  { id:'novo', label:'Novo', color:'#42b9eb' },
  { id:'qual', label:'Qualificando', color:'#7c3aed' },
  { id:'prop', label:'Proposta', color:'#d97706' },
  { id:'nego', label:'Negociação', color:'#2563eb' },
  { id:'ganho', label:'Ganho', color:'#16a34a' },
];
const LEADS = {
  novo:[ {n:'Mariana Costa',v:'2.964',ch:'wa',c:'#7c3aed',tag:'Plano Pro'}, {n:'@ana.makeup',v:'5.928',ch:'ig',c:'#e11d48',tag:'5 usuários'}, {n:'Loja Verde',v:'1.164',ch:'wa',c:'#16a34a',tag:'Básico'} ],
  qual:[ {n:'@joao.designer',v:'2.964',ch:'ig',c:'#db2777',tag:'Integração'}, {n:'Bruno Telecom',v:'7.164',ch:'wa',c:'#0891b2',tag:'Enterprise'} ],
  prop:[ {n:'Rafael Mendes',v:'2.964',ch:'wa',c:'#ea580c',tag:'Aguardando'}, {n:'Studio Pilates',v:'2.964',ch:'wa',c:'#7c3aed',tag:'Proposta enviada'} ],
  nego:[ {n:'Carlos — Loja Sul',v:'5.928',ch:'wa',c:'#2563eb',tag:'Desconto'} ],
  ganho:[ {n:'Beatriz Almeida',v:'2.964',ch:'wa',c:'#0891b2',tag:'Assinou'}, {n:'mari.boutique',v:'2.964',ch:'ig',c:'#db2777',tag:'Pro anual'} ],
};

const MEMBERS = [
  { n:'Júlia Ramos', color:'#2a688f', role:'Operador', queue:'Comercial', online:true, atend:18, csat:'96%' },
  { n:'Pedro Lima', color:'#0891b2', role:'Operador', queue:'Suporte', online:true, atend:24, csat:'92%' },
  { n:'Ana Souza', color:'#7c3aed', role:'Admin', queue:'Todas', online:false, atend:9, csat:'98%' },
  { n:'Diego Martins', color:'#ea580c', role:'Operador', queue:'Comercial', online:false, atend:14, csat:'90%' },
];

const TENANTS = [
  { n:'Boutique da Mari', plan:'Pro', status:'ativo', due:'12 jun', value:'197', users:'8/10' },
  { n:'TechSul Telecom', plan:'Enterprise', status:'ativo', due:'28 jun', value:'497', users:'24/∞' },
  { n:'Studio Pilates Zen', plan:'Básico', status:'inadimplente', due:'02 jun', value:'79', users:'3/3' },
  { n:'Loja Verde Orgânicos', plan:'Pro', status:'ativo', due:'19 jun', value:'197', users:'5/10' },
  { n:'Ana Makeup Store', plan:'Básico', status:'trial', due:'14 jun', value:'0', users:'2/3' },
  { n:'Bruno Advocacia', plan:'Pro', status:'inadimplente', due:'30 mai', value:'197', users:'6/10' },
  { n:'Café Central', plan:'Básico', status:'ativo', due:'21 jun', value:'79', users:'2/3' },
  { n:'Mundo Pet RJ', plan:'Pro', status:'ativo', due:'25 jun', value:'197', users:'7/10' },
];

const STATUS_META = {
  ativo:        { label:'Ativo', color:'var(--ok)', bg:'rgba(22,163,74,.13)' },
  inadimplente: { label:'Inadimplente', color:'var(--bad)', bg:'rgba(220,38,38,.13)' },
  trial:        { label:'Trial', color:'var(--warn)', bg:'rgba(217,119,6,.14)' },
};

Object.assign(window, { CONVERSATIONS, CONV_VIEWS, THREAD, COMMENTS, STAGES, LEADS, MEMBERS, TENANTS, STATUS_META });
