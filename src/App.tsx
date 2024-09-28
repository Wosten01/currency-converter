// import { Provider } from "react-redux";
import { Provider } from "react-redux";
import CurrencyConverter from "./components/currency-converter/CurrencyConverter";
// import {store} from "./store";
import CurrencyRatesList from "./components/currency-list/CurrencyList";
// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { store } from "./store";
import Header from "./components/header/Header";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="">
          <Header />
          <div className="pt-20 p-4">
            <Routes>
              <Route path="/" element={<CurrencyConverter />} />
              <Route path="/list" element={<CurrencyRatesList />} />
            </Routes>
          </div>
        </div>
      </Router>
    </Provider>
  );
};

// const ListPage = () => {
//   const navigate = useNavigate();

//   const goToMainPage = () => {
//     navigate('/');
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <h1 className="text-3xl font-bold mb-8">This is the List Page</h1>
//       <button
//         onClick={goToMainPage}
//         className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
//       >
//         Go to Main Page
//       </button>
//     </div>
//   );
// };

// const MainPage = () => {
//   return (
//     <div>
//       <h1>Welcome to the Main Page</h1>
//     </div>
//   );
// };

export default App;
