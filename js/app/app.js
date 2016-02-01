angular.module('lookplex',['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
	$tu="templates/";
	$routeProvider
	.when("/", { templateUrl:$tu+'/home/home.html' })
	.when("/unsupportedscreen", { templateUrl:$tu+'/unsupportedscreen/index.html' })
	.otherwise({
		redirectTo:"/"
	})
	;
}])

.run(function($rootScope, $location){

	$rootScope.$on('$locationChangeSuccess', function(event){
		//console.log($(window).width() );
		if ($(window).width() > 720) {
		   //alert('Less than 960');
		   $location.path('/unsupportedscreen');
		}
		
        var url = $location.url()/*,
        params = $location.search()*/;
        if(url=="/"){
        	$rootScope.islanding=true;
        }
        else{
        	$rootScope.islanding=false;
        	
        }

        

	});


})

;