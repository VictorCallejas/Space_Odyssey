# Space_Odyssey

Equipo:

- Victor Callejas Fuentes
-Juan Robles Gomez

Repositorio del hackathon NASA Spaceapps 2018

Sentimos las molestias pero el peso de nuestra solución es demasiado grande como para ser descargado y subido a git en el tiempo pedidio con el internet del que disponemos ahora mismo por lo que pedimos su comprension y les adjuntamos un link a google drive.

https://drive.google.com/open?id=1ewcpVaEvO49XErPz562Y6xIObY3fj4I7

Explicacion archivos

- Spaceapps => export de la plataforma de dialogflow (Si nos lo piden le facilitamos acceso por usuario y contraseña, mucho mas facil de entender)
- neural-style => codigo que ejecutamos en GCE para la creacion de nuevas obras de arte, a partir de una foto y otra de la libreria de la NASA. Reto: Nasa Artify the earth. Futura implementacion para conseguir imagenes desde el bot.
- images => resultado y fotos que se usaron en neural-style
- firebaseFulfillment => codigo que complementa muchos de los intents. Mucha parte de el se ha comentado ya que esta a medio desarrollar por el corto tiempo del que se dispone en el hackathon o para evitar problemas durante la demostracion de la presentacion.


Arquitectura global y sostenible de la solucion

https://drive.google.com/open?id=1Tqsh5AWMW_Vqpm8HqBB6M2Kdiy2p6oKa

Bases de datos en firebase

https://drive.google.com/open?id=1Y4WEdIAlo3sItqXxTkRzV7aoJWNEwNVB
https://drive.google.com/open?id=17m7iKwY4r759AY80i9JRFqW4ri2Yb8BI

Captura de la instancia en GCE(instancia encargada del deepart)

https://drive.google.com/open?id=1oxtPoAn-PJx8N5mkdspnC0kTMQB0qnNc

IMPORTANTE: La arquitectura a utilizar esta indicada y de las bases de datos en firebase, entre otras cosas. Hemos tenido que comentar mucho codigo y cambiar la implementación de ciertos aspectos, por la imposibilidad de desarrollar una solucion como tal en tan poco tiempo y con el fin de tener una demostracion funcional de cara a la presentacion. Gracias.
