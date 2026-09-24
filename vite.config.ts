import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['pdfjs-dist']
  },
  build: {
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('pdf-lib') || id.includes('pdfjs-dist')) return 'pdf';
          if (id.includes('qrcode')) return 'qr';
          if (id.includes('pptxgenjs')) return 'office-pptx';
          if (id.includes('/docx')) return 'office-docx';
          if (id.includes('xlsx')) return 'office-xlsx';
          if (id.includes('jszip')) return 'office-zip';
          if (id.includes('mammoth')) return 'office-mammoth';
          if (id.includes('jspdf')) return 'office-jspdf';
          if (id.includes('node_modules')) return 'vendor';
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true as any,
    headers: {
      'X-Frame-Options': 'ALLOWALL'
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true as any,
    headers: {
      'X-Frame-Options': 'ALLOWALL'
    }
  }
})
