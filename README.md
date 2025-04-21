# Api Redis Mandalorian

Una aplicacion de alquiler de capítulos de la serie The Mandalorian con backend en Node.js/Redis y frontend en React. Permite:

- Listar capitulos: muestra todos los capitulos de las temporadas indicando su estado: disponible, reservado o alquilado.

- Reservas temporales: al solicitar un alquiler, el capitulo queda reservado por 4 minutos para confirmar el pago; si no se confirma vuelve a estar disponible.

- Confirmacion de pago: ruta backend que recibe el número de capitulo y precio, registra el alquiler por 24 horas una vez confirmado.

## Para correr de manera local

#### 1. Clonar el repositorio
```ts
https://github.com/patriciogagietta/redis-capitulos-mandalorian.git
```

#### 2. Ir a la ruta del proyecto
```ts
cd redis-capitulos-mandalorian
```

#### 3. Ir a la ruta del backend, instalar las dependencias y correr el servidor
```ts
cd back
npm install
node insdex.js
```

#### 4. Ir a la ruta del frontend, instalar las dependencias y correr el servidor
```ts
cd ../front
npm install
npm run dev
```

- El backend estara disponible en http://localhost:3000/capitulos

- El frontend estara disponible en http://localhost:5173

## Para correr el proyecto con docker

#### 1. Tener Docker y Docker Compose instalados

#### 2. Desde la raiz del proyecto, construir los contenedores y levantarlos de la siguiente manera

```ts
docker compose build
docker compose up
```

Esto iniciara:

- El backend en el puerto 3000

- El frontend en el puerto 5173

- Redis en el puerto 6379