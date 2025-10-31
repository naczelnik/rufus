use wasm_bindgen::prelude::*;

// Ta funkcja zostanie wyeksportowana do JavaScriptu.
#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    // Używamy makra format! do stworzenia nowego stringa.
    // To jest bezpieczniejsze i bardziej wydajne w Rust.
    format!("Wiadomość z Rusta: Witaj w Rufus, {}!", name)
}