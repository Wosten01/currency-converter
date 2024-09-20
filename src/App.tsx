// import './App.css'
import { Provider } from "react-redux";
import CurrencyConverter from "./components/currency-converter/CurrencyConverter";
import store from "./store";

function App() {
  return (
    <Provider store={store}>
        <CurrencyConverter />
    </Provider>
  );
}

export default App;
