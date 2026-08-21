# Publicar en GitHub Pages

1. Sube **el contenido de esta carpeta** a la raíz del repositorio. Debe existir en GitHub el archivo:
   `.github/workflows/deploy-pages.yml`
2. Verifica que la rama principal se llame `main`.
3. En GitHub abre **Settings → Pages**.
4. En **Build and deployment → Source**, selecciona **GitHub Actions**.
5. Ve a **Actions → Deploy GitHub Pages → Run workflow** para el primer despliegue, o realiza un nuevo commit/push a `main`.
6. Cuando finalice correctamente, GitHub mostrará la URL pública en el job `deploy` y en Settings → Pages.

## Si no aparece ninguna Action

Revisa directamente en GitHub que exista:
`.github/workflows/deploy-pages.yml`

Si ese archivo no está en el repositorio, GitHub no puede detectar el workflow. Esto puede ocurrir si se subieron únicamente los archivos visibles y se omitió la carpeta oculta `.github`.
