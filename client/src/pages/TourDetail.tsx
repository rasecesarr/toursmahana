/* Mahana Tours — Tour Detail Page (Salty Souls storytelling) */
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Clock, Users, MapPin, Star, Check, X, ArrowRight, ArrowLeft, Calendar, Shield, Sun, Phone, Bed } from "lucide-react";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import StickyCTA from "@/components/StickyCTA";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { IMAGES, WHATSAPP_URL, QUOTES, GALLERY_IMAGES } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { Tour, Category } from "@server/db/schema";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function TourDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: allTours = [] } = useQuery<Tour[]>({ queryKey: ["/api/tours"] });
  const { data: categories = [] } = useQuery<Category[]>({ queryKey: ["/api/categories"] });

  const tour = allTours.find((t) => t.id === id);

  if (!tour) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-deep-blue mb-4">Tour no encontrado</h1>
          <Link href="/tours" className="text-gold-dark hover:underline">← Volver a Tours</Link>
        </div>
      </div>
    );
  }

  const category = categories.find((c) => c.id === tour.category);
  
  // Dynamic content from DB (already parsed by backend)
  const tourGallery: string[] = (tour.gallery as any) || (GALLERY_IMAGES[tour.category] || GALLERY_IMAGES["premium"]);
  
  const quote = tour.quote || (QUOTES[tour.category] || QUOTES["premium"]);

  // Related tours (same category, different tour)
  const related = allTours.filter((t) => t.category === tour.category && t.id !== tour.id).slice(0, 3);

  const whatsappMsg = `Hola! Me interesa el tour "${tour.name}" ($${tour.price}/persona). ¿Tienen disponibilidad?`;
  const tourWhatsApp = `${WHATSAPP_URL}&text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="min-h-screen bg-sand">
      <Navbar />
      <StickyCTA label={tour.name} price={tour.price} whatsappLink={tourWhatsApp} />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
        <div className="container relative z-10 pb-12">
          <Link href="/tours" className="inline-flex items-center gap-1 text-white/70 hover:text-gold text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver a Tours
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-gold/90 text-deep-blue text-xs font-semibold rounded-full">{category?.shortName}</span>
            {tour.difficulty && <span className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">{tour.difficulty}</span>}
            {tour.available !== "Todo el año" && <span className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">{tour.available}</span>}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
            {tour.name}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gold" />{tour.duration}</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-gold" />Máx. {tour.maxPax} personas</span>
            {tour.meetingPoint && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gold" />{tour.meetingPoint}</span>}
          </div>
        </div>
      </section>

      {/* ═══════════════ INSPIRATIONAL QUOTE ═══════════════ */}
      <section className="bg-deep-blue py-8">
        <div className="container text-center">
          <p className="text-gold text-lg md:text-xl italic" style={{ fontFamily: "var(--font-display)" }}>
            "{quote}"
          </p>
        </div>
      </section>

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
                <h2 className="text-2xl font-bold text-deep-blue mb-4" style={{ fontFamily: "var(--font-display)" }}>La Experiencia</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">{tour.description}</p>
              </motion.div>

              {/* Photo Break 1 (Indices 0, 1) */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="grid grid-cols-2 gap-3">
                <img src={tourGallery[0] || IMAGES.surfAction} alt="Tour experience" className="rounded-xl h-48 w-full object-cover" />
                <img src={tourGallery[1] || IMAGES.beachAerial} alt="Tour experience" className="rounded-xl h-48 w-full object-cover" />
              </motion.div>

              {/* Who Is This For */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="bg-white rounded-xl p-8 border border-sand-dark">
                <h2 className="text-2xl font-bold text-deep-blue mb-4" style={{ fontFamily: "var(--font-display)" }}>¿Para Quién Es?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {tour.category === "surf-kite" && "Para quienes quieren sentir la adrenalina del viento y las olas. No necesitas experiencia previa — nuestros instructores certificados te guían paso a paso. Solo trae ganas y protector solar."}
                  {tour.category === "acuaticas" && "Para aventureros que quieren explorar el Pacífico de una forma diferente. Desde jet ski hasta snorkel en islas vírgenes, hay algo para cada nivel de experiencia."}
                  {tour.category === "premium" && "Para quienes buscan experiencias exclusivas y únicas. Grupos pequeños, atención personalizada y acceso a lugares que pocos conocen."}
                  {tour.category === "eco-adventures" && "Para los amantes de la naturaleza que quieren descubrir los tesoros escondidos de Panamá. Cascadas, montañas, valles y selva tropical a pocos kilómetros de la playa."}
                  {tour.category.startsWith("botes") && "Para quienes quieren vivir el Pacífico desde el agua. Ya sea un sunset cruise romántico, una fiesta privada o una jornada de pesca deportiva, nuestros yates premium son tu base."}
                </p>
              </motion.div>

              {/* Mid CTA */}
              <div className="relative rounded-xl overflow-hidden py-10 px-8">
                <div className="absolute inset-0">
                  <img src={tourGallery[2] || IMAGES.sunsetCruise} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-deep-blue/80" />
                </div>
                <div className="relative z-10 text-center">
                  <p className="text-gold text-sm font-semibold uppercase tracking-[0.2em] mb-2">¿Te interesa?</p>
                  <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
                    Reserva tu lugar ahora
                  </h3>
                  <a
                    href={tourWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-deep-blue font-semibold rounded-full hover:bg-gold-light transition-colors"
                  >
                    Reservar por WhatsApp <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* What's Included */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}>
                <h2 className="text-2xl font-bold text-deep-blue mb-6" style={{ fontFamily: "var(--font-display)" }}>¿Qué Incluye?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-6 border border-sand-dark">
                    <h3 className="font-semibold text-deep-blue mb-4 flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" /> Incluye
                    </h3>
                    <ul className="space-y-2">
                      {tour.includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white rounded-xl p-6 border border-sand-dark">
                    <h3 className="font-semibold text-deep-blue mb-4 flex items-center gap-2">
                      <X className="w-5 h-5 text-red-500" /> No Incluye
                    </h3>
                    <ul className="space-y-2">
                      {tour.notIncludes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* What to Bring */}
              {tour.whatToBring && tour.whatToBring.length > 0 && (
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4} className="bg-white rounded-xl p-8 border border-sand-dark">
                  <h2 className="text-2xl font-bold text-deep-blue mb-4" style={{ fontFamily: "var(--font-display)" }}>¿Qué Llevar?</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {tour.whatToBring.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-gold shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Photo Break 2 (Indices 2, 3, 4) */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={5} className="grid grid-cols-3 gap-3">
                <img src={tourGallery[2] || IMAGES.surfAction} alt="" className="rounded-xl h-40 w-full object-cover" />
                <img src={tourGallery[3] || IMAGES.beachAerial} alt="" className="rounded-xl h-40 w-full object-cover" />
                <img src={tourGallery[4] || IMAGES.islaOtoque} alt="" className="rounded-xl h-40 w-full object-cover" />
              </motion.div>

              {/* About Playa Caracol */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={6}>
                <h2 className="text-2xl font-bold text-deep-blue mb-4" style={{ fontFamily: "var(--font-display)" }}>Sobre Playa Caracol</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="md:col-span-3">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Playa Caracol está ubicada en Punta Chame, a solo 90 minutos de Ciudad de Panamá. Es el punto de partida perfecto para explorar la Riviera del Pacífico: olas consistentes, vientos kite-friendly, islas vírgenes a 30 minutos en bote, y cascadas escondidas en la selva.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Todos nuestros tours salen desde aquí, con instructores locales que conocen cada rincón de esta costa. Si necesitas alojamiento, el Radisson Riviera está a pasos de la playa con habitaciones frente al mar, piscina y restaurante.
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <img src={tourGallery[5] || IMAGES.radissonAerial} alt="Location" className="rounded-xl w-full h-48 object-cover" />
                    <p className="text-xs text-muted-foreground mt-2 text-center">{tour.meetingPoint || "Playa Caracol, Panamá"}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Sticky Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* Price Card */}
                <div className="bg-white rounded-xl p-6 border border-sand-dark shadow-sm">
                  <div className="text-center mb-6">
                    <span className="text-xs text-muted-foreground">Desde</span>
                    <div className="text-4xl font-bold text-gold-dark" style={{ fontFamily: "var(--font-display)" }}>${tour.price}</div>
                    <span className="text-sm text-muted-foreground">por persona</span>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gold shrink-0" />
                      <span className="text-muted-foreground">Duración:</span>
                      <span className="font-medium text-deep-blue ml-auto">{tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-gold shrink-0" />
                      <span className="text-muted-foreground">Grupo máx:</span>
                      <span className="font-medium text-deep-blue ml-auto">{tour.maxPax} personas</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gold shrink-0" />
                      <span className="text-muted-foreground">Disponible:</span>
                      <span className="font-medium text-deep-blue ml-auto">{tour.available}</span>
                    </div>
                    {tour.meetingPoint && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gold shrink-0" />
                        <span className="text-muted-foreground">Punto:</span>
                        <span className="font-medium text-deep-blue ml-auto text-right text-xs">{tour.meetingPoint}</span>
                      </div>
                    )}
                  </div>
                  <a
                    href={tourWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 bg-gold text-deep-blue text-center font-semibold rounded-full hover:bg-gold-light transition-colors"
                  >
                    Reservar por WhatsApp
                  </a>
                  <p className="text-xs text-center text-muted-foreground mt-3">Respuesta en menos de 1 hora</p>
                </div>

                {/* Trust badges */}
                <div className="bg-white rounded-xl p-5 border border-sand-dark">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Shield className="w-5 h-5 text-gold shrink-0" />
                      <span className="text-muted-foreground">Cancelación flexible hasta 24h antes</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Star className="w-5 h-5 text-gold shrink-0" />
                      <span className="text-muted-foreground">Instructores certificados</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Sun className="w-5 h-5 text-gold shrink-0" />
                      <span className="text-muted-foreground">Equipo incluido</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-5 h-5 text-gold shrink-0" />
                      <span className="text-muted-foreground">Soporte 24/7 por WhatsApp</span>
                    </div>
                  </div>
                </div>

                {/* Stay at Caracol CTA */}
                <div className="bg-white rounded-xl overflow-hidden border border-sand-dark">
                  <img src={IMAGES.radissonPool} alt="Radisson Riviera" className="w-full h-32 object-cover" />
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Bed className="w-4 h-4 text-gold" />
                      <span className="text-xs text-gold-dark font-semibold uppercase tracking-wider">Quédate en Caracol</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Combina este tour con estadía en el Radisson Riviera. Piscina, restaurante frente al mar y acceso directo a la playa.</p>
                    <a
                      href={`${WHATSAPP_URL}&text=${encodeURIComponent(`Hola! Me interesa el tour "${tour.name}" + estadía en el Radisson Riviera. ¿Qué paquetes tienen?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-2.5 bg-deep-blue text-white text-center text-sm font-semibold rounded-full hover:bg-ocean transition-colors"
                    >
                      Armar Paquete con Estadía
                    </a>
                  </div>
                </div>

                {/* Need help */}
                <div className="bg-deep-blue rounded-xl p-5 text-center">
                  <p className="text-white text-sm mb-2">¿Tienes dudas?</p>
                  <p className="text-white/60 text-xs mb-3">Habla con nuestro equipo y resolvemos todo.</p>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gold text-sm font-semibold hover:text-gold-light transition-colors"
                  >
                    Hablar con un asesor <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ RELATED TOURS ═══════════════ */}
      {related.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container">
            <h2 className="text-2xl font-bold text-deep-blue mb-8" style={{ fontFamily: "var(--font-display)" }}>
              Más Tours de {category?.shortName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((t) => (
                <Link key={t.id} href={`/tour/${t.id}`} className="group block bg-sand rounded-xl overflow-hidden border border-sand-dark tour-card">
                  <div className="relative h-44 overflow-hidden">
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-deep-blue mb-1" style={{ fontFamily: "var(--font-display)" }}>{t.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{t.duration}</span>
                      <span className="font-bold text-gold-dark">${t.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={tourGallery[3] || IMAGES.beachAerial} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-deep-blue/75" />
        </div>
        <div className="container relative z-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
            ¿Listo para vivir {tour.name}?
          </h2>
          <p className="text-white/60 max-w-lg mx-auto mb-8">
            Reserva ahora y asegura tu lugar. Grupos pequeños, experiencia personalizada.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={tourWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-deep-blue font-semibold rounded-full hover:bg-gold-light transition-colors"
            >
              Reservar ${tour.price}/persona <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={`${WHATSAPP_URL}&text=${encodeURIComponent(`Hola! Me interesa el tour "${tour.name}" + estadía en el Radisson Riviera`)}`}
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
