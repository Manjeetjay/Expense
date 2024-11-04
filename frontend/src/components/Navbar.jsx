import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { FaSun, FaMoon, FaChartLine } from 'react-icons/fa'

function Navbar() {
  const location = useLocation()
  const { isDark, setIsDark } = useTheme()

  const isActive = (path) => {
    return location.pathname === path ? 
      'bg-gradient-to-r from-blue-500 to-purple-500' : ''
  }

  return (
    <nav className="w-full bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black shadow-lg transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <FaChartLine className="text-green-400 text-2xl" />
            <span className="text-white text-xl font-bold">Exp3ns3</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard" 
              className={`px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-200 ${isActive('/dashboard')}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/add-expense" 
              className={`px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-200 ${isActive('/add-expense')}`}
            >
              Add Expense
            </Link>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
            >
              {isDark ? 
                <FaSun className="text-yellow-400 text-xl" /> : 
                <FaMoon className="text-blue-300 text-xl" />
              }
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar