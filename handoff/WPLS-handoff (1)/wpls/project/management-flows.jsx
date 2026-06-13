/* =====================================================================
   Omnichannel Plus — Management config screens
   Fluxos (URA builder) · Funis · IA (persona + markdown KB) · Configurações
   · API Oficial self-connect. Requires app-shared.jsx + app-data.jsx.
   ===================================================================== */

/* ---------- local icons ---------- */
const FIco = {
  flow:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="6" rx="1.5"/><rect x="14" y="15" width="7" height="6" rx="1.5"/><rect x="3" y="15" width="7" height="6" rx="1.5"/><path d="M6.5 9v3a2 2 0 0 0 2 2h9M6.5 14.5V15"/></svg>,
  branch: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="4" r="2.2"/><circle cx="6" cy="20" r="2.2"/><circle cx="18" cy="12" r="2.2"/><path d="M6 6v12M6 12h9.5"/></svg>,
  flag:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 21V4M5 4h12l-2 4 2 4H5"/></svg>,
  trash:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"/></svg>,
  edit:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>,
  play:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4l14 8-14 8z"/></svg>,
  upload: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M12 3v13M7 8l5-5 5 5"/></svg>,
  md:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13v4M8 13l2 2 2-2v4M16 13v4M14.5 15.5L16 17l1.5-1.5"/></svg>,
  meta:   <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.9 7c1.3 0 2.4.9 3.7 3 .5.8 1 1.7 1.4 2.5.4-.8.9-1.7 1.4-2.5 1.3-2.1 2.4-3 3.7-3C22.5 7 24 10 24 13.5c0 2.4-1.2 3.9-3 3.9-1.6 0-2.7-1-3.9-3.2-.4-.7-.8-1.5-1.1-2.2-.3.7-.7 1.5-1.1 2.2-1.2 2.2-2.3 3.2-3.9 3.2-1.8 0-3-1.5-3-3.9C0 10 1.5 7 6.9 7zm0 2.2c-2.4 0-3.7 1.8-3.7 4.3 0 1.2.5 1.7 1.1 1.7.8 0 1.4-.6 2.4-2.3.5-.9 1-1.9 1.5-2.8-.5-.5-.9-.8-1.3-.8zm10.2 0c-.4 0-.8.3-1.3.8.5.9 1 1.9 1.5 2.8 1 1.7 1.6 2.3 2.4 2.3.6 0 1.1-.5 1.1-1.7 0-2.5-1.3-4.3-3.7-4.3z"/></svg>,
  dots:   <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>,
  msg:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  clock:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  dist:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>,
  scale:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M7 21h10M3 7h18M6.5 7 3.5 13a3 3 0 0 0 6 0L6.5 7zM17.5 7l-3 6a3 3 0 0 0 6 0l-3-6z"/></svg>,
  order:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>,
  userCheck: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M3.5 20a6 6 0 0 1 11 0M16 11l2 2 4-4"/></svg>,
  arrowR: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
};

function mkSwitch(on, onClick){ return React.createElement('button',{className:'switch'+(on?' on':''),onClick},React.createElement('span',{className:'knob'})); }
function Switch({ on, onClick }){ return <button className={'switch'+(on?' on':'')} onClick={onClick}><span className="knob"></span></button>; }

/* ---------- data ---------- */
const QUEUES = ['Comercial','Suporte','Financeiro','Retenção'];

const FUNNELS_INIT = [
  { id:'vendas', name:'Vendas', channel:'Todos os canais', color:'#2a688f',
    stages:[['Novo','#42b9eb',12],['Qualificando','#7c3aed',8],['Proposta','#d97706',5],['Negociação','#2563eb',3],['Ganho','#16a34a',9]] },
  { id:'suporte', name:'Suporte Técnico', channel:'WhatsApp', color:'#0891b2',
    stages:[['Aberto','#42b9eb',6],['Em análise','#d97706',4],['Aguardando cliente','#7c3aed',2],['Resolvido','#16a34a',21]] },
  { id:'onboard', name:'Onboarding / Pós-venda', channel:'Todos os canais', color:'#7c3aed',
    stages:[['Boas-vindas','#42b9eb',7],['Configuração','#d97706',3],['Ativo','#16a34a',18]] },
];

const FLOWS_INIT = [
  { id:'f1', name:'Atendimento Comercial', channels:['wa','ig'], status:'ativo',
    trigger:{ type:'keyword', value:'oi, olá, menu, começar, quero' },
    nodes:[
      { type:'message', text:'Olá! 👋 Aqui é a Aurora, assistente virtual da WPLS. Que bom te ver por aqui!' },
      { type:'menu', prompt:'Como posso te ajudar hoje?', options:[
        { key:'1', label:'Quero contratar / Comercial', action:'funnel', target:'Vendas · Novo' },
        { key:'2', label:'Já sou cliente / Suporte', action:'queue', target:'Suporte' },
        { key:'3', label:'Tirar dúvidas com a IA', action:'ai', target:'Aurora' },
      ]},
      { type:'queue', queue:'Comercial', text:'Perfeito! Vou te encaminhar para um especialista de vendas 😉' },
    ]},
  { id:'f2', name:'Pós-venda Instagram', channels:['ig'], status:'rascunho',
    trigger:{ type:'any', value:'Qualquer mensagem recebida no Direct' },
    nodes:[
      { type:'message', text:'Oi! Obrigado por chamar a gente no Direct 💜' },
      { type:'ai', persona:'Aurora', text:'IA responde dúvidas de pós-venda usando a base de conhecimento.' },
      { type:'end', text:'Qualquer coisa, é só chamar! 👋' },
    ]},
  { id:'f3', name:'Recuperação de carrinho', channels:['wa'], status:'inativo',
    trigger:{ type:'keyword', value:'cupom, desconto, carrinho' },
    nodes:[
      { type:'message', text:'Vi que você se interessou pelo plano Pro 👀 Tenho um cupom pra você!' },
      { type:'funnel', target:'Vendas · Negociação' },
    ]},
];

const AI_DOCS_INIT = [
  { id:'d1', name:'Tabela de Preços 2026', size:'4 KB', updated:'há 2 dias', content:'# Tabela de Preços 2026\n\nValores vigentes a partir de **janeiro de 2026**.\n\n## Planos\n\n- **Básico** — R$ 97/mês · 1 conexão · 3 usuários\n- **Pro** — R$ 247/mês · 3 conexões · 10 usuários · IA Copilot\n- **Enterprise** — sob consulta · conexões ilimitadas\n\n## Descontos\n\n- Plano anual: **20% de desconto**\n- Indicação: 1 mês grátis por cliente indicado\n\n> Para condições especiais, encaminhe ao time comercial.' },
  { id:'d2', name:'Política de Migração', size:'7 KB', updated:'há 5 dias', content:'# Política de Migração\n\nComo migramos o cliente de outra plataforma para a WPLS.\n\n## O que importamos\n\n- Contatos e histórico de conversas\n- Tags e etiquetas\n- Funis e etapas\n\n## Prazo\n\nA migração leva em média **2 dias úteis** e é acompanhada por um especialista.\n\n## Importante\n\nNenhum histórico é perdido. O número de WhatsApp permanece o mesmo.' },
  { id:'d3', name:'FAQ — Dúvidas Frequentes', size:'11 KB', updated:'ontem', content:'# FAQ — Dúvidas Frequentes\n\n## Preciso de chip novo?\n\nNão. Usamos o seu número atual via Evolution API ou a API Oficial da Meta.\n\n## A IA responde sozinha?\n\nSim, quando ativada. Ela pode atender 100% ou apenas sugerir respostas para os operadores.\n\n## Funciona no Instagram?\n\nFunciona! Direct e comentários no mesmo painel.' },
];

/* helper: tiny markdown -> html */
function mdToHtml(md){
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const lines = (md||'').split('\n'); let html=''; let inList=false;
  const inline = t => esc(t).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`(.+?)`/g,'<code>$1</code>');
  for(let raw of lines){
    const l = raw.replace(/\s+$/,'');
    if(/^###\s+/.test(l)){ if(inList){html+='</ul>';inList=false;} html+='<h3>'+inline(l.replace(/^###\s+/,''))+'</h3>'; }
    else if(/^##\s+/.test(l)){ if(inList){html+='</ul>';inList=false;} html+='<h2>'+inline(l.replace(/^##\s+/,''))+'</h2>'; }
    else if(/^#\s+/.test(l)){ if(inList){html+='</ul>';inList=false;} html+='<h1>'+inline(l.replace(/^#\s+/,''))+'</h1>'; }
    else if(/^[-*]\s+/.test(l)){ if(!inList){html+='<ul>';inList=true;} html+='<li>'+inline(l.replace(/^[-*]\s+/,''))+'</li>'; }
    else if(/^>\s+/.test(l)){ if(inList){html+='</ul>';inList=false;} html+='<p style="opacity:.75;border-left:3px solid var(--accent-bright);padding-left:11px">'+inline(l.replace(/^>\s+/,''))+'</p>'; }
    else if(l.trim()===''){ if(inList){html+='</ul>';inList=false;} }
    else { if(inList){html+='</ul>';inList=false;} html+='<p>'+inline(l)+'</p>'; }
  }
  if(inList) html+='</ul>';
  return html;
}

const ChanBadge = ({ ch, size=26 }) => (
  <span className="flow-chan-badge" style={{width:size,height:size,background: ch==='wa'?'var(--wa-green)':undefined, backgroundImage: ch==='ig'?'var(--ig-grad)':undefined}}>
    {ch==='wa' ? <Wa s={size*0.55}/> : <Ig s={size*0.55}/>}
  </span>
);

/* =====================================================================
   FLUXOS
   ===================================================================== */
function FluxosScreen({ toast }) {
  const [flows, setFlows] = useState(FLOWS_INIT);
  const [editId, setEditId] = useState(null);

  const editing = flows.find(f => f.id===editId);
  const updateEditing = (updater) => setFlows(fs => fs.map(f => f.id===editId ? updater(f) : f));

  const newFlow = () => {
    const id = 'f'+Date.now();
    setFlows(fs => [...fs, { id, name:'Novo fluxo', channels:['wa'], status:'rascunho',
      trigger:{type:'keyword', value:'oi, olá'},
      nodes:[ {type:'message', text:'Olá! Como posso ajudar?'}, {type:'end', text:'Atendimento encerrado. Até logo!'} ] }]);
    setEditId(id);
  };

  if(editing) return <FlowEditor flow={editing} onChange={updateEditing} onBack={()=>setEditId(null)} toast={toast}
    onDelete={()=>{ setFlows(fs=>fs.filter(f=>f.id!==editId)); setEditId(null); toast('Fluxo excluído'); }} />;

  return (
    <div className="dk-scroll-center"><div className="dk-wrap" style={{maxWidth:1080}}>
      <div className="dk-pane-title">Fluxos &amp; URA</div>
      <div className="dk-pane-sub" style={{marginBottom:18}}>Automação de atendimento — defina o canal, as respostas e para onde encaminhar cada lead.</div>
      <div className="flow-list">
        {flows.map(f => (
          <div key={f.id} className="flow-card" onClick={()=>setEditId(f.id)}>
            <div className="flow-card-top">
              <div className="flow-card-ic">{FIco.flow}</div>
              <div style={{minWidth:0,flex:1}}>
                <div className="flow-card-name">{f.name}</div>
                <div className="flow-card-trigger">Gatilho: {f.trigger.type==='any'?'qualquer mensagem':f.trigger.value}</div>
              </div>
            </div>
            <div className="flow-card-foot">
              <div className="flow-chans">
                {f.channels.map(c => <ChanBadge key={c} ch={c} />)}
                <span className="flow-steps-n" style={{marginLeft:4}}>{f.nodes.length} passos</span>
              </div>
              <span className={'flow-status '+f.status}><span className="sd"></span>{f.status==='ativo'?'Ativo':f.status==='rascunho'?'Rascunho':'Inativo'}</span>
            </div>
          </div>
        ))}
        <div className="flow-new-card" onClick={newFlow}>
          <div className="nic">{Ico.plus}</div>
          Criar novo fluxo
        </div>
      </div>
    </div></div>
  );
}

const NODE_META = {
  message:{ cls:'nt-message', tt:'Mensagem', ic:FIco.msg },
  menu:   { cls:'nt-menu', tt:'Menu de opções', ic:FIco.branch },
  funnel: { cls:'nt-funnel', tt:'Mover para funil', ic:Ico.funnel },
  queue:  { cls:'nt-queue', tt:'Atribuir à fila', ic:Ico.team },
  ai:     { cls:'nt-ai', tt:'IA assume', ic:Ico.spark },
  end:    { cls:'nt-end', tt:'Encerrar', ic:FIco.flag },
};

function FlowEditor({ flow, onChange, onBack, onDelete, toast }) {
  const [sel, setSel] = useState('trigger'); // 'trigger' | node index
  const [popAt, setPopAt] = useState(null);

  const patchNode = (idx, patch) => onChange(f => ({...f, nodes: f.nodes.map((n,i)=> i===idx?{...n,...patch}:n)}));
  const delNode = (idx) => { onChange(f => ({...f, nodes: f.nodes.filter((_,i)=>i!==idx)})); setSel('trigger'); };
  const addNode = (atIdx, type) => {
    const blank = {
      message:{type:'message', text:'Escreva a mensagem…'},
      menu:{type:'menu', prompt:'Escolha uma opção:', options:[{key:'1',label:'Opção 1',action:'queue',target:'Comercial'}]},
      funnel:{type:'funnel', target:'Vendas · Novo'},
      queue:{type:'queue', queue:'Comercial', text:''},
      ai:{type:'ai', persona:'Aurora', text:'IA responde usando a base de conhecimento.'},
      end:{type:'end', text:'Atendimento encerrado. Até logo!'},
    }[type];
    onChange(f => { const ns=[...f.nodes]; ns.splice(atIdx,0,blank); return {...f, nodes:ns}; });
    setPopAt(null); setSel(atIdx);
  };
  const toggleChan = (c) => onChange(f => ({...f, channels: f.channels.includes(c) ? (f.channels.length>1?f.channels.filter(x=>x!==c):f.channels) : [...f.channels,c]}));

  return (
    <div className="dk-pane" style={{flex:1}}>
      <div className="flow-edit-hdr">
        <button className="dk-iconbtn" onClick={onBack} title="Voltar">{Ico.back}</button>
        <input className="flow-name-input" value={flow.name} onChange={e=>onChange(f=>({...f,name:e.target.value}))} />
        <span className={'flow-status '+flow.status} style={{cursor:'pointer'}}
          onClick={()=>onChange(f=>({...f,status: f.status==='ativo'?'inativo':'ativo'}))}>
          <span className="sd"></span>{flow.status==='ativo'?'Ativo':flow.status==='rascunho'?'Rascunho':'Inativo'}
        </span>
        <div className="dk-spacer"></div>
        <button className="dk-iconbtn" title="Excluir fluxo" onClick={onDelete}>{FIco.trash}</button>
        <button className="btn btn-ghost" style={{height:42,minHeight:42,fontSize:13.5}} onClick={()=>toast('Simulando fluxo no modo teste…')}>{FIco.play} Testar</button>
        <button className="btn btn-primary" style={{height:42,minHeight:42,fontSize:13.5}} onClick={()=>{onChange(f=>({...f,status:'ativo'}));toast('Fluxo salvo e ativado');}}>{Ico.check} Salvar</button>
      </div>

      <div className="flow-shell">
        <div className="flow-canvas">
          <div className="flow-track">
            {/* start / trigger */}
            <div className={'flow-start'} onClick={()=>setSel('trigger')} style={{cursor:'pointer', outline: sel==='trigger'?'3px solid rgba(66,185,235,.5)':'none'}}>
              <div className="fs-label">Início · Gatilho</div>
              <div className="fs-title">{Ico.bolt} {flow.trigger.type==='any'?'Qualquer mensagem':flow.trigger.type==='schedule'?'Por horário':'Palavra-chave'}</div>
              <div className="fs-chans">
                {flow.channels.map(c => <span key={c} className="fs-chan">{c==='wa'?<Wa s={12}/>:<Ig s={12}/>}{c==='wa'?'WhatsApp':'Instagram'}</span>)}
              </div>
              <div className="fs-trigger">{flow.trigger.type==='any'?'Dispara para toda mensagem recebida':'“'+flow.trigger.value+'”'}</div>
            </div>

            {flow.nodes.map((n,i) => (
              <React.Fragment key={i}>
                <div className="flow-conn"></div>
                <div className="flow-add">
                  <button className="flow-add-btn" onClick={()=>setPopAt(popAt===('b'+i)?null:('b'+i))}>{Ico.plus}</button>
                  {popAt===('b'+i) && <NodePop onPick={(t)=>addNode(i,t)} onClose={()=>setPopAt(null)} />}
                </div>
                <div className="flow-conn"></div>
                <NodeCard node={n} meta={NODE_META[n.type]} selected={sel===i} onClick={()=>setSel(i)} onDelete={()=>delNode(i)} />
              </React.Fragment>
            ))}

            <div className="flow-conn"></div>
            <div className="flow-add">
              <button className="flow-add-btn" onClick={()=>setPopAt(popAt==='end'?null:'end')}>{Ico.plus}</button>
              {popAt==='end' && <NodePop onPick={(t)=>addNode(flow.nodes.length,t)} onClose={()=>setPopAt(null)} />}
            </div>
          </div>
        </div>

        <Inspector flow={flow} sel={sel} onChange={onChange} patchNode={patchNode} />
      </div>
    </div>
  );
}

function NodeCard({ node, meta, selected, onClick, onDelete }) {
  return (
    <div className={'flow-node '+meta.cls+(selected?' sel':'')} onClick={onClick}>
      <span className="nstripe"></span>
      <div className="flow-node-main">
        <div className="flow-node-ic">{meta.ic}</div>
        <div style={{flex:1,minWidth:0}}>
          <div className="flow-node-tt">{meta.tt}</div>
          <div className="flow-node-sum">{nodeSummary(node)}</div>
        </div>
        <button className="flow-node-del" onClick={(e)=>{e.stopPropagation();onDelete();}}>{FIco.trash}</button>
      </div>
      {node.type==='menu' && (
        <div className="flow-opts">
          {node.options.map((o,oi)=>(
            <div className="flow-opt" key={oi}>
              <span className="flow-opt-key">{o.key}</span>
              <span className="flow-opt-label">{o.label}</span>
              <span className="flow-opt-arrow">{Ico.back && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>}</span>
              <span className={'flow-opt-target '+targetCls(o.action)}>{targetIcon(o.action)}{o.target||targetLabel(o.action)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function nodeSummary(n){
  if(n.type==='message') return n.text;
  if(n.type==='menu') return n.prompt;
  if(n.type==='funnel') return 'Mover para '+n.target;
  if(n.type==='queue') return 'Encaminhar para a fila '+n.queue;
  if(n.type==='ai') return 'IA '+(n.persona||'')+' assume a conversa';
  if(n.type==='end') return n.text||'Encerrar atendimento';
  return '';
}
function targetCls(a){ return a==='funnel'?'tgt-funnel':a==='queue'?'tgt-queue':a==='ai'?'tgt-ai':'tgt-end'; }
function targetLabel(a){ return a==='funnel'?'Funil':a==='queue'?'Fila':a==='ai'?'IA':'Encerrar'; }
function targetIcon(a){ const s={width:12,height:12}; if(a==='funnel')return <span style={{display:'grid'}}>{Ico.funnel}</span>; if(a==='queue')return <span style={{display:'grid'}}>{Ico.team}</span>; if(a==='ai')return <span style={{display:'grid'}}>{Ico.spark}</span>; return <span style={{display:'grid'}}>{FIco.flag}</span>; }

function NodePop({ onPick, onClose }) {
  const types = [
    {t:'message', c:'#2a688f', ic:FIco.msg, l:'Mensagem'},
    {t:'menu', c:'#7c3aed', ic:FIco.branch, l:'Menu de opções'},
    {t:'funnel', c:'#2196d4', ic:Ico.funnel, l:'Mover para funil'},
    {t:'queue', c:'#ea580c', ic:Ico.team, l:'Atribuir à fila'},
    {t:'ai', c:'#42b9eb', ic:Ico.spark, l:'IA assume'},
    {t:'end', c:'#64748b', ic:FIco.flag, l:'Encerrar'},
  ];
  return (
    <React.Fragment>
      <div style={{position:'fixed',inset:0,zIndex:25}} onClick={onClose}></div>
      <div className="node-pop">
        <div className="node-pop-t">Adicionar passo</div>
        {types.map(x=>(
          <button key={x.t} onClick={()=>onPick(x.t)}>
            <span className="npi" style={{background:x.t==='ai'?'var(--brand-grad)':x.c}}>{x.ic}</span>
            <span className="npt">{x.l}</span>
          </button>
        ))}
      </div>
    </React.Fragment>
  );
}

function Inspector({ flow, sel, onChange, patchNode }) {
  if(sel==='trigger'){
    return (
      <div className="flow-inspector">
        <div className="ins-hdr"><div className="ih-ic" style={{background:'var(--brand-grad)'}}>{Ico.bolt}</div><div><div className="ins-title">Gatilho de entrada</div><div className="ins-sub">Quando este fluxo dispara</div></div></div>
        <div className="ins-body">
          <div className="fl-field"><label>Canais atendidos</label>
            <div style={{display:'flex',gap:9,flexWrap:'wrap'}}>
              <button className={'chan-toggle wa'+(flow.channels.includes('wa')?' on':'')} onClick={()=>onChange(f=>({...f,channels:f.channels.includes('wa')?(f.channels.length>1?f.channels.filter(x=>x!=='wa'):f.channels):[...f.channels,'wa']}))}>
                <span className="cdot" style={{background:'var(--wa-green)'}}><Wa s={13}/></span>WhatsApp<span className="check">{Ico.check}</span>
              </button>
              <button className={'chan-toggle ig'+(flow.channels.includes('ig')?' on':'')} onClick={()=>onChange(f=>({...f,channels:f.channels.includes('ig')?(f.channels.length>1?f.channels.filter(x=>x!=='ig'):f.channels):[...f.channels,'ig']}))}>
                <span className="cdot" style={{backgroundImage:'var(--ig-grad)'}}><Ig s={13}/></span>Instagram<span className="check">{Ico.check}</span>
              </button>
            </div>
            <span className="fl-hint">A URA pode atender um canal, o outro, ou os dois ao mesmo tempo.</span>
          </div>
          <div className="fl-field"><label>Tipo de gatilho</label>
            <select className="fl-select" value={flow.trigger.type} onChange={e=>onChange(f=>({...f,trigger:{...f.trigger,type:e.target.value}}))}>
              <option value="keyword">Palavra-chave</option>
              <option value="any">Qualquer mensagem</option>
              <option value="schedule">Por horário</option>
            </select>
          </div>
          {flow.trigger.type==='keyword' && (
            <div className="fl-field"><label>Palavras-chave</label>
              <textarea className="fl-textarea" value={flow.trigger.value} onChange={e=>onChange(f=>({...f,trigger:{...f.trigger,value:e.target.value}}))} />
              <span className="fl-hint">Separe por vírgula. O fluxo dispara quando o cliente enviar uma delas.</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  const node = flow.nodes[sel];
  if(!node) return <div className="flow-inspector"><div className="ins-body" style={{justifyContent:'center',alignItems:'center',color:'var(--text-3)',fontWeight:600,textAlign:'center'}}>Selecione um passo para editar</div></div>;
  const meta = NODE_META[node.type];
  return (
    <div className="flow-inspector">
      <div className="ins-hdr"><div className={'ih-ic '+meta.cls} style={{background: node.type==='ai'?'var(--brand-grad)':'var(--c)'}}>{meta.ic}</div><div><div className="ins-title">{meta.tt}</div><div className="ins-sub">Passo {sel+1} de {flow.nodes.length}</div></div></div>
      <div className="ins-body">
        {node.type==='message' && (
          <div className="fl-field"><label>Texto da mensagem</label>
            <textarea className="fl-textarea" style={{minHeight:140}} value={node.text} onChange={e=>patchNode(sel,{text:e.target.value})} />
            <span className="fl-hint">Use emojis e variáveis como {'{nome}'} para personalizar.</span>
          </div>
        )}
        {node.type==='menu' && (
          <React.Fragment>
            <div className="fl-field"><label>Pergunta do menu</label>
              <textarea className="fl-textarea" value={node.prompt} onChange={e=>patchNode(sel,{prompt:e.target.value})} />
            </div>
            <div className="fl-field"><label>Opções</label>
              {node.options.map((o,oi)=>(
                <div className="ins-opt-edit" key={oi}>
                  <div className="oe-top">
                    <input className="fl-input" style={{width:54,textAlign:'center',padding:0}} value={o.key} onChange={e=>patchNode(sel,{options:node.options.map((x,j)=>j===oi?{...x,key:e.target.value}:x)})} />
                    <input className="fl-input" style={{flex:1}} value={o.label} onChange={e=>patchNode(sel,{options:node.options.map((x,j)=>j===oi?{...x,label:e.target.value}:x)})} />
                    <button className="ins-opt-del" onClick={()=>patchNode(sel,{options:node.options.filter((_,j)=>j!==oi)})}>{FIco.trash}</button>
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <select className="fl-select" style={{flex:'none',width:120}} value={o.action} onChange={e=>{const a=e.target.value;patchNode(sel,{options:node.options.map((x,j)=>j===oi?{...x,action:a,target:defTarget(a)}:x)});}}>
                      <option value="funnel">Funil</option><option value="queue">Fila</option><option value="ai">IA</option><option value="end">Encerrar</option>
                    </select>
                    {o.action!=='end' && (
                      <select className="fl-select" style={{flex:1}} value={o.target} onChange={e=>patchNode(sel,{options:node.options.map((x,j)=>j===oi?{...x,target:e.target.value}:x)})}>
                        {targetOptions(o.action).map(t=><option key={t} value={t}>{t}</option>)}
                      </select>
                    )}
                  </div>
                </div>
              ))}
              <button className="fstage-add" style={{marginTop:4}} onClick={()=>patchNode(sel,{options:[...node.options,{key:String(node.options.length+1),label:'Nova opção',action:'queue',target:'Comercial'}]})}>{Ico.plus} Adicionar opção</button>
            </div>
          </React.Fragment>
        )}
        {node.type==='funnel' && (
          <div className="fl-field"><label>Funil e etapa de destino</label>
            <select className="fl-select" value={node.target} onChange={e=>patchNode(sel,{target:e.target.value})}>
              {targetOptions('funnel').map(t=><option key={t} value={t}>{t}</option>)}
            </select>
            <span className="fl-hint">O lead é movido para esta etapa do funil automaticamente.</span>
          </div>
        )}
        {node.type==='queue' && (
          <React.Fragment>
            <div className="fl-field"><label>Fila de atendimento</label>
              <select className="fl-select" value={node.queue} onChange={e=>patchNode(sel,{queue:e.target.value})}>
                {QUEUES.map(q=><option key={q} value={q}>{q}</option>)}
              </select>
            </div>
            <div className="fl-field"><label>Mensagem de transferência (opcional)</label>
              <textarea className="fl-textarea" value={node.text} onChange={e=>patchNode(sel,{text:e.target.value})} />
            </div>
          </React.Fragment>
        )}
        {node.type==='ai' && (
          <React.Fragment>
            <div className="fl-field"><label>Persona da IA</label>
              <input className="fl-input" value={node.persona} onChange={e=>patchNode(sel,{persona:e.target.value})} />
              <span className="fl-hint">A IA responde usando a base de conhecimento configurada em “Inteligência Artificial”.</span>
            </div>
            <div className="fl-field"><label>Instrução</label>
              <textarea className="fl-textarea" value={node.text} onChange={e=>patchNode(sel,{text:e.target.value})} />
            </div>
          </React.Fragment>
        )}
        {node.type==='end' && (
          <div className="fl-field"><label>Mensagem de encerramento</label>
            <textarea className="fl-textarea" value={node.text} onChange={e=>patchNode(sel,{text:e.target.value})} />
          </div>
        )}
      </div>
    </div>
  );
}

function defTarget(a){ return a==='funnel'?'Vendas · Novo':a==='queue'?'Comercial':a==='ai'?'Aurora':''; }
function targetOptions(a){
  if(a==='funnel'){ const out=[]; FUNNELS_INIT.forEach(f=>f.stages.forEach(s=>out.push(f.name+' · '+s[0]))); return out; }
  if(a==='queue') return QUEUES;
  if(a==='ai') return ['Aurora'];
  return [];
}

/* =====================================================================
   FUNIS
   ===================================================================== */
function FunisScreen({ toast }) {
  const [funnels, setFunnels] = useState(FUNNELS_INIT);
  const addFunnel = () => setFunnels(fs => [...fs, { id:'fn'+Date.now(), name:'Novo funil', channel:'Todos os canais', color:'#42b9eb', stages:[['Etapa 1','#42b9eb',0],['Etapa 2','#7c3aed',0]] }]);
  const addStage = (id) => setFunnels(fs => fs.map(f => f.id===id ? {...f, stages:[...f.stages,['Nova etapa','#64748b',0]]} : f));
  return (
    <div className="dk-scroll-center"><div className="dk-wrap" style={{maxWidth:1080}}>
      <div style={{display:'flex',alignItems:'flex-start'}}>
        <div style={{flex:1}}>
          <div className="dk-pane-title">Funis</div>
          <div className="dk-pane-sub" style={{marginBottom:18}}>Crie quantos funis quiser — por canal, time ou objetivo. Cada um tem suas próprias etapas.</div>
        </div>
        <button className="btn btn-primary" style={{height:42,minHeight:42,fontSize:13.5}} onClick={addFunnel}>{Ico.plus} Novo funil</button>
      </div>
      <div className="funnel-grid">
        {funnels.map(f => (
          <div key={f.id} className="funnel-card">
            <div className="funnel-card-top">
              <div className="funnel-card-ic" style={{background:f.color}}>{Ico.funnel}</div>
              <div style={{flex:1,minWidth:0}}>
                <div className="funnel-card-name">{f.name}</div>
                <div className="funnel-card-meta">{f.channel} · {f.stages.reduce((a,s)=>a+s[2],0)} oportunidades</div>
              </div>
              <button className="dk-iconbtn" style={{width:36,height:36}} onClick={()=>toast('Editar funil '+f.name)}>{FIco.edit}</button>
            </div>
            <div className="funnel-stages">
              {f.stages.map((s,si)=>(
                <div className="fstage" key={si}>
                  <span className="fsd" style={{background:s[1]}}></span>
                  <span className="fsl">{s[0]}</span>
                  <span className="fsn">{s[2]}</span>
                </div>
              ))}
              <button className="fstage-add" onClick={()=>addStage(f.id)}>{Ico.plus} Adicionar etapa</button>
            </div>
            <div className="funnel-card-foot">
              <button className="btn btn-ghost" style={{flex:1,height:40,minHeight:40,fontSize:13}} onClick={()=>toast('Abrindo quadro de '+f.name)}>{Ico.grid} Abrir quadro</button>
            </div>
          </div>
        ))}
      </div>
    </div></div>
  );
}

/* =====================================================================
   IA — persona + markdown knowledge base
   ===================================================================== */
function IAConfig({ toast }) {
  const [master, setMaster] = useState(true);
  const [name, setName] = useState('Aurora');
  const [greeting, setGreeting] = useState('Olá! Sou a Aurora, assistente virtual da WPLS. Como posso ajudar? 💜');
  const [tone, setTone] = useState(1);
  const [opts, setOpts] = useState({ auto:true, suggest:true, offhours:true, handoff:false });
  const [docs, setDocs] = useState(AI_DOCS_INIT);
  const [editDoc, setEditDoc] = useState(null); // doc object being edited
  const set = k => setOpts(o=>({...o,[k]:!o[k]}));

  if(editDoc) return <DocEditor doc={editDoc} onSave={(d)=>{ setDocs(ds=> ds.find(x=>x.id===d.id) ? ds.map(x=>x.id===d.id?d:x) : [...ds,d]); setEditDoc(null); toast('Documento salvo na base'); }} onCancel={()=>setEditDoc(null)} />;

  const rows = [
    {k:'auto', t:'Atendimento automático', d:'IA responde o primeiro contato de cada lead'},
    {k:'suggest', t:'Sugestões para operadores', d:'Copiloto sugere respostas dentro do chat'},
    {k:'offhours', t:'Fora do horário comercial', d:'IA assume quando nenhum operador está online'},
    {k:'handoff', t:'Transferência automática', d:'Passa para humano em casos sensíveis'},
  ];

  return (
    <div className="dk-scroll-center"><div className="dk-wrap">
      <div className="dk-pane-title">Inteligência Artificial</div>
      <div className="dk-pane-sub" style={{marginBottom:18}}>Configure a persona do Copiloto e alimente-o com documentos de contexto.</div>

      <div className={'dk-card ia-master'+(master?' on':'')} style={{marginBottom:18}}>
        <div className="ia-master-ic">{Ico.spark}</div>
        <div style={{flex:1}}><div style={{fontWeight:800,fontSize:18}}>Copiloto IA</div><div style={{fontSize:13.5,color:master?'rgba(255,255,255,.85)':'var(--text-3)',fontWeight:600}}>{master?'Ativo em todas as filas':'Desligado'}</div></div>
        <Switch on={master} onClick={()=>setMaster(m=>!m)} />
      </div>

      <div className="dk-sec-h">Persona</div>
      <div className="dk-card" style={{padding:0,marginBottom:6}}>
        <div className="ai-persona">
          <div className="ai-persona-av"><span className="halo ai-glow"></span>{Ico.spark}</div>
          <div style={{flex:1,display:'flex',flexDirection:'column',gap:13}}>
            <div className="fl-field"><label>Nome da IA</label>
              <input className="fl-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Ex.: Aurora, Bot, Sofia…" />
            </div>
            <div className="fl-field"><label>Saudação inicial</label>
              <textarea className="fl-textarea" style={{minHeight:64}} value={greeting} onChange={e=>setGreeting(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="dk-sec-h">Tom de voz</div>
      <div className="dk-grid-3" style={{marginBottom:6}}>
        {['Formal','Cordial','Descontraído'].map((t,i)=><button key={t} className={'tone'+(tone===i?' on':'')} onClick={()=>setTone(i)}>{t}</button>)}
      </div>

      <div className="dk-sec-h">Base de conhecimento <span className="s">{docs.length} documentos · Markdown</span></div>
      <div className="dk-card" style={{marginBottom:14}}>
        {docs.map(d => (
          <div className="kb-doc" key={d.id}>
            <div className="kb-doc-ic">{FIco.md}</div>
            <div style={{flex:1,minWidth:0}}>
              <div className="kb-doc-name">{d.name}<span className="md-badge">MD</span></div>
              <div className="kb-doc-meta">{d.size} · atualizado {d.updated}</div>
            </div>
            <div className="kb-actions">
              <button className="dk-iconbtn" style={{width:36,height:36}} onClick={()=>setEditDoc(d)} title="Editar">{FIco.edit}</button>
              <button className="dk-iconbtn" style={{width:36,height:36}} onClick={()=>{setDocs(ds=>ds.filter(x=>x.id!==d.id));toast('Documento removido');}} title="Remover">{FIco.trash}</button>
            </div>
          </div>
        ))}
      </div>
      <div className="kb-dropzone" onClick={()=>setEditDoc({ id:'d'+Date.now(), name:'Novo documento', size:'0 KB', updated:'agora', content:'# Novo documento\n\nEscreva aqui o contexto em **Markdown**…' })}>
        <div className="dz-ic">{FIco.upload}</div>
        <div className="dz-t">Adicionar documento de contexto</div>
        <div className="dz-d">Escreva ou cole conteúdo em Markdown — preços, políticas, FAQ…</div>
      </div>

      <div className="dk-sec-h">Comportamentos</div>
      <div className="dk-card" style={{opacity:master?1:.5,pointerEvents:master?'auto':'none'}}>
        {rows.map((r,i)=>(
          <div key={r.k} className="dk-row" style={{borderTop:i?'1px solid var(--border)':'none'}}>
            <div className="grow"><div className="t">{r.t}</div><div className="d">{r.d}</div></div>
            <Switch on={opts[r.k]} onClick={()=>set(r.k)} />
          </div>
        ))}
      </div>
    </div></div>
  );
}

function DocEditor({ doc, onSave, onCancel }) {
  const [name, setName] = useState(doc.name);
  const [content, setContent] = useState(doc.content);
  return (
    <div className="dk-scroll-center"><div className="dk-wrap">
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18}}>
        <button className="dk-iconbtn" onClick={onCancel}>{Ico.back}</button>
        <div style={{flex:1}}>
          <input className="flow-name-input" style={{fontSize:20,paddingLeft:0}} value={name} onChange={e=>setName(e.target.value)} />
          <div className="dk-pane-sub">Documento de contexto · Markdown</div>
        </div>
        <button className="btn btn-ghost" style={{height:42,minHeight:42,fontSize:13.5}} onClick={onCancel}>Cancelar</button>
        <button className="btn btn-primary" style={{height:42,minHeight:42,fontSize:13.5}} onClick={()=>onSave({...doc, name: name.replace(/\.md$/,''), content, size: Math.max(1,Math.round(content.length/1024))+' KB', updated:'agora'})}>{Ico.check} Salvar documento</button>
      </div>
      <div className="md-editor">
        <div className="md-pane">
          <div className="md-pane-hdr">{FIco.md} Markdown</div>
          <textarea className="md-input" value={content} onChange={e=>setContent(e.target.value)} spellCheck="false" />
        </div>
        <div className="md-pane">
          <div className="md-pane-hdr">{Ico.doc} Pré-visualização</div>
          <div className="md-preview" dangerouslySetInnerHTML={{__html: mdToHtml(content)}}></div>
        </div>
      </div>
    </div></div>
  );
}

/* =====================================================================
   CONFIGURAÇÕES (general)
   ===================================================================== */
function ConfiguracoesScreen({ toast }) {
  const [autoClose, setAutoClose] = useState(true);
  const [timeout, setTimeoutVal] = useState('30 min');
  const [warnFirst, setWarnFirst] = useState(true);
  const sel = (label, opts, def) => (
    <div className="fl-field"><label>{label}</label>
      <select className="fl-select" defaultValue={def}>{opts.map(o=><option key={o}>{o}</option>)}</select>
    </div>
  );
  return (
    <div className="dk-scroll-center"><div className="dk-wrap">
      <div className="dk-pane-title">Configurações</div>
      <div className="dk-pane-sub" style={{marginBottom:18}}>Opções gerais do atendimento da sua empresa.</div>

      <div className="dk-card" style={{padding:22}}>
        <div className="set-grid">
          {sel('Avaliações', ['Habilitadas','Desabilitadas'], 'Habilitadas')}
          {sel('Gerenciamento de expediente', ['Por empresa','Por fila','Desabilitado'], 'Por fila')}
          {sel('Mensagens de grupos', ['Ignorar','Atender'], 'Ignorar')}
          {sel('Aceitar chamadas', ['Aceitar','Não aceitar'], 'Não aceitar')}
          {sel('Tipo de chatbot', ['Texto','Botões','Lista'], 'Texto')}
          {sel('Abrir tickets fora do expediente', ['Sim','Não'], 'Não')}
        </div>
      </div>

      <div className="set-band">Horário de atendimento</div>
      <div className="dk-card">
        <div className="dk-row"><div className="grow"><div className="t">Segunda a Sexta</div><div className="d">Horário comercial</div></div><span style={{fontWeight:700,color:'var(--text-2)'}}>08:00 – 18:00</span></div>
        <div className="dk-row"><div className="grow"><div className="t">Sábado</div><div className="d">Meio período</div></div><span style={{fontWeight:700,color:'var(--text-2)'}}>09:00 – 13:00</span></div>
        <div className="dk-row"><div className="grow"><div className="t">Domingo e feriados</div><div className="d">Fora do expediente — IA assume</div></div><span className="dk-pill warn"><span className="pd"></span>Fechado</span></div>
      </div>

      <div className="set-band">Encerramento automático por inatividade</div>
      <div className="dk-card">
        <div className="dk-row">
          <div className="grow"><div className="t">Encerrar conversas inativas</div><div className="d">Fecha o atendimento automaticamente após um período sem resposta do cliente.</div></div>
          <Switch on={autoClose} onClick={()=>setAutoClose(a=>!a)} />
        </div>
        <div className="dk-row" style={{opacity:autoClose?1:.5,pointerEvents:autoClose?'auto':'none'}}>
          <div className="grow"><div className="t">Tempo de inatividade</div><div className="d">Aguarda este período antes de encerrar.</div></div>
          <div style={{display:'flex',gap:6}}>
            {['15 min','30 min','1 h','2 h','24 h'].map(t=>(
              <button key={t} className={'timechip'+(timeout===t?' on':'')} onClick={()=>setTimeoutVal(t)}>{t}</button>
            ))}
          </div>
        </div>
        <div className="dk-row" style={{opacity:autoClose?1:.5,pointerEvents:autoClose?'auto':'none'}}>
          <div className="grow"><div className="t">Avisar antes de encerrar</div><div className="d">Envia uma mensagem de aviso alguns minutos antes do fechamento.</div></div>
          <Switch on={warnFirst} onClick={()=>setWarnFirst(w=>!w)} />
        </div>
        <div style={{padding:'4px 20px 18px',opacity:autoClose?1:.5,pointerEvents:autoClose?'auto':'none'}}>
          <div className="fl-field"><label>Mensagem de encerramento</label>
            <textarea className="fl-textarea" defaultValue="Encerramos este atendimento por inatividade. Se precisar, é só chamar novamente — estamos por aqui! 💜" /></div>
        </div>
      </div>

      <div className="set-band">Mensagens automáticas</div>
      <div className="dk-card" style={{padding:22,display:'flex',flexDirection:'column',gap:16}}>
        <div className="fl-field"><label>Mensagem de saudação</label>
          <textarea className="fl-textarea" defaultValue="Olá! Seja bem-vindo(a) à WPLS. Em instantes você será atendido. 💜" /></div>
        <div className="fl-field"><label>Mensagem de ausência (fora do expediente)</label>
          <textarea className="fl-textarea" defaultValue="No momento estamos fora do horário de atendimento. Deixe sua mensagem que retornaremos assim que possível!" /></div>
        <button className="btn btn-primary" style={{alignSelf:'flex-start'}} onClick={()=>toast('Configurações salvas')}>{Ico.check} Salvar configurações</button>
      </div>
    </div></div>
  );
}

/* =====================================================================
   API OFICIAL — self-connect card (used inside Canais)
   ===================================================================== */
function OfficialApiCard({ toast }) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const connect = () => { setConnecting(true); setTimeout(()=>{ setConnecting(false); setConnected(true); toast('Conta Meta conectada com sucesso'); }, 1400); };
  return (
    <div className="dk-card dk-chan" style={{maxWidth:560, borderColor: connected?'rgba(22,163,74,.4)':'var(--border)'}}>
      <div className="dk-chan-top">
        <div className="dk-chan-ic" style={{background:'#1877F2',color:'#fff'}}>{FIco.meta}</div>
        <div style={{flex:1,minWidth:0}}>
          <div className="dk-chan-name">WhatsApp Business API · Oficial</div>
          <div className="dk-chan-meta">{connected?'+55 21 99888-7766 · WABA verificada':'Cloud API da Meta — homologada'}</div>
        </div>
        <span className={'dk-pill '+(connected?'ok':'off')}><span className="pd"></span>{connected?'Conectado':'Não conectado'}</span>
      </div>
      {connected ? (
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:14,paddingTop:14,borderTop:'1px solid var(--border)'}}>
          <span style={{fontSize:12,fontWeight:700,color:'var(--text-3)',display:'inline-flex',gap:6,alignItems:'center'}}>{Ico.check} Conta do gestor · permissão de API concedida</span>
          <button className="mini-btn" onClick={()=>{setConnected(false);toast('Conta desconectada');}}>Desconectar</button>
        </div>
      ) : (
        <div style={{marginTop:14,paddingTop:14,borderTop:'1px solid var(--border)'}}>
          <p style={{fontSize:13,color:'var(--text-2)',fontWeight:500,lineHeight:1.5,margin:'0 0 13px'}}>
            Integração <b>autoconfigurável</b>: conecte a conta da Meta que já tem permissão de acesso à API Oficial — tudo na conta do gestor da empresa, sem suporte técnico.
          </p>
          <button className="btn" style={{background:'#1877F2',color:'#fff',width:'100%'}} onClick={connect} disabled={connecting}>
            {connecting ? <React.Fragment><span className="dk-typing" style={{padding:0}}><span className="ai-pulse"></span><span className="ai-pulse"></span><span className="ai-pulse"></span></span> Conectando…</React.Fragment> : <React.Fragment>{FIco.meta} Conectar conta Meta</React.Fragment>}
          </button>
        </div>
      )}
    </div>
  );
}

/* =====================================================================
   DISTRIBUIÇÃO de atendimentos (regras do gestor)
   ===================================================================== */
const DIST_LOAD = [3, 5, 0, 2]; // atendimentos abertos por membro (MEMBERS)

function DistribuicaoScreen({ toast }) {
  const [master, setMaster] = useState(true);
  const [rules, setRules] = useState({ disp:true, carga:true, fila:false });
  const set = k => setRules(r => ({...r, [k]:!r[k]}));

  // prioridade fixa: disponibilidade > carga > fila
  const RULES = [
    { k:'disp',  n:'Por disponibilidade', d:'Distribui apenas para operadores marcados como “Disponível”.', ic:FIco.userCheck, c:'#16a34a' },
    { k:'carga', n:'Por carga de trabalho', d:'Envia para quem tem menos atendimentos abertos no momento.', ic:FIco.scale, c:'#2a688f' },
    { k:'fila',  n:'Por ordem na fila', d:'Rodízio sequencial entre os operadores (round-robin).', ic:FIco.order, c:'#7c3aed' },
  ];
  const active = RULES.filter(r => rules[r.k]);

  // operadores + simulação de quem recebe o próximo ticket
  const ops = MEMBERS.map((m,i)=>({ ...m, abertos: DIST_LOAD[i] }));
  let next = null;
  if(master){
    let pool = [...ops];
    if(rules.disp) pool = pool.filter(o=>o.online);
    if(pool.length){
      let cand = [...pool];
      if(rules.carga) cand.sort((a,b)=>a.abertos-b.abertos);
      next = cand[0]; // se só 'fila', mantém ordem original
    }
  }
  const maxLoad = Math.max(...DIST_LOAD, 1);

  return (
    <div className="dk-scroll-center"><div className="dk-wrap">
      <div className="dk-pane-title">Distribuição de atendimentos</div>
      <div className="dk-pane-sub" style={{marginBottom:18}}>Defina como os novos atendimentos são repartidos entre a equipe.</div>

      <div className={'dk-card ia-master'+(master?' on':'')} style={{marginBottom:18}}>
        <div className="ia-master-ic">{FIco.dist}</div>
        <div style={{flex:1}}><div style={{fontWeight:800,fontSize:18}}>Distribuição automática</div><div style={{fontSize:13.5,color:master?'rgba(255,255,255,.85)':'var(--text-3)',fontWeight:600}}>{master?'Tickets são roteados automaticamente':'Desligada — atribuição manual'}</div></div>
        <Switch on={master} onClick={()=>setMaster(m=>!m)} />
      </div>

      <div className="dk-sec-h">Regras ativas <span className="s">ative uma, algumas ou todas</span></div>
      <div className="dk-card" style={{opacity:master?1:.5,pointerEvents:master?'auto':'none',marginBottom:18}}>
        {RULES.map(r => {
          const on = rules[r.k];
          const prio = on ? active.findIndex(a=>a.k===r.k)+1 : null;
          return (
            <div className="dist-rule" key={r.k}>
              <span className={'dist-rule-prio'+(on?'':' off')}>{on?prio:'—'}</span>
              <div className="dist-rule-ic" style={{background:r.c}}>{r.ic}</div>
              <div style={{flex:1}}><div style={{fontWeight:800,fontSize:15}}>{r.n}</div><div style={{fontSize:12.5,color:'var(--text-3)',fontWeight:600,marginTop:2}}>{r.d}</div></div>
              <Switch on={on} onClick={()=>set(r.k)} />
            </div>
          );
        })}
      </div>

      <div className="dist-cascade" style={{marginBottom:18}}>
        <div className="dist-cascade-t">{FIco.dist} Ordem de prioridade aplicada</div>
        {active.length===0 ? (
          <div className="dist-empty">{master?'Nenhuma regra ativa — os tickets ficam na fila geral aguardando atribuição manual.':'Distribuição automática desligada.'}</div>
        ) : (
          <React.Fragment>
            <div className="dist-flow">
              {active.map((r,i)=>(
                <React.Fragment key={r.k}>
                  {i>0 && <span className="dist-arrow">{FIco.arrowR}</span>}
                  <span className="dist-step"><span className="ds-n">{i+1}</span><span className="ds-l">{r.n.replace('Por ','')}</span></span>
                </React.Fragment>
              ))}
            </div>
            <div style={{fontSize:13,color:'var(--text-2)',fontWeight:600,marginTop:13,lineHeight:1.5}}>
              A disponibilidade é avaliada primeiro, depois a carga de trabalho e, por fim, a ordem na fila — exatamente nessa sequência.
            </div>
          </React.Fragment>
        )}
      </div>

      <div className="dk-sec-h">Equipe agora <span className="s">simulação do próximo atendimento</span></div>
      <div className="dk-card">
        <div className="dk-th" style={{gridTemplateColumns:'2fr 1fr 1.4fr auto'}}><span>Operador</span><span>Status</span><span>Carga atual</span><span></span></div>
        {ops.map(o => {
          const isNext = next && next.n===o.n;
          return (
            <div key={o.n} className="dk-tenant-row" style={{gridTemplateColumns:'2fr 1fr 1.4fr auto', background:isNext?'var(--brand-grad-soft)':undefined}}>
              <div className="dk-tenant-id">
                <div style={{position:'relative'}}><Avatar name={o.n} color={o.color} size={38} /><span className="presence" style={{background:o.online?'var(--ok)':'var(--text-3)'}}></span></div>
                <div style={{minWidth:0}}><div style={{fontWeight:800,fontSize:14,whiteSpace:'nowrap'}}>{o.n}</div><div style={{fontSize:12,color:'var(--text-3)',fontWeight:600}}>{o.queue}</div></div>
              </div>
              <span><span className="dk-pill" style={{color:o.online?'var(--ok)':'var(--text-3)',background:o.online?'rgba(22,163,74,.13)':'var(--surface-2)'}}><span className="pd"></span>{o.online?'Disponível':'Ausente'}</span></span>
              <span style={{display:'inline-flex',alignItems:'center',gap:9}}>
                <span className="load-bar"><span style={{width:(o.abertos/maxLoad*100)+'%',background:o.abertos>=4?'var(--warn)':'var(--brand-grad)'}}></span></span>
                <span style={{fontSize:12.5,fontWeight:700,color:'var(--text-2)'}}>{o.abertos} abertos</span>
              </span>
              <span>{isNext && <span className="dist-next">{FIco.userCheck} Próximo a receber</span>}</span>
            </div>
          );
        })}
      </div>
      <div style={{display:'flex',justifyContent:'flex-end',marginTop:16}}>
        <button className="btn btn-primary" onClick={()=>toast('Regras de distribuição salvas')}>{Ico.check} Salvar regras</button>
      </div>
    </div></div>
  );
}

Object.assign(window, { FIco, FluxosScreen, FunisScreen, IAConfig, ConfiguracoesScreen, OfficialApiCard, DistribuicaoScreen });
