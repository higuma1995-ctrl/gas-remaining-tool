const VOLUME_PRESETS = [1.1, 2.0, 2.8, 3.4, 10]

function formatVolumePreset(preset) {
  return preset === 10 ? '10L' : `${preset.toFixed(1)}L`
}

function VolumeInput({ value, selectedPreset, onPresetSelect, onManualChange }) {
  return (
    <section className="card">
      <h2>容器サイズ（内容積）</h2>
      <div className="button-group" aria-label="容器サイズプリセット">
        {VOLUME_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            className={selectedPreset === preset ? 'selected' : ''}
            onClick={() => onPresetSelect(preset)}
          >
            {formatVolumePreset(preset)}
          </button>
        ))}
      </div>
      <label className="field-label" htmlFor="volume-input">
        手入力（L）
      </label>
      <input
        id="volume-input"
        type="number"
        min="0"
        step="0.1"
        inputMode="decimal"
        value={value}
        onChange={(event) => onManualChange(event.target.value)}
      />
    </section>
  )
}

export default VolumeInput
