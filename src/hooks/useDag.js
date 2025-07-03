import { useCallback, useRef } from 'react';
import { addEdge, MarkerType } from 'reactflow';

export default function useDag({
  nodes,
  edges,
  setNodes,
  setEdges,
  setConnectionStatus,
}) {
  const connectionNodeId = useRef(null);
  const connectionHandleType = useRef(null);

  // Adding a new node to the flow
  const addNode = useCallback(() => {
    const label = prompt('Enter node name', `Node ${nodes.length + 1}`);
    if (!label) return;

    const newNode = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      data: { label },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [nodes.length, setNodes]);

  // Handling connection start
  const onConnectStart = useCallback((event, { nodeId, handleType }) => {
    connectionNodeId.current = nodeId;
    connectionHandleType.current = handleType;
    
    if (handleType === 'source') {
      setConnectionStatus('Drag to target handle of another node');
    } else {
      setConnectionStatus('Cannot connect from target handle');
    }
  }, [setConnectionStatus]);

  // Handling connection end (create edge)
  const onConnect = useCallback(
    (params) => {
      // Resetting connection status
      setConnectionStatus(null);
      
      // Only allowing source -> target connections
      if (params.sourceHandle === 'target' || params.targetHandle === 'source') {
        return;
      }
      
      // No self-connections
      if (params.source === params.target) {
        return;
      }
      
      // Checking if connection already exists
      const connectionExists = edges.some(
        (edge) => edge.source === params.source && edge.target === params.target
      );
      
      if (connectionExists) {
        return;
      }
      
      setEdges((eds) => addEdge({
        ...params,
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#555',
        },
        animated: true,
      }, eds));
    },
    [edges, setEdges, setConnectionStatus]
  );

  // Handling connection end (mouse up)
  const onConnectEnd = useCallback(() => {
    setConnectionStatus(null);
  }, [setConnectionStatus]);

  // Handling connection stop (mouse leave)
  const onConnectStop = useCallback(() => {
    setConnectionStatus(null);
  }, [setConnectionStatus]);

  // Deleting selected nodes and edges
  const deleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => {
        // Also removing edges connected to deleted nodes
        const nodesToKeep = nodes.filter(node => !node.selected);
        const nodeIdsToKeep = new Set(nodesToKeep.map(n => n.id));
        return nodeIdsToKeep.has(edge.source) && nodeIdsToKeep.has(edge.target);
    }));
  }, [nodes, setNodes, setEdges]);

  

  return {
    onConnect,
    onConnectStart,
    onConnectEnd,
    onConnectStop,
    deleteSelected,
    addNode,
  };
}