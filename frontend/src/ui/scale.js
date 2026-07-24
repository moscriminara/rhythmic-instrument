export function updateScale() {
  const isMobile = window.innerWidth <= 1024

  const designWidth = isMobile ? 480 : 1200
  const designHeight = isMobile ? 1000 : 600

  const padding = Number(
    getComputedStyle(document.documentElement).getPropertyValue("--padding")
  )

  const scale = Math.min(
    (window.innerWidth - padding * 3) / designWidth,
    (window.innerHeight - padding) / designHeight
  )

  document.documentElement.style.setProperty(
    "--scale",
    scale
  )
}