# Kubernetes MCP Server

An **MCP (Model Context Protocol) server** built with Node.js that allows Claude (or any MCP-compatible client) to interact with a Kubernetes cluster.  
The server exposes tools to scale deployments, fetch pod logs, and list Kubernetes resources.

---

## Features
- `scale-deployment` → Scale Kubernetes deployments up or down  
- `get-logs` → Retrieve logs from running pods  
- `list-resources` → List pods, services, and deployments in a namespace  

---

## Prerequisites
- **Node.js** v18+  
- A valid **Kubernetes cluster** and `kubectl` configured (`~/.kube/config` must work)  
- Claude Desktop (or another MCP-compatible client)  

---

## Installation
```bash
git clone https://github.com/ismailbohra/MCP-Server-for-Kubernetes.git
cd MCP-Server-for-Kubernetes

npm run build
npm start
