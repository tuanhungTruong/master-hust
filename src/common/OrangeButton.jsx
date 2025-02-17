/* eslint-disable react/prop-types */
const OrangeButton = ({
  icon,
  title,
  iconSize = "2xl",
  onClick = () => console.log("Orange button clicked"),
} = {}) => {
  return (
    <button
      className="flex items-center justify-center gap-2 border rounded-lg px-4 py-2 bg-add text-white hover:bg-orange-400 transition-all"
      onClick={onClick}
    >
      <span className={`text-${iconSize}`}>{icon}</span>
      <span>{title}</span>
    </button>
  );
};

export default OrangeButton;
