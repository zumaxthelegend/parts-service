import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchBrands, reset } from '../store/searchSlice.js'

export default function SearchForm() {
  const [articleNumber, setArticleNumber] = useState('')
  const dispatch = useDispatch()

  function handleSubmit(event) {
    event.preventDefault()
    const trimmedNumber = articleNumber.trim()
    if (!trimmedNumber) return
    dispatch(reset())
    dispatch(fetchBrands(trimmedNumber))
  }

  return (
    <form onSubmit={handleSubmit} className="d-flex gap-2">
      <div className="search-input-wrap flex-grow-1">
        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="form-control search-input"
          placeholder="Артикул запчасти"
          value={articleNumber}
          onChange={event => setArticleNumber(event.target.value)}
        />
      </div>
      <button type="submit" className="search-btn">
        Найти
      </button>
    </form>
  )
}
