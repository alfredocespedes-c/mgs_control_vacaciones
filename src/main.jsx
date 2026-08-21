import React,{useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './styles.css';

const TODAY=new Date('2026-08-20T12:00:00');
const people=[
 {id:1,name:'Ana Torres',area:'Administración',start:'2024-01-15',adjust:3,vac:[['2026-02-09','2026-02-13'],['2026-08-24','2026-08-28']]},
 {id:2,name:'Bruno Díaz',area:'Operaciones',start:'2025-11-03',adjust:0,vac:[['2026-08-10','2026-08-14']]},
 {id:3,name:'Camila Soto',area:'Comercial',start:'2026-05-02',adjust:0,vac:[['2026-08-24','2026-08-28']]},
 {id:4,name:'Diego Rojas',area:'Operaciones',start:'2023-06-20',adjust:-2,vac:[['2025-12-22','2025-12-31'],['2026-08-24','2026-08-26']]},
 {id:5,name:'Elena Muñoz',area:'Finanzas',start:'2026-07-01',adjust:0,vac:[['2026-08-17','2026-08-21']]},
 {id:6,name:'Felipe Vera',area:'TI',start:'2022-03-10',adjust:1.5,vac:[['2026-01-19','2026-01-23'],['2026-08-24','2026-08-28']]},
 {id:7,name:'Gabriela León',area:'Personas',start:'2025-04-07',adjust:0,vac:[['2026-08-03','2026-08-07']]},
 {id:8,name:'Héctor Silva',area:'Logística',start:'2024-09-16',adjust:0,vac:[['2026-08-24','2026-08-28']]},
 {id:9,name:'Isidora Paz',area:'Comercial',start:'2026-02-12',adjust:0,vac:[['2026-07-27','2026-08-04']]},
 {id:10,name:'Javier Mora',area:'TI',start:'2021-08-01',adjust:-1,vac:[['2025-09-15','2025-09-19'],['2026-03-02','2026-03-06']]}
];
const holidays=new Set(['2026-08-15']);
function d(s){return new Date(s+'T12:00:00')}
function monthsWorked(start,at=TODAY){const a=d(start);let m=(at.getFullYear()-a.getFullYear())*12+(at.getMonth()-a.getMonth());if(at.getDate()<a.getDate())m--;return Math.max(0,m)}
function businessDays(a,b){let n=0,x=d(a),end=d(b);while(x<=end){const day=x.getDay(),key=x.toISOString().slice(0,10);if(day!==0&&day!==6&&!holidays.has(key))n++;x.setDate(x.getDate()+1)}return n}
function used(p,from='1900-01-01',to='2999-12-31'){return p.vac.reduce((s,v)=>s+(v[1]>=from&&v[0]<=to?businessDays(v[0]<from?from:v[0],v[1]>to?to:v[1]):0),0)}
function accrued(p){return monthsWorked(p.start)*1.25}
function balance(p){return accrued(p)+p.adjust-used(p)}
function fmt(n){return `${n.toFixed(2).replace('.',',')} días`}
function isNow(v){return d(v[0])<=TODAY&&TODAY<=d(v[1])}
function overlapCount(date){return people.filter(p=>p.vac.some(v=>v[0]<=date&&v[1]>=date)).length}

function pdfGeneral(){const doc=new jsPDF();doc.setFontSize(18);doc.text('MGS · Reporte general de vacaciones',14,18);doc.setFontSize(10);doc.text('Corte: 20-08-2026 · Acumulación automática: 1,25 días por mes trabajado',14,25);autoTable(doc,{startY:32,head:[['Persona','Área','Ingreso','Acumulado','Usado','Ajuste','Saldo']],body:people.map(p=>[p.name,p.area,p.start,accrued(p).toFixed(2),used(p),p.adjust.toFixed(2),balance(p).toFixed(2)])});doc.save('reporte-general-vacaciones.pdf')}
function pdfMonth(){const doc=new jsPDF();doc.setFontSize(18);doc.text('MGS · Vacaciones Agosto 2026',14,18);const rows=[];people.forEach(p=>p.vac.forEach(v=>{if(v[1]>='2026-08-01'&&v[0]<='2026-08-31')rows.push([p.name,p.area,v[0],v[1],businessDays(v[0]<'2026-08-01'?'2026-08-01':v[0],v[1]>'2026-08-31'?'2026-08-31':v[1])])}));autoTable(doc,{startY:28,head:[['Persona','Área','Desde','Hasta','Días hábiles']],body:rows});doc.save('vacaciones-agosto-2026.pdf')}

function App(){const [sel,setSel]=useState(people[0]);const [tab,setTab]=useState('personal');const alertDays=useMemo(()=>{let out=[];for(let i=1;i<=31;i++){let key=`2026-08-${String(i).padStart(2,'0')}`,c=overlapCount(key);if(c>4)out.push([key,c])}return out},[]);return <div className="app">
<header><div><b>MGS</b><span>Control de Vacaciones</span></div><small>Maqueta funcional · 10 personas · Agosto 2026</small></header>
<nav><button className={tab==='personal'?'on':''} onClick={()=>setTab('personal')}>Personal</button><button className={tab==='mov'?'on':''} onClick={()=>setTab('mov')}>Movimientos</button><button className={tab==='cal'?'on':''} onClick={()=>setTab('cal')}>Calendario</button><div className="spacer"/><button onClick={pdfGeneral}>Reporte general PDF</button><button onClick={pdfMonth}>Vacaciones del mes PDF</button></nav>
{alertDays.length>0&&<div className="warning"><b>Alerta de dotación:</b> hay fechas con más de 4 personas de vacaciones simultáneamente. {alertDays.map(x=><span key={x[0]}>{x[0]}: {x[1]} personas</span>)}</div>}
<main>{tab==='personal'&&<><section className="kpis"><article><small>Personas</small><strong>10</strong></article><article><small>De vacaciones hoy</small><strong>{people.filter(p=>p.vac.some(isNow)).length}</strong></article><article><small>Saldo negativo</small><strong>{people.filter(p=>balance(p)<0).length}</strong></article><article><small>Saldo total</small><strong>{people.reduce((s,p)=>s+balance(p),0).toFixed(1)}</strong></article></section><div className="grid"><section className="panel"><h2>Personal</h2><p className="muted">El saldo puede quedar negativo. Cada mes trabajado agrega 1,25 días automáticamente.</p><table><thead><tr><th>Persona</th><th>Área</th><th>Saldo</th></tr></thead><tbody>{people.map(p=><tr key={p.id} onClick={()=>setSel(p)} className={sel.id===p.id?'selected':''}><td>{p.name}</td><td>{p.area}</td><td><span className={balance(p)<0?'neg':'pos'}>{fmt(balance(p))}</span></td></tr>)}</tbody></table></section><section className="panel detail"><h2>{sel.name}</h2><div className="facts"><div><small>Fecha ingreso</small><b>{sel.start}</b></div><div><small>Meses trabajados</small><b>{monthsWorked(sel.start)}</b></div><div><small>Acumulado</small><b>{fmt(accrued(sel))}</b></div><div><small>Vacaciones usadas</small><b>{fmt(used(sel))}</b></div><div><small>Ajustes</small><b>{fmt(sel.adjust)}</b></div><div><small>Saldo actual</small><b className={balance(sel)<0?'neg':'pos'}>{fmt(balance(sel))}</b></div></div><h3>Histórico último año</h3>{sel.vac.filter(v=>v[1]>='2025-08-20').map((v,i)=><div className="history" key={i}><span>{v[0]} → {v[1]}</span><b>{businessDays(...v)} días hábiles</b></div>)}</section></div></>}
{tab==='mov'&&<section className="panel form"><h2>Registrar vacaciones</h2><p>Maqueta de flujo: permite registrar incluso cuando el saldo proyectado quede negativo. Antes de guardar se revisa la cantidad de personas simultáneas.</p><label>Persona<select><option>Camila Soto · saldo {fmt(balance(people[2]))}</option>{people.filter(x=>x.id!==3).map(p=><option key={p.id}>{p.name}</option>)}</select></label><div className="row"><label>Desde<input type="date" defaultValue="2026-08-24"/></label><label>Hasta<input type="date" defaultValue="2026-08-28"/></label></div><div className="warning inner"><b>Advertencia:</b> el 24–28 de agosto ya existen 5 personas programadas. La regla no bloquea: Administración puede continuar dejando trazabilidad.</div><button className="primary" onClick={()=>alert('Maqueta: movimiento validado. En la versión con persistencia se guardará en CSV y auditoría.')}>Validar movimiento</button></section>}
{tab==='cal'&&<section className="panel"><h2>Calendario · Agosto 2026</h2><p className="muted">Resumen diario. Rojo = más de 4 personas simultáneas.</p><div className="calendar">{Array.from({length:31},(_,i)=>{let key=`2026-08-${String(i+1).padStart(2,'0')}`,c=overlapCount(key);return <div className={c>4?'crowded':c?'busy':''} key={key}><b>{i+1}</b><span>{c?`${c} vac.`:'—'}</span></div>})}</div><h3>Vacaciones del mes</h3>{people.flatMap(p=>p.vac.filter(v=>v[1]>='2026-08-01'&&v[0]<='2026-08-31').map((v,i)=><div className="history" key={p.id+'-'+i}><span><b>{p.name}</b> · {v[0]} → {v[1]}</span><span>{businessDays(v[0]<'2026-08-01'?'2026-08-01':v[0],v[1]>'2026-08-31'?'2026-08-31':v[1])} días hábiles</span></div>))}</section>}
</main><footer>Reglas incluidas: 1,25 días/mes · saldo negativo permitido · histórico ≥ 1 año · alerta sobre 4 personas · PDFs.</footer></div>}
createRoot(document.getElementById('root')).render(<App/>);
