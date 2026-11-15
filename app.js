/**
 * Clarius Interactive Landing Page Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initWorkflowCanvas();
  initCopyButtons();
  initDeployTabs();
  initIntegrations();
  initPricingToggle();
  initFaqAccordion();
  initMobileMenu();
});

// ==========================================
// 1. WORKFLOW CANVAS & SIMULATION
// ==========================================

const nodeDataMap = {
  webhook: {
    title: 'Webhook Entrada (POST /api/leads)',
    time: '12ms',
    json: {
      event: 'lead_form_submitted',
      timestamp: '2026-11-15T16:45:00Z',
      headers: {
        'content-type': 'application/json',
        'x-source': 'landing_pricing_page'
      },
      payload: {
        company: 'TechGlobal S.L.',
        contact_name: 'Carlos Mendoza',
        email: 'carlos.m@techglobal.com',
        current_tool: 'Zapier / Make',
        monthly_executions: '2,500,000',
        requirement: 'Migración a infraestructura propia por privacidad y reducción de costes.'
      }
    }
  },
  ai: {
    title: 'Agente de IA (Gemini 1.5 Pro + RAG)',
    time: '164ms',
    json: {
      model: 'gemini-1.5-pro-preview',
      system_prompt: 'Eres un clasificador de oportunidades B2B y generador de contexto para CRM.',
      input_tokens: 412,
      output_tokens: 186,
      ai_decision: {
        intent: 'enterprise_migration',
        score: 9.8,
        priority: 'URGENT_VIP',
        summary: 'Lead con 2.5M ejecuciones/mes. Motivo principal: costes de Zapier y GDPR.',
        recommended_action: 'Agendar demo personalizada con arquitecto de soluciones dentro de 1h.'
      }
    }
  },
  db: {
    title: 'PostgreSQL Database (INSERT)',
    time: '28ms',
    json: {
      database: 'production_analytics_db',
      table: 'leads_pipeline',
      operation: 'INSERT_ROW',
      query: 'INSERT INTO leads_pipeline (company, email, score, status, ai_summary) VALUES ($1, $2, $3, $4, $5) RETURNING id;',
      result: {
        inserted_id: 89412,
        status: 'SUCCESS_COMMITTED',
        affected_rows: 1
      }
    }
  },
  slack: {
    title: 'Slack Enterprise (#leads-vip)',
    time: '83ms',
    json: {
      channel: '#leads-vip',
      bot_name: 'Clarius LeadBot',
      blocks: [
        {
          type: 'header',
          text: '🔥 Oportunidad Enterprise Detectada (Score 9.8/10)'
        },
        {
          type: 'section',
          text: '*Empresa:* TechGlobal S.L. | *Contacto:* Carlos Mendoza'
        },
        {
          type: 'context',
          text: 'Resumen IA: Buscan migrar 2.5M de tareas desde Zapier a Self-Hosted.'
        },
        {
          type: 'actions',
          elements: [
            { type: 'button', text: 'Tomar Lead', style: 'primary' },
            { type: 'button', text: 'Abrir en CRM' }
          ]
        }
      ]
    }
  }
};

let isSimulating = false;

function initWorkflowCanvas() {
  const canvas = document.getElementById('workflowCanvas');
  const runBtn = document.getElementById('runWorkflowBtn');
  const playButtonText = document.getElementById('playButtonText');
  const playIcon = document.getElementById('playIcon');
  const statusBadge = document.getElementById('executionStatusBadge');
  const statusPulse = document.getElementById('statusPulse');
  const statusText = document.getElementById('statusText');

  const inspector = document.getElementById('nodeInspector');
  const inspectorName = document.getElementById('inspectorNodeName');
  const inspectorTime = document.getElementById('inspectorExecutionTime');
  const inspectorJson = document.getElementById('inspectorJson');
  const closeInspectorBtn = document.getElementById('closeInspectorBtn');

  // Draw initial wires
  updateWires();
  window.addEventListener('resize', updateWires);

  // Inspector Node click listeners
  document.querySelectorAll('.workflow-node').forEach(node => {
    node.addEventListener('click', () => {
      const nodeKey = node.getAttribute('data-node');
      showNodeData(nodeKey);
    });
  });

  if (closeInspectorBtn) {
    closeInspectorBtn.addEventListener('click', () => {
      inspector.classList.toggle('opacity-50');
    });
  }

  function showNodeData(nodeKey) {
    const data = nodeDataMap[nodeKey];
    if (!data) return;
    inspectorName.textContent = data.title;
    inspectorTime.textContent = `Latencia: ${data.time}`;
    inspectorJson.textContent = JSON.stringify(data.json, null, 2);
    
    // Highlight selected node
    document.querySelectorAll('.workflow-node').forEach(n => {
      n.classList.remove('ring-2', 'ring-brand-500');
    });
    const target = document.querySelector(`[data-node="${nodeKey}"]`);
    if (target) target.classList.add('ring-2', 'ring-brand-500');
  }

  // Simulation runner
  if (runBtn) {
    runBtn.addEventListener('click', () => {
      if (isSimulating) return;
      startWorkflowSimulation();
    });
  }

  function startWorkflowSimulation() {
    isSimulating = true;
    runBtn.disabled = true;
    runBtn.classList.add('opacity-70', 'cursor-not-allowed');
    playButtonText.textContent = 'Ejecutando...';

    // Reset nodes visual state
    resetNodesVisual();

    // Wire pulse elements
    const p1 = document.getElementById('wire-1-pulse');
    const p2 = document.getElementById('wire-2-pulse');
    const p3 = document.getElementById('wire-3-pulse');
    const p4 = document.getElementById('wire-4-pulse');

    // STEP 1: Webhook Trigger
    setStatus('running', 'Webhook disparado: Recibiendo petición POST HTTP (12ms)...');
    highlightNode('node-1', 'executing');
    showNodeData('webhook');

    setTimeout(() => {
      highlightNode('node-1', 'completed');
      setNodeBadge('badge-node-1', '✔ 200 OK', 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40');
      
      // Wire 1 flows to AI
      if (p1) p1.setAttribute('opacity', '1');

      // STEP 2: AI Agent Execution
      setTimeout(() => {
        if (p1) p1.setAttribute('opacity', '0');
        highlightNode('node-2', 'executing');
        setStatus('running', 'Agente IA analizando intención y puntuando con Gemini 1.5 Pro (164ms)...');
        showNodeData('ai');

        setTimeout(() => {
          highlightNode('node-2', 'completed');
          setNodeBadge('badge-node-2', '✔ Score 9.8', 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40');

          // Wires 3 & 4 pulse towards DB and Slack
          if (p3) p3.setAttribute('opacity', '1');
          if (p4) p4.setAttribute('opacity', '1');

          // STEP 3: DB & Slack parallel execution
          setTimeout(() => {
            if (p3) p3.setAttribute('opacity', '0');
            if (p4) p4.setAttribute('opacity', '0');

            highlightNode('node-3', 'executing');
            highlightNode('node-4', 'executing');
            setStatus('running', 'Guardando en PostgreSQL y enviando alerta a Slack en paralelo (83ms)...');
            showNodeData('slack');

            setTimeout(() => {
              highlightNode('node-3', 'completed');
              highlightNode('node-4', 'completed');
              setNodeBadge('badge-node-3', '✔ Fila #89412', 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40');
              setNodeBadge('badge-node-4', '✔ Notificado', 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40');

              // FINAL: Success
              setStatus('success', '✔ Flujo ejecutado con éxito en 287ms (0 errores)');
              playButtonText.textContent = 'Ejecutar de nuevo';
              runBtn.disabled = false;
              runBtn.classList.remove('opacity-70', 'cursor-not-allowed');
              isSimulating = false;
            }, 600);

          }, 450);

        }, 800);

      }, 400);

    }, 500);
  }

  function setStatus(type, msg) {
    statusText.textContent = msg;
    if (type === 'running') {
      statusPulse.className = 'w-2 h-2 rounded-full bg-brand-400 animate-ping';
      statusText.className = 'text-brand-400 font-mono';
    } else if (type === 'success') {
      statusPulse.className = 'w-2 h-2 rounded-full bg-emerald-400';
      statusText.className = 'text-emerald-400 font-mono font-semibold';
    } else {
      statusPulse.className = 'w-2 h-2 rounded-full bg-slate-500';
      statusText.className = 'text-slate-400 font-mono';
    }
  }

  function highlightNode(id, state) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('executing', 'completed');
    if (state) el.classList.add(state);
  }

  function setNodeBadge(id, text, classes) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.className = `node-badge text-[10px] px-1.5 py-0.5 rounded font-mono ${classes}`;
  }

  function resetNodesVisual() {
    ['node-1', 'node-2', 'node-3', 'node-4'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('executing', 'completed', 'ring-2', 'ring-brand-500');
    });
    setNodeBadge('badge-node-1', 'Trigger', 'bg-dark-surface border border-dark-border text-slate-400');
    setNodeBadge('badge-node-2', 'IA Core', 'bg-dark-surface border border-dark-border text-slate-400');
    setNodeBadge('badge-node-3', 'BD', 'bg-dark-surface border border-dark-border text-slate-400');
    setNodeBadge('badge-node-4', 'Notif', 'bg-dark-surface border border-dark-border text-slate-400');
  }

  function updateWires() {
    const canvas = document.getElementById('workflowCanvas');
    const n1 = document.getElementById('node-1');
    const n2 = document.getElementById('node-2');
    const n3 = document.getElementById('node-3');
    const n4 = document.getElementById('node-4');

    if (!canvas || !n1 || !n2 || !n3 || !n4) return;

    const cRect = canvas.getBoundingClientRect();
    const r1 = n1.getBoundingClientRect();
    const r2 = n2.getBoundingClientRect();
    const r3 = n3.getBoundingClientRect();
    const r4 = n4.getBoundingClientRect();

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Connect vertically: bottom to top
      setCurve('wire-1', r1.left + r1.width / 2 - cRect.left, r1.bottom - cRect.top, r2.left + r2.width / 2 - cRect.left, r2.top - cRect.top, true);
      setCurve('wire-3', r2.left + r2.width / 2 - cRect.left, r2.bottom - cRect.top, r3.left + r3.width / 2 - cRect.left, r3.top - cRect.top, true);
      setCurve('wire-4', r2.left + r2.width / 2 - cRect.left, r2.bottom - cRect.top, r4.left + r4.width / 2 - cRect.left, r4.top - cRect.top, true);
    } else {
      // Connect horizontally: right side of A to left side of B
      setCurve('wire-1', r1.right - cRect.left, r1.top + r1.height / 2 - cRect.top, r2.left - cRect.left, r2.top + r2.height / 2 - cRect.top, false);
      setCurve('wire-3', r2.right - cRect.left, r2.top + r2.height / 2 - cRect.top - 15, r3.left - cRect.left, r3.top + r3.height / 2 - cRect.top, false);
      setCurve('wire-4', r2.right - cRect.left, r2.top + r2.height / 2 - cRect.top + 15, r4.left - cRect.left, r4.top + r4.height / 2 - cRect.top, false);
    }

    // Mirror to pulse wires
    mirrorPulse('wire-1', 'wire-1-pulse');
    mirrorPulse('wire-3', 'wire-3-pulse');
    mirrorPulse('wire-4', 'wire-4-pulse');
  }

  function setCurve(id, x1, y1, x2, y2, vertical) {
    const el = document.getElementById(id);
    if (!el) return;
    let d = '';
    if (vertical) {
      const dy = (y2 - y1) * 0.5;
      d = `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`;
    } else {
      const dx = (x2 - x1) * 0.5;
      d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
    }
    el.setAttribute('d', d);
  }

  function mirrorPulse(srcId, pulseId) {
    const src = document.getElementById(srcId);
    const pulse = document.getElementById(pulseId);
    if (src && pulse) {
      pulse.setAttribute('d', src.getAttribute('d') || '');
    }
  }
}

// ==========================================
// 2. CLIPBOARD COPY BUTTONS
// ==========================================
function initCopyButtons() {
  const copyDockerBtn = document.getElementById('copyDockerBtn');
  const dockerCmd = document.getElementById('dockerCommand');
  const copyIcon = document.getElementById('copyIcon');
  const copiedIcon = document.getElementById('copiedIcon');

  if (copyDockerBtn && dockerCmd) {
    copyDockerBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(dockerCmd.textContent.trim()).then(() => {
        copyIcon.classList.add('hidden');
        copiedIcon.classList.remove('hidden');
        setTimeout(() => {
          copyIcon.classList.remove('hidden');
          copiedIcon.classList.add('hidden');
        }, 2000);
      });
    });
  }

  const copyDeployBtn = document.getElementById('copyDeployCmdBtn');
  if (copyDeployBtn) {
    copyDeployBtn.addEventListener('click', () => {
      const text = document.getElementById('cliOutput').innerText;
      navigator.clipboard.writeText(text).then(() => {
        copyDeployBtn.innerHTML = `
          <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          <span class="text-emerald-400">¡Copiado!</span>
        `;
        setTimeout(() => {
          copyDeployBtn.innerHTML = `
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            <span>Copiar comando</span>
          `;
        }, 2000);
      });
    });
  }
}

// ==========================================
// 3. DEPLOY TERMINAL TABS
// ==========================================
function initDeployTabs() {
  const tabs = document.querySelectorAll('.deploy-tab');
  const output = document.getElementById('cliOutput');

  const snippets = {
    docker: `
<p class="text-slate-500 mb-2"># Inicia Clarius en segundo plano en el puerto 5678</p>
<p class="text-brand-400">$ docker run -d \\</p>
<p class="text-slate-300 pl-4">--name clarius \\</p>
<p class="text-slate-300 pl-4">-p 5678:5678 \\</p>
<p class="text-slate-300 pl-4">-v clarius_data:/home/node/.clarius \\</p>
<p class="text-slate-300 pl-4">--restart unless-stopped \\</p>
<p class="text-slate-300 pl-4">clarius/clarius:latest</p>
<p class="text-emerald-400 mt-4">✔ Contenedor iniciado en http://localhost:5678</p>
    `,
    compose: `
<p class="text-slate-500 mb-2"># docker-compose.yml para producción con PostgreSQL y Redis</p>
<p class="text-brand-400">$ curl -O https://get.clarius.io/docker-compose.yml</p>
<p class="text-brand-400">$ docker compose up -d</p>
<p class="text-slate-300 mt-2">[+] Running 3/3</p>
<p class="text-slate-400 pl-2">✔ Network clarius_default    Created</p>
<p class="text-slate-400 pl-2">✔ Container clarius-postgres  Started</p>
<p class="text-slate-400 pl-2">✔ Container clarius-app       Started</p>
<p class="text-emerald-400 mt-2">✔ Servicio listo con base de datos en alta disponibilidad</p>
    `,
    k8s: `
<p class="text-slate-500 mb-2"># Despliegue con Helm Chart en tu clúster Kubernetes</p>
<p class="text-brand-400">$ helm repo add clarius https://charts.clarius.io</p>
<p class="text-brand-400">$ helm install my-clarius clarius/clarius \\</p>
<p class="text-slate-300 pl-4">--set workers.replicas=4 \\</p>
<p class="text-slate-300 pl-4">--set ingress.enabled=true \\</p>
<p class="text-slate-300 pl-4">--set ingress.hostname="workflows.tuempresa.com"</p>
<p class="text-emerald-400 mt-3">✔ Ingress configurado con TLS automático vía Let's Encrypt</p>
    `,
    npm: `
<p class="text-slate-500 mb-2"># Instalación global vía npm en tu máquina local o servidor Node.js</p>
<p class="text-brand-400">$ npm install -g clarius</p>
<p class="text-brand-400">$ clarius start</p>
<p class="text-slate-400 mt-2">Editor UI disponible en: http://localhost:5678</p>
<p class="text-emerald-400">✔ Servidor escuchando en modo desarrollo local</p>
    `
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-tab');
      if (snippets[target] && output) {
        output.innerHTML = snippets[target].trim();
      }
    });
  });
}

// ==========================================
// 4. INTEGRATIONS CATALOG & FILTER
// ==========================================
const integrationsData = [
  { name: 'OpenAI (GPT-4o)', category: 'ai', tag: 'LLM & Vision', icon: '🧠', color: 'from-emerald-500/20 to-emerald-600/10' },
  { name: 'Gemini 1.5 Pro', category: 'ai', tag: '2M Context', icon: '✨', color: 'from-blue-500/20 to-blue-600/10' },
  { name: 'Anthropic Claude 3.5', category: 'ai', tag: 'Razonamiento', icon: '⚡', color: 'from-amber-500/20 to-amber-600/10' },
  { name: 'Ollama & LM Studio', category: 'ai', tag: 'Local Offline', icon: '🦙', color: 'from-purple-500/20 to-purple-600/10' },
  { name: 'Pinecone / Qdrant', category: 'ai', tag: 'Vector Store', icon: '🌲', color: 'from-teal-500/20 to-teal-600/10' },
  
  { name: 'PostgreSQL & Timescale', category: 'database', tag: 'SQL / pgvector', icon: '🐘', color: 'from-cyan-500/20 to-cyan-600/10' },
  { name: 'Supabase', category: 'database', tag: 'Auth & Realtime', icon: '⚡', color: 'from-emerald-500/20 to-emerald-600/10' },
  { name: 'MongoDB & Atlas', category: 'database', tag: 'NoSQL JSON', icon: '🍃', color: 'from-green-500/20 to-green-600/10' },
  { name: 'Redis & BullMQ', category: 'database', tag: 'Queue & Cache', icon: '🔴', color: 'from-rose-500/20 to-rose-600/10' },
  { name: 'Snowflake & BigQuery', category: 'database', tag: 'Data Lake', icon: '❄️', color: 'from-blue-500/20 to-blue-600/10' },

  { name: 'Slack Enterprise', category: 'messaging', tag: 'Webhooks & Bots', icon: '💬', color: 'from-indigo-500/20 to-indigo-600/10' },
  { name: 'Discord', category: 'messaging', tag: 'Eventos & Alertas', icon: '🎮', color: 'from-purple-500/20 to-purple-600/10' },
  { name: 'WhatsApp Business API', category: 'messaging', tag: 'Meta Oficial', icon: '📱', color: 'from-emerald-500/20 to-emerald-600/10' },
  { name: 'HubSpot & Salesforce', category: 'messaging', tag: 'CRM Sync', icon: '🎯', color: 'from-orange-500/20 to-orange-600/10' },
  { name: 'SendGrid & Resend', category: 'messaging', tag: 'Email Transaccional', icon: '✉️', color: 'from-blue-500/20 to-blue-600/10' },

  { name: 'GitHub & GitLab', category: 'dev', tag: 'CI/CD & Issues', icon: '🐙', color: 'from-slate-500/20 to-slate-600/10' },
  { name: 'Stripe & Paddle', category: 'dev', tag: 'Pagos & Webhooks', icon: '💳', color: 'from-violet-500/20 to-violet-600/10' },
  { name: 'AWS S3 & Lambda', category: 'dev', tag: 'Serverless', icon: '☁️', color: 'from-amber-500/20 to-amber-600/10' },
  { name: 'Linear & Jira', category: 'dev', tag: 'Gestión de Tareas', icon: '📐', color: 'from-indigo-500/20 to-indigo-600/10' },
  { name: 'Google Sheets & Drive', category: 'dev', tag: 'Workspace', icon: '📊', color: 'from-emerald-500/20 to-emerald-600/10' },
];

function initIntegrations() {
  const grid = document.getElementById('integrationsGrid');
  const searchInput = document.getElementById('integrationSearch');
  const tabs = document.querySelectorAll('.cat-tab');

  let currentCategory = 'all';
  let searchQuery = '';

  function render() {
    if (!grid) return;
    const filtered = integrationsData.filter(item => {
      const matchCat = currentCategory === 'all' || item.category === currentCategory;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-12 text-center text-slate-500 text-sm">
          No se encontraron conectores para "${searchQuery}". Recuerda que puedes conectar cualquier API REST mediante el nodo HTTP genérico.
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(item => `
      <div class="integration-card bg-dark-card border border-dark-border rounded-xl p-4 flex items-center justify-between group cursor-pointer hover:border-brand-500/50">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} border border-dark-border flex items-center justify-center text-xl shrink-0">
            ${item.icon}
          </div>
          <div>
            <h4 class="text-xs font-bold text-white group-hover:text-brand-400 transition-colors">${item.name}</h4>
            <span class="text-[10px] text-slate-400 font-mono">${item.tag}</span>
          </div>
        </div>
        <svg class="w-4 h-4 text-slate-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </div>
    `).join('');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-category');
      render();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      render();
    });
  }

  render();
}

// ==========================================
// 5. PRICING TOGGLE (MONTHLY / ANNUAL)
// ==========================================
function initPricingToggle() {
  const btnMonthly = document.getElementById('billingMonthly');
  const btnAnnual = document.getElementById('billingAnnual');
  const pricePro = document.getElementById('pricePro');
  const periodPro = document.getElementById('periodPro');

  if (!btnMonthly || !btnAnnual || !pricePro) return;

  btnMonthly.addEventListener('click', () => {
    btnMonthly.classList.add('bg-brand-500', 'text-white');
    btnMonthly.classList.remove('text-slate-400');
    btnAnnual.classList.remove('bg-brand-500', 'text-white');
    btnAnnual.classList.add('text-slate-400');

    pricePro.textContent = '$24';
    periodPro.textContent = '/ mes (facturado mensual)';
  });

  btnAnnual.addEventListener('click', () => {
    btnAnnual.classList.add('bg-brand-500', 'text-white');
    btnAnnual.classList.remove('text-slate-400');
    btnMonthly.classList.remove('bg-brand-500', 'text-white');
    btnMonthly.classList.add('text-slate-400');

    pricePro.textContent = '$19';
    periodPro.textContent = '/ mes (facturado $228 al año, ahorras $60)';
  });
}

// ==========================================
// 6. FAQ ACCORDION
// ==========================================
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const chevron = item.querySelector('.faq-chevron');

    if (questionBtn && answer && chevron) {
      questionBtn.addEventListener('click', () => {
        const isHidden = answer.classList.contains('hidden');

        // Close other items
        items.forEach(other => {
          const otherAns = other.querySelector('.faq-answer');
          const otherChev = other.querySelector('.faq-chevron');
          if (otherAns && otherChev) {
            otherAns.classList.add('hidden');
            otherChev.classList.remove('rotate-180', 'text-brand-400');
          }
        });

        // Toggle current item
        if (isHidden) {
          answer.classList.remove('hidden');
          chevron.classList.add('rotate-180', 'text-brand-400');
        } else {
          answer.classList.add('hidden');
          chevron.classList.remove('rotate-180', 'text-brand-400');
        }
      });
    }
  });
}

// ==========================================
// 7. MOBILE MENU
// ==========================================
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  const links = document.querySelectorAll('.mobile-link');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
    });
  });
}
