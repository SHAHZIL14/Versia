const Container = ({ children }) => {
  return <div className="w-screen [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']  flex lg:relative   flex-col lg:h-auto  items-center justify-center bg-whte transition-colors duration-300 dark:bg-[var(--dark-bg)]   mx-auto px-0 py-0">{children}</div>;
};

export default Container;
