import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import axios from 'axios'
import { FaMoneyBillWave, FaTag, FaList, FaExchangeAlt, FaHashtag } from 'react-icons/fa'

function AddExpense() {
  const { isDark } = useTheme()
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    transactionType: 'OFFLINE',
    transactionId: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const categories = [
    'Food',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Bills',
    'Others'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    try {
      if (formData.transactionType === 'ONLINE' && !formData.transactionId) {
        setError('Transaction ID is required for online transactions')
        return
      }

      const response = await axios.post('http://localhost:8080/api/expenses', formData)
      setSuccess(true)
      setFormData({
        amount: '',
        description: '',
        category: '',
        transactionType: 'OFFLINE',
        transactionId: ''
      })
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add expense')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white dark:bg-trader-dark-secondary rounded-xl shadow-xl p-8 transition-all duration-200">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
          <FaMoneyBillWave className="text-trader-green mr-3" />
          Add New Expense
        </h1>
        
        {success && (
          <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
            <span>Expense added successfully!</span>
            <button 
              onClick={() => setSuccess(false)}
              className="text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
            <span>{error}</span>
            <button 
              onClick={() => setError('')}
              className="text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              <FaMoneyBillWave className="mr-2" />
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-trader-dark-accent border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-trader-blue dark:text-white transition-colors duration-200"
              required
              step="0.01"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              <FaList className="mr-2" />
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-trader-dark-accent border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-trader-blue dark:text-white transition-colors duration-200"
              required
              placeholder="Enter description"
            />
          </div>

          <div>
            <label className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              <FaTag className="mr-2" />
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-trader-dark-accent border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-trader-blue dark:text-white transition-colors duration-200"
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              <FaExchangeAlt className="mr-2" />
              Transaction Type
            </label>
            <select
              name="transactionType"
              value={formData.transactionType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-trader-dark-accent border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-trader-blue dark:text-white transition-colors duration-200"
              required
            >
              <option value="OFFLINE">Offline</option>
              <option value="ONLINE">Online</option>
            </select>
          </div>

          {formData.transactionType === 'ONLINE' && (
            <div>
              <label className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                <FaHashtag className="mr-2" />
                Transaction ID
              </label>
              <input
                type="text"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-trader-dark-accent border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-trader-blue dark:text-white transition-colors duration-200"
                required
                placeholder="Enter transaction ID"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-4 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 font-medium flex items-center justify-center"
          >
            <FaMoneyBillWave className="mr-2" />
            Add Expense
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddExpense 