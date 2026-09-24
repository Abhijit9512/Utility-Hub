import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { CategoryHub } from "./pages/CategoryHub";
import { ToolPage } from "./pages/ToolPage";
import { NotFound } from "./pages/NotFound";
import { About, Contact, Privacy, Terms, Disclaimer, CookieInfo } from "./pages/StaticPages";
import { ErrorBoundary } from "./components/common/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />

            {/* Category hubs */}
            <Route path="/pdf-tools" element={<CategoryHub />} />
            <Route path="/image-tools" element={<CategoryHub />} />
            <Route path="/text-tools" element={<CategoryHub />} />
            <Route path="/calculator-tools" element={<CategoryHub />} />
            <Route path="/time-tools" element={<CategoryHub />} />
            <Route path="/qr-tools" element={<CategoryHub />} />
            <Route path="/developer-tools" element={<CategoryHub />} />
            <Route path="/security-tools" element={<CategoryHub />} />
            <Route path="/student-tools" element={<CategoryHub />} />
            <Route path="/career-tools" element={<CategoryHub />} />

            {/* Tool pages — generic pattern */}
            <Route path="/:category/:slug" element={<ToolPage />} />

            {/* Static pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/terms-of-service" element={<Terms />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/cookie-information" element={<CookieInfo />} />

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
