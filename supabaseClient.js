// Używamy globalnego obiektu supabase, który został załadowany przez skrypt w index.html
const { createClient } = supabase;

// Zmienne środowiskowe dla kluczy Supabase.
// W tym środowisku programistycznym są one wstrzykiwane globalnie.
// W środowisku produkcyjnym powinny być ustawione na serwerze.
const supabaseUrl = https://orfoiqgfzfympuxhpuad.supabase.co;
const supabaseKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZm9pcWdmemZ5bXB1eGhwdWFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzMxNDUsImV4cCI6MjA3NzYwOTE0NX0.kV4kAqCWfGkKLL7LbUDA4irrRbAzY_zpaKRK4m54JG4;

if (!supabaseUrl || !supabaseKey) {
    console.error("Klucze Supabase (SUPABASE_URL, SUPABASE_KEY) nie zostały zdefiniowane. Autoryzacja nie będzie działać.");
}

// Tworzymy i eksportujemy instancję klienta Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);