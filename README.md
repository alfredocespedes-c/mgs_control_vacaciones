# MGS · Control de Vacaciones — Maqueta v0.1.0

Maqueta funcional para validar reglas de negocio con 10 personas ficticias.

## Reglas implementadas
- Acumulación automática de **1,25 días por mes trabajado** desde la fecha de ingreso.
- Se permiten vacaciones con saldo insuficiente: el saldo puede quedar **negativo** y se recupera con futuras acumulaciones.
- Ajustes manuales positivos o negativos contemplados en el cálculo.
- Alerta visual cuando hay **más de 4 personas** de vacaciones simultáneamente; es advertencia, no bloqueo.
- Histórico visible de al menos un año.
- Reporte general PDF de saldos.
- Reporte PDF de vacaciones de agosto 2026.
- Calendario mensual resumido.

## Ejecutar
```bash
npm install
npm run dev
```

Luego abrir la URL indicada por Vite.

## Nota
Esta versión usa datos dummy embebidos y no persiste cambios. El botón de movimiento demuestra la validación. La siguiente etapa puede reutilizar la arquitectura de MGS Anticipos: React + servicio Node/Express local + CSV + auditoría/backups.
