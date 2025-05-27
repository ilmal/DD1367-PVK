import { FC, Suspense, lazy, LazyExoticComponent } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";

// Lazy load all page components, mapping named exports to default
const IndexPage = lazy(() =>
  import("./pages/explorer").then((module) => ({ default: module.IndexPage }))
);
const PopupPage = lazy(() =>
  import("./pages/popup").then((module) => ({ default: module.PopupPage }))
);
const BoardInterfacePage = lazy(() =>
  import("./pages/boardInterface").then((module) => ({ default: module.BoardInterface }))
);
const ConfigurePage = lazy(() =>
  import("./pages/configure").then((module) => ({ default: module.Configure }))
);
const DatabasePage = lazy(() =>
  import("./pages/database").then((module) => ({ default: module.Database }))
);
const ExplorerPage = lazy(() =>
  import("./pages/explorer").then((module) => ({ default: module.IndexPage }))
);
const ModuleHierarchyPage = lazy(() =>
  import("./pages/moduleHierarchy").then((module) => ({
    default: module.ModuleHierarchy
  }))
);
const NewCanvasPage = lazy(() =>
  import("./pages/newCanvas").then((module) => ({ default: module.NewCanvas }))
);
const RegistersAndMemoryPage = lazy(() =>
  import("./pages/registersAndMemory").then((module) => ({
    default: module.RegistersAndMemory
  }))
);
const RunSimulationPage = lazy(() =>
  import("./pages/runSimulation").then((module) => ({
    default: module.RunSimulation
  }))
);
const SearchPage = lazy(() =>
  import("./pages/search").then((module) => ({ default: module.Search }))
);
const SimulationViewerPage = lazy(() =>
  import("./pages/simulationViewer").then((module) => ({
    default: module.SimulationViewer
  }))
);
const TestBenchPage = lazy(() =>
  import("./pages/testBench").then((module) => ({ default: module.TestBench }))
);
const VersionControlPage = lazy(() =>
  import("./pages/versionControl").then((module) => ({
    default: module.VersionControl
  }))
);

// Define a type for route configuration
interface RouteConfig {
  path: string;
  component: LazyExoticComponent<FC>;
  exact?: boolean;
}

// Centralized route definitions
const routes: RouteConfig[] = [
  { path: "/", component: IndexPage, exact: true },
  { path: "/boardinterface", component: BoardInterfacePage },
  { path: "/configure", component: ConfigurePage },
  { path: "/database", component: DatabasePage },
  { path: "/explorer", component: ExplorerPage },
  { path: "/modulehierarchy", component: ModuleHierarchyPage },
  { path: "/newcanvas", component: NewCanvasPage },
  { path: "/popup", component: PopupPage },
  { path: "/registersandmemory", component: RegistersAndMemoryPage },
  { path: "/runsimulation", component: RunSimulationPage },
  { path: "/search", component: SearchPage },
  { path: "/simulationviewer", component: SimulationViewerPage },
  { path: "/testbench", component: TestBenchPage },
  { path: "/versioncontrol", component: VersionControlPage },
];

// LazyRoute component to wrap lazy-loaded components with Suspense
const LazyRoute: FC<{ component: LazyExoticComponent<FC> }> = ({ component: Component }) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Component />
  </Suspense>
);

// Router component
export const Router: FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<LazyRoute component={route.component} />}
              index={route.exact}
            />
          ))}
          {/* Fallback route for undefined paths */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Route>
      </Routes>
    </HashRouter>
  );
};