import { useEffect } from 'react';

export default function useKeyboardShortcuts({
  addNode,
  deleteSelected,
  handleAutoLayout,
  handleSave,
  toggleHelp
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Preventing default for all shortcut keys
      if (e.key === 'Delete') {
        e.preventDefault();
        deleteSelected();
      } else if (e.key === 'a' && !e.ctrlKey) {
        e.preventDefault();
        addNode();
      } else if (e.key === 'l' && !e.ctrlKey) {
        e.preventDefault();
        handleAutoLayout();
      } else if (e.key === 's' && e.ctrlKey) {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'h') {
        e.preventDefault();
        toggleHelp?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addNode, deleteSelected, handleAutoLayout, handleSave, toggleHelp]);
}