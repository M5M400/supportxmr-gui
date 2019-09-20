var nav = '',
	addr = getUrlVars()['addr'] || '',
	mode = 'light',
	cmde = '-l',
	resizeTimer,
	updateTimer = 60,
	updateCounter,
	now = Math.round((new Date()).getTime() / 1000),
	width = $('body').width(),
	tooltip_open = '',
	APICon = 'y',
	xmrreg = /^[4|8]([0-9]|[A-B])(.){93}/,
	//Account Memory
	$AC = {},
	//Cookie Memory
	$CK = {'addr':{}, 'pref':'LNA'},
	//Data Digests	
	$DT = {'block':{}, 'blockhistory':{}, 'net':{}, 'pool':{}, 'poolstats':{}, 'pay':{}, 'poolpay':{}, 'netheight':''},
	//Graph Points	
	$PT = {'block':{}, 'net':{}, 'pool':{}, 'miner':{}},
	//Parameters
	$PR = {
		'net':{'res':10,'hrs':8,'updt':0},
		'pool':{'updt':0},
		'miner':{'hrs':8,'updt':0},
		'wrkr':{'sort':'name','ord':'A','updt':0,'wupdt':0}
	},
	//Icons
	$ICO = {
		'light':'<svg viewBox="0 0 99 99"><circle opacity=".5" cx="48.9" cy="48.9" r="31.6"/><path d="M98.6 58.4L87.9 49l10.3-9.8c.5-.6.5-2.1-.6-2.4l-13.7-4 5-13.2c.5-1.2-.5-2.1-1.5-2L73.3 20 72 6C72 4.4 70.8 4 70 4.7l-11.8 8L51 .5c-.6-.7-1.9-.7-2.5 0l-8.2 14-14.2-8C25 5.6 24 6.3 24 7.6v14.1L9.7 20.7c-1.4-.1-1.9 1-1.4 2l6 12.8-13.3 5C-.3 41-.3 42 .6 43l11 9L1.7 62c-1 1-.5 2.1.7 2.4L16.3 68l-4.6 13.4c-.4 1 .5 2.2 1.7 1.9l14-2.8 1.7 14c.1 1.4 1.7 1.7 2.3 1L42.8 87l7.6 11.6c.6.7 2 .7 2.5-.1l6.7-12.1 12 7.6c1.1.6 2.2 0 2.3-1.2l.5-14.1 14.2 1.7c1.3.1 2-1 1.5-2l-5.6-13 13.6-4.5c1.1-.5 1.1-1.8.5-2.4zm-49.4 21a30.1 30.1 0 1 1 0-60.3 30.1 30.1 0 0 1 0 60.2z"/></svg>',
		'dark':'<svg viewBox="0 0 99 99"><path d="M25.2 19.6l5.3 10.6 11.7 1.7-8.5 8.3 2 11.6-10.5-5.5-10.4 5.5 2-11.6-8.5-8.3L20 30.2l5.2-10.6zm29.6-3.4l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.5 2.9 1-6-4.3-4.3 6-1 2.8-5.4zM64.8 0A46 46 0 0 1 0 64.4 50.9 50.9 0 1 0 64.6 0z"/></svg>',
		'settings':'<svg viewBox="1 0 99 99"><path d="M33.58 66.5c0-7.79-5.53-14.28-12.88-15.76V10.92a1 1 0 0 0-1-1h-4.4a1 1 0 0 0-1 1v39.82a16.09 16.09 0 0 0 0 31.52v5.82a1 1 0 0 0 1 1h4.4a1 1 0 0 0 1-1v-5.82A16.09 16.09 0 0 0 33.58 66.5zM17.5 76.08a9.58 9.58 0 1 1 0-19.16 9.58 9.58 0 0 1 0 19.16zm49.08-43.75c0-7.79-5.53-14.28-12.88-15.76V1a1 1 0 0 0-1-1h-4.4a1 1 0 0 0-1 1v15.57a16.09 16.09 0 0 0 0 31.53V98a1 1 0 0 0 1 1h4.4a1 1 0 0 0 1-1V48.1a16.09 16.09 0 0 0 12.88-15.77zM50.5 41.92a9.58 9.58 0 1 1 0-19.17 9.58 9.58 0 0 1 0 19.17zM99.58 56.5c0-7.79-5.53-14.28-12.88-15.76V10.92a1 1 0 0 0-1-1h-4.4a1 1 0 0 0-1 1v29.82a16.09 16.09 0 0 0 0 31.52v15.82a1 1 0 0 0 1 1h4.4a1 1 0 0 0 1-1V72.26A16.09 16.09 0 0 0 99.58 56.5zM83.5 66.08a9.58 9.58 0 1 1 0-19.16 9.58 9.58 0 0 1 0 19.16z"/></svg>',
		'loader':'<svg viewBox="0 0 99 99"><path class="L1 C1fl" d="M66 6l10 14-14 11-10-14L66 6"/><path class="L2 C1fl" d="M41 25l11 14-14 11-11-14 14-11"/><path class="L3 C1fl" d="M60 50l11 13-14 11-11-14 14-10"/><path class="L4 C1fl" d="M37 68l10 14-14 11-10-14 14-11"/><path d="M58 40L42 19 21 35l16 21 21-16zM41 25l11 14-14 11-11-14 14-11zm42-4L66 0 45 16l17 21 21-16zM66 6l10 14-14 11-10-14L66 6zM16 78l17 21 21-16-17-21-21 16zm17 15L23 79l14-11 10 14-14 11zm7-33l16 21 21-17-16-21-21 17zm17 14L46 60l14-10 11 13-14 11z"/></svg>',
		'loader_stopped':'<svg viewBox="0 0 99 99"><path d="M58.2 39.9L42 19 21.1 35.3l16.3 20.9 20.8-16.3zm24.4-19L66.3 0 45.4 16.3l16.3 20.9 20.9-16.3zM16.4 78L32.7 99l20.9-16.3-16.3-20.9-20.9 16.3zm23.7-18.4l16.3 20.8 20.8-16.3L61 43.3 40.1 59.7z"/></svg>',
		'arrow':'<svg viewBox="0 0 99 99"><path d="M27 78l28-29-28-28C17 10 33-8 45 4l35 37c5 5 5 12 0 17L45 95c-12 12-29-6-18-17z"/></svg>',
		'sort':'<svg viewBox="0 0 99 99"><path d="M56 45L35 25 15 45C8 52-6 40 3 32L29 6c4-3 9-3 12 0l27 26c9 8-4 20-12 13zm-13 9l21 20 20-20c7-7 21 5 12 13L70 93c-4 3-9 3-12 0L31 67c-9-8 4-20 12-13z"/></svg>',
		'refresh':'<svg viewBox="0 0 99 99"><path d="M0 55.7v31l9.2-8.5a49.5 49.5 0 0 0 89.4-22.5H86.1a37.1 37.1 0 0 1-67.7 14l15.3-14H0zM49.5 0C24.3 0 3.5 18.9.4 43.3h12.5a37.1 37.1 0 0 1 68.3-13.1L68.1 43.3H99v-31l-8.9 9A49.4 49.4 0 0 0 49.5 0z"/></svg>',
		'plus':'<svg viewBox="0 0 99 99"><path d="M99 77L71 50l28-28L77 0 50 28 22 0 0 22l28 28L0 77l22 22 28-28 27 28"/></svg>',
		'delete':'<svg viewBox="0 0 98 98"><path d="M81.8 27H15.2c-8 0-8-12.8-1-12.8 0 0 12.7 2 15.7-10.8 0-3 2.8-4 4.8-4h27.4c2 0 4 1 5 4C69 17 82.7 14.2 82.7 14.2c7 0 7 12.7-1 12.7zm-45 59.7c0 5-8 5-8 0v-43s8-5 8 0v43zm15.6 0c0 5-7.8 5-7.8 0v-43s7.8-5 7.8 0v43zm15.7 0c0 5-7.7 5-7.7 0v-43s7.8-5 7.8 0v43zm11-54H18c-4.8 0-7.7 3-6.7 8l6.8 50c1 4 5 7.8 9 7.8h43c4 0 9-3 9-8l6.7-49.8c0-5-3-8-6.8-8z"/></svg>',
	},
	loadgrp = '<div class="center"><div class="bigbtn C1fl shimtop30 o7"><div class="Loader">'+$ICO['loader']+'</div></div></div>';

$(function(){
	//Populate Icons
	$('#HeadToggle').append($ICO['dark']);
	$('#HeadTimer').html('<div class="C1fl preload">'+$ICO['refresh']+'</div>');
	$('#ModalClose').append($ICO['plus']);
	
	//Read Cookie & Instantiate
	CookieRead();
	if(addr == '' && $CK['addr'][0]) addr = $CK['addr'][0];
	if(mode === 'light' && $CK['pref'] && $CK['pref'].charAt(0) === 'D'){
		mode = 'dark';
		cmde = '-d';
		ToggleMode();
	}
	
	pge_Home();
	TimerUpdateData();
	
	//Bindings
	$(window).on('resize', function(){
		Resize();
	});
	$(document.body).on('change', '#MinerAddress, #MinerAddrRecent', function(e){
		addr = $(this).val();
		$('#MinerAddress').val(addr);
		reset_MinerAccount();
		if(xmrreg.test(addr)){
			CookieAddrEdit(addr, 'add');
			$('#MinerAddress').removeClass('C4');
			load_MinerAccount();
		}else{
			$('#MinerAddress').addClass('C4');
			$('#MinerGraph').html('<div class="MinerMsg C3'+cmde+'"><div class="textmed">Invalid Monero Address</div><div class="LR80 text shim10">Double check that your address is complete.</div></div>');
		}
	});
	$('#Stage').on('touchstart click', '#MinerAddrDelete', function(e){
		e.stopPropagation();
		CookieAddrEdit($('#MinerAddress').val(), 'del');
	});
	$(document.body).on('change', '.navbox', function(e){
		var $T = $(this), val = $T.val();
		if(val === 'testnet'){
			$T.val('home');
			LoadAlert('NetGraph');
		}else if(val === 'testuser'){
			$T.val('home');
			LoadAlert('MinerGraph');
		}else if(val === 'testmsg'){
			var ins = '<div class="text center">Test Message</div>';
			$('#Announcements').removeClass('hide').html(ins);
		}else{
			Navigate(val);
		}
	});
	$(document.body).on('touchstart click', '.nav', function(e){
		e.stopPropagation();
		Navigate($(this).attr('data-tar'));
	});
	$('header').on('click', '#HeadToggle', function(e){
		e.stopPropagation();
		mode = (mode === 'dark') ? 'light' : 'dark';
		cmde = (mode === 'dark') ? '-d' : '-l';
		ToggleMode();
		CookiePrefEdit('mode', mode.charAt(0).toUpperCase());
	});
	$('header').on('mouseenter', '#HeadTimer', function(){
		$('#HeadTimerRefresh').removeClass('hide');
	}).on('mouseleave', '#HeadTimer', function(){
		$('#HeadTimerRefresh').addClass('hide');
	});
	$('header').on('touchstart click', '#HeadTimer', function(e){
		e.stopPropagation();
		$('#HeadTimer').html('<div class="C1fl preload" style="padding:5px;box-sizing:border-box">'+$ICO['refresh']+'</div>');
		setTimeout(function(){
			TimerUpdateData();
		}, 1500);
	});
	$('#Stage').on('touchstart click', '#MinerPaymentsBtn', function(e){
		e.stopPropagation();
		if(addr && $AC[addr]){
			LoadMinerPayments();
		}
	});
	$('#Stage').on('touchstart click', '.WorkerSort', function(e){
		e.stopPropagation();
		var $T = $(this);
		CookiePrefEdit('sort', $T.attr('data-col').charAt(0).toUpperCase()+$T.attr('data-ord'))
		init_MinerWorkers();
	});
	$(document.body).on('click', '.WBlock', function(e){
		e.stopPropagation();
		var $T = $(this),
			$P = $T.parent('.WWrap');
			
		if($P.hasClass('WExpand')){
			$P.removeClass('WExpand');
			$T.find('.Expand').addClass('hide');
		}else{
			$P.addClass('WExpand');
			$T.find('.Expand').removeClass('hide');
			load_MinerWorkerDetail($T.attr('data-key'));
		}
	});
	$(document.body).on('click', '#ModalClose, #ModalScreen', function(e){
		e.stopPropagation();
		CloseModal();
	});
	$(document.body).on('touchstart click', '.blockgroup', function(e){
		e.stopPropagation();
		var xid = $(this).attr('data-block');
		NetGraphPop(xid);
		tooltip_open = xid;
	});
	$(document.body).on('touchstart click', '#NetGraphClose', function(e){
		e.stopPropagation();
		CloseToolTip($(this).attr('data-block'));
		tooltip_open = '';
		$('#NetGraphPop').remove();
	});
	$(document.body).on('mouseenter', '.blockgroup', function(){
		OpenToolTip($(this).attr('data-block'));
	}).on('mouseleave', '.blockgroup', function(){
		CloseToolTip($(this).attr('data-block'));
	});

	$(document.body).on('change', '.PagBox, .PagSel', function(e){
		var $T = $(this),
			$P = $T.closest('.Pag'),
			fn = $P.attr('id'),
			pge = ($T.hasClass('PagBox')) ? $T.val().replace(/\D/g,'') : $P.find('.PagBox').val(),
			lim = ($T.hasClass('PagSel')) ? $T.val() : $P.find('.PagSel').val();
			
		if(fn === 'PaymentPag'){
			dta_Payments(pge, lim);
		}else if(fn === 'BlocksPag'){
			dta_Blocks(pge, lim);
		}
	});
	$(document.body).on('keyup', '.PagBox', function(e){
		PaginationBoxWidth($(this));
	});
	$(document.body).on('touchstart click', '.PagBtn', function(e){
		e.stopPropagation();
		var $T = $(this),
			$P = $T.closest('.Pag'),
			fn = $P.attr('id'),
			pge = $T.attr('data-page'),
			lim = $P.find('.PagSel').val();
			
		if(fn === 'PaymentPag'){
			dta_Payments(pge, lim);
		}else if(fn === 'BlocksPag'){
			dta_Blocks(pge, lim);
		}
	});	
	$(document.body).on('touchstart click', '.helpbtn, .helpbtntext', function(e){
		e.stopPropagation();
		var $T = $(this).closest('.helpgroup'), $B = $T.find('.helpbtn');
		if($B.hasClass('helpbtn-expanded')){
			$T.find('.helpteaser').removeClass('hide');
			$T.find('.helpcontent').addClass('hide');
			$B.removeClass('helpbtn-expanded');
		}else{
			$T.find('.helpteaser').addClass('hide');
			$T.find('.helpcontent').removeClass('hide');
			$B.addClass('helpbtn-expanded');
		}
	});
	$(document.body).on('mouseenter', '.helpbtntext, .helpbtn', function(){
		var $T = $(this).closest('.helpgroup');
		$T.find('.helpbtntext').removeClass('C1').addClass('C2');
		$T.find('.helpbtn').removeClass('C1fl').addClass('C2fl');
	}).on('mouseleave', '.helpbtntext, .helpbtn', function(){
		var $T = $(this).closest('.helpgroup');
		$T.find('.helpbtntext').removeClass('C2').addClass('C1');
		$T.find('.helpbtn').removeClass('C2fl').addClass('C1fl');
	});
});

function MainLoaderOn(){
	$('#HeadLogoMark').addClass('Loader').html($ICO['loader']);
}
function MainLoaderOff(){
	$('#HeadLogoMark').removeClass('Loader').html($ICO['loader_stopped']);
}
function LoadAlert(tar){
	APICon = 'n';
	var msg = '';
	if(tar === 'NetGraph'){
		msg = 'Network API Connection Error';
		$('#NetGraph svg').addClass('o3');
	}else if(tar === 'MinerGraph'){
		msg = 'Miner API Connection Error';
		$('#MinerGraph svg, #MinerWorkers').addClass('o3');
	}else{
		return false;
	}
	if(tar && msg){
		$('#'+tar).append('<div class="AlertAPI C0bk'+cmde+' C4br"><div class="textmed C4 center">'+msg+'</div><div class="texttable C3'+cmde+' center">Reporting will resume soon.</div></div>');
	}
}
function ClearAlert(){
	APICon = 'y';
	$('#NetGraph svg, #MinerGraph svg, #MinerWorkers').removeClass('o3');
	$('.AlertAPI').remove();
}
function LoadTimer(){
	clearInterval(updateCounter);
	$('#HeadTimer').html('<div id="HeadTimerPie"><div id="HeadTimerCenter" class="C0bk'+cmde+'"></div><div id="HeadTimerText" class="texttinysvg C1">60</div></div>'+
		'<div id="HeadTimerRefresh" class="C2fl C0bk'+cmde+' hide">'+$ICO['refresh']+'</div>');

	updateCounter = setInterval(function(){
		if(document.hasFocus()) updateTimer--;
		if(updateTimer <= 0){
			$('#HeadTimer').html('<div class="C1fl preload">'+$ICO['refresh']+'</div>');
			clearInterval(updateCounter);
			setTimeout(function(){
				//this delay stretches the number of lookups a bit
				TimerUpdateData();
			}, 1500);
		}else{
			var txt = (APICon === 'y') ? updateTimer : '<div class="C4fl">'+$ICO['plus']+'</div>',
				clr = (mode === 'dark') ? '313131' : 'e8e8e8',
				grd = 'linear-gradient('+(-90 + (360 * updateTimer / 60))+'deg, transparent 50%, #F06A25';
				
			if(updateTimer < 30) grd = 'linear-gradient('+(90 + (360 * updateTimer / 60))+'deg, transparent 50%, #'+clr;
			$('#HeadTimerPie').css('background-image', grd+' 50%),linear-gradient(90deg, #'+clr+' 50%, transparent 50%)');
			$('#HeadTimerText').html(txt);
		}
	}, 1000);
}

function TimerUpdateData(){
	ClearAlert();
	$.when(dta('netheight'),dta('block'),dta('net'),dta('pool')).then(function(){
		graph_MainNet();
		load_MinerAccount();
		updateTimer = 60;
		LoadTimer();
	});
}
function Resize(){
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(function(){
		width = $('body').width();
		graph_MainNet();
		graph_Miner();
		setTimeout(function(){
			XMRHashTruncate();
			init_MinerWorkers();
		}, 400);
	}, 250);
}
function ToggleMode(){
	var $CL = ['C0','C0fl','C0bk','C0st','C3','C3fl'],
		$C = {'light':{'f':'454545','b':'efefef'},'dark':{'f':'b3b3b3','b':'3b3b3b'}},
		bt = (mode === 'dark') ? 'light' : 'dark';

	$('.C0-l,.C0-d').css('color', '#'+$C[mode]['b']);
	$('.C0fl-l,.C0fl-d').css('fill', '#'+$C[mode]['b']);	
	$('.C0bk-l, .C0bk-d').css('background-color', '#'+$C[mode]['b']);
	$('.C3-l, C3-d').css('color', '#'+$C[mode]['f']);
	$('.C3fl-l, .C3fl-l').css('fill', '#'+$C[mode]['f']);
	$('#HeadToggle').html($ICO[bt]);

	$.each($CL,function(k, v){
		$('.'+v+'-'+bt.charAt(0)).each(function(){
			$(this).removeClass(v+'-'+bt.charAt(0)).addClass(v+'-'+mode.charAt(0));
		});
	});
}
function CookieRead(){
	var cka = $.cookie('SupportXMRAddr'), ckp = $.cookie('SupportXMRPref'), i = 0, $ADR = {};
	if(cka){
		if(cka.indexOf('#') >= 0){						//multi address
			var cka_Arr = cka.split('#');
			$.each(cka_Arr,function(k, v){
				$ADR[i] = v;
				i++;
			});
		}else{											//single address
			$ADR[0] = cka;
		}
	}
	if(ckp) $CK['pref'] = ckp;
	$CK['addr'] = $ADR;
}
function CookieAddrEdit(adr, mde){
	var $CKtmp = {}, fin = '', i = 0;
	if(mde === 'add'){
		$CKtmp[0] = adr;
		fin = adr;
		i++;
	}
	if($CK['addr'] && Object.keys($CK['addr']).length > 0){
		$.each($CK['addr'],function(k, v){
			if(i < 25 && v !== adr){
				$CKtmp[i] = v;
				fin += (i !== 0) ? '#'+v : v;
				i++;
			}
		});
	}else{
		fin = adr;
	}
	$CK['addr'] = $CKtmp;
	if(mde === 'del'){
		reset_MinerAccount();
		if($CK['addr'][0]){
			addr = $CK['addr'][0];
			$('#MinerAddress').val(addr);
		}
		load_MinerAccount();
	}
	$.removeCookie('SupportXMRAddr', { path: '/' });
	$.cookie('SupportXMRAddr', fin, {expires:365, path:'/'});
	MultipleAddress();
}
function CookiePrefEdit(col, val){
	var mde = ($CK['pref'][0] === 'D') ? 'D' : 'L',
		srt = ($CK['pref'][1] === 'R') ? 'R' : 'N',
		ord = ($CK['pref'][2] === 'D') ? 'D' : 'A',
		srtord = srt+ord;

	if(col === 'mode'){
		mde = val;
	}else if(col === 'sort'){
		srtord = val;
	}

	$CK['pref'] = mde+srtord;
	$.removeCookie('SupportXMRPref', { path: '/' });
	$.cookie('SupportXMRPref', mde+srtord, {expires:365, path:'/'});
}

function MultipleAddress(){
	$('#MinerAddrRecent, #MinerAddrDelete').remove();
	if($CK['addr'] && Object.keys($CK['addr']).length > 1){
		//Check for multiple addresses
		ins = '<select id="MinerAddrRecent" class="FLD C3'+cmde+' texttinysvg"><option value="">Recent</option>';
		$.each($CK['addr'],function(k, v){
			ins += '<option value="'+v+'">'+v.substring(0, 3)+'...'+v.substr(v.length - 4)+'</option>';
		});
		$('#MinerAddress').addClass('MinerAddressMulti');
		$('#MinerAddressCell').prepend(ins+'</select><div id="MinerAddrDelete" class="C1fl C2fl_hov">'+$ICO['delete']+'</div>');
	}else{
		$('#MinerAddress').removeClass('MinerAddressMulti');
	}
}
function OpenModal(){
	$('#Modal, #ModalScreen').removeClass('hide');
}
function CloseModal(){
	$('#Modal, #ModalScreen').addClass('hide');
}
function Navigate(tar){
	MainLoaderOn();
	$('#Stage').removeClass('StageFade');
	$('.nav').each(function(){$(this).removeClass('o5')});
	setTimeout(function(){
		if(tar === 'blocks' || tar === 'payments' || tar === 'help'){
			$('#Stage, #NetGraph').addClass('short');
			if(tar === 'blocks'){
				pge_Blocks();
			}else if(tar === 'payments'){
				pge_Payments();
			}else if(tar === 'help'){
				pge_Help();
			}
			graph_MainNet();
		}else{
			tar === 'home';
			$('#Stage, #NetGraph').removeClass('short');
			pge_Home();
			graph_MainNet();
			load_MinerAccount();
		}
		$('#HeadMenu select').val(tar);
		$('.nav[data-tar="'+tar+'"]').addClass('o5');
	}, 300);
}
function Pagination(tar, lim, tot, pge){
	pge = (pge > 1) ? parseInt(pge) : 1;
	lim = (lim >= 25) ? lim : 25;
	var $T = $('#'+tar),
		pgs = Math.ceil(tot / lim),
		cls = 'textmed',
		prevpage = (pge >= 2) ? pge - 1 : 1,
		nextpage = (pge < pgs) ? pge + 1 : pgs,
		lclss = 'C1fl',
		rclss = 'C1fl';
		
	if(pge == 1){
		lclss = 'C2fl o5';
	}else if(pge == pgs){
		rclss = 'C2fl o5';
	}
	if(width < 700){
		cls = 'texttable';
	}else if(width < 600){
		cls = 'texttiny';
	}
	$T.html('<table><tr>'+
		'<td><div class="PagBtn" data-page="'+prevpage+'"><div class="'+lclss+' rot180">'+$ICO['arrow']+'</div></div></td>'+
		'<td><input type="text" class="PagBox texttable C1 C1br" value="'+pge+'" autocomplete="off" data-tot="'+pgs+'"></td>'+
		'<td class="'+cls+' C3'+cmde+'">of '+ConvNum(pgs)+' Pages</td>'+
		'<td><select class="PagSel texttable C1 C1br"><option>25</option><option>50</option><option>100</option></select></td>'+
		'<td><div class="PagBtn" data-page="'+nextpage+'"><div class="'+rclss+'">'+$ICO['arrow']+'</div></div></td>'+
	'</tr></table>');
	$T.find('.PagSel').val(lim);
	PaginationBoxWidth($T.find('.PagBox'));
}
function PaginationBoxWidth($T){
	var val = $T.val().replace(/\D/g,''),
		tot = parseInt($T.attr('data-tot')),
		wid = 19;

	if(val > 999){
		wid = (val > 9999) ? 50 : 42;
		if(val > tot) val = tot;
		val = ConvNum(val);
	}else if(val > 99){
		wid = 32;
	}else if(val > 9){
		wid = 24;
	}
	$T.css('width', wid+'px').val(val);
}

function pge_Home(){
	var ins = '<section id="MinerAccount">'+
		'<table class="LR85 shim20 TDPadS C3'+cmde+'"><tr>'+
			'<td width="99%"><div class="hbar"></div><div id="MinerAddressCell"><input id="MinerAddress" type="text" class="FLD text C3'+cmde+'" placeholder="Your Monero Address..." value="'+addr+'"></div><div class="hbar"></div></td>'+
			'<td><div id="MinerAccountPending" class="textlrg">--</div><div class="hbar shim2"></div><div class="texttiny C2 center">XMR Pending</div></td>'+
			'<td><div id="MinerPaymentsBtn" class="btnback nopoint"><div class="Loader C1fl">'+$ICO['loader']+'</div></div></td>'+
			'<td><div id="MinerAccountPaid" class="textlrg">--</div><div class="hbar shim2"></div><div class="texttiny C2 center">XMR Paid</div></td>'+
		'</tr></table>'+
		'</section>'+
		'<div class="hbar"></div>'+
		'<section id="MinerGraph"></section>'+
		'<section id="MinerWorkers">'+
			'<table class="TDPadM LR85 C3'+cmde+'"><tr>'+
				'<td width="33%" class="center"><div id="MinerHashes" class="textlrg o5">--</div><div class="hbar LR80 o5 shim2"></div><div class="texttiny C2">Total Hashes</div></td>'+
				'<td width="33%" class="center"><div id="MinerWorkerCount" class="textlrg o5">--</div><div class="hbar LR80 o5 shim2"></div><div id="MinerLastHash" class="texttiny C2 o5">--</div></td>'+
				'<td width="33%" class="center"><div id="MinerShares" class="textlrg o5">-- / --</div><div class="hbar LR80 o5 shim2"></div><div class="texttiny C2">Valid / Invalid Shares</div></td>'+
			'</tr></table>'+
			'<div id="MinerWorkersList" class="LR85 shimtop20">'+loadgrp+'</div>'+
		'</section>';

	$('#Stage').html(ins).addClass('StageFade');
}

function load_MinerAccount(){
	if(addr && xmrreg.test(addr)){
		$.when(dta('account')).done(function(a){
			if($AC[addr]){
				graph_Miner();
				MultipleAddress();
				$('#MinerAccountPending').removeClass('o5').html($AC[addr]['due']);
				$('#MinerAccountPaid').removeClass('o5').html($AC[addr]['paid']);
				$('#MinerHashes').removeClass('o5').html(ConvNum($AC[addr]['hashes']));
				$('#MinerShares').removeClass('o5').html(ConvNum($AC[addr]['val'])+' / '+ConvNum($AC[addr]['inv']));
				$.when(dta('workers', addr)).done(function(a){
					var wcn = ($AC[addr]['wrkrs'] && Object.keys($AC[addr]['wrkrs']).length > 0) ? Object.keys($AC[addr]['wrkrs']).length : 0,
						lbl = (wcn === 1) ? 'Worker' : 'Workers';
						
					$('#MinerPaymentsBtn').removeClass('nopoint C0fl'+cmde).addClass('C1fl C2fl_hov').html($ICO['settings']);
					$('#MinerWorkerCount').removeClass('o5').html(wcn+' '+lbl);
					$('#MinerLastHash').html('--');
					init_MinerWorkers();
				});
			}else{
				reset_MinerAccount();
				$('#MinerGraph').html('<div class="MinerMsg C3'+cmde+'"><div class="textmed">Address Not Found</div><div class="LR80 text shim10">If you\'ve submitted your first share, be patient, it may take a minute or two to update. If your shares are being rejected, visit the <u class="nav C1 C2_hov" data-tar="help">help section.</u></div></div>');
			}
			MainLoaderOff();
		});
	}else{
		console.log('welcome');
		reset_MinerAccount();
		$('#MinerGraph').html('<div class="MinerMsg C3'+cmde+'">'+
			'<div class="textmed">Welcome to SupportXMR.com</div>'+
			'<div class="LR80 text shim10">Visit the <u class="nav C1 C2_hov" data-tar="help">help section</u> to get setup, then enter your Monero address above. After you\'ve submitted a share, your information will appear here.</div>'+
		'</div>');
	}
}
function reset_MinerAccount(){
	$('#MinerWorkersList, #MinerGraph').html('');
	$('#MinerPaymentsBtn').removeClass('C1fl').addClass('nopoint').html('<div class="C2fl o5">'+$ICO['settings']+'</div>');
	$('#MinerAccountPending, #MinerAccountPaid, #MinerHashes, #MinerShares').addClass('o5').html('--');
	$('#MinerLastHash').addClass('o5').html('');
	$('#MinerShares, #MinerWorkerCount').addClass('o5').html('-- / --');
}
function init_MinerWorkers(resort){
	if($AC[addr]['wrkrs']){
		var $W = $AC[addr]['wrkrs'],
			i = 0,
			ins = '<table id="WorkerSortGroup" class="TDPadS texttiny C2 hide"><tr>'+
				'<td><div class="WorkerSort C2bk C0fl'+cmde+'" data-col="name" data-ord="D">'+$ICO['sort']+'</div></td>'+
				'<td NOWRAP>Sort by Name</td>'+
				'<td width="99%"></td>'+
				'<td NOWRAP>Sort by Hashrate</td>'+
				'<td><div class="WorkerSort C2bk C0fl'+cmde+' nopoint" data-col="rate" data-ord="D">'+$ICO['sort']+'</div></td>'+
			'</tr></table>',
			blkclss = '',
			trunnme = 75,
			srt = ($PR['wrkr']['sort'] === 'rate'),
			ord = ($PR['wrkr']['ord'] === 'D'),
			sortarr = [];
			
		if($CK['pref'].charAt(1) === 'R'){
			srt = 'rate';
		}else if($CK['pref'].charAt(1) === 'N'){
			srt = 'name';
		}
		if($CK['pref'].charAt(2) === 'A'){
			ord = 'A';
		}else if($CK['pref'].charAt(2) === 'D'){
			ord = 'D';
		}
		
		$.each($W, function(k, v){
			sortarr.push([k, v[srt]]);
			i++;
		});
		
		if(srt === 'name'){
			sortarr.sort(function(a, b){return a[1].toLowerCase().localeCompare(b[1].toLowerCase())});
			if(ord === 'D') sortarr.reverse();
		}else if(srt === 'rate'){
			if(ord === 'D'){
				sortarr.sort(function(a, b){return -(a[1] - b[1])});
			}else{
				sortarr.sort(function(a, b){return a[1] - b[1]});
			}
		}
		
		if(i < 8) blkclss = ' WBlockFewGrid';
		$.each(sortarr, function(k, v){
			var ky = v[0];
			ins += '<div class="WWrap'+blkclss+'"><div class="WBlock C1br C2br_hov C3'+cmde+' " data-key="'+ky+'">'+
				'<div id="WName-'+ky+'" class="textmed WBL"></div><div id="WRate-'+ky+'" class="textmed WBR">--</div>'+
				'<div id="WHashes-'+ky+'" class="texttiny WBL"></div><div id="WLast-'+ky+'" class="texttiny WBR">--</div>'+
				'<div id="WVal-'+ky+'" class="Expand hide texttiny WBL"></div><div id="WInv-'+ky+'" class="Expand hide texttiny WBR">--</div>'+
				'<div class="WorkerChart" data-worker="'+ky+'"></div>'+
			'</div></div>';
		});
		$('#MinerWorkersList').html(ins+'<div class="clear"></div>');
		
		trunnme = Math.round($('#WName-0').width() / 6.25);
		$.each(sortarr, function(k, v){
			$('#WName-'+v[0]).html(Truncate($W[v[0]]['name'], trunnme));
		});
		if(resort === 'y'){
			sort_MinerWorkers(i, srt, ord, 'y');
		}else{
			sort_MinerWorkers(i, srt, ord, 'n');
		}

		var lasthash = 0,
			j = 0;
		
		$.each(sortarr,function(k, v){
			var key = v[0];
			$.when(dta('worker', key, $W[key]['name'])).done(function(a){
				if($W[key]['rate'] > 0){
					var hsh = ConvHash($W[key]['rate']);
					$('#WRate-'+key).html(hsh['num']+' '+hsh['unit']);

					if($W[key]['last'] > 0){
						SynchTime($AC[addr]['wrkrs'][key]['last']);
						$('#WLast-'+key).html(TimeAgo($W[key]['last'])+' Ago');
						if($W[key]['last'] > lasthash) lasthash = $W[key]['last'];	
					}
					if($W[key]['history']) graph_Worker(key);	
				}else{
					$('.WBlock[reference="'+key+'"]').addClass('C4br');
					$('.WBlock[reference="'+key+'"] table').addClass('C4');	
				}
				j++;
				if(resort !== 'y' && j === i){
					$('#MinerLastHash').removeClass('o5').html(TimeAgo(lasthash)+' Ago');
					init_MinerWorkers('y');
				}
			});
		});
	}
}

function sort_MinerWorkers(num, col, ord, cmplt){
	if(num > 1){
		$('#WorkerSortGroup').removeClass('hide');
		
		var ordV = 'D', orot = 'rot270';
		if(ord === 'D'){
			ordV = 'A';
			orot = 'rot90';
		}
		
		if(cmplt === 'n'){
			var loader = '<div class="preload C0fl'+cmde+'">'+$ICO['refresh']+'</div>';
			if(col === 'rate'){
				$('.WorkerSort[data-col="name"]').removeClass('C1bk').addClass('C2bk C0fl'+cmde).html($ICO['sort']);
				$('.WorkerSort[data-col="rate"]').attr('data-ord', ordV).removeClass('C2bk').addClass('nopoint C1bk').html(loader);
			}else if(col === 'name'){
				$('.WorkerSort[data-col="name"]').attr('data-ord', ordV).removeClass('C2bk').addClass('C1bk '+orot).html($ICO['arrow']);
				$('.WorkerSort[data-col="rate"]').removeClass('C1bk').addClass('nopoint C2bk').html(loader);
			}
		}else if(cmplt === 'y'){
			if(col === 'rate'){
				$('.WorkerSort[data-col="name"]').removeClass('C1bk').addClass('C2bk').html($ICO['sort']);
				$('.WorkerSort[data-col="rate"]').attr('data-ord', ordV).removeClass('nopoint C2bk').addClass('C1bk '+orot).html($ICO['arrow']);	
			}else if(col === 'name'){
				$('.WorkerSort[data-col="name"]').attr('data-ord', ordV).removeClass('C2bk').addClass('C1bk '+orot).html($ICO['arrow']);
				$('.WorkerSort[data-col="rate"]').removeClass('nopoint C1bk').addClass('C2bk').html($ICO['sort']);					
			}
		}
	}
}

function load_MinerWorkerDetail(xid){
	var $W = $AC[addr]['wrkrs'][xid];
	$.when(dta('workerdetail', xid, $W['name'])).done(function(a){
		$('#WHashes-'+xid).html(ConvNum($W['hashes'])+' Hashes');
		$('#WVal-'+xid).html(ConvNum($W['val'])+' Valid');
		$('#WInv-'+xid).html(ConvNum($W['inv'])+' Invalid');
	});
}

function pge_Blocks(pge, lim){
	pge = (pge > 1) ? pge : 1;
	lim = (lim >= 25) ? lim : 25;
	$('#Stage').html('<table class="LR80 C3'+cmde+'  shim20"><tr>'+
		'<td id="BlockHeader" class="textmed"></td>'+
		'<td class="right texttiny"><div id="BlocksPag" class="Pag"><div class="regbtn Loader C1fl">'+$ICO['loader']+'</div></div></td>'+
	'</tr></table><div class="hbar shimtop5"></div><div id="BlockList" class="LR80"></div>').addClass('StageFade');
	dta_Blocks(pge, lim);
}

function dta_Blocks(pge, lim){
	$('#BlockList').html(loadgrp);
	$.when(dta('poolstats')).done(function(a){
		$('#BlockHeader').html(ConvNum($DT['poolstats']['blocks'])+' Blocks Found with '+ConvNum($DT['poolstats']['hashes'])+' Hashes');
		if(pge == 1){
			$DT['blockhistory'] = $DT['block'];
			tbl_Blocks(pge, lim);
		}else{
			$.when(dta('blockhistory', pge, lim)).done(function(a){
				tbl_Blocks(pge, lim);
			});
		}
	});	
}
function tbl_Blocks(pge, lim){
	var ins = '<table class="contable shim5 C3'+cmde+' ">'+
		'<tr class="texttiny">'+
			'<td width="70">Block Mined</td>'+
			'<td width="90" class="center">Maturity</td>'+
			'<td width="70" class="center">Effort</td>'+
			'<td width="90" class="center">Reward (XMR)</td>'+
			'<td class="right">Transaction</td>'+
			'<td width="90" class="right">Block Height</td>'+
		'</tr>',
		i = 0,
		row = 'ROW0';
		
	$.each($DT['blockhistory'],function(k,v){
		if(i < lim){
			row = (i % 2 === 0) ? 'ROW1' : 'ROW0';
			var clss = (v['eff'] > 100) ? 'C4' : 'C5';
			ins += '<tr class="texttable '+row+'">'+
				'<td>'+TimeAgo(v['tme'])+' Ago</td>'+
				'<td class="center">'+BlockToGo(v['height'])+'</td>'+
				'<td class="center"><span class="'+clss+'">'+v['eff']+'%</span></td>'+
				'<td class="center">'+v['reward']+'</td>'+
				'<td class="XMRHash right" data-hash="'+v['hash']+'"></td>'+
				'<td class="right">'+ConvNum(v['height'])+'</td>'+
			'</tr>';
			i++;	
		}else{
			return false;
		}
	});
	$('#BlockList').html(ins+'</table>');
	XMRHashTruncate();
	
	Pagination('BlocksPag', lim, $DT['poolstats']['blocks'], pge);
	MainLoaderOff();
}

function pge_Payments(pge, lim){
	pge = (pge > 1) ? pge : 1;
	lim = (lim >= 25) ? lim : 25;
	
	$('#Stage').html('<table class="LR80 C3'+cmde+'  shim20"><tr>'+
		'<td id="PaymentHeader" class="textmed"></div></td>'+
		'<td class="right texttiny"><div id="PaymentPag" class="Pag"><div class="regbtn Loader C1fl">'+$ICO['loader']+'</div></div></td>'+
	'</tr></table><div class="hbar shimtop5"></div><div id="PaymentList" class="LR80"></div>').addClass('StageFade');
	
	$.when(dta('poolstats')).done(function(a){
		$('#PaymentHeader').html(ConvNum($DT['poolstats']['payments'])+' Payments to '+ConvNum($DT['poolstats']['minerspaid'])+' Miners');
		dta_Payments(pge, lim);
	});
}

function dta_Payments(pge, lim){
	$('#PaymentList').html(loadgrp);
	$.when(dta('poolpay', pge, lim)).done(function(a){
		var ins = '<table class="contable shim5 C3'+cmde+' ">'+
			'<tr class="texttiny">'+
				'<td width="70">Payment Sent</td>'+
				'<td width="50" class="center">Payees</td>'+
				'<td>Transaction</td>'+
				'<td width="80" class="center">Amount (XMR)</td>'+
				'<td width="80" class="right">Fee (XMR)</td>'+
			'</tr>',
			i = 0,
			row = 'ROW0';
			
		$.each($DT['poolpay'],function(k,v){
			if(i < lim){
				row = (i % 2 === 0) ? 'ROW1' : 'ROW0';
				ins += '<tr class="texttable '+row+'">'+
					'<td>'+TimeAgo(v['ts'] / 1000)+' Ago</td>'+
					'<td class="center">'+v['payees']+'</td>'+
					'<td class="XMRHash" data-hash="'+v['hash']+'"></td>'+
					'<td class="center">'+ConvXMR(v['value'])+'</td>'+
					'<td class="right">'+ConvXMR(v['fee'])+'</td>'+
				'</tr>';
				i++;
			}else{
				return false;
			}
		});
		$('#PaymentList').html(ins+'</table>');
		XMRHashTruncate();
		Pagination('PaymentPag', lim, $DT['poolstats']['payments'], pge);
		MainLoaderOff();
	});
}

function pge_Help(){
	setTimeout(function(){
		var ins = '<table class="LR80 C3'+cmde+' shim20"><tr>'+
			'<td id="BlockHeader" class="textmed">Welcome to SupportXMR.com</td>'+
			'<td class="right texttiny">Join Us on IRC<br>#monero-pools</td>'+
		'</tr></table>'+
		'<div class="hbar shimtop5"></div>'+
		'<div class="LR80 text C3'+cmde+' shim30">'+
			'<p>Getting started is easy and this pool has a large and friendly community that are happy to help you. The pool operators are M5M400 and Snipa22 who can be reached in the #monero-pools IRC or at <a href="mailto:support@supportxmr.com" class="C1 C2_hov">support@supportxmr.com</a>. Please be patient and someone will get back to you. Most of the time help can be found quicker in the chat.</p>'+
			'<p>The pool has a quite stable and knowlegable community - you can join the chat and seek help and a friendly chat there :)</p>'+
			'<div class="helpgroup">'+
				'<div class="helptitle">'+
					'<div class="helpbtn btnback C1fl">'+$ICO['arrow']+'</div>'+
					'<span class="helpbtntext textlrg C1">Step 1 - Install Wallet & Create Address</span>'+
				'</div>'+
				'<div class="helpteaser text ">Start here if you need a Monero address and wallet.</div>'+
				'<div class="helpcontent text hide">'+
					'<p>The <a href="https://www.getmonero.org/downloads/" target="_blank" class="C1 C2_hov">Official Monero Wallet</a> is recommended. Monero Outreach\'s <a href="https://www.monerooutreach.org/stories/monero_wallet_quickstart.php" class="C1 C2_hov" target="_blank">Wallet Guide</a> has a list of other wallet options including paper wallets.</p>'+
				'</div>'+
			'</div>'+
			'<div class="helpgroup">'+
				'<div class="helptitle">'+
					'<div class="helpbtn btnback C1fl">'+$ICO['arrow']+'</div>'+
					'<span class="helpbtntext textlrg C1">Step 2 - Install Mining Software</span>'+
				'</div>'+
				'<div class="helpteaser text">Install the software needed to mine Monero.</div>'+
				'<div class="helpcontent text hide">'+
					'<p>Select the miner that best suits your hardware and follow their installation instructions. If you need help, visit #monero-pools.</p>'+
					'<p><table class="texttable C3'+cmde+'"><tr>'+
						'<td NOWRAP>'+
							'<i>Alphabetically</i><br>'+
							'<a href="https://github.com/KlausT/ccminer-cryptonight/releases" class="C1 C2_hov" target="_blank">ccminer-cryptonight</a> (Nvidia)<br>'+
							'<a href="https://bitcointalk.org/index.php?topic=638915.0" class="C1 C2_hov" target="_blank">Claymore\'s miner</a> (CPU, AMD)<br>'+
							
						'</td>'+
						'<td NOWRAP>'+
							'<a href="https://github.com/Dead2/CryptoGoblin/releases" class="C1 C2_hov" target="_blank">CryptoGoblin</a> (CPU, Nvidia, AMD)<br>'+
							'<a href="https://github.com/xmrig/xmrig/" class="C1 C2_hov" target="_blank">XMRig</a> (CPU, Nvidia, AMD)<br>'+
							'<a href="https://github.com/fireice-uk/xmr-stak/releases" class="C1 C2_hov" target="_blank">XMR-Stak</a> (CPU, Nvidia, AMD)'+
						'</td>'+
					'</tr></table></p>'+
				'</div>'+
			'</div>'+
			'<div class="helpgroup">'+
				'<div class="helptitle">'+
					'<div class="helpbtn btnback C1fl">'+$ICO['arrow']+'</div>'+
					'<span class="helpbtntext textlrg C1">Step 3 - Configure Settings</span>'+
				'</div>'+
				'<div class="helpteaser text ">Select a pool server and port and configure you miner.</div>'+
				'<div class="helpcontent text hide">'+
					'<p>Each mining software will have it\'s own config, but they will all ask for the same information:</p>'+
					'<p><b>Your Monero Address</b><br>Often this will be labeled username, but check the instructions. You can specify a paymentID by using the following format: <i>address</i>.<i>paymentID</i></p>'+
					'<p><b>Pool Address</b><br>The miner will want a url and a port, like this: pool.supportxmr.com:3333</p>'+
					'<p><table class="texttable C3'+cmde+'"><tr>'+
						'<td>'+
							'<p>Port descriptions:</p>'+
							'<ul>'+
								'<li>3333 Low-end CPU</li>'+
								'<li>5555 Fast/Multi CPU</li>'+
								'<li>7777 GPU rigs</li>'+
								'<li>9000 SSL/TLS</li>'+
							'</ul>'+
						'</td>'+
						'<td>'+
							'<p>If you can\'t get through firewall, try these:</p>'+
							'<ul>'+
								'<li>8080 Firewall bypass</li>'+
								'<li>80 Firewall bypass</li>'+
								'<li>443 Firewall bypass w/SSL/TLS</li>'+
							'</ul>'+
						'</td>'+
					'</tr></table></p>'+
					'<p><b>Optional Fields</b><br>You can also set worker names or fixed difficulty through the configuration.</p>'+
					'<p>Standard wallet address<br><i>(e.g. miner.exe -u 43T...sUW -p Steve)</i></p>'+
					'<p>Fixed difficulty of 3500 for the worker<br><i>(e.g. miner.exe -u 43T...sUW+3500 -p Steve)</i></p>'+
				'</div>'+
			'</div>'+
			'<div class="helpgroup">'+
				'<div class="helptitle">'+
					'<div class="helpbtn btnback C1fl">'+$ICO['arrow']+'</div>'+
					'<span class="helpbtntext textlrg C1">Step 4 - Start Mining</span>'+
				'</div>'+
				'<div class="helpteaser text">Launch the miner and learn more.</div>'+
				'<div class="helpcontent text hide">'+
					'<p>This pool uses PPLNS to determine payouts. It helps to combat pool hopping and ensures a good payout for miners.</p>'+
					'<p>0.6% Pool Fee</p>'+
					'<p>0.1 XMR Default Payout</p>'+
					'<p>60 Block Confirmation Time</p>'+
				'</div>'+
			'</div>'+
		'</div>';
		$('#Stage').html(ins).addClass('StageFade');
		ToggleMode();
		MainLoaderOff();
	}, 1000);
}

function LoadMinerPayments(str){
	str = (str > 1) ? str : '';
	$('#ModalBody').empty();
	$('#ModalClose').html('<div class="Loader">'+$ICO['loader']+'</div>');
	$('#ModalTitle').html('<div class="textmed">Your Payments</div>');
	OpenModal();
	$.when(dta('pay', addr, str)).done(function(a){
		var lim = 15,
			i = start = 0,
			row = 'ROW0',
			ins = '<div class="hbar shimtop10"></div>'+
			'<table class="TDPadS C3'+cmde+' texttable">'+
			'<tr class="texttiny">'+
				'<td width="80"></td>'+
				'<td width="100" class="center">XMR</td>'+
				'<td></td>'+
			'</tr>';
			
		$.each($DT['pay'],function(k,v){
			if(i < lim){
				row = (i % 2 === 0) ? 'ROW1' : 'ROW0';
				start = v['tme'];
				if(i === 0){
					ins += '<tr>'+
						'<td>Pending</td>'+
						'<td class="center">'+$AC[addr]['due']+'</td>'+
						'<td><a href="#" target="_blank" class="C1 C2_hov">Pay Now</a></td>'+
					'</tr>';
				}
				ins += '<tr class="'+row+'">'+
					'<td>'+TimeAgo(v['tme'])+' Ago</td>'+
					'<td class="center">'+RoundXMR(v['amnt'])+'</td>'+
					'<td class="XMRHash" data-hash="'+v['hash']+'"></td>'+
				'</tr>';
				i++;
			}
		});
		ins += '<tr class="texttiny">'+
			'<td><div class="MinerPaymentNext" data-start="'+start+'"><div class="C1fl rot90 regbtn">'+$ICO['arrow']+'</div> <span class="C1 texttiny">View More</span></div></td>'+
			'<td></td>'+
			'<td></td>'+
		'</tr>';
		$('#MinerPaymentList').html(ins+'</table>');
		$('#ModalClose').html($ICO['plus']);
		XMRHashTruncate();
		
		$(document.body).on('click', '.MinerPaymentNext', function(e){
			LoadMinerPayments($(this).attr('data-start'));
		});
	});
}

//Data Lookups
function dta(mde, key, xid){
	now = Math.round((new Date()).getTime() / 1000);
	var def = new $.Deferred(),
		i = 0,
		url = '',
		tmecut = '';
		
	if(mde === 'block'){
		url = 'pool/blocks?limit=100';
	}else if(mde === 'blockhistory'){
		url = 'pool/blocks?page='+key+'&limit='+xid;
	}else if(mde === 'net' && now > ($PR['net']['updt'] + 300)){
		url = 'network/chart/difficulty?timeScale='+$PR['net']['res'];
		$PT['net'] = {};
		tmecut = now - (3600 * $PR['net']['hrs']);
	}else if(mde === 'pool' && now > ($PR['net']['updt'] + 300)){
		url = 'pool/chart/hashrate?timeScale='+$PR['net']['res'];
		$PT['pool'] = {};
		tmecut = now - (3600 * $PR['net']['hrs']);
	}else if(mde === 'netheight'){
		url = 'network/stats';
	}else if(mde === 'poolpay'){
		var offset = (key - 1) * xid;
		url = 'pool/payments?page='+offset+'&limit='+xid;
	}else if(mde === 'poolstats' && now > ($PR['pool']['updt'] + 300)){
		url = 'pool/stats';
	}else if(mde === 'account'){
		url = 'miner/'+addr+'/stats';
	}else if(mde === 'pay'){
		url = 'miner/'+key+'/payments';
		if(xid) url += '?start='+xid;
	}else if(mde === 'workers' && (jQuery.isEmptyObject($AC[addr]['wrkrs']) || now > ($PR['wrkr']['updt'] + 180))){
		url = 'miner/'+addr+'/identifiers';
	}else if(mde === 'minershash'){
		url = 'miner/'+addr+'/chart/hashrate/';
	}else if(mde === 'worker' && $AC[addr] && $AC[addr]['wrkrs'][key]){
		if(jQuery.isEmptyObject($AC[addr]['wrkrs'][key]['history']) || now > ($AC[addr]['wrkrs'][key]['updt'] + 180)){
			url = 'miner/'+addr+'/chart/hashrate/'+xid;
		}
	}else if(mde === 'workerdetail'){
		url = 'miner/'+addr+'/stats/'+xid;
	}
	if(url){
		console.log('Lookup: '+mde+' - '+url);
		$.ajax({url:'https://supportxmr.com/api/'+url, dataType:'json', type:'GET',
			success:function(d){
				if(d){
					if(mde === 'block' || mde === 'blockhistory' || mde === 'net' || mde === 'pool' || mde === 'pay'){
						$DT[mde] = {};
						$.each(d,function(k,v){
							var tme = Math.round(v['ts'] / 1000);
							if(mde === 'block' || mde === 'blockhistory'){
								if(mde === 'blockhistory' || tme >= tmecut) $DT[mde][i] = {'tme':tme, 'hash':v['hash'], 'height':v['height'], 'reward':ConvXMR(v['value']), 'eff':Math.round(v['shares'] / v['diff'] * 100)};
							}else if(mde === 'net'){
								if(tme >= tmecut) $DT[mde][i] = {'tme':tme, 'hash':Math.round(v['diff'] / 120)};
							}else if(mde === 'pool'){
								if(tme >= tmecut) $DT[mde][i] = {'tme':tme, 'hash':v['hs']};
							}else if(mde === 'pay'){
								$DT[mde][i] = {'tme':v['ts'], 'hash':v['txnHash'], 'amnt':ConvXMR(v['amount'])};
							}
							i++;
						});
						if(mde === 'net') $PR['net']['updt'] = now;
					}else if(mde === 'netheight'){
						$DT[mde] = d['height'];
					}else if(mde === 'poolpay'){
						console.log(d);
						$DT[mde] = d;
					}else if(mde === 'poolstats'){
						$DT[mde] = {
							'blocks':d['pool_statistics']['totalBlocksFound'],
							'hashes':d['pool_statistics']['totalHashes'],
							'payments':d['pool_statistics']['totalPayments'],
							'minerspaid':d['pool_statistics']['totalMinersPaid']
						};
						$PR['pool']['updt'] = now;
					}else if(mde === 'account'){
						if(d['validShares'] > 0){
							$AC[addr] = {'due':ConvXMR(d['amtDue']), 'paid':ConvXMR(d['amtPaid']), 'hashes':d['totalHashes'], 'last':d['lastHash'], 'val':d['validShares'], 'inv':d['invalidShares'], 'workers':{}};
						}
					}else if(mde === 'workers'){
						$AC[addr]['wrkrs'] = {};
						$PR['wrkr']['updt'] = now;
						$.each(d,function(k, v){
							$AC[addr]['wrkrs'][i] = {};
							$AC[addr]['wrkrs'][i]['name'] = v;
							i++;
						});
					}else if(mde === 'minershash'){
						$AC[addr]['rate'] = {'max':'', 'avg':'', 'pts':{}};
						$PT['miner'] = {};
						//$PR['net']['res'];
						//$PR['net']['hrs'];
						
									
						//var prevtme = 0;
						//for(var j = ($PR['net']['hrs'] / $PR['net']['res']); j >= 1; j--){
							//prevtme = $PR['net']['hrs'] / $PR['net']['res'] * j;
							//console.log(prevtme+' prev');
						//}
						$.each(d,function(k,v){
							var tme = Math.round(v['ts'] / 1000);
							if(tme >= (now - ($PR['miner']['hrs'] * 3600))){
								$AC[addr]['rate']['pts'][i] = {'tme':tme, 'hash':v['hs']};
								//console.log(tme+' tme');
								i++;
							}
						});
					}else if(mde === 'worker'){
						$AC[addr]['wrkrs'][key]['history'] = {};
						$.each(d,function(k,v){
							var tme = Math.round(v['ts'] / 1000);
							if(tme >= (now - 21600)){
								$AC[addr]['wrkrs'][key]['history'][i] = {'tme':tme, 'hsh':v['hs']};
								i++;
							}
						});
						$AC[addr]['wrkrs'][key]['last'] = $AC[addr]['wrkrs'][key]['history'][0]['tme'];
						$AC[addr]['wrkrs'][key]['rate'] = $AC[addr]['wrkrs'][key]['history'][0]['hsh'];
						$AC[addr]['wrkrs'][key]['updt'] = now;
					}else if(mde === 'workerdetail'){
						$AC[addr]['wrkrs'][key]['hashes'] = d['totalHash'];
						$AC[addr]['wrkrs'][key]['val'] = (d['validShares'] > 0) ? d['validShares'] : 0;
						$AC[addr]['wrkrs'][key]['inv'] = (d['invalidShares'] > 0) ? d['invalidShares'] : 0;
					}
					def.resolve();
				}else{
					console.log('err');
					def.resolve();
				}
			},error:function(xhr, err){
				//LoadAlert();
				console.log(err);
			}
		});
	}else{
		def.resolve();
	}
	return def.promise();
}

//Graphing
function OpenToolTip(k){
	$('#Dot'+k).attr('class', $('#Dot'+k).attr('class')+' C1flim');
	var t_x = $PT['block'][k]['x'],
		t_y = $PT['block'][k]['y'],
		eff = $DT['block'][k]['eff'],
		effwid = 28,
		effx = t_x - 35;
		
	if(eff > 999){
		effwid = 40;
		effx = t_x - 47;
	}else if(eff > 99){
		effwid = 34;
		effx = t_x - 40.5;
	}
		
	$('#TipText_Effort').attr({'x':(t_x - 10), 'y':(t_y + 2)}).html(eff+'%');
	$('#TipText_EffortBox').attr({'x':effx, 'y':(t_y - 8), 'width':effwid});
	$('#TipText_Time').attr({'x':(t_x + 11), 'y':(t_y + 2)}).html(TimeAgo($DT['block'][k]['tme'])+' Ago');
	$('#TipText_TimeBox').attr({'x':(t_x + 7), 'y':(t_y - 8)});
}
function CloseToolTip(k){
	$('#Dot'+k).attr('class', $('#Dot'+k).attr('class').replace(' C1flim', ''));
	$('#TipText_Effort, #TipText_Time, #TipText_EffortBox, #TipText_TimeBox').attr({'x':'-1000', 'y':'-1000'});
}
function graph_Grid(mde, num, max, min, h, w, cls){
	var ret = '', yrt = (max - min) / num,
		clss = (cls === 'C2') ? '' : cmde;

	for(var y = (num - 1); y >= 1; y--){
		var	ylc = Math.round((h - ((yrt * y) / ((max - min) / h))) * 10) / 10;
		if(mde === 'line'){
			ret += '<line x1="50" y1="'+ylc+'" x2="'+w+'" y2="'+ylc+'" class="line '+cls+'st'+clss+' o8" />';
		}else if(mde === 'lbl'){
			var yln = ConvHash(yrt * y);
			ret += '<text x="5" y="'+(ylc + 3)+'" class="'+cls+'fl'+clss+' texttinysvg">'+yln['num']+' '+yln['unit']+'</text>';
		}
	}
	return ret;
}
function graph_MainNet(){
	if($('#NetGraph').length && $DT['net'][0] && $DT['net'][0]['hash']){
		var $T = $('#NetGraph'),
			min = 999999999999,
			mintime = 999999999999,
			max = 0,
			xratio = 0,
			i = 0,
			j = 0,
			ncnt = 0,
			pcnt = 0,
			pavg = 0,
			pplns = 0,
			divheight =  parseInt($T.height()),
			fullsize = (divheight > 75) ? 'y' : 'n',
			bottom = (fullsize === 'y') ? 19 : 0,
			height = divheight - bottom,
			blocksize = (fullsize === 'y') ? 6.5 : 4.5,
			linesize = (fullsize === 'y') ? 1.25 : .75,
			padR = (width > 900) ? 55 : 50,
			right_x = width - padR,
			graphhrs = 8,
			timestart = 0,
			hsh_net = ConvHash($DT['net'][0]['hash']),
			hsh_pool = ConvHash($DT['pool'][0]['hash']),
			currenteffort = 0,  //Math.round((now - $DT['block'][0]['tme']) / 480 * 100)
			ins = '<svg viewBox="0 0 '+width+' '+height+'" class="chart">'+
			'<defs>'+
				'<linearGradient id="P">'+
					'<stop offset="0%" stop-color="#F06923" stop-opacity="0.99" /><stop offset="100%" stop-color="#F06923" stop-opacity="0.02" />'+
				'</linearGradient>'+
			'</defs>';
			
		if(width < 600){
			graphhrs = 3;
		}else if(width < 800){
			graphhrs = 4;
		}else if(width < 1200){
			graphhrs = 6;
		}
		timestart = now - (3600 * graphhrs);
			
		$.each($DT['net'],function(k, v){
			if(v['tme'] >= timestart){
				if(v['hash'] > max) max = v['hash'];
				if(v['tme'] < mintime) mintime = v['tme'];
				ncnt++
			}
		});
		$.each($DT['pool'],function(k, v){
			if(v['tme'] >= timestart){
				pavg = pavg + v['hash'];
				if(v['hash'] < min) min = v['hash'];
				if(v['tme'] < mintime) mintime = v['tme'];
				pcnt++
			}
		});
		
		pavg = pavg / pcnt;
		xratio = right_x / (now - mintime);
		max = max + (max * .01);	//Add chart headroom
		min = min - (min * .3);
		
		pplns = 2 * ($DT['net'][0]['hash'] * 120) / pavg * xratio;
		console.log(pplns);
		
		//Create Points
		$.each($DT['net'],function(k, v){
			if(v['tme'] >= timestart){
				$PT['net'][j] = {
					'x':Math.round((right_x - (now - v['tme']) * xratio) * 10) / 10,
					'y':Math.round((height - (v['hash'] - min) / (max - min) * height) * 10) / 10
				};
				j++;
			}
		});
		j = 0;
		$.each($DT['pool'],function(k, v){
			if(v['tme'] >= timestart){
				$PT['pool'][j] = {
					'x':Math.round((right_x - (now - v['tme']) * xratio) * 10) / 10,
					'y':Math.round((height - (v['hash'] - min) / (max - min) * height) * 10) / 10
				};
				j++;
			}
		});
	
		//Fill Panel
		ins += '<polygon fill="url(#P)" points="'+(right_x + 55)+','+$PT['net'][0]['y'];
		$.each($PT['net'],function(k,v){
			ins += ' '+v['x']+','+v['y'];
		});
		ins += ' -3,'+$PT['net'][(ncnt - 1)]['y'];
		var newx;
		for(p = (j - 1); p >= 0; p--){
			newx = (p === 0) ? width + 2 : $PT['pool'][p]['x'];
			ins += ' '+newx+','+$PT['pool'][p]['y'];
		}
        ins += ' -3,'+$PT['pool'][(pcnt - 1)]['y']+' '+(width + 2)+','+$PT['pool'][0]['y']+'" />';
	
		//PPLNS Window
		var pplnsleft = 9999999999,
			pplnstextmid = 0;
			
		ins += '<polygon class="C1fl" opacity=".6" points="'+right_x+','+$PT['net'][0]['y'];
		$.each($PT['net'],function(k,v){
			if(v['x'] > right_x - pplns) ins += ' '+v['x']+','+v['y'];
		});
		for(p = (j - 1); p >= 0; p--){
			if($PT['pool'][p]['x'] > right_x - pplns){
				ins += ' '+$PT['pool'][p]['x']+','+$PT['pool'][p]['y'];
				if($PT['pool'][p]['x'] < pplnsleft) pplnsleft = $PT['pool'][p]['x'];
			}
		}
        ins += ' '+right_x+','+$PT['pool'][0]['y']+'" />';
		if(fullsize === 'y'){
			pplnstextmid = (right_x + pplnsleft) / 2;
			ins += '<text x="'+pplnstextmid+'" y="20" text-anchor="middle" class="C0fl'+cmde+' texttinysvg o9">PPLNS</text>'+
				'<text x="'+pplnstextmid+'" y="30" text-anchor="middle" class="C0fl'+cmde+' texttinysvg o9">Window</text>';
		}
		
		//Grid Lines & Labels
		ins += graph_Grid('line', 3, max, min, height, width, 'C0');
		ins += graph_Grid('lbl', 3, max, min, height, width, 'C0');
		
		//NetHash Line
		ins += '<polyline class="C1st" stroke-width="'+linesize+'" points="'+(right_x + 3)+','+$PT['net'][0]['y'];
		$.each($PT['net'],function(k,v){
			ins += ' '+v['x']+','+v['y'];
		});
		ins += ' -3,'+$PT['net'][(ncnt - 1)]['y']+'" />'+
		'<text x="'+(right_x + 5)+'" y="'+($PT['net'][0]['y'] + 13)+'" class="hashlable C1fl">'+hsh_net['num']+'</text>';
		if(fullsize === 'y') ins += '<text x="'+(right_x + 5)+'" y="'+($PT['net'][0]['y'] + 23)+'" class="texttinysvg C2fl o8">'+hsh_net['unit']+' Net</text>';
		
		//PoolHash Line
		ins += '<polyline class="C1st" stroke-width="'+linesize+'" points="'+right_x+','+$PT['pool'][0]['y'];
		$.each($PT['pool'],function(k,v){
			ins += ' '+v['x']+','+v['y'];
		});
		ins += ' -3,'+$PT['pool'][(pcnt - 1)]['y']+'" />'+
		'<text x="'+(right_x + 5)+'" y="'+($PT['pool'][0]['y'] + 1)+'" class="hashlable C1fl">'+hsh_pool['num']+'</text>';
		if(fullsize === 'y') ins +='<text x="'+(right_x + 5)+'" y="'+($PT['pool'][0]['y'] - 17)+'" class="texttinysvg C2fl o8">'+hsh_pool['unit']+' Pool</text>';
		
		//Blocks Avg
		var max_effort = blockratio = avg_effort = lastblk_x = lastblk_y = 0,
			bline = height + 5,
			right_x = width - padR;
			
		j = 0;
		$.each($DT['block'],function(k,v){
			if(v['tme'] >= timestart){
				avg_effort = avg_effort + parseInt(v['eff']);
				if(v['eff'] > max_effort) max_effort = v['eff'];
				j++;
			}
		});
		blockratio = (height - 25) / max_effort;
		avg_effort = Math.round(avg_effort / j);
		currenteffort = Math.round((now - $DT['block'][0]['tme']) / ($DT['net'][0]['hash'] / $DT['pool'][0]['hash'] * 120) * 100);
		
		j = 0;
		$PT['block'] = {};
		$.each($DT['block'],function(k,v){
			if(v['tme'] >= timestart){
				var x = Math.round((right_x - (now - v['tme']) * xratio) * 10) / 10,
					y = (Math.round((height - 25 - (v['eff'] * blockratio)) * 10) / 10) + 11;
					
				$PT['block'][j] = {'x':x, 'y':y};
				j++;
			}
		});
		
		//Blocks
		$.each($PT['block'],function(k, v){
			if(v['x'] > 57){
				lastblk_x = v['x'];
				lastblk_y = v['y'];
				var clrclass = ($DT['block'][k]['eff'] <= 100) ? 'C5fl' : 'C4fl';
				ins += '<g class="blockgroup" data-block="'+k+'">'+
					'<circle cx="'+lastblk_x+'" cy="'+lastblk_y+'" r="'+blocksize+'" class="blockbackring" />'+
					'<circle cx="'+lastblk_x+'" cy="'+lastblk_y+'" r="'+(blocksize * .92)+'" class="blockback" />'+
					'<circle id="Dot'+k+'" cx="'+lastblk_x+'" cy="'+lastblk_y+'" r="'+(blocksize * .71)+'" class="Dot '+clrclass+'" />'+
				'</g>';
			}else{
				return false;
			}
		});
		
		//Blocks Bottom Details
		if(fullsize === 'y'){
			var text_y = bline + 2;
			ins += '<line x1="'+$PT['block'][0]['x']+'" y1="'+($PT['block'][0]['y'] + 3 + blocksize / 2)+'" x2="'+$PT['block'][0]['x']+'" y2="'+bline+'" class="line C2st" />'+
				'<line x1="'+$PT['block'][0]['x']+'" y1="'+bline+'" x2="'+lastblk_x+'" y2="'+bline+'" class="line C2st" />'+
				'<line x1="'+lastblk_x+'" y1="'+(lastblk_y + 3 + blocksize / 2)+'" x2="'+lastblk_x+'" y2="'+bline+'" class="line C2st" />'+
				'<rect x="'+(lastblk_x + 10)+'" y="'+(height - 3)+'" width="90" height="15" class="C0fl'+cmde+' o8" />'+
				'<text x="'+(lastblk_x + 55)+'" y="'+text_y+'" text-anchor="middle" class="C2fl texttiny">'+avg_effort+'% Avg Effort</text>'+
				'<rect x="'+($PT['block'][0]['x'] - 100)+'" y="'+(height - 3)+'" width="90" height="15" class="C0fl'+cmde+' o8" />'+
				'<text x="'+($PT['block'][0]['x'] - 55)+'" y="'+text_y+'" text-anchor="middle" class="C2fl texttiny">Found '+TimeAgo($DT['block'][0]['tme'])+' Ago</text>'+
				'<rect x="'+(right_x - 7)+'" y="'+(text_y - 8)+'" width="11" height="9" class="C0fl'+cmde+' o8" />'+
				'<text x="'+(right_x - 8)+'" y="'+text_y+'" class="C2fl texttiny">'+currenteffort+'% Effort</text>'+
				'<text x="5" y="'+text_y+'" class="C2fl o8 texttiny">'+TimeAgo($DT['pool'][(pcnt - 1)]['tme'])+' Ago</text>'+
				'<line x1="'+right_x+'" y1="'+(bline - 15)+'" x2="'+right_x+'" y2="'+(bline - 7)+'" class="line C2st" />'+
				'<line x1="'+$PT['block'][0]['x']+'" y1="'+bline+'" x2="'+(right_x - 10)+'" y2="'+bline+'" class="line C2st" />';
		}
		
		//Current Block Dot
		ins += '<circle cx="'+right_x+'" cy="'+$PT['pool'][0]['y']+'" r="2" class="C1fl" />';
		
		//Block Tool Tip
		ins += '<rect id="TipText_EffortBox" x="-1000" y="-1000" width="35" height="14" rx="3" class="C0fl'+cmde+'" />'+
			'<text id="TipText_Effort" x="-1000" y="-1000" text-anchor="end" class="C2fl texttinysvg"></text>'+
			'<rect id="TipText_TimeBox" x="-1000" y="-1000" width="56" height="14" rx="3" class="C0fl'+cmde+'" />'+
			'<text id="TipText_Time" x="-1000" y="-1000" class="C2fl texttinysvg"></text>'+
		'</svg>';
		$T.html(ins);
		
		if(tooltip_open) NetGraphPop(tooltip_open);
	}
}
function NetGraphPop(xid){
	var clss = ($('#Dot'+xid).attr('cx') > (width / 2)) ? 'pleft' : 'pright';
	$('#NetGraphPop').remove();
	$('#NetGraph').append('<div id="NetGraphPop" class="'+clss+' C0bk'+cmde+' C1br">'+
		'<table class="TDPadS text C3'+cmde+'">'+
			'<tr>'+
				'<td width="33%" class="center">'+
					'<div class="textmed">'+TimeAgo($DT['block'][xid]['tme'])+' Ago</div>'+
					'<div class="hbar LR80 o5 shim2"></div>'+
					'<div class="texttiny">'+$DT['block'][xid]['eff']+'% Effort</div>'+
				'</td>'+
				'<td width="33%" class="center">'+
					'<div class="textmed">'+$DT['block'][xid]['reward']+' XMR</div>'+
					'<div class="hbar LR80 o5 shim2"></div>'+
					'<div class="XMRHash texttiny" data-hash="'+$DT['block'][xid]['hash']+'"></div>'+
				'</td>'+
				'<td width="33%" class="center">'+
					'<div class="textmed">'+BlockToGo($DT['block'][xid]['height'])+'</div>'+
					'<div class="hbar LR80 o5 shim2"></div>'+
					'<div class="texttiny">Height '+ConvNum($DT['block'][xid]['height'])+'</div>'+
				'</td>'+
			'</tr>'+
		'</table>'+
		'<div id="NetGraphClose" class="C1fl C2fl_hov" data-block="'+xid+'">'+$ICO['plus']+'</div>'+
	'</div>');
	XMRHashTruncate();
	OpenToolTip(xid);
}
function graph_Miner(){
	if($('#MinerGraph').length){
		$('#MinerGraph').html(loadgrp);
		if(addr && $AC[addr]){
			if($AC[addr]['rate'] && $AC[addr]['rate']['pts']){
				graph_DrawMiner();
			}else{
				$.when(dta('minershash')).done(function(a){
					graph_DrawMiner();	
				});
			}
		}
	}
}
function graph_DrawMiner(){
	var ins = '',
		height = 150,
		timefirst = 999999999999999,
		graphhrs = (width > 900) ? $PR['miner']['hrs'] : 4,
		timestart = now - (3600 * graphhrs),
		padR = 65,
		right_x = width - padR,
		cnt = 0,
		j = 0,
		avg = 0,
		max = 0,
		xratio = 0;

	$.each($AC[addr]['rate']['pts'],function(k, v){
		if(v['tme'] >= timestart){
			avg = avg + v['hash'];
			if(v['hash'] > max) max = v['hash'];
			if(v['tme'] < timefirst) timefirst = v['tme'];
			cnt++;
		}
	});

	if(cnt > 0){
		if(timefirst >= timestart) timestart = timefirst;
		max = max * 1.25;
		xratio = right_x / (now - timestart);
		avg = avg / (cnt - 1);
		$PT['miner'] = {};
		$.each($AC[addr]['rate']['pts'],function(k, v){
			if(v['tme'] >= timestart){
				$PT['miner'][j] = {
					'x':Math.round((right_x - (now - parseInt(v['tme'])) * xratio) * 10) / 10,
					'y':Math.round((height - (v['hash']) / max * height) * 10) / 10
				};
				j++;
			}
		});
		
		ins = '<svg viewBox="0 0 '+width+' '+height+'" class="chart">'+
			'<defs>'+
				'<linearGradient id="M">'+
					'<stop offset="0%" stop-color="#818181" stop-opacity="0.15" /><stop offset="15%" stop-color="#818181" stop-opacity="0.25" /><stop offset="100%" stop-color="#818181" stop-opacity="1" />'+
				'</linearGradient>'+
			'</defs>';
			
		//Grid Lines
		ins += graph_Grid('line', 5, max, 0, height, width, 'C2');
		
		//MinerHash
		ins += '<polygon class="C0fl'+cmde+'" points="'+(width + 3)+','+$PT['miner'][0]['y'];
		$.each($PT['miner'],function(k, v){
			ins += ' '+v['x']+','+v['y'];
		});
		ins += ' -3,'+$PT['miner'][(j - 1)]['y']+' -3,'+(height + 3)+' '+(width + 3)+','+(height + 3)+'" />'+
			'<polyline stroke="url(#M)" stroke-width="2" points="'+right_x+','+$PT['miner'][0]['y'];
		$.each($PT['miner'],function(k,v){
			ins += ' '+v['x']+','+v['y'];
		});
		ins += ' -3,'+$PT['miner'][(j - 1)]['y']+'" />';
		
		var hsh = ConvHash($AC[addr]['rate']['pts'][0]['hash']),
			hs_y = $PT['miner'][0]['y'] + 2,
			lb_y = $PT['miner'][0]['y'] + 11;
			
		if($PT['miner'][0]['y'] > (height * .8)){
			hs_y = $PT['miner'][0]['y'] - 2;
			lb_y = $PT['miner'][0]['y'] - 19;
		}
		
		ins += '<text x="'+(right_x + 3)+'" y="'+hs_y+'" class="hashlable C3fl'+cmde+'">'+hsh['num']+' '+hsh['unit']+'</text>'+
		'<text x="'+(right_x + 3)+'" y="'+lb_y+'" class="texttinysvg C3fl'+cmde+' o7">Your Hash</text>';

		//Current Hash Dot
		ins += '<circle cx="'+right_x+'" cy="'+$PT['miner'][0]['y']+'" r="2" class="C2fl" />';
		
		//MinerHash Avg
		var avg_y = Math.round((height - avg / max * height) * 100) / 100,
			avg_h = ConvHash(avg);
			
		ins += '<line x1="55" y1="'+avg_y+'" x2="'+$PT['miner'][0]['x']+'" y2="'+avg_y+'" class="mineravgline C1st" />'+
			'<rect x="'+((width / 2) - 62.5)+'" y="'+(avg_y - 10)+'" width="125" height="20" rx="3" class="line C1fl" />'+
			'<text x="'+(width / 2)+'" y="'+(avg_y + 4)+'" text-anchor="middle" class="C0fl'+cmde+' texttiny">'+avg_h['num']+' '+avg_h['unit']+' Avg '+TimeAgo(timestart)+'</text>';

		//Grid Labels
		ins += graph_Grid('lbl', 5, max, 0, height, width, 'C2');

		//Time Ago
		ins += '<text x="5" y="'+(height - 2)+'" class="C2fl o8 texttiny">'+TimeAgo(timestart)+' Ago</text></svg>';	
	}else{
		ins = '<div id="MinerGraphAlert" class="textmed C2 o5">No Data</div>';
	}
	$('#MinerGraph').html(ins);
}
function graph_Worker(xid){
	var $T = $('.WorkerChart[data-worker="'+xid+'"]'),
		height = 19,
		width = $T.width(),
		i = j = max = 0,
		$PT_W = {},
		mintime = 99999999999,
		skclss = ($AC[addr]['wrkrs'][xid]['history'][0]['hsh'] === 0) ? 'C4st' : 'C2st',
		ins = '<svg viewBox="0 0 '+width+' '+height+'" class="chart">'+
			'<defs>'+
				'<linearGradient id="F" gradientTransform="rotate(90)">'+
					'<stop offset="0%" stop-color="#000" stop-opacity="0.07" /><stop offset="100%" stop-color="#000" stop-opacity="0.03" />'+
				'</linearGradient>'+
			'</defs>';
		
	$.each($AC[addr]['wrkrs'][xid]['history'],function(k,v){
		if(v['hsh'] > max) max = v['hsh'];
		if(v['tme'] < mintime) mintime = v['tme'];
		i++;
	});
	$.each($AC[addr]['wrkrs'][xid]['history'],function(k,v){
		$PT_W[j] = {
			'x':Math.round((width - (now - v['tme']) * (width / (now - mintime))) * 10) / 10,
			'y':Math.round((height - v['hsh'] * (height / max)) * 10) / 10
		};
		j++;
	});
	
	ins += '<polygon fill="url(#F)" points="'+(width + 2)+','+$PT_W[0]['y'];
	$.each($PT_W,function(k,v){
		ins += ' '+v['x']+','+v['y'];
	});
	ins += ' -2,'+$PT_W[(j - 1)]['y']+' -2,'+(height + 2)+' '+(width + 2)+','+(height + 2)+'" />'+
		'<polyline stroke-width="1.25" class="'+skclss+'" points="'+(width + 2)+','+$PT_W[0]['y'];

	$.each($PT_W,function(k,v){
		ins += ' '+v['x']+','+v['y'];
	});
	$T.html(ins+'" /></svg>');
}

//Helpers
function TimeAgo(tme){
	var timeago = now - parseInt(tme);
	if(timeago < 60){
		timeago = timeago+' Sec';
	}else if(timeago <= 3600){
		timeago = Math.round(timeago / 60)+' Min';
	}else if(timeago <= 86400){
		timeago = Math.round(timeago / 60 / 60)+' Hrs';
	}else{
		timeago = Math.round(timeago / 60 / 60 / 24)+' Days';
	}
	return timeago;
}

function ConvNum(num){
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function ConvXMR(x){
	x = (x > 0) ? Math.round(x / 10000) / 100000000 : 0;
	x = x.toFixed(8).toLocaleString('fullwide', {useGrouping:false});
	return x;
}
function RoundXMR(x){
	x = (x > 0) ? Math.round(x * 100000000) / 100000000 : 0;
	x = x.toFixed(8).toLocaleString('fullwide', {useGrouping:false});
	return x;
}
function XMRHashTruncate(){
	$('#Stage, #NetGraph, #ModalBody').find('.XMRHash').each(function(C, P){
		var $T = $(this), hsh = txt = $T.attr('data-hash'), fit = Math.floor($T.width() / 7.02 / 2);
		if(hsh.length > (fit * 2)) txt = hsh.substring(0, (fit - 1))+'...'+hsh.slice((2 - fit));
		$T.html('<a href="https://xmrchain.net/block/'+hsh+'" target="_blank" class="C1 C2_hov">'+txt+'</a>');
	});
}
function ConvHash(hash){
	hash = (hash > 0) ? hash : 0;
	var div = 1, $A = {'num':0, 'unit':'H/s'};
	if(hash > 1000000){
		div = 1000000;
		$A['unit'] = 'MH/s';
	}else if(hash > 1000){
		div = 1000;
		$A['unit'] = 'KH/s';
	}
	$A['num'] = (Math.round(hash / div * 10) / 10).toFixed(1);
	return $A;
}
function BlockToGo(h){
	var blockstogo = 60 - ($DT['netheight'] - h);
	return (blockstogo <= 0) ? 'Confirmed' : blockstogo+' To Go';
}
function SynchTime(t){
	if(t > now) now = t + 3;
}
function Truncate(s, l){
	return (s && s.length > 0 && l > 0) ? s.length > l ? s.substring(0, l - 3)+ '...' : s : s;
}
function getUrlVars(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++){
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

//jquery.cookie.js
!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof exports?module.exports=e(require("jquery")):e(jQuery)}(function(e){function n(e){return u.raw?e:encodeURIComponent(e)}function o(e){return u.raw?e:decodeURIComponent(e)}function i(e){return n(u.json?JSON.stringify(e):String(e))}function t(e){0===e.indexOf('"')&&(e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{return e=decodeURIComponent(e.replace(c," ")),u.json?JSON.parse(e):e}catch(e){}}function r(n,o){var i=u.raw?n:t(n);return e.isFunction(o)?o(i):i}var c=/\+/g,u=e.cookie=function(t,c,s){if(arguments.length>1&&!e.isFunction(c)){if("number"==typeof(s=e.extend({},u.defaults,s)).expires){var d=s.expires,f=s.expires=new Date;f.setMilliseconds(f.getMilliseconds()+864e5*d)}return document.cookie=[n(t),"=",i(c),s.expires?"; expires="+s.expires.toUTCString():"",s.path?"; path="+s.path:"",s.domain?"; domain="+s.domain:"",s.secure?"; secure":""].join("")}for(var a=t?void 0:{},p=document.cookie?document.cookie.split("; "):[],l=0,m=p.length;l<m;l++){var x=p[l].split("="),g=o(x.shift()),j=x.join("=");if(t===g){a=r(j,c);break}t||void 0===(j=r(j))||(a[g]=j)}return a};u.defaults={},e.removeCookie=function(n,o){return e.cookie(n,"",e.extend({},o,{expires:-1})),!e.cookie(n)}});