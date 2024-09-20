import { Provider } from "react-redux";
// import CurrencyConverter from "./components/currency-converter/CurrencyConverter";
import {store} from "./store";
import CurrencyRatesList from "./components/currency-list/CurrencyList";

function App() {
  return (
    <Provider store={store}>
        {/* <CurrencyConverter /> */}
        <CurrencyRatesList />
    </Provider>
  );
}

export default App;
