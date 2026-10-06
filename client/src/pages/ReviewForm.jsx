import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

const defaults = { courseCode: '', rating: 5, comment: '' }

export default function ReviewForm() {
  const nav = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(defaults)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.get(`/reviews/${id}`)
      .then(res => {
        const { courseCode, rating, comment } = res.data
        setForm({ courseCode, rating, comment: comment ?? '' })
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Could not load review.')
      })
  }, [id])

  function onChange(e) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'rating' ? Number(value) : value,
    }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      if (id) {
        await api.patch(`/reviews/${id}`, form)
      } else {
        await api.post('/reviews', form)
      }
      nav('/reviews')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white rounded-xl shadow p-8">
      <h1 className="text-xl font-semibold mb-4">{id ? 'Edit' : 'Write'} Review</h1>
      <form onSubmit={onSubmit} className="space-y-3">

        <input
          type="text"
          name="courseCode"
          value={form.courseCode}
          onChange={onChange}
          placeholder="CS101"
          required
          className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none"
        />

        <select
          name="rating"
          value={form.rating}
          onChange={onChange}
          className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none"
        >
          {[1, 2, 3, 4, 5].map(n => (
            <option key={n} value={n}>{n} / 5</option>
          ))}
        </select>

        <textarea
          name="comment"
          value={form.comment}
          onChange={onChange}
          rows={4}
          className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none resize-y"
        />

        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          className="border border-gray-800 rounded-lg px-6 py-2 font-semibold hover:bg-gray-50"
        >
          Save
        </button>
      </form>
    </div>
  )
}