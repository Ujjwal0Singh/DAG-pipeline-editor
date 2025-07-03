# React Pipeline Editor (DAG Builder)

![Pipeline Editor Demo](demo-screenshot.png)

A visual editor for creating and managing Directed Acyclic Graphs (DAGs) built with React and ReactFlow. Perfect for data pipeline visualization, workflow automation, and process modeling.

## 🚀 Live Demo

[![View Demo](https://img.shields.io/badge/Demo-Vercel-green)](https://your-vercel-app-url.vercel.app)  
*Hosted on Vercel*

## ✨ Features

- **Visual Node Editing**: Drag-and-drop interface
- **Smart Connections**: Direction-aware edge creation
- **Context Menu**: Right-click nodes for quick actions
- **DAG Validation**: Real-time cycle detection
- **Auto-Layout**: Clean organization with Dagre.js
- **Keyboard Shortcuts**: Quick actions (A=Add, L=Layout, etc.)

## 🛠️ Setup

### Prerequisites
- Node.js (v16+)
- npm/yarn

### Installation
```bash
### Clone the repository
git clone https://github.com/your-username/pipeline-editor.git
cd pipeline-editor

# Install dependencies
npm install

# Start development server
npm run dev

Build for Production
npm run build
npm run preview

🏗️ Architecture
Key Libraries
Library	         Purpose
ReactFlow	       Interactive node-based UI
Dagre	           Auto-layout algorithms
React Icons	     Toolbar and menu icons

Folder Structure

src/
├── components/    # React components
├── hooks/         # Custom hooks
├── utils/         # Utility functions
└── styles/        # CSS modules


Workflow Demo
https://dag-pipeline-editor-eight.vercel.app/

🚧 Challenges & Solutions
Challenge	                                    Solution
Connection Direction Rules	             Implemented handle validation with isValidConnection
Dynamic Node Context Menu	                Used React portals + absolute positioning
Performance with Many Nodes	             Virtualization with ReactFlow's render optimizations
Complex State Management	                  Combined useNodesState with custom reducers







