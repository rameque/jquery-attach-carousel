// JavaScript Document
var my$ = jQuery.noConflict();

my$(document).ready(function(){
	
	my$('#carousel').carousel({
		imagesSrc:[
			"http://farm4.staticflickr.com/3262/2637738608_cd08444c16_z.jpg?zz=1",
			"http://farm8.staticflickr.com/7015/6732113099_82c49e3f96_b.jpg",
			"http://farm4.staticflickr.com/3321/3218767521_e13854af6f_b.jpg",
			"http://farm4.staticflickr.com/3606/3381786063_0d1f321511_o.jpg",
			"http://farm5.staticflickr.com/4018/4570774063_648e4d08b0_b.jpg",
			"http://farm3.staticflickr.com/2404/1823941067_814417d30a_o.jpg"
		],
		scale:[
			'100%',
			'100%',
			'50%',
			'10%'
		],
		initPos:0,
		timer:5000,
		reverse:true,
		onChange:responseChange,
		stopOver:true
		});
		my$('#remove-pattern').attr('href','javascript:;');
		my$('#remove-pattern').click(function(){
			
			if(my$(this).html() == 'Remove Pattern'){
				my$(this).html('Add Pattern');
				my$('.ui-carousel-pattern').slideUp();
			}else{
				my$(this).html('Remove Pattern');
				my$('.ui-carousel-pattern').slideDown();
			}
			
		});
		my$('#goto').attr('href','javascript:;');
		my$('#goto').click(function(){
			my$('#carousel').carousel({slide:position}).carousel('gotoSlide');
		});
		
		prettyPrint();
	
});

var position = 6;

function responseChange(pos){
	my$('#counter').html('Position onChange: '+pos);
}