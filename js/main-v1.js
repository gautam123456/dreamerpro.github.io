$(document).ready(function(e) {
	$(".chapter-list>div>.list>li").off("click");
	$(".chapter-list>div>.list>li").on("click",function(){
		$link=$(this).attr("data-link");
		$(".subject-about>div>div>p").slideUp("fast",function(){
				$(".subject-name").fadeIn("slow");
				$(".subject-menu>div.subject-about").animate({width:"0"},"slow",function(){
					$(".subject-name").css("display","block");
					$(".subject-menu>.chapter-list").animate({width:"25%"},"slow",function(){
						$(".subject-menu>.content-loader").animate({width:"75%"},"slow",function(){
							$(this).html("<iframe src='"+$link+"' width='100%' height='100%'></iframe>");
						});
					});
					
				});
			

		});
	});

	$(".subject-name>i").off("click");
	$(".subject-name>i").on("click",function(){
		$(".subject-menu>.content-loader").animate({width:"0"},"slow",function(){
			$(this).html("");
			$(".subject-menu>.chapter-list").animate({width:"50%"},"slow",function(){
				$(".subject-name").css("display","none");
				$(".subject-menu>div.subject-about").animate({width:"50%"},"slow",function(){
					$(".subject-about>div>div>p").slideDown("fast",function(){
				
						});
				});
			});
		});
	});

	$("ul.list>li").off('mouseover');
	$("ul.list>li").on('mouseover', function(){
		$clogo=$(this).attr('data-logo');
		//alert($clogo);
		$(".subject-about>div>div>img").attr("src", "images/chapterlogo/"+$clogo+".svg");
	})
	
		
})