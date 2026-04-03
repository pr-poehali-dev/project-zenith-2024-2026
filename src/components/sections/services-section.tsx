import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useReveal } from "@/hooks/use-reveal"
import Icon from "@/components/ui/icon"

const projects = [
  {
    id: 1,
    name: "Луна-26",
    status: "active",
    statusLabel: "Подготовка",
    nextEvent: "15 июн 2025",
    desc: "Российская лунная миссия для изучения южного полюса и поиска водяного льда.",
    subscribers: 1240,
    watchDays: 12,
  },
  {
    id: 2,
    name: "Венера-Д",
    status: "upcoming",
    statusLabel: "Запланировано",
    nextEvent: "2029",
    desc: "Совместная российско-американская миссия к Венере для изучения её атмосферы.",
    subscribers: 847,
    watchDays: 0,
  },
  {
    id: 3,
    name: "МКС · Экспедиция 72",
    status: "active",
    statusLabel: "В полёте",
    nextEvent: "Выход ВКД 28 апр",
    desc: "Международный экипаж проводит научные эксперименты на орбитальной станции.",
    subscribers: 3120,
    watchDays: 34,
  },
  {
    id: 4,
    name: "Арктика-М №3",
    status: "upcoming",
    statusLabel: "Запланировано",
    nextEvent: "2026",
    desc: "Метеорологический спутник для наблюдения за Арктикой и климатом России.",
    subscribers: 312,
    watchDays: 0,
  },
  {
    id: 5,
    name: "СФЕРА — Марафон",
    status: "active",
    statusLabel: "Развёртывание",
    nextEvent: "Старт июль 2025",
    desc: "Российская орбитальная группировка широкополосного интернет-доступа.",
    subscribers: 2280,
    watchDays: 8,
  },
]

export function ProjectsSection() {
  const { ref, isVisible } = useReveal(0.2)
  const navigate = useNavigate()
  const [tab, setTab] = useState<"all" | "mine">("all")
  const [subscribed, setSubscribed] = useState<number[]>([1, 3])
  const [detail, setDetail] = useState<number | null>(null)

  const displayed = tab === "mine" ? projects.filter((p) => subscribed.includes(p.id)) : projects

  const toggleSub = (id: number) => {
    setSubscribed((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  const openRate = Math.round((subscribed.filter((id) => {
    const p = projects.find((x) => x.id === id)
    return p && p.watchDays > 0
  }).length / Math.max(subscribed.length, 1)) * 100)

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-start px-6 pt-20 pb-6 md:px-12 lg:px-16 overflow-y-auto"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className={`mb-5 transition-all duration-700 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"}`}>
          <h2 className="mb-1 font-sans text-4xl font-light tracking-tight text-foreground md:text-6xl">
            Современные проекты
          </h2>
          <p className="font-mono text-sm text-foreground/60">/ Текущие миссии и подписки</p>
        </div>

        {/* Метрики */}
        <div className={`mb-5 grid grid-cols-3 gap-3 transition-all duration-700 delay-100 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <div className="rounded-xl border border-foreground/10 bg-foreground/5 p-3 backdrop-blur-sm">
            <div className="font-sans text-xl font-light text-blue-400">{subscribed.length} подписки</div>
            <div className="font-mono text-[10px] text-foreground/50">Активных</div>
          </div>
          <div className="rounded-xl border border-foreground/10 bg-foreground/5 p-3 backdrop-blur-sm">
            <div className="font-sans text-xl font-light text-foreground">{openRate}%</div>
            <div className="font-mono text-[10px] text-foreground/50">Активность</div>
          </div>
          <div className="rounded-xl border border-foreground/10 bg-foreground/5 p-3 backdrop-blur-sm">
            <div className="flex items-center gap-1 font-sans text-sm font-light text-foreground">
              <Icon name="Bell" size={12} className="text-blue-400" />
              2/3 проектов
            </div>
            <div className="font-mono text-[10px] text-foreground/50">Возвращались 7+ дней</div>
          </div>
        </div>

        {/* Вкладки */}
        <div className="mb-4 flex gap-1 rounded-xl border border-foreground/10 bg-foreground/5 p-1 backdrop-blur-sm w-fit">
          {(["all", "mine"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-1.5 font-mono text-xs transition-all ${
                tab === t
                  ? "bg-blue-500/30 text-blue-300"
                  : "text-foreground/50 hover:text-foreground/80"
              }`}
            >
              {t === "all" ? "Все проекты" : "Мои подписки"}
            </button>
          ))}
        </div>

        {/* Карточки */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {displayed.map((p, i) => (
            <div
              key={p.id}
              className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${200 + i * 80}ms` }}
            >
              <div
                className={`group rounded-xl border bg-foreground/5 p-4 backdrop-blur-sm transition-all cursor-pointer ${
                  subscribed.includes(p.id)
                    ? "border-blue-500/30 hover:border-blue-500/50"
                    : "border-foreground/10 hover:border-foreground/20"
                }`}
                onClick={() => setDetail(detail === p.id ? null : p.id)}
              >
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`h-2 w-2 rounded-full ${p.status === "active" ? "bg-green-400" : "bg-yellow-400"}`} />
                      <span className="font-mono text-[10px] text-foreground/40">{p.statusLabel}</span>
                    </div>
                    <h3 className="font-sans text-sm font-medium text-foreground">{p.name}</h3>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSub(p.id) }}
                    className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-all ${
                      subscribed.includes(p.id)
                        ? "border-blue-500 bg-blue-500/20 text-blue-400"
                        : "border-foreground/20 text-foreground/30 hover:border-foreground/40"
                    }`}
                  >
                    <Icon name="Bell" size={12} />
                  </button>
                </div>

                <div className="mb-2 flex items-center gap-1 font-mono text-[10px] text-foreground/40">
                  <Icon name="Calendar" size={10} />
                  <span>Следующее: {p.nextEvent}</span>
                </div>

                {detail === p.id && (
                  <p className="mb-2 font-sans text-xs leading-relaxed text-foreground/70">{p.desc}</p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 font-mono text-[10px] text-foreground/30">
                    <Icon name="Users" size={10} />
                    <span>{p.subscribers.toLocaleString("ru")} подписчиков</span>
                  </div>
                  {p.id === 5 ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate("/sfera") }}
                      className="flex items-center gap-1 font-mono text-[10px] text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Icon name="ExternalLink" size={10} />
                      Подробнее
                    </button>
                  ) : subscribed.includes(p.id) && p.watchDays > 0 ? (
                    <span className="font-mono text-[10px] text-blue-400">Следите {p.watchDays} дней</span>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}