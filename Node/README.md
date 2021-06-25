# HACK NEWS 

-- Se trata de una página web donde los usuarios publican noticias

-- Cada noticia tiene un titulo, entradilla, descripción, lugar, tema y hasta 3 fotos.

-- Cada usuario registrado puede, calificar una noticia y comentar en la noticia.

## EndPoints de noticias 
- **GET**    - [/entries] - Retorna el listado de las noticias.
- **GET**    - [/entries/:idEntry] - Retorna una noticia en concreto.
- **POST**   - [/entries] - Crea una noticia nueva.
- **POST**   - [/entries/:idEntry/photos] - Añade una imagen a la noticia.
- **POST**   - [/entries/:idEntry/votes] - Califica una noticia.
- **POST**   - [/entries/:idEntry/report] - Reporta una noticia. 
- **POST**   - [/entries/:idEntry/coment] - Comentarios de la noticia.
- **PUT**    - [/entries/:idEntry] - Edita la noticia.
- **DELETE** - [/entries/:idEntry] - Borra una noticia.
- **DELETE** - [/entries/:idEntry/photos/:idPhoto] - Elimina una foto de una noticia.   

## EndPoints de usuarios
- **GET**    - [/users/:idUser] - Retorna información de un usuario en concreto. ✅
- **POST**   - [/users] - Crea un usuario pendiente de activar. ✅
- **GET**    - [/users/validate/:registrationCode] - Valida un usuario recién registrado. ✅
- **POST**   - [/users/login] - Logea un usuario retornando un token.✅
- **PUT**    - [/users/:idUser] - Edita el nombre completo, el email, dirreción, biografía o el avatar de un usuario.✅
- **PUT**    - [/users/:idUser/password] - Edita la contraseña de un usuario.✅
- **PUT**    - [/users/password/recover] - Envia un correo con el código de reseteo de contraseña a un email.✅
- **PUT**    - [/users/password/reset] - Cambia la contraseña de un usuario.✅
- **DELETE** - [/users/:idUser] - Borra un usuario.✅




WIREFRAME - quitar publicar de la primera página.
quitar lo de publicar y ponerlo al lado del nombre de usuario.
Quitamos el buscador de la página de info del usuario.
pagina del usuario quitamos el buscador y la letra de publicar y pinchando en el logo que vaya a la página principal