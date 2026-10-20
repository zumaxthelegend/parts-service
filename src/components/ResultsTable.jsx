import { useSelector } from 'react-redux'

export default function ResultsTable() {
  const { results, selectedBrand, resultSearchDone } = useSelector(state => state.search)

  if (!resultSearchDone) return null

  if (!results.length) {
    return (
      <div className="alert alert-warning alert-custom">
        Нет предложений для выбранного производителя.
      </div>
    )
  }

  return (
    <div className="card-custom">
      <div className="section-label">Шаг 3</div>
      <div className="section-title">
        Предложения по бренду{' '}
        <span className="text-accent">{selectedBrand}</span>
        <span className="results-count">— {results.length} позиций</span>
      </div>

      <div className="table-wrap">
        <table className="results-table">
          <thead>
            <tr>
              <th>Артикул</th>
              <th>Производитель</th>
              <th>Наименование</th>
              <th className="col-price">Цена, ₽</th>
              <th className="col-stock">Остаток</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, rowIndex) => (
              <tr key={`${item.brand}-${item.number}-${rowIndex}`} className={item.isMain ? 'is-main' : ''}>
                <td data-label="Артикул">{item.number}</td>
                <td data-label="Производитель">{item.brand}</td>
                <td data-label="Наименование">{item.name || '—'}</td>
                <td data-label="Цена, ₽" className="col-price">
                  <span className="text-price">
                    {item.price > 0
                      ? item.price.toLocaleString('ru-RU', { minimumFractionDigits: 2 })
                      : '—'}
                  </span>
                </td>
                <td data-label="Остаток" className="col-stock">
                  {item.count > 0
                    ? <span className="stock-badge in">✓ {item.count} шт.</span>
                    : <span className="stock-badge out">нет</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="footnote">
        <span className="footnote-swatch" />
        Выделена основная позиция, остальные — аналоги
      </p>
    </div>
  )
}
