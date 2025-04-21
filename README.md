# 🌩️ Cloud‑Native ADMM‑VRP Optimization Integrating Edge AI for Sustainable Real‑Time Supply Chains

A hyperconverged, ADMM‑VRP syncretic framework enabling real‑time, edge‑augmented, zero‑trust logistics optimization via convex‑relaxed submodular decomposition under Kubernetes‑native microservice orchestration—maximizing allocative Pareto‑efficiency while minimizing thermodynamic externalities. :contentReference[oaicite:0]{index=0}

---

## 📚 Description

This project demonstrates a cloud‑native approach to solving the Vehicle Routing Problem (VRP) using the Alternating Direction Method of Multipliers (ADMM), augmented with real‑time Edge AI inference. It’s built as a set of Kubernetes‑orchestrated microservices with a modern Next.js dashboard for visualization and control.

---

## 🌟 Key Features

- **Distributed ADMM‑VRP Solver**  
  Convex‑relaxed submodular decomposition for scalable route optimization.  
- **Edge AI Integration**  
  On‑device inference nodes adjust routes in real time based on live telemetry.  
- **Zero‑Trust Security**  
  mTLS and service mesh ensure secure cloud‑to‑edge communication.  
- **Kubernetes Orchestration**  
  Helm charts and auto‑scaling for resilience and performance.  
- **Next.js Dashboard**  
  Component‑driven UI with server‑side rendering and static export.  
- **GitOps CI/CD**  
  GitHub Actions for build, test, and Kubernetes deployments.  
- **Monitoring & Observability**  
  Integrated Prometheus metrics and Grafana dashboards.  

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TypeScript  
- **Styling:** Tailwind CSS, PostCSS  
- **Backend/API:** Next.js API Routes (Node.js)  
- **Optimization Engine:** Python (CVXPY, NumPy) served via gRPC  
- **Edge AI:** TensorFlow.js / ONNX Runtime  
- **Containerization:** Docker, Docker Compose  
- **Orchestration:** Kubernetes, Helm  
- **Messaging:** gRPC, MQTT  
- **CI/CD:** GitHub Actions  
- **Monitoring:** Prometheus, Grafana  
- **Database & Cache:** PostgreSQL, Redis  

---

## 🗂️ Project Structure

```plaintext
.
├── components/           # Reusable React UI components
├── services/             # Microservices
│   ├── optimizer/        # ADMM‑VRP solver service (Python)
│   └── edge-node/        # Edge AI inference service
├── prisma/               # Prisma schema & migrations
├── public/               # Static assets
├── src/
│   ├── pages/            # Next.js pages & API routes
│   ├── lib/              # Utility functions & API clients
│   └── styles/           # Tailwind CSS imports
├── helm/                 # Helm charts for k8s deployment
├── k8s/                  # Kubernetes manifests
├── .github/              # GitHub Actions workflows
├── Dockerfile            # UI container definition
├── docker-compose.yml    # Local orchestration
├── package.json          # UI dependencies & scripts
├── requirements.txt      # Python service dependencies
├── tailwind.config.ts    # Tailwind configuration
└── tsconfig.json         # TypeScript configuration
