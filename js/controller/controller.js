angular.module('lookplex')
.controller('ShowController', function($routeParams,$location, $http){

	var that=this;
	//http get data
	that.query=$routeParams;
	console.log(that.query);
	that.storeDetails=null;
	that.storeRateCard=[];

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
		console.log(data)
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
		console.log(data);
		that.storeRateCard=data;
		
		
	})
	.error(function(data){
		console.log(data)
	});

	//get now
	this.getToday=function(){
		var date = new Date(_.now());
		//var month = date.getMonth();
		var day=date.getDay();
		return day;
	}

//Photoswipe
		this.openPhotoSwipe = function(index) {
			var that=this;
		    var pswpElement = document.querySelectorAll('.pswp')[0];
		  /*  if(type==1){//ratecard

		    }*/
		    // build items array
		   /* var items = [
		        {
		            src: 'https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_b.jpg',
		            w: 964,
		            h: 602
		        },
		        {
		            src: 'https://farm7.staticflickr.com/6175/6176698785_7dee72237e_b.jpg',
		            w: 1024,
		            h: 683
		        }
		    ];*/
		    var items = [ ];
		    for (var i = 0; i < that.storeRateCard.length; i++) {
		    	//console.log(that.storeRateCard[i]);
				items.push({ src:that.storeRateCard[i].photoUrl+"_medium",w:500,h:700});	
			};
			console.log(items, that.storeRateCard[0].photoUrl);
		    
		    // define options (if needed)
		    var options = {
		             // history & focus options are disabled on CodePen        
		        history: true,
		        focus: true,

		        index: 2,

		        showAnimationDuration: 1,
		        hideAnimationDuration: 0
		        
		    };
		    options.index=index;
		    //console.log(options);
		    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
		    gallery.init();
		};


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