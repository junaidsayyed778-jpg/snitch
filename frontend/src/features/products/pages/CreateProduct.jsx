import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { useProduct } from "../hook/useProduct";

/* ─── Google Fonts injected via @import in index.css; fallback here ─── */

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */

/** Single underline-animated editorial input */
function EditorialInput({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  maxLength,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative group">
      <label
        htmlFor={id}
        className="block mb-3 transition-colors duration-200"
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "11px",
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: focused ? "#ffd700" : "#6b6347",
        }}
      >
        {label}
        {required && (
          <span style={{ color: "#ffd700", marginLeft: 4 }}>*</span>
        )}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-transparent border-0 border-b-2 pb-4 pt-1 focus:outline-none transition-all duration-200"
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "15px",
          color: "#e5e2e1",
          borderColor: focused ? "#ffd700" : "#2e2c20",
          caretColor: "#ffd700",
          letterSpacing: "-0.01em",
        }}
        maxLength={maxLength}
      />

      {/* Gold underline expands from center */}
      <div
        className="absolute bottom-0 h-[2px] transition-all duration-300"
        style={{
          background: "linear-gradient(90deg, #ffe16d 0%, #ffd700 100%)",
          left: focused ? "0%" : "50%",
          right: focused ? "0%" : "50%",
        }}
      />

      {maxLength && (
        <div className="flex justify-end mt-2">
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "10px",
              letterSpacing: "0.08em",
              color: value.length >= maxLength ? "#ffd700" : "#3a3820",
              transition: "color 0.2s",
            }}
          >
            {value.length} / {maxLength}
          </span>
        </div>
      )}
    </div>
  );
}

/** Editorial textarea */
function EditorialTextarea({ id, label, placeholder, value, onChange, rows = 5, required, maxLength }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="block mb-3 transition-colors duration-200"
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "11px",
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: focused ? "#ffd700" : "#6b6347",
        }}
      >
        {label}
        {required && <span style={{ color: "#ffd700", marginLeft: 4 }}>*</span>}
      </label>

      <textarea
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-transparent border-0 border-b-2 pb-4 pt-1 focus:outline-none resize-none transition-all duration-200"
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "15px",
          color: "#e5e2e1",
          borderColor: focused ? "#ffd700" : "#2e2c20",
          caretColor: "#ffd700",
          lineHeight: "1.8",
          letterSpacing: "-0.01em",
        }}
      />

      <div
        className="absolute bottom-0 h-[2px] transition-all duration-300"
        style={{
          background: "linear-gradient(90deg, #ffe16d 0%, #ffd700 100%)",
          left: focused ? "0%" : "50%",
          right: focused ? "0%" : "50%",
        }}
      />

      <div className="flex justify-end mt-2">
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.08em",
            color: maxLength && value.length >= maxLength ? "#ffd700" : "#3a3820",
            transition: "color 0.2s",
          }}
        >
          {value.length}{maxLength ? ` / ${maxLength}` : " chars"}
        </span>
      </div>
    </div>
  );
}

/** Editorial select */
function EditorialSelect({ id, label, value, onChange, options, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="block mb-3 transition-colors duration-200"
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "11px",
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: focused ? "#ffd700" : "#6b6347",
        }}
      >
        {label}
        {required && <span style={{ color: "#ffd700", marginLeft: 4 }}>*</span>}
      </label>

      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-transparent border-0 border-b-2 pb-4 pt-1 focus:outline-none appearance-none cursor-pointer transition-all duration-200"
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "15px",
          color: "#e5e2e1",
          borderColor: focused ? "#ffd700" : "#2e2c20",
          caretColor: "#ffd700",
          letterSpacing: "-0.01em",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999077' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0px center",
          paddingRight: "20px",
        }}
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            style={{ background: "#1c1b1b", color: "#e5e2e1" }}
          >
            {opt.label}
          </option>
        ))}
      </select>

      <div
        className="absolute bottom-0 h-[2px] transition-all duration-300"
        style={{
          background: "linear-gradient(90deg, #ffe16d 0%, #ffd700 100%)",
          left: focused ? "0%" : "50%",
          right: focused ? "0%" : "50%",
        }}
      />
    </div>
  );
}

/** Section label — small ALL-CAPS gold divider */
function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-5 mb-12">
      <span
        style={{
          fontFamily: "Manrope, sans-serif",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#ffd700",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
      <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, #4d4732 0%, transparent 100%)", opacity: 0.6 }} />
    </div>
  );
}

/* ─────────────────────────────────────────
   IMAGE UPLOADER (up to 7 slots)
───────────────────────────────────────── */
function ImageUploader({ images, setImages, compact = false }) {
  const MAX = 7;
  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = useCallback(
    (files) => {
      const remaining = MAX - images.length;
      const newFiles = Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .slice(0, remaining);

      const readers = newFiles.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) =>
              resolve({ file, preview: e.target.result, id: `${Date.now()}-${Math.random()}` });
            reader.readAsDataURL(file);
          })
      );

      Promise.all(readers).then((results) =>
        setImages((prev) => [...prev, ...results].slice(0, MAX))
      );
    },
    [images.length, setImages]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const removeImage = (id) =>
    setImages((prev) => prev.filter((img) => img.id !== id));

  /* Build slot array: filled images + empty placeholders up to MAX */
  const slots = [
    ...images,
    ...Array(Math.max(0, MAX - images.length)).fill(null),
  ];

  /* Split: compact mode = 3+2+2, full mode = 4+3 */
  const row1 = compact ? slots.slice(0, 3) : slots.slice(0, 4);
  const row2 = compact ? slots.slice(3, 5) : slots.slice(4, 7);
  const row3 = compact ? slots.slice(5, 7) : [];

  const SlotCard = ({ slot, index }) => {
    if (slot) {
      return (
        <div className="relative rounded-lg overflow-hidden group" style={{ aspectRatio: "1/1" }}>
          <img
            src={slot.preview}
            alt={`Product image ${index + 1}`}
            className="w-full h-full object-cover"
          />
          {/* overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <button
              type="button"
              onClick={() => removeImage(slot.id)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-95"
              style={{ background: "#ffd700" }}
              aria-label="Remove image"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <line x1="1" y1="1" x2="11" y2="11" stroke="#221b00" strokeWidth="2" strokeLinecap="round" />
                <line x1="11" y1="1" x2="1" y2="11" stroke="#221b00" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          {/* index badge */}
          <div
            className="absolute top-2 left-2 w-5 h-5 rounded-sm flex items-center justify-center"
            style={{ background: "rgba(19,19,19,0.75)", backdropFilter: "blur(4px)" }}
          >
            <span style={{ fontFamily: "Inter", fontSize: "9px", color: "#999077" }}>
              {index + 1}
            </span>
          </div>
        </div>
      );
    }

    /* Empty slot */
    return (
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center justify-center rounded-lg transition-all duration-200 cursor-pointer group"
        style={{
          aspectRatio: "1/1",
          border: "1.5px dashed #4d4732",
          background: "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#ffd700";
          e.currentTarget.style.background = "rgba(255,215,0,0.04)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#4d4732";
          e.currentTarget.style.background = "transparent";
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mb-2 transition-transform duration-200 group-hover:scale-110">
          <line x1="10" y1="3" x2="10" y2="17" stroke="#4d4732" strokeWidth="1.5" strokeLinecap="round" className="group-hover:stroke-[#ffd700]" />
          <line x1="3" y1="10" x2="17" y2="10" stroke="#4d4732" strokeWidth="1.5" strokeLinecap="round" className="group-hover:stroke-[#ffd700]" />
        </svg>
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "8px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#4d4732",
          }}
        >
          {images.length === 0 && index === 0 ? "Add Photo" : ""}
        </span>
      </button>
    );
  };

  return (
    <div>
      {/* Drag & drop zone hint */}
      <div
        className="mb-6 rounded-lg p-4 flex items-center gap-3 transition-all duration-200 cursor-pointer"
        style={{
          background: dragging ? "rgba(255,215,0,0.06)" : "#1c1b1b",
          border: dragging ? "1px solid rgba(255,215,0,0.3)" : "1px solid transparent",
        }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div
          className="w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ background: "#2a2a2a" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#e5e2e1" }}>
            Drag & drop images or{" "}
            <span style={{ color: "#ffd700", textDecoration: "underline" }}>browse</span>
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#999077", marginTop: 2 }}>
            PNG, JPG, WEBP — Up to 7 images
            {images.length > 0 && ` · ${images.length}/7 added`}
          </p>
        </div>
        {images.length > 0 && (
          <div className="ml-auto">
            <span
              className="px-2 py-1 rounded-sm"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "9px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                background: "#2a2a2a",
                color: "#ffd700",
              }}
            >
              {images.length}/{MAX}
            </span>
          </div>
        )}
      </div>

      {/* Grid rows */}
      <div className={`grid gap-3 mb-3 ${compact ? "grid-cols-3" : "grid-cols-4"}`}>
        {row1.map((slot, i) => (
          <SlotCard key={slot?.id || `empty-${i}`} slot={slot} index={i} />
        ))}
      </div>
      <div className={`grid gap-3 ${row3.length > 0 ? "mb-3" : ""} ${compact ? "grid-cols-2" : "grid-cols-3"}`}>
        {row2.map((slot, i) => (
          <SlotCard key={slot?.id || `empty-${i + (compact ? 3 : 4)}`} slot={slot} index={i + (compact ? 3 : 4)} />
        ))}
      </div>
      {row3.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {row3.map((slot, i) => (
            <SlotCard key={slot?.id || `empty-${i + 5}`} slot={slot} index={i + 5} />
          ))}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const CURRENCIES = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "INR", label: "INR — Indian Rupee" },
  { value: "GBP", label: "GBP — British Pound" },
];

export default function CreateProduct() {
  const navigate = useNavigate();
  const { handleCreateProduct } = useProduct();

  const [form, setForm] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "USD",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Product title is required."); return; }
    if (!form.priceAmount || isNaN(form.priceAmount) || Number(form.priceAmount) <= 0) {
      setError("Enter a valid price."); return;
    }
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("priceAmount", form.priceAmount);
      formData.append("priceCurrency", form.priceCurrency);
      images.forEach(({ file }) => formData.append("images", file));

      await handleCreateProduct(formData);
      navigate("/seller/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#131313", color: "#e5e2e1" }}
    >
      {/* ══════════════════════════════
          LEFT SIDEBAR — sticky branding
      ══════════════════════════════ */}
      <aside
        className="hidden lg:flex flex-col justify-between w-72 xl:w-80 flex-shrink-0 px-10 py-14 sticky top-0 h-screen"
        style={{ background: "#0c0c0c", borderRight: "1px solid #1a1a1a" }}
      >
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute top-[-80px] left-[-80px] w-80 h-80 rounded-full"
          style={{ background: "#ffd700", opacity: 0.06, filter: "blur(100px)" }}
        />

        <div className="relative z-10">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-14 group w-fit cursor-pointer bg-transparent border-none p-0"
          >
            <span
              className="text-2xl font-black tracking-[-0.05em] uppercase"
              style={{ fontFamily: "Manrope, sans-serif", color: "#ffd700" }}
            >
              SNITCH
            </span>
            <span
              className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest"
              style={{ background: "#1c1b00", color: "#ffd700", letterSpacing: "0.15em" }}
            >
              Seller
            </span>
          </button>

          {/* Page title */}
          <div className="mb-12">
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#3a3820",
                marginBottom: "12px",
              }}
            >
              New Listing
            </p>
            <h1
              className="leading-none tracking-tight"
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "clamp(2.4rem, 3.5vw, 3.2rem)",
                fontWeight: 800,
                color: "#e5e2e1",
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
              }}
            >
              Create a<br />
              <span style={{ color: "#ffd700" }}>Product.</span>
            </h1>
            <p
              className="mt-5 leading-relaxed"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                color: "#5a5640",
                lineHeight: "1.75",
              }}
            >
              Add your product details,
              set pricing, and upload photos
              to publish to your storefront.
            </p>
          </div>

          {/* Step indicators */}
          <div className="space-y-4">
            {[
              { num: "01", label: "Product Info" },
              { num: "02", label: "Pricing" },
              { num: "03", label: "Images" },
            ].map(({ num, label }) => (
              <div key={num} className="flex items-center gap-3">
                <span
                  style={{
                    fontFamily: "Manrope, sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#ffd700",
                    opacity: 0.5,
                    minWidth: "24px",
                  }}
                >
                  {num}
                </span>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    color: "#3a3820",
                    letterSpacing: "0.05em",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="relative z-10 space-y-1">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 group cursor-pointer bg-transparent border-none p-0"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#4d4732" strokeWidth="1.5" strokeLinecap="round">
              <line x1="12" y1="7" x2="2" y2="7" />
              <polyline points="6 3 2 7 6 11" />
            </svg>
            <span
              className="transition-colors duration-150 group-hover:opacity-60"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "10px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#4d4732",
              }}
            >
              Back
            </span>
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════
          MAIN — scrollable form
      ══════════════════════════════ */}
      <main
        className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Mobile top bar */}
        <header
          className="lg:hidden flex items-center justify-between px-6 h-14 border-b flex-shrink-0"
          style={{ borderColor: "#1c1b1b" }}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#999077" strokeWidth="1.5" strokeLinecap="round">
              <line x1="12" y1="7" x2="2" y2="7" />
              <polyline points="6 3 2 7 6 11" />
            </svg>
          </button>
          <span
            className="font-black tracking-[-0.05em] uppercase"
            style={{ fontFamily: "Manrope, sans-serif", color: "#ffd700", fontSize: "18px" }}
          >
            SNITCH
          </span>
          <div className="w-6" />
        </header>

        {/* Form container — fluid on desktop, capped on mobile */}
        <div className="w-full px-8 sm:px-12 lg:px-14 xl:px-20 py-12 xl:py-16 xl:max-w-none">

          {/* Mobile page title */}
          <div className="lg:hidden mb-12">
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "9px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#4d4732",
              }}
            >
              New Product
            </p>
            <h1
              className="mt-2"
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "2rem",
                fontWeight: 800,
                color: "#e5e2e1",
                letterSpacing: "-0.03em",
              }}
            >
              Create your listing
            </h1>
          </div>

          <form onSubmit={handleSubmit}>

            {/* ═══════════════════════════════════════
                DESKTOP TWO-COLUMN GRID
                Left  → Product Info (title + description)
                Right → Pricing + Images
            ═══════════════════════════════════════ */}
            <div className="xl:grid xl:grid-cols-2 xl:gap-x-16 xl:items-start">

              {/* ── LEFT COL: Product Info ── */}
              <section className="mb-20 xl:mb-0">
                <SectionLabel>01 — Product Info</SectionLabel>
                <div className="space-y-14">
                  <EditorialInput
                    id="title"
                    label="Product Title"
                    placeholder="e.g. Obsidian Oversized Tee"
                    value={form.title}
                    onChange={handle}
                    maxLength={80}
                    required
                  />
                  <EditorialTextarea
                    id="description"
                    label="Description"
                    placeholder="Describe the product — fabric, fit, feel, story…"
                    value={form.description}
                    onChange={handle}
                    rows={8}
                    maxLength={600}
                  />
                </div>
              </section>

              {/* ── RIGHT COL: Pricing + Images ── */}
              <div className="space-y-14">

                {/* Pricing */}
                <section>
                  <SectionLabel>02 — Pricing</SectionLabel>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-12">
                    <EditorialInput
                      id="priceAmount"
                      label="Price Amount"
                      type="number"
                      placeholder="0.00"
                      value={form.priceAmount}
                      onChange={handle}
                      required
                    />
                    <EditorialSelect
                      id="priceCurrency"
                      label="Currency"
                      value={form.priceCurrency}
                      onChange={handle}
                      options={CURRENCIES}
                      required
                    />
                  </div>
                  {/* Live price preview */}
                  {form.priceAmount && !isNaN(form.priceAmount) && Number(form.priceAmount) > 0 && (
                    <div
                      className="mt-6 px-4 py-3 rounded-lg flex items-center justify-between"
                      style={{ background: "#1c1b1b" }}
                    >
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "9px",
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: "#4d4732",
                        }}
                      >
                        Preview
                      </span>
                      <span
                        style={{
                          fontFamily: "Manrope, sans-serif",
                          fontSize: "18px",
                          fontWeight: 800,
                          color: "#ffd700",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: form.priceCurrency || "USD",
                          minimumFractionDigits: 2,
                        }).format(Number(form.priceAmount))}
                      </span>
                    </div>
                  )}
                </section>

                {/* Images */}
                <section>
                  <SectionLabel>03 — Images</SectionLabel>
                  {/* compact=true on xl so image grid fits the narrower right column */}
                  <ImageUploader
                    images={images}
                    setImages={setImages}
                    compact={true}
                  />
                </section>

              </div>
            </div>

            {/* ── Error message — full width ── */}
            {error && (
              <div
                className="mt-10 rounded-lg px-4 py-3 flex items-start gap-3"
                style={{ background: "rgba(147,0,10,0.15)", border: "1px solid rgba(147,0,10,0.3)" }}
              >
                <svg className="flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" stroke="#ffb4ab" strokeWidth="1.2" />
                  <line x1="7" y1="4" x2="7" y2="7.5" stroke="#ffb4ab" strokeWidth="1.4" strokeLinecap="round" />
                  <circle cx="7" cy="10" r="0.7" fill="#ffb4ab" />
                </svg>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#ffb4ab" }}>
                  {error}
                </p>
              </div>
            )}

            {/* ── Submit — full width ── */}
            <div className="mt-12 pb-16">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-16 font-extrabold uppercase tracking-[0.22em] rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-3"
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "13px",
                  fontWeight: 800,
                  background: loading
                    ? "#2a2619"
                    : "linear-gradient(135deg, #ffe16d 0%, #ffd700 60%, #e9c400 100%)",
                  color: loading ? "#4d4732" : "#1a1300",
                  boxShadow: loading
                    ? "none"
                    : "0 12px 40px rgba(255, 215, 0, 0.22), 0 4px 16px rgba(255, 215, 0, 0.12)",
                  letterSpacing: "0.22em",
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.filter = "brightness(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "brightness(1)";
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="#221b00" strokeWidth="2" opacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="#221b00" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Publishing…
                  </>
                ) : (
                  <>
                    Publish Product
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <line x1="2" y1="7" x2="11" y2="7" stroke="#221b00" strokeWidth="1.8" strokeLinecap="round" />
                      <polyline points="8 4 11 7 8 10" stroke="#221b00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>

              <p
                className="text-center mt-4"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.1em",
                  color: "#4d4732",
                }}
              >
                You can edit or unpublish this product at any time from your dashboard.
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
