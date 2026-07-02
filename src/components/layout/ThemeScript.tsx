/**
 * Script bloqueante minimo, inyectado antes de hidratar React, que aplica
 * el tema guardado (o la preferencia del sistema) al <html> ANTES del
 * primer pintado. Sin esto, se veria un parpadeo claro/oscuro al cargar.
 */
const THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var isDark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
