# MGS Control de Vacaciones v0.3.0

## Nuevo: Ingreso de personal

- Alta de trabajadores desde la interfaz.
- Campos: nombre, RUT, correo, teléfono, área, cargo, fecha de ingreso, tipo de contrato, estado y ajuste inicial de vacaciones.
- Validación de campos obligatorios y RUT duplicado.
- Cálculo automático de 1,25 días por mes desde la fecha de ingreso.
- Ajuste inicial positivo o negativo para migrar saldos desde planillas existentes.
- Estado Activo/Inactivo con opción de reactivar.
- Los nuevos registros se guardan en localStorage para probar la maqueta en GitHub Pages.
- Botón para restablecer los 10 datos ficticios.
- Se mantienen reportes PDF, calendario, alertas y comprobante de feriado para firma.
- Se mantiene `.github/workflows/deploy-pages.yml` para GitHub Pages.
