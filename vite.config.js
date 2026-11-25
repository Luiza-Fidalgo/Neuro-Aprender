import { defineConfig } from 'vite'
import { copyFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

export default defineConfig({
  plugins: [{
    name: 'hostinger-api',
    closeBundle() {
      const destination = join(process.cwd(), 'dist', 'api')
      mkdirSync(destination, { recursive: true })
      // Somente arquivos publicáveis. Nunca copie api/config.php.
      for (const file of ['index.php', 'bootstrap.php', '.htaccess']) {
        copyFileSync(join(process.cwd(), 'api', file), join(destination, file))
      }
    }
  }]
})
