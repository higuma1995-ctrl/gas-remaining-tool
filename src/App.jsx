import { useEffect, useMemo, useState } from 'react'
import './App.css'
import CurrentPressureSlider from './components/CurrentPressureSlider'
import FillPressureInput from './components/FillPressureInput'
import FlowRateInput from './components/FlowRateInput'
import ResultDisplay from './components/ResultDisplay'
import VolumeInput from './components/VolumeInput'

const STORAGE_KEY = 'grt_inputs'
const VOLUME_PRESETS = [1.1, 2.0, 2.8, 3.4, 10]
const FLOW_PRESETS = [0.25, 0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0]

const DEFAULT_INPUTS = {
  unit: 'MPa',
  volume: '2.0',
  fillPressure: 14.7,
  currentPressure: 0,
  flowRate: '0.5',
}

function getFillPressureForUnit(fillPressure, unit) {
  if (unit === 'kgf/cm²') {
    return fillPressure === 14.7 ? 150 : 200
  }
  return fillPressure
}

function formatMinutes(totalMinutes) {
  const rounded = Math.floor(totalMinutes)
  if (rounded >= 60) {
    const hours = Math.floor(rounded / 60)
    const minutes = rounded % 60
    return `${hours}時間${minutes}分`
  }
  return `${rounded}分`
}

function parsePositive(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

function isAllowedFillPressure(value) {
  return value === 14.7 || value === 19.6
}

function loadInitialInputs() {
  if (typeof window === 'undefined') {
    return { inputs: DEFAULT_INPUTS, restored: false }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { inputs: DEFAULT_INPUTS, restored: false }
    }
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return { inputs: DEFAULT_INPUTS, restored: false }
    }

    const unit = parsed.unit === 'kgf/cm²' ? 'kgf/cm²' : 'MPa'
    const fillPressure = isAllowedFillPressure(parsed.fillPressure)
      ? parsed.fillPressure
      : 14.7
    const currentMax = getFillPressureForUnit(fillPressure, unit)
    const currentPressureValue = Number(parsed.currentPressure)
    const currentPressure = Number.isFinite(currentPressureValue)
      ? Math.min(Math.max(currentPressureValue, 0), currentMax)
      : 0
    const volume =
      parsed.volume === '' || parsed.volume === undefined
        ? ''
        : String(Math.max(Number(parsed.volume), 0) || '')
    const flowRate =
      parsed.flowRate === '' || parsed.flowRate === undefined
        ? ''
        : String(Math.max(Number(parsed.flowRate), 0) || '')

    return {
      inputs: { unit, volume, fillPressure, currentPressure, flowRate },
      restored: true,
    }
  } catch {
    return { inputs: DEFAULT_INPUTS, restored: false }
  }
}

const INITIAL_STATE = loadInitialInputs()
const INITIAL_INPUTS = INITIAL_STATE.inputs

function App() {
  const [inputs, setInputs] = useState(INITIAL_INPUTS)
  const [restoreNotice, setRestoreNotice] = useState(INITIAL_STATE.restored)
  const [volumePreset, setVolumePreset] = useState(() => {
    const parsedVolume = Number(INITIAL_INPUTS.volume)
    return VOLUME_PRESETS.includes(parsedVolume) ? parsedVolume : null
  })
  const [flowPreset, setFlowPreset] = useState(() => {
    const parsedFlow = Number(INITIAL_INPUTS.flowRate)
    return FLOW_PRESETS.includes(parsedFlow) ? parsedFlow : null
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs))
    } catch {
      // ignore storage save errors by spec
    }
  }, [inputs])

  useEffect(() => {
    if (!restoreNotice) {
      return undefined
    }

    const timerId = window.setTimeout(() => {
      setRestoreNotice(false)
    }, 3000)

    return () => window.clearTimeout(timerId)
  }, [restoreNotice])

  const sliderMax = getFillPressureForUnit(inputs.fillPressure, inputs.unit)
  const sliderStep = inputs.unit === 'MPa' ? 0.1 : 1

  const result = useMemo(() => {
    const volume = parsePositive(inputs.volume)
    const flowRate = Number(inputs.flowRate)

    if (!volume || inputs.currentPressure === null || inputs.currentPressure === undefined) {
      return { valid: false, message: '入力値を確認してください' }
    }

    if (!Number.isFinite(flowRate) || flowRate < 0) {
      return { valid: false, message: '入力値を確認してください' }
    }

    if (flowRate === 0 || inputs.flowRate === '') {
      return { valid: false, message: '流量を入力してください' }
    }

    const remaining =
      inputs.unit === 'MPa'
        ? volume * inputs.currentPressure * 10
        : volume * inputs.currentPressure
    const minutes = remaining / flowRate
    const fillPressureForUnit = getFillPressureForUnit(inputs.fillPressure, inputs.unit)
    const ratio = fillPressureForUnit > 0 ? inputs.currentPressure / fillPressureForUnit : 0

    let status = 'danger'
    if (ratio > 0.3) {
      status = 'normal'
    } else if (ratio >= 0.2) {
      status = 'warning'
    }

    return {
      valid: true,
      remainingLiters: remaining.toFixed(1),
      timeText: formatMinutes(minutes),
      status,
    }
  }, [inputs])

  const handleUnitChange = (nextUnit) => {
    setInputs((prev) => {
      if (prev.unit === nextUnit) {
        return prev
      }

      const currentInMpa = prev.unit === 'MPa' ? prev.currentPressure : prev.currentPressure / 10
      const converted = nextUnit === 'MPa' ? currentInMpa : currentInMpa * 10
      const nextMax = getFillPressureForUnit(prev.fillPressure, nextUnit)
      const stepped =
        nextUnit === 'MPa'
          ? Math.round(Math.min(Math.max(converted, 0), nextMax) * 10) / 10
          : Math.round(Math.min(Math.max(converted, 0), nextMax))

      return {
        ...prev,
        unit: nextUnit,
        currentPressure: stepped,
      }
    })
  }

  const handleFillPressureChange = (fillPressure) => {
    setInputs((prev) => {
      const nextMax = getFillPressureForUnit(fillPressure, prev.unit)
      return {
        ...prev,
        fillPressure,
        currentPressure: Math.min(prev.currentPressure, nextMax),
      }
    })
  }

  const handleCurrentPressureChange = (value) => {
    const parsed = Number(value)
    if (!Number.isFinite(parsed)) {
      return
    }
    setInputs((prev) => ({ ...prev, currentPressure: parsed }))
  }

  return (
    <main className="app">
      <header className="card app-header">
        <h1>Gas Remaining Tool</h1>
      </header>

      {restoreNotice && <p className="restore-notice">前回の値を読み込みました</p>}

      <CurrentPressureSlider
        unit={inputs.unit}
        value={inputs.currentPressure}
        max={sliderMax}
        step={sliderStep}
        onChange={handleCurrentPressureChange}
        onUnitChange={handleUnitChange}
      />

      <VolumeInput
        value={inputs.volume}
        selectedPreset={volumePreset}
        onPresetSelect={(preset) => {
          setVolumePreset(preset)
          setInputs((prev) => ({ ...prev, volume: String(preset.toFixed(1)) }))
        }}
        onManualChange={(value) => {
          setVolumePreset(null)
          setInputs((prev) => ({ ...prev, volume: value }))
        }}
      />

      <FillPressureInput
        unit={inputs.unit}
        fillPressure={inputs.fillPressure}
        onChange={handleFillPressureChange}
      />

      <FlowRateInput
        value={inputs.flowRate}
        selectedPreset={flowPreset}
        onPresetSelect={(preset) => {
          setFlowPreset(preset)
          setInputs((prev) => ({ ...prev, flowRate: String(preset) }))
        }}
        onManualChange={(value) => {
          setFlowPreset(null)
          setInputs((prev) => ({ ...prev, flowRate: value }))
        }}
      />

      <ResultDisplay result={result} />
    </main>
  )
}

export default App
