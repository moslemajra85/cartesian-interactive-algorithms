type InputSizeExperimentProps = {
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}

export function InputSizeExperiment({ value, min, max, onChange }: InputSizeExperimentProps) {
  return (
    <div className="input-size-experiment">
      <div>
        <label htmlFor="foundation-input-size">Experiment with input size</label>
        <span>Drag n and compare how the model responds.</span>
      </div>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value === min} aria-label="Decrease input size">−</button>
      <input
        id="foundation-input-size"
        type="range"
        min={min}
        max={max}
        step="1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-valuetext={`${value} ${value === 1 ? 'item' : 'items'}`}
      />
      <button type="button" onClick={() => onChange(value + 1)} disabled={value === max} aria-label="Increase input size">+</button>
      <output htmlFor="foundation-input-size" aria-live="polite"><span>n =</span>{value}</output>
    </div>
  )
}
