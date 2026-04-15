const RESULT_STYLES = {
  normal: { label: '● 十分な残量' },
  warning: { label: '▲ 交換を検討' },
  danger: { label: '■ 早急に交換' },
}

function ResultDisplay({ result }) {
  if (!result.valid) {
    return (
      <section className="card">
        <h2>結果</h2>
        <div className="result-box neutral">{result.message}</div>
        <p className="note">※実際の残量には誤差があります。余裕を持って交換してください。</p>
      </section>
    )
  }

  return (
    <section className="card">
      <h2>結果</h2>
      <div className={`result-box ${result.status}`}>
        <p className="status-label">{RESULT_STYLES[result.status].label}</p>
        <p>残量: {result.remainingLiters}L</p>
        <p>使用可能時間: {result.timeText}</p>
      </div>
      <p className="note">※実際の残量には誤差があります。余裕を持って交換してください。</p>
    </section>
  )
}

export default ResultDisplay
