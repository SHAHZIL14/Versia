import { Tooltip, Button } from "@material-tailwind/react";
const Button = ({ content, tooltip, onClickMethod, icon, color, bg }) => {
  return (
    <div className={`text-${color} bg-${bg} `}>
      <Tooltip content={tooltip} className={`capitalize font-medium z-20  `}>
        <Button
          onClick={onClickMethod}
          className="uppercase px-2 lg:p-1 text-sm cursor-pointer  active:text-white text-gray-500 hover:text-white shadow-none"
        >
          {content}
          {icon}
        </Button>
      </Tooltip>
    </div>
  );
};
export default Button;
