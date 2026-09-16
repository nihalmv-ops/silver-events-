import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/ui/ToastContext'
import { EventProvider } from './context/EventContext'
import { MenuProvider } from './context/MenuContext'
import { StaffProvider } from './context/StaffContext'
import { VendorProvider } from './context/VendorContext'
import { ArrangementProvider } from './context/ArrangementContext'
import { TaskProvider } from './context/TaskContext'
import { ExpenseProvider } from './context/ExpenseContext'
import { FinanceProvider } from './context/FinanceContext'
import { AppRoutes } from './routes/AppRoutes'

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <EventProvider>
            <MenuProvider>
              <StaffProvider>
                <VendorProvider>
                  <ArrangementProvider>
                    <TaskProvider>
                      <ExpenseProvider>
                        <FinanceProvider>
                          <AppRoutes />
                        </FinanceProvider>
                      </ExpenseProvider>
                    </TaskProvider>
                  </ArrangementProvider>
                </VendorProvider>
              </StaffProvider>
            </MenuProvider>
          </EventProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
