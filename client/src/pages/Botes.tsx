/* Mahana Tours — Botes Premium Page */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Clock, Users, ArrowRight, Anchor, Wifi, Wind, UtensilsCrossed, Music, Star, Bed } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { IMAGES, WHATSAPP_URL } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { Tour } from "@server/db/schema";
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function Botes() {
  const { data: allTours = [] } = useQuery<Tour[]>({ queryKey: ["/api/tours"] });
  const sthamasTours = allTours.filter((t: Tour) => t.category === "botes-sthamas");
  const rampageTours = allTours.filter((t: Tour) => t.category === "botes-rampage");

  return (
    <div className="min-h-screen bg-sand">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.sunsetCruise} alt="Sunset cruise" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
        <div className="container relative z-10">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl">
            <motion.span variants={fadeUp} custom={0} className="text-gold text-sm font-semibold uppercase tracking-[0.2em]">
              Experiencia Premium
            </motion.span>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-3 mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Botes Premium
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
              Dos yates de clase mundial para experiencias únicas en el Pacífico panameño. Sunset cruises, pesca deportiva, fiestas privadas y expediciones a islas vírgenes.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ STHAMAS 39' ═══════════════ */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <span className="text-gold-dark text-sm font-semibold uppercase tracking-[0.2em]">Yate Premium</span>
              <h2 className="text-3xl md:text-4xl font-bold text-deep-blue mt-3 mb-6" style={{ fontFamily: "var(--font-display)" }}>
                Sthamas 39'
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Nuestro yate insignia de 39 pies. Perfecto para sunset cruises, fiestas privadas, pesca deportiva de altura y day trips a las islas Otoque y Boná. Capacidad para hasta 15 personas con todas las comodidades.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Anchor className="w-5 h-5 text-gold shrink-0" />
                  <span>39 pies de eslora</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Users className="w-5 h-5 text-gold shrink-0" />
                  <span>Hasta 15 personas</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Wind className="w-5 h-5 text-gold shrink-0" />
                  <span>Aire acondicionado</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <UtensilsCrossed className="w-5 h-5 text-gold shrink-0" />
                  <span>BBQ a bordo</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Wifi className="w-5 h-5 text-gold shrink-0" />
                  <span>WiFi disponible</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Music className="w-5 h-5 text-gold shrink-0" />
                  <span>Sistema de sonido</span>
                </div>
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              <img src={IMAGES.sunsetCruise} alt="Sthamas 39" className="rounded-xl w-full h-80 object-cover" />
            </motion.div>
          </div>

          {/* Sthamas Tours Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sthamasTours.map((tour, i) => (
              <motion.div key={tour.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Link href={`/tour/${tour.id}`} className="group block bg-sand rounded-xl overflow-hidden border border-sand-dark tour-card h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img src={tour.image} alt={tour.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-3 left-3 px-3 py-1 bg-gold/90 text-deep-blue text-xs font-semibold rounded-full">Sthamas 39'</div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-deep-blue text-lg mb-2" style={{ fontFamily: "var(--font-display)" }}>{tour.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{tour.shortDescription}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-sand-dark">
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
        </div>
      </section>

      {/* Gold Divider */}
      <div className="gold-divider" />

      {/* ═══════════════ RAMPAGE 31' ═══════════════ */}
      <section className="py-20 bg-sand">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="order-2 lg:order-1">
              <img src={IMAGES.fishingBoat} alt="Rampage 31" className="rounded-xl w-full h-80 object-cover" />
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="order-1 lg:order-2">
              <span className="text-gold-dark text-sm font-semibold uppercase tracking-[0.2em]">Pesca & Aventura</span>
              <h2 className="text-3xl md:text-4xl font-bold text-deep-blue mt-3 mb-6" style={{ fontFamily: "var(--font-display)" }}>
                Rampage 31'
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Nuestro bote de pesca deportiva de 31 pies. Diseñado para la acción: pesca de altura, trolling, expediciones a islas y aventuras de medio día. Equipado con todo lo necesario para una jornada de pesca inolvidable.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Anchor className="w-5 h-5 text-gold shrink-0" />
                  <span>31 pies de eslora</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Users className="w-5 h-5 text-gold shrink-0" />
                  <span>Hasta 8 personas</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Star className="w-5 h-5 text-gold shrink-0" />
                  <span>Equipo de pesca pro</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <UtensilsCrossed className="w-5 h-5 text-gold shrink-0" />
                  <span>Cooler & snacks</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Rampage Tours Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rampageTours.map((tour, i) => (
              <motion.div key={tour.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Link href={`/tour/${tour.id}`} className="group block bg-white rounded-xl overflow-hidden border border-sand-dark tour-card h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img src={tour.image} alt={tour.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-3 left-3 px-3 py-1 bg-gold/90 text-deep-blue text-xs font-semibold rounded-full">Rampage 31'</div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-deep-blue text-lg mb-2" style={{ fontFamily: "var(--font-display)" }}>{tour.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{tour.shortDescription}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-sand-dark">
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
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.islaBonaCoast} alt="Isla Bona" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-deep-blue/75" />
        </div>
        <div className="container relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
            ¿Quieres un charter privado?
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Armamos experiencias a la medida: cumpleaños, despedidas, corporate events, propuestas de matrimonio. Cuéntanos tu idea.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-deep-blue font-semibold rounded-full hover:bg-gold-light transition-colors"
            >
              Cotizar Charter Privado <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={`${WHATSAPP_URL}?text=${encodeURIComponent('Hola! Me interesa un charter privado + estadía en el Radisson Riviera')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gold/60 text-gold font-semibold rounded-full hover:bg-gold/10 transition-colors"
            >
              <Bed className="w-4 h-4" /> Charter + Estadía en Radisson
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
