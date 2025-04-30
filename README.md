# GESTOR DE PROYECTOS
# 📁 Estructura del Proyecto — Arquitectura Hexagonal

Este proyecto sigue una arquitectura hexagonal (también conocida como "puertos y adaptadores"), lo que permite mantener una separación clara entre la lógica de negocio (dominio) y las tecnologías/frameworks utilizados (infraestructura).

---

## 🧠 Dominios Hexagonales

Cada entidad principal (`Staff`, `Task`, `Project`, `TaskStaff`, `Messages`) ha sido migrada siguiendo la estructura hexagonal:

```
src/
│
├── staff/
│   ├── application/
│   │   └── use-cases/
│   ├── domain/
│   │   ├── entities/
│   │   ├── interfaces/
│   │   └── ports/
│   ├── infrastructure/
│   │   ├── controllers/
│   │   ├── dto/
│   │   ├── mappers/
│   │   └── persistence/
│   └── staff.module.ts
```

---

## 🧩 Carpeta `infrastructure/`

Contiene módulos de integración que no pertenecen a un dominio específico, pero que conectan con servicios externos o tareas técnicas:

```
src/infrastructure/
├── mail/         # Envío de correos (MailerModule + MailService)
├── minio/        # Servicio de subida/lectura de archivos a MinIO
├── scheduler/    # Tareas programadas con ScheduleModule
```

---

## 🔐 Módulos transversales

Estos módulos aplican a toda la app, por lo tanto permanecen en la raíz:

- `auth/` → Autenticación con JWT y validación de usuarios.
- `casl/` → Sistema de permisos basado en roles con CASL.
- `migrations/` → Archivos de migraciones con TypeORM.

---

## 🛠 Configuración global

- `.env` → Variables de entorno para la app.
- `AppModule` → Importa todos los módulos e inicializa servicios globales.
- `main.ts` → Punto de entrada del servidor NestJS.

---

## 📌 Notas

- Las dependencias entre capas siempre van del exterior hacia el dominio (nunca al revés).
- El dominio es completamente independiente de cualquier librería o framework.

---

💡 Esta estructura permite escalar y mantener el código más limpio, desacoplado y testeable.
