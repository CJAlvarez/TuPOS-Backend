#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Leer el package.json principal
const mainPackage = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

// Crear el package.json para producción
const prodPackage = {
  name: mainPackage.name,
  version: mainPackage.version,
  description: mainPackage.description + ' - Production Build',
  author: mainPackage.author,
  private: mainPackage.private,
  license: mainPackage.license,
  main: 'main.js',
  scripts: {
    start: 'node main.js'
  },
  dependencies: mainPackage.dependencies,
  engines: mainPackage.engines
};

// Escribir el package.json en el directorio dist
const distPath = path.join(__dirname, "..", "dist");
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

fs.writeFileSync(
  path.join(distPath, 'package.json'),
  JSON.stringify(prodPackage, null, 2)
);

console.log('✅ package.json creado en el directorio dist');

// Copiar la carpeta public/ al dist/public (si existe)
const publicSrc = path.join(__dirname, '..', 'public');
const publicDest = path.join(distPath, 'public');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  if (!exists) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

if (fs.existsSync(publicSrc)) {
  copyRecursiveSync(publicSrc, publicDest);
  console.log('✅ carpeta public copiada a dist/public');
} else {
  console.log('ℹ️ carpeta public no existe, nada que copiar');
}
