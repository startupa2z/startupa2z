import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { supabase } from "@/integrations/supabase/client";

// Pick up OAuth / magic-link tokens from the URL hash after redirect
void supabase.auth.getSession();

createRoot(document.getElementById("root")!).render(<App />);
