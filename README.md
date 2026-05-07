# Sistema de Gestión Documental (SGD) - Asamblea Legislativa

Aplicación web escalable, robusta y ágil para la gestión de documentos y flujos de aprobación dentro de la Asamblea Legislativa.

## 🎯 Características Principales

- ✅ **Gestión de Documentos**: Carga, almacenamiento y descarga segura de archivos
- ✅ **Flujos de Aprobación**: Workflows configurables y trazables
- ✅ **Control de Acceso**: RBAC (Role-Based Access Control)
- ✅ **Auditoría Completa**: Logs de todas las acciones
- ✅ **Notificaciones**: Email automáticas
- ✅ **Integraciones Externas**: API REST para terceros
- ✅ **Búsqueda Avanzada**: Full-text search de documentos
- ✅ **Versionado**: Control de versiones de documentos

## 📋 Stack Tecnológico

| Componente | Tecnología |
|-----------|-----------|
| **Backend** | Node.js + Express.js |
| **Frontend** | React + Redux |
| **Base de Datos** | PostgreSQL |
| **Almacenamiento** | Local (pruebas) / S3 (producción) |
| **Autenticación** | JWT + OAuth2 |
| **Cache** | Redis |
| **Containerización** | Docker + Docker Compose |

## 🚀 Instalación Rápida

### Requisitos Previos
- Node.js >= 16.0.0
- PostgreSQL >= 12
- Redis >= 6
- Docker & Docker Compose (opcional)

### Con Docker Compose (Recomendado)
```bash
git clone https://github.com/jona1102cm/sgd-asamblea.git
cd sgd-asamblea
docker-compose up -d
```

### Instalación Manual

#### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edita .env con tus variables
npm run migrate
npm run seed
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

## 📚 Documentación

- [API Reference](./docs/API.md)
- [Arquitectura](./docs/ARCHITECTURE.md)
- [Guía de Deployment](./docs/DEPLOYMENT.md)
- [Contribución](./CONTRIBUTING.md)

## 📁 Estructura del Proyecto

```
sgd-asamblea/
├── backend/                    # API REST (Node.js + Express)
├── frontend/                   # Interfaz de usuario (React)
├── docker/                     # Configuración Docker
├── docs/                       # Documentación
└── README.md
```

## 🔧 Variables de Entorno

Consulta `.env.example` en backend y frontend para ver todas las variables disponibles.

## 📊 Fases de Desarrollo

- **Fase 1**: MVP (Autenticación, CRUD documentos, flujos básicos)
- **Fase 2**: Funcionalidades avanzadas (Búsqueda, versionado, auditoría)
- **Fase 3**: Escalabilidad y optimización

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 🤝 Contribución

Por favor lee [CONTRIBUTING.md](./CONTRIBUTING.md) para más detalles.

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

**jona1102cm** - 2026

---

**Última actualización**: 2026-05-07
