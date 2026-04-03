import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MagneticButton } from "@/components/magnetic-button"
import { useReveal } from "@/hooks/use-reveal"
import Icon from "@/components/ui/icon"

const professions = [
  { name: "Космонавт-испытатель", icon: "Rocket", desc: "Летают на МКС, проводят эксперименты", studied: true },
  { name: "Инженер-конструктор", icon: "Settings", desc: "Разрабатывают корабли и станции", studied: false },
  { name: "Астрофизик", icon: "Star", desc: "Исследуют звёзды, чёрные дыры, экзопланеты", studied: false },
  { name: "Специалист по ЖО", icon: "Shield", desc: "Системы жизнеобеспечения в космосе", studied: false },
  { name: "Оператор миссий", icon: "Radio", desc: "Управление полётами из ЦУП", studied: false },
  { name: "Медик-исследователь", icon: "Heart", desc: "Медицина в условиях невесомости", studied: false },
]

const universities = [
  { name: "МГУ", dept: "Физический факультет", icon: "GraduationCap" },
  { name: "Бауманка", dept: "Ракетно-космические системы", icon: "Cpu" },
  { name: "МФТИ", dept: "Аэрофизика и космос", icon: "Atom" },
  { name: "МАИ", dept: "Аэрокосмический", icon: "Plane" },
]

const internships = [
  { name: "Роскосмос", type: "Стажировка", deadline: "1 июн 2025", icon: "Building2" },
  { name: "Сириус", type: "Конкурс", deadline: "15 апр 2025", icon: "Award" },
  { name: "ЦНИИмаш", type: "Стажировка", deadline: "30 мая 2025", icon: "Microscope" },
]

export function CareerSection({ scrollToSection }: { scrollToSection?: (index: number) => void }) {
  const { ref, isVisible } = useReveal(0.2)
  const navigate = useNavigate()
  const [studiedProfs, setStudiedProfs] = useState<number[]>([0])
  const [testDone] = useState(true)
  const [internshipDone] = useState(false)
  const [quizOpen] = useState(false)

  const checklist = [
    { label: "Профтест пройден", done: testDone },
    { label: `Профессий изучено (${studiedProfs.length}/3)`, done: studiedProfs.length >= 3 },
    { label: "Стажировка выбрана (0/1)", done: internshipDone },
  ]
  const checklistPct = Math.round((checklist.filter((c) => c.done).length / checklist.length) * 100)

  const toggleProf = (i: number) => {
    setStudiedProfs((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i])
  }

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-start px-6 pt-20 pb-6 md:px-12 lg:px-16 overflow-y-auto"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className={`mb-5 transition-all duration-700 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"}`}>
          <h2 className="mb-1 font-sans text-4xl font-light tracking-tight text-foreground md:text-6xl">
            Карьерный трек
          </h2>
          <p className="font-mono text-sm text-foreground/60">/ Профессии, вузы, стажировки</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Персональный трекер */}
          <div className={`rounded-xl border border-foreground/10 bg-foreground/5 p-4 backdrop-blur-sm transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="mb-3 flex items-center gap-2">
              <Icon name="Map" size={14} className="text-blue-400" />
              <span className="font-mono text-xs text-foreground/60">Персональный маршрут</span>
            </div>
            <div className="mb-3 space-y-2">
              {checklist.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`flex h-4 w-4 items-center justify-center rounded-full ${c.done ? "bg-blue-500" : "border border-foreground/20"}`}>
                    {c.done && <Icon name="Check" size={10} className="text-white" />}
                  </div>
                  <span className={`font-sans text-xs ${c.done ? "text-foreground" : "text-foreground/50"}`}>{c.label}</span>
                </div>
              ))}
            </div>
            <div className="mb-1 flex justify-between font-mono text-xs text-foreground/40">
              <span>Полный маршрут</span>
              <span>{checklistPct}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-foreground/10">
              <div className="h-1.5 rounded-full bg-blue-500 transition-all duration-700" style={{ width: `${checklistPct}%` }} />
            </div>
          </div>

          {/* Профессии */}
          <div className={`rounded-xl border border-foreground/10 bg-foreground/5 p-4 backdrop-blur-sm transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="mb-3 flex items-center gap-2">
              <Icon name="Briefcase" size={14} className="text-blue-400" />
              <span className="font-mono text-xs text-foreground/60">Космические профессии</span>
            </div>
            <div className="space-y-2">
              {professions.map((p, i) => (
                <div
                  key={i}
                  className={`group flex items-center gap-2 rounded-lg border p-2 cursor-pointer transition-all ${
                    studiedProfs.includes(i)
                      ? "border-blue-500/30 bg-blue-500/5"
                      : "border-foreground/10 hover:border-foreground/20"
                  }`}
                  onClick={() => toggleProf(i)}
                >
                  <Icon name={p.icon as "Rocket"} fallback="Circle" size={12} className={studiedProfs.includes(i) ? "text-blue-400" : "text-foreground/30"} />
                  <div className="flex-1 min-w-0">
                    <div className="font-sans text-xs font-medium text-foreground truncate">{p.name}</div>
                    <div className="font-mono text-[10px] text-foreground/40 truncate">{p.desc}</div>
                  </div>
                  {studiedProfs.includes(i) && <Icon name="CheckCircle" size={12} className="text-blue-400 shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* Вузы + стажировки + созвездие */}
          <div className="space-y-3">
            {/* Вузы */}
            <div className={`rounded-xl border border-foreground/10 bg-foreground/5 p-4 backdrop-blur-sm transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="mb-3 flex items-center gap-2">
                <Icon name="GraduationCap" size={14} className="text-blue-400" />
                <span className="font-mono text-xs text-foreground/60">Где учиться</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {universities.map((u, i) => (
                  <div key={i} className="rounded-lg border border-foreground/10 bg-foreground/5 p-2 hover:border-foreground/20 transition-all">
                    <div className="font-sans text-xs font-medium text-foreground">{u.name}</div>
                    <div className="font-mono text-[9px] text-foreground/40">{u.dept}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Стажировки */}
            <div className={`rounded-xl border border-foreground/10 bg-foreground/5 p-4 backdrop-blur-sm transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="mb-3 flex items-center gap-2">
                <Icon name="Sparkles" size={14} className="text-blue-400" />
                <span className="font-mono text-xs text-foreground/60">Стажировки и конкурсы</span>
              </div>
              <div className="space-y-1.5">
                {internships.map((s, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-foreground/10 p-2 hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-2">
                      <Icon name={s.icon as "Award"} fallback="Circle" size={12} className="text-foreground/40" />
                      <div>
                        <div className="font-sans text-xs text-foreground">{s.name}</div>
                        <div className="font-mono text-[9px] text-foreground/40">{s.type} · до {s.deadline}</div>
                      </div>
                    </div>
                    <button className="rounded-lg border border-blue-500/30 px-2 py-0.5 font-mono text-[9px] text-blue-400 hover:bg-blue-500/10 transition-all">
                      Подать
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Созвездие наставничества */}
            <div className={`rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 backdrop-blur-sm transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="Users" size={12} className="text-blue-400" />
                  <span className="font-mono text-xs text-blue-300">Созвездие наставников</span>
                </div>
                <span className="font-mono text-[10px] text-foreground/40">156 активных пар</span>
              </div>
              <div className="mt-2 flex gap-2">
                <button className="flex-1 rounded-lg border border-blue-500/30 py-1.5 font-mono text-[10px] text-blue-400 hover:bg-blue-500/10 transition-all">Найти наставника</button>
                <button className="flex-1 rounded-lg border border-foreground/20 py-1.5 font-mono text-[10px] text-foreground/60 hover:border-foreground/40 transition-all">Стать наставником</button>
              </div>
            </div>
          </div>
        </div>

        {/* Профтест */}
        <div className={`mt-4 flex flex-wrap items-center gap-3 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <MagneticButton size="lg" variant="primary" onClick={() => navigate("/space-quiz")}>
            Кто ты в космосе? — пройти тест
          </MagneticButton>
          <MagneticButton size="lg" variant="secondary" onClick={() => {}}>
            Поделиться планом
          </MagneticButton>
        </div>

        {quizOpen && null}
      </div>
    </section>
  )
}