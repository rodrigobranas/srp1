interface DrawAtmosphereFieldInput {
  context: CanvasRenderingContext2D
  isScanning: boolean
  theme: 'dark' | 'light'
  time: number
}

export function drawAtmosphereField(input: DrawAtmosphereFieldInput) {
  const { context, isScanning, theme, time } = input
  const { height, width } = context.canvas
  context.clearRect(0, 0, width, height)
  drawBloom(context, width, height, theme)
  drawContours(context, width, height, theme)
  if (isScanning) drawScan(context, width, height, time)
}

function drawBloom(context: CanvasRenderingContext2D, width: number, height: number, theme: 'dark' | 'light') {
  const bloom = context.createRadialGradient(width * 0.77, height * 0.33, 0, width * 0.77, height * 0.33, width * 0.5)
  bloom.addColorStop(0, theme === 'dark' ? 'rgba(74, 222, 255, 0.14)' : 'rgba(14, 116, 144, 0.15)')
  bloom.addColorStop(1, 'rgba(0, 0, 0, 0)')
  context.fillStyle = bloom
  context.fillRect(0, 0, width, height)
}

function drawContours(context: CanvasRenderingContext2D, width: number, height: number, theme: 'dark' | 'light') {
  const tint = theme === 'dark' ? '129, 230, 217' : '14, 116, 144'
  const radius = Math.max(width, height)
  for (let index = 1; index < 6; index += 1) {
    context.beginPath()
    context.ellipse(width * 0.77, height * 0.34, radius * (0.11 + index * 0.085), radius * (0.045 + index * 0.034), -0.38, 0, Math.PI * 2)
    context.strokeStyle = `rgba(${tint}, ${0.1 - index * 0.012})`
    context.lineWidth = Math.max(1, width / 1800)
    context.stroke()
  }
}

function drawScan(context: CanvasRenderingContext2D, width: number, height: number, time: number) {
  const x = width * 0.77
  const y = height * 0.34
  context.save()
  context.translate(x, y)
  context.rotate(time / 900)
  context.beginPath()
  context.moveTo(0, 0)
  context.arc(0, 0, Math.max(width, height) * 0.44, -0.16, 0.16)
  context.closePath()
  context.fillStyle = 'rgba(167, 139, 250, 0.14)'
  context.fill()
  context.restore()
}
