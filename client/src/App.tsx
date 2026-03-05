import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import CourseView from "./pages/CourseView";
import AssessmentView from "./pages/AssessmentView";
import PaymentPage from "./pages/PaymentPage";
import SettingsPage from "./pages/SettingsPage";
import LessonEditor from "./pages/LessonEditor";
import ReportsPage from "./pages/ReportsPage";
import CreateCoursePage from "./pages/CreateCoursePage";
import UsersManagement from "./pages/UsersManagement";
import PaymentsManagement from "./pages/PaymentsManagement";
import EditCoursePage from "./pages/EditCoursePage";
import LessonsManagement from "./pages/LessonsManagement";
import AssessmentsManagement from "./pages/AssessmentsManagement";
import MaterialsManagement from "./pages/MaterialsManagement";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/reports/:reportType"} component={ReportsPage} />
      <Route path={"/admin/courses/new"} component={CreateCoursePage} />
      <Route path={"/admin/courses/:courseId/edit"} component={EditCoursePage} />
      <Route path={"/admin/users"} component={UsersManagement} />
      <Route path={"/admin/payments"} component={PaymentsManagement} />
      <Route path={"/professor"} component={ProfessorDashboard} />
      <Route path={"/professor/lessons"} component={LessonsManagement} />
      <Route path={"/professor/assessments"} component={AssessmentsManagement} />
      <Route path={"/professor/materials"} component={MaterialsManagement} />
      <Route path={"/professor/lessons/new"} component={LessonEditor} />
      <Route path={"/professor/courses/:courseId/lessons"} component={LessonEditor} />
      <Route path={"/student"} component={StudentDashboard} />
      <Route path={"/courses/:courseId"} component={CourseView} />
      <Route path={"/assessments/:assessmentId"} component={AssessmentView} />
      <Route path={"/payments"} component={PaymentPage} />
      <Route path={"/settings"} component={SettingsPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
