// vite.config.js
import path from "path";
import { defineConfig } from "file:///Users/govindve/govi/Projects/ReactProjects/firedesk-frontend/node_modules/vite/dist/node/index.js";
import react from "file:///Users/govindve/govi/Projects/ReactProjects/firedesk-frontend/node_modules/@vitejs/plugin-react/dist/index.js";
import tailwindcss from "file:///Users/govindve/govi/Projects/ReactProjects/firedesk-frontend/node_modules/@tailwindcss/vite/dist/index.mjs";
import { resolve } from "path";
import fs from "fs/promises";
import svgr from "file:///Users/govindve/govi/Projects/ReactProjects/firedesk-frontend/node_modules/@svgr/rollup/dist/index.js";
var __vite_injected_original_dirname = "/Users/govindve/govi/Projects/ReactProjects/firedesk-frontend";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      src: resolve(__vite_injected_original_dirname, "src")
    }
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx"
      },
      plugins: [
        {
          name: "load-js-files-as-jsx",
          setup(build) {
            build.onLoad({ filter: /src\\.*\.js$/ }, async (args) => ({
              loader: "jsx",
              contents: await fs.readFile(args.path, "utf8")
            }));
          }
        }
      ]
    }
  },
  // plugins: [react(),svgr({
  //   exportAsDefault: true
  // })],
  server: {
    proxy: {
      "/api": {
        target: "https://test.firedesk.in",
        changeOrigin: true,
        secure: false,
        rewrite: (path2) => path2.replace(/^\/api/, "")
      }
    }
  },
  plugins: [tailwindcss(), svgr(), react()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZ292aW5kdmUvZ292aS9Qcm9qZWN0cy9SZWFjdFByb2plY3RzL2ZpcmVkZXNrLWZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZ292aW5kdmUvZ292aS9Qcm9qZWN0cy9SZWFjdFByb2plY3RzL2ZpcmVkZXNrLWZyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9nb3ZpbmR2ZS9nb3ZpL1Byb2plY3RzL1JlYWN0UHJvamVjdHMvZmlyZWRlc2stZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSdcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcbmltcG9ydCBmcyBmcm9tICdmcy9wcm9taXNlcyc7XG5pbXBvcnQgc3ZnciBmcm9tICdAc3Znci9yb2xsdXAnO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICAgIHNyYzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcbiAgICB9LFxuICB9LFxuICBlc2J1aWxkOiB7XG4gICAgbG9hZGVyOiAnanN4JyxcbiAgICBpbmNsdWRlOiAvc3JjXFwvLipcXC5qc3g/JC8sXG4gICAgZXhjbHVkZTogW10sXG4gIH0sXG5cbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgIGxvYWRlcjoge1xuICAgICAgICAnLmpzJzogJ2pzeCcsXG4gICAgICB9LFxuICAgICAgcGx1Z2luczogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ2xvYWQtanMtZmlsZXMtYXMtanN4JyxcbiAgICAgICAgICBzZXR1cChidWlsZCkge1xuICAgICAgICAgICAgYnVpbGQub25Mb2FkKHsgZmlsdGVyOiAvc3JjXFxcXC4qXFwuanMkLyB9LCBhc3luYyAoYXJncykgPT4gKHtcbiAgICAgICAgICAgICAgbG9hZGVyOiAnanN4JyxcbiAgICAgICAgICAgICAgY29udGVudHM6IGF3YWl0IGZzLnJlYWRGaWxlKGFyZ3MucGF0aCwgJ3V0ZjgnKSxcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9LFxuXG4gIC8vIHBsdWdpbnM6IFtyZWFjdCgpLHN2Z3Ioe1xuICAvLyAgIGV4cG9ydEFzRGVmYXVsdDogdHJ1ZVxuICAvLyB9KV0sXG4gIHNlcnZlcjoge1xuICAgIHByb3h5OiB7XG4gICAgICAnL2FwaSc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly90ZXN0LmZpcmVkZXNrLmluJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgICByZXdyaXRlOiBwYXRoID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcblxuICBwbHVnaW5zOiBbdGFpbHdpbmRjc3MoKSwgc3ZncigpLCByZWFjdCgpXSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5VyxPQUFPLFVBQVU7QUFDMVgsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8saUJBQWlCO0FBQ3hCLFNBQVMsZUFBZTtBQUN4QixPQUFPLFFBQVE7QUFDZixPQUFPLFVBQVU7QUFOakIsSUFBTSxtQ0FBbUM7QUFTekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQ3BDLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsSUFDL0I7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxRQUFRO0FBQUEsSUFDUixTQUFTO0FBQUEsSUFDVCxTQUFTLENBQUM7QUFBQSxFQUNaO0FBQUEsRUFFQSxjQUFjO0FBQUEsSUFDWixnQkFBZ0I7QUFBQSxNQUNkLFFBQVE7QUFBQSxRQUNOLE9BQU87QUFBQSxNQUNUO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUDtBQUFBLFVBQ0UsTUFBTTtBQUFBLFVBQ04sTUFBTSxPQUFPO0FBQ1gsa0JBQU0sT0FBTyxFQUFFLFFBQVEsZUFBZSxHQUFHLE9BQU8sVUFBVTtBQUFBLGNBQ3hELFFBQVE7QUFBQSxjQUNSLFVBQVUsTUFBTSxHQUFHLFNBQVMsS0FBSyxNQUFNLE1BQU07QUFBQSxZQUMvQyxFQUFFO0FBQUEsVUFDSjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtBLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxRQUNSLFNBQVMsQ0FBQUEsVUFBUUEsTUFBSyxRQUFRLFVBQVUsRUFBRTtBQUFBLE1BQzVDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUVBLFNBQVMsQ0FBQyxZQUFZLEdBQUcsS0FBSyxHQUFHLE1BQU0sQ0FBQztBQUMxQyxDQUFDOyIsCiAgIm5hbWVzIjogWyJwYXRoIl0KfQo=
