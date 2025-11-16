import "./App.css";
import useRouteElements from "./useRouter";

function App() {
  const routeElements = useRouteElements();
  return <>{routeElements}</>;
}

export default App;
