import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 加载环境变量，使其能在构建时被访问到
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // 允许代码中直接使用 process.env.API_KEY，在 Vercel 构建时将其替换为真实值
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});