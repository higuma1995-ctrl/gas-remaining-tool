const FLOW_PRESETS = [0.25, 0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0]

function FlowRateInput({ value, selectedPreset, onPresetSelect, onManualChange }) {
  return (
    <section className="card">
      <h2>流量（L/分）</h2>
      <div className="button-group" aria-label="流量プリセット">
        {FLOW_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            className={selectedPreset === preset ? 'selected' : ''}
            onClick={() => onPresetSelect(preset)}
          >
            {preset.toFixed(2).replace(/0$/, '').replace(/\.0$/, '.0')}
          </button>
        ))}
      </div>
      <label className="field-label" htmlFor="flow-input">
        手入力（L/分）
      </label>
      <input
        id="flow-input"
        type="number"
        min="0"
        step="0.01"
        inputMode="decimal"
        value={value}
        onChange={(event) => onManualChange(event.target.value)}
      />
    </section>
  )
}

export default FlowRateInput
