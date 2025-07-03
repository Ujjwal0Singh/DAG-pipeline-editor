import { FiEdit, FiTrash2, FiCopy, FiLink } from 'react-icons/fi';
import './ContextMenu.css';

const ContextMenu = ({ 
  node, 
  position, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onStartConnect,
  onClose 
}) => {
  const handleAction = (action) => {
    action();
    onClose();
  };

  return (
    <div 
      className="context-menu" 
      style={{ top: position.y, left: position.x }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="context-menu-header">
        Node: {node?.data?.label || 'Untitled'}
      </div>
      
      <div className="context-menu-item" onClick={() => handleAction(onEdit)}>
        <FiEdit className="context-menu-icon" /> Edit
      </div>
      
      <div className="context-menu-item" onClick={() => handleAction(onDuplicate)}>
        <FiCopy className="context-menu-icon" /> Duplicate
      </div>
      
      <div className="context-menu-item" onClick={() => handleAction(onStartConnect)}>
        <FiLink className="context-menu-icon" /> Connect
      </div>
      
      <div className="context-menu-item danger" onClick={() => handleAction(onDelete)}>
        <FiTrash2 className="context-menu-icon" /> Delete
      </div>
    </div>
  );
};

export default ContextMenu;