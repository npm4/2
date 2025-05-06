import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: [
      '@angular/platform-browser/animations',
      '@angular/forms',
      '@angular/material/card',
      '@angular/material/form-field',
      '@angular/material/input',
      '@angular/material/snack-bar',
      '@angular/cdk/text-field'
    ]
  }
});
