use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use rand::Rng;

// Definiujemy strukturę danych, którą będziemy zwracać jako JSON
#[derive(Serialize, Deserialize)]
pub struct Report {
    visits: u32,
    conversion_rate: f64,
    revenue: f64,
}

// To jest nasza główna funkcja, którą wywołamy z JavaScriptu
#[wasm_bindgen]
pub fn generate_report() -> String {
    // Inicjalizujemy generator liczb losowych
    let mut rng = rand::thread_rng();

    // Tworzymy nowy raport z losowymi danymi
    let report = Report {
        visits: rng.gen_range(500..1500),
        conversion_rate: rng.gen_range(1.5..5.0),
        revenue: rng.gen_range(10000.0..50000.0),
    };

    // Serializujemy (zmieniamy) strukturę Report na tekst w formacie JSON
    // i zwracamy go. Używamy .unwrap(), aby uprościć kod na tym etapie.
    serde_json::to_string(&report).unwrap()
}