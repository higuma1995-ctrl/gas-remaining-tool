const UNITS = ['MPa', 'kgf/cm²']

function UnitToggle({ unit, onChange }) {
  return (
    <section className="card">
      <h2>単位</h2>
      <div className="button-group" role="radiogroup" aria-label="単位切替">
        {UNITS.map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={unit === option}
            className={unit === option ? 'selected' : ''}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  )
}

export default UnitToggle
