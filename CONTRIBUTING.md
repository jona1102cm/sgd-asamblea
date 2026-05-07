# Guía de Contribución

¡Gracias por tu interés en contribuir a este proyecto!

## Normas de Colaboración

### 1. Ramas
- `main`: Código en producción
- `development`: Rama de desarrollo
- Feature branches: `feature/nombre-feature`
- Bugfix branches: `bugfix/nombre-bug`

### 2. Commits
- Usar mensajes descriptivos en español o inglés
- Formato: `[tipo] Descripción` 
- Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Ejemplo:**
```
feat: Agregar búsqueda de documentos
fix: Corregir validación de formulario
docs: Actualizar API documentation
```

### 3. Pull Requests
- Describir cambios claramente
- Referenciar issues relacionados (#123)
- Pasar todos los tests antes de mergear
- Al menos 1 review antes de merge

### 4. Código
- Seguir ESLint config del proyecto
- Indentación: 2 espacios
- Usar camelCase para variables/funciones
- PascalCase para clases/componentes
- Comentar código complejo

### 5. Testing
- Escribir tests para nuevas funcionalidades
- Cobertura mínima: 80%
- Tests deben pasar antes de PR

## Setup Local

```bash
git clone https://github.com/jona1102cm/sgd-asamblea.git
cd sgd-asamblea
git checkout -b feature/tu-feature

# Backend
cd backend
npm install
npm run dev

# Frontend (otra terminal)
cd frontend
npm install
npm start
```

## Reporte de Bugs

1. Verifica si el bug ya está reportado
2. Crea un issue con:
   - Título descriptivo
   - Descripción clara
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si es necesario

## Solicitar Nuevas Funcionalidades

1. Crea un issue con `enhancement` label
2. Describe la funcionalidad
3. Explica por qué es útil
4. Proporciona ejemplos de uso

## Proceso de Review

Todos los PRs serán revisados por al menos un mantenedor. 

Se puede solicitar cambios si:
- No pasan los tests
- No sigue el estilo de código
- Falta documentación
- Hay problemas de seguridad

## Licencia

Al contribuir, aceptas que tu código se distribuye bajo la Licencia MIT.

---

¡Gracias por tu contribución! 🎉
