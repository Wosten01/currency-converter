import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt, faList } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-gray-50 text-[#2584ff] fixed w-full top-0 z-50 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center max-w-6xl px-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-widest">
          Сервис конвертации валют
        </h1>
        <nav className="flex items-center space-x-2 md:space-x-4">
          {location.pathname !== "/" && (
            <Link
              to="/"
              className=" font-bold tracking-wide text-base md:text-xl hover:text-[#6ea7f1] transition-colors duration-300 hidden md:block"
            >
              Конвертер валют
            </Link>
          )}
          {location.pathname !== "/" && (
            <Link
              to="/"
              className="md:hidden"
            >
              <FontAwesomeIcon icon={faExchangeAlt} className="text-xl sm:text-2xl" />
            </Link>
          )}
          {location.pathname !== "/list" && (
            <Link
              to="/list"
              className="font-bold tracking-wide text-base md:text-xl hover:text-[#6ea7f1] transition-colors duration-300 hidden md:block"
            >
              Список валют
            </Link>
          )}
          {location.pathname !== "/list" && (
            <Link
              to="/list"
              className="md:hidden"
            >
              <FontAwesomeIcon icon={faList} className="text-xl sm:text-2xl" />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
