import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import { SpaceBackground } from "@/components/space-background"
import { HistorySection } from "@/components/sections/work-section"
import { ProjectsSection } from "@/components/sections/services-section"
import { CareerSection } from "@/components/sections/about-section"
import { AchievementsSection } from "@/components/sections/contact-section"
import { MagneticButton } from "@/components/magnetic-button"
import { useRef, useEffect, useState } from "react"
import Icon from "@/components/ui/icon"

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const target = new Date("2025-09-01T00:00:00")
    const interval = setInterval(() => {
      const now = new Date()
      const diff = target.getTime() - now.getTime()
      if (diff <= 0) {
        clearInterval(interval)
        return
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-4 font-mono text-foreground/90">
      {[
        { v: timeLeft.days, l: "дней" },
        { v: timeLeft.hours, l: "часов" },
        { v: timeLeft.minutes, l: "минут" },
        { v: timeLeft.seconds, l: "секунд" },
      ].map(({ v, l }, i) => (
        <div key={i} className="flex flex-col items-center">
          <span className="text-3xl font-light tabular-nums md:text-5xl">
            {String(v).padStart(2, "0")}
          </span>
          <span className="text-xs text-foreground/50 uppercase tracking-widest">{l}</span>
        </div>
      ))}
    </div>
  )
}

export default function Index() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)
  const scrollThrottleRef = useRef<number>()

  const TOTAL_SECTIONS = 6

  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      const sectionWidth = scrollContainerRef.current.offsetWidth
      scrollContainerRef.current.scrollTo({
        left: sectionWidth * index,
        behavior: "smooth",
      })
      setCurrentSection(index)
    }
  }

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (Math.abs(e.touches[0].clientY - touchStartY.current) > 10) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      const touchEndX = e.changedTouches[0].clientX
      const deltaY = touchStartY.current - touchEndY
      const deltaX = touchStartX.current - touchEndX

      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (deltaY > 0 && currentSection < TOTAL_SECTIONS - 1) {
          scrollToSection(currentSection + 1)
        } else if (deltaY < 0 && currentSection > 0) {
          scrollToSection(currentSection - 1)
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true })
      container.addEventListener("touchmove", handleTouchMove, { passive: false })
      container.addEventListener("touchend", handleTouchEnd, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart)
        container.removeEventListener("touchmove", handleTouchMove)
        container.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [currentSection])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()

        if (!scrollContainerRef.current) return

        scrollContainerRef.current.scrollBy({
          left: e.deltaY,
          behavior: "instant",
        })

        const sectionWidth = scrollContainerRef.current.offsetWidth
        const newSection = Math.round(scrollContainerRef.current.scrollLeft / sectionWidth)
        if (newSection !== currentSection) {
          setCurrentSection(newSection)
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel)
      }
    }
  }, [currentSection])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollThrottleRef.current) return

      scrollThrottleRef.current = requestAnimationFrame(() => {
        if (!scrollContainerRef.current) {
          scrollThrottleRef.current = undefined
          return
        }

        const sectionWidth = scrollContainerRef.current.offsetWidth
        const scrollLeft = scrollContainerRef.current.scrollLeft
        const newSection = Math.round(scrollLeft / sectionWidth)

        if (newSection !== currentSection && newSection >= 0 && newSection < TOTAL_SECTIONS) {
          setCurrentSection(newSection)
        }

        scrollThrottleRef.current = undefined
      })
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
      if (scrollThrottleRef.current) {
        cancelAnimationFrame(scrollThrottleRef.current)
      }
    }
  }, [currentSection])

  const navItems = ["Старт", "Профиль", "История", "Проекты", "Карьера", "Достижения"]

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <CustomCursor />
      <GrainOverlay />
      <SpaceBackground />

      <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-6 md:px-12">
        <button
          onClick={() => scrollToSection(0)}
          className="flex items-center gap-2 transition-transform hover:scale-105"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/15 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-foreground/25">
            <Icon name="Rocket" size={18} className="text-foreground" />
          </div>
          <span className="font-sans text-xl font-semibold tracking-tight text-foreground">Космос.Rus</span>
        </button>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item, index) => (
            <button
              key={item}
              onClick={() => scrollToSection(index)}
              className={`group relative font-sans text-sm font-medium transition-colors ${
                currentSection === index ? "text-foreground" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {item}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-foreground transition-all duration-300 ${
                  currentSection === index ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </button>
          ))}
        </div>

        <MagneticButton variant="secondary" onClick={() => scrollToSection(1)}>
          Войти
        </MagneticButton>
      </nav>

      <div
        ref={scrollContainerRef}
        data-scroll-container
        className="relative z-10 flex h-screen overflow-x-auto overflow-y-hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Секция 0: Таймер до старта */}
        <section className="flex min-h-screen w-screen shrink-0 flex-col justify-end px-6 pb-16 pt-24 md:px-12 md:pb-24">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 rounded-full border border-foreground/20 bg-foreground/10 px-4 py-1.5 backdrop-blur-md duration-700">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <p className="font-mono text-xs text-foreground/90">Новая программа · Сезон 2026</p>
            </div>
            <h1 className="mb-4 animate-in fade-in slide-in-from-bottom-8 font-sans text-5xl font-light leading-[1.1] tracking-tight text-foreground duration-1000 md:text-7xl lg:text-8xl">
              <span className="text-balance">
                До старта<br />
                <span className="text-foreground/40">осталось</span>
              </span>
            </h1>
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
              <CountdownTimer />
            </div>
            <p className="mb-8 max-w-xl animate-in fade-in slide-in-from-bottom-4 text-base leading-relaxed text-foreground/80 duration-1000 delay-200 md:text-lg">
              Образовательная платформа по космонавтике. Изучай историю, следи за современными миссиями и строй карьеру в космической индустрии.
            </p>
            <div className="flex animate-in fade-in slide-in-from-bottom-4 flex-col gap-4 duration-1000 delay-300 sm:flex-row sm:items-center">
              <MagneticButton
                size="lg"
                variant="primary"
                onClick={() => scrollToSection(1)}
              >
                Открыть платформу
              </MagneticButton>
              <MagneticButton size="lg" variant="secondary" onClick={() => scrollToSection(2)}>
                История побед
              </MagneticButton>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-in fade-in duration-1000 delay-500">
            <div className="flex items-center gap-2">
              <p className="font-mono text-xs text-foreground/60">Листайте вправо</p>
              <div className="flex h-6 w-12 items-center justify-center rounded-full border border-foreground/20 bg-foreground/10 backdrop-blur-md">
                <div className="h-2 w-2 animate-pulse rounded-full bg-foreground/60" />
              </div>
            </div>
          </div>
        </section>

        {/* Секция 1: Профиль */}
        <ProfileSection scrollToSection={scrollToSection} />

        {/* Секция 2: История побед */}
        <HistorySection />

        {/* Секция 3: Современные проекты */}
        <ProjectsSection />

        {/* Секция 4: Карьерный трек */}
        <CareerSection scrollToSection={scrollToSection} />

        {/* Секция 5: Достижения */}
        <AchievementsSection />
      </div>

      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  )
}

function ProfileSection({ scrollToSection: _scrollToSection }: { scrollToSection: (i: number) => void }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const metrics = [
    { label: "Выполнение заданий", value: "5/7 дней", icon: "CheckSquare" },
    { label: "Серия", value: "3 дня подряд", icon: "Flame" },
    { label: "Время сессии", value: "~9 мин", icon: "Clock" },
    { label: "Рейтинг в городе", value: "Топ 20%", icon: "Trophy" },
  ]

  const recs = [
    { label: "Следующая тема", value: "Луна-25: возвращение", icon: "BookOpen" },
    { label: "Проект", value: "«Луна-26» — подписаться", icon: "Satellite" },
    { label: "Тест", value: "Системы жизнеобеспечения", icon: "ClipboardList" },
  ]

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
          {/* Левая колонка */}
          <div className={`transition-all duration-700 ${visible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"}`}>
            {/* Аватар + имя */}
            <div className="mb-6 flex items-center gap-4">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground/10 border border-foreground/20 text-2xl backdrop-blur-sm">
                  🧑‍🚀
                </div>
                <div className="absolute -bottom-1 -right-1 rounded-full bg-blue-500 px-1.5 py-0.5">
                  <span className="font-mono text-[10px] text-white">Lv.4</span>
                </div>
              </div>
              <div>
                <h2 className="font-sans text-2xl font-light text-foreground">Алексей Петров</h2>
                <p className="font-mono text-xs text-foreground/60">Инженер → Конструктор</p>
              </div>
            </div>

            {/* Прогресс уровня */}
            <div className="mb-6">
              <div className="mb-1 flex justify-between font-mono text-xs text-foreground/50">
                <span>До «Конструктора»</span>
                <span>60%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-foreground/10">
                <div className="h-1.5 rounded-full bg-blue-500 transition-all duration-1000" style={{ width: visible ? "60%" : "0%" }} />
              </div>
            </div>

            {/* Сводка дня */}
            <div className="mb-6 grid grid-cols-3 gap-3">
              {[
                { label: "Очков сегодня", value: "+45", color: "text-green-400" },
                { label: "Задание", value: "✅ 3 дня", color: "text-foreground" },
                { label: "Материалов", value: "12 за неделю", color: "text-foreground" },
              ].map((s, i) => (
                <div key={i} className="rounded-xl border border-foreground/10 bg-foreground/5 p-3 backdrop-blur-sm">
                  <div className={`mb-1 font-sans text-lg font-light ${s.color}`}>{s.value}</div>
                  <div className="font-mono text-[10px] text-foreground/50">{s.label}</div>
                </div>
              ))}
            </div>

            {/* NPS */}
            <div className="rounded-xl border border-foreground/10 bg-foreground/5 p-4 backdrop-blur-sm">
              <p className="mb-3 font-mono text-xs text-foreground/60">Готовы рекомендовать платформу?</p>
              <div className="flex gap-1.5">
                {Array.from({ length: 11 }, (_, i) => (
                  <button
                    key={i}
                    className={`flex-1 rounded py-1.5 font-mono text-xs transition-all hover:bg-blue-500/40 border ${
                      i >= 9 ? "border-blue-500/40 text-blue-300" : "border-foreground/10 text-foreground/40"
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Правая колонка */}
          <div className={`transition-all duration-700 delay-200 ${visible ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"}`}>
            {/* Метрики */}
            <div className="mb-5">
              <p className="mb-3 font-mono text-xs text-foreground/50 uppercase tracking-widest">/ Метрики</p>
              <div className="space-y-2">
                {metrics.map((m, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-foreground/10 py-2">
                    <div className="flex items-center gap-2">
                      <Icon name={m.icon} fallback="Circle" size={14} className="text-foreground/40" />
                      <span className="font-sans text-sm text-foreground/70">{m.label}</span>
                    </div>
                    <span className="font-mono text-sm text-foreground">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Рекомендации */}
            <div>
              <p className="mb-3 font-mono text-xs text-foreground/50 uppercase tracking-widest">/ Рекомендуем</p>
              <div className="space-y-2">
                {recs.map((r, i) => (
                  <div key={i} className="group flex items-center justify-between rounded-lg border border-foreground/10 bg-foreground/5 p-3 backdrop-blur-sm transition-all hover:border-blue-500/40 hover:bg-blue-500/5">
                    <div className="flex items-center gap-2">
                      <Icon name={r.icon} fallback="Circle" size={14} className="text-blue-400" />
                      <div>
                        <div className="font-mono text-[10px] text-foreground/40">{r.label}</div>
                        <div className="font-sans text-sm text-foreground">{r.value}</div>
                      </div>
                    </div>
                    <Icon name="ChevronRight" size={14} className="text-foreground/30 group-hover:text-foreground/60" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}