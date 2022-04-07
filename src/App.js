import AppRouter from "components/routing/routers/AppRouter";
import HeaderRouter from "components/routing/routers/HeaderRouter";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
const App = () => {
  return (
    <div>
      <HeaderRouter/>
      <AppRouter/>
    </div>
  );
};

export default App;
