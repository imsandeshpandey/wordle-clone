import React from "react"
import ReactDOM from "react-dom/client"
import { App } from "./App.tsx"
import "./index.css"
import { Toaster } from "./components/ui/toaster.tsx"
import { TooltipProvider } from "./components/ui/tooltip.tsx"
import { ThemeProvider } from "./providers/theme.provider.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider delayDuration={100}>
        <App />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  </React.StrictMode>
)
