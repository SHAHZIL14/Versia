const Container = ({ children }) => {
  return <div className="w-screen [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']  flex lg:relative   flex-col lg:h-auto  items-center justify-center bg-white  mx-auto px-0 py-0">{children}</div>;
};

export default Container;
