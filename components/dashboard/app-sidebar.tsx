'use client'

import * as React from 'react'
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Bell,
  Settings,
  Activity,
  Moon,
  Sun,
} from 'lucide-react'
import { useTheme } from 'next-themes'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'

interface AppSidebarProps {
  activeView: string
  onViewChange: (view: string) => void
}

const mainNavItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    id: 'dashboard',
  },
  {
    title: 'Logs',
    icon: FileText,
    id: 'logs',
  },
  {
    title: 'Metrics',
    icon: BarChart3,
    id: 'metrics',
  },
  {
    title: 'Alerts',
    icon: Bell,
    id: 'alerts',
  },
]

export function AppSidebar({ activeView, onViewChange }: AppSidebarProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Activity className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">AI Monitor</span>
                  <span className="text-xs text-muted-foreground">System Dashboard</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeView === item.id}
                    onClick={() => onViewChange(item.id)}
                    tooltip={item.title}
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                  <Settings className="size-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            {mounted && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="size-4" />
                    <span className="group-data-[collapsible=icon]:hidden">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="size-4" />
                    <span className="group-data-[collapsible=icon]:hidden">Dark Mode</span>
                  </>
                )}
              </Button>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
