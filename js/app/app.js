angular.module('lookplex',['ngRoute','ngPhotoswipe','ngMap','ngFacebook','googleplus'])
.config(['$routeProvider','$locationProvider','$facebookProvider','GooglePlusProvider','$httpProvider', 

function($routeProvider, $locationProvider ,$facebookProvider, GooglePlusProvider,$httpProvider) {
	$tu="templates/";
	$routeProvider
	.when("/", { templateUrl:$tu+'/home' })//id/:blockID/guid/:blockguid/category/:catid/r/:startindex/:endIndex/:location/
	.when("/search/", { templateUrl:$tu+'/search-result' })
	.when("/handpicked/", { templateUrl:$tu+'/handpicked' })
	.when("/popular/", { templateUrl:$tu+'/popular' })
	.when("/show/profile/:storename/:storeid/:guid/", { templateUrl:$tu+'/show' })
	.when("/unsupportedscreen", { templateUrl:$tu+'/unsupportedscreen/' })
	.otherwise({
		redirectTo:"/"
	})
	
	$facebookProvider.setAppId('793762427404557');
	$facebookProvider.setPermissions("public_profile");
	GooglePlusProvider.init({
        clientId: '393978119485-6j14o11ndo58jhnaqhir1lgb4hmvkpih.apps.googleusercontent.com',
        apiKey: 'AIzaSyBkRzmfedoJ2knAFsyxdhH5AuW41ljbu6E'
     });

	$locationProvider.html5Mode(true).hashPrefix('!');
	$httpProvider.defaults.withCredentials = true;
}])

.run(function($rootScope, $location, $http){
	$rootScope.env="production";
	
//load fb sdk
(function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));


//works for route change
	$rootScope.$on('$locationChangeSuccess', function(event){
		//console.log($(window).width() );
		/*if ($rootScope.env==='production' && $(window).width() > 720) {
		   //alert('Less than 960');
		   $location.path('/unsupportedscreen');
		}*/
		
        var url = $location.url()/*,
        params = $location.search()*/;
        if(url=="/"){
        	$rootScope.islanding=true;
        }
        else{

        	if(url.indexOf("/search")>-1){$rootScope.showFilter=true;}
        	else{$rootScope.showFilter=false;}

        	$rootScope.islanding=false;
        	
        }

        

	});


/*******************8SEARCHING ******************************/

	$rootScope.categoriesList=[
		{id:1, name:'Spa',text:'Time waits here'},
		{id:2, name:'Salon',text:'Cut Above the Rest'},
		{id:3, name:'Gym',text:'Shape up. Build up'},
		{id:8, name:'MakeUp Artists',text:'The Eye Candy'},
		{id:6, name:'Slimming and Cosmetology',text:'Your look has come'},
		{id:9, name:'Dietitians & Nutritionists',text:'Eat right Look Bright'},
		{id:14, name:'Tatto & Piercing',text:'Art the body'},
		{id:10, name:'Yoga & Aerobics',text:'Fitness with peace'},
		{id:11, name:'Nail Art',text:'Cult in the making'},
		{id:13, name:'Mehendi',text:'The classy traditional'}
	]
	/*$rootScope.popular=[
		{
			name:'South Delhi',
			background:'images/popular/south-delhi.jpg'
		},
		{
			name:'Gurgaon',
			background:'images/popular/gurgaon.jpg'
		},
		{
			name:'West Delhi',
			background:'images/popular/west-delhi.jpg'
		},
		{
			name:'Noida',
			background:'images/popular/noida.jpg'
		},
		{
			name:'North Delhi',
			background:'images/popular/north-delhi.jpg'
		},
		{
			name:'Ghaziabad',
			background:'images/popular/ghaziabad.jpg'
		},
		{
			name:'East Delhi',
			background:'images/popular/east-delhi.jpg'
		},
		{
			name:'Central Delhi',
			background:'images/popular/central-delhi.jpg'
		},
		{
			name:'Faridabad',
			background:'images/popular/faridabad.jpg'
		}

	];*/
	$rootScope.getCategory=function(id){
		var out=null;
		if(!_.isNumber(id)){
			id=id.split(",")[0];
		}
		angular.forEach($rootScope.categoriesList,function(val, key){
			if(val.id==id){ out=val; return;}

		})
		return out;
	}
	$rootScope.location={//location search
		query:{location:''},
		locationList:[]
	}
	$rootScope.stores={
		query:{// store search based on blockid & guid
			//no aminities or brandname
			blockid:'',
			blockguid:'',
			catid:'',
			startindex:1,
			endindex:10,
			sortby:null
		},
		filteredQuery:{
			blockid:'',
			blockguid:'',
			catid:'',
			startindex:1,
			endindex:10,
			sortby:null,
			aminities:null,
			brandname:null
		},
		storeDetails:{ // store details based on storeid & guid
			storeid:'',
			guid:''
		}
	}
	
	$rootScope.selectBlock = function(id, guid, name) { //set block id n guid on click
		$rootScope.stores.query.blockid=id;
		$rootScope.stores.query.blockguid=guid;
		$rootScope.stores.filteredQuery.blockid=id;	
		$rootScope.stores.filteredQuery.blockguid=guid;
		$rootScope.location.query.location=name;
	}
	$rootScope.selectCategory=function(id, name){
		//console.log(id, name);
		$rootScope.cat=name;
		$rootScope.stores.query.catid=id;
		$rootScope.stores.filteredQuery.catid=id;
	}

	$rootScope.search = function() {
     
			$location.path('/search/');
			var x=$rootScope.stores.query;
			$location.search({
				blockid:x.blockid,
				blockguid:x.blockguid,
				catid:x.catid,
				startindex:x.startindex,
				endindex:x.endindex,
				location:$rootScope.location.query.location
			});

            $('#modal-search').modal('hide');

            /**/
    }	

    $rootScope.getBlockList = function() {
           //alert('This is just test. After only data input it will proceed further.');
           // $location.path('/search/test');
    }
    $rootScope.$watch('location.query.location', function(newval, oldval){
    
    /*//change triggered by clicking the location list element*/
    	var stop=false;
    	angular.forEach($rootScope.location.locationList, function( value,key, obj){
    		
    		if(newval===value.locationName){
    			//console.log(value.locationName);	
    			$rootScope.location.locationList=[];
    			stop=true
    			return false;		
    		}
    		
    	});
    	if(stop){return false;}
	/*//end of change triggered by clicking the location list element*/


    	if(newval!==undefined){
    		if(newval!==oldval && newval.length>2){
	    		$http({
	    			method: 'POST',
				    url: 'https://storeapi.lookplex.com/ws/masnepservice/getLocation',
				    data: $.param($rootScope.location.query),//serialize
				    headers: {
				        'Content-Type': 'text/plain'//'application/x-www-form-urlencoded'
				    }
				})
	    		.success(function(data){
	    			$rootScope.location.locationList=data;
	    		})
	    		.
		    	error(function(error){
		    		alert(error);
		    	});
	    	}

	    	if(newval.length<1){
	    		$rootScope.location.locationList=[];
	    	}
    	}//!=undefined
    	
    })//location query end

	$rootScope.fblogin=function(){

	}


})

;