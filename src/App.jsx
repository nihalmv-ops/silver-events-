import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { EventProvider } from './context/EventContext'
import { MenuProvider } from './context/MenuContext'
import { StaffProvider } from './context/StaffContext'
import { VendorProvider } from './context/VendorContext'
import { ArrangementProvider } from './context/ArrangementContext'
import { AppRoutes } from './routes/AppRoutes'

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EventProvider>
          <MenuProvider>
            <StaffProvider>
              <VendorProvider>
                <ArrangementProvider>
                  <AppRoutes />
                </ArrangementProvider>
              </VendorProvider>
            </StaffProvider>
          </MenuProvider>
        </EventProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
