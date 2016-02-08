angular.module('lookplex')
.controller('ShowController', function($routeParams, $location, $http, $scope, $anchorScroll, SessionService){

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
	
	that.isBookmarked='';
	that.lkey='';//tpbe sent empty
	that.isCheckedIn=false;

	that.storereviews=[];
	that.reviewMsg='';
	$scope.$on('$routeUpdate', function(scope, next, current) {
   		// Minimize the current widget and maximize the new one
   		console.log('hello');
	});
	//GET Store details
	$("#modalspinner").modal('show');
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
		})
		.finally(function(){
			$("#modalspinner").modal('hide');
		})
		;

	//GET RATE CARD

	$("#modalspinner").modal('show');
	$http({
    	method: 'POST',
		url: 'https://storeapi.lookplex.com/ws/masnepservice/getratecard',
		data: $.param({id:$routeParams.storeid,gid:$routeParams.guid}),//serialize
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
	.finally(function(){
		$("#modalspinner").modal('hide');
	})


	//GET STORE PHOTOS
	
	$http({
    	method: 'POST',
		url: 'https://storeapi.lookplex.com/ws/masnepservice/getstorephotos',
		data: $.param({id:$routeParams.storeid,gid:$routeParams.guid}),//serialize
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
	})
	.error(function(data){
		console.log(data)
	})
	.finally(function(){
		$("#modalspinner").modal('hide');
	})


	//get now
	this.getToday=function(){
		var date = new Date(_.now());//var month = date.getMonth();		
		var day=date.getDay();
		console.log(day);
		return day;
	}
	//storeDetails.mondayTiming
	this.getTodayTiming=function(){
		var t=that.getToday();
		if(t==0){return that.storeDetails.sundayTiming;}
		if(t==1){return that.storeDetails.mondayTiming;}
		if(t==2){return that.storeDetails.tuesdayTiming;}
		if(t==3){return that.storeDetails.wednesdayTiming;}
		if(t==4){return that.storeDetails.thursdayTiming;}
		if(t==5){return that.storeDetails.fridayTiming;}
		if(t==6){return that.storeDetails.saturdayTiming;}
	}

	/*get review for store*/
	$http.post('https://storeapi.lookplex.com/ws/masnepservice/getReviewForStore',
			$.param({
				storeguid: $routeParams.guid,
				storeid:$routeParams.storeid
			}))
			.then(
				function(data){that.storereviews=data.data.activityList; /*console.log(data,that.storereviews); */},
				function(data){console.log(data);}
			);

	/*GALLERY*/

	this.title = 'ngPhotoswipe';
  	this.startEvent = 'START_GALLERY';

  	this.opts = {
    	index: 0,
    	shareEl: false,
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
		}
		else{
			return 'fa-times-circle text-danger';
		}
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
	this.gotoReview=function(){
		that.writeReview=true;
		$location.hash('re');
		$anchorScroll();
		that.writeReview=true;
	}
	this.toggleBookmark=function(_storeid,_storeguid){
		$("#modalspinner").modal('show');
		if(!that.isBookmarked){
			$http.post('https://storeapi.lookplex.com/ws/masnepservice/saveBookmark',
			$.param({
				platform:SessionService.get('platform'),
				token:SessionService.get('token'),
				storeguid:_storeguid,
				storeid:_storeid
			}))
			.then(
				function(data){console.log(data);	},
				function(data){console.log(data); }
			)
			.finally(function(){
				$("#modalspinner").modal('hide');
			})


		}
		else{

			$http.post('https://storeapi.lookplex.com/ws/masnepservice/deleteBookmark',
			$.param({
				platform:SessionService.get('platform'),
				token:SessionService.get('token'),
				storeguid:_storeguid,
				storeid:_storeid
			}))
			.then(
				function(data){console.log(data);},
				function(data){console.log(data);}
			)
			.finally(function(){
				$("#modalspinner").modal('hide');
			})
		}
		
	}

	this.toggleCheckIn=function(_storeid,_storeguid){
		console.log('check in '+that.isCheckedIn);
		$("#modalspinner").modal('show');
		if(!that.isCheckedIn){
			$http.post('https://storeapi.lookplex.com/ws/masnepservice/saveCheckin',
			$.param({
				platform:SessionService.get('platform'),
				token:SessionService.get('token'),
				storeguid:_storeguid,
				storeid:_storeid
			}))
			.then(
				function(data){console.log(data);	},
				function(data){console.log(data); }
			)
			.finally(function(){
				$("#modalspinner").modal('hide');
			})

		}
		else{
			$http.post('https://storeapi.lookplex.com/ws/masnepservice/deleteCheckin',
			$.param({
				platform:SessionService.get('platform'),
				token:SessionService.get('token'),
				storeguid:_storeguid,
				storeid:_storeid
			}))
			.then(
				function(data){console.log(data);},
				function(data){console.log(data);}
			)
			.finally(function(){
				$("#modalspinner").modal('hide');
			})
		}
		
	}//
	/*save review*/
	this.saveReview=function(_storeid,_storeguid){
		that.reviewMsg='';
		
		if(that.myrating==='-' || !that.myrating){
			that.reviewMsg+='You must rate before review. ';console.log('here');
			return false;
		}
		if(that.myreview.length<100){
			that.reviewMsg+='Comment should be at least 100 characters. ';console.log('thehere');
			return false;
		}
		

			$http.post('https://storeapi.lookplex.com/ws/masnepservice/saveReview',
			$.param({
				platform:SessionService.get('platform'),
				token:SessionService.get('token'),
				storeguid:$routeParams.guid,
				storeid:$routeParams.storeid,
				comment:that.myreview,
				rating:that.myrating
			}))
			.then(
				function(data){
					console.log(data);
					that.myrating="-";
					that.myreview="";
					that.storereviews.push(
						{rating:that.myrating,
						comment:that.myreview,
						customerName:SessionService.get('username'),
						customerPhotolocal:SessionService.get('profile_pic'),
						timeStamp:_.now()
					})
				},
				function(data){console.log(data); that.reviewMsg="There was an error posting review.";}

			)

	}



	/*SCROLL IF HASH PRESENT*/

	 $location.hash(that.hashid);
     $anchorScroll();



	

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
			background:'images/popular/south-delhi.jpg',
			text:'Premier Look Destinations',
			id:1733,
			guid:'HUILOPMNDG'
		},
		{
			name:'Gurgaon',
			background:'images/popular/gurgaon.jpg',
			text:'Premier Look Destinations',
			id:1740,
			guid:"WERTHUKUND"
		},
		{
			name:'West Delhi',
			background:'images/popular/west-delhi.jpg',
			text:'Premier Look Destinations',
			id:1734,
			guid:"YTUIHGENDT"
		},
		{
			name:'Noida',
			background:'images/popular/noida.jpg',
			text:'Premier Look Destinations',
			id:1739,
			guid:"WBHJKLOUTD"
		},
		{
			name:'North Delhi',
			background:'images/popular/north-delhi.jpg',
			text:'Premier Look Destinations',
			id:1732,
			guid:"North Delhi"
		},
		{
			name:'Ghaziabad',
			background:'images/popular/ghaziabad.jpg',
			text:'Premier Look Destinations',
			id:1736,
			guid:"Ghaziabad"
		},
		{
			name:'East Delhi',
			background:'images/popular/east-delhi.jpg',
			text:'Premier Look Destinations',
			id:1735,
			guid:"EDCFRTGBFD"
		},
		{
			name:'Central Delhi',
			background:'images/popular/central-delhi.jpg',
			text:'Premier Look Destinations',
			id:1738,
			guid:"ERTHNKLOIU"
		},
		{
			name:'Faridabad',
			background:'images/popular/faridabad.jpg',
			text:'Premier Look Destinations',
			id:1737,
			guid:"WERBHTJKLY"
		}

	];
/*	this.handpicked=[
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
		

	];*/

	this.visithandPicked=function(_catid){
		$location.path('/handpicked');
		$location.search({catids:_catid,cityid:1731,cityguid:'ARTUIKJHGT'});
	}
	this.visitPopular=function(id,guid){
		$location.path('/popular');
		$location.search({catids:'2,4,5',cityid:id,cityguid:guid});
	}

	/*this.search=function(){
		//if(that.query===null ||that.query.length<1){alert('No query typed.');return false;}
		$location.path('search/test');
	}*/


})
.controller('HandpickedCtrl', function($http,$location,$scope){
	var _self=this;
	this.city={};
	this.cityArray=[];
	this.resultList=[];

	$scope.searchParam=$location.search();
	
	if(!$scope.searchParam.startindex){
		$scope.searchParam.startindex=1;
		$scope.searchParam.endindex=10;
	}
	
	this.background='';
	switch ($scope.searchParam.catids){
		case '11':{//nailart
			//$scope.searchParam.catids=11;
			_self.background="https://static.lookplex.com/images/1.2/assets/services/1/banner0.jpg";
			break;
		}
		case '3':{//gym
			//$scope.searchParam.catids=3;	
			_self.background="https://static.lookplex.com/images/1.2/assets/services/3/banner0.jpg";	
			break;
		}
		case '14':{//tattoo
			//$scope.searchParam.catids=14;
			_self.background="https://static.lookplex.com/images/1.2/assets/services/1/banner0.jpg";
			break;
		}	
		case '10':{//yoga
			//$scope.searchParam.catids=10;
			_self.background="https://static.lookplex.com/images/1.2/assets/services/1/banner0.jpg";
			break;
		}
		case '13':{//mehendi
			//$scope.searchParam.catids=13;
			_self.background="https://static.lookplex.com/images/1.2/assets/services/1/banner0.jpg";
			break;
		}
		case '1':{//spa
			//$scope.searchParam.catids=1;
			_self.background="https://static.lookplex.com/images/1.2/assets/services/1/banner0.jpg";
			break;
		}
		case '2,4,5':{//salon
			//$scope.searchParam.catids=2;
			_self.background="https://static.lookplex.com/images/1.2/assets/services/2/banner0.jpg";
			break;
		}	
		case '8':{//makeup artist
			//$scope.searchParam.catids=8;
			_self.background="https://static.lookplex.com/images/1.2/assets/services/8/banner0.jpg";
			break;
		}
		case '6':{//slimming cosmetology
			//$scope.searchParam.catids=6;
			_self.background="https://static.lookplex.com/images/1.2/assets/services/6/banner0.jpg";
			break;
		}	
		case '9':{//Dietitians & Nutritionists
			//$scope.searchParam.catids=9;
			_self.background="https://static.lookplex.com/images/1.2/assets/services/9/banner0.jpg";
			break;
		}
		
	}/*switch end*/
	//$location.search($scope.searchParam);
	
	/*--------------*/
	$("#modalspinner").modal('show');
	$http.get('/js/data/city.json')
	.success(function(data){
		_self.city=data;
		console.log(_self.city);
		_self.cityArray=_.values(_self.city)

		if(!$scope.searchParam.cityid){
			$scope.searchParam.cityid=_self.city.delhincr.cityid;
			$scope.searchParam.cityguid=_self.city.delhincr.cityguid;
			$location.search($scope.searchParam);		
		}


	})
	.finally(function(){
		$("#modalspinner").modal('hide');
	})
	
	//$scope.searchParam.catids=$scope.searchParam.catids.split(",");

	$http({
		url: 'https://storeapi.lookplex.com/ws/masnepservice/getsponsoredlistforAdvertisement', 
		method:'POST',
		data:$.param($scope.searchParam),
		headers:{
			'Content-Type': 'application/x-www-form-urlencoded' // 'text/plain' //'
		} 
		
	})
		.then(
			function(data){
				_self.resultList=data.data.storeList;
				//console.log(_self.resultList, data);
			},
			function(data){
				console.log(data);
			}
		)
		.finally(function(){
			$("#modalspinner").modal('hide');
		})

	this.getCityName=function(_cityid){
		var out="";

		angular.forEach(_self.city, function(val,key,object){
			if(val.cityid==_cityid){
				//console.log(_cityid,val.cityid);
				out=val.cityname;
			}

		})
		return out;
	}

	this.createLink=function(id,guid){
		//console.log(id, guid);
		$scope.searchParam.cityid=id;
		$scope.searchParam.cityguid=guid;
		$location.search($scope.searchParam);
	}
	this.isCityActive=function(_cityid){
		console.log(_cityid==$location.search().cityid,_cityid,$location.search().cityid)
		return _cityid==$location.search().cityid;
	}


})

.controller('PopularCtrl', function($http,$location,$scope){
	var _self=this;
	this.city={};
	this.cityArray=[];
	this.resultList=[];

	$scope.searchParam=$location.search();
	
	if(!$scope.searchParam.startindex){
		$scope.searchParam.startindex=1;
		$scope.searchParam.endindex=10;
	}
	if(!$scope.searchParam.catids){
		$scope.searchParam.catids='2,4,5';
	}
	console.log($scope.searchParam);
	this.background='';
	console.log(_.isNumber($scope.searchParam.cityid));
	switch ($scope.searchParam.cityid){
		case '1739':{//nailart
			//$scope.searchParam.catids=11;
			_self.background="https://static.lookplex.com/images/1.2/assets/cities/noida/banner0.jpg";
			break;
		}
		case '1732':{//gym
			//$scope.searchParam.catids=3;	
			_self.background="https://static.lookplex.com/images/1.2/assets/cities/north%20delhi/banner0.jpg";	
			break;
		}
		case '1736':{//tattoo
			//$scope.searchParam.catids=14;
			_self.background="https://static.lookplex.com/images/1.2/assets/cities/ghaziabad/banner0.jpg";
			break;
		}	
		case '1738':{//central delhi
			//$scope.searchParam.catids=10;
			_self.background="https://static.lookplex.com/images/1.2/assets/cities/central%20delhi/banner0.jpg";
			break;
		}
		case '1734':{//mehendi
			//$scope.searchParam.catids=13;
			_self.background="https://static.lookplex.com/images/1.2/assets/cities/west%20delhi/banner0.jpg";
			break;
		}
		case '1735':{//spa
			//$scope.searchParam.catids=1;
			_self.background="https://static.lookplex.com/images/1.2/assets/cities/east%20delhi/banner0.jpg";
			break;
		}
		case '1740':{//salon
			//$scope.searchParam.catids=2;
			_self.background="https://static.lookplex.com/images/1.2/assets/cities/gurgaon/banner0.jpg";
			break;
		}	
		case '1733':{//makeup artist
			//$scope.searchParam.catids=8;
			_self.background="https://static.lookplex.com/images/1.2/assets/cities/south%20delhi/banner0.jpg";
			break;
		}
		case '1737':{//slimming cosmetology
			//$scope.searchParam.catids=6;
			_self.background="https://static.lookplex.com/images/1.2/assets/cities/faridabad/banner0.jpg";
			break;
		}	

		
	}/*switch end*/
	//$location.search($scope.searchParam);

	$("#modalspinner").modal('show');
	$http.get('/js/data/city.json')
	.success(function(data){
		_self.city=data;
		console.log(_self.city);
		_self.cityArray=_.values(_self.city)

		if(!$scope.searchParam.cityid){
			$scope.searchParam.cityid=_self.city.delhincr.cityid;
			$scope.searchParam.cityguid=_self.city.delhincr.cityguid;
			$location.search($scope.searchParam);		
		}

	})
	.finally(function(){
		$("#modalspinner").modal('hide');
	})
	
	//$scope.searchParam.catids=$scope.searchParam.catids.split(",");

	console.log($scope.searchParam);

	$("#modalspinner").modal('show');
	$http({
		url: 'https://storeapi.lookplex.com/ws/masnepservice/getsponsoredlistforAdvertisement', 
		method:'POST',
		data:$.param($scope.searchParam),
		headers:{
			'Content-Type': 'application/x-www-form-urlencoded' // 'text/plain' //'
		} 
		
	})
		.then(
			function(data){
				_self.resultList=data.data.storeList;
				//console.log(_self.resultList, data);
			},
			function(data){
				console.log(data);
			}
		)
	.finally(function(){
		$("#modalspinner").modal('hide');
	})


	this.getCityName=function(_cityid){
		var out="";
		angular.forEach(_self.city, function(val,key,object){
			if(val.cityid==_cityid){
				out=val.cityname;
			}
		})
		return out;
	}
	

	this.createLink=function(catid){
		//console.log(id, guid);
		$scope.searchParam.catids=catid;
		if(catid=='2'){$scope.searchParam.catids='2,4,5';};
		if(catid=='6'){$scope.searchParam.catids='6,7';};
		$location.search($scope.searchParam);
	}
	this.isCatActive=function(id){//check if category active
		//console.log($location.search());
		if($location.search().catids!=undefined && !_.isNumber($location.search().catids) && $location.search().catids.indexOf(",")>-1){
			return id == $location.search().catids.split(',')[0];
		}
		else{
			return id == $location.search().catids;
		}
	}


})


.controller('SearchResultCtrl', function( $scope, $rootScope, $http, $location){
	var that=this;

	this.resultList=[];
	this.brandList=[];
	this.aminityList=[];
	that.showLoadmore=false;
	//this.showFilters=$rootScope.showFilters;
	//console.log($location.search());
	
	$scope.searchParam=$location.search();
	
	$scope.$watch('searchParam', function(newval,oldval){
		$("#modalspinner").modal('show');
		$http({
	    	method: 'POST',
			url: 'https://storeapi.lookplex.com/ws/masnepservice/geftstores',
			data: $.param($scope.searchParam),//serialize
			headers: {
				'Content-Type': 'text/plain' //'application/x-www-form-urlencoded'//
			}
			})
	    	.success(function(data){
	    		console.log(data);
	    		that.resultList=data.storeList;
	    	})
	    	.error(function(error){
		    	console.log(error);
		    })
		    .finally(function(){
		    	$("#modalspinner").modal('hide');
		    })
		    ;
	})

	$("#modalspinner").modal('show');
	$http({
	    	method: 'POST',
			url: 'https://storeapi.lookplex.com/ws/masnepservice/getstores',
			data:$.param($location.search()),//serialize
			headers: {
				'Content-Type': 'text/plain' //'application/x-www-form-urlencoded'//
			}
			})
	    	.success(function(data){
	    		console.log(data);
	    		that.resultList.push(data.storeList);
	    		if(data.storeList.length<1){
	    			that.resultList=[];
	    		}
	    		if(data.count>$location.search().endindex){
	    			that.showLoadmore=true;	
	    		}
	    		else{
	    			that.showLoadmore=false;	
	    		}
	    		
	    		//$("#modalspinner").modal('hide');
	    	})
	    	.error(function(error){
		    	console.log('here' +error);
		    })
		    .finally(function(){
		    	$("#modalspinner").modal('hide');
		    })

	this.categories=$rootScope.categoriesList;
	/*if(this.categories[0].name!=='All'){// add all if not there
		this.categories.unshift({name:'All',id:0});	
	}
	*/


	this.isCatActive=function(id){//check if category active
		return id == $location.search().catid;
	}
	this.createLink=function(id){
		if(id==0){alert('The endpoint is unknown'); return false;}
		$scope.searchParam.catid=id;
		$location.search($scope.searchParam);
	}


	this.cs={left:false,right:true};//show next or previous
	
	this.toggleSF=function(){
		$rootScope.showFilters=!$rootScope.showFilters;
	}
	
	this.sr=function(){//Scroll Right
		if($(".categories").first().scrollLeft()===0){that.cs.left=false; }
		$(".categories").first().animate({scrollLeft:$(".categories").first().scrollLeft()+$(".categories").first().width()});
		that.cs.left=true;
	}
	this.sl=function(){//Scroll left

		console.log($(".categories").first().scrollLeft());
		$(".categories").first().animate({scrollLeft:$(".categories").first().scrollLeft()-$(".categories").first().width()});
		if($(".categories").first().scrollLeft()===0){that.cs.left=false; }
	}

	/*get brand and aminity filter lists*/

	$("#modalspinner").modal('show');
	this.getbrandaminityList=function(){
		$http.post('https://storeapi.lookplex.com/ws/masnepservice/getbrandaminityList',$.param({catid:$location.search().catid}))
		.then(
			function(data){
				that.brandList=data.data.brandlist;
				that.aminityList=data.data.aminitylist;
			},
			function(err){
				console.log(data);
			}
		)
		.finally(function(){
		    	$("#modalspinner").modal('hide');
		})
	}
	this.getbrandaminityList();

	this.loadmore=function(){
		$scope.searchParam.startindex=parseInt($scope.searchParam.endindex)+1;
		$scope.searchParam.endindex=parseInt($scope.searchParam.endindex)+10;
		$location.search($scope.searchParam);
	}


})




.controller('FilterCtrl', function( $location, $scope , $rootScope){
	var _self=this;
	var z=$location.search();
	
	this.filters={
		blockid: z.blockid,
		blockguid: z.blockguid,
		sortby: z.aminities,
		brandname: z.brandname? z.brandname:'',
		aminities: z.aminities? z.aminities:'',
		catid: z.catid,
		startindex: z.startindex,
		endindex: z.endindex,
		location: z.location,
		/*blockID: z.blockID? z.blockID:z.blockid,
		endIndex: z.endIndex?z.endIndex:z.endindex,*/
	}
	//console.log('routeParams below');
	//console.log(z);
	
	$scope.selectedGender=null;
	this.selectedBrand=[];
	this.selectedAminity=[];

	this.reset=function(){
		_self.filters.sortby='';
		_self.filters.aminities='';
		_self.filters.brandname='';
		$scope.selectedGender=null;
		_self.selectedBrand=[];
		_self.selectedAminity=[];
	}
/*if there is filters params insert it */
	if(z){
		console.log(z);
		if(z.aminities){
			_self.selectedAminity= z.aminities.split(',');
			for (var i = 0; i < _self.selectedAminity.length; i++) {
				_self.selectedAminity[i]=parseInt(_self.selectedAminity[i]);
			};
			console.log(_self.selectedAminity);
			if(_self.selectedAminity.indexOf(1)>-1 && _self.selectedAminity.indexOf(2)>-1){
				$scope.selectedGender="1,2";
			}
			else{
				if(_self.selectedAminity.indexOf(1)>-1){//if male
					$scope.selectedGender="1";
				}
				if(_self.selectedAminity.indexOf(2)>-1){//if female
					$scope.selectedGender="2";
				}
			}
			
		}
		if(z.brandname){_self.selectedBrand= z.brandname.split(',');}
		_self.filters.sortby=z.sortby;
		/*insert gender*/
	}
	console.log(_self.selectedAminity);

/*toggle brand*/
	this.toggleBrand=function(id){
		console.log(_self.selectedBrand.indexOf(id));

		if(_self.selectedBrand.indexOf(id)>-1){
			_self.selectedBrand.splice(_self.selectedBrand.indexOf(id),1);
		}
		else{
			_self.selectedBrand.push(id);	
		}
		/*update the selected brand */
		//console.log(_self.selectedBrand);
		_self.filters.brandname=_self.selectedBrand.join(",");
	}



/*toggle aminity*/
	this.toggleAminity=function(id){		
		if(_self.selectedAminity.indexOf(id)>-1){
			_self.selectedAminity.splice(_self.selectedAminity.indexOf(id),1);
		}
		else{
			_self.selectedAminity.push(id);
		}
		/*update the selected aminity */
		console.log(_self.selectedAminity);
		_self.filters.aminities=_self.selectedAminity.join(",");
	}

//this toggle day is used to toggle toggle day in aminity list using toggleAminity
	this.toggleday=function(){// error in syntax thats why doing this to add today aminity
		_self.toggleAminity(_self.getToday());
	}
	this.getToday=function(){
		var date=new Date(_.now());
		return date.getDay()+7; 
	}

/*watch gender value and update model accordingly*/
	$scope.$watch('selectedGender',function(newval,oldval){
		if(newval==undefined){console.log(newval, oldval); return false;}
		/*remove genders if present*/
		if(_self.selectedAminity.indexOf(1)>-1){
			_self.selectedAminity.splice(_self.selectedAminity.indexOf(1),1);
		}
		if(_self.selectedAminity.indexOf(2)>-1){
			_self.selectedAminity.splice(_self.selectedAminity.indexOf(2),1);
		}

		var genders=newval.split(',');
			for (var i = 0; i < genders.length; i++) {
				_self.toggleAminity(parseInt(genders[i]));
			}
		
	})


	this.submitFilter=function(){
		//debugger;
		console.log(_self.filters);
		$location.search(_self.filters);
		$rootScope.showFilters=false;
	}

})

.controller('SideBarCtrl', function($rootScope,$location,$anchorScroll,AuthService,SessionService){
	var _self=this;
	this.toggleSideBar=function(){
		$rootScope.sidebar=!$rootScope.sidebar;	
	}
	this.home=function(){
		$location.path('/').search({});
		_self.toggleSideBar();
	}
	this.discover=function(){
		if($location.path()!="/"){
			_self.home();
			$location.hash("discover");
			$anchorScroll();		
		}
		else{
			$location.hash("discover");
			$anchorScroll();
		}
	}
	this.isAuthenticated=function(){
		return AuthService.isloggedIn();
	}

	this.authuser=null;

	this.getUser=function(){

		if(_self.isAuthenticated()){
			_self.authuser= {
				username:SessionService.get('username'),
				profile_pic:SessionService.get('profile_pic')
			}
			return true;
		}
		else{
			return false;
		}
	}
	this.getUser();
})

.controller('LoginController', ['GooglePlus','$facebook','$http','AuthService','SessionService',
	function(GooglePlus, $facebook, $http,AuthService, SessionService){
	var _self=this;
	this.googlelogin = function () {
        GooglePlus.login().then(function (authResult) {
            console.log(authResult.access_token);

            GooglePlus.getUser().then(function (user) {
                console.log(user);
                
                AuthService.login(null, user.id, authResult.access_token, 'gplus');
                
                SessionService.set('username',user.name);
                SessionService.set('profile_pic',user.picture);
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
	        var userID=response.authResponse.userID;
	        var token=response.authResponse.accessToken;
	        AuthService.login(userID, null, response.authResponse.accessToken,'facebook');

	        $facebook.api("/me").then( 
		      	function(response) {
		        	this.welcomeMsg = "Welcome " + response.name;
		        	console.log(response);
		        	
		        	SessionService.set('username',response.name);	
		        	SessionService.set('profile_pic','http://graph.facebook.com/'+userID+'/picture?type=normal');
		      	},
		      	function(err) {
		        	this.welcomeMsg = "Please log in";
		        	console.log(this.welcomeMsg);
		      	}
		    );
		    

	      },
	      function(err) {
	        this.welcomeMsg = "Please log in";
	        console.log(err);
	      }
      );
    }

    

}])