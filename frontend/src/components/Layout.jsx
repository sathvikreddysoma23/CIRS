import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '1rem', marginLeft: 'var(--sidebar-width)' }}>
        <Header />
        <main style={{ marginTop: 'var(--header-height)', padding: '1.5rem' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
