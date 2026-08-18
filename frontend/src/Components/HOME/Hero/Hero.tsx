"use client"

import { useEffect, useState } from "react"

/**
 * Advanced editorial hero for a girls' undergarments / lingerie brand.
 * Styled entirely with Tailwind CSS utility classes.
 */

const PRODUCTS = [
  {
    name: "Rose",
    hex: "#C24C6B",
    images: {
      // Unsplash Premium Editorial/Fashion Images - Rose Theme
      main: "https://images.unsplash.com/photo-1580155661951-a69f7baf6ed5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      second: "https://plus.unsplash.com/premium_photo-1670176619731-20facada0553?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      detail: "https://plus.unsplash.com/premium_photo-1674069719776-f18bb1b966eb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  },
  {
    name: "Blush",
    hex: "#EBC3CE",
    images: {
      // Unsplash Premium Editorial/Fashion Images - Blush Theme
      main: "https://images.unsplash.com/photo-1614181861684-f91fed70c192?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      second: "https://plus.unsplash.com/premium_photo-1665990293790-020343afa191?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      detail: "https://images.unsplash.com/photo-1585987162616-00bb5036f80f?q=80&w=712&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  },
  {
    name: "Plum",
    hex: "#5B2A3B",
    images: {
      // Unsplash Premium Editorial/Fashion Images - Plum Theme
      main: "https://images.unsplash.com/photo-1644083598795-dcebeebacb8e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      second: "https://images.unsplash.com/photo-1591927076671-71214f64e1a4?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      detail: "https://images.unsplash.com/photo-1635437411069-80d30af5fd29?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  },
]

const MARQUEE = [
  "Free shipping over $50",
  "Buttery-soft modal",
  "Sizes XS–4XL",
  "30-day easy returns",
  "Wireless comfort",
]

export default function Hero() {
  const [color, setColor] = useState(0)
  const [paused, setPaused] = useState(false)
  const active = PRODUCTS[color]

  // প্রতি ২ সেকেন্ড পর পর নিজে থেকে পরের color-এ যাবে (hover করলে থামবে)
  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setColor((prev) => (prev + 1) % PRODUCTS.length)
    }, 2500) // একটু বাড়িয়ে ২.৫ সেকেন্ড করা হয়েছে স্মুথনেসের জন্য
    return () => clearInterval(id)
  }, [paused])

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative w-full overflow-hidden bg-[#FBF4F1]  text-[#2A1E21]"
    >
      {/* soft glow with larger spread */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[-18%] z-0 h-[80%] w-[60%] rounded-full bg-[radial-gradient(circle,rgba(194,76,107,0.15),transparent_65%)] blur-[100px]"
      />

      {/* Wider Container: max-w-[1536px] */}
      <div className="relative z-10 mx-auto grid max-w-[1536px] grid-cols-1 items-center gap-12 px-6 pb-12 pt-12 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:pb-20 lg:pt-[80px] xl:px-20">
        
        {/* ── LEFT: editorial type + controls ── */}
        <div className="flex flex-col justify-center">
          <p className="mb-6 flex items-center gap-4 text-[12px] font-bold uppercase tracking-[0.35em] text-[#A03A57]">
            <span className="inline-block h-px w-10 bg-[#C24C6B]" />
            New Collection — SS26
          </p>

          <h1 className="f text-[clamp(3.2rem,8vw,6.5rem)] font-medium leading-[0.9] tracking-[-0.02em] text-balance">
            Soft
            <br />
            <span className=" text-[#C24C6B]">Confidence</span>
            <br />
            Redefined
          </h1>

          <p className="mt-8 max-w-[36rem] text-[1.05rem] leading-relaxed text-[#6B565B] text-pretty">
            Delicately crafted intimates designed for every body — breathable fabrics, flawless fits, and quiet
            elegance made just for her.
          </p>

          {/* color swatches */}
          <div className="mt-10">
            <span className="mb-4 block text-[11px] font-bold uppercase tracking-[0.25em] text-[#8A757A]">
              Color — <b className="text-[#2A1E21]">{active.name}</b>
            </span>
            <div className="flex gap-4">
              {PRODUCTS.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(i)}
                  aria-label={c.name}
                  aria-pressed={color === i}
                  style={{ background: c.hex }}
                  className={
                    "h-[34px] w-[34px] rounded-full shadow-[0_0_0_1px_rgba(42,30,33,0.12)] transition-all duration-300 hover:scale-110 " +
                    (color === i ? "ring-[3px] ring-[#2A1E21] ring-offset-[3px] ring-offset-[#FBF4F1] scale-110" : "")
                  }
                />
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <button
              type="button"
              className="group inline-flex items-center gap-3 rounded-full bg-[#C24C6B] px-9 py-4 text-[15px] font-bold tracking-wide text-white shadow-[0_16px_40px_-12px_rgba(194,76,107,0.7)] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_20px_45px_-10px_rgba(194,76,107,0.8)] hover:bg-[#B3405E]"
            >
              Shop the Collection
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">
                &rarr;
              </span>
            </button>
            
          </div>

          {/* trust row */}
          <div className="mt-10 flex items-center gap-4 border-t border-[#2A1E21]/5 pt-6 w-max">
            <div className="flex gap-1" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#C24C6B">
                  <path d="M12 2l2.9 6.26L21.5 9l-5 4.6 1.4 7L12 17.3 6.1 20.6l1.4-7-5-4.6 6.6-.74L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-[14px] text-[#6B565B]">
              <b className="text-[#2A1E21]">4.9</b> · 50k+ happy customers
            </span>
          </div>
        </div>

        {/* ── RIGHT: layered art-directed composition ── */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative mx-auto lg:mx-0 aspect-[1/1.06] w-full max-w-[420px] sm:max-w-[550px] lg:max-w-[620px]">
            {/* dashed decorative ring */}
            <div
              aria-hidden
              className="absolute inset-x-[8%_2%] bottom-[10%] top-[4%] left-[2%] right-[8%] z-0 rounded-full border border-dashed border-[#A03A57]/40"
            />

            {/* vertical rotated label */}
            <span className="absolute right-[-24px] top-[40%] z-[5] hidden origin-right rotate-90 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.35em] text-[#A03A57] sm:block">
              LUMIÈRE — INTIMATES
            </span>

            {/* main portrait */}
            <figure className="absolute left-[6%] top-0 z-20 m-0 aspect-[3/4] w-[68%] overflow-hidden rounded-t-[180px] rounded-b-[24px] bg-[#EBD7DC] shadow-[0_40px_90px_-30px_rgba(42,30,33,0.5)]">
              <img
                key={active.images.main}
                src={active.images.main}
                alt={`${active.name} lingerie set — main view`}
                className="h-full w-full animate-[lumfade_0.6s_ease] object-cover"
              />
              <figcaption className="absolute bottom-4 left-4 rounded-full bg-[#FBF4F1]/95 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#A03A57] backdrop-blur shadow-sm">
                Fig. 01 — {active.name} Series
              </figcaption>
            </figure>

            {/* overlapping secondary frame */}
            <figure className="absolute bottom-[6%] right-0 z-30 m-0 aspect-[4/5] w-[46%] overflow-hidden rounded-[24px_24px_24px_100px] border-[6px] border-[#FBF4F1] bg-[#EBD7DC] shadow-[0_30px_70px_-25px_rgba(42,30,33,0.45)]">
              <img
                key={active.images.second}
                src={active.images.second}
                alt={`${active.name} lingerie set — editorial view`}
                className="h-full w-full animate-[lumfade_0.6s_ease] object-cover"
              />
            </figure>

            {/* circular fabric detail */}
            <figure className="absolute right-[4%] top-[8%] z-40 m-0 aspect-square w-[26%] overflow-hidden rounded-full border-[6px] border-[#FBF4F1] shadow-[0_20px_40px_-16px_rgba(42,30,33,0.55)]">
              <img
                key={active.images.detail}
                src={active.images.detail}
                alt={`${active.name} fabric close-up`}
                className="h-full w-full animate-[lumfade_0.6s_ease] object-cover"
              />
            </figure>

            {/* floating discount chip */}
            {/* <div className="absolute left-[-6%] top-[26%] z-50 flex h-[80px] w-[80px] flex-col items-center justify-center rounded-full bg-[#C24C6B] text-white shadow-[0_20px_45px_-14px_rgba(194,76,107,0.75)] max-[520px]:h-[68px] max-[520px]:w-[68px]">
              <span className="font-serif text-[24px] font-semibold leading-none max-[520px]:text-[20px]">30%</span>
              <span className="text-[10px] font-bold tracking-[0.2em] mt-1">OFF</span>
            </div> */}

            {/* floating price / add pill */}
            {/* <div className="absolute bottom-[2%] left-[2%] z-50 flex items-center gap-4 rounded-full bg-[#FBF4F1] py-3 pl-[20px] pr-3 text-[15px] shadow-[0_20px_45px_-18px_rgba(42,30,33,0.5)] border border-[#EBD7DC]">
              <span>
                <s className="mr-1 text-[#AA8888]">$68</s> <b className="text-[#A03A57] text-[17px]">$47</b>
              </span>
              <button
                type="button"
                aria-label="Add to bag"
                className="grid h-[38px] w-[38px] place-items-center rounded-full bg-[#2A1E21] text-2xl font-light leading-none text-white transition-transform duration-300 hover:rotate-90 hover:bg-[#C24C6B]"
              >
                +
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* ── marquee ── */}
      <div className="relative z-10 overflow-hidden border-y border-[#2A1E21]/[0.08] bg-[#F7E6EB] py-5">
        <div className="flex animate-[lummarquee_35s_linear_infinite] whitespace-nowrap motion-reduce:animate-none">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div className="flex flex-shrink-0 items-center" key={dup} aria-hidden={dup === 1}>
              {MARQUEE.map((item) => (
                <span
                  key={item}
                  className="mx-8 inline-flex items-center gap-8 text-[14px] font-bold uppercase tracking-[0.18em] text-[#A03A57]"
                >
                  {item}
                  <span className="text-[16px] text-[#C24C6B]">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes lumfade { 
          from { opacity: 0; transform: scale(1.05); } 
          to { opacity: 1; transform: scale(1); } 
        }
        @keyframes lummarquee { 
          from { transform: translateX(0); } 
          to { transform: translateX(-50%); } 
        }
      `}</style>
    </section>
  )
}