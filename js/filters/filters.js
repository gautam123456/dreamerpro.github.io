angular.module('lookplex')
.filter('cat_filter', function() {
	//var option={name:'D\'',types:[],locations:[]};
	
	return function(objects,option){
		var out=[];
		var z=true;

		if(objects==undefined) {return objects;}
		
		out=objects.split(',');
		
		for (var i = out.length - 1; i >= 0; i--) {
			if(out[i]==="sp"){out[i]="Spa";}
			else if(out[i]==="sp"){out[i]="Spa";}
			else if(out[i]==="sa"){out[i]="Salon";}
			else if(out[i]==="gy"){out[i]="Gym";}
			else if(out[i]==="bp"){out[i]="Beauty Parlour";}
			else if(out[i]==="pbm"){out[i]="Party & Bridal Makeup";}//Dietitians & Nutritionists
			else if(out[i]==="ya"){out[i]="Yoga & Aerobics";}
			else if(out[i]==="na"){out[i]="Nail Art";}
			else if(out[i]==="md"){out[i]="Mehendi";}
		};
		
		return out.join(" | ");
	}

})//time_filter
.filter('time_filter', function() {
	//var option={name:'D\'',types:[],locations:[]};
	
	return function(objects,option){
		var out=[];
		if(objects==undefined) {return objects;}
		if(objects.indexOf("OFF")>-1){return "OFF";}

		out=objects.split('');
		out.splice(2,0,":");
		out.splice(9,0,":");
		return out.join("");
	}

})