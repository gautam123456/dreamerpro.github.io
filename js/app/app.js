angular.module('lookplex',['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
	$tu="templates/";
	$routeProvider
	.when("/", { templateUrl:$tu+'/home' })
	.when("/search/:query", { templateUrl:$tu+'/search-result' })
	.when("/show/:guid", { templateUrl:$tu+'/show' })
	.when("/unsupportedscreen", { templateUrl:$tu+'/unsupportedscreen/' })
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
        	console.log(url);
        	if(url.indexOf("/search")>-1){$rootScope.showFilter=true;}
        	else{$rootScope.showFilter=false;}

        	$rootScope.islanding=false;
        	
        }

        

	});

	$rootScope.search = function() {
            alert('This is just test. After only data input it will proceed further.');
            $location.path('/search/test');
    };


})

;