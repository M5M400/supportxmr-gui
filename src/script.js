var nav = '',
	addr = getUrlVars()['addr'] || '',
	mode = 'light',
	cmde = '-l',
	resizeTimer,
	updateTimer = 60,
	updateCounter,
	now = Rnd((new Date()).getTime() / 1000),
	width = $('body').width(),
	tooltip_open = '',
	APICon = 'y',
	xmrreg = /^[4|8]([0-9]|[A-B])(.){93}/,
	//Account Memory
	$A = {},
	//Settings Memory
	$M = {
		'addr':{},
		'pref':'LNA',
		'updt':{
			'net':0,
			'pool':0,
			'miner':0,
			'worker':0,
			'alert':0
		}
	},
	//Data Digests	
	$D = {'alert':{}, 'block':{}, 'blockxy':{}, 'blockhistory':{}, 'net':{}, 'pool':{}, 'poolstats':{}, 'pay':{}, 'poolpay':{}, 'netheight':''},
	//Icons
	$I = {
		'light':'<svg viewBox="0 0 99 99"><circle opacity=".5" cx="48.9" cy="48.9" r="31.6"/><path d="M98.6 58.4L87.9 49l10.3-9.8c.5-.6.5-2.1-.6-2.4l-13.7-4 5-13.2c.5-1.2-.5-2.1-1.5-2L73.3 20 72 6C72 4.4 70.8 4 70 4.7l-11.8 8L51 .5c-.6-.7-1.9-.7-2.5 0l-8.2 14-14.2-8C25 5.6 24 6.3 24 7.6v14.1L9.7 20.7c-1.4-.1-1.9 1-1.4 2l6 12.8-13.3 5C-.3 41-.3 42 .6 43l11 9L1.7 62c-1 1-.5 2.1.7 2.4L16.3 68l-4.6 13.4c-.4 1 .5 2.2 1.7 1.9l14-2.8 1.7 14c.1 1.4 1.7 1.7 2.3 1L42.8 87l7.6 11.6c.6.7 2 .7 2.5-.1l6.7-12.1 12 7.6c1.1.6 2.2 0 2.3-1.2l.5-14.1 14.2 1.7c1.3.1 2-1 1.5-2l-5.6-13 13.6-4.5c1.1-.5 1.1-1.8.5-2.4zm-49.4 21a30.1 30.1 0 1 1 0-60.3 30.1 30.1 0 0 1 0 60.2z"/></svg>',
		'dark':'<svg viewBox="0 0 99 99"><path d="M25.2 19.6l5.3 10.6 11.7 1.7-8.5 8.3 2 11.6-10.5-5.5-10.4 5.5 2-11.6-8.5-8.3L20 30.2l5.2-10.6zm29.6-3.4l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.5 2.9 1-6-4.3-4.3 6-1 2.8-5.4zM64.8 0A46 46 0 0 1 0 64.4 50.9 50.9 0 1 0 64.6 0z"/></svg>',
		'settings':'<svg viewBox="0 0 99 99"><path d="M19.7 50.74V10.92l-6.4 1.69v38.12a16.1 16.1 0 0 0 0 31.53v4.17l6.4 1.65v-5.82a16.09 16.09 0 0 0 0-31.52zm-3.2 25.34a9.58 9.58 0 1 1 0-19.16 9.58 9.58 0 0 1 0 19.16zm36.2-59.51S52.66 0 52.7 0h-6.4v16.57a16.09 16.09 0 0 0 0 31.53V99h6.4V48.1a16.09 16.09 0 0 0 0-31.53zm-3.2 25.35a9.58 9.58 0 1 1 0-19.17 9.58 9.58 0 0 1 0 19.17zm36.2-1.18V12.62l-6.4-1.7v29.81a16.09 16.09 0 0 0 0 31.53v15.82l6.4-1.68V72.26a16.09 16.09 0 0 0 0-31.52zm-3.2 25.34a9.58 9.58 0 1 1 0-19.16 9.58 9.58 0 0 1 0 19.16z"/></svg>',
		'loader':'<svg viewBox="0 0 99 99"><path class="L1 C1fl" d="M66 6l10 14-14 11-10-14L66 6"/><path class="L2 C1fl" d="M41 25l11 14-14 11-11-14 14-11"/><path class="L3 C1fl" d="M60 50l11 13-14 11-11-14 14-10"/><path class="L4 C1fl" d="M37 68l10 14-14 11-10-14 14-11"/><path d="M58 40L42 19 21 35l16 21 21-16zM41 25l11 14-14 11-11-14 14-11zm42-4L66 0 45 16l17 21 21-16zM66 6l10 14-14 11-10-14L66 6zM16 78l17 21 21-16-17-21-21 16zm17 15L23 79l14-11 10 14-14 11zm7-33l16 21 21-17-16-21-21 17zm17 14L46 60l14-10 11 13-14 11z"/></svg>',
		'loader_stopped':'<svg viewBox="0 0 99 99"><path d="M58.2 39.9L42 19 21.1 35.3l16.3 20.9 20.8-16.3zm24.4-19L66.3 0 45.4 16.3l16.3 20.9 20.9-16.3zM16.4 78L32.7 99l20.9-16.3-16.3-20.9-20.9 16.3zm23.7-18.4l16.3 20.8 20.8-16.3L61 43.3 40.1 59.7z"/></svg>',
		'arrow':'<svg viewBox="0 0 99 99"><path d="M27 78l28-29-28-28C17 10 33-8 45 4l35 37c5 5 5 12 0 17L45 95c-12 12-29-6-18-17z"/></svg>',
		'sort':'<svg viewBox="0 0 99 99"><path d="M56 45L35 25 15 45C8 52-6 40 3 32L29 6c4-3 9-3 12 0l27 26c9 8-4 20-12 13zm-13 9l21 20 20-20c7-7 21 5 12 13L70 93c-4 3-9 3-12 0L31 67c-9-8 4-20 12-13z"/></svg>',
		'refresh':'<svg viewBox="0 0 99 99"><path d="M0 55.7v31l9.2-8.5a49.5 49.5 0 0 0 89.4-22.5H86.1a37.1 37.1 0 0 1-67.7 14l15.3-14H0zM49.5 0C24.3 0 3.5 18.9.4 43.3h12.5a37.1 37.1 0 0 1 68.3-13.1L68.1 43.3H99v-31l-8.9 9A49.4 49.4 0 0 0 49.5 0z"/></svg>',
		'x':'<svg viewBox="0 0 99 99"><path d="M99 77L71 50l28-28L77 0 50 28 22 0 0 22l28 28L0 77l22 22 28-28 27 28"/></svg>',
		'delete':'<svg viewBox="0 0 98 98"><path d="M81.8 27H15.2c-8 0-8-12.8-1-12.8 0 0 12.7 2 15.7-10.8 0-3 2.8-4 4.8-4h27.4c2 0 4 1 5 4C69 17 82.7 14.2 82.7 14.2c7 0 7 12.7-1 12.7zm-45 59.7c0 5-8 5-8 0v-43s8-5 8 0v43zm15.6 0c0 5-7.8 5-7.8 0v-43s7.8-5 7.8 0v43zm15.7 0c0 5-7.7 5-7.7 0v-43s7.8-5 7.8 0v43zm11-54H18c-4.8 0-7.7 3-6.7 8l6.8 50c1 4 5 7.8 9 7.8h43c4 0 9-3 9-8l6.7-49.8c0-5-3-8-6.8-8z"/></svg>',
	},
	loadgrp = '<div class="center"><div class="C1fl shimtop30 o7 Loader">'+$I['loader']+'</div></div>';

$(function(){
	//Populate Icons
	$('#Mode').append($I['dark']);
	$('#Timer').html('<div class="C1fl preload">'+$I['refresh']+'</div>');
	$('#HeadMenu .select-point').html($I['arrow']);
	
	//Read Cookie & Instantiate
	CookieRead();
	if(addr == '' && $M['addr'][0]) addr = $M['addr'][0];
	if(mode === 'light' && $M['pref'] && $M['pref'].charAt(0) === 'D'){
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
	$(document.body).on('change', '#MinerAddress, #MinerAddrRecent select', function(e){
		addr = $(this).val();
		$('#MinerAddrRecent select').val('');
		$('#MinerAddress').val(addr);
		reset_MinerAccount();
		if(xmrreg.test(addr)){
			$('#MinerAddress').removeClass('C4');
			CookieAddrEdit(addr, 'add');
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
	$('#HeadMenu select').on('change', function(e){
		var $T = $(this), val = $T.val();
		if(val === 'testnet'){
			$T.val('home');
			LoadAlert('NetGraph');
		}else if(val === 'testuser'){
			$T.val('home');
			LoadAlert('MinerGraph');
		}else{
			Navigate(val);
		}
	});
	$(document.body).on('mouseenter', '#HeadMenu, #MinerAddrRecent', function(){
		$(this).find('.select-point').addClass('o5');
	}).on('mouseleave', '#HeadMenu, #MinerAddrRecent', function(){
		$(this).find('.select-point').removeClass('o5');
	});
	$(document.body).on('touchstart click', '.nav', function(e){
		e.stopPropagation();
		Navigate($(this).attr('data-tar'));
	});
	$('#Mode').on('click', function(e){
		e.stopPropagation();
		mode = (mode === 'dark') ? 'light' : 'dark';
		cmde = (mode === 'dark') ? '-d' : '-l';
		ToggleMode();
		CookiePrefEdit('mode', mode.charAt(0).toUpperCase());
	});
	$('header').on('mouseenter', '#Timer', function(){
		$('#TimerRefresh').removeClass('hide');
	}).on('mouseleave', '#Timer', function(){
		$('#TimerRefresh').addClass('hide');
	});
	$('#Timer').on('touchstart click', function(e){
		e.stopPropagation();
		$('#Timer').html('<div class="C1fl preload" style="padding:5px;box-sizing:border-box">'+$I['refresh']+'</div>');
		setTimeout(function(){
			TimerUpdateData();
		}, 1500);
	});
	$('#Stage').on('touchstart click', '#MinerPaymentsBtn', function(e){
		e.stopPropagation();
		if($('#MinerPayments').hasClass('hide')){
			if(addr && $A[addr]) LoadMinerPayments();
		}else{
			CloseMinerPayments();
		}
	});
	$('#Stage').on('touchstart click', '#MinerPayNowBtn', function(e){
		e.stopPropagation();
		$('#MinerPayNow').html(loadgrp);
		setTimeout(function(){
			$('#MinerPayNow').html('<div class="center C3'+cmde+' text">Demo - Need Endpoint</div>');
		}, 1500);
	});
	$('#Stage').on('touchstart click', '.PaymentPag', function(e){
		e.stopPropagation();
		var pge = $(this).attr('data-page');
		if(pge !== 'end' && pge !== 'start'){
			$('#MinerPaymentsList').find('table').html('<tr><td>'+loadgrp+'</td></tr>');
			LoadMinerPayments(pge);
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
	$(document.body).on('touchstart click', '#News .Close', function(e){
		e.stopPropagation();
		$('#News').addClass('hide');
		$.cookie('SupportXMRNews', $D['alert']['created'], {expires:365, path:'/'});
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
	$('#HeadLogoMark').addClass('Loader').html($I['loader']);
}
function MainLoaderOff(){
	$('#HeadLogoMark').removeClass('Loader').html($I['loader_stopped']);
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
	$('#Timer').html('<div id="TimerPie" class="C1bk"><div id="TimerDisc" class="C0bk'+cmde+'"></div><div id="TimerText" class="texttinysvg C1">60</div></div>'+
		'<div id="TimerRefresh" class="C2fl C0bk'+cmde+' hide">'+$I['refresh']+'</div>');

	updateCounter = setInterval(function(){
		if(document.hasFocus()) updateTimer--;
		if(updateTimer <= 0){
			$('#Timer').html('<div class="C1fl preload">'+$I['refresh']+'</div>');
			clearInterval(updateCounter);
			setTimeout(function(){
				//this delay stretches the number of lookups a bit
				TimerUpdateData();
			}, 2000);
		}else{
			var clr = (mode === 'dark') ? '313131' : 'e8e8e8',
				grd = 'linear-gradient('+(-90 + (360 * updateTimer / 60))+'deg, transparent 50%, #F06A25',
				txt = (APICon === 'y') ? updateTimer : '<div class="C4fl">'+$I['x']+'</div>';
				
			if(updateTimer < 30) grd = 'linear-gradient('+(90 + (360 * updateTimer / 60))+'deg, transparent 50%, #'+clr;
			$('#TimerPie').css('background-image', grd+' 50%),linear-gradient(90deg, #'+clr+' 50%, transparent 50%)');
			$('#TimerText').html(txt);
		}
	}, 1000);
}

function TimerUpdateData(){
	ClearAlert();
	$.when(dta('alert'),dta('netheight'),dta('block'),dta('net'),dta('pool')).then(function(){
		graph_MainNet();
		load_MinerAccount();
		updateTimer = 60;
		LoadTimer();

		if($D['alert'] && $D['alert']['created']){
			if($.cookie('SupportXMRNews') == $D['alert']['created']){
				$('#News').addClass('hide');
			}else{
				var ins = '<div class="textmed">'+$D['alert']['subject']+'</div>'+
					'<div class="text"><span class="texttiny">('+Ago($D['alert']['created'])+' Ago)</span> - '+$D['alert']['body']+'</div>'+
					'<div class="Close C0fl'+cmde+'">'+$I['x']+'</div>';
					
				$('#News').removeClass('hide').html(ins);
			}
		}
	});
}
function Resize(){
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(function(){
		width = $('body').width();
		graph_MainNet();
		graph_Miner();
		
		if(!$('#MinerPayments').hasClass('hide')){
			LoadMinerPayments($('#MinerPaymentsPage').val());
		}
		
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

	$('#Mode').html($I[bt]);
	for(var i = 0; i <= 5; i++) {
		$('.'+$CL[i]+'-'+bt.charAt(0)).each(function(){
			$(this).removeClass($CL[i]+'-'+bt.charAt(0)).addClass($CL[i]+'-'+mode.charAt(0));
		});
	}
	//color update for svgs on screen
	$('.C0fl-l,.C0fl-d').css('fill', '#'+$C[mode]['b']);	
	$('.C0st-l,.C0st-d').css('stroke', '#'+$C[mode]['b']);
	$('.C3fl-l, .C3fl-l').css('fill', '#'+$C[mode]['f']);
}
function CookieRead(){
	var cka = $.cookie('SupportXMRAddr'), ckp = $.cookie('SupportXMRPref'), i = 0, $ADR = {};
	if(cka){
		if(cka.indexOf('#') >= 0){						//multi address
			var ck_arr = cka.split('#');
			for (var i = 0; i < ck_arr.length; i++){
				$ADR[i] = ck_arr[i];
			}
		}else{											//single address
			$ADR[0] = cka;
		}
	}
	if(ckp) $M['pref'] = ckp;
	$M['addr'] = $ADR;
}
function CookieAddrEdit(adr, mde){
	var $Mtmp = {}, fin = '', j = 0, numadr = Object.keys($M['addr']).length, v;
	if(mde === 'add'){
		$Mtmp[0] = adr;
		fin = adr;
		j++;
	}
	if($M['addr'] && numadr > 0){
		for(var i = 0; i < numadr; i++){
			if($M['addr'][i]){
				v = $M['addr'][i];
				if(j < 25 && v !== adr){
					$Mtmp[j] = v;
					fin += (j !== 0) ? '#'+v : v;
					j++;
				}
			}
		}
	}else{
		fin = adr;
	}
	$M['addr'] = $Mtmp;
	if(mde === 'del'){
		reset_MinerAccount();
		if($M['addr'][0]){
			addr = $M['addr'][0];
			$('#MinerAddress').val(addr);
		}
		load_MinerAccount();
	}
	$.removeCookie('SupportXMRAddr', { path: '/' });
	$.cookie('SupportXMRAddr', fin, {expires:365, path:'/'});
	MultipleAddress();
}
function CookiePrefEdit(col, val){
	var mde = ($M['pref'][0] === 'D') ? 'D' : 'L',
		srt = ($M['pref'][1] === 'R') ? 'R' : 'N',
		ord = ($M['pref'][2] === 'D') ? 'D' : 'A',
		srtord = srt+ord;

	if(col === 'mode'){
		mde = val;
	}else if(col === 'sort'){
		srtord = val;
	}
	$M['pref'] = mde+srtord;
	$.removeCookie('SupportXMRPref', { path: '/' });
	$.cookie('SupportXMRPref', mde+srtord, {expires:365, path:'/'});
}

function MultipleAddress(){
	var numadr = Object.keys($M['addr']).length;
	$('#MinerAddrRecent, #MinerAddrDelete').remove();
	if($M['addr'] && numadr > 1){
		//Check for multiple addresses
		ins = '<div id="MinerAddrRecent"><select class="C3'+cmde+' C0bk'+cmde+' texttinysvg"><option value="">Recent</option>';
		for(var i = 0; i < numadr; i++){
			if($M['addr'][i]){
				var v = $M['addr'][i];
				ins += '<option value="'+v+'">'+v.substring(0, 3)+'...'+v.substr(v.length - 4)+'</option>';
			}
		}
		$('#MinerAddress').addClass('MinerAddressMulti');
		$('#MinerAddressCell').prepend(ins+'</select><div class="select-point C1fl rot90">'+$I['arrow']+'</div></div><div id="MinerAddrDelete" class="C1fl hov">'+$I['delete']+'</div>');
	}else{
		$('#MinerAddress').removeClass('MinerAddressMulti');
	}
}

function Navigate(tar){
	MainLoaderOn();
	$('#Stage').removeClass('StageFade');
	$('.nav').each(function(){$(this).removeClass('o5')});
	setTimeout(function(){
		if(['blocks','payments','help'].indexOf(tar) >= 0){
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
		lclss = (pge == 1) ? 'C2fl o5 nopoint' : 'C1fl hov',
		rclss = (pge == pgs) ? 'C2fl o5 nopoint' : 'C1fl hov';
		
	if(width < 700){
		cls = 'texttable';
	}else if(width < 600){
		cls = 'texttiny';
	}
	$T.html('<table><tr>'+
		'<td><div class="PagBtn" data-page="'+prevpage+'"><div class="'+lclss+' rot180">'+$I['arrow']+'</div></div></td>'+
		'<td><input type="text" class="PagBox texttable C1 C1br" value="'+pge+'" autocomplete="off" data-tot="'+pgs+'"></td>'+
		'<td class="'+cls+' C3'+cmde+'">of '+Num(pgs)+' Pages</td>'+
		'<td><select class="PagSel texttable C1 C1br"><option>25</option><option>50</option><option>100</option></select></td>'+
		'<td><div class="PagBtn" data-page="'+nextpage+'"><div class="'+rclss+'">'+$I['arrow']+'</div></div></td>'+
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
		val = Num(val);
	}else if(val > 99){
		wid = 32;
	}else if(val > 9){
		wid = 24;
	}
	$T.css('width', wid+'px').val(val);
}

function pge_Home(){
	var ins = '<section id="News" class="C1bk C0-l LR85 hide shimtop20"></section>'+
		'<section id="MinerAccount">'+
		'<table class="LR85 shim20 TDPadS C3'+cmde+'"><tr>'+
			'<td width="99%"><div class="hbar"></div><div id="MinerAddressCell"><input id="MinerAddress" type="text" class="FLD text C3'+cmde+'" placeholder="Your Monero Address..." value="'+addr+'"></div><div class="hbar"></div></td>'+
			'<td><div id="MinerPending" class="textlrg">--</div><div class="hbar shim4"></div><div class="texttiny C2 center">XMR Pending</div></td>'+
			'<td><div id="MinerPaymentsBtn" class="btnback nopoint"><div class="Loader C1fl">'+$I['loader']+'</div></div></td>'+
			'<td><div id="MinerPaid" class="textlrg">--</div><div class="hbar shim4"></div><div class="texttiny C2 center">XMR Paid</div></td>'+
		'</tr></table>'+
		'</section>'+
		'<div class="hbar"></div>'+
		'<section id="MinerPayments" class="hide"></section>'+
		'<section id="MinerGraph"></section>'+
		'<section id="MinerWorkers">'+
			'<table class="TDPadM LR85 C3'+cmde+'"><tr>'+
				'<td width="33%" class="center"><div id="MinerHashes" class="textlrg o5">--</div><div class="hbar LR80 o5 shim4"></div><div class="texttiny C2">Total Hashes</div></td>'+
				'<td width="33%" class="center"><div id="MinerWorkerCount" class="textlrg o5">--</div><div class="hbar LR80 o5 shim4"></div><div id="MinerLastHash" class="texttiny C2 o5">--</div></td>'+
				'<td width="33%" class="center"><div id="MinerShares" class="textlrg o5">-- / --</div><div class="hbar LR80 o5 shim4"></div><div class="texttiny C2">Valid / Invalid Shares</div></td>'+
			'</tr></table>'+
			'<div id="MinerWorkersList" class="LR85 shimtop20"></div>'+
		'</section>';

	$('#Stage').html(ins).addClass('StageFade');
}

function load_MinerAccount(){
	if(addr && xmrreg.test(addr)){
		$.when(dta('account')).done(function(a){
			if($A[addr]){
				graph_Miner();
				MultipleAddress();
				$('#MinerPending').removeClass('o5').html($A[addr]['due']);
				var dec = 8;
				if($A[addr]['paid'] > 99999){
					dec = 4;
				}else if($A[addr]['paid'] > 9999){
					dec = 5;
				}else if($A[addr]['paid'] > 999){
					dec = 6;
				}else if($A[addr]['paid'] > 99){
					dec = 7;
				}
				$('#MinerPaid').removeClass('o5').html(Rnd($A[addr]['paid'], dec));
				$('#MinerHashes').removeClass('o5').html(Num($A[addr]['hashes']));
				$('#MinerShares').removeClass('o5').html(Num($A[addr]['val'])+' / '+Num($A[addr]['inv']));
				$.when(dta('workers', addr)).done(function(a){
					var wcn = ($A[addr]['wrkrs'] && Object.keys($A[addr]['wrkrs']).length > 0) ? Object.keys($A[addr]['wrkrs']).length : 0,
						lbl = (wcn === 1) ? 'Worker' : 'Workers';
						
					$('#MinerPaymentsBtn').removeClass('nopoint C0fl'+cmde).addClass('C1fl hov').html($I['settings']);
					$('#MinerWorkerCount').removeClass('o5').html(wcn+' '+lbl);
					$('#MinerLastHash').html('--');
					init_MinerWorkers();
				});
			}else{
				reset_MinerAccount();
				$('#MinerGraph').html('<div class="MinerMsg C3'+cmde+'"><div class="textmed">Address Not Found</div><div class="LR80 text shim10">If you\'ve submitted your first share, be patient, it may take a minute or two to update. If your shares are being rejected, visit the <u class="nav C1" data-tar="help">help section.</u></div></div>');
			}
			MainLoaderOff();
		});
	}else{
		reset_MinerAccount();
		$('#MinerGraph').html('<div class="MinerMsg C3'+cmde+'">'+
			'<div class="textmed">Welcome to SupportXMR.com</div>'+
			'<div class="LR80 text shim10">Visit the <u class="nav C1" data-tar="help">help section</u> to get setup, then enter your Monero address above. After you\'ve submitted a share, your information will appear here.</div>'+
		'</div>');
	}
}
function reset_MinerAccount(){
	$('#MinerWorkersList, #MinerGraph').html('');
	$('#MinerPayments').empty().addClass('hide');
	$('#MinerPaymentsBtn').removeClass('C1fl').addClass('nopoint').html('<div class="C2fl o5">'+$I['settings']+'</div>');
	$('#MinerPending, #MinerPaid, #MinerHashes, #MinerLastHash, #MinerWorkerCount').addClass('o5').html('--');
	$('#MinerShares').addClass('o5').html('-- / --');
}
function init_MinerWorkers(resort){
	if($A[addr]['wrkrs']){
		var $W = $A[addr]['wrkrs'],
			numwrk = Object.keys($W).length,
			i, ky,
			lasthash = 0,
			blkclss = '',
			ins = '<table id="WorkerSortGroup" class="TDPadS texttiny C2 hide"><tr>'+
				'<td><div class="WorkerSort C2bk C0fl'+cmde+'" data-col="name" data-ord="D">'+$I['sort']+'</div></td>'+
				'<td NOWRAP>Sort by Name</td>'+
				'<td width="99%"></td>'+
				'<td NOWRAP>Sort by Hashrate</td>'+
				'<td><div class="WorkerSort C2bk C0fl'+cmde+' nopoint" data-col="rate" data-ord="D">'+$I['sort']+'</div></td>'+
			'</tr></table>',
			srt = 'name',
			ord = 'A',
			sortarr = [];
		
		if($M['pref'].charAt(1) === 'R'){
			srt = 'rate';
		}else if($M['pref'].charAt(1) === 'N'){
			srt = 'name';
		}
		if(['A','D'].indexOf($M['pref'].charAt(2)) >= 0) ord = $M['pref'].charAt(2);
		
		for(i = 0; i < numwrk; i++){
			sortarr.push([i, $W[i][srt]]);
		}
		
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

		for(i = 0; i < numwrk; i++){
			var ky = sortarr[i][0];
			ins += '<div class="WWrap'+blkclss+'"><div class="WBlock C1br C2br_hov C3'+cmde+' " data-key="'+ky+'">'+
				'<div id="WName-'+ky+'" class="textmed WBL"></div><div id="WRate-'+ky+'" class="textmed WBR">--</div>'+
				'<div id="WHashes-'+ky+'" class="texttiny WBL"></div><div id="WLast-'+ky+'" class="texttiny WBR">--</div>'+
				'<div id="WVal-'+ky+'" class="Expand hide texttiny WBL"></div><div id="WInv-'+ky+'" class="Expand hide texttiny WBR">--</div>'+
				'<div class="WorkerChart" data-worker="'+ky+'"></div>'+
			'</div></div>';
		}
		$('#MinerWorkersList').html(ins+'<div class="clear"></div>');
		
		for(i = 0; i < numwrk; i++){
			$('#WName-'+sortarr[i][0]).html(Truncate($W[sortarr[i][0]]['name'], Rnd($('#WName-0').width() / 6.25)));
		}
		sort_MinerWorkers(i, srt, ord, resort);

		i = 0;
		$.each(sortarr,function(k,v){
			var ky = v[0];
			$.when(dta('worker', ky, $W[ky]['name'])).done(function(a){
				if($W[ky]['rate'] > 0){
					var hsh = ConvHash($W[ky]['rate']),
						lst = $W[ky]['last'];
						
					$('#WRate-'+ky).html(hsh['num']+' '+hsh['unit']);
					if(lst > 0){
						SynchTime($A[addr]['wrkrs'][ky]['last']);
						$('#WLast-'+ky).html(Ago(lst)+' Ago');
						if(lst > lasthash) lasthash = lst;	
					}
					if($W[ky]['history']){
						graph_Worker(ky);
					}
				}else{
					$('.WBlock[reference="'+ky+'"]').addClass('C4br');
					$('.WBlock[reference="'+ky+'"] table').addClass('C4');	
				}
				if(resort !== 'y' && i === (numwrk - 1)){
					$('#MinerLastHash').removeClass('o5').html(Ago(lasthash)+' Ago');
					init_MinerWorkers('y');
				}
				i++;
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
		if(cmplt === 'y'){
			if(col === 'rate'){
				$('.WorkerSort[data-col="name"]').removeClass('C1bk').addClass('hov C2bk').html($I['sort']);
				$('.WorkerSort[data-col="rate"]').attr('data-ord', ordV).removeClass('nopoint C2bk').addClass('hov C1bk '+orot).html($I['arrow']);	
			}else if(col === 'name'){
				$('.WorkerSort[data-col="name"]').attr('data-ord', ordV).removeClass('C2bk').addClass('hov C1bk '+orot).html($I['arrow']);
				$('.WorkerSort[data-col="rate"]').removeClass('nopoint C1bk').addClass('hov C2bk').html($I['sort']);					
			}
		}else{
			var loader = '<div class="preload C0fl'+cmde+'">'+$I['refresh']+'</div>';
			if(col === 'rate'){
				$('.WorkerSort[data-col="name"]').removeClass('C1bk').addClass('hov C2bk C0fl'+cmde).html($I['sort']);
				$('.WorkerSort[data-col="rate"]').attr('data-ord', ordV).removeClass('hov C2bk').addClass('nopoint C1bk').html(loader);
			}else if(col === 'name'){
				$('.WorkerSort[data-col="name"]').attr('data-ord', ordV).removeClass('C2bk').addClass('hov C1bk '+orot).html($I['arrow']);
				$('.WorkerSort[data-col="rate"]').removeClass('hov C1bk').addClass('nopoint C2bk').html(loader);
			}	
		}
	}
}

function load_MinerWorkerDetail(xid){
	var $W = $A[addr]['wrkrs'][xid];
	$.when(dta('workerdetail', xid, $W['name'])).done(function(a){
		$('#WHashes-'+xid).html(Num($W['hashes'])+' Hashes');
		$('#WVal-'+xid).html(Num($W['val'])+' Valid');
		$('#WInv-'+xid).html(Num($W['inv'])+' Invalid');
	});
}

function pge_Blocks(pge, lim){
	pge = (pge > 1) ? pge : 1;
	lim = (lim >= 25) ? lim : 25;
	$('#Stage').html('<table class="LR80 C3'+cmde+'  shim20"><tr>'+
		'<td id="BlockHeader" class="textmed"></td>'+
		'<td class="right texttiny"><div id="BlocksPag" class="Pag"></div></td>'+
	'</tr></table><div class="hbar shim4"></div><div id="BlockList" class="LR80"></div>').addClass('StageFade');
	dta_Blocks(pge, lim);
}

function dta_Blocks(pge, lim){
	$('#BlockList').html(loadgrp);
	$.when(dta('poolstats')).done(function(a){
		$('#BlockHeader').html(Num($D['poolstats']['blocks'])+' Blocks Found with '+Num($D['poolstats']['hashes'])+' Hashes');
		if(pge == 1){
			$D['blockhistory'] = $D['block'];
			tbl_Blocks(pge, lim);
		}else{
			$.when(dta('blockhistory', pge, lim)).done(function(a){
				tbl_Blocks(pge, lim);
			});
		}
	});	
}
function tbl_Blocks(pge, lim){
	var ins = '<table class="contable shim4 C3'+cmde+' ">'+
		'<tr class="texttiny">'+
			'<td width="70">Block Mined</td>'+
			'<td width="90" class="center">Maturity</td>'+
			'<td width="70" class="center">Effort</td>'+
			'<td width="90" class="center">Reward (XMR)</td>'+
			'<td class="right">Transaction</td>'+
			'<td width="90" class="right">Block Height</td>'+
		'</tr>',
		row = 'ROW0';
		
	for(var i = 0; i < lim; i++){
		row = (i % 2 === 0) ? 'ROW1' : 'ROW0';
		var clss = ($D['blockhistory'][i]['eff'] > 100) ? 'C4' : 'C5';
		ins += '<tr class="texttable '+row+'">'+
			'<td>'+Ago($D['blockhistory'][i]['tme'])+' Ago</td>'+
			'<td class="center">'+BlockToGo($D['blockhistory'][i]['height'])+'</td>'+
			'<td class="center"><span class="'+clss+'">'+$D['blockhistory'][i]['eff']+'%</span></td>'+
			'<td class="center">'+$D['blockhistory'][i]['reward']+'</td>'+
			'<td class="XMRHash right" data-hash="'+$D['blockhistory'][i]['hash']+'"></td>'+
			'<td class="right">'+Num($D['blockhistory'][i]['height'])+'</td>'+
		'</tr>';
	}
	$('#BlockList').html(ins+'</table>');
	XMRHashTruncate();
	
	Pagination('BlocksPag', lim, $D['poolstats']['blocks'], pge);
	MainLoaderOff();
}

function pge_Payments(pge, lim){
	pge = (pge > 1) ? pge : 1;
	lim = (lim >= 25) ? lim : 25;
	
	$('#Stage').html('<table class="LR80 C3'+cmde+'  shim20"><tr>'+
		'<td id="PaymentHeader" class="textmed"></div></td>'+
		'<td class="right texttiny"><div id="PaymentPag" class="Pag"></div></td>'+
	'</tr></table><div class="hbar shim4"></div><div id="PaymentList" class="LR80"></div>').addClass('StageFade');
	
	$.when(dta('poolstats')).done(function(a){
		$('#PaymentHeader').html(Num($D['poolstats']['payments'])+' Payments to '+Num($D['poolstats']['minerspaid'])+' Miners');
		dta_Payments(pge, lim);
	});
}

function dta_Payments(pge, lim){
	$('#PaymentList').html(loadgrp);
	$.when(dta('poolpay', pge, lim)).done(function(a){
		var ins = '<table class="contable shim4 C3'+cmde+' ">'+
			'<tr class="texttiny">'+
				'<td width="70">Payment Sent</td>'+
				'<td width="50" class="center">Payees</td>'+
				'<td>Transaction</td>'+
				'<td width="80" class="center">Amount (XMR)</td>'+
				'<td width="80" class="right">Fee (XMR)</td>'+
			'</tr>',
			row = 'ROW0';
			
		for(var i = 0; i < lim; i++){
			row = (i % 2 === 0) ? 'ROW1' : 'ROW0';
			ins += '<tr class="texttable '+row+'">'+
				'<td>'+Ago($D['poolpay'][i]['ts'] / 1000)+' Ago</td>'+
				'<td class="center">'+$D['poolpay'][i]['payees']+'</td>'+
				'<td class="XMRHash" data-hash="'+$D['poolpay'][i]['hash']+'"></td>'+
				'<td class="center">'+ConvAtomicXMR($D['poolpay'][i]['value'])+'</td>'+
				'<td class="right">'+ConvAtomicXMR($D['poolpay'][i]['fee'])+'</td>'+
			'</tr>';
		}
		$('#PaymentList').html(ins+'</table>');
		XMRHashTruncate();
		Pagination('PaymentPag', lim, $D['poolstats']['payments'], pge);
		MainLoaderOff();
	});
}

function pge_Help(){
	setTimeout(function(){
		var ins = '<table class="LR80 C3'+cmde+' shim20"><tr>'+
			'<td id="BlockHeader" class="textmed">Welcome to SupportXMR.com</td>'+
			'<td class="right texttiny">Join Us on IRC<br>#monero-pools</td>'+
		'</tr></table>'+
		'<div class="hbar shim4"></div>'+
		'<div class="LR80 text C3'+cmde+' shim30">'+
			'<p>Getting started is easy and this pool has a large and friendly community that are happy to help you. The pool operators are M5M400 and Snipa22 who can be reached in the #monero-pools IRC or at <a href="mailto:support@supportxmr.com" class="C1 hov">support@supportxmr.com</a>. Please be patient and someone will get back to you. Most of the time help can be found quicker in the chat.</p>'+
			'<p>The pool has a quite stable and knowlegable community - you can join the chat and seek help and a friendly chat there :)</p>'+
			'<div class="helpgroup">'+
				'<div class="helptitle">'+
					'<div class="helpbtn btnback C1fl">'+$I['arrow']+'</div>'+
					'<span class="helpbtntext point textlrg C1">Step 1 - Install Wallet & Create Address</span>'+
				'</div>'+
				'<div class="helpteaser text ">Start here if you need a Monero address and wallet.</div>'+
				'<div class="helpcontent text hide">'+
					'<p>The <a href="https://www.getmonero.org/downloads/" target="_blank" class="C1 hov">Official Monero Wallet</a> is recommended. Monero Outreach\'s <a href="https://www.monerooutreach.org/stories/monero_wallet_quickstart.php" class="C1 hov" target="_blank">Wallet Guide</a> has a list of other wallet options including paper wallets.</p>'+
				'</div>'+
			'</div>'+
			'<div class="helpgroup">'+
				'<div class="helptitle">'+
					'<div class="helpbtn btnback C1fl">'+$I['arrow']+'</div>'+
					'<span class="helpbtntext point textlrg C1">Step 2 - Install Mining Software</span>'+
				'</div>'+
				'<div class="helpteaser text">Install the software needed to mine Monero.</div>'+
				'<div class="helpcontent text hide">'+
					'<p>Select the miner that best suits your hardware and follow their installation instructions. If you need help, visit #monero-pools.</p>'+
					'<p><table class="texttable C3'+cmde+'"><tr>'+
						'<td NOWRAP>'+
							'<i>Alphabetically</i><br>'+
							'<a href="https://github.com/KlausT/ccminer-cryptonight/releases" class="C1 hov" target="_blank">ccminer-cryptonight</a> (Nvidia)<br>'+
							'<a href="https://bitcointalk.org/index.php?topic=638915.0" class="C1 hov" target="_blank">Claymore\'s miner</a> (CPU, AMD)<br>'+
							
						'</td>'+
						'<td NOWRAP>'+
							'<a href="https://github.com/Dead2/CryptoGoblin/releases" class="C1 hov" target="_blank">CryptoGoblin</a> (CPU, Nvidia, AMD)<br>'+
							'<a href="https://github.com/xmrig/xmrig/" class="C1 hov" target="_blank">XMRig</a> (CPU, Nvidia, AMD)<br>'+
							'<a href="https://github.com/fireice-uk/xmr-stak/releases" class="C1 hov" target="_blank">XMR-Stak</a> (CPU, Nvidia, AMD)'+
						'</td>'+
					'</tr></table></p>'+
				'</div>'+
			'</div>'+
			'<div class="helpgroup">'+
				'<div class="helptitle">'+
					'<div class="helpbtn btnback C1fl">'+$I['arrow']+'</div>'+
					'<span class="helpbtntext point textlrg C1">Step 3 - Configure Settings</span>'+
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
					'<div class="helpbtn btnback C1fl">'+$I['arrow']+'</div>'+
					'<span class="helpbtntext point textlrg C1">Step 4 - Start Mining</span>'+
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

function LoadMinerPayments(pge){
	var init = 'y';

	if(pge){
		init = 'n';
		pge = (parseInt(pge) > 1) ? parseInt(pge) : 1;
	}else{
		pge = 1;
		$('#MinerPayments').removeClass('hide').css('height', '0').html(loadgrp);
		$('#MinerPayments').animate({height:275},300);
	}

	$.when(dta('pay', addr, pge)).done(function(a){
		$('#MinerPayments').html('<div class="LR85"><div id="MinerPaymentsStatus"></div><div id="MinerPaymentsList"></div></div>');
		var j = 0,
			row = 'ROW0',
			cls = ($A[addr]['due'] > 0) ? 'C1bk C2bk_hov point' : 'C2bk o3',
			ins = '<div id="MinerPayNow" class="PanelCenter textmed C0'+cmde+'">'+
			'<div id="MinerPayNowBtn" class="PaymentButton '+cls+'">PAY '+$A[addr]['due']+' XMR NOW</div>'+
				'<div class="hbar shim10 LR80"></div>'+
			'<div class="PaymentButton C1bk o5">AUTO PAY AT 0.1 XMR</div>'+
		'</div>';
		$('#MinerPaymentsStatus').html(ins);
			
		ins = '<input type="hidden" id="MinerPaymentsPage" value="'+pge+'"><table class="C3'+cmde+' C0bk'+cmde+' texttable">';
		
		for(var i = 0; i < 10; i++){
			if($D['pay'][i] && $D['pay'][i]['amnt']){
				row = (i % 2 === 0) ? 'ROW1' : 'ROW0';
				ins += '<tr class="'+row+'">'+
					'<td NOWRAP>'+Ago($D['pay'][i]['tme'])+' Ago</td>'+
					'<td>'+Rnd($D['pay'][i]['amnt'], 8)+'</td>'+
					'<td class="XMRHash" data-hash="'+$D['pay'][i]['hash']+'"></td>'+
				'</tr>';
				j++;
			}
		}
		ins += '</table>';
		$('#MinerPaymentsList').html(ins);
		$('#MinerPaymentsBtn').html('<div class="Closer">'+$I['x']+'</div>');
		
		if(j > 0){
			ins = '';
			if(pge > 1) ins += '<div id="PaymentPagBtnL" class="PaymentPag C1bk C2bk_hov rot180 C0fl'+cmde+'" data-page="'+(pge - 1)+'">'+$I['arrow']+'</div>';
			if(j === 10) ins += '<div id="PaymentPagBtnR" class="PaymentPag C1bk C2bk_hov C0fl'+cmde+'" data-page="'+(pge + 1)+'">'+$I['arrow']+'</div>';
			if(ins) $('#MinerPaymentsList').append(ins);
		}else{
			if(pge > 1) LoadMinerPayments(pge - 1);
		}
		XMRHashTruncate();
	});
}

function CloseMinerPayments(){
	$('#MinerPayments').empty().animate({height:0},200);
	$('#MinerPaymentsBtn').html($I['settings']);
	setTimeout(function(){
		$('#MinerPayments').addClass('hide');
	}, 220);
}

//Data Lookups
function dta(mde, key, xid){
	now = Rnd((new Date()).getTime() / 1000);
	var def = new $.Deferred(),
		i = 0,
		url = '',
		graphhrs = graph_Duration(),
		graphstart = now - (3600 * graphhrs);
		
	if(mde === 'alert' && now > ($M['updt']['alert'] + 3600)){
		url = 'pool/motd';
	}else if(mde === 'block'){
		url = 'pool/blocks?limit=100';
	}else if(mde === 'blockhistory'){
		url = 'pool/blocks?page='+key+'&limit='+xid;
	}else if(mde === 'net' && now > ($M['updt']['net'] + 300)){
		url = 'network/chart/difficulty?timeScale=10';
	}else if(mde === 'pool' && now > ($M['updt']['net'] + 300)){
		url = 'pool/chart/hashrate?timeScale=10';
	}else if(mde === 'netheight'){
		url = 'network/stats';
	}else if(mde === 'poolpay'){
		var offset = (key - 1) * xid;
		url = 'pool/payments?page='+offset+'&limit='+xid;
	}else if(mde === 'poolstats' && now > ($M['updt']['pool'] + 300)){
		url = 'pool/stats';
	}else if(mde === 'account'){
		url = 'miner/'+addr+'/stats';
	}else if(mde === 'pay'){
		url = 'miner/'+key+'/payments';
		if(xid){
			xid = (xid > 1) ? (xid - 1) * 10 : 0;
			url += '?page='+xid+'&limit=10';
		}
	}else if(mde === 'workers' && (jQuery.isEmptyObject($A[addr]['wrkrs']) || now > ($M['updt']['worker'] + 180))){
		url = 'miner/'+addr+'/identifiers';
	}else if(mde === 'minershash'){
		url = 'miner/'+addr+'/chart/hashrate/';
	}else if(mde === 'worker' && $A[addr] && $A[addr]['wrkrs'][key]){
		if(jQuery.isEmptyObject($A[addr]['wrkrs'][key]['history']) || now > ($A[addr]['wrkrs'][key]['updt'] + 180)){
			url = 'miner/'+addr+'/chart/hashrate/'+xid;
		}else{
			console.log('SKIP');
		}
	}else if(mde === 'workerdetail'){
		url = 'miner/'+addr+'/stats/'+xid;
	}
	if(url){
		console.log(mde+':'+url);
		$.ajax({url:'https://supportxmr.com/api/'+url, dataType:'json', type:'GET',
			success:function(d){
				if(d){
					var dcnt = Object.keys(d).length;
					if(['alert','poolpay'].indexOf(mde) >= 0){
						$D[mde] = d;
						if(mde === 'alert') $M['updt']['alert'] = now;
					}else if(['block','blockhistory','net','pool','pay'].indexOf(mde) >= 0){
						$D[mde] = {};
						for(i = 0; i < dcnt; i++){
							var v = d[i], tme = Rnd(v['ts'] / 1000);
							if(['block','blockhistory'].indexOf(mde) >= 0){
								if(mde === 'blockhistory' || tme >= graphstart) $D[mde][i] = {'tme':tme, 'hash':v['hash'], 'height':v['height'], 'reward':ConvAtomicXMR(v['value']), 'eff':Rnd(v['shares'] / v['diff'] * 100)};
							}else if(mde === 'net'){
								if(tme >= graphstart) $D[mde][i] = {'tme':tme, 'hash':Rnd(v['diff'] / 120)};
							}else if(mde === 'pool'){
								if(tme >= graphstart) $D[mde][i] = {'tme':tme, 'hash':v['hs']};
							}else if(mde === 'pay'){
								$D[mde][i] = {'tme':v['ts'], 'hash':v['txnHash'], 'amnt':ConvAtomicXMR(v['amount'])};
							}
						}
						if(mde === 'net') $M['updt']['net'] = now;
					}else if(mde === 'netheight'){
						$D[mde] = d['height'];
					}else if(mde === 'poolstats'){
						$D[mde] = {
							'blocks':d['pool_statistics']['totalBlocksFound'],
							'hashes':d['pool_statistics']['totalHashes'],
							'payments':d['pool_statistics']['totalPayments'],
							'minerspaid':d['pool_statistics']['totalMinersPaid']
						};
						$M['updt']['pool'] = now;
					}else if(mde === 'account'){
						if(d['validShares'] > 0){
							$A[addr] = {'due':ConvAtomicXMR(d['amtDue']), 'paid':ConvAtomicXMR(d['amtPaid']), 'hashes':d['totalHashes'], 'last':d['lastHash'], 'val':d['validShares'], 'inv':d['invalidShares'], 'workers':{}};
						}
					}else if(mde === 'workers'){
						$A[addr]['wrkrs'] = {};
						$M['updt']['worker'] = now;
						for(i = 0; i < dcnt; i++){
							$A[addr]['wrkrs'][i] = {};
							$A[addr]['wrkrs'][i]['name'] = d[i];
						}
					}else if(mde === 'minershash'){
						$A[addr]['rate'] = {};
						for(i = 0; i < dcnt; i++){
							var tme = Rnd(d[i]['ts'] / 1000);
							if(tme >= graphstart) $A[addr]['rate'][i] = {'tme':tme, 'hash':d[i]['hs']};
						}
					}else if(mde === 'worker'){
						$A[addr]['wrkrs'][key]['history'] = {};
						for(i = 0; i < dcnt; i++){
							var tme = Rnd(d[i]['ts'] / 1000);
							if(tme >= (now - 21600)) $A[addr]['wrkrs'][key]['history'][i] = {'tme':tme, 'hsh':d[i]['hs']};
						}
						$A[addr]['wrkrs'][key]['last'] = $A[addr]['wrkrs'][key]['history'][0]['tme'];
						$A[addr]['wrkrs'][key]['rate'] = $A[addr]['wrkrs'][key]['history'][0]['hsh'];
						$A[addr]['wrkrs'][key]['updt'] = now;
					}else if(mde === 'workerdetail'){
						$A[addr]['wrkrs'][key]['hashes'] = d['totalHash'];
						$A[addr]['wrkrs'][key]['val'] = (d['validShares'] > 0) ? d['validShares'] : 0;
						$A[addr]['wrkrs'][key]['inv'] = (d['invalidShares'] > 0) ? d['invalidShares'] : 0;
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
	var t_x = $D['blockxy'][k]['x'],
		t_y = $D['blockxy'][k]['y'],
		eff = $D['block'][k]['eff'],
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
	$('#TipText_Time').attr({'x':(t_x + 11), 'y':(t_y + 2)}).html(Ago($D['block'][k]['tme'])+' Ago');
	$('#TipText_TimeBox').attr({'x':(t_x + 7), 'y':(t_y - 8)});
}
function CloseToolTip(k){
	$('#Dot'+k).attr('class', $('#Dot'+k).attr('class').replace(' C1flim', ''));
	$('#TipText_Effort, #TipText_Time, #TipText_EffortBox, #TipText_TimeBox').attr({'x':'-1000', 'y':'-1000'});
}
function graph_Grid(mde, num, max, min, h, w, cls){
	var r = '', yrt = (max - min) / num, clss = (cls === 'C2') ? '' : cmde;
	for(var y = (num - 1); y >= 1; y--){
		var	ylc = Rnd(h - ((yrt * y) / ((max - min) / h)), 1);
		if(mde === 'line'){
			r += '<line x1="50" y1="'+ylc+'" x2="'+w+'" y2="'+ylc+'" class="line '+cls+'st'+clss+' o8" />';
		}else if(mde === 'lbl'){
			var yln = ConvHash(yrt * y);
			r += '<text x="5" y="'+(ylc + 3)+'" class="'+cls+'fl'+clss+' texttinysvg">'+yln['num']+' '+yln['unit']+'</text>';
		}
	}
	return r;
}
function graph_Duration(){
	var h = 8;
	if(width < 600){
		h = 3;
	}else if(width < 800){
		h = 4;
	}else if(width < 1200){
		h = 6;
	}
	return h;
}
function graph_MainNet(){
	if($('#NetGraph').length && $D['net'][0] && $D['net'][0]['hash']){
		var $T = $('#NetGraph'),
			min = 999999999999,
			max = 0,
			xratio = 0,
			i = 0,
			ncnt = Object.keys($D['net']).length,
			pcnt = Object.keys($D['pool']).length,
			bcnt = Object.keys($D['block']).length,
			$P = {
				'n':{},
				'p':{}
			},
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
			graphhrs = graph_Duration(),
			timestart = now - (3600 * graphhrs),
			hsh_net = ConvHash($D['net'][0]['hash']),
			hsh_pool = ConvHash($D['pool'][0]['hash']),
			currenteffort = 0,
			ins = '<svg viewBox="0 0 '+width+' '+height+'" class="chart">'+
			'<defs>'+
				'<linearGradient id="P">'+
					'<stop offset="0%" stop-color="#F06923" stop-opacity="0.99" /><stop offset="100%" stop-color="#F06923" stop-opacity="0.02" />'+
				'</linearGradient>'+
			'</defs>';
		
		for(i = 0; i < ncnt; i++){
			if($D['net'][i]['hash'] > max) max = $D['net'][i]['hash'];
		}
		for(i = 0; i < pcnt; i++){
			pavg = pavg + $D['pool'][i]['hash'];
			if($D['pool'][i]['hash'] < min) min = $D['pool'][i]['hash'];
		}
		
		pavg = pavg / pcnt;
		xratio = right_x / (now - timestart);
		//max = max + (max * .01);	//Add chart headroom
		min = min - (min * .3);
		pplns = 2 * ($D['net'][0]['hash'] * 120) / pavg * xratio;
		
		//Create Points
		for(i = 0; i < ncnt; i++){
			$P['n'][i] = {
				'x':Rnd(right_x - (now - $D['net'][i]['tme']) * xratio, 1),
				'y':Rnd(height - ($D['net'][i]['hash'] - min) / (max - min) * height, 1)
			};
		}
		for(i = 0; i < pcnt; i++){
			$P['p'][i] = {
				'x':Rnd(right_x - (now - $D['pool'][i]['tme']) * xratio, 1),
				'y':Rnd(height - ($D['pool'][i]['hash'] - min) / (max - min) * height, 1)
			};
		}
	
		//Fill Panel
		ins += '<polygon fill="url(#P)" points="'+(right_x + 55)+','+$P['n'][0]['y'];
		for(i = 0; i < ncnt; i++){
			ins += ' '+$P['n'][i]['x']+','+$P['n'][i]['y'];
		}
		ins += ' -3,'+$P['n'][(ncnt - 1)]['y']+' -3,'+$P['p'][(pcnt - 1)]['y'];
		for(p = (pcnt - 1); p >= 0; p--){
			var newx = (p === 0) ? width + 2 : $P['p'][p]['x'];
			ins += ' '+newx+','+$P['p'][p]['y'];
		}
        ins += ' -3,'+$P['p'][(pcnt - 1)]['y']+' '+(width + 2)+','+$P['p'][0]['y']+'" />';
	
		//PPLNS Window
		var pplnsleft = 9999999999, pplnstextmid = 0;
		ins += '<polygon class="C1fl" opacity=".75" points="'+right_x+','+$P['n'][0]['y'];
		for(i = 0; i < ncnt; i++){
			if($P['n'][i]['x'] > right_x - pplns) ins += ' '+$P['n'][i]['x']+','+$P['n'][i]['y'];
		}
		for(p = (pcnt - 1); p >= 0; p--){
			if($P['p'][p]['x'] > right_x - pplns){
				ins += ' '+$P['p'][p]['x']+','+$P['p'][p]['y'];
				if($P['p'][p]['x'] < pplnsleft) pplnsleft = $P['p'][p]['x'];
			}
		}
        ins += ' '+right_x+','+$P['p'][0]['y']+'" />';
		if(fullsize === 'y'){
			pplnstextmid = (right_x + pplnsleft) / 2;
			ins += '<text x="'+pplnstextmid+'" y="20" text-anchor="middle" class="C0fl'+cmde+' texttinysvg o9">PPLNS</text>'+
				'<text x="'+pplnstextmid+'" y="30" text-anchor="middle" class="C0fl'+cmde+' texttinysvg o9">Window</text>';
		}
		
		//Grid Lines & Labels
		ins += graph_Grid('line', 3, max, min, height, width, 'C0');
		ins += graph_Grid('lbl', 3, max, min, height, width, 'C0');
		
		//NetHash Line
		ins += '<polyline class="C1st" stroke-width="'+linesize+'" points="'+right_x+','+$P['n'][0]['y'];
		for(i = 1; i < ncnt; i++){
			ins += ' '+$P['n'][i]['x']+','+$P['n'][i]['y'];
		}
		ins += ' -3,'+$P['n'][(ncnt - 1)]['y']+'" />'+
		'<text x="'+(right_x + 5)+'" y="'+($P['n'][0]['y'] + 13)+'" class="hashlable C1fl">'+hsh_net['num']+'</text>';
		if(fullsize === 'y') ins += '<text x="'+(right_x + 5)+'" y="'+($P['n'][0]['y'] + 23)+'" class="texttinysvg C2fl o8">'+hsh_net['unit']+' Net</text>';
		
		//PoolHash Line
		ins += '<polyline class="C1st" stroke-width="'+linesize+'" points="'+right_x+','+$P['p'][0]['y'];
		for(i = 0; i < pcnt; i++){
			ins += ' '+$P['p'][i]['x']+','+$P['p'][i]['y'];
		}
		ins += ' -3,'+$P['p'][(pcnt - 1)]['y']+'" />'+
		'<text x="'+(right_x + 5)+'" y="'+($P['p'][0]['y'] + 1)+'" class="hashlable C1fl">'+hsh_pool['num']+'</text>';
		if(fullsize === 'y') ins +='<text x="'+(right_x + 5)+'" y="'+($P['p'][0]['y'] - 17)+'" class="texttinysvg C2fl o8">'+hsh_pool['unit']+' Pool</text>';
		
		//Blocks Avg
		var max_effort = 0,
			blockratio = 0,
			avg_effort = 0,
			bline = height + 5,
			right_x = width - padR;
			
		for(i = 0; i < bcnt; i++){
			avg_effort = avg_effort + parseInt($D['block'][i]['eff']);
			if($D['block'][i]['eff'] > max_effort) max_effort = $D['block'][i]['eff'];
		}
		blockratio = (height - 25) / max_effort;
		avg_effort = Rnd(avg_effort / bcnt);
		currenteffort = Rnd((now - $D['block'][0]['tme']) / ($D['net'][0]['hash'] / $D['pool'][0]['hash'] * 120) * 100);
		
		$D['blockxy'] = {};
		var mod_bcnt = 0;
		for(i = 0; i < bcnt; i++){
			var x = Rnd(right_x - (now - $D['block'][i]['tme']) * xratio, 1);
			if(x > 57){
				$D['blockxy'][i] = {'x':x,'y':Rnd(height - 10 - ($D['block'][i]['eff'] * blockratio), 1)};
				mod_bcnt++;
			}
		}
		bcnt = mod_bcnt;
		
		//Blocks
		for(i = 0; i < bcnt; i++){
			var clrclass = ($D['block'][i]['eff'] <= 100) ? 'C5fl' : 'C4fl',
				$c = {'0':{'cl':'C1fl','sz':1},'1':{'cl':'o7 C0fl'+cmde,'sz':.92},'2':{'cl':'Dot '+clrclass,'sz':.71}};
			
			ins += '<g class="blockgroup point" data-block="'+i+'">';
			for(var j = 0; j <= 2; j++){
				var cid = (j === 2) ? 'id="Dot'+i+'"' : '';
				ins += '<circle '+cid+' cx="'+$D['blockxy'][i]['x']+'" cy="'+$D['blockxy'][i]['y']+'" r="'+(blocksize * $c[j]['sz'])+'" class="'+$c[j]['cl']+'" />';
			}
			ins += '</g>';
		}
		
		//Blocks Bottom Details
		if(fullsize === 'y'){
			var text_y = bline + 2,
				first_x = $D['blockxy'][0]['x'],
				last_x = $D['blockxy'][(bcnt - 1)]['x'];
				
			ins += '<line x1="'+first_x+'" y1="'+($D['blockxy'][0]['y'] + 3 + (blocksize / 2))+'" x2="'+first_x+'" y2="'+bline+'" class="line C2st" />'+
				'<line x1="'+first_x+'" y1="'+bline+'" x2="'+last_x+'" y2="'+bline+'" class="line C2st" />'+
				'<line x1="'+last_x+'" y1="'+($D['blockxy'][(bcnt - 1)]['y'] + 3 + (blocksize / 2))+'" x2="'+last_x+'" y2="'+bline+'" class="line C2st" />'+
				'<rect x="'+(last_x + 10)+'" y="'+(height - 3)+'" width="90" height="15" class="C0fl'+cmde+' o8" />'+
				'<text x="'+(last_x + 55)+'" y="'+text_y+'" text-anchor="middle" class="C2fl texttiny">'+avg_effort+'% Avg Effort</text>'+
				'<rect x="'+(first_x - 100)+'" y="'+(height - 3)+'" width="90" height="15" class="C0fl'+cmde+' o8" />'+
				'<text x="'+(first_x - 55)+'" y="'+text_y+'" text-anchor="middle" class="C2fl texttiny">Found '+Ago($D['block'][0]['tme'])+' Ago</text>'+
				'<rect x="'+(right_x - 7)+'" y="'+(text_y - 8)+'" width="11" height="9" class="C0fl'+cmde+' o8" />'+
				'<text x="'+(right_x - 8)+'" y="'+text_y+'" class="C2fl texttiny">'+currenteffort+'% Effort</text>'+
				'<text x="5" y="'+text_y+'" class="C2fl o8 texttiny">'+Ago($D['pool'][(pcnt - 1)]['tme'])+' Ago</text>'+
				'<line x1="'+right_x+'" y1="'+(bline - 15)+'" x2="'+right_x+'" y2="'+(bline - 7)+'" class="line C2st" />'+
				'<line x1="'+first_x+'" y1="'+bline+'" x2="'+(right_x - 10)+'" y2="'+bline+'" class="line C2st" />';
		}
		
		//Current Block Dot
		ins += '<circle cx="'+right_x+'" cy="'+$P['p'][0]['y']+'" r="2" class="C1fl" />';
		
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
		'<table class="TDPadS text C3'+cmde+'"><tr>'+
			'<td>'+
				'<div class="textmed">'+Ago($D['block'][xid]['tme'])+' Ago</div>'+
				'<div class="hbar LR80 o5 shim4"></div>'+
				'<div class="texttiny">'+$D['block'][xid]['eff']+'% Effort</div>'+
			'</td>'+
			'<td>'+
				'<div class="textmed">'+$D['block'][xid]['reward']+' XMR</div>'+
				'<div class="hbar LR80 o5 shim4"></div>'+
				'<div class="XMRHash texttiny" data-hash="'+$D['block'][xid]['hash']+'"></div>'+
			'</td>'+
			'<td>'+
				'<div class="textmed">'+BlockToGo($D['block'][xid]['height'])+'</div>'+
				'<div class="hbar LR80 o5 shim4"></div>'+
				'<div class="texttiny">Height '+Num($D['block'][xid]['height'])+'</div>'+
			'</td>'+
		'</tr></table>'+
		'<div id="NetGraphClose" class="C1fl hov" data-block="'+xid+'">'+$I['x']+'</div>'+
		'<div id="NetGraphClose" class="C1fl hov" data-block="'+xid+'">'+$I['x']+'</div>'+
	'</div>');
	XMRHashTruncate();
	OpenToolTip(xid);
}
function graph_Miner(){
	if($('#MinerGraph').length){
		$('#MinerGraph').html(loadgrp);
		if(addr && $A[addr]){
			if($A[addr]['rate']){
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
		graphhrs = graph_Duration(),
		timestart = now - (3600 * graphhrs),
		padR = 65,
		right_x = width - padR,
		$H = $A[addr]['rate'],
		hcnt = Object.keys($H).length,
		$P = {},
		avg = 0,
		max = 0,
		xratio = 0;

	for(i = 0; i < hcnt; i++){
		avg = avg + $H[i]['hash'];
		if($H[i]['hash'] > max) max = $H[i]['hash'];
		if($H[i]['tme'] < timefirst) timefirst = $H[i]['tme'];
	}

	if(hcnt > 0){
		if(timefirst >= timestart) timestart = timefirst;
		max = max * 1.35;
		xratio = right_x / (now - timestart);
		avg = avg / hcnt;
		
		for(i = 0; i < hcnt; i++){
			$P[i] = {'x':Rnd(right_x - (now - $H[i]['tme']) * xratio, 1), 'y':Rnd(height - ($H[i]['hash']) / max * height, 1)};
		}
		
		ins = '<svg viewBox="0 0 '+width+' '+height+'" class="chart">'+
			'<defs>'+
				'<linearGradient id="M">'+
					'<stop offset="0%" stop-color="#818181" stop-opacity="0.2" /><stop offset="15%" stop-color="#818181" stop-opacity="0.3" /><stop offset="100%" stop-color="#818181" stop-opacity="1" />'+
				'</linearGradient>'+
			'</defs>';
			
		//Grid Lines
		ins += graph_Grid('line', 5, max, 0, height, width, 'C2');
		
		//MinerHash
		ins += '<polygon class="C0fl'+cmde+'" points="'+(width + 3)+','+$P[0]['y'];
		for(i = 0; i < hcnt; i++){
			ins += ' '+$P[i]['x']+','+$P[i]['y'];
		}
		ins += ' -3,'+$P[(hcnt - 1)]['y']+' -3,'+(height + 3)+' '+(width + 3)+','+(height + 3)+'" />'+
			'<polyline stroke="url(#M)" stroke-width="2" points="'+right_x+','+$P[0]['y'];

		for(i = 0; i < hcnt; i++){
			ins += ' '+$P[i]['x']+','+$P[i]['y'];
		}
		ins += ' -3,'+$P[(hcnt - 1)]['y']+'" />';
		
		var hsh = ConvHash($H[0]['hash']),
			hs_y = $P[0]['y'] + 2,
			lb_y = $P[0]['y'] + 11;
			
		if($P[0]['y'] > (height * .8)){
			hs_y = $P[0]['y'] - 2;
			lb_y = $P[0]['y'] - 19;
		}
		
		ins += '<text x="'+(right_x + 3)+'" y="'+hs_y+'" class="hashlable C3fl'+cmde+'">'+hsh['num']+' '+hsh['unit']+'</text>'+
		'<text x="'+(right_x + 3)+'" y="'+lb_y+'" class="texttinysvg C3fl'+cmde+' o7">Your Hash</text>';

		//Current Hash Dot
		ins += '<circle cx="'+right_x+'" cy="'+$P[0]['y']+'" r="2" class="C2fl" />';
		
		//MinerHash Avg
		var avg_y = Rnd(height - avg / max * height, 2),
			avg_h = ConvHash(avg);
			
		ins += '<line x1="55" y1="'+avg_y+'" x2="'+$P[0]['x']+'" y2="'+avg_y+'" class="mineravgline C1st" />'+
			'<rect x="'+((width / 2) - 62.5)+'" y="'+(avg_y - 10)+'" width="125" height="20" rx="3" class="line C1fl" />'+
			'<text x="'+(width / 2)+'" y="'+(avg_y + 4)+'" text-anchor="middle" class="C0fl'+cmde+' texttiny">'+avg_h['num']+' '+avg_h['unit']+' Avg '+Ago(timestart)+'</text>';

		//Grid Labels
		ins += graph_Grid('lbl', 5, max, 0, height, width, 'C2');
	}else{
		ins = '<div id="MinerGraphAlert" class="textmed C2 o5">No Data</div>';
	}
	$('#MinerGraph').html(ins);
}
function graph_Worker(xid){
	var $T = $('.WorkerChart[data-worker="'+xid+'"]'),
		height = 19,
		width = $T.width(),
		i = 0,
		max = 0,
		$W = $A[addr]['wrkrs'][xid]['history'],
		wcnt = Object.keys($W).length,
		$P = {},
		mintime = 99999999999,
		skclss = ($A[addr]['wrkrs'][xid]['history'][0]['hsh'] === 0) ? 'C4st' : 'C2st',
		ins = '<svg viewBox="0 0 '+width+' '+height+'" class="chart">'+
			'<defs>'+
				'<linearGradient id="F" gradientTransform="rotate(90)">'+
					'<stop offset="0%" stop-color="#000" stop-opacity="0.07" /><stop offset="100%" stop-color="#000" stop-opacity="0.03" />'+
				'</linearGradient>'+
			'</defs>';
		
	for(i = 0; i < wcnt; i++){
		if($W[i]['hsh'] > max) max = $W[i]['hsh'];
		if($W[i]['tme'] < mintime) mintime = $W[i]['tme'];
	}
	for(i = 0; i < wcnt; i++){
		$P[i] = {
			'x':Rnd(width - (now - $W[i]['tme']) * (width / (now - mintime)), 1),
			'y':Rnd(height - $W[i]['hsh'] * (height / max), 1)
		};
	}
	
	ins += '<polygon fill="url(#F)" points="'+(width + 2)+','+$P[0]['y'];
	for(i = 0; i < wcnt; i++){
		ins += ' '+$P[i]['x']+','+$P[i]['y'];
	}
	ins += ' -2,'+$P[(wcnt - 1)]['y']+' -2,'+(height + 2)+' '+(width + 2)+','+(height + 2)+'" />'+
		'<polyline stroke-width="1.25" class="'+skclss+'" points="'+(width + 2)+','+$P[0]['y'];

	for(i = 0; i < wcnt; i++){
		ins += ' '+$P[i]['x']+','+$P[i]['y'];
	}
	$T.html(ins+'" /></svg>');
}

//Helpers
function Ago(tme){
	var timeago = now - parseInt(tme);
	if(timeago < 60){
		timeago = timeago+' Sec';
	}else if(timeago <= 3600){
		timeago = Rnd(timeago / 60)+' Min';
	}else if(timeago <= 86400){
		timeago = Rnd(timeago / 60 / 60)+' Hrs';
	}else{
		timeago = Rnd(timeago / 60 / 60 / 24)+' Days';
	}
	return timeago;
}

function Num(num){
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
function ConvAtomicXMR(x){
	//depreciate
	x = (x > 0) ? Math.round(x / 10000) / 100000000 : 0;
	x = x.toFixed(8).toLocaleString('fullwide', {useGrouping:false});
	return x;
}
function Rnd(num, dec){
	if(dec >= 1){
		var d = Math.pow(10, dec);
		return Math.round(num * d) / d;
	}else{
		return Math.round(num);
	}
}
function XMRHashTruncate(){
	$('#Stage, #NetGraph').find('.XMRHash').each(function(C, P){
		var $T = $(this), hsh = txt = $T.attr('data-hash'), fit = Math.floor($T.width() / 7.02 / 2);
		if(hsh.length > (fit * 2)) txt = hsh.substring(0, (fit - 1))+'...'+hsh.slice((2 - fit));
		$T.html('<a href="https://xmrchain.net/block/'+hsh+'" target="_blank" class="C1 hov">'+txt+'</a>');
	});
}
function ConvHash(hash){
	hash = (hash > 0) ? hash : 0;
	var div = 1, $A = {'num':0, 'unit':'H/s'};
	if(hash > 1000000){
		div = 1000000;
		$A.unit = 'MH/s';
	}else if(hash > 1000){
		div = 1000;
		$A.unit = 'KH/s';
	}
	$A.num = Rnd(hash / div, 1);
	return $A;
}
function BlockToGo(h){
	var blockstogo = 60 - ($D['netheight'] - h);
	return (blockstogo <= 0) ? 'Confirmed' : blockstogo+' To Go';
}
function SynchTime(t){
	if(t > now) now = t + 3;
}
function Truncate(s, l){
	return (s && s.length > 0 && l > 0) ? s.length > l ? s.substring(0, l - 3)+ '...' : s : s;
}
function getUrlVars(){
    var v = [], h, p = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < p.length; i++){
        h = p[i].split('=');
        v.push(h[0]);
        v[h[0]] = h[1];
    }
    return v;
}

//jquery.cookie.js
!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof exports?module.exports=e(require("jquery")):e(jQuery)}(function(e){function n(e){return u.raw?e:encodeURIComponent(e)}function o(e){return u.raw?e:decodeURIComponent(e)}function i(e){return n(u.json?JSON.stringify(e):String(e))}function t(e){0===e.indexOf('"')&&(e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{return e=decodeURIComponent(e.replace(c," ")),u.json?JSON.parse(e):e}catch(e){}}function r(n,o){var i=u.raw?n:t(n);return e.isFunction(o)?o(i):i}var c=/\+/g,u=e.cookie=function(t,c,s){if(arguments.length>1&&!e.isFunction(c)){if("number"==typeof(s=e.extend({},u.defaults,s)).expires){var d=s.expires,f=s.expires=new Date;f.setMilliseconds(f.getMilliseconds()+864e5*d)}return document.cookie=[n(t),"=",i(c),s.expires?"; expires="+s.expires.toUTCString():"",s.path?"; path="+s.path:"",s.domain?"; domain="+s.domain:"",s.secure?"; secure":""].join("")}for(var a=t?void 0:{},p=document.cookie?document.cookie.split("; "):[],l=0,m=p.length;l<m;l++){var x=p[l].split("="),g=o(x.shift()),j=x.join("=");if(t===g){a=r(j,c);break}t||void 0===(j=r(j))||(a[g]=j)}return a};u.defaults={},e.removeCookie=function(n,o){return e.cookie(n,"",e.extend({},o,{expires:-1})),!e.cookie(n)}});