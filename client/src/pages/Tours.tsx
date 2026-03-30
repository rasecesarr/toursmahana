/* Mahana Tours — Tours Catalog Page */
import { useState, useMemo } from "react";
import { Link, useSearch } from "wouter";
import { motion } from "framer-motion";
import { Clock, Users, MapPin, Search, Filter, ArrowRight, Star, Bed, DollarSign } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { IMAGES, CATEGORIES, ALL_TOURS, WHATSAPP_URL } from "@/lib/data";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5 } }),
};

export default function Tours() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialCat = params.get("cat") || "all";

  const [activeCat, setActiveCat] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc">("name");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [durationFilter, setDurationFilter] = useState<string>("all");

  // Filter out boat tours (they have their own page)
  const nonBoatCategories = CATEGORIES.filter(c => !c.id.startsWith("botes"));
  const nonBoatTours = ALL_TOURS.filter(t => !t.category.startsWith("botes"));

  const filtered = useMemo(() => {
    let tours = nonBoatTours;
    if (activeCat !== "all") tours = tours.filter((t) => t.category === activeCat);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      tours = tours.filter((t) => t.name.toLowerCase().includes(q) || t.shortDescription.toLowerCase().includes(q));
    }
    // Price filter
    tours = tours.filter((t) => t.price <= maxPrice);
    // Duration filter
    if (durationFilter === "short") tours = tours.filter((t) => t.duration.includes("min") || t.duration === "1 hora");
    else if (durationFilter === "half") tours = tours.filter((t) => {
      const h = parseInt(t.duration);
      return !t.duration.includes("min") && h >= 2 && h <= 4;
    });
    else if (durationFilter === "full") tours = tours.filter((t) => {
      const h = parseInt(t.duration);
      return !t.duration.includes("min") && (h >= 5 || t.duration.includes("día") || t.duration.includes("clases"));
    });
    if (sortBy === "price-asc") tours = [...tours].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") tours = [...tours].sort((a, b) => b.price - a.price);
    return tours;
  }, [activeCat, searchQuery, sortBy, maxPrice, durationFilter]);

  return (
    <div className="min-h-screen bg-sand">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.cascadaJungle} alt="Cascadas de Filipinas" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-blue/80 to-deep-blue/60" />
        </div>
        <div className="container relative z-10 text-center">
          <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em]">Catálogo Completo</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Todos los Tours
          </h1>
          <p className="text-white/70 max-w-xl mx-auto">
            {nonBoatTours.length} experiencias únicas en la Riviera del Pacífico. Filtra por categoría, busca por nombre o explora todo.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-sand-dark sticky top-16 md:top-20 z-30">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar tour..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-5 py-3 border border-sand-dark rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 bg-sand"
              />
            </div>
            {/* Sort */}
            <div className="flex items-center gap-4">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border border-sand-dark rounded-full px-5 py-3 bg-sand focus:outline-none focus:ring-2 focus:ring-gold/50 cursor-pointer"
              >
                <option value="name">Nombre</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
              </select>
              <select
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
                className="text-sm border border-sand-dark rounded-full px-5 py-3 bg-sand focus:outline-none focus:ring-2 focus:ring-gold/50 cursor-pointer"
              >
                <option value="all">Toda duración</option>
                <option value="short">Corto (≤1h)</option>
                <option value="half">Medio día (2-4h)</option>
                <option value="full">Día completo (5h+)</option>
              </select>
            </div>
            {/* Price slider */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <DollarSign className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground whitespace-nowrap">Máx: ${maxPrice}</span>
              <input
                type="range"
                min={20}
                max={1000}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="flex-1 accent-amber-600 min-w-[120px]"
              />
            </div>
          </div>
          {/* Category tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCat("all")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCat === "all" ? "bg-deep-blue text-white" : "bg-sand text-muted-foreground hover:bg-sand-dark"
              }`}
            >
              Todos ({nonBoatTours.length})
            </button>
            {nonBoatCategories.map((cat) => {
              const count = nonBoatTours.filter((t) => t.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCat === cat.id ? "bg-deep-blue text-white" : "bg-sand text-muted-foreground hover:bg-sand-dark"
                  }`}
                >
                  {cat.shortName} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tour Grid */}
      <section className="py-12">
        <div className="container">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No se encontraron tours con esos filtros.</p>
              <button onClick={() => { setActiveCat("all"); setSearchQuery(""); }} className="mt-4 text-gold-dark font-semibold hover:underline">
                Ver todos los tours
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((tour, i) => (
                <motion.div
                  key={tour.id}
                  initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={fadeUp} custom={i % 6}
                >
                  <Link href={`/tour/${tour.id}`} className="group block bg-white rounded-xl overflow-hidden border border-sand-dark tour-card h-full">
                    <div className="relative h-52 overflow-hidden">
                      <img src={tour.image} alt={tour.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute top-3 left-3 px-3 py-1 bg-gold/90 text-deep-blue text-xs font-semibold rounded-full">
                        {CATEGORIES.find(c => c.id === tour.category)?.shortName}
                      </div>
                      {tour.difficulty && (
                        <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 text-deep-blue text-xs font-semibold rounded-full">
                          {tour.difficulty}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-deep-blue text-lg mb-2" style={{ fontFamily: "var(--font-display)" }}>{tour.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{tour.shortDescription}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{tour.duration}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />Max {tour.maxPax}</span>
                        {tour.meetingPoint && (
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{tour.meetingPoint.split(",")[0]}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-5 border-t border-sand-dark">
                        <div>
                          <span className="text-xs text-muted-foreground">Desde</span>
                          <span className="text-xl font-bold text-gold-dark ml-1" style={{ fontFamily: "var(--font-display)" }}>${tour.price}</span>
                          <span className="text-xs text-muted-foreground">/persona</span>
                        </div>
                        <span className="text-sm font-semibold text-gold-dark group-hover:text-gold transition-colors flex items-center gap-1">
                          Ver Tour <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA — Dual: custom tours + stay */}
      <section className="py-16 bg-deep-blue">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-white/60 mb-6 max-w-lg mx-auto">
            Armamos tours privados y experiencias a la medida. O combina tus tours favoritos con estadía en el Radisson Riviera.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-deep-blue font-semibold rounded-full hover:bg-gold-light transition-colors"
            >
              Hablar con un Asesor <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={`${WHATSAPP_URL}?text=${encodeURIComponent('Hola! Me interesa un paquete de tours con estadía en el Radisson Riviera')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gold/60 text-gold font-semibold rounded-full hover:bg-gold/10 transition-colors"
            >
              <Bed className="w-4 h-4" /> Paquete con Estadía
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
