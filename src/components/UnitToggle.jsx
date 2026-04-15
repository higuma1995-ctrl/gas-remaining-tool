const UNITS = ['MPa', 'kgf/cm²']

function UnitToggle({ unit, onChange }) {
  return (
    <div className="unit-toggle" role="radiogroup" aria-label="単位切替">
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
  )
}

export default UnitToggle
