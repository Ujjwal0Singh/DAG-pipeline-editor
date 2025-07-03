import './Tooltip.css';

const Tooltip = ({ text, children, position = 'top' }) => {
  return (
    <div className="tooltip-container">
      {children}
      <span className={`tooltip-text tooltip-${position}`}>
        {text}
      </span>
    </div>
  );
};

export default Tooltip;