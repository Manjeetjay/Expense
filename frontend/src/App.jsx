import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { licenseService } from './services/api'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import AddExpense from './pages/AddExpense'
import { useTheme } from './context/ThemeContext'

function App() {
  const { isDark } = useTheme()
  const [licenseKey, setLicenseKey] = useState('')
  const [isFirstTime, setIsFirstTime] = useState(true)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkLicenseStatus()
  }, [])

  const checkLicenseStatus = async () => {
    try {
      const data = await licenseService.checkLicenseStatus()
      setIsFirstTime(!data.exists)
      setIsLoading(false)
    } catch (error) {
      setError('Failed to check license status')
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (isFirstTime) {
        await licenseService.registerLicense(licenseKey)
        setIsAuthenticated(true)
      } else {
        const data = await licenseService.validateLicense(licenseKey)
        setIsAuthenticated(data.valid)
        if (!data.valid) {
          setError('Invalid license key')
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong')
    }
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-trader-dark-primary transition-colors duration-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-trader-dark-primary transition-colors duration-200">
        <div className="w-full max-w-md mx-4">
          <div className="bg-gray-50 dark:bg-trader-dark-secondary rounded-lg shadow-xl p-8 transition-all duration-200">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              {isFirstTime ? 'Register License Key' : 'Enter License Key'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="Enter your license key"
                className="w-full px-4 py-3 bg-white dark:bg-trader-dark-accent border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-trader-blue dark:text-white transition-colors duration-200"
                required
              />
              {error && (
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium"
              >
                {isFirstTime ? 'Register' : 'Validate'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="w-full min-h-screen bg-gray-50 dark:bg-trader-dark-primary transition-colors duration-200">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-expense" element={<AddExpense />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
