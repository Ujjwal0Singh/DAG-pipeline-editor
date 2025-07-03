import { FiPlus, FiTrash2, FiLayout, FiSave, FiUpload, FiHelpCircle} from 'react-icons/fi';
import Tooltip from '../Tooltip/Tooltip';
import './Toolbar.css';

const Toolbar = ({ onAddNode, onAutoLayout, onDeleteSelected, onSave, onLoad, onHelp }) => {
  return (
    <div className="toolbar">
      <Tooltip text="Add Node (A)">
        <button 
          className="toolbar-button" 
          onClick={onAddNode}
        >
          <FiPlus /> Add Node
        </button>
      </Tooltip>

      <Tooltip text="Delete Selected (Delete)">
        <button 
          className="toolbar-button" 
          onClick={onDeleteSelected}
        >
          <FiTrash2 /> Delete
        </button>
      </Tooltip>

      <Tooltip text="Auto Layout (L)">
        <button 
          className="toolbar-button" 
          onClick={onAutoLayout}
        >
          <FiLayout /> Layout
        </button>
      </Tooltip>

      <div className="toolbar-separator"></div>

      <Tooltip text="Save Pipeline (Ctrl+S)">
        <button 
          className="toolbar-button" 
          onClick={onSave}
        >
          <FiSave /> Save
        </button>
      </Tooltip>

      <Tooltip text="Load Pipeline">
        <button 
          className="toolbar-button" 
          onClick={onLoad}
        >
          <FiUpload /> Load
        </button>
      </Tooltip>

      <Tooltip text="Show Help Guide(H)" position="bottom">
        <button 
          className="toolbar-button" 
          onClick={onHelp}
        >
          <FiHelpCircle /> Help
        </button>
      </Tooltip>
    </div>
  );
};

export default Toolbar;