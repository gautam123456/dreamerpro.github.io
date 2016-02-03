angular.module('lookplex')
.controller('ShowController', function(){
	var that=this;
	//http get data
	that.data={
		name:'Affinity',
		aminities:['a','b']
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



.controller('SearchResultCtrl', function($routeParams, $scope, $rootScope){
	var that=this;
	this.query=$routeParams.query;
	this.place="Malviya Nagar";
	
	//this.showFilters=$rootScope.showFilters;
	
	
	
	this.categories=[
		{name:'All',id:0},
		{name:'Salon',id:1},
		{name:'Spa',id:2},
		{name:'Gym',id:3},
		{name:'Slimming & Cosmetology',id:4},
		{name:'Makeup Artists',id:5},
		{name:'Dietitian and Nutritionists',id:6},
		{name:'Tatto & Piercing',id:7},
		{name:'Yoga & Aerobics',id:8},
		{name:'Nail Art',id:9},
		{name:'Mehendi',id:10},
	];
	this.cs={left:false,right:true};//show next or previous
	
	this.toggleSF=function(){
		//console.log($rootScope.showFilters);
		//that.showFilters=!that.showFilters;
		$rootScope.showFilters=!$rootScope.showFilters;
	}
	
	/*$scope.$watch('that.cs.left',function(newval,oldval){
		console.log(newval, oldval);
	});
	*/this.sr=function(){//Scroll Right
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