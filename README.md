# AdoptMe Backend

API REST para la gestión de usuarios, mascotas y adopciones. Desarrollada con Node.js, Express y MongoDB.

## Tecnologías utilizadas

* Node.js
* Express
* MongoDB y Mongoose
* Swagger
* Mocha, Chai y Supertest
* Docker

## Instalación local

1. Clonar o descargar el proyecto.
2. Instalar las dependencias:

```bash
npm install
```

3. Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
MONGO_URL=<cadena_de_conexion_de_mongodb_atlas>
MONGO_URL_TEST=<cadena_de_conexion_para_pruebas>
PORT=8080
```

4. Iniciar la aplicación:

```bash
npm start
```

La documentación Swagger estará disponible en:

```text
http://localhost:8080/apidocs
```

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

Ejecuta los tests funcionales del router de adopciones.

## Endpoints de adopciones

| Método | Endpoint                   | Descripción                                         |
| ------ | -------------------------- | --------------------------------------------------- |
| GET    | `/api/adoptions`           | Obtiene todas las adopciones.                       |
| GET    | `/api/adoptions/:aid`      | Obtiene una adopción por su identificador.          |
| POST   | `/api/adoptions/:uid/:pid` | Registra la adopción de una mascota por un usuario. |

## Tests funcionales

Los tests cubren los casos exitosos y de error del router `adoption.router.js`, incluyendo:

* Obtener adopciones.
* Obtener una adopción existente o inexistente.
* Intentar adoptar con un usuario inexistente.
* Intentar adoptar una mascota inexistente.
* Evitar adoptar una mascota que ya fue adoptada.
* Crear una adopción correctamente.

Para ejecutarlos:

```bash
npm test
```

## Docker

La imagen pública del proyecto se encuentra en Docker Hub:

[josegrt/adoptme-backend](https://hub.docker.com/r/josegrt/adoptme-backend)

### Descargar la imagen

```bash
docker pull josegrt/adoptme-backend:1.0
```

### Ejecutar el contenedor

Crear previamente el archivo `.env` con la variable `MONGO_URL` y ejecutar:

```bash
docker run -p 8080:8080 --env-file .env josegrt/adoptme-backend:1.0
```

La aplicación quedará disponible en:

```text
http://localhost:8080/apidocs
```

## Deploy

La documentación pública de la aplicación se encuentra disponible en:

[Swagger - AdoptMe](https://adoptme-final.onrender.com/apidocs)