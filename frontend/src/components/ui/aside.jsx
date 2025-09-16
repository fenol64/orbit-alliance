"use client"

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Users,
  GraduationCap,
  Package,
  Activity,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react'

const AsideDashboard = ({ collapsed = false, onToggle }) => {
  const pathname = usePathname()
  
  const menuItems = [
    {
      icon: GraduationCap,
      label: 'Professores',
      href: '/professores',
    },
    {
      icon: Package,
      label: 'Produtos',
      href: '/produtos',
    },
    {
      icon: Activity,
      label: 'Ações',
      href: '/acoes',
    },
    {
      icon: Users,
      label: 'Usuários',
      href: '/usuarios',
    }
  ]

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen bg-background border-r border-border transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">O</span>
            </div>
            <span className="font-semibold text-lg">Orbit Alliance</span>
          </Link>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            "h-8 w-8",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-10 transition-all duration-200",
                collapsed ? "px-0 justify-center" : "px-3",
                isActive && "bg-secondary text-secondary-foreground"
              )}
              asChild
            >
              <Link href={item.href}>
                <Icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>
            </Button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start h-10",
            collapsed ? "px-0 justify-center" : "px-3"
          )}
        >
          <User className={cn("h-4 w-4", !collapsed && "mr-2")} />
          {!collapsed && <span>Perfil</span>}
        </Button>
      </div>
    </aside>
  )
}

export default AsideDashboard
