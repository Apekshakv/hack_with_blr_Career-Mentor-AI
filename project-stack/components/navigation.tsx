'use client';

import { useState } from 'react';
import { Brain, BookOpen, Briefcase, BarChart3, MessageSquare, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userName: string;
  onLogout: () => void;
}

export default function Navigation({
  activeTab,
  onTabChange,
  userName,
  onLogout,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Brain },
    { id: 'skills', label: 'Skills', icon: BookOpen },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'internships', label: 'Internships', icon: Briefcase },
    { id: 'mentor', label: 'Mentor Chat', icon: MessageSquare },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-sidebar text-sidebar-foreground border-b border-sidebar-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            <span className="font-semibold text-sm">Career Mentor</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="text-sidebar-foreground hover:bg-sidebar-accent/20"
          >
            ☰
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <nav
        className={cn(
          'fixed md:sticky top-0 left-0 h-screen md:h-auto w-64 md:w-auto md:max-w-xs bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-transform duration-300 z-30 md:z-0',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="hidden md:flex items-center gap-3 p-6 border-b border-sidebar-border">
            <div className="p-2 bg-sidebar-primary/20 rounded-lg">
              <Brain className="w-5 h-5 text-sidebar-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Career Mentor</h1>
              <p className="text-xs text-sidebar-foreground/60">Powered by Hindsight</p>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-sidebar-border">
            <p className="text-xs text-sidebar-foreground/60">Welcome back,</p>
            <p className="font-semibold text-sm truncate">{userName}</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onTabChange(tab.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium',
                      activeTab === tab.id
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/20'
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-left">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="border-t border-sidebar-border p-4 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/20"
            >
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="w-full justify-start text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
