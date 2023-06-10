# Diario de viajes

-   Se trata de una web donde los usuarios publican entradas sobre viajes.

-   Cada entrada tiene título, descripción, lugar y hasta 3 fotos asignadas.

-   Cada entrada puede ser votada con una puntuación entre 1 y 5.

## Base de datos

-   **`users:`** id, email`*`, password`*`, username`*`, avatar, role ("admin", "normal"), active, registrationCode, createdAt, modifiedAt.

-   **`entries:`** id, title`*`, place`*`, description`*`, idUser, createdAt.

-   **`entryPhotos:`** id, name, idEntry, createdAt.

-   **`entryVotes:`** id, value`*`, idEntry, idUser, createdAt.

## Endpoints del usuario

-   **POST** - [`/users`] - Crea un usuario pendiente de validar y se envía un correo de verificación. ✅
-   **PUT** - [`/users/validate/:registerCode`] - Valida a un usuario recién registrado. ✅
-   **POST** - [`/users/login`] - Logea a un usuario retornando un token. ✅
-   **GET** - [`/users/:idUser`] - Retorna información de un usuario. ➡️ `Token` ✅
-   **PUT** - [`/users/avatar`] - Permite actualizar el avatar del usuario. ➡️ `Token` ✅
-   **PUT** - [`/users/password/recover`] - Envía al usuario un correo de recuperación de contraseña. ✅
-   **PUT** - [`/users/password`] - Resetea la contraseña de un usuario. ✅

## Endpoints del diario

-   **POST** - [`/entries`] - Crea una entrada. ➡️ `Token` ✅
-   **GET** - [`/entries`] - Retorna el listado de entradas. ✅
-   **GET** - [`/entries/:idEntry`] - Retorna una entrada en concreto. ✅
-   **POST** - [`/entries/:idEntry/votes`] - Vota una entrada (entre 1 y 5). ➡️ `Token` ✅
-   **POST** - [`/entries/:idEntry/photos`] - Agregar una foto a una entrada. ➡️ `Token` ✅
-   **DELETE** - [`/entries/:idEntry/photos/:idPhoto`] - Eliminar una foto de una entrada. ➡️ `Token` ✅
