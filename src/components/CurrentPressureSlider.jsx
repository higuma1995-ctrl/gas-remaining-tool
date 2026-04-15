import { useRef } from 'react'

import UnitToggle from './UnitToggle'

function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max)
}

function roundToStep(number, step) {
  return Math.round(number / step) * step
}

function formatTickValue(value, unit) {
  if (unit === 'MPa') {
    return Number(value).toFixed(1)
  }
  return Number(value).toFixed(0)
}

function getTickValues(max, unit) {
  const baseTicks = unit === 'MPa' ? [0, 5, 10, 15] : [0, 50, 100, 150]
  const visibleTicks = baseTicks.filter((tick) => tick >= 0 && tick < max)

  return [...visibleTicks, max]
}

function CurrentPressureSlider({ unit, value, max, step, onChange, onUnitChange }) {
  const activePointerIdRef = useRef(null)
  const numericValue = Number(value)
  const ratio = max > 0 ? clamp(numericValue / max, 0, 1) : 0
  const angle = 180 - ratio * 180
  const radians = (angle * Math.PI) / 180
  const centerX = 120
  const centerY = 118
  const needleLength = 78
  const needleX = centerX + needleLength * Math.cos(radians)
  const needleY = centerY - needleLength * Math.sin(radians)
  const display = unit === 'MPa' ? numericValue.toFixed(1) : numericValue.toFixed(0)
  const tickValues = getTickValues(max, unit)

  const emitValue = (nextValue) => {
    const clampedValue = clamp(nextValue, 0, max)
    const normalized =
      unit === 'MPa' ? clampedValue.toFixed(1) : String(Math.round(clampedValue))

    onChange(normalized)
  }

  const updateFromPointer = (event) => {
    event.preventDefault()
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 240
    const y = ((event.clientY - bounds.top) / bounds.height) * 140
    const pointerAngle = Math.atan2(centerY - y, x - centerX)
    const degrees = clamp((pointerAngle * 180) / Math.PI, 0, 180)
    const nextRatio = (180 - degrees) / 180
    const nextValue = roundToStep(nextRatio * max, step)

    emitValue(nextValue)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault()
      emitValue(roundToStep(numericValue + step, step))
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault()
      emitValue(roundToStep(numericValue - step, step))
    }
  }

  return (
    <section className="card">
      <h2>現在圧力</h2>
      <div className="gauge-row">
        <svg
          className="pressure-gauge"
          viewBox="0 0 240 140"
          role="slider"
          tabIndex="0"
          aria-label="現在圧力"
          aria-valuemin="0"
          aria-valuemax={max}
          aria-valuenow={numericValue}
          aria-valuetext={`${display}${unit}`}
          onKeyDown={handleKeyDown}
          onPointerDown={(event) => {
            activePointerIdRef.current = event.pointerId
            event.currentTarget.setPointerCapture(event.pointerId)
            updateFromPointer(event)
          }}
          onPointerMove={(event) => {
            if (activePointerIdRef.current === event.pointerId) {
              updateFromPointer(event)
            }
          }}
          onPointerUp={(event) => {
            activePointerIdRef.current = null
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId)
            }
          }}
          onPointerCancel={(event) => {
            activePointerIdRef.current = null
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId)
            }
          }}
        >
          <path className="gauge-arc" d="M 24 118 A 96 96 0 0 1 216 118" />
          <path className="gauge-arc-fill" d="M 24 118 A 96 96 0 0 1 216 118" />
          {tickValues.map((tickValue) => {
            const tick = max > 0 ? tickValue / max : 0
            const tickAngle = 180 - tick * 180
            const tickRadians = (tickAngle * Math.PI) / 180
            const outerX = centerX + 96 * Math.cos(tickRadians)
            const outerY = centerY - 96 * Math.sin(tickRadians)
            const innerX = centerX + 84 * Math.cos(tickRadians)
            const innerY = centerY - 84 * Math.sin(tickRadians)
            const labelX = centerX + 108 * Math.cos(tickRadians)
            const labelY = centerY - 108 * Math.sin(tickRadians) + 4
            return (
              <g key={tickValue}>
                <line
                  className="gauge-tick"
                  x1={innerX}
                  y1={innerY}
                  x2={outerX}
                  y2={outerY}
                />
                <text
                  className="gauge-tick-label"
                  x={labelX}
                  y={labelY}
                  textAnchor={tickValue === 0 ? 'start' : tickValue === max ? 'end' : 'middle'}
                >
                  {formatTickValue(tickValue, unit)}
                </text>
              </g>
            )
          })}
          <line
            className="gauge-needle"
            x1={centerX}
            y1={centerY}
            x2={needleX}
            y2={needleY}
          />
          <circle className="gauge-center" cx={centerX} cy={centerY} r="8" />
        </svg>
        <p className="gauge-value">
          {display}{unit}
        </p>
        <div className="unit-toggle-inline">
          <UnitToggle unit={unit} onChange={onUnitChange} />
        </div>
      </div>
    </section>
  )
}

export default CurrentPressureSlider
