import { useState, useRef, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  ConnectionLineType,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Toolbar from './components/Toolbar/Toolbar';
import StatusPanel from './components/StatusPanel/StatusPanel';
import ContextMenu from './components/ContextMenu/ContextMenu';
import Node from './components/Node/Node';
import Edge from './components/Edge/Edge';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import { downloadJSON, loadJSON } from './utils/helpers';
import useDag from './hooks/useDag';
import { validateDag } from './utils/dagValidator';
import { layoutDag } from './utils/layout';
import './App.css';

const nodeTypes = {
  custom: Node,
};

const edgeTypes = {
  custom: Edge,
};


const PipelineEditor = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [menu, setMenu] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [validation, setValidation] = useState({ isValid: false, message: 'Add at least 2 nodes to begin' });
  
  const { fitView } = useReactFlow();
  const { 
    onConnect,
    onConnectStart,
    onConnectEnd,
    onConnectStop,
    onNodeDragStop,
    deleteSelected,
    addNode 
  } = useDag({
    nodes,
    edges,
    setNodes,
    setEdges,
    reactFlowWrapper,
    reactFlowInstance,
    setConnectionStatus,
    setValidation
  });

  // Validating DAG on changes
  useEffect(() => {
    const result = validateDag(nodes, edges);
    setValidation(result);
  }, [nodes, edges]);

  const handleNodeContextMenu = (event, node) => {
    event.preventDefault();
    setContextMenu({
      node,
      position: { x: event.clientX, y: event.clientY }
    });
  };

  const handleEditNode = () => {
    const newLabel = prompt('Edit node name', contextMenu.node.data.label);
    if (newLabel) {
      setNodes(nodes.map(n => 
        n.id === contextMenu.node.id 
          ? { ...n, data: { ...n.data, label: newLabel } } 
          : n
      ));
    }
  };

  const handleDeleteNode = () => {
    setNodes(nodes.filter(n => n.id !== contextMenu.node.id));
    setEdges(edges.filter(e => 
      e.source !== contextMenu.node.id && e.target !== contextMenu.node.id
    ));
  };


  const handleDuplicateNode = () => {
    const newNode = {
      ...contextMenu.node,
      id: `node-${Date.now()}`,
      position: {
        x: contextMenu.node.position.x + 50,
        y: contextMenu.node.position.y + 50
      },
      selected: false
    };
    setNodes([...nodes, newNode]);
  };

  const handleStartConnect = () => {
    setContextMenu(null);
    alert(`Now click on another node to connect to ${contextMenu.node.data.label}`);
  };

  // Handling auto-layout
  const handleAutoLayout = () => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = layoutDag(nodes, edges);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    
    window.requestAnimationFrame(() => {
      fitView({ padding: 0.2 });
    });
  };

  const [showHelp, setShowHelp] = useState(false);

  const handleSave = () => {
    downloadJSON({ nodes, edges }, `pipeline-${new Date().toISOString().slice(0, 10)}.json`);
  };

  useKeyboardShortcuts({
    toggleHelp: () => setShowHelp(!showHelp)
  });
  const handleLoad = () => {
    loadJSON((data) => {
      if (data.nodes && data.edges) {
        setNodes(data.nodes);
        setEdges(data.edges);
      } else {
        alert('Invalid pipeline file');
      }
    });
  };

  return (
    <div className="pipeline-editor" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onConnectStop={onConnectStop}
        onNodeDragStop={onNodeDragStop}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        onNodeContextMenu={handleNodeContextMenu}
        onPaneClick={() => setContextMenu(null)}
        onClick={() => setContextMenu(null)}
        fitView
        connectionMode="strict"
        connectionLineStyle={{ stroke: '#555', strokeWidth: 2 }}
        connectionLineType={ConnectionLineType.SmoothStep}
        snapToGrid={true}
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          type: 'custom', // Using our custom edge type
          markerEnd: {
            type: 'arrowclosed',
            width: 20,
            height: 20,
            color: '#555',
          },
          style: { strokeWidth: 2 },
        }}
      >
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>

      <Toolbar 
        onAddNode={addNode} 
        onAutoLayout={handleAutoLayout} 
        onDeleteSelected={deleteSelected}
        onSave={handleSave} 
        onLoad={handleLoad}
        onHelp={() => setShowHelp(true)}
      />
      
      <StatusPanel 
        isValid={validation.isValid} 
        message={validation.message} 
        connectionStatus={connectionStatus}
      />

      {contextMenu && (
        <ContextMenu
          node={contextMenu.node}
          position={contextMenu.position}
          onEdit={handleEditNode}
          onDelete={handleDeleteNode}
          onDuplicate={handleDuplicateNode}
          onStartConnect={handleStartConnect}
          onClose={() => setContextMenu(null)}
        />
      )}
      {menu && <ContextMenu {...menu} onClose={() => setMenu(null)} />}
      {showHelp && (
        <div className="help-modal">
          <div className="help-content">
            <h2 className="help-title">Pipeline Editor Help</h2>
            
            {/* Basic Controls Section */}
            <div className="help-section">
              <h3 className="help-section-title">🛠️ Basic Controls</h3>
              <div className="help-table-container">
                <table className="help-table">
                  <thead>
                    <tr>
                      <th>Control</th>
                      <th>Action</th>
                      <th>Shortcut</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Add Node</strong></td>
                      <td>Creates a new processing step</td>
                      <td><kbd>A</kbd></td>
                    </tr>
                    <tr>
                      <td><strong>Connect Nodes</strong></td>
                      <td>Drag from output (right) to input (left)</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td><strong>Delete Selection</strong></td>
                      <td>Removes selected nodes/edges</td>
                      <td><kbd>Delete</kbd></td>
                    </tr>
                    <tr>
                      <td><strong>Auto-Layout</strong></td>
                      <td>Automatically arranges nodes</td>
                      <td><kbd>L</kbd></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Connection Rules Section */}
            <div className="help-section">
              <h3 className="help-section-title">🔑 Connection Rules</h3>
              <div className="help-grid">
                <div className="help-valid">
                  <h4>✔ Valid connections must:</h4>
                  <ul>
                    <li>Flow from <strong>output (right) → input (left)</strong></li>
                    <li>Have <strong>no cycles</strong> (one-directional)</li>
                    <li><strong>No self-loops</strong> (node can't connect to itself)</li>
                  </ul>
                </div>
                <div className="help-invalid">
                  <h4>❌ Invalid Examples:</h4>
                  <div className="connection-examples">
                    <div className="invalid-example">
                      <span>A → A</span>
                      <small>Self-connection</small>
                    </div>
                    <div className="invalid-example">
                      <span>A → B → C → A</span>
                      <small>Cycle</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Tips Section */}
            <div className="help-section">
              <h3 className="help-section-title">💡 Pro Tips</h3>
              <div className="tips-grid">
                <div className="tip-card">
                  <div className="tip-icon">🖱️</div>
                  <p><strong>Right-click nodes</strong> for quick actions</p>
                </div>
                <div className="tip-card">
                  <div className="tip-icon">⭐</div>
                  <p><strong>Color indicators:</strong><br/>
                    <span className="color-sample red"></span> Invalid connection<br/>
                    <span className="color-sample green"></span> Valid connection
                  </p>
                </div>
                <div className="tip-card">
                  <div className="tip-icon">⌨️</div>
                  <p>Press <kbd>H</kbd> anytime to toggle help</p>
                </div>
              </div>
            </div>

            {/* Keyboard Shortcuts Section */}
            <div className="help-section">
              <h3 className="help-section-title">⌨️ All Keyboard Shortcuts</h3>
              <div className="shortcuts-grid">
                {[
                  { key: 'A', action: 'Add node' },
                  { key: 'Delete', action: 'Delete selection' },
                  { key: 'L', action: 'Auto-layout' },
                  { key: 'Ctrl+S', action: 'Save pipeline' },
                  { key: 'H', action: 'Toggle help' },
                  { key: 'Esc', action: 'Clear selection' }
                ].map((shortcut) => (
                  <div key={shortcut.key} className="shortcut-card">
                    <kbd>{shortcut.key}</kbd>
                    <span>{shortcut.action}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              className="help-close-button"
              onClick={() => setShowHelp(false)}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => (
  <ReactFlowProvider>
    <PipelineEditor />
  </ReactFlowProvider>
);

export default App;
