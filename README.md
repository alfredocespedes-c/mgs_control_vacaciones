# MGS · Control de Vacaciones — Maqueta v0.1.1

Maqueta funcional para una empresa pequeña, cargada con 10 personas ficticias y casos diseñados para validar reglas de negocio.

## Reglas incluidas

- Acumulación automática de **1,25 días por cada mes trabajado** desde la fecha de ingreso.
- El saldo de vacaciones **puede quedar negativo**.
- El saldo negativo se recupera automáticamente con la acumulación mensual futura.
- Alerta visual cuando existen **más de 4 personas de vacaciones en la misma fecha**.
- Histórico visible de vacaciones del último año.
- Reporte general PDF con saldo a favor/en contra.
- Reporte PDF de vacaciones del mes.
- Calendario mensual con concentración de personas de vacaciones.

## Ejecutar localmente

```bash
npm install
npm run dev
```

## Publicar con GitHub Pages

1. Crear un repositorio en GitHub y subir el contenido de esta carpeta a la rama `main`.
2. En GitHub ir a **Settings → Pages**.
3. En **Build and deployment → Source**, seleccionar **GitHub Actions**.
4. Hacer `push` a `main`.
5. El workflow `.github/workflows/deploy-pages.yml` instala dependencias, construye Vite y publica automáticamente `dist/` en GitHub Pages.

La configuración Vite usa `base: './'`, por lo que la maqueta funciona en GitHub Pages sin depender del nombre del repositorio.

## Build de producción

```bash
npm run build
```

El resultado queda en la carpeta `dist/`.

## Alcance de esta versión

Los datos son dummy y están embebidos en el frontend. Esta versión sirve para revisar interfaz y reglas. La persistencia real/local se incorporará posteriormente siguiendo la arquitectura MGS definida para aplicaciones administrativas.

## GitHub Pages — v0.3.0

El proyecto incluye `.github/workflows/deploy-pages.yml` para construir con Vite y publicar `dist/` automáticamente al hacer push a `main`.

**Configuración inicial obligatoria en GitHub:** `Settings → Pages → Build and deployment → Source → GitHub Actions`.

Si en la pestaña Actions no aparece **Deploy GitHub Pages**, verifica que la carpeta oculta `.github` haya sido subida al repositorio.


## v0.3.0 - Comprobante de feriado

- Botón **Generar comprobante** en cada período del histórico individual.
- PDF de una página inspirado en el comprobante entregado por MGS.
- Completa automáticamente nombre, RUT, fecha de contrato, período, días hábiles, saldo y tipo de feriado.
- Deja espacios para Firma del Trabajador, Nombre y Firma del Empleador y Autorización Gerencia.
- Agrega identificador interno y fecha de generación al pie.


## v0.3.0 · Ingreso de personal

Se incorpora alta de personal con nombre, RUT, correo, teléfono, área, cargo, fecha de ingreso, tipo de contrato, estado y ajuste inicial de vacaciones. Los nuevos registros se guardan en localStorage del navegador para pruebas de la maqueta.
