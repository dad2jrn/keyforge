# GitHub Pages Deployment

The Vite production base path defaults to `/keyforge/` so built assets work under the repository-name subpath on GitHub Pages.

Deployment is handled by `.github/workflows/pages.yml` on tagged releases and manual dispatch. The workflow runs sensitive-data scans before uploading `dist`.
