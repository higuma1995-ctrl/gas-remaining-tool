const PRESSURE_OPTIONS = [14.7, 19.6]

function getDisplayPressure(value, unit) {
  if (unit === 'kgf/cm²') {
    return value === 14.7 ? 150 : 200
  }
  return value
}

function FillPressureInput({ unit, fillPressure, onChange }) {
  return (
    <section className="card">
      <h2>充填圧力</h2>
      <div className="button-group" aria-label="充填圧力">
        {PRESSURE_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            className={fillPressure === option ? 'selected' : ''}
            onClick={() => onChange(option)}
          >
            {getDisplayPressure(option, unit)}{unit}
          </button>
        ))}
      </div>
    </section>
  )
}

export default FillPressureInput
