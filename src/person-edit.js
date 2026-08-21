const STORAGE_KEY='mgs-control-vacaciones-personal-v030';

function normalizeRut(rut=''){return rut.replace(/[^0-9kK]/g,'').toUpperCase()}
function validRutShape(rut=''){const clean=normalizeRut(rut);return clean.length>=8&&clean.length<=9}

function getPeople(){
  try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')}
  catch{return []}
}
function setPeople(people){localStorage.setItem(STORAGE_KEY,JSON.stringify(people))}

function ensureStyles(){
  if(document.getElementById('person-edit-styles'))return;
  const style=document.createElement('style');
  style.id='person-edit-styles';
  style.textContent=`
    .person-edit-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .person-edit-modal{position:fixed;inset:0;background:rgba(15,23,42,.55);display:flex;align-items:center;justify-content:center;padding:20px;z-index:9999}
    .person-edit-card{background:#fff;width:min(760px,100%);max-height:92vh;overflow:auto;border-radius:16px;padding:22px;box-shadow:0 24px 60px rgba(0,0,0,.28)}
    .person-edit-card h2{margin:0 0 4px}.person-edit-card p{margin:0 0 18px;color:#64748b}
    .person-edit-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.person-edit-card label{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:600;color:#334155}
    .person-edit-card input,.person-edit-card select{width:100%;box-sizing:border-box;padding:10px 11px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;color:#0f172a;font:inherit}
    .person-edit-footer{display:flex;justify-content:flex-end;gap:10px;margin-top:20px}.person-edit-error{margin-top:12px;padding:10px 12px;border-radius:9px;background:#fff1f2;color:#be123c;font-size:13px}
    @media(max-width:640px){.person-edit-grid{grid-template-columns:1fr}.person-edit-card{padding:16px}}
  `;
  document.head.appendChild(style);
}

function selectedPerson(){
  const detail=document.querySelector('.panel.detail');
  const name=detail?.querySelector('.panel-title h2')?.textContent?.trim();
  if(!name)return null;
  return getPeople().find(p=>p.name===name)||null;
}

function closeModal(){document.querySelector('.person-edit-modal')?.remove()}

function openEditor(){
  const person=selectedPerson();
  if(!person){alert('No fue posible identificar a la persona seleccionada.');return}
  closeModal();
  const modal=document.createElement('div');
  modal.className='person-edit-modal';
  modal.innerHTML=`
    <form class="person-edit-card">
      <h2>Modificar información</h2>
      <p>Edita los datos de ${person.name}. El historial de vacaciones se conservará.</p>
      <div class="person-edit-grid">
        <label>Nombre completo *<input name="name" value="${escapeHtml(person.name||'')}" required></label>
        <label>RUT *<input name="rut" value="${escapeHtml(person.rut||'')}" required></label>
        <label>Correo electrónico<input type="email" name="email" value="${escapeHtml(person.email||'')}"></label>
        <label>Teléfono<input name="phone" value="${escapeHtml(person.phone||'')}"></label>
        <label>Área *<input name="area" value="${escapeHtml(person.area||'')}" required></label>
        <label>Cargo<input name="position" value="${escapeHtml(person.position||'')}"></label>
        <label>Fecha de ingreso *<input type="date" name="start" value="${escapeHtml(person.start||'')}" required></label>
        <label>Tipo de contrato<select name="contract">${['Indefinido','Plazo fijo','Honorarios','Otro'].map(x=>`<option ${person.contract===x?'selected':''}>${x}</option>`).join('')}</select></label>
        <label>Estado<select name="status"><option ${person.status==='Activo'?'selected':''}>Activo</option><option ${person.status==='Inactivo'?'selected':''}>Inactivo</option></select></label>
        <label>Ajuste de vacaciones (días)<input type="number" step="0.25" name="adjust" value="${Number(person.adjust||0)}"></label>
      </div>
      <div class="person-edit-error" hidden></div>
      <div class="person-edit-footer"><button type="button" data-cancel>Cancelar</button><button class="primary" type="submit">Guardar cambios</button></div>
    </form>`;
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
  modal.querySelector('[data-cancel]').addEventListener('click',closeModal);
  modal.querySelector('form').addEventListener('submit',e=>savePerson(e,person.id));
  document.body.appendChild(modal);
}

function escapeHtml(value=''){
  return String(value).replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
}

function savePerson(event,id){
  event.preventDefault();
  const form=event.currentTarget;
  const data=Object.fromEntries(new FormData(form).entries());
  const error=form.querySelector('.person-edit-error');
  const people=getPeople();
  const current=people.find(p=>p.id===id);
  if(!current)return;
  if(!data.name.trim()||!data.rut.trim()||!data.area.trim()||!data.start){showError(error,'Completa nombre, RUT, área y fecha de ingreso.');return}
  if(!validRutShape(data.rut)){showError(error,'Revisa el formato del RUT.');return}
  if(people.some(p=>p.id!==id&&normalizeRut(p.rut)===normalizeRut(data.rut))){showError(error,'Ya existe otra persona registrada con ese RUT.');return}
  const updated={...current,name:data.name.trim(),rut:data.rut.trim(),email:data.email.trim(),phone:data.phone.trim(),area:data.area.trim(),position:data.position.trim(),start:data.start,contract:data.contract,status:data.status,adjust:Number(data.adjust||0)};
  setPeople(people.map(p=>p.id===id?updated:p));
  closeModal();
  location.reload();
}

function showError(node,message){node.textContent=message;node.hidden=false}

function installButton(){
  ensureStyles();
  const header=document.querySelector('.panel.detail .panel-title');
  if(!header||header.querySelector('[data-person-edit]'))return;
  const existing=header.querySelector('button');
  const wrap=document.createElement('div');
  wrap.className='person-edit-actions';
  if(existing)header.replaceChild(wrap,existing);
  else header.appendChild(wrap);
  const edit=document.createElement('button');
  edit.type='button';edit.dataset.personEdit='1';edit.className='primary';edit.textContent='Modificar información';edit.addEventListener('click',openEditor);
  wrap.appendChild(edit);
  if(existing)wrap.appendChild(existing);
}

const observer=new MutationObserver(installButton);
observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('DOMContentLoaded',installButton);
installButton();
