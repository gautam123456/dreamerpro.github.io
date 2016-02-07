angular.module('lookplex')
/*.factory('Validator', function(){
	return {
		isValid:function(data,isSignup){
			if(data.password===undefined || data.password.length<6 || data.email==undefined || data.email.length<1){
				console.log(data.password);	
				return false;
			}
			if(isSignup===true && data.name.length<1){
				return false;
			}

			return true;
		}
	}
})*/
.factory("SessionService", function(){
	return {
		get:function(key){
			return sessionStorage.getItem(key);
		},
		set:function(key, val){
			return sessionStorage.setItem(key,val);
		},
		unset:function(key){
			return sessionStorage.removeItem(key);
		}
	}
})
.factory('AuthService', function($http,SessionService){
	var cacheSession=function(){
		SessionService.set('authenticated',true);
	}
	var uncacheSession=function(){
		SessionService.unset('authenticated');
	}
	return{
		login:function(_fbid,_gpid,_token,_platform){
    	//console.log(_fbid,_gpid,_token,_platform);
    	
    	var promise= $http({
    		method: 'POST',
    		url: 'https://storeapi.lookplex.com/ws/masnepservice/saveCust',
    		data: $.param({fbid:_fbid,gpid:_gpid,token:_token,platform:_platform}),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded' // 'text/plain' //
			}
    	});
    	promise.finally(function(){
    		$('#modallogin').modal('hide');
    		SessionService.set('authenticated', true);
    	});
    	return promise;
		},
		logout:function(){

		},
		isloggedIn:function(){
			return SessionService.get('authenticated');
		}
	}
})