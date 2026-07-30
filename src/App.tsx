import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { InspectionProvider } from './state/InspectionContext'
import { Welcome } from './routes/driver/Welcome'
import { VehicleSelect } from './routes/driver/VehicleSelect'
import { DriverSelect } from './routes/driver/DriverSelect'
import { OdometerEntry } from './routes/driver/OdometerEntry'
import { InspectionStepScreen } from './routes/driver/InspectionStepScreen'
import { SignatureStep } from './routes/driver/SignatureStep'
import { SubmissionComplete } from './routes/driver/SubmissionComplete'
import { AdminDashboard } from './routes/admin/AdminDashboard'
import { AssetDetail } from './routes/admin/AssetDetail'
import { AdminLogin } from './routes/admin/AdminLogin'
import { AdminGuard } from './components/AdminGuard'

function App() {
  return (
    <BrowserRouter basename="/fleet-inspect">
      <InspectionProvider>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/vehicle" element={<VehicleSelect />} />
          <Route path="/driver" element={<DriverSelect />} />
          <Route path="/odometer" element={<OdometerEntry />} />
          <Route path="/inspect/:stepIndex" element={<InspectionStepScreen />} />
          <Route path="/signature" element={<SignatureStep />} />
          <Route path="/complete" element={<SubmissionComplete />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminDashboard />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/:vehicleId"
            element={
              <AdminGuard>
                <AssetDetail />
              </AdminGuard>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </InspectionProvider>
    </BrowserRouter>
  )
}

export default App
