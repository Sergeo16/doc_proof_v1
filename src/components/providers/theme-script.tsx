/**
 * Script inline qui s'exécute AVANT React pour appliquer le thème sauvegardé.
 * Évite le flash blanc au chargement.
 */
const themeScript = `
(function() {
  var key = 'doc-proof-theme';
  var valid = ['dark','light'];
  var stored = localStorage.getItem(key);
  var theme = valid.indexOf(stored) >= 0 ? stored : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
})();
`;

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  );
}
