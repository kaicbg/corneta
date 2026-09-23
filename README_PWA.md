# PWA / Instalação

O projeto agora pode ser instalado como aplicativo por navegadores compatíveis.

- `manifest.json`: informações do aplicativo e ícones.
- `service-worker.js`: cache e suporte offline básico.
- O botão `📲 Instalar aplicativo` aparece quando o navegador disponibiliza a instalação.
- O site precisa estar em HTTPS para o Service Worker/PWA funcionar em produção (GitHub Pages já usa HTTPS).

No iPhone/iPad, o Safari pode usar **Compartilhar → Adicionar à Tela de Início**; o evento automático de instalação do navegador não é disponibilizado da mesma forma que no Chrome/Edge.
