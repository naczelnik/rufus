// Czekamy na załadowanie modułu WASM, a następnie wykonujemy logikę
async function run() {
  try {
    // Importujemy funkcje z naszego Rusta. Ścieżka './pkg/rufus.js' zostanie
    // wygenerowana automatycznie przez narzędzie wasm-pack podczas kompilacji na Cloudflare.
    const { greet } = await import('./pkg/rufus.js');

    const greetButton = document.getElementById('greetButton');
    if (greetButton) {
      greetButton.addEventListener('click', () => {
        // Wywołujemy funkcję `greet` z Rusta!
        const message = greet("Użytkowniku");
        alert(message);
      });
    }
    console.log("Moduł Rufus (WASM) załadowany pomyślnie.");
  } catch (error) {
    console.error("Błąd podczas ładowania modułu WebAssembly:", error);
  }
}

run();
