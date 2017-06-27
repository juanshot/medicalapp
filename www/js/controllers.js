angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal,EspecialidadesResource,UserService, $state,$ionicSlideBoxDelegate,$cordovaGeolocation,ionicDatePicker,ionicTimePicker,$ionicPopup,$http,$cordovaSocialSharing,uiGmapGoogleMapApi,$ionicLoading,$q, uiGmapIsReady,$timeout,$localStorage,$ImageCacheFactory,MedicosResource,$rootScope,$cordovaToast,ProvinciasResource) {


    $scope.medico = {};
    $scope.detalle = "";
   $scope.zoom = 14;
   $scope.cliente = {};
   $scope.nombre = '';
   $scope.telefono ='';
   $scope.email ='';
   $scope.provincia = {};
   $scope.ciudades = {};
   $scope.provinciasM = ProvinciasResource.query();
   console.log($scope.provinciasM);
   $scope.logout = UserService.check();
   $scope.txtBusqMapa = "";
   $scope.fecha_enviar = '';
   $scope.hora_enviar = '';
     //especialidades desde Webservice

  $scope.especialidades = EspecialidadesResource.query();

   $scope.session = {};
   $scope.selectFavorito = false;

   $scope.session.useSession = true;

   $scope.logoutInverse = !UserService.check();

   $scope.datosCliente = UserService.getData();

   $scope.citas = {};

   $scope.markerList = [];
   $scope.filtroMapa ={};

   $scope.markerListOptions = {

      icon:'img/marcador-medical.png'
   };

   this.lat = '';
   this.long = '';
   this.direccionR ='';
   $scope.direccionR = '';
   $scope.direccion_actual ='';
   $scope.muestraTab = true;
   $scope.muestraTutorial = false;



   // opciones e ventana de info

   $scope.infoWindowOptions = {
      visible: true,
    boxStyle: {
        border: "1px solid blue",
        borderRadius: "5px",

      },

      zIndex: null,
      closeBoxMargin: "2px",
      isHidden: false,
      pane: "floatPane",
      enableEventPropagation: false
 }


 //metodos para info windows


 $scope.onClick = function() {
            $scope.infoWindowOptions.visible = !$scope.infoWindowOptions.visible;
        };

  $scope.closeClick = function() {
            $scope.infoWindowOptions.visible = false;
        };


   $scope.terminarTutorial = function(){
        $scope.muestraTab = true;
         $scope.muestraTutorial = false;

   }

  // fecha de la cita solicitada
  $scope.fecha_cita = "";

  // hora cita solicitada

   $scope.cita = {};

   $scope.searchEspecialidad ="";

   // declarando loading mostrar
  $scope.show = function() {
    $ionicLoading.show({
      templateUrl: "templates/social/medicalradar.html",
      animation: 'fade-in',
    }).then(function(){

    });
  };
   // declarando loading ocultar
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){
    });
  };



  $scope.show();


   $scope.map = {
        center : {
            latitude: this.lat,
            longitude: this.long
        },
        zoom : 14,
        control : {}
    };

     $scope.marker = {
      id: 0,
      coords: {
        latitude: this.lat,
        longitude: this.long
      },
      options: {
        icon:'img/position.png'
         },

    };
     $scope.mapa = {
        center : {
            latitude: this.lat,
            longitude: this.long
        },
        zoom : 14,
        control : {}
    };

     $scope.marcador = {
      id: 0,
      coords: {
        latitude: this.lat,
        longitude: this.long
      },
      options: {
        icon:'img/position.png'
         },

    };

     $scope.circles = [
            {
                id: 1,
                center: {
                    latitude: this.lat,
                    longitude: this.long
                },
                radius: 500000,
                stroke: {
                    color: '#08B21F',
                    weight: 2,
                    opacity: 1
                },
                fill: {
                    color: '#08B21F',
                    opacity: 0.5
                },
                geodesic: true, // optional: defaults to false
                draggable: true, // optional: defaults to false
                clickable: true, // optional: defaults to true
                editable: true, // optional: defaults to false
                visible: true, // optional: defaults to true
                control: {}
            }
        ];



        $scope.title = "";

    navigator.geolocation.getCurrentPosition(function(position){




    $scope.lat  = position.coords.latitude;
      $scope.long = position.coords.longitude;
      this.lat = position.coords.latitude;
      this.long = position.coords.longitude;



      var geocoder = new google.maps.Geocoder();
      var latlng = new google.maps.LatLng(this.lat, this.long);
      var request = {
        latLng: latlng
      };
      geocoder.geocode(request, function(data, status) {

        if (status == google.maps.GeocoderStatus.OK) {
          if (data[0] != null) {

            $scope.direccionR = data[0].formatted_address;
            $scope.direccion_actual = data[0].formatted_address;

          } else {
            console.log('No hay direccion disponible');
          }
        }
      })

      //aqui defino el mapa dentro de la geo localizacion
      $scope.map = { center: { latitude: this.lat, longitude: this.long }, zoom: 14 };
      $scope.hide();
      $scope.marker = {
      id: 0,
      coords: {
        latitude: this.lat,
        longitude: this.long
      },
      options: {
        icon:'img/gemionic/position.png'
         },

    };

     $scope.circles =
            [{
                id: 1,
                center: {
                    latitude: this.lat,
                    longitude: this.long
                },
                radius: 1000,
                stroke: {
                    color: '#568ec1',
                    weight: 2,
                    opacity: 1
                },
                fill: {
                    color: '#568ec1',
                    opacity: 0.5
                },
                geodesic: true, // optional: defaults to false
                draggable: false, // optional: defaults to false
                clickable: false, // optional: defaults to true
                editable: false, // optional: defaults to false
                visible: true, // optional: defaults to true
                control: {}
            }]
        ;







         },function(err){


                    $ionicPopup.confirm({
                     title: err.message,
                     template: 'Por Favor Habilitar GPS y Presionar Ok. Si desea trabajar sin GPS Presionar Cancelar'
                   });

                   confirmPopup.then(function(res) {
                     if(res) {
                       $scope.hide();
                     } else {
                      //hola
                     }
                   });
         },{
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }  );

  uiGmapIsReady.promise().then(function(){
      //http://medicalappecuador.com/medicalnew/public/medicos_locate
    var result = $http.get('http://medicalappecuador.com/medicalnew/public/medicos_locate');
                    $ionicLoading.show({
                      template: 'Buscando Medicos...'
                    }).then(function(){
                       //console.log("");
                    });
        result.then(function(resp){
                  $ionicLoading.hide().then(function(){

                    $cordovaToast
                            .show('Medicos encontrados', 'long', 'center')
                            .then(function(success) {
                                  console.log('listo');
                            }, function (error) {
                              console.log('error');
                            });

                  });
                $scope.markerList = $scope.markerList.concat(resp.data);
        });

});

  // resetaear mapa

  $scope.resetMap = function(){

        $scope.markerList = [];
  }



 $scope.localizarme = function(){

              navigator.geolocation.getCurrentPosition(function(position){



    $scope.lat  = position.coords.latitude;
      $scope.long = position.coords.latitude;
      this.lat = position.coords.latitude;
      this.long = position.coords.longitude;

      //aqui defino el mapa dentro de la geo localizacion

      $scope.map = { center: { latitude: this.lat, longitude: this.long }, zoom: 14 };
      $scope.hide();
      $scope.marker = {
      id: 0,
      coords: {
        latitude: this.lat,
        longitude: this.long
      },
      options: {
        icon:'img/gemionic/position.png'
         },

    };

     $scope.circles =
            [{
                id: 1,
                center: {
                    latitude: this.lat,
                    longitude: this.long
                },
                radius: 1000,
                stroke: {
                    color: '#568ec1',
                    weight: 2,
                    opacity: 1
                },
                fill: {
                    color: '#568ec1',
                    opacity: 0.5
                },
                geodesic: true, // optional: defaults to false
                draggable: false, // optional: defaults to false
                clickable: false, // optional: defaults to true
                editable: false, // optional: defaults to false
                visible: true, // optional: defaults to true
                control: {}
            }]
        ;







         },function(err){


                    $ionicPopup.confirm({
                     title: err.message,
                     template: 'Por Favor Habilitar GPS y Presionar Ok. Si desea trabajar sin GPS Presionar Cancelar'
                   });

                   confirmPopup.then(function(res) {
                     if(res) {
                       $scope.hide();
                     } else {
                      //hola
                     }
                   });
         },{
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }  );

    }



  //registrarse

  $scope.mostrarRegistro = function(){

    $ionicLoading.show({
      template: 'Creando Registro...'
    }).then(function(){
       console.log("creando registro");
    });

  }

  $scope.registrar = function(){

    $scope.mostrarRegistro();
    var uploadUrl='http://medicalappecuador.com/medicalnew/public/agregar_paciente';
      $scope.formatRegistro(uploadUrl,$scope.cliente);
  }





  var defered = $q.defer();
  $scope.latitud = defered.promise;



 $scope.showAlert = function(err) {
   var alertPopup = $ionicPopup.alert({
     title: 'Debe tener Habilitado el Gps!',
     template: err
   });
 }











   //inicializacion del mapa
  $scope.init = function(){

    var latLng = new google.maps.LatLng($scope.medico.latitud, $scope.medico.longitud);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){

  var marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: latLng
  });

  var infoWindow = new google.maps.InfoWindow({
      content: "Aqui Estoy"
  });

  google.maps.event.addListener(marker, 'click', function () {
      infoWindow.open($scope.map, marker);
  });

});



  }

// declaracion del datepicker
   $scope.ipObj1 = {
      callback: function (val) {  //Mandatory

        var nombreMeses = [
                "Enero", "Febrero", "Marzo",
                "Abril", "Mayo", "Junio", "Julio",
                "Agosto", "Septiembre", "Octubre",
                "Noviembre", "Deciembre"
              ];

          var fecha = new Date(val);
          var dia = fecha.getDate(fecha);
          var indiceMes = fecha.getMonth(fecha);
          var anio = fecha.getFullYear(fecha);


          $scope.fecha_cita = dia + ' ' + nombreMeses[indiceMes] + ' ' + anio;
          $scope.fecha_enviar = fecha;
      },
      disabledDates: [            //Optional
        new Date(2016, 2, 16),
        new Date(2015, 3, 16),
        new Date(2015, 4, 16),
        new Date(2015, 5, 16),
        new Date('Wednesday, August 12, 2015'),
        new Date("08-16-2016"),
        new Date(1439676000000)
      ],
      from: new Date(), //Optional
      to: new Date(2016, 12, 30), //Optional
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
      disableWeekdays: [0],       //Optional
      closeOnSelect: true,       //Optional
      templateType: 'popup'       //Optional
    };

    // declaracion del time picker


    $scope.ipObj2 = {
    callback: function (val) {      //Mandatory
      if (typeof (val) === 'undefined') {
      } else {
        var selectedTime = new Date(val * 1000);
        $scope.hora_cita =  selectedTime.getUTCHours();
        $scope.hora_enviar = selectedTime;
      }
    },
    inputTime: 50400,   //Optional
    format: 12,         //Optional
    step: 15,           //Optional
    setLabel: 'Elegir'    //Optional
  };


  //metodo para abrir picker de fecha

    $scope.openDatePicker = function(){
      ionicDatePicker.openDatePicker($scope.ipObj1);
    };

    //metodo para abrir picker de hora

     $scope.openTimePicker = function(){
      ionicTimePicker.openTimePicker($scope.ipObj2);
    };

    $scope.apartarCita = function(){

        $scope.cita = {
          medico_id : $scope.medico.id,
          hora : $scope.hora_cita,
          fecha : $scope.fecha_cita,
          detalle: $scope.cliente.sintoma,
          nombre: $scope.cliente.nombre,
          telefono: $scope.cliente.telefono,
          email: $scope.cliente.email

      }



    //   var resultado = $http.post('http://marketing360ecuador.com/panel_medicos/public/apartar_cita/');




    var resultado = $http.get('http://marketing360ecuador.com/panel_medicos/public/apartar_cita/'+$scope.cita.detalle+'/'+$scope.cita.fecha+'/'+$scope.cita.hora+'/'+$scope.cita.medico_id+'/'+$scope.cita.nombre+'/'+$scope.cita.telefono+'/'+$scope.cita.email);

    resultado.then(function successCallback(response) {
    var alertPopup = $ionicPopup.alert({
     title: 'Mensaje de Sistema',
     template: 'Solicitud de Cita Enviada. al doctor confirmar la cita se le sera notificado'
   });

   alertPopup.then(function(res) {
     $state.go('app.feed');
   });

  }, function errorCallback(response) {

    var alertPopup = $ionicPopup.alert({
     title: 'Mensaje de Sistema',
     template: 'Error con Solicitud'
   });

  });
    }

    $scope.citaForm = function(){

        if(UserService.check() == true){

                  $scope.cliente = {

                          nombre : $scope.datosCliente.nombre,
                          telefono : $scope.datosCliente.telefono,
                          email : $scope.datosCliente.email,
                          direccion : $scope.datosCliente.direccion

                  };

                $state.go('app.cita');


        }else{

            $scope.login();

        }
    }

    $scope.reservarCita = function(){

      if($scope.fecha_enviar == '' || $scope.hora_enviar == '' ){

        $cordovaToast
                .show('Debe llenar fecha y hora solicitada', 'long', 'center')
                .then(function(success) {
                      console.log('fecha y horas vacias');
                }, function (error) {
                  console.log('error');
                });


      }else{

        $ionicLoading.show({
          template: 'Reservando Cita...'
        }).then(function(){
           console.log("Reservando");
        });

       $scope.cita = {

                    medico_id : $scope.medico.id,
                    hora_cita : $scope.hora_cita,
                    fecha_cita : $scope.fecha_cita,
                    estatu_id : 1,
                    sintomas : $scope.cliente.sintoma,
                    nombre: $scope.cliente.nombre,
                    telefono: $scope.cliente.telefono,
                    email: $scope.cliente.email,
                    paciente_id : $scope.datosCliente.paciente_id

                }


              var uploadUrl='http://medicalappecuador.com/medicalnew/public/reservar_cita';
                $scope.format(uploadUrl,$scope.cita);

      }



    }
  //$ionicSlideBoxDelegate.update();

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});



$scope.format = function(uploadUrl, data){
    var fd = new FormData();
    for(var key in data)
      fd.append(key, data[key]);
    var result = $http.post(uploadUrl, fd, {
      transformRequest: angular.indentity,
      headers: { 'Content-Type': undefined }
    });
               result.success(function (data) {
                        $scope.hide();
                        $cordovaToast
                                .show('La solicitud de cita ha sido enviada. en momentos espere confirmación', 'long', 'center')
                                .then(function(success) {
                                      $state.go('app.feed');
                                }, function (error) {
                                  console.log('error');
                                });



                  }).error(function(data){

                    var alertPopup = $ionicPopup.alert({
                                   title: 'Error al Solicitar Cita',
                                   template: data.message
                                 });


                  });
  }

  //formatear datos

  $scope.formatLogin = function(uploadUrl, data){
    var fd = new FormData();
    for(var key in data)
      fd.append(key, data[key]);
    var result = $http.post(uploadUrl, fd, {
      transformRequest: angular.indentity,
      headers: { 'Content-Type': undefined }
    });
               result.success(function (data) {


                            console.log('exito');

                            UserService.setData(data);
                            $rootScope.datosPaciente = UserService.getData();
                            $scope.logout = UserService.check();
                            $scope.logoutInverse = !UserService.check();
                            $scope.datosCliente = UserService.getData();
                            $rootScope.SubscribirCanal();
                            $scope.hide();
                            $scope.closeLogin();

                            if( $state.current.name == 'app.registro'){

                                  $state.go('app.feed');
                                   $scope.closeLogin();

                            }else if( $state.current.name == 'app.profile'){
                                  $scope.mostrarDatosSession();
                                  $state.go('app.cita');
                                  $scope.closeLogin();
                            }



                            //$state.go('app.feed');


                  }).error(function(data){

                    $scope.hide();
                    var alertPopup = $ionicPopup.alert({
                                   title: 'Invalido',
                                   template: data.message
                                 });



                  });
  }

  //format registro


  $scope.formatRegistro = function(uploadUrl, data){
    var fd = new FormData();
    for(var key in data)
      fd.append(key, data[key]);
    var result = $http.post(uploadUrl, fd, {
      transformRequest: angular.indentity,
      headers: { 'Content-Type': undefined }
    });
               result.success(function (data) {


                            console.log('exito');

                           $scope.hide();
                    var alertPopup = $ionicPopup.alert({
                                   title: 'Mensaje del Sistema',
                                   template: data.message
                                 });
                    $scope.cliente = {};

                    alertPopup.then(function(){

                        $scope.login();

                    });
                //$state.go('app.feed');



                  }).error(function(data){

                    $scope.hide();
                    var alertPopup = $ionicPopup.alert({
                                   title: 'Mensaje del Sistema',
                                   template: data.message.email
                                 });



                  });
  }





  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });




  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };



  // Open the login modal
  $scope.login = function() {
     $ionicModal.fromTemplateUrl('templates/social/login.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
      $scope.modal.show();

    });
  };
//modal busqueda en mapa
$scope.data = {};
  $scope.busqMapa = function() {

    var myPopup = $ionicPopup.show({
    template: '<input type="password" ng-model="data.wifi">',
    title: 'Parametros de Busqueda',
    subTitle: '',
    scope: $scope,
    buttons: [
      { text: 'Salir' },
      {
        text: '<b>Buscar</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.wifi) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.data.wifi;
          }
        }
      }
    ]
  });

  myPopup.then(function(res) {
    $scope.txtBusqMapa = res;
  });

  };
//modal tutorial
    $scope.tutorial = function() {
     $ionicModal.fromTemplateUrl('templates/social/tutorial.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
      $scope.modal.show();

    });
  };

  $scope.mostrarLoading = function(){

    $ionicLoading.show({
      template: 'Iniciando Sesion...'
    }).then(function(){
       console.log("Iniciando Sesion");
    });

  }


  $scope.iniciarSesion = function(){

     $scope.mostrarLoading();
    var credentials= {email:$scope.loginData.email,password:$scope.loginData.password};
    var uploadUrl='http://medicalappecuador.com/medicalnew/public/acceso_cliente';
      $scope.formatLogin(uploadUrl,credentials);



  }

  //cerrar sesion

  $scope.cerrarSesion = function(){

       $localStorage.$reset();
       $scope.logout = UserService.check();
       $scope.logoutInverse = !UserService.check();
       $scope.datosCliente = UserService.getData();

  }







   // Open the resumen modal

  $scope.muestraResumen = function(){
    $ionicModal.fromTemplateUrl('templates/social/resumen.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
      $scope.modal.show();

    });
  }

//comparte con facebook

  $scope.compartirFacebook = function(){

    var contenido = "Visita a : "+$scope.medico.nombre_medico+" "+$scope.medico.resumen+" "+" Registrado en Medical App , www.medicalappecuador.com";
    $cordovaSocialSharing
    .shareViaFacebook(contenido, "http://medicalappecuador.com/medicalnew/public/fotos/"+$scope.medico.path, 'https://play.google.com/store/apps/details?id=app.medical.customers&hl=es')
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occurred. Show a message to the user
    });

}
//comparte con ws

$scope.compartirWs = function(){

    var contenido = "Visita a : "+$scope.medico.nombre_medico+" "+$scope.medico.resumen+" "+" Registrado en Medical App";

    $cordovaSocialSharing
    .shareViaWhatsApp(contenido, "http://medicalappecuador.com/medicalnew/public/fotos/"+$scope.medico.path, 'https://play.google.com/store/apps/details?id=app.medical.customers&hl=es')
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occurred. Show a message to the user
    });

}

  // muestra modal de informacion de la app


   $scope.muestraInfo = function(){
    $ionicModal.fromTemplateUrl('templates/social/empresa.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
      $scope.modal.show();

    });
  }
  $scope.muestraPaginaA = function(web){
     window.open( 'http://'+
      web , '_system', 'location=yes');
      return false;
  }

  $scope.muestraPaginaE = function(web){
     window.open( 'http://'+
      web , '_system', 'location=yes');
      return false;
  }









  //open search modal

  $scope.buscar = function(){
        $ionicModal.fromTemplateUrl('templates/buscar.html', {
            scope: $scope
          }).then(function(modal) {
            $scope.modal = modal;
          });

           $scope.modal.show();
  }

  $scope.ver = function(medicos){
      $scope.medicos = medicos;
      $state.go('app.flist');
  }


  $scope.perfil = function(medico){

      $ImageCacheFactory.Cache([
        "http://medicalappecuador.com/medicalnew/public/fotos/"+medico.path
    ]).then(function(){


        $scope.medico = medico;
        $scope.checkFavorito();
        $state.go('app.profile');
    });

  }
  $scope.irPerfil = function(medico){

      console.log(medico);

  }



   $scope.Loguear = function() {


    };

  $scope.buscarProvincia = function(provincia){
      $scope.provincia = provincia;
      $http.get('http://www.medicalappecuador.com/medicalnew/public/get_ciudades/'+provincia,{cache: true})
            .then(function(res){
              $scope.ciudades = res.data;
            })



   ;
      $state.go('app.ciudades');
  }

  $scope.cambiarCiudad = function(ciudad){

       $scope.map = { center: { latitude: ciudad.latitud, longitude: ciudad.longitud }, zoom: 12 };
      $state.go('app.feed');
  }

  $scope.localizar = function(){

      console.log($scope.medico);

       $scope.mapa_medico = {
        center : {
            latitude: $scope.medico.latitude,
            longitude: $scope.medico.longitude
        },
        zoom : 16,
        control : {}
    };

     $scope.marker_medico = {
      id: 400,
      coords: {
        latitude: $scope.medico.latitude,
        longitude: $scope.medico.longitude,
      }

    };

    $state.go('app.mapa');



  }

  $scope.comparteRedes = function(){

    $cordovaSocialSharing
    .share('Citas medicas a tu alcance con Medical','Descargate la app y encuentra el mayor directorio de medicos', 'http://medicalappecuador.com/medicalnew/public/img/icono.png','https://play.google.com/store/apps/details?id=app.medical.customers&hl=es')
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occured. Show a message to the user
    });
  }

   $scope.mostrarDatosSession = function(){

      if($scope.session.useSession == true){

         $scope.cliente = {

                          nombre : $scope.datosCliente.nombre,
                          telefono : $scope.datosCliente.telefono,
                          email : $scope.datosCliente.email,
                          direccion : $scope.datosCliente.direccion

                  };

    }else if($scope.session.useSession == false){

        $scope.cliente = {};
    }



  }

  $scope.centrar = function(){

        $scope.localizarme();

  }

  $scope.mis_citas = function(){

      if(UserService.check() == true){

                   $state.go('app.citas');

                  var misCitas = $http.get('http://medicalappecuador.com/medicalnew/public/mis_citas/'+$scope.datosCliente.paciente_id);

                   misCitas.then(function successCallback(response) {

                $scope.citas = response.data;

                console.log($scope.citas);

               });


        }else{

            $scope.login();

        }


  }

    $scope.checkFavorito = function(){

        var check = $http.get('http://medicalappecuador.com/medicalnew/public/check_favorito/'+$scope.datosCliente.paciente_id+'/'+$scope.medico.id);

        check.then(function(resp){

            if(resp.data == 0){
                    $scope.selectFavorito = false;
            }else{
               $scope.selectFavorito = true;
            }

        })

  }

   $scope.changeFavorito = function(){

        $scope.selectFavorito = true;

        console.log($scope.selectFavorito);
  }

  /////////--------- FILTROS PARA MAPA -------///////////////
$scope.resetFiltroMapa = function(){
  $scope.filtroMapa = {};
}

$scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };
  $scope.mostrarProvincias = function(){

    $ionicModal.fromTemplateUrl('templates/social/selectProvincia.html', {
     scope: $scope,
     animation: 'slide-in-up'
   }).then(function (modal) {
     $scope.modal = modal;
     $scope.modal.show();

   });

  }

  $scope.cambiarMapa = function(ciudad){

    $scope.direccionR = ciudad.nombre_ciudad;

    $scope.map = {
         center : {
             latitude: ciudad.latitud,
             longitude: ciudad.longitud
         },
         zoom : 14,
         control : {}
     };

  $scope.modal.hide();
  $cordovaToast
          .show('Se ha cambiado la localizacion del mapa', 'long', 'center')
          .then(function(success) {
             console.log('cambiado');
          }, function (error) {
            console.log('error');
          });



  }

  $scope.volverPosicion = function(){

    $scope.direccionR = $scope.direccion_actual;
    $scope.map = {
         center : {
             latitude: this.lat,
             longitude: this.long
         },
         zoom : 14,
         control : {}
     };

  $scope.modal.hide();
  $cordovaToast
          .show('Se ha cambiado la localizacion del mapa', 'long', 'center')
          .then(function(success) {
             console.log('cambiado');
          }, function (error) {
            console.log('error');
          });


  }




})


.controller('TutorialCtrl', function($ionicSlideBoxDelegate) {



})
.controller('EspecialidadesCtrl', function($scope,EspecialidadesResource) {

  $scope.especialidades = EspecialidadesResource.query();

});
