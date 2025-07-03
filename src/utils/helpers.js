export function downloadJSON(data, filename = 'pipeline.json') {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function loadJSON(callback) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        callback(data);
      } catch (err) {
        alert('Error parsing JSON file');
      }
    };
    
    reader.readAsText(file);
  };
  
  input.click();
}

export const validatePipelineData = (data) => {
  return data && Array.isArray(data.nodes) && Array.isArray(data.edges);
};
