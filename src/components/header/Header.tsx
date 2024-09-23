import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className=" bg-[#2584ff] text-white fixed w-full top-0 z-50 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center max-w-4xl pr-6 pl-6">
        <h1 className="text-xl md:text-2xl font-semibold">
          Сервис конвертации валют
        </h1>
        <nav className="flex space-x-4">
          <Link
            to="/"
            className="text-sm md:text-base hover:text-gray-200 transition-colors duration-300"
          >
            Конвертор валют
          </Link>
          <Link
            to="/list"
            className="text-sm md:text-base hover:text-gray-200 transition-colors duration-300"
          >
            Список валют
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
