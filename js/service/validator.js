angular.module('cultstage')
.factory('Validator', function(){
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
})