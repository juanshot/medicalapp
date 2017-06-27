// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

// Angular binding for google libphonenumber library
angular.module('i18n', [])
.factory('i18n', function() {
  return i18n; // assumes google libphonenumber has already been loaded on the page
});

angular.module('starter', ['ionic', 'ionic.cloud','starter.controllers','starter.services','ngCordova','ngStorage',
 'ionic.ion.imageCacheFactory','angular-preload-image',
  'ionic-datepicker', 'ionic-timepicker','uiGmapgoogle-maps','angularReverseGeocode'])


  .config(function($ionicCloudProvider) {
  $ionicCloudProvider.init({
    "core": {
      "app_id": "0c0122d0"
    },
    "push": {
      "sender_id": "543327431104",
      "pluginConfig": {
        "ios": {
          "badge": true,
          "sound": true
        },
        "android": {
          "iconColor": "#343434",
          "badge": true,
          "sound": true
        }
      }
    }
  });
})


.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
           key: 'AIzaSyAD-u8RjZs7jh31RH7uTp2dyWOGD2KOv2A',
        v: '3.20',
        libraries: 'weather,geometry,visualization'
    });
})

.config(function (ionicDatePickerProvider) {
    var datePickerObj = {
      inputDate: new Date(),
      setLabel: 'Elegir',
      todayLabel: 'Hoy',
      closeLabel: 'Cerrar',
      mondayFirst: false,
      weeksList: ["S", "L", "M", "M", "J", "V", "S"],
      monthsList: ["Ene", "Feb", "Mar", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Nov", "Dec"],
      templateType: 'popup',
      from: new Date(2012, 8, 1),
      to: new Date(2018, 8, 1),
      showTodayButton: true,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false,
      disableWeekdays: [6]
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
  })

.config(function (ionicTimePickerProvider) {
    var timePickerObj = {
      inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
      format: 12,
      step: 15,
      setLabel: 'Elegir',
      closeLabel: 'Cerrar'
    };
    ionicTimePickerProvider.configTimePicker(timePickerObj);
  })

.run(function($ionicPlatform,$rootScope,$cordovaGeolocation,$ionicPopup,$cordovaVibration,$ionicLoading,$window,$q,$ionicPush, $cordovaLocalNotification,$state,UserService) {

    $ionicPush.register().then(function(t) {
      return $ionicPush.saveToken(t);
      }).then(function(t) {
      console.log('Token saved:', t.token);
      });

$rootScope.$on('cloud:push:notification', function(event, data) {
            var msg = data.message;
            alert(msg.title + ': ' + msg.text);
          });
$rootScope.$on("$cordovaLocalNotification:click", function(notification, state) {
              $state.go('app.citas');
    });

    $rootScope.lat='';
    $rootScope.coords = function() {
    var deferred = $q.defer();
    $rootScope.datosPaciente = UserService.getData();
    $rootScope.SubscribirCanal = function(){
      Pusher.logToConsole = true;

      var pusher = new Pusher('f783e93fa4da156d72f3', {
        encrypted: true
      });

      var channel = pusher.subscribe($rootScope.datosPaciente.canal);
      channel.bind('my_event', function(data) {

        $cordovaLocalNotification.schedule({
                            id: 1,
                            title: data.datos.paciente.nombre_paciente+' Han confirmado tu cita',
                            text: 'Fecha y hora :'+data.datos.fecha_cita+' '+data.datos.hora_cita,
                            icon:'medical',
                            data: {
                            customProperty: 'custom value'
                            }
                            }).then(function (result) {
                            console.log('Notification 1 triggered');
                            });

      });
    }
    if(UserService.check() == true){
          $rootScope.SubscribirCanal();
    }




    var posOptions = {timeout: 5000, enableHighAccuracy: true};
    $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {

      deferred.resolve(position);
      var lat  = position.coords.latitude;
      var long = position.coords.longitude

    }, function(err) {

       $ionicLoading.hide().then(function(){

         $cordovaVibration.vibrate(500);
      var confirmPopup = $ionicPopup.confirm({

     title: 'Hay un Problema',
     template: 'Usted no ha Habilitado su GPS'
   });
       confirmPopup.then(function(res) {
     if(res) {
       $window.location.reload(true);
     } else {
       ionic.Platform.exitApp();
     }
   });

    });




    });



    return deferred.promise;
  };


   $rootScope.coords().then(function(resp){
        $rootScope.lat = resp.coords.latitude;
        $rootScope.long = resp.coords.longitude;

  });



  $ionicPlatform.ready(function() {






    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });
})


.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

   .state('tutorial', {
      url: "/tutorial",
      templateUrl: "templates/social/tutorial.html",
      controller: 'TutorialCtrl'
    })

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/social/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.feed', {
      url: "/feed",
      controller: 'EspecialidadesCtrl',
      views: {
        'menuContent' :{
          templateUrl: "templates/social/feed.html"
        }
      }
    })

    .state('app.start', {
      url: "/start",
      views: {
        'menuContent' :{
          templateUrl: "templates/social/start-fullscreen.html"
        }
      }
    })

    .state('app.fgrid', {
      url: "/fgrid",
      views: {
        'menuContent' :{
          templateUrl: "templates/social/friend-grid.html"
        }
      }
    })

    .state('app.flist', {
      url: "/flist",
      views: {
        'menuContent' :{
          templateUrl: "templates/social/friends.html"
        }
      }
    })

    .state('app.newpost', {
      url: "/newpost",
      views: {
        'menuContent' :{
          templateUrl: "templates/social/new-post.html"
        }
      }
    })

    .state('app.email', {
      url: "/email",
      views: {
        'menuContent' :{
          templateUrl: "templates/social/send-email.html"
        }
      }
    })

    .state('app.profile', {
      url: "/profile",
      views: {
        'menuContent' :{
          templateUrl: "templates/social/profile.html",
        }
      }
    })

     .state('app.mapa', {
      url: "/mapa",
      views: {
        'menuContent' :{
          templateUrl: "templates/social/mapa.html",

        }
      }
    })

    .state('app.timeline', {
      url: "/timeline",
      views: {
        'menuContent' :{
          templateUrl: "templates/social/timeline.html",
        }
      }
    })

    .state('app.editprofile', {
      url: "/editprofile",
      views: {
        'menuContent' :{
          templateUrl: "templates/social/profile-edit.html",
        }
      }
    })

    .state('app.profiletwo', {
      url: "/profiletwo",
      views: {
        'menuContent' :{
          templateUrl: "templates/social/profile2.html",
        }
      }
    })

    .state('app.profilethree', {
      url: "/profilethree",
      views: {
        'menuContent' :{
          templateUrl: "templates/social/profile3.html",
        }
      }
    })

    .state('app.news', {
      url: "/news",
      views: {
        'menuContent' :{
          templateUrl: "templates/social/news.html",
        }
      }
    })

    .state('app.viewpost', {
      url: "/viewpost",
      views: {
        'menuContent' :{
          templateUrl: "templates/social/view-post.html",
        }
      }
    })

    .state('app.viewposttwo', {
      url: "/viewposttwo",
      views: {
        'menuContent' :{
          templateUrl: "templates/social/view-post-2.html",
        }
      }
    })

    .state('app.invite', {
      url: "/invite",
      views: {
        'menuContent' :{
          templateUrl: "templates/social/social-invite-friend.html",
        }
      }
    })
    .state('app.cita', {
      url: "/cita",
      views: {
        'menuContent' :{
          templateUrl: "templates/social/cita.html",
        }
      },
      resolve: {
            mess:function(UserService)
                            {

                            if(UserService.check() == true ){



                                 }else{


                                 }


                            },

                  }
    })
    .state('app.citas', {

      url: "/citas",
      views: {
        'menuContent' :{
          templateUrl: "templates/social/citas.html",
        }
      }

    })
    .state('app.favoritos', {

      url: "/favoritos",
      views: {
        'menuContent' :{
          templateUrl: "templates/social/favoritos.html",
        }
      }

    })
     .state('app.radar', {
      url: "/radar",
      views: {
        'menuContent' :{
          templateUrl: "templates/social/medicalradar.html",
        }
      }
    })
    .state('app.registro', {
      url: "/registrase",
      views: {
        'menuContent' :{
          templateUrl: "templates/social/registrarse.html",
        }
      }
    })
    .state('app.select', {
      url: "/select",
      views: {
        'menuContent' :{
          templateUrl: "templates/social/select_provincia.html",
        }
      }
    })
    .state('app.ciudades', {
      url: "/ciudades",
      views: {
        'menuContent' :{
          templateUrl: "templates/social/ciudades.html",
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/feed');
});
