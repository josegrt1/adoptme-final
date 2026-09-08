# AdoptMe Backend

API REST para la gestión de usuarios, mascotas y adopciones. Desarrollada con Node.js, Express y MongoDB.

## Repositorio

[GitHub - AdoptMe Backend](https://github.com/josegrt1/adoptme-final)

## Tecnologías utilizadas

* Node.js
* Express
* MongoDB y Mongoose
* Swagger
* Mocha, Chai y Supertest
* Docker

## Instalación local

1. Clonar el repositorio.

```bash
git clone https://github.com/josegrt1/adoptme-final.git
cd adoptme-final
```

2. Instalar dependencias.

```bash
npm install
```

3. Crear un archivo `.env` en la raíz del proyecto.

```env
MONGO_URL=<cadena_de_conexion_de_mongodb_atlas>
MONGO_URL_TEST=<cadena_de_conexion_para_pruebas>
PORT=8080
```

4. Iniciar la aplicación.

```bash
npm start
```

La documentación Swagger local estará disponible en:

http://localhost:8080/apidocs

## Scripts disponibles

```bash
npm start
```

Inicia el servidor.

```bash
npm run dev
```

Inicia el servidor en modo desarrollo.

```bash
npm test
```

Ejecuta las pruebas unitarias y de integración.

## Endpoints de adopciones

| Método | Endpoint                   | Descripción                                         |
| ------ | -------------------------- | --------------------------------------------------- |
| GET    | `/api/adoptions`           | Obtiene todas las adopciones.                       |
| GET    | `/api/adoptions/:aid`      | Obtiene una adopción por su identificador.          |
| POST   | `/api/adoptions/:uid/:pid` | Registra la adopción de una mascota por un usuario. |

## Tests

El proyecto incluye:

* Pruebas unitarias para `UserRepository` mediante un DAO simulado.
* Pruebas de integración para el DAO de usuarios usando `MONGO_URL_TEST`.
* Pruebas funcionales para todos los endpoints de `adoption.router.js`.

Las pruebas funcionales validan:

* Obtención de todas las adopciones.
* Obtención de una adopción existente.
* Respuesta 404 para una adopción inexistente.
* Respuesta 404 para un usuario inexistente.
* Respuesta 404 para una mascota inexistente.
* Respuesta 400 al intentar adoptar una mascota ya adoptada.
* Creación correcta de una adopción.

Para ejecutarlas:

```bash
npm test
```

Resultado de la última ejecución:

```text
UserRepository
  3 passing

User DAO
  4 passing

Functional tests: adoption.router.js
  7 passing

14 passing
```

## Docker

La imagen pública se encuentra disponible en Docker Hub:

[josegrt/adoptme-backend](https://hub.docker.com/r/josegrt/adoptme-backend)

Imagen y tag:

```text
josegrt/adoptme-backend:1.0
```

### Construir la imagen localmente

```bash
docker build -t adoptme-backend:1.0 .
```

### Descargar la imagen publicada

```bash
docker pull josegrt/adoptme-backend:1.0
```

### Ejecutar el contenedor

Crear previamente un archivo `.env` con al menos la variable `MONGO_URL`.

```bash
docker run -p 8080:8080 --env-file .env josegrt/adoptme-backend:1.0
```

Salida esperada:

```text
MongoDB conectada correctamente
Listening on 8080
```

La aplicación quedará disponible en:

http://localhost:8080/apidocs

### Análisis básico de seguridad

```bash
docker scout quickview josegrt/adoptme-backend:1.0
```

Se realizó un análisis básico con Docker Scout. La imagen usa un usuario no privilegiado y una imagen base actualizada. Como parte de una mejora futura para producción, se deben revisar las vulnerabilidades reportadas por dependencias de la imagen base.

## Deploy público

La aplicación fue desplegada en Render.

[Swagger - AdoptMe](https://adoptme-final.onrender.com/apidocs)
