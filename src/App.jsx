import { useSelector } from 'react-redux'
import SearchForm from './components/SearchForm.jsx'
import BrandList from './components/BrandList.jsx'
import ResultsTable from './components/ResultsTable.jsx'
import Loader from './components/Loader.jsx'
import ErrorMessage from './components/ErrorMessage.jsx'

export default function App() {
  const { loadingStep, error } = useSelector(state => state.search)

  const isBrandsLoading = loadingStep === 'brands'
  const isResultsLoading = loadingStep === 'results'

  return (
    <div>
      <header className="app-header">
        <div className="container">
          <div className="header-inner">
            <div className="header-logo">🔧</div>
            <div>
              <div className="header-title">АвтоЗапчасти</div>
              <div className="header-subtitle">Поиск оригиналов и аналогов</div>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container" style={{ maxWidth: 880 }}>
          <div className="card-custom mb-4">
            <div className="section-label">Шаг 1</div>
            <div className="section-title">Введите артикул запчасти</div>
            <SearchForm />
          </div>

          {/* Шаг 1: скрывает всё ниже */}
          {isBrandsLoading && <Loader />}

          {/* Список брендов остаётся видимым во время загрузки результатов */}
          {!isBrandsLoading && error && !isResultsLoading && <ErrorMessage message={error} />}
          {!isBrandsLoading && <BrandList />}

          {/* Шаг 2: лоадер под списком брендов или итоговая таблица */}
          {!isBrandsLoading && isResultsLoading && <Loader />}
          {!isBrandsLoading && !isResultsLoading && error && <ErrorMessage message={error} />}
          {!isBrandsLoading && !isResultsLoading && <ResultsTable />}
        </div>
      </main>
    </div>
  )
}
