angular.module('starter.services', ['ngResource'])
	.factory('ProvinciasResource',function($resource){

			return $resource('http://medicalappecuador.com/medicalnew/public/provinciasConCiudades') 
	})
	.factory('EspecialidadesResource',function($resource){

		return $resource('http://medicalappecuador.com/medicalnew/public/get_especialidades');
	})


  .factory('MedicosResource',function($resource){

    return $resource('http://medicalappecuador.com/medicalnew/public/get_medicos');
  })


	.factory('UserService',function($rootScope,$http,$localStorage){
    return {

      getData : function(){
        return {
                usuario_id : $localStorage.id,
                nombre: $localStorage.nombre,
                email: $localStorage.email,
                telefono : $localStorage.telefono,
                direccion : $localStorage.direccion,
                paciente_id : $localStorage.paciente_id,
								canal: $localStorage.canal


                }
        },

      setData : function(usuario){

                 $localStorage.email = usuario.email ;
                 $localStorage.nombre = usuario.name;
                 $localStorage.id= usuario.id;

                  // datos del paciente

                 $localStorage.paciente_id = usuario.paciente.id;
                 $localStorage.telefono = usuario.paciente.telefono;
                 $localStorage.direccion = usuario.paciente.direccion;
								 $localStorage.canal = usuario.paciente.canal;

      },
      check : function(){

              if ($localStorage.email == undefined){

                  return false;

              }else{

                    return true;
              }

      },
       checkTutorial : function(){

              if ($localStorage.tutorial == undefined){

                  return false;

              }else{

                    return true;
              }

      }
    };



    });
