import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, Box, Coins, Dices, Ellipsis, Package, Rocket, Ticket, TrendingUp, X } from "lucide-react"
import meowl from "@/assets/meowl-guide.webp"
import { haptic } from "@/lib/telegram"
import { cn } from "@/lib/utils"

/** Tabs the tour can jump to. Kept loose so the shell owns the real tab list. */
export type TourTarget = "cases" | "battlepass" | "upgrade" | "dice" | "crash" | "profile"

type Step = {
  icon: typeof Box
  accent: string
  title: string
  text: string
  tips: string[]
  target?: TourTarget
  cta?: string
}

const STEPS: Step[] = [
  {
    icon: Ellipsis,
    accent: "#b6ff3b",
    title: "Мяу! Я Meowl",
    text: "Я покажу, как тут всё устроено. Это займёт меньше минуты — листай дальше.",
    tips: ["Зелёная кнопка слева сверху открывает меню со всеми разделами", "Обучение можно открыть снова в меню"],
  },
  {
    icon: Coins,
    accent: "#ffc83d",
    title: "Монеты",
    text: "Баланс всегда виден вверху справа. На монеты открываются кейсы и делаются ставки.",
    tips: ["Нажми «+» рядом с балансом, чтобы пополнить через админа", "Монеты — валюта сайта, это не реальные деньги"],
    target: "profile",
    cta: "Открыть профиль",
  },
  {
    icon: Box,
    accent: "#ff4fd8",
    title: "Кейсы",
    text: "Выбери кейс, загляни, что внутри и с каким шансом, и крути. Цветная полоска на карточке — сколько в кейсе редких брейнротов.",
    tips: ["Начни с бесплатного кейса — он открывается по таймеру", "Чем дороже кейс, тем круче брейнроты внутри"],
    target: "cases",
    cta: "К кейсам",
  },
  {
    icon: Package,
    accent: "#38bdf8",
    title: "Инвентарь",
    text: "Всё, что выбил, лежит в профиле. Брейнрота можно продать за монеты или вывести в Roblox.",
    tips: ["Продавай дубли, чтобы открыть кейс подороже", "Вывод в Roblox идёт через админа"],
    target: "profile",
    cta: "Мой инвентарь",
  },
  {
    icon: TrendingUp,
    accent: "#a855f7",
    title: "Апгрейдер",
    text: "Поставь брейнрота и попробуй превратить его в более дорогого. Чем больше прирост, тем меньше шанс.",
    tips: ["Новичкам лучше брать шанс 50% и выше"],
    target: "upgrade",
    cta: "Попробовать",
  },
  {
    icon: Rocket,
    accent: "#f97316",
    title: "Crash и Dice",
    text: "В Crash забирай выигрыш, пока ракета не взорвалась. В Dice выбирай шанс и бросай кубик.",
    tips: ["Начинай с маленьких ставок", "Не гонись за проигрышем — это просто игра"],
    target: "dice",
    cta: "Бросить кубик",
  },
  {
    icon: Ticket,
    accent: "#2dd4bf",
    title: "Батл пасс",
    text: "Выполняй квесты, получай опыт и забирай награды за каждый уровень. Бесплатная линия доступна всем.",
    tips: ["Заглядывай каждый день — квесты обновляются"],
    target: "battlepass",
    cta: "Открыть батл пасс",
  },
]

export function Onboarding({ onClose, onGo }: { onClose: () => void; onGo: (t: TourTarget) => void }) {
  const [i, setI] = useState(0)
  const touch = useRef<number | null>(null)
  const step = STEPS[i]
  const last = i === STEPS.length - 1
  const Icon = step.icon

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") setI((v) => Math.min(STEPS.length - 1, v + 1))
      if (e.key === "ArrowLeft") setI((v) => Math.max(0, v - 1))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const move = (d: number) => {
    haptic()
    setI((v) => Math.min(STEPS.length - 1, Math.max(0, v + d)))
  }

  return (
    <div className="bd-tour-backdrop" onClick={onClose}>
      <div
        className="bd-tour"
        role="dialog"
        aria-label="Обучение"
        style={{ ["--tour" as string]: step.accent }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current === null) return
          const dx = e.changedTouches[0].clientX - touch.current
          touch.current = null
          if (Math.abs(dx) > 50) move(dx < 0 ? 1 : -1)
        }}
      >
        <button type="button" onClick={onClose} className="bd-tour-close" aria-label="Закрыть обучение">
          <X className="size-4" />
        </button>

        <div className="bd-tour-stage">
          <span className="bd-tour-glow" />
          <img src={meowl} alt="Meowl" className={cn("bd-tour-mascot", i % 2 === 1 && "bd-tour-mascot-flip")} key={`m${i}`} />
          <span className="bd-tour-icon" key={`i${i}`}>
            <Icon className="size-6" strokeWidth={2.5} />
          </span>
        </div>

        <div className="bd-tour-body" key={i}>
          <div className="bd-tour-step">
            Шаг {i + 1} из {STEPS.length}
          </div>
          <h2 className="mt-1 font-heading text-[22px] font-extrabold leading-tight">{step.title}</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-white/75">{step.text}</p>
          <ul className="mt-3 space-y-1.5">
            {step.tips.map((t) => (
              <li key={t} className="bd-tour-tip">
                {t}
              </li>
            ))}
          </ul>
          {step.target && step.cta && (
            <button
              type="button"
              className="bd-tour-link"
              onClick={() => {
                haptic()
                onGo(step.target!)
              }}
            >
              {step.cta} <ArrowRight className="size-3.5" />
            </button>
          )}
        </div>

        <div className="bd-tour-dots" aria-hidden>
          {STEPS.map((s, n) => (
            <button
              key={s.title}
              type="button"
              tabIndex={-1}
              data-active={n === i}
              data-done={n < i}
              onClick={() => setI(n)}
            />
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          {i > 0 ? (
            <button type="button" onClick={() => move(-1)} className="bd-btn-ghost grid size-12 shrink-0 place-items-center" aria-label="Назад">
              <ArrowLeft className="size-5" />
            </button>
          ) : (
            <button type="button" onClick={onClose} className="bd-btn-ghost h-12 shrink-0 px-4 text-xs font-bold text-white/60">
              Пропустить
            </button>
          )}
          <button
            type="button"
            onClick={() => (last ? onClose() : move(1))}
            className="bd-btn flex h-12 flex-1 items-center justify-center gap-2 text-sm"
          >
            {last ? (
              <>
                Погнали! <Dices className="size-4" />
              </>
            ) : (
              <>
                Дальше <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
