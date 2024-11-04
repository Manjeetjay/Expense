import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { format, differenceInDays, endOfMonth, startOfMonth } from 'date-fns'
import { FaArrowUp, FaArrowDown, FaCalendar, FaFilter } from 'react-icons/fa'
import { useTheme } from '../context/ThemeContext'

function Dashboard() {
  const [expenses, setExpenses] = useState([])
  const [budget, setBudget] = useState('')
  const [summary, setSummary] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [sortBy, setSortBy] = useState('date')
  const [sortDir, setSortDir] = useState('desc')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [loading, setLoading] = useState(true)
  const [daysUntilNextBudget, setDaysUntilNextBudget] = useState(0)
  const [budgetError, setBudgetError] = useState('');
  const { isDark } = useTheme()

  useEffect(() => {
    fetchExpenses()
    fetchSummary()
  }, [currentPage, sortBy, sortDir, dateRange])

  useEffect(() => {
    const today = new Date()
    const lastDayOfMonth = endOfMonth(today)
    const daysLeft = differenceInDays(lastDayOfMonth, today) + 1
    setDaysUntilNextBudget(daysLeft)
  }, [])

  const fetchExpenses = async () => {
    try {
      let url = `/dashboard/expenses?page=${currentPage}&size=18&sortBy=${sortBy}&sortDir=${sortDir}`
      if (dateRange.start && dateRange.end) {
        url += `&startDate=${dateRange.start}&endDate=${dateRange.end}`
      }
      const response = await api.get(url)
      setExpenses(response.data.content)
      setTotalPages(response.data.totalPages)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch expenses:', error)
      setLoading(false)
    }
  }

  const fetchSummary = async () => {
    try {
      const response = await api.get('/dashboard/summary')
      console.log('Summary response:', response.data)
      setSummary(response.data)
    } catch (error) {
      console.error('Failed to fetch summary:', error)
    }
  }

  const handleSetBudget = async () => {
    try {
      if (!budget || isNaN(budget)) {
        setBudgetError('Invalid budget amount');
        return;
      }
      
      const budgetData = {
        amount: parseFloat(budget),
        yearMonth: new Date().toISOString().slice(0, 7)
      };
      
      const response = await api.post('/dashboard/budget', budgetData);
      if (response.status === 200) {
        fetchSummary();
        setBudget('');
        setBudgetError('');
      }
    } catch (error) {
      console.error('Failed to set budget:', error);
      setBudgetError(error.response?.data || 'Failed to set budget');
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDir('asc')
    }
  }

  return (
    <div className="container mx-auto p-4 bg-gray-50 dark:bg-trader-dark-primary transition-colors duration-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Budget Card */}
        <div className="bg-gradient-to-br from-blue-500/90 to-purple-600/90 dark:from-blue-900 dark:to-purple-900 p-6 rounded-xl shadow-xl hover:shadow-glow transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 text-white">Monthly Budget</h2>
          {summary?.currentMonth?.budget > 0 ? (
            <div className="space-y-4">
              <div className="text-4xl font-bold text-white">
              ₹{summary.currentMonth.budget.toFixed(2)}
              </div>
              <div className="text-sm text-gray-200">
                Current month's budget
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-200">Days until next budget:</span>
                  <span className="text-xl font-semibold text-trader-blue">{daysUntilNextBudget}</span>
                </div>
                <div className="text-xs text-gray-300 mt-1">
                  New budget can be set on {format(startOfMonth(new Date().setMonth(new Date().getMonth() + 1)), 'MMM dd, yyyy')}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter budget amount"
                  />
                  <button
                    onClick={handleSetBudget}
                    className="px-6 py-3 bg-trader-blue text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                  >
                    Set
                  </button>
                </div>
                {budgetError && (
                  <div className="text-red-400 text-sm font-medium">{budgetError}</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        {summary?.currentMonth && (
          <div className="bg-gray-50 dark:bg-trader-dark-secondary p-6 rounded-xl shadow-xl hover:shadow-glow transition-all duration-300">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Monthly Summary</h2>
            <div className="space-y-4">
              {/* Budget Line */}
              <div className="flex justify-between items-center pb-2 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-300">Monthly Budget</span>
                <span className="text-xl font-bold text-trader-blue">
                ₹{summary.currentMonth.budget.toFixed(2)}
                </span>
              </div>
              
              {/* Spent Line */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-600 dark:text-gray-300">Spent This Month</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Total expenses for {format(new Date(), 'MMMM yyyy')}
                  </p>
                </div>
                <span className="text-xl font-bold text-trader-red">
                ₹{summary.currentMonth.expenses.toFixed(2)}
                </span>
              </div>

              {/* Remaining Line */}
              <div className="flex justify-between items-center pt-2 border-t dark:border-gray-700">
                <div>
                  <span className="text-gray-600 dark:text-gray-300">Remaining Balance</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Budget minus expenses
                  </p>
                </div>
                <span className={`text-xl font-bold ${
                  summary.currentMonth.budget - summary.currentMonth.expenses >= 0 
                    ? 'text-trader-green' 
                    : 'text-trader-red'
                }`}>
                  {summary.currentMonth.budget - summary.currentMonth.expenses >= 0 ? '+' : '-'}
                  ₹{Math.abs(summary.currentMonth.budget - summary.currentMonth.expenses).toFixed(2)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      summary.currentMonth.remaining >= 0 
                        ? 'bg-gradient-to-r from-trader-green to-green-500' 
                        : 'bg-gradient-to-r from-red-500 to-trader-red'
                    }`}
                    style={{ 
                      width: `${Math.min(
                        (summary.currentMonth.expenses / summary.currentMonth.budget) * 100, 
                        100
                      )}%` 
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                  {((summary.currentMonth.expenses / summary.currentMonth.budget) * 100).toFixed(1)}% of budget used
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Time Summary */}
        {summary?.allTime && (
          <div className="bg-gray-50 dark:bg-trader-dark-secondary p-6 rounded-xl shadow-xl hover:shadow-glow transition-all duration-300">
            <h2 className="text-xl font-bold mb-4 dark:text-white">All Time</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Total Budget</span>
                <span className="text-xl font-bold text-trader-blue">₹{summary.allTime.totalBudget.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Total Spent</span>
                <span className="text-xl font-bold text-trader-red">₹{summary.allTime.totalExpenses.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Expenses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {expenses.map(expense => (
          <div 
            key={expense.id} 
            className="bg-gray-50 dark:bg-trader-dark-secondary p-6 rounded-xl shadow-lg hover:shadow-glow transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-xl font-bold ${
                expense.amount > 1000 ? 'text-trader-red' : 'text-trader-green'
              }`}>
                ₹{expense.amount.toFixed(2)}
              </h3>
              <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium">
                {expense.category}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-3">{expense.description}</p>
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
              <span className="font-medium">{expense.transactionType}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-gray-50 dark:bg-trader-dark-secondary p-6 rounded-xl shadow-lg mb-8">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-trader-dark-accent border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-trader-blue dark:text-white"
            />
            <span className="dark:text-white">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-trader-dark-accent border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-trader-blue dark:text-white"
            />
          </div>
          <button
            onClick={() => handleSort('amount')}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium"
          >
            Sort by Amount {sortBy === 'amount' && (sortDir === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === index
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-gray-50 dark:bg-trader-dark-secondary text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-trader-dark-accent'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard 