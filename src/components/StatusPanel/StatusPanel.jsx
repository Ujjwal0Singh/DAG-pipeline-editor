import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import './StatusPanel.css';

const StatusPanel = ({ isValid, message, connectionStatus }) => {
  return (
    <div className={`status-panel ${isValid ? 'valid' : 'invalid'}`}>
      <div className="status-icon">
        {isValid ? <FiCheckCircle /> : <FiAlertCircle />}
      </div>
      <div className="status-message">
        {message}
        {connectionStatus && (
          <div className="connection-status">{connectionStatus}</div>
        )}
      </div>
    </div>
  );
};

export default StatusPanel;