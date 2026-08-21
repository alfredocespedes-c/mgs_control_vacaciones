import React,{useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './styles.css';

const TODAY=new Date('2026-08-20T12:00:00');
const COMPANY='MGS REPUESTOS Y CIA.LTDA.';
const people=[
 {id:1,name:'Ana Torres',rut:'17.245.381-2',area:'Administración',start:'2024-01-15',adjust:3,vac:[['2026-02-09','2026-02-13'],['2026-08-24','2026-08-28']]},
 {id:2,name:'Bruno Díaz',rut:'18.306.492-7',area:'Operaciones',start:'2025-11-03',adjust:0,vac:[['2026-08-10','2026-08-14']]},
 {id:3,name:'Camila Soto',rut:'19.112.734-5',area:'Comercial',start:'2026-05-02',adjust:0,vac:[['2026-08-24','2026-08-28']]},
 {id:4,name:'Diego Rojas',rut:'15.884.129-6',area:'Operaciones',start:'2023-06-20',adjust:-2,vac:[['2025-12-22','2025-12-31'],['2026-08-24','2026-08-26']]},
 {id:5,name:'Elena Muñoz',rut:'20.018.447-9',area:'Finanzas',start:'2026-07-01',adjust:0,vac:[['2026-08-17','2026-08-21']]},
 {id:6,name:'Felipe Vera',rut:'14.927.630-4',area:'TI',start:'2022-03-10',adjust:1.5,vac:[['2026-01-19','2026-01-23'],['2026-08-24','2026-08-28']]},
 {id:7,name:'Gabriela León',rut:'18.765.029-3',area:'Personas',start:'2025-04-07',adjust:0,vac:[['2026-08-03','2026-08-07']]},
 {id:8,name:'Héctor Silva',rut:'16.304.711-8',area:'Logística',start:'2024-09-16',adjust:0,vac:[['2026-08-24','2026-08-28']]},
 {id:9,name:'Isidora Paz',rut:'19.684.250-1',area:'Comercial',start:'2026-02-12',adjust:0,vac:[['2026-07-27','2026-08-04']]},
 {id:10,name:'Javier Mora',rut:'13.771.946-0',area:'TI',start:'2021-08-01',adjust:-1,vac:[['2025-09-15','2025-09-19'],['2026-03-02','2026-03-06']]}
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
function fmtDateLong(s){const x=d(s);return `${x.getDate()} de ${['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'][x.getMonth()]} de ${x.getFullYear()}`}
function fmtDateShort(s){const x=d(s);return `${String(x.getDate()).padStart(2,'0')}/${String(x.getMonth()+1).padStart(2,'0')}/${x.getFullYear()}`}
function accruedAt(p,date){return monthsWorked(p.start,d(date))*1.25}
function usedUntil(p,date){return p.vac.reduce((sum,v)=>v[0]<=date?sum+businessDays(v[0],v[1]<=date?v[1]:date):sum,0)}
function balanceAt(p,date){return accruedAt(p,date)+p.adjust-usedUntil(p,date)}
function vacationCycle(p,v){const join=d(p.start), ref=d(v[0]);let y=ref.getFullYear();let ann=new Date(y,join.getMonth(),join.getDate(),12);if(ref<ann)y--;const from=new Date(y,join.getMonth(),join.getDate(),12),to=new Date(y+1,join.getMonth(),join.getDate(),12);const iso=x=>x.toISOString().slice(0,10);return [iso(from),iso(to)]}
function pdfVoucher(p,v){
 const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});const x=15,w=180;const y0=14;
 const line=(x1,y1,x2,y2)=>doc.line(x1,y1,x2,y2); const txt=(t,xp,yp,opts={})=>doc.text(String(t),xp,yp,opts);
 doc.setLineWidth(.35);doc.rect(x,y0,w,157);
 doc.setFillColor(238,244,241);doc.rect(x,y0,w,10,'F');doc.rect(x,y0,w,10);
 doc.setFont('helvetica','bold');doc.setFontSize(9);txt('FECHA CONTRATO INICIAL:',x+2,y0+6.5);doc.setFont('helvetica','normal');txt(fmtDateShort(p.start),x+78,y0+6.5);
 const y1=y0+10;line(x,y1,x+w,y1);line(x+96,y1,x+96,y1+16);line(x+123,y1,x+123,y1+16);line(x+144,y1,x+144,y1+16);line(x+165,y1,x+165,y1+16);
 doc.setFont('helvetica','bold');doc.setFontSize(12);txt('COMPROBANTE DE FERIADO',x+48,y1+10,{align:'center'});
 doc.setFontSize(8);txt('LUGAR',x+109,y1+5,{align:'center'});txt('DÍA',x+133.5,y1+5,{align:'center'});txt('MES',x+154.5,y1+5,{align:'center'});txt('AÑO',x+172.5,y1+5,{align:'center'});
 doc.setFont('helvetica','normal');doc.setFontSize(9);txt('SANTIAGO',x+109,y1+12,{align:'center'});txt(TODAY.getDate(),x+133.5,y1+12,{align:'center'});txt(['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][TODAY.getMonth()],x+154.5,y1+12,{align:'center'});txt(TODAY.getFullYear(),x+172.5,y1+12,{align:'center'});
 const y2=y1+16;line(x,y2,x+w,y2);doc.setFontSize(9);txt('En cumplimiento de las disposiciones legales vigentes se deja constancia que a contar de las fechas',x+2,y2+7);txt('que se indican, el trabajador(a):',x+2,y2+13);
 doc.setFont('helvetica','bold');txt('Don(ña)',x+2,y2+21);txt(p.name.toUpperCase(),x+43,y2+21);txt('RUT:',x+117,y2+21);txt(p.rut,x+177,y2+21,{align:'right'});
 doc.setFont('helvetica','normal');txt('hará uso',x+2,y2+29);const type=balanceAt(p,v[1])<0?'Anticipadas':'Parcial';doc.setFont('helvetica','bold');txt(type,x+61,y2+29,{align:'center'});line(x+27,y2+31,x+93,y2+31);doc.setFont('helvetica','normal');txt('(indicar si parte o el Total) de su Feriado',x+96,y2+29);txt('Anual con remuneración íntegra de acuerdo al siguiente detalle:',x+2,y2+36);
 doc.setFont('helvetica','bold');txt('DESCANSO EFECTIVO ENTRE LAS FECHAS QUE SE INDICAN:',x+2,y2+43);txt('DESDE EL:',x+2,y2+50);txt(fmtDateLong(v[0]),x+63,y2+50,{align:'center'});txt('HASTA EL:',x+101,y2+50);txt(fmtDateLong(v[1]),x+154,y2+50,{align:'center'});line(x+23,y2+52,x+90,y2+52);line(x+121,y2+52,x+w-2,y2+52);
 const y3=y2+58;line(x,y3,x+w,y3);const cyc=vacationCycle(p,v);doc.setFont('helvetica','normal');txt('Feriado compensado del período entre el:',x+2,y3+9);doc.setFont('helvetica','bold');txt(`${fmtDateShort(cyc[0])} al ${fmtDateShort(cyc[1])}`,x+143,y3+9,{align:'center'});line(x+93,y3+11,x+w,y3+11);
 const y4=y3+18;line(x,y4,x+w,y4);line(x+96,y4,x+96,y4+52);line(x+119,y4,x+119,y4+52);doc.setFont('helvetica','bold');txt('DETALLE DEL FERIADO',x+48,y4+7,{align:'center'});txt('DÍAS',x+107.5,y4+7,{align:'center'});line(x,y4+10,x+119,y4+10);
 const rows=[['Días Hábiles',businessDays(v[0],v[1])],['Vacaciones Progresivas',''],['Domingos e Inhábiles',''],['Feriado Fraccionado',''],['SALDO PENDIENTE (DÍAS HÁBILES)',balanceAt(p,v[1]).toFixed(2).replace('.',',')]];
 doc.setFontSize(8.5);rows.forEach((r,i)=>{const yy=y4+10+i*8.4;line(x,yy+8.4,x+119,yy+8.4);doc.setFont('helvetica',i===4?'bold':'normal');txt(r[0],x+2,yy+5.7);txt(r[1],x+107.5,yy+5.7,{align:'center'})});
 const sigX=x+119,sigW=w-119;line(sigX,y4+17.3,x+w,y4+17.3);line(sigX,y4+34.6,x+w,y4+34.6);
 doc.setFont('helvetica','bold');doc.setFontSize(8.3);txt(COMPANY,sigX+sigW/2,y4+9.5,{align:'center'});doc.setFont('helvetica','normal');txt('Nombre y Firma del Empleador',sigX+sigW/2,y4+15,{align:'center'});
 doc.setFont('helvetica','bold');txt(p.name.toUpperCase(),sigX+sigW/2,y4+26,{align:'center'});doc.setFont('helvetica','normal');txt('Firma del Trabajador',sigX+sigW/2,y4+32,{align:'center'});txt('Autorización Gerencia',sigX+sigW/2,y4+47,{align:'center'});
 doc.setFontSize(7);doc.setTextColor(100);txt(`Comprobante generado por MGS Control de Vacaciones · ID ${p.id}-${v[0]} · ${fmtDateShort(TODAY.toISOString().slice(0,10))}`,x,y0+166);doc.setTextColor(0);
 doc.save(`comprobante-${p.name.toLowerCase().replace(/\s+/g,'-')}-${v[0]}.pdf`)
}

function pdfGeneral(){const doc=new jsPDF();doc.setFontSize(18);doc.text('MGS · Reporte general de vacaciones',14,18);doc.setFontSize(10);doc.text('Corte: 20-08-2026 · Acumulación automática: 1,25 días por mes trabajado',14,25);autoTable(doc,{startY:32,head:[['Persona','Área','Ingreso','Acumulado','Usado','Ajuste','Saldo']],body:people.map(p=>[p.name,p.area,p.start,accrued(p).toFixed(2),used(p),p.adjust.toFixed(2),balance(p).toFixed(2)])});doc.save('reporte-general-vacaciones.pdf')}
function pdfMonth(){const doc=new jsPDF();doc.setFontSize(18);doc.text('MGS · Vacaciones Agosto 2026',14,18);const rows=[];people.forEach(p=>p.vac.forEach(v=>{if(v[1]>='2026-08-01'&&v[0]<='2026-08-31')rows.push([p.name,p.area,v[0],v[1],businessDays(v[0]<'2026-08-01'?'2026-08-01':v[0],v[1]>'2026-08-31'?'2026-08-31':v[1])])}));autoTable(doc,{startY:28,head:[['Persona','Área','Desde','Hasta','Días hábiles']],body:rows});doc.save('vacaciones-agosto-2026.pdf')}

function App(){const [sel,setSel]=useState(people[0]);const [tab,setTab]=useState('personal');const alertDays=useMemo(()=>{let out=[];for(let i=1;i<=31;i++){let key=`2026-08-${String(i).padStart(2,'0')}`,c=overlapCount(key);if(c>4)out.push([key,c])}return out},[]);return <div className="app">
<header><div><b>MGS</b><span>Control de Vacaciones</span></div><small>Maqueta funcional · 10 personas · Agosto 2026</small></header>
<nav><button className={tab==='personal'?'on':''} onClick={()=>setTab('personal')}>Personal</button><button className={tab==='mov'?'on':''} onClick={()=>setTab('mov')}>Movimientos</button><button className={tab==='cal'?'on':''} onClick={()=>setTab('cal')}>Calendario</button><div className="spacer"/><button onClick={pdfGeneral}>Reporte general PDF</button><button onClick={pdfMonth}>Vacaciones del mes PDF</button></nav>
{alertDays.length>0&&<div className="warning"><b>Alerta de dotación:</b> hay fechas con más de 4 personas de vacaciones simultáneamente. {alertDays.map(x=><span key={x[0]}>{x[0]}: {x[1]} personas</span>)}</div>}
<main>{tab==='personal'&&<><section className="kpis"><article><small>Personas</small><strong>10</strong></article><article><small>De vacaciones hoy</small><strong>{people.filter(p=>p.vac.some(isNow)).length}</strong></article><article><small>Saldo negativo</small><strong>{people.filter(p=>balance(p)<0).length}</strong></article><article><small>Saldo total</small><strong>{people.reduce((s,p)=>s+balance(p),0).toFixed(1)}</strong></article></section><div className="grid"><section className="panel"><h2>Personal</h2><p className="muted">El saldo puede quedar negativo. Cada mes trabajado agrega 1,25 días automáticamente.</p><table><thead><tr><th>Persona</th><th>Área</th><th>Saldo</th></tr></thead><tbody>{people.map(p=><tr key={p.id} onClick={()=>setSel(p)} className={sel.id===p.id?'selected':''}><td>{p.name}</td><td>{p.area}</td><td><span className={balance(p)<0?'neg':'pos'}>{fmt(balance(p))}</span></td></tr>)}</tbody></table></section><section className="panel detail"><h2>{sel.name}</h2><div className="facts"><div><small>RUT</small><b>{sel.rut}</b></div><div><small>Fecha ingreso</small><b>{sel.start}</b></div><div><small>Meses trabajados</small><b>{monthsWorked(sel.start)}</b></div><div><small>Acumulado</small><b>{fmt(accrued(sel))}</b></div><div><small>Vacaciones usadas</small><b>{fmt(used(sel))}</b></div><div><small>Ajustes</small><b>{fmt(sel.adjust)}</b></div><div><small>Saldo actual</small><b className={balance(sel)<0?'neg':'pos'}>{fmt(balance(sel))}</b></div></div><h3>Histórico último año</h3>{sel.vac.filter(v=>v[1]>='2025-08-20').map((v,i)=><div className="history voucher-row" key={i}><span>{v[0]} → {v[1]}</span><b>{businessDays(...v)} días hábiles</b><button onClick={()=>pdfVoucher(sel,v)}>Generar comprobante</button></div>)}</section></div></>}
{tab==='mov'&&<section className="panel form"><h2>Registrar vacaciones</h2><p>Maqueta de flujo: permite registrar incluso cuando el saldo proyectado quede negativo. Antes de guardar se revisa la cantidad de personas simultáneas.</p><label>Persona<select><option>Camila Soto · saldo {fmt(balance(people[2]))}</option>{people.filter(x=>x.id!==3).map(p=><option key={p.id}>{p.name}</option>)}</select></label><div className="row"><label>Desde<input type="date" defaultValue="2026-08-24"/></label><label>Hasta<input type="date" defaultValue="2026-08-28"/></label></div><div className="warning inner"><b>Advertencia:</b> el 24–28 de agosto ya existen 5 personas programadas. La regla no bloquea: Administración puede continuar dejando trazabilidad.</div><button className="primary" onClick={()=>alert('Maqueta: movimiento validado. En la versión con persistencia se guardará en CSV y auditoría.')}>Validar movimiento</button></section>}
{tab==='cal'&&<section className="panel"><h2>Calendario · Agosto 2026</h2><p className="muted">Resumen diario. Rojo = más de 4 personas simultáneas.</p><div className="calendar">{Array.from({length:31},(_,i)=>{let key=`2026-08-${String(i+1).padStart(2,'0')}`,c=overlapCount(key);return <div className={c>4?'crowded':c?'busy':''} key={key}><b>{i+1}</b><span>{c?`${c} vac.`:'—'}</span></div>})}</div><h3>Vacaciones del mes</h3>{people.flatMap(p=>p.vac.filter(v=>v[1]>='2026-08-01'&&v[0]<='2026-08-31').map((v,i)=><div className="history" key={p.id+'-'+i}><span><b>{p.name}</b> · {v[0]} → {v[1]}</span><span>{businessDays(v[0]<'2026-08-01'?'2026-08-01':v[0],v[1]>'2026-08-31'?'2026-08-31':v[1])} días hábiles</span></div>))}</section>}
</main><footer>Reglas incluidas: 1,25 días/mes · saldo negativo permitido · histórico ≥ 1 año · alerta sobre 4 personas · reportes PDF · comprobante individual para firma.</footer></div>}
createRoot(document.getElementById('root')).render(<App/>);
