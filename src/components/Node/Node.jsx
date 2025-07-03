import { Handle, Position } from 'reactflow';
import './Node.css';

const Node = ({ id, data, selected }) => {
  return (
    <div className={`pipeline-node ${selected ? 'selected' : ''}`}>
      <div className="node-header">
        <span className="node-title">{data.label}</span>
      </div>
      
      <Handle 
        type="target" 
        position={Position.Left} 
        className="connection-handle incoming" 
      />
      
      <Handle 
        type="source" 
        position={Position.Right} 
        className="connection-handle outgoing" 
      />
      
      <div className="node-body">
        <div className="node-type-badge">{data.type || 'process'}</div>
      </div>
    </div>
  );
};

export default Node;