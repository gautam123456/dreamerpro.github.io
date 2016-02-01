angular.module('lookplex')
.controller('HomeController', function ($scope) {
	var that =this;
	this.sm_popular=true;
	this.sm_hp=true;
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
})