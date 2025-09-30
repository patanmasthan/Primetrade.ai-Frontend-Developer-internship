import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Dashboard } from '@/components/dashboard/Dashboard';

const DashboardPage = () => {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
};

export default DashboardPage;