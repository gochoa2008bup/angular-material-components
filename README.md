Para poder instalar esta dependencia con bower desde el file system:

´´´
npm install -g filesystem-bower-resolver
´´´

Clonar el repositorio en cualquier directorio. No es necesario que este dentro de un proyecto

´´´
git clone git@github.com:FlyerDefenders/angular-material-components.git
´´´

Linkear el repositorio (https://bower.io/docs/api/#link)

Paso 1: Hacer la libreria disponible para usarla como dependencia en algun proyecto

´´´
cd angular-material-components
bower link
´´´

Paso 2: Linkear la libreria como dependencia del proyecto

´´´
cd airports-data-provider/apps/dashboard/spa
bower link angular-material-components
bower install angular-material-components
´´´