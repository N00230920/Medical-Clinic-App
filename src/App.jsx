import {} from 'react';
import { AuthProvider } from './hooks/useAuth';

import { BrowserRouter as Router, Routes, Route } from "react-router";

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';

import Navbar from '@/components/Navbar';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ProtectedRoute from '@/pages/ProtectedRoute';

import DoctorsIndex from '@/pages/doctors/Index';
import DoctorsShow from '@/pages/doctors/Show';
import DoctorsCreate from '@/pages/doctors/Create';
import DoctorsEdit from '@/pages/doctors/Edit';
import DoctorsAppointments from '@/pages/doctors/appointments/Index';
import DoctorsAppointmentsCreate from '@/pages/doctors/appointments/Create';
import DoctorsAppointmentsEdit from '@/pages/doctors/appointments/Edit';
import DoctorsAppointmentsShow from '@/pages/doctors/appointments/Show';

import PatientsIndex from '@/pages/patients/Index';
import PatientsShow from '@/pages/patients/Show';
import PatientsCreate from '@/pages/patients/Create';
import PatientsEdit from '@/pages/patients/Edit';

import DiagnosesIndex from '@/pages/patients/diagnoses/Index';
import DiagnosesCreate from '@/pages/patients/diagnoses/Create';
import DiagnosesEdit from '@/pages/patients/diagnoses/Edit';


import PrescriptionsIndex from '@/pages/patients/prescriptions/Index';
import PrescriptionsCreate from '@/pages/patients/prescriptions/Create';
import PrescriptionsEdit from '@/pages/patients/prescriptions/Edit';
import PrescriptionsShow from '@/pages/patients/prescriptions/Show';


import Appointments from '@/pages/Appointments';

export default function App() {

  return (
    <Router>
      <AuthProvider>
      <SidebarProvider
        style={{
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        }}
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          {/* <Navbar onLogin={onLogin} loggedIn={loggedIn} /> */}

          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 mx-6">
                {/* Main content */}
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/doctors" element={<DoctorsIndex />} />
                  <Route path="/patients" element={<PatientsIndex />} />

                  <Route element={<ProtectedRoute />}>
                    <Route path="/doctors/create" element={<DoctorsCreate />} />
                    <Route path="/doctors/:id" element={<DoctorsShow />} />
                    <Route path="/doctors/:id/edit" element={<DoctorsEdit />} />
                    <Route
                      path="/doctors/:id/appointments"
                      element={<DoctorsAppointments />}
                    />
                    <Route
                      path="/doctors/:id/appointments/create"
                      element={<DoctorsAppointmentsCreate />}
                    />
                    <Route
                      path="/doctors/:id/appointments/:appointmentId"
                      element={<DoctorsAppointmentsShow />}
                    />
                    <Route
                      path="/doctors/:id/appointments/:appointmentId/edit"
                      element={<DoctorsAppointmentsEdit />}
                    />

                    <Route path="/patients/create" element={<PatientsCreate />} />
                    <Route path="/patients/:id" element={<PatientsShow />} />
                    <Route path="/patients/:id/edit" element={<PatientsEdit />} />
                    <Route
                      path="/patients/:id/diagnoses"
                      element={<DiagnosesIndex />}
                    />
                    <Route
                      path="/patients/:id/diagnoses/create"
                      element={<DiagnosesCreate />}
                    />
                    <Route
                      path="/patients/:id/diagnoses/:diagnosisId/edit"
                      element={<DiagnosesEdit />}
                    />
                    <Route
                      path="/patients/:id/prescriptions"
                      element={<PrescriptionsIndex />}
                    />
                    <Route
                      path="/patients/:id/prescriptions/create"
                      element={<PrescriptionsCreate />}
                    />
                    <Route
                      path="/patients/:id/prescriptions/:prescriptionId"
                      element={<PrescriptionsShow />}
                    />
                    <Route
                      path="/patients/:id/prescriptions/:prescriptionId/edit"
                      element={<PrescriptionsEdit />}
                    />

                    <Route path="/appointments" element={<Appointments />} />
                  </Route>
                </Routes>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      </AuthProvider>
    </Router>
  );
}
