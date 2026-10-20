import { useDispatch, useSelector } from 'react-redux'
import { selectBrand, fetchResults } from '../store/searchSlice.js'

export default function BrandList() {
  const dispatch = useDispatch()
  const { brands, articleNumber, selectedBrand, brandSearchDone } = useSelector(state => state.search)

  if (!brandSearchDone) return null

  if (!brands.length) {
    return (
      <div className="alert alert-warning alert-custom">
        По артикулу ничего не найдено. Проверьте правильность ввода.
      </div>
    )
  }

  function handleSelect(brand) {
    dispatch(selectBrand(brand))
    dispatch(fetchResults({ articleNumber, brand }))
  }

  return (
    <div className="card-custom mb-4">
      <div className="section-label">Шаг 2</div>
      <div className="section-title">Выберите производителя — {brands.length} найдено</div>
      <div>
        {brands.map(item => {
          const isActive = selectedBrand === item.brand
          return (
            <button
              key={item.brand}
              type="button"
              className={`list-group-item list-group-item-action brand-item d-flex justify-content-between align-items-center ${isActive ? 'active' : ''}`}
              onClick={() => handleSelect(item.brand)}
            >
              <div className="d-flex align-items-center gap-2 min-w-0">
                <strong>{item.brand}</strong>
                {item.name && (
                  <span className={`small text-truncate ${isActive ? 'text-white-50' : 'text-muted'}`}>
                    {item.name}
                  </span>
                )}
              </div>
              <span className={`brand-badge ms-2 ${isActive ? 'bg-white text-primary' : 'bg-light text-secondary'}`}>
                {item.count} шт.
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
