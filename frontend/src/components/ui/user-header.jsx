"use client"

import { useState } from 'react'
import { ChevronDown, School, User, ShoppingCart, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function UserHeader({ userType, userName, institutions, selectedInstitution, onInstitutionChange, showProductsLink = false, showActionsLink = false }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const currentInstitution = institutions.find(inst => inst.name === selectedInstitution)

  const getHeaderColor = () => {
    switch (userType) {
      case 'teacher': return 'blue'
      case 'student': return 'purple'
      default: return 'blue'
    }
  }

  const getHeaderTitle = () => {
    switch (userType) {
      case 'teacher': return 'Teacher Dashboard'
      case 'student': return 'Student Dashboard'
      default: return 'Dashboard'
    }
  }

  const color = getHeaderColor()

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className={`h-8 w-8 text-${color}-600`} />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {getHeaderTitle()}
              </h1>
              <p className="text-sm text-gray-500">
                Welcome, {userName}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Links de navegação específicos */}
          <div className="flex items-center space-x-2">
            {showProductsLink && (
              <Link href="/products">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Products</span>
                </Button>
              </Link>
            )}
            {showActionsLink && (
              <Link href="/actions">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Actions</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Dropdown de Instituições */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 min-w-[300px] justify-between"
            >
              <div className="flex items-center space-x-2">
                <School className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium text-sm truncate">
                    {selectedInstitution}
                  </div>
                  <div className="text-xs text-gray-500">
                    Role: {currentInstitution?.role}
                  </div>
                </div>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="py-1">
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Your Institutions
                  </div>
                  {institutions.map((institution) => (
                    <button
                      key={institution.id}
                      onClick={() => {
                        onInstitutionChange(institution.name)
                        setIsDropdownOpen(false)
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                        selectedInstitution === institution.name ? `bg-${color}-50` : ''
                      }`}
                    >
                      <div className="font-medium text-sm text-gray-900">
                        {institution.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Role: {institution.role}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
