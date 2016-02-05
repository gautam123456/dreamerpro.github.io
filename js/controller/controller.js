angular.module('lookplex')
.controller('ShowController', function($routeParams, $location, $http, $scope, $anchorScroll){

	var that=this;
	//http get data
	that.query=$routeParams;
	//console.log(that.query);
	that.storeDetails=null;
	that.storeRateCard=[];
	that.storePhotos=[];
	that.hashid=$location.hash();
	that.myrating='-';
	that.myreview='';

	$scope.$on('$routeUpdate', function(scope, next, current) {
   		// Minimize the current widget and maximize the new one
   		console.log('hello');
	});
	//GET Store details
	$http({
	    	method: 'POST',
			url: 'https://storeapi.lookplex.com/ws/masnepservice/getstoredetails',
			data: $.param($routeParams),//serialize
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'//'text/plain' //
			}
		})
		.success(function(data){
			//console.log(data)
			that.storeDetails=data;
		})
		.error(function(data){
			console.log(data)
	});

	//GET RATE CARD

	$http({
    	method: 'POST',
		url: 'https://storeapi.lookplex.com/ws/masnepservice/getratecard',
		data: $.param({id:$routeParams.storeID,gid:$routeParams.guid}),//serialize
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded' // 'text/plain' //
		}
	})
	.success(function(data){
		//console.log(data);
		if(data===null){
			return false;
		}
		for (var i = 0; i < data.length; i++) {
    		that.storeRateCard.push({src:'https://pt.lookplex.com/'+data[i].photoUrl+"_medium",w:500,h:500});
    	}		
    	//console.log(that.storeRateCard);
	})
	.error(function(data){
		console.log(data)
	})

	//GET STORE PHOTOS

	$http({
    	method: 'POST',
		url: 'https://storeapi.lookplex.com/ws/masnepservice/getstorephotos',
		data: $.param({id:$routeParams.storeID,gid:$routeParams.guid}),//serialize
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded' // 'text/plain' //
		}
	})
	.success(function(data){
		//console.log(data);
		if(data===null){
			return false;
		}
		for (var i = 0; i < data.length; i++) {
    		that.storePhotos.push({src:'https://pt.lookplex.com/'+data[i].photoUrl+"_medium",w:500,h:500});
    	}		
    	//console.log(that.storePhotos);
	})
	.error(function(data){
		console.log(data)
	})

	//get now
	this.getToday=function(){
		var date = new Date(_.now());//var month = date.getMonth();		
		var day=date.getDay();
		return day;
	}

	/*GALLERY*/

	this.title = 'ngPhotoswipe';
  	this.startEvent = 'START_GALLERY';

  	this.opts = {
    	index: 0
  	};

  	this.showGallery = function (i) {
    	this.opts.index = i || this.opts.index;
    	$scope.$broadcast(this.startEvent);
  	};

/*GET HIGHLIGHTS*/

	this.getHighlight=function(type){
		if(that.storeDetails===null){return false;}
		if(type==='unisex'){return that.storeDetails.attributeList.indexOf('fm')>-1 && that.storeDetails.attributeList.indexOf('fw')>-1;}
		else if(type==='wifi'){return that.storeDetails.attributeList.indexOf('wi')>-1;}
		else if(type==='ac'){return that.storeDetails.attributeList.indexOf('ac')>-1;}
		else if(type==='parking'){return that.storeDetails.attributeList.indexOf('pa')>-1;}
		else if(type==='credit'){return that.storeDetails.attributeList.indexOf('ca')>-1;}
	}
	this.getClasses=function(type){
		if(that.getHighlight(type)){
			return 'fa-check-circle-o text-success';
			/*'fa-check-circle-o':sc.getHighlight('unisex'),
			  		'text-success':sc.getHighlight('unisex'),
			  		'fa-times-circle':!sc.getHighlight('unisex'),
			  		'text-danger':!sc.getHighlight('unisex')*/
		}
		else{
			return 'fa-times-circle text-danger';
		}
	}
	/*SCROLL IF HASH PRESENT*/
	if(that.hashid){
		$location.hash(that.hashid);
     	$anchorScroll();
	}
	/*REVIEW AND RATING*/
	this.setRate=function(val){
		that.myrating=val;
		console.log(val,that.myrating);
	}

	this.setYellow=function(val){
		return val<=that.myrating;
	}
	this.cancelReview=function(){
		that.myrating='-';
		that.myreview='';
		that.writeReview=false;
	}

})


.controller('HomeController', function ($scope, $location) {
	var that =this;
	this.sm_popular=true;
	this.sm_hp=true;
	that.query="";

	this.togglemore=function(v){
		if(v===1){that.sm_popular=!that.sm_popular;}
		else{that.sm_hp=!that.sm_hp;}
	}
	this.popular=[
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

	];
	this.handpicked=[
		{
			name:'Salon',
			sub:'Cut Above the Rest',
			background:'images/popular/south-delhi.jpg'
		},
		{
			name:'Spa',
			sub:'Spa',
			background:'images/popular/gurgaon.jpg'
		},
		{
			name:'Gym',
			sub:'',
			background:'images/popular/west-delhi.jpg'
		},
		{
			name:'Makeup Artist',
			sub:'',
			background:'images/popular/noida.jpg'
		},
		

	];

	this.search=function(){
		//if(that.query===null ||that.query.length<1){alert('No query typed.');return false;}
		$location.path('search/test');
	}
})



.controller('SearchResultCtrl', function($routeParams, $scope, $rootScope, $http, $location){
	var that=this;
	this.query=$routeParams;
	this.resultList=null;
	//this.showFilters=$rootScope.showFilters;
	
	//console.log($routeParams);
	$http({
	    	method: 'POST',
			url: 'https://storeapi.lookplex.com/ws/masnepservice/getstores',
			data: $.param($routeParams),//serialize
			headers: {
				'Content-Type': 'text/plain' //'application/x-www-form-urlencoded'//
			}
			})
	    	.success(function(data){
	    		//$rootScope.location.locationList=data;
	    		console.log(data);
	    		that.resultList=data.storeList;
	    	})
	    	.error(function(error){
		    	console.log(error);
		    });

	this.categories=$rootScope.categoriesList;
	if(this.categories[0].name!=='All'){// add all if not there
		this.categories.unshift({name:'All',id:0});	
	}
	


	this.isCatActive=function(id){//check if category active
		return id == $routeParams.catid;
	}
	this.createLink=function(id){
		if(id==0){alert('the endpoint is unknown'); return false;}
			$location.path('/search/id/'
            	+$routeParams.blockID+"/guid/"
            	+$routeParams.blockguid+"/category/"
            	+id+"/r/"
            	+1+"/"
            	+10+"/"
            	+$routeParams.location
            	);
	}
/*	this.createHashedLink=function(){
		
			$location.path('/search/id/'
            	+$routeParams.blockID+"/guid/"
            	+$routeParams.blockguid+"/category/"
            	+$routeParams.catid+"/r/"
            	+1+"/"
            	+10+"/"
            	+$routeParams.location
            	);
	}*/

	this.cs={left:false,right:true};//show next or previous
	
	this.toggleSF=function(){
		$rootScope.showFilters=!$rootScope.showFilters;
	}
	
	this.sr=function(){//Scroll Right
		//console.log($(".categories").first().width());
		if($(".categories").first().scrollLeft()===0){that.cs.left=false; }
		$(".categories").first().animate({scrollLeft:$(".categories").first().scrollLeft()+$(".categories").first().width()});
		that.cs.left=true;
	}
	this.sl=function(){//Scroll left

		console.log($(".categories").first().scrollLeft());
		$(".categories").first().animate({scrollLeft:$(".categories").first().scrollLeft()-$(".categories").first().width()});
		//$(".categories").first().scrollLeft($(".categories").first().scrollLeft()-200);
		if($(".categories").first().scrollLeft()===0){that.cs.left=false; }
	}

})

.controller('LoginController', ['GooglePlus','$facebook','$http',function(GooglePlus, $facebook, $http){
	var _self=this;
	this.googlelogin = function () {
        GooglePlus.login().then(function (authResult) {
            console.log(authResult);

            GooglePlus.getUser().then(function (user) {
                console.log(user);
                _self.usersaveorconnect( null,user.id,authResult.access_token, 'gplus');
            });
        }, function (err) {
            console.log(err);
        });
    }
    this.facebooklogin=function(){
    	$facebook.login().then(
    		function(response) {
	        //this.welcomeMsg = "Welcome " + response;
	        console.log(response);

	        _self.usersaveorconnect(response.authResponse.userID, null, response.authResponse.accessToken,'facebook');
	        
	        $facebook.api("/me").then( 
		      	function(response) {
		        	this.welcomeMsg = "Welcome " + response.name;
		        	console.log(this.welcomeMsg);
		      	},
		      	function(err) {
		        	this.welcomeMsg = "Please log in";
		        	console.log(this.welcomeMsg);
		      	});

	      },
	      function(err) {
	        this.welcomeMsg = "Please log in";
	        console.log(err);
	      }
      );
    }

    this.usersaveorconnect=function(_fbid,_gpid,_token,_platform){
    	//console.log(_fbid,_gpid,_token,_platform);
    	$http({
    		method: 'POST',
    		url: 'https://storeapi.lookplex.com/ws/masnepservice/saveCust',
			data: $.param({fbid:_fbid,gpid:_gpid,token:_token,platform:_platform}),//serialize
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded', // 'text/plain' //
			}
    	}).then(
    		function(resp){
    			console.log(resp);
    		},
    		function(resps){
    			console.log(resps);
    		}
    	)//
    }

}])