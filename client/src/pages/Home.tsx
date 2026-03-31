/* Mahana Tours — Golden Hour Explorer Home Page */
/* DESIGN: Tour-focused heroes. Caracol is backdrop, tours are the stars. Dual CTAs: book tour + suggest stay */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Star, Clock, Users, MapPin, Sun, Waves, Mountain, Ship, Anchor, Zap, Bed, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import DestinationMap from "@/components/DestinationMap";
import { IMAGES, WHATSAPP_URL } from "@/lib/data";
import { Tour, Category } from "@server/db/schema";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "surf-kite": <Waves className="w-5 h-5" />,
  "acuaticas": <Anchor className="w-5 h-5" />,
  "premium": <Zap className="w-5 h-5" />,
  "botes-sthamas": <Ship className="w-5 h-5" />,
  "botes-rampage": <Ship className="w-5 h-5" />,
  "eco-adventures": <Mountain className="w-5 h-5" />,
};

// Hero slideshow — tour-focused images, NOT aerial Caracol
const HERO_SLIDES = [
  { image: IMAGES.cerroSunrise, title: "Conquista el Cerro Chame", subtitle: "Amanecer a 560 metros sobre el Pacífico" },
  { image: IMAGES.cascadaJungle, title: "Cascadas Escondidas", subtitle: "7 cascadas en la selva panameña en un día" },
  { image: IMAGES.islaOtoqueCoast, title: "Islas Vírgenes del Pacífico", subtitle: "Otoque y Boná: snorkel, playa privada y naturaleza intacta" },
  { image: IMAGES.kitesurfPuntaChame, title: "Vuela Sobre el Agua", subtitle: "Kitesurf en Punta Chame con vientos perfectos" },
  { image: IMAGES.sunsetCruise, title: "Sunset Cruise Premium", subtitle: "Atardecer en yate privado con cócteles y BBQ" },
];

// Featured tours — hand-picked heroes
const FEATURED_IDS = [
  "sthamas-sunset", "tour-7-cascadas", "avistamiento-ballenas",
  "jet-ski-1h", "isla-otoque-bona", "kite-surf-clase",
  "hiking-cerro-chame", "rappel-filipinas",
];

export default function Home() {
  const { data: allTours = [] } = useQuery<Tour[]>({ queryKey: ["/api/tours"] });
  const { data: categories = [] } = useQuery<Category[]>({ queryKey: ["/api/categories"] });

  const featured = FEATURED_IDS.map((id) => allTours.find((t) => t.id === id)).filter((t): t is Tour => !!t);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-sand">
      <Navbar />

      {/* ═══════════════ HERO — TOUR-FOCUSED SLIDESHOW ═══════════════ */}
      <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: currentSlide === i ? 1 : 0 }}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        ))}
        <div className="container relative z-10">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl">
            <motion.div variants={fadeUp} custom={0} className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                <Sun className="w-4 h-4 text-deep-blue" />
              </div>
              <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em]">Mahana Tours</span>
            </motion.div>
            <motion.h1
              variants={fadeUp} custom={1}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {HERO_SLIDES[currentSlide].title}
            </motion.h1>
            <motion.p variants={fadeUp} custom={1.5} className="text-xl text-gold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              {HERO_SLIDES[currentSlide].subtitle}
            </motion.p>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
              Más de 45 tours y experiencias en la Riviera del Pacífico panameño. Surf, islas vírgenes, cascadas, pesca deportiva y mucho más.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
              <Link
                href="/tours"
                className="px-8 py-3 bg-gold text-deep-blue font-semibold rounded-full hover:bg-gold-light transition-colors inline-flex items-center gap-2"
              >
                Explorar Tours <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 border-2 border-white/40 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
              >
                Reservar Ahora
              </a>
            </motion.div>
          </motion.div>
        </div>
        {/* Slide indicators */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === i ? "w-8 bg-gold" : "bg-white/40 hover:bg-white/60"}`}
            />
          ))}
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs uppercase tracking-widest">Descubre</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>

      {/* ═══════════════ STATS BAR ═══════════════ */}
      <section className="bg-deep-blue py-6">
        <div className="container flex flex-wrap items-center justify-center gap-8 md:gap-16 text-white">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-gold" />
            <div>
              <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>47+</span>
              <p className="text-xs text-white/60">Tours Disponibles</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gold" />
            <div>
              <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>2,500+</span>
              <p className="text-xs text-white/60">Aventureros</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gold" />
            <div>
              <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>6</span>
              <p className="text-xs text-white/60">Categorías</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gold" />
            <div>
              <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>1h</span>
              <p className="text-xs text-white/60">Desde Ciudad de Panamá</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CATEGORIES ═══════════════ */}
      <section className="py-20 bg-sand">
        <div className="container">
          <div className="text-center mb-14">
            <span className="text-gold-dark text-sm font-semibold uppercase tracking-[0.2em]">Elige tu aventura</span>
            <h2 className="text-3xl md:text-4xl font-bold text-deep-blue mt-3" style={{ fontFamily: "var(--font-display)" }}>
              6 Categorías de Tours
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Desde clases de surf hasta expediciones de pesca en yate premium. Hay una aventura para cada tipo de viajero.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat: Category, i) => (
              <motion.div
                key={cat.id}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
              >
                <Link
                  href={cat.id.startsWith("botes") ? "/botes" : `/tours?cat=${cat.id}`}
                  className="group block relative h-64 rounded-xl overflow-hidden tour-card"
                >
                  <img src={cat.image} alt={cat.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gold/90 flex items-center justify-center text-deep-blue">
                        {CATEGORY_ICONS[cat.id]}
                      </div>
                      <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>{cat.name}</h3>
                    </div>
                    <p className="text-sm text-white/70 line-clamp-2">{cat.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ GOLD DIVIDER ═══════════════ */}
      <div className="gold-divider" />

      {/* ═══════════════ FEATURED TOURS ═══════════════ */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <span className="text-gold-dark text-sm font-semibold uppercase tracking-[0.2em]">Los más populares</span>
            <h2 className="text-3xl md:text-4xl font-bold text-deep-blue mt-3" style={{ fontFamily: "var(--font-display)" }}>
              Tours Destacados
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((tour, i) => tour && (
              <motion.div
                key={tour.id}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
              >
                <Link href={`/tour/${tour.id}`} className="group block bg-white rounded-xl overflow-hidden border border-sand-dark tour-card">
                  <div className="relative h-48 overflow-hidden">
                    <img src={tour.image} alt={tour.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-3 left-3 px-3 py-1 bg-gold/90 text-deep-blue text-xs font-semibold rounded-full">
                      {categories.find((c: Category) => c.id === tour.category)?.shortName}
                    </div>
                    {tour.available !== "Todo el año" && (
                      <div className="absolute top-3 right-3 px-3 py-1 bg-deep-blue/80 text-white text-xs font-semibold rounded-full">
                        {tour.available}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-deep-blue text-base mb-1" style={{ fontFamily: "var(--font-display)" }}>{tour.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{tour.shortDescription}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{tour.duration}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />Max {tour.maxPax}</span>
                      </div>
                      <span className="text-lg font-bold text-gold-dark" style={{ fontFamily: "var(--font-display)" }}>${tour.price}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 px-8 py-3 bg-deep-blue text-white font-semibold rounded-full hover:bg-ocean transition-colors"
            >
              Ver Todos los Tours <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ STAY AT CARACOL — DUAL CTA ═══════════════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.radissonPool} alt="Radisson Riviera pool" loading="lazy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-deep-blue/75" />
        </div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <div className="flex items-center gap-2 mb-4">
                <Bed className="w-5 h-5 text-gold" />
                <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em]">Quédate en Caracol</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Combina tu Tour con Estadía en el Radisson Riviera
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                ¿Por qué hacer solo un tour cuando puedes vivir la experiencia completa? Quédate en el Radisson Riviera frente al mar: piscina infinita, restaurante Vento Beach Club, spa, y acceso directo a la playa.
              </p>
              <p className="text-white/70 leading-relaxed mb-8">
                Arma tu paquete perfecto: elige tus tours favoritos + noches en el hotel. Nosotros coordinamos todo para que tú solo disfrutes.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={`${WHATSAPP_URL}?text=Hola!%20Me%20interesa%20un%20paquete%20de%20tours%20con%20estadía%20en%20el%20Radisson%20Riviera`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-gold text-deep-blue font-semibold rounded-full hover:bg-gold-light transition-colors inline-flex items-center gap-2"
                >
                  <Bed className="w-4 h-4" /> Armar Paquete con Estadía
                </a>
                <Link
                  href="/tours"
                  className="px-8 py-3 border-2 border-white/40 text-white font-semibold rounded-full hover:bg-white/10 transition-colors inline-flex items-center gap-2"
                >
                  Solo Ver Tours <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              <div className="grid grid-cols-2 gap-3">
                <img src={IMAGES.radissonAerial} alt="Radisson Riviera aerial" loading="lazy" className="rounded-xl h-40 w-full object-cover" />
                <img src={IMAGES.radissonPool} alt="Radisson pool" loading="lazy" className="rounded-xl h-40 w-full object-cover" />
                <img src={IMAGES.ventoClub} alt="Vento Beach Club" loading="lazy" className="rounded-xl h-40 w-full object-cover col-span-2" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ ABOUT PLAYA CARACOL — TOUR FOCUSED ═══════════════ */}
      <section className="py-20 bg-sand">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <span className="text-gold-dark text-sm font-semibold uppercase tracking-[0.2em]">Base de operaciones</span>
              <h2 className="text-3xl md:text-4xl font-bold text-deep-blue mt-3 mb-6" style={{ fontFamily: "var(--font-display)" }}>
                Playa Caracol: Donde Comienzan Todas las Aventuras
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A solo 90 minutos de Ciudad de Panamá, Playa Caracol es el epicentro de la aventura en el Pacífico panameño. Desde aquí salen todos nuestros tours: las olas para surf, los vientos para kite, los botes hacia las islas, y los senderos hacia cascadas y montañas.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Nuestros instructores locales conocen cada rincón de esta costa. Cada tour está diseñado para que vivas lo mejor de la Riviera del Pacífico con seguridad y pasión.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-sand-dark">
                  <span className="text-2xl font-bold text-gold-dark" style={{ fontFamily: "var(--font-display)" }}>90 min</span>
                  <p className="text-xs text-muted-foreground mt-1">Desde Ciudad de Panamá</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-sand-dark">
                  <span className="text-2xl font-bold text-gold-dark" style={{ fontFamily: "var(--font-display)" }}>28°C</span>
                  <p className="text-xs text-muted-foreground mt-1">Temperatura promedio</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-sand-dark">
                  <span className="text-2xl font-bold text-gold-dark" style={{ fontFamily: "var(--font-display)" }}>365</span>
                  <p className="text-xs text-muted-foreground mt-1">Días de sol al año</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-sand-dark">
                  <span className="text-2xl font-bold text-gold-dark" style={{ fontFamily: "var(--font-display)" }}>47+</span>
                  <p className="text-xs text-muted-foreground mt-1">Tours disponibles</p>
                </div>
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              <div className="grid grid-cols-2 gap-3">
                <img src={IMAGES.cerroSunrise} alt="Cerro Chame sunrise" className="rounded-xl h-48 w-full object-cover" />
                <img src={IMAGES.cascadaFilipinasNew} alt="Cascada Filipinas" className="rounded-xl h-48 w-full object-cover" />
                <img src={IMAGES.islaOtoqueCoast} alt="Isla Otoque" className="rounded-xl h-48 w-full object-cover" />
                <img src={IMAGES.surfLessonPanama} alt="Surf lesson" className="rounded-xl h-48 w-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ DESTINATION MAP ═══════════════ */}
      <DestinationMap />

      {/* ═══════════════ BOTES PREMIUM CTA ═══════════════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.sunsetCruise} alt="Sunset cruise" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-deep-blue/70" />
        </div>
        <div className="container relative z-10 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em]">Experiencia Premium</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Botes Premium: Sthamas 39' y Rampage 31'
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed">
              Sunset cruises, fiestas privadas, pesca deportiva de altura, day trips a islas vírgenes y avistamiento de ballenas. Todo en yates premium con A/C, BBQ, WiFi y tripulación profesional.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/botes"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-deep-blue font-semibold rounded-full hover:bg-gold-light transition-colors"
              >
                Ver Botes Premium <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`${WHATSAPP_URL}?text=Hola!%20Me%20interesa%20un%20charter%20privado%20en%20yate`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 border-2 border-white/40 text-white font-semibold rounded-full hover:bg-white/10 transition-colors inline-flex items-center gap-2"
              >
                Cotizar Charter Privado
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <span className="text-gold-dark text-sm font-semibold uppercase tracking-[0.2em]">Lo que dicen</span>
            <h2 className="text-3xl md:text-4xl font-bold text-deep-blue mt-3" style={{ fontFamily: "var(--font-display)" }}>
              Aventureros Felices
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Carlos M.", from: "Ciudad de Panamá", text: "El sunset cruise en el Sthamas fue increíble. BBQ en el yate viendo el atardecer del Pacífico. Ya reservé el próximo mes con más amigos.", rating: 5 },
              { name: "Sarah K.", from: "California, USA", text: "The 7 waterfalls tour was the highlight of our Panama trip. Our guide knew every hidden spot. The rappel was amazing — we felt like explorers.", rating: 5 },
              { name: "Ana L.", from: "Bogotá, Colombia", text: "Las clases de kitesurf en Punta Chame son de otro nivel. Vientos perfectos todo el día. Vuelvo en enero por la certificación IKO.", rating: 5 },
              { name: "Roberto G.", from: "Ciudad de Panamá", text: "Hicimos el tour de islas con los niños. Agua cristalina, playas vacías y un capitán que nos cocinó el pescado que capturamos. Inolvidable.", rating: 5 },
              { name: "María P.", from: "San José, Costa Rica", text: "El hiking al Cerro Chame al amanecer… no tengo palabras. Ver el Pacífico desde 560 metros con el sol saliendo es de otro mundo.", rating: 5 },
              { name: "David T.", from: "Houston, TX", text: "My kids had surf lessons at ANS and loved it. The instructors were patient, fun and professional. We're coming back every winter break.", rating: 5 },
            ].map((review, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                className="bg-sand rounded-xl p-6 border border-sand-dark"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 italic">"{review.text}"</p>
                <div>
                  <p className="font-semibold text-deep-blue text-sm">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.from}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA — DUAL ═══════════════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.cerroHiker} alt="Hiking Cerro Chame" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-deep-blue/80 to-deep-blue/60" />
        </div>
        <div className="container relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
            ¿Listo para tu próxima aventura?
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Escríbenos por WhatsApp y armamos tu experiencia perfecta en la Riviera del Pacífico. Tours sueltos o paquetes con estadía en el Radisson Riviera.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-gold text-deep-blue font-semibold rounded-full hover:bg-gold-light transition-colors inline-flex items-center gap-2"
            >
              Reservar Tour <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={`${WHATSAPP_URL}?text=Hola!%20Me%20interesa%20un%20paquete%20de%20tours%20con%20estadía%20en%20el%20Radisson%20Riviera`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border-2 border-gold/60 text-gold font-semibold rounded-full hover:bg-gold/10 transition-colors inline-flex items-center gap-2"
            >
              <Bed className="w-4 h-4" /> Paquete con Estadía
            </a>
            <Link
              href="/tours"
              className="px-8 py-3 border-2 border-white/40 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              Ver Todos los Tours
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
