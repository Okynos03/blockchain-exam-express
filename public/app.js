function getBaseUrl() {
  return document.getElementById('baseUrl').value.replace(/\/+$/, '');
}

function setStatus(text) {
  document.getElementById('status').textContent = text;
}

function setResponse(data) {
  document.getElementById('response').textContent =
    typeof data === 'string' ? data : JSON.stringify(data, null, 2);
}

async function request(method, path, body) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };

    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(getBaseUrl() + path, options);
    const text = await res.text();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }

    setStatus(res.status + ' ' + res.statusText);
    setResponse(parsed);
    return parsed;
  } catch (error) {
    setStatus('ERROR');
    setResponse({ error: error.message });
    return null;
  }
}

async function ping() {
  await request('GET', '/api/ping');
}

function fillSelect(id, data, labelBuilder, includeEmpty = false) {
  const select = document.getElementById(id);
  select.innerHTML = '';

  if (includeEmpty) {
    const empty = document.createElement('option');
    empty.value = '';
    empty.textContent = 'Selecciona una opción';
    select.appendChild(empty);
  }

  (data || []).forEach((item) => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = labelBuilder(item);
    select.appendChild(option);
  });
}

async function loadCatalogs() {
  const personas = await fetch(getBaseUrl() + '/api/personas').then((r) => r.json());
  const instituciones = await fetch(getBaseUrl() + '/api/instituciones').then((r) => r.json());
  const programas = await fetch(getBaseUrl() + '/api/programas').then((r) => r.json());

  fillSelect(
    'persona_id',
    personas,
    (item) => `${item.nombre} ${item.apellido_paterno} ${item.apellido_materno || ''}`,
    true
  );

  fillSelect(
    'institucion_id',
    instituciones,
    (item) => `${item.nombre} - ${item.estado || 'Sin estado'}`,
    true
  );

  fillSelect(
    'programa_id',
    programas,
    (item) => item.nombre,
    true
  );

  setStatus('Catálogos cargados');
  setResponse({
    personas: personas.length,
    instituciones: instituciones.length,
    programas: programas.length
  });
}

async function sendTransaction() {
  const body = {
    persona_id: document.getElementById('persona_id').value,
    institucion_id: document.getElementById('institucion_id').value,
    programa_id: document.getElementById('programa_id').value,
    fecha_inicio: document.getElementById('fecha_inicio').value,
    fecha_fin: document.getElementById('fecha_fin').value,
    titulo_obtenido: document.getElementById('titulo_obtenido').value,
    numero_cedula: document.getElementById('numero_cedula').value,
    titulo_tesis: document.getElementById('titulo_tesis').value,
    menciones: document.getElementById('menciones').value,
    firmado_por: document.getElementById('firmado_por').value
  };

  await request('POST', '/api/transactions', body);
}

async function mineBlock() {
  await request('POST', '/api/mine');
}

async function postJson(path, textareaId) {
  try {
    const body = JSON.parse(document.getElementById(textareaId).value);
    await request('POST', path, body);
  } catch {
    setStatus('ERROR');
    setResponse({ error: 'JSON inválido' });
  }
}

async function runCustom() {
  try {
    const method = document.getElementById('customMethod').value;
    const path = document.getElementById('customPath').value;
    const raw = document.getElementById('customBody').value;
    const body = method === 'GET' ? undefined : JSON.parse(raw || '{}');

    await request(method, path, body);
  } catch {
    setStatus('ERROR');
    setResponse({ error: 'JSON inválido en request personalizado' });
  }
}

async function copyResponse() {
  const text = document.getElementById('response').textContent;
  await navigator.clipboard.writeText(text);
  setStatus('Respuesta copiada');
}

window.request = request;
window.ping = ping;
window.loadCatalogs = loadCatalogs;
window.sendTransaction = sendTransaction;
window.mineBlock = mineBlock;
window.postJson = postJson;
window.runCustom = runCustom;
window.copyResponse = copyResponse;

loadCatalogs();