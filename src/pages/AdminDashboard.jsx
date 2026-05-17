import { useState } from 'react'
import { LayoutGrid, Users, MessageSquare, Plus, Settings } from 'lucide-react'

export default function AdminDashboard({ currentTab, setCurrentTab }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-accent to-primary text-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-accent-foreground/80 mt-1">Manage teams, members, and comments</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-border">
          <button
            onClick={() => setCurrentTab('teams')}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
              currentTab === 'teams'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutGrid className="h-5 w-5" />
            Teams
          </button>
          <button
            onClick={() => setCurrentTab('members')}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
              currentTab === 'members'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="h-5 w-5" />
            Members
          </button>
          <button
            onClick={() => setCurrentTab('comments')}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
              currentTab === 'comments'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            Comments
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mb-8">
          {currentTab === 'teams' && (
            <button className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 font-medium transition-colors">
              <Plus className="h-5 w-5" />
              Add Team
            </button>
          )}
          {currentTab === 'members' && (
            <button className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 font-medium transition-colors">
              <Plus className="h-5 w-5" />
              Add Member
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="bg-card border border-border rounded-lg p-6">
          {currentTab === 'teams' && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Manage Teams</h2>
              <p className="text-muted-foreground">Team management interface coming soon...</p>
            </div>
          )}
          {currentTab === 'members' && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Manage Members</h2>
              <p className="text-muted-foreground">Member management interface coming soon...</p>
            </div>
          )}
          {currentTab === 'comments' && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Moderate Comments</h2>
              <p className="text-muted-foreground">Comment moderation interface coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
