function CurrentPressureSlider({ unit, value, max, step, onChange }) {
  const display = unit === 'MPa' ? Number(value).toFixed(1) : Number(value).toFixed(0)

  return (
    <section className="card">
      <h2>現在圧力</h2>
      <div className="slider-row">
        <input
          type="range"
          min="0"
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label="現在圧力"
        />
        <p className="slider-value">
          {display}{unit}
        </p>
      </div>
    </section>
  )
}

export default CurrentPressureSlider
