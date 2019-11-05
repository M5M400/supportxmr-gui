var	mde = 'l',
	$Q = {										
		'pool':{
			'nme':'SupportXMR',										//also sets the cookie prefix
		},
		'clr':{
			'main':'f06923',										//C1
			'secondary':'818181',									//C2
			'back-l':'e8e8e8',										//C0 - light
			'back-d':'313131'	   									//C0 - dark
		},
		'cur':{
			'nme':'Monero',						
			'sym':'XMR',
			'blk':2,												//blocktime in minutes
			'reg':/^[4|8]{1}([A-Za-z0-9]{105}|[A-Za-z0-9]{94})$/	//address regex
		},
		'api':'https://supportxmr.com/api/',
		//'api':'http://69.164.198.226/api/',
		'explorer':'https://xmrchain.net/block/',
		'explorertx':'https://xmrchain.net/tx/',
		'news':false,												//enable news (motd) alerts on homepage
		'email':false,												//enable email notifications
		'timer':60,													//refresh timer in seconds
		'graph':{
			'hrs':8,												//max chart length in hours
			'pplns':false,											//show pplns window on chart
			'blockmin':25											//min number of blocks to show (blocks take their own time scale) max 100
		},
		'pay':{
			'min_inst':0.01,										//minimum for instant pay
			'min_auto':0.1,											//minimum for automatic threshold
			'dec_auto':4											//decimal places for threshold
		}
	},
	$$ = {
		'calc':{
			'1':'Per Day',
			'7':'Per Week',
			'30':'Per Month',
			'365':'Per Year',
		},
		'hlp':{
			'head':'Welcome to '+$Q['pool']['nme'],
			'text':'Getting started is easy and this pool has a large and friendly community that are happy to help you. The pool operators are M5M400 and Snipa22 who can be reached in the #monero-pools IRC or at <a href="mailto:support@supportxmr.com" class="C1 hov">support@supportxmr.com</a>. Please be patient and someone will get back to you. Most of the time help can be found quicker in the chat. The pool has a quite stable and knowlegable community - you can join the chat and seek help and a friendly chat there :)'
		},
		'msg':{
			'welcome':{'head':'Welcome to '+$Q['pool']['nme'], 'text':'Visit the <u class="nav C1" data-tar="help">help section</u> to get setup, then enter your '+$Q['cur']['nme']+' address above. After you\'ve submitted a share, your stats will appear here.'},
			'addr_invalid':{'head':'Invalid '+$Q['cur']['nme']+' Address', 'text':'Double check that your address is complete.'},
			'addr_notfound':{'head':'Address Not Found', 'text':'If you\'ve submitted your first share, be patient, it may take a minute or two to update. If your shares are being rejected, visit the <u class="nav C1" data-tar="help">help section.</u>'},
			'addr_nodata':{'head':'No Data', 'text':''}
		},
		'nav':{
			'home':'Home',
			'blocks':'Blocks',
			'payments':'Payments',
			'help':'Help'
		},
		'pay':{
			'DashPending':{'lbl':$Q['cur']['sym']+' Pending', 'var':'due'},
			'DashPaid':{'lbl':$Q['cur']['sym']+' Paid', 'var':'paid'}
		},
		'sts':{
			'MinerWorkerCount':{'lbl':'<span id="MinerLastHash">--</span>'},
			'MinerHashes':{'lbl':'Total Hashes', 'var':'hashes'},
			'MinerShares':{'lbl':'Valid / Invalid Shares', 'def':'-- / --', 'var':'shares'},
			'MinerCalc':{'lbl':'<input type="text" id="MinerCalcHsh" size="3" /><select id="MinerCalcUnit"></select><select id="MinerCalcFld"></select>'}
		},
		'tbl':{
			'poolpay':{
				'tme':{'lbl':'Payment Sent', 'cls':'condte'},
				'payees':{'lbl':'Payees', 'cls':'consmall'},
				'amnt':{'lbl':'Amount ('+$Q['cur']['sym']+')', 'cls':'consmall'},
				'fee':{'lbl':'Fee ('+$Q['cur']['sym']+')', 'cls':'right'}
			},
			'blockhistory':{
				'tme':{'lbl':'Block Mined', 'cls':'condte'},
				'togo':{'lbl':'Maturity', 'cls':'consmall'},
				'eff':{'lbl':'Effort', 'cls':'continy'},
				'reward':{'lbl':'Reward ('+$Q['cur']['sym']+')', 'cls':'consmall'},
				'height':{'lbl':'Height', 'cls':'consmall'},
				'hash':{'lbl':'Transaction', 'cls':'right', 'hsh':'y'}	
			},
			'pay':{
				'tme':{'lbl':'Payment Sent', 'cls':'condte'},
				'amnt':{'lbl':'Amount ('+$Q['cur']['sym']+')', 'cls':'center'},
				'hash':{'lbl':'Transaction', 'cls':'right', 'hsh':'y'}
			}
		},
		'trn':{
			'avgeff':'Avg Effort',
			'conf':'Confirmed',
			'eff':'Effort',
			'eml_on':'Email Alerts On',
			'eml_off':'Email Alerts Off',
			'min':'Minimum',
			'que':'Payment Queued',
			'rcnt':'Recent',
			'set':'Set Auto Pay',
			'updt':'Updated',
			'vwpy':'View Your Payments'
		}
	};

/*--------------------------------------*/
/*-----End of Customization Section------- (You can customize the rest, but shouldn't need to) */
/*--------------------------------------*/

var addr = UrlVars()['addr'] || '',
	pref = 'LNA',
	cookieprefix = $Q['pool']['nme'].replace(/[ ,;]/g, ''),
	resizeTimer,
	updateTimer = $Q['timer'],
	updateCounter,
	outoffocus = 0,
	now = Rnd((new Date()).getTime() / 1000),
	width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
	netpop_open = '',
	$A = {},			//Account Memory
	$C = {				//Selector Cache
		'TogMode':'',
		'Timer':'',
		'NetGraph':'',
		'Addr':'',
		'Stage':'',
		'DashPayBtn':'',
		'AddrField':'',
		'TimerPie':'',
		'TimerText':'',
		'TimerRefresh':''
	},
	$U = {				//Update Times
		'net':0,
		'netheight':0,
		'pool':0,
		'poolstats':0,
		'news':0
	},
	$L ={				//Localization
		'perc':'9 %',
		'thou':',',
		'dec':'.',
		'tme':'G:i'
	},
	$D = {				//Data Digests
		'news':{},
		'block':{},
		'blockhistory':{},
		'net':{},
		'pool':{},
		'poolstats':{},
		'pay':{},
		'poolpay':{},
		'netheight':'',
		'hashconv':{
			'GH':1000000000,
			'MH':1000000,
			'KH':1000,
			'H':1
		}
	},
	$I = {				//Icons
		'l':'<svg viewBox="0 0 99 99"><circle opacity=".6" cx="49.5" cy="49.5" r="31.5"/><path d="M87.6 57.1L99 49.5 87.7 42l7.5-11.3L82 27.9l2.6-13.4-13.4 2.7-2.6-13.4L57 11.4 49.5 0 42 11.3 30.6 3.8 27.9 17l-13.4-2.6 2.7 13.4-13.4 2.6L11.4 42 0 49.5 11.3 57 3.8 68.4 17 71.1l-2.6 13.4 13.4-2.7 2.6 13.4L42 87.6 49.5 99 57 87.7l11.3 7.5L71.1 82l13.4 2.6-2.7-13.4 13.4-2.6L87.6 57zM49.5 80a30.5 30.5 0 1 1 0-61 30.5 30.5 0 0 1 0 61z"/></svg>',
		'd':'<svg viewBox="0 0 99 99"><path d="M25.2 19.6l5.3 10.6 11.7 1.7-8.5 8.3 2 11.6-10.5-5.5-10.4 5.5 2-11.6-8.5-8.3L20 30.2l5.2-10.6zm29.6-3.4l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.5 2.9 1-6-4.3-4.3 6-1 2.8-5.4zM64.8 0A46 46 0 0 1 0 64.4 50.9 50.9 0 1 0 64.6 0z"/></svg>',
		'settings':'<svg viewBox="0 0 99 99"><path d="M19.7 50.74V10.92l-6.4 1.69v38.12a16.1 16.1 0 0 0 0 31.53v4.17l6.4 1.65v-5.82a16.09 16.09 0 0 0 0-31.52zm-3.2 25.34a9.58 9.58 0 1 1 0-19.16 9.58 9.58 0 0 1 0 19.16zm36.2-59.51S52.66 0 52.7 0h-6.4v16.57a16.09 16.09 0 0 0 0 31.53V99h6.4V48.1a16.09 16.09 0 0 0 0-31.53zm-3.2 25.35a9.58 9.58 0 1 1 0-19.17 9.58 9.58 0 0 1 0 19.17zm36.2-1.18V12.62l-6.4-1.7v29.81a16.09 16.09 0 0 0 0 31.53v15.82l6.4-1.68V72.26a16.09 16.09 0 0 0 0-31.52zm-3.2 25.34a9.58 9.58 0 1 1 0-19.16 9.58 9.58 0 0 1 0 19.16z"/></svg>',
		'loadico':'<svg viewBox="0 0 99 99"><path d="M49.5 0A49.5 49.5 0 0199 49.5c0 5.8-1.6 15.8-4.7 19.6a50.2 50.2 0 01-50.2 8.6c19.5 3.4 34.1-12.3 34.1-28.2a28.7 28.7 0 10-57.4 0c0 24.3 33.8 47 70.7 26.1A49.5 49.5 0 1149.5 0z"/><path opacity=".08" fill="#000" d="M44.1 77.7c41.9 5.9 60.6-41.7 35-68C91 18.9 99 33.3 99 49.6c0 5.8-1.6 15.8-4.7 19.6a50.2 50.2 0 01-50.2 8.6z"/></svg>',
		'arrow':'<svg viewBox="0 0 99 99"><path d="M27 78l28-29-28-28C17 10 33-8 45 4l35 37c5 5 5 12 0 17L45 95c-12 12-29-6-18-17z"/></svg>',
		'check':'<svg viewBox="0 0 99 99"><path d="M97 21l-8-9c-3-3-7-3-9 0L38 55 19 36c-2-3-6-3-8 0l-9 9c-3 3-2 7 0 9l23 24 9 9c2 3 6 3 8 0l9-9 46-48c3-3 3-7 0-9z"/></svg>',
		'sort':'<svg viewBox="0 0 99 99"><path d="M56 45L35 25 15 45C8 52-6 40 3 32L29 6c4-3 9-3 12 0l27 26c9 8-4 20-12 13zm-13 9l21 20 20-20c7-7 21 5 12 13L70 93c-4 3-9 3-12 0L31 67c-9-8 4-20 12-13z"/></svg>',
		'refresh':'<svg viewBox="0 0 99 99"><path d="M0 55.7v31l9.2-8.5a49.5 49.5 0 0 0 89.4-22.5H86.1a37.1 37.1 0 0 1-67.7 14l15.3-14H0zM49.5 0C24.3 0 3.5 18.9.4 43.3h12.5a37.1 37.1 0 0 1 68.3-13.1L68.1 43.3H99v-31l-8.9 9A49.4 49.4 0 0 0 49.5 0z"/></svg>',
		'x':'<svg viewBox="0 0 99 99"><path d="M99 77L71 50l28-28L77 0 50 28 22 0 0 22l28 28L0 77l22 22 28-28 27 28"/></svg>',
		'delete':'<svg viewBox="0 0 99 99"><path d="M8 28L7 15h86l-2 13H8zM31 0l-1 10h39L68 0H31zM10 33l9 66h61l9-66H10zm18 56l-3-47h8l3 47h-8zm26 0h-9V42h9v47zm17 0h-8l3-47h8l-3 47z"/></svg>',
	};
	$I['load'] = '<div class="LoadCon C1fl o9 Loader">'+$I['loadico']+'</div>';
	
//Event Binding
window.addEventListener('resize', function(){Resize()});
document.body.addEventListener('change', function(e){
	var id = ['#HeadMenu select', '#TblPagBox', '#AddrField', '#AddrRecent select', '#MinerCalcHsh', '#MinerCalcUnit', '#MinerCalcFld', '#AutoPayFld'];
	for(var i = 0; i < id.length; i++){
		var el = e.target.matches(id[i]);
		if(el){
			if(id[i] === '#HeadMenu select'){
				Navigate(document.querySelector(id[i]).value);
			}else if(id[i] === '#TblPagBox'){
				var pge = e.target.value.replace(/\D/g,''),
					typ = e.target.getAttribute('data-func');
				
				if(typ === 'blockhistory'){
					dta_Blocks(pge);
				}else if(typ === 'poolpay'){
					dta_Payments(pge);
				}
			}else if(id[i] === '#AddrField' || id[i] === '#AddrRecent select'){	
				addr = document.querySelector(id[i]).value;
				SaveAddr(addr, 'add');
			}else if(id[i] === '#MinerCalcHsh' || id[i] === '#MinerCalcUnit' || id[i] === '#MinerCalcFld'){
				Dash_calc();
			}else if(id[i] === '#AutoPayFld'){
				AutoPayCheck();
			}
		}
	}
}, false);
document.body.addEventListener('click', function(e){
	var id = ['#TogMode','#Timer', '#DashPayBtn', '#NetGraphClose', '#NewsClose', '#InstaPayBtn', '#AutoPayBtn', '#PaymentHistoryBtn', '#PaymentHistoryBtnClose', '#EmailToggleBtn', '#AddrDelete', '#WorkerPopClose', '#WorkerSortName', '#WorkerSortRate', '.nav', '.PagBtn', '.Worker', '.blockgroup', '.helptitle'];
	for(var i = 0; i < id.length; i++){
		var el = e.target.closest(id[i]);
		if(el){
			if(id[i] === '#TogMode'){
				mde = (mde === 'd') ? 'l' : 'd';
				SwitchMode();
				SavePref('mode', mde.toUpperCase());
			}else if(id[i] === '#Timer'){
				TimerLoading('on');
				setTimeout(function(){
					TimerUpdateData();
				}, 1500);	
			}else if(id[i] === '#DashPayBtn'){
				MinerPayments();
			}else if(id[i] === '#NetGraphClose'){
				netpop_open = '';
				document.getElementById('GPop').classList.add('hide');
			}else if(id[i] === '#NewsClose'){
				document.getElementById('News').className = 'hide';
				setCookie('News', $D['news']['created']);
			}else if(id[i] === '#InstaPayBtn'){
				InstaPay();
			}else if(id[i] === '#AutoPayBtn'){
				AutoPay();
			}else if(id[i] === '#PaymentHistoryBtn'){
				MinerPaymentHistory(1);
			}else if(id[i] === '#PaymentHistoryBtnClose'){
				MinerPayments('back');
			}else if(id[i] === '#EmailToggleBtn'){
				EmailToggle();
			}else if(id[i] === '#InstaPayBtn'){
				document.getElementById('MinerPaymentsMenu').innerHTML = $I['load'];
				setTimeout(function(){
					document.getElementById('MinerPaymentsMenu').innerHTML = '<div class="center C3'+mde+' txt">Demo - Need Endpoint</div>';
				}, 1500);
			}else if(id[i] === '#AddrDelete'){
				SaveAddr($C['AddrField'].value, 'del');
			}else if(id[i] === '#WorkerPopClose'){
				Workers_detail();
			}else if(id[i] === '#WorkerSortName'){
				SavePref('sort', 'N'+el.getAttribute('data-ord'));
				Workers_init();
			}else if(id[i] === '#WorkerSortRate'){
				SavePref('sort', 'R'+el.getAttribute('data-ord'));
				Workers_init();
			}else if(id[i] === '.nav'){
				Navigate(el.getAttribute('data-tar'));
			}else if(id[i] === '.PagBtn'){
				var f = el.getAttribute('data-func'),
					p = parseInt(el.getAttribute('data-page'));
					
				if(f === 'poolpay'){
					dta_Payments(p);
				}else if(f === 'blockhistory'){
					dta_Blocks(p);
				}else if(f === 'pay'){
					MinerPaymentHistory(p);
				}
			}else if(id[i] === '.Worker'){
				Workers_detail(el.getAttribute('data-key'));
			}else if(id[i] === '.blockgroup'){
				netpop_open = el.getAttribute('data-block');
				Graph_NetPop(netpop_open);
			}else if(id[i] === '.helptitle'){
				var b = el.querySelector('.btnback'), b_cl = 'btnback', c_cl = 'helpcontent', t_cl = 'helpteaser';
				if(b.classList.contains('rot90')){
					c_cl += ' hide';
				}else{
					b_cl += ' rot90';
					t_cl += ' hide';
				}
				b.className = b_cl;
				el.parentNode.querySelector('.helpcontent').className = c_cl;
				el.parentNode.querySelector('.helpteaser').className = t_cl;
			}else{
				return;
			}
			return;
		}
	}
}, false);
document.body.addEventListener('keyup', function(e){
	if(e.target.closest('#TblPagBox')){
		PaginationBoxWidth();
		return;
	}
});
document.getElementById('Timer').onmouseover = function(e){
	$C['TimerRefresh'].classList.remove('hide');
};
document.getElementById('Timer').onmouseout = function(e){
	$C['TimerRefresh'].classList.add('hide');
};

function init(){
	Localize();
	
	//Cache Selectors
	var k = Object.keys($C), i = k.length;
	while(i--){
		$C[k[i]] = document.getElementById(k[i]);
	}
	
	//Populate Icons
	$C['TogMode'].innerHTML = $I['d'];
	$C['TimerRefresh'].innerHTML = $I['refresh'];
	document.getElementById('TimerLoader').innerHTML = $I['load'];
	document.querySelector('#HeadMenu .select-point').innerHTML = $I['arrow'];
	document.getElementById('AddrDelete').innerHTML = $I['delete'];
	document.querySelector('#AddrRecent .select-point').innerHTML = $I['arrow'];
	document.getElementById('DashPendingLbl').innerHTML = $$['pay']['DashPending']['lbl'];
	document.getElementById('DashPaidLbl').innerHTML = $$['pay']['DashPaid']['lbl'];
	Dash_btn('loading');
	TimerLoading('on');

	//Load Menu
	var i = 0, mn = '', ft = '';
	for(var m in $$['nav']){
		mn += '<option value="'+m+'">'+$$['nav'][m]+'</option>';
		if(i !== 0) ft += ' &middot; ';
		ft += '<span class="nav" data-tar="'+m+'">'+$$['nav'][m]+'</span>';
		i++;
	}
	document.querySelector('#HeadMenu select').innerHTML = mn;
	document.getElementById('FootR').innerHTML = ft;
	
	//User Memory from Cookie
	var cka = getCookie('Addr'),
		ckp = getCookie('Pref'),
		cookie_addr = '';
		
	if(cka){
		if(cka.indexOf('#') >= 0){					//multi address
			var ck_arr = cka.split('#');
			for(var i = 0; i < ck_arr.length; i++){
				if(i === 0) cookie_addr = ck_arr[i];
				$A[ck_arr[i]] = {};
			}
		}else{										//single address
			cookie_addr = cka;
			$A[cka] = {};
		}
	}
	if(ckp) pref = ckp;

	if(addr){
		//override from URL param
	}else if(cookie_addr){
		//first addr from cookie
		addr = cookie_addr;
	}
	if(addr){
		$C['AddrField'].value = addr;
		$C['AddrField'].blur();
	}else{
		$C['AddrField'].setAttribute('placeholder', 'Your '+$Q['cur']['nme']+' Address...');
	}
	
	if(mde === 'l' && pref && pref.charAt(0) === 'D'){
		mde = 'd';
		SwitchMode();
	}
	Dash_init();
	TimerUpdateData();
}
function ErrAlert(tar, err){
	var n = document.querySelector('#NetGraph svg'),
		m = document.querySelector('#MinerGraph svg'),
		w = document.getElementById('MinerWorkers'),
		a = document.querySelectorAll('.GAlert');
		
	if(tar === 'X'){
		$C['TimerText'].innerHTML = updateTimer;
		if(n != null) n.classList.remove('o3');
		if(m != null) m.classList.remove('o3');
		if(w != null) w.classList.remove('o3');
		if(a != null && a.parentNode != null) a.parentNode.removeChild(a);
	}else{
		var msg = '',
			iserr = 'C4',
			err_msg = 'Try refreshing, check your connection; otherwise we\'ll be back up soon.';
		
		if(tar === 'NetGraph'){
			msg = 'Network API Connection Error';
			if(n != null) n.classList.add('o3');

		}else if(tar === 'MinerGraph'){
			if(err === 'NoData'){
				iserr = 'C2',
				msg = 'No Data Available';
				err_msg = 'Stats will appear when miner is active.';
			}else{
				msg = 'Miner API Connection Error';
			}
			if(m != null) m.classList.add('o3');
			if(w != null) w.classList.add('o3');
		}else{
			return false;
		}
		if(iserr === 'C4'){
			$C['TimerText'].innerHTML = '<div class="C4fl">'+$I['x']+'</div>';
			$C['TimerRefresh'].classList.add('hide');
		}
		if(msg){
			var t = document.getElementById(tar);
			if(t != null) t.innerHTML += '<div class="GAlert C0bk'+mde+' '+iserr+'br center"><div class="txtmed '+iserr+'">'+msg+'</div><div class="txtsmall C3'+mde+'">'+err_msg+'</div></div>';
		}
	}
}
function LoadTimer(){
	clearInterval(updateCounter);
	TimerLoading('off');
	updateCounter = setInterval(function(){
		if(document.hasFocus()){
			if(outoffocus > 120){
				//if returning after long absence
				updateTimer = 0;
				outoffocus = 0;
			}else{
				updateTimer--;
			}
		}else{
			if(outoffocus < 122) outoffocus++;
		}
		if(updateTimer <= 0){
			TimerLoading('on');
			clearInterval(updateCounter);
			setTimeout(function(){
				TimerUpdateData();
			}, 1500);
		}else{
			var clr = (mde === 'd') ? $Q['clr']['back-d'] : $Q['clr']['back-l'],
				grd = 'linear-gradient('+(-90 + (360 * updateTimer / $Q['timer']))+'deg, transparent 50%, #F06A25';
				
			if(updateTimer < ($Q['timer'] / 2)) grd = 'linear-gradient('+(90 + (360 * updateTimer / $Q['timer']))+'deg, transparent 50%, #'+clr;
			$C['TimerPie'].style.backgroundImage = grd+' 50%),linear-gradient(90deg, #'+clr+' 50%, transparent 50%)';
			$C['TimerText'].innerHTML = updateTimer;
		}
	}, 1000);
}
function TimerLoading(sts){
	var l = document.getElementById('TimerLoader');
	if(sts === 'on'){
		l.classList.remove('hide');
	}else{
		l.classList.add('hide');
	}
}
function TimerUpdateData(){
	api('block').then(function(){
		ErrAlert('X');
	}).catch(function(err){ErrAlert('NetGraph', '')});
	
	var l = document.getElementById('MinerHashes');
	if(l){
		var typ = (l.innerHTML !== '--') ? 'refresh' : '';
		Dash_load(typ);
	}
	api('net').then(function(){
		api('pool').then(function(){
			Graph_Net();
			updateTimer = $Q['timer'];
			$C['TimerText'].innerHTML = updateTimer;
			LoadTimer();
		}).catch(function(err){ErrAlert('NetGraph', '')});
	}).catch(function(err){ErrAlert('NetGraph', '')});
	
	if($Q['news']){
		var n = document.getElementById('News'), c = document.getElementById('NewsCard'), h = '';
		if(n != null && c.innerHTML === ''){
			api('news').then(function(){
				if($D['news'] && $D['news']['created']){
					if(getCookie('News') == $D['news']['created']){
						h = 'hide';
					}else{
						c.innerHTML = '<div class="txtmed">'+$D['news']['subject']+'<div id="NewsTime" class="txttny noselect">('+Ago($D['news']['created'], 'y')+')</div></div>'+
							'<div id="NewsBody" class="txt">'+$D['news']['body'].replace(/^(<br>)/,'')+'</div>'+
							'<div id="NewsClose" class="Btn32 Btn32Corner C1fl">'+$I['x']+'</div>';
					}
					n.className = h;
				}
			});
		}
	}
}
function Resize(){
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(function(){
		width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		Graph_Net();
		Graph_Miner_init();
		Workers_init();
		HashTrun();
		var p = document.getElementById('MinerPaymentsPage');
		if(p != null) MinerPaymentHistory(p.value);
	}, 250);
}
function SwitchMode(){
	var $CL = ['C0','C0fl','C0bk','C0st','C3','C3fl','FLD'],
		$clr = {'l':{'f':'454545','b':'efefef'},'d':{'f':'b3b3b3','b':'3b3b3b'}},
		bt = (mde === 'd') ? 'l' : 'd',
		i = $CL.length;
		
	$C['TogMode'].innerHTML = $I[bt];
	while(i--){
		document.querySelectorAll('.'+$CL[i]+bt).forEach(function(x){
			x.classList.add($CL[i]+mde);
			x.classList.remove($CL[i]+bt);
		});
	}
	document.querySelector('meta[name=theme-color]').setAttribute('content', '#'+$clr[mde]['b']);
}
function SaveAddr(adr, m){
	var fin = '', fst = '', j = 0, val = '';
	if(m === 'add'){
		if(!$A[adr] || isEmpty($A[adr])) $A[adr] = {};
	}else if(m === 'del'){
		delete $A[adr];
	}else{
		return;
	}
	Dash_reset();
	for(var k in $A){
		if($A.hasOwnProperty(k) && j < 25){
			if(j === 0){
				fst = k;
				fin += k;
			}else{
				fin += '#'+k;
			}
			j++;
		}
	}
	setCookie('Addr', fin);
	$C['AddrField'].value = (m === 'del') ? fst : adr;
	Dash_init();
	Dash_load();
	MultipleAddress();
}
function SavePref(col, val){
	var m = (pref[0] === 'D') ? 'D' : 'L',
		s = (pref[1] === 'R') ? 'R' : 'N',
		o = (pref[2] === 'D') ? 'D' : 'A',
		so = s+o;

	if(col === 'mode'){
		m = val;
	}else if(col === 'sort'){
		so = val;
	}
	pref = m+so;
	setCookie('Pref', m+so);
}
function MultipleAddress(){
	var numadr = numObj($A),
		r = document.getElementById('AddrRecent'),
		h = 'hide';
		
	if(numadr > 1){
		ins = '<option value="">'+$$['trn']['rcnt']+'</option>';
		for(var k in $A){
			if($A.hasOwnProperty(k) && k !== addr){
				ins += '<option value="'+k+'">'+k.substring(0, 3)+'...'+k.substr(k.length - 4)+'</option>';
			}
		}
		r.querySelector('select').innerHTML = ins;
		h = '';
	}
	r.parentNode.className = h;
	document.getElementById('AddrDelete').parentNode.className = h;
}
function Navigate(tar){
	$C['Stage'].className = '';
	document.querySelectorAll('.nav').forEach(function(x){
		x.classList.remove('o5');
	});
	setTimeout(function(){
		var n = '', m = 'StageFade', h = '', d = 'LR85 C3l';
		if(tar && ['blocks','payments','help'].indexOf(tar) >= 0){
			n = 'short';
			m += ' short';
			h = '<div class="LR85"><div id="PageTopL" class="C3'+mde+' txtmed"></div><div id="PageTopR" class="right"></div></div>'+
				'<div class="pbar"></div>'+
				'<div id="PageBot" class="LR80 C3'+mde+' txt shim10">'+$I['load']+'</div>';
			d += ' hide';
		}else{
			tar = 'home';
		}
		
		$C['NetGraph'].className = n;
		$C['Stage'].className = m;
		$C['Stage'].innerHTML = h;
		$C['Addr'].className = d;
		
		if(tar === 'blocks'){
			dta_Blocks(1);
		}else if(tar === 'payments'){
			dta_Payments(1);
		}else if(tar === 'help'){
			dta_Help();
		}else{
			Dash_init();
			Dash_load();
		}

		Graph_Net();
		document.querySelector('#HeadMenu select').value = tar;
		document.querySelector('#FootR .nav[data-tar="'+tar+'"]').classList.add('o5');
	}, 300);
}
//Dash
function Dash_init(){
	var $S = ['SplitL', 'SplitR'],
		ins = '<div id="News" class="hide"><div id="NewsCard" class="LR85 C0bk'+mde+' C3'+mde+' shimtop20"></div></div>'+
		'<div id="MinerPayments"></div>'+
		'<div id="MinerGraph"></div>'+
		'<div id="MinerDash" class="LR85 txtbig C3'+mde+' hide"></div>'+
		'<div id="WorkerList" class="LR85 shimtop20"></div>';

	$C['Stage'].innerHTML = ins;
	
	ins = '';	
	for(var j = 0; j < 2; j++){
		ins += '<div class="'+$S[j]+'">';
		var i = 0;
		for(var k in $$['sts']){
			if((j === 0 && i < 2) || (j === 1 && i >= 2)){
				var d = $$['sts'][k]['def'] || '--';
				ins += '<div class="Spl">'+
					'<div id="'+k+'">'+d+'</div>'+
					'<div class="hbar shim4 o8"></div>'+
					'<div class="C2 txttny">'+$$['sts'][k]['lbl']+'</div>'+
				'</div>';
			}
			i++;
		}
		ins += '</div>';
	}
	document.getElementById('MinerDash').innerHTML = ins;
	var f = document.getElementById('MinerCalcFld'),
		h = document.getElementById('MinerCalcHsh'),
		u = document.getElementById('MinerCalcUnit');
		
	ins = '';
	for(var k in $$['calc']){
		ins += '<option value="'+k+'">'+$$['calc'][k]+'</option>';
	}
	f.innerHTML = ins;
	f.className = 'FrmElem txttny C0'+mde+' C1bk';
	ins = '';
	for(var k in $D['hashconv']){
		ins += '<option value="'+k+'">'+k+'/s</option>';
	}
	u.innerHTML = ins;
	u.value = 'H';
	u.className = 'FrmElem txttny C0'+mde+' C1bk';
	h.className = 'FrmElem txttny C0'+mde+' C1bk';
}
function Dash_load(typ){
	var m = document.getElementById('MinerGraph'),
		l = document.getElementById('WorkerList'),
		g = document.getElementById('MinerDash');
	
	if(addr){
		if($Q['cur']['reg'].test(addr)){
			$C['AddrField'].classList.remove('C4');
			if(typ !== 'refresh'){
				Dash_btn('loading');
				l.innerHTML = $I['load'];
			}
			api('account').then(function(){
				if($A[addr] && $A[addr]['hashes']){
					g.classList.remove('hide');
					for(var k in $$['pay']){
						var val = $A[addr][$$['pay'][k]['var']], dec = 8;
						if(val > 99999){
							dec = 4;
						}else if(val > 9999){
							dec = 5;
						}else if(val > 999){
							dec = 6;
						}else if(val > 99){
							dec = 7;
						}
						document.getElementById(k).innerHTML = Rnd(val, dec, 'txt');	
					}
					document.getElementById('MinerHashes').innerHTML = Num($A[addr]['hashes']);
					document.getElementById('MinerShares').innerHTML = $A[addr]['shares'];
					
					if(typ !== 'refresh') Dash_btn('loaded');
					Graph_Miner_init();
					MultipleAddress();
					
					api('workers', addr).then(function(){
						var wcn = ($A[addr]['wrkrs'] && numObj($A[addr]['wrkrs']) > 0) ? numObj($A[addr]['wrkrs']) : 0,
							plr = (wcn === 1) ? '' : 's';
							
						document.getElementById('MinerWorkerCount').innerHTML = wcn+' Worker'+plr;
						document.getElementById('MinerLastHash').innerHTML = Ago($A[addr]['last'], 'y');
						
						Workers_init();
					}).catch(function(err){console.log(err)});
				}else{
					Dash_reset();
					m.innerHTML = '<div class="MinerMsg C3'+mde+'"><div class="txtmed">'+$$['msg']['addr_notfound']['head']+'</div><div class="LR80 txt shim10">'+$$['msg']['addr_notfound']['text']+'</div></div>';
				}
			}).catch(function(err){console.log(err)});
		}else{
			Dash_reset();
			$C['AddrField'].classList.add('C4');
			m.innerHTML = '<div class="MinerMsg C3'+mde+'"><div class="txtmed">'+$$['msg']['addr_invalid']['head']+'</div><div class="LR80 txt shim10">'+$$['msg']['addr_invalid']['text']+'</div></div>';
		}
	}else{
		Dash_reset();
		m.innerHTML = '<div class="MinerMsg C3'+mde+'"><div class="txtmed">'+$$['msg']['welcome']['head']+'</div><div class="LR80 txt shim10">'+$$['msg']['welcome']['text']+'</div></div>';
	}
}
function Dash_reset(){
	Dash_btn('inactive');
	var $R = {
		'WorkerList':{'v':''},
		'MinerGraph':{'v':''},
		'MinerPayments':{'r':'Opened','v':''},
	},
	k = Object.keys($R);
	for(var i = 0; i < k.length; i++){
		var id = k[i], el = document.getElementById(id);
		el.innerHTML = $R[id]['v'];
		if($R[id]['r']) el.classList.remove($R[id]['r']);
	}
	for(var k in $$['pay']){
		var e = document.getElementById(k);
		if(e) e.innerHTML = $$['pay'][k]['def'] || '--';
	}
	for(var k in $$['sts']){
		var e = document.getElementById(k);
		if(e) e.innerHTML = $$['sts'][k]['def'] || '--';
	}

}
function Dash_btn(m){
	var b = $C['DashPayBtn'], c = 'nopoint C2fl o5', h = $I['settings'];
	if(m === 'loading'){
		c = 'nopoint';
		h = $I['load'];	
	}else if(m === 'loaded'){
		c = 'C1fl hov';
	}else if(m === 'closer'){
		c = 'C1fl';
		h = '<div class="Closer hov">'+$I['x']+'</div>';
	}
	b.className = c;
	b.innerHTML = h;
}
function Dash_calc(){
	var f = document.getElementById('MinerCalcFld'),
		f_val = f.value || 1,
		h = document.getElementById('MinerCalcHsh'),
		h_raw = 0,
		h_val = h.value || 0,
		u = document.getElementById('MinerCalcUnit'),
		u_val = u.value || 'H',
		rew = 0;
		
	if(h_val && h_val > 0){
		h_raw = h_val * $D['hashconv'][u_val];
	}else{
		h_raw = document.getElementById('MinerGraphAvg').getAttribute('data-hsh') || 0;
	}
	
	var hs = HashConv(h_raw),
		j = 0;
		
	h_val = hs['num'];
	u_val = hs['unit'].replace('/s', '');
	
	h.value = h_val;
	u.value = u_val;
	f.value = f_val;
	
	for(var i = 0; i < 6; i++){
		if($D['block'][i]){
			rew = rew + parseFloat($D['block'][i]['reward']);
			j++;
		}
	}
	var t = h_raw / $D['net'][0]['hash'] * 1440 / $Q['cur']['blk'] * rew / j * f.value;
	document.getElementById('MinerCalc').innerHTML = Rnd(t, 4, 'txt')+' '+$Q['cur']['sym'];	
}
//Workers
function Workers_init(){		///check this, getting called alot
	var l = document.getElementById('WorkerList');
	if($A[addr] && $A[addr]['wrkrs'] && l){
		var numwrk = numObj($A[addr]['wrkrs']),
			i = 0,
			d = '',
			ky = '',
			blkclss = '',
			ins = '<div id="WorkerSortGroup" class="hide txttny C2">'+
				'<div id="WorkerSortName" class="C2bk C0fl'+mde+'" data-ord="D">'+$I['sort']+'</div>'+
				'<div id="WorkerSortRate" class="C2bk C0fl'+mde+'" data-ord="D">'+$I['sort']+'</div>'+
			'</div>'+
			'<div class="WingPanel">';
		
			srt = (pref.charAt(1) === 'R') ? 'rate' : 'name',
			ord = 'A',
			s = [];
			
		if(['A','D'].indexOf(pref.charAt(2)) >= 0) ord = pref.charAt(2);
		
		for(i = 0; i < numwrk; i++){
			s.push([i, $A[addr]['wrkrs'][i][srt]]);
		}
		if(srt === 'name'){
			s.sort(function(a, b){return a[1].toLowerCase().localeCompare(b[1].toLowerCase())});
			if(ord === 'D') s.reverse();
		}else if(srt === 'rate'){
			if(ord === 'D'){
				s.sort(function(a, b){return -(a[1] - b[1])});
			}else{
				s.sort(function(a, b){return a[1] - b[1]});
			}
		}
		if(numwrk < 8) blkclss = ' WBlockFewGrid';
		for(i = 0; i < numwrk; i++){
			ky = s[i][0];
			ins += '<div class="WorkerWrap '+blkclss+'">'+
				'<div class="Worker C1br C2br_hov C3'+mde+'" data-key="'+ky+'">'+
					'<div id="WName-'+ky+'" class="txtmed LblL">--</div><div id="WRate-'+ky+'" class="txtmed LblR">--</div>'+
					'<div class="WorkerChart" data-worker="'+ky+'"></div>'+
				'</div>'+
			'</div>';
		}
		l.innerHTML = ins+'</div><div class="clear"></div>';
		
		if(numwrk > 0){
			var bwid = document.getElementById('WName-0').clientWidth;
			for(i = 0; i < numwrk; i++){
				document.getElementById('WName-'+s[i][0]).innerHTML = Truncate($A[addr]['wrkrs'][s[i][0]]['name'], Rnd(bwid / 6.25));
			}
		}
		if(numwrk > 1){
			document.getElementById('WorkerSortGroup').classList.remove('hide');
			Workers_sort(srt, ord, 'n');
		}

		var cnt = 0;
		for(i = 0; i < s.length; i++){
			api('worker', s[i][0], $A[addr]['wrkrs'][s[i][0]]['name']).then(function(k){
				var d = $A[addr]['wrkrs'][k],
					hsh = (d && d['stats'] && d['stats'][0] && d['stats'][0]['hsh']) ? d['stats'][0]['hsh'] : 0;
				
				if(hsh > 0){
					hsh = HashConv(hsh);
					document.getElementById('WRate-'+k).innerHTML = hsh['num']+' '+hsh['unit'];
					if(d['stats']) Graph_Worker(k);
				}else{
					document.querySelector('.Worker[data-key="'+k+'"]').classList.add('C4','C4br');
				}
				cnt++;
				if(numwrk > 1 && cnt === numwrk) Workers_sort(srt, ord, 'y');
			}).catch(function(err){console.log(err)});
		}
	}
}
function Workers_sort(srt, ord, sts){
	var n = document.getElementById('WorkerSortName'),
		n_cl = 'C2bk C0fl'+mde+' hov',
		n_in = $I['sort'],
		r = document.getElementById('WorkerSortRate'),
		r_cl = 'C2bk C0fl'+mde+' hov',
		r_in = $I['load'],
		ordV = (ord === 'D') ? 'A' : 'D',
		orot = (ord === 'D') ? 'rot90' : 'rot270';
		
	if(sts === 'y'){
		if(srt === 'rate'){
			r_cl = 'C1bk C0fl'+mde+' hov '+orot;
			r_in = $I['arrow'];
		}else if(srt === 'name'){
			r_in = $I['sort'];
		}
	}else{
		if(srt === 'rate') r_cl = 'C1bk C0fl'+mde+' nopoint';
	}
	if(srt === 'rate'){
		r.setAttribute('data-ord', ordV);
	}else if(srt === 'name'){
		n.setAttribute('data-ord', ordV);
		n_cl = 'C1bk C0fl'+mde+' hov '+orot;
		n_in = $I['arrow'];
	}
	n.className = n_cl;
	n.innerHTML = n_in;
	r.className = r_cl;
	r.innerHTML = r_in;
}
function Workers_detail(xid){
	if(xid){
		var w = document.querySelector('.Worker[data-key="'+xid+'"]'),
			sts = (w.querySelector('#WorkerPop') != null) ? 'remove' : '';
	}

	removeElement('WorkerPop');
	document.querySelectorAll('.Worker').forEach(function(x){
		x.classList.remove('C1');
		x.classList.add('C3'+mde);
	});

	if(xid && sts !== 'remove'){
		w.classList.add('C1');
		w.classList.remove('C3'+mde);
		w.innerHTML += '<div id="WorkerPop" class="C0bk'+mde+' C1br C3'+mde+' txtsmall"></div>';

		var d = $A[addr]['wrkrs'][xid],
			p = document.getElementById('WorkerPop');
		
		p.innerHTML = $I['load'];
		api('workerdetail', xid, d['name']).then(function(){
			var avg = 0,
				havg = 0,
				timestart = 99999999999999999,
				cnt = numObj($A[addr]['wrkrs'][xid]['stats']),
				i = cnt;

			while(i--){
				avg = avg + parseInt($A[addr]['wrkrs'][xid]['stats'][i]['hsh']);
				SynchTime($A[addr]['wrkrs'][xid]['stats'][i]['tme']);
				if($A[addr]['wrkrs'][xid]['stats'][i]['tme'] < timestart) timestart = $A[addr]['wrkrs'][xid]['stats'][i]['tme'];
			}
			havg = HashConv(Rnd(avg / cnt, 0));
			p.innerHTML = '<div id="WorkerPopClose" class="C1fl Btn16 Btn16Corner">'+$I['x']+'</div>'+
				'<div class="BoxL center">'+havg['num']+' '+havg['unit']+'</div>'+
				'<div class="BoxR center">'+Ago(d['last'], 'y')+'</div>'+
				'<div class="pbar shim4"></div>'+
				'<div class="BoxL txttny C2 center">Avg '+Ago(timestart)+'</div>'+
				'<div class="BoxR txttny C2 center">Last Share</div>'+
				'<div class="shim10"></div>'+
				'<div class="BoxL center">'+Num(d['hashes'])+'</div>'+
				'<div class="BoxR center">'+Num(d['val'])+' / '+Num(d['inv'])+'</div>'+
				'<div class="pbar shim4"></div>'+
				'<div class="BoxL txttny C2 center">'+$$['sts']['MinerHashes']['lbl']+'</div>'+
				'<div class="BoxR txttny C2 center">'+$$['sts']['MinerShares']['lbl']+'</div>';
		}).catch(function(err){console.log(err)});
	}
}
//Miner Payments
function MinerPayments(typ){
	typ = typ || '';
	if(addr && $A[addr] && $A[addr]['hashes'] && $A[addr]['hashes'] > 0){
		var m = document.getElementById('MinerPayments'), n = document.getElementById('NewsBody');
		if(typ !== 'back' && (m.classList.contains('Opened') || m.classList.contains('OpenedBig'))){
			if(n) n.classList.remove('hide');
			m.className = '';
			m.innerHTML = '';
			Dash_btn('loaded');
			return;
		}else{
			if(n) n.classList.add('hide');
			m.className = 'Opened';
			m.innerHTML = '<div class="hbar"></div><div id="MinerPaymentsStage">'+$I['load']+'</div>';
			Dash_btn('closer');
		}
	}else{
		return;
	}
	
	api('user').then(function(){
		var t = $Q['pay']['min_inst']+' '+$Q['cur']['sym']+' '+$$['trn']['min'],
			c = 'o5 nopoint',
			eml = ($Q['email']) ? 'EmailTog' : '',
			ins = '';
			
		if($A[addr]['due'] >= $Q['pay']['min_inst']){
			t = 'Pay '+$A[addr]['due']+' '+$Q['cur']['sym']+' Now';
			c = 'C2bk_hov';
		}
		ins = '<div class="LR50 shimtop20 C0'+mde+' txtmed">'+
			'<div id="InstaPayBtn" class="BtnElem C1bk '+c+'">'+t+'</div><div class="hbar shim10"></div>'+
			'<input type="text" id="AutoPayFld" class="FrmElem txt C0bk'+mde+' C3'+mde+' C1br" autocomplete="off" placeholder="Auto Pay Amount...">'+
			'<div id="AutoPayBtn" class="BtnElem C1bk C2bk_hov o5">'+$$['trn']['set']+'</div><div class="hbar shim10"></div>'+
		'</div>'+
		'<div id="PaymentHistory"><div class="LR50">'+
			'<div id="PaymentHistoryBtn" class="BtnElem '+eml+' C0'+mde+' txtmed C1bk C2bk_hov">'+$$['trn']['vwpy']+'</div>';
		
		if($Q['email']){
			var check = $I['x'],
				lbl = $$['trn']['eml_off'];
			
			if($A[addr]['email'] == '1'){
				check = $I['check'];
				lbl = $$['trn']['eml_on'];
			}
			
			ins += '<div id="EmailToggleBtn" class="BtnElem DiscMde C1bk C2bk_hov">'+
				'<div class="DiscIcon C0bk'+mde+' C1fl">'+check+'</div><span id="EmailToggleLbl" class="C0'+mde+' txtmed">'+lbl+'</span>'+
			'</div>';
		}
		ins += '</div></div>';
		
		document.getElementById('MinerPaymentsStage').innerHTML = ins;
		if($A[addr]['threshold'] > 0) document.getElementById('AutoPayFld').value = Rnd($A[addr]['threshold'], $Q['pay']['dec_auto'], 'txt');
	});
}
function EmailToggle(){
	var ic = document.querySelector('#EmailToggleBtn .DiscIcon');
	ic.classList.add('preload');
	ic.innerHTML = $I['load'];
	api('toggleEmail').then(function(){
		api('user').then(function(){
			var ico = $I['x'],
				lbl = $$['trn']['eml_off'];
				
			if($A[addr]['email'] == '1'){
				ico = $I['check'];
				lbl = $$['trn']['eml_on'];
			}
				
			ic.classList.remove('preload');
			ic.innerHTML = ico;
			document.getElementById('EmailToggleLbl').innerHTML = lbl;
		});
	});
}
function InstaPay(){
	var b = document.getElementById('InstaPayBtn'), c = 'C4bk', t;
	b.innerHTML = '<div class="C0fl'+mde+' preload">'+$I['refresh']+'</div>';
	api('forcepayment').then(function(sts){
		b.classList.remove('C1bk','C4bk','C5bk');
		t = sts['msg'];
		if(sts && sts['msg'] && sts['msg'] === 'Payout scheduled'){
			c = 'C5bk';
			t = $$['trn']['que'];
		}
		b.classList.add(c);
		b.innerHTML = t;
	});	
}
function AutoPay(s){
	var c = AutoPayCheck(),
		b = document.getElementById('AutoPayBtn');
	
	if(c === 'OK'){
		b.classList.remove('C1bk','C4bk','C5bk');
		b.innerHTML = $I['load'];
		api('updatethreshold', '', NumInput(document.getElementById('AutoPayFld').value)).then(function(){
			b.classList.add('C5bk');
			b.innerHTML = $$['trn']['updt'];
		});
	}
}
function AutoPayCheck(){
	var b = document.getElementById('AutoPayBtn'),
		b_ins = $$['trn']['set'],
		f = document.getElementById('AutoPayFld'),
		val_num = NumInput(f.value),
		r = 'err';

	b.classList.remove('C1bk','C4bk','C5bk','o5');
	f.classList.remove('C4','C4br');
	if(val_num < $Q['pay']['min_auto']){
		b.classList.add('C4bk');
		b_ins = $Q['pay']['min_auto']+' '+$Q['cur']['sym']+' '+$$['trn']['min'];
		f.classList.add('C4', 'C4br');
	}else if(val_num >= $Q['pay']['min_auto']){
		b.classList.add('C1bk');
		r = 'OK';
	}else{
		b.classList.add('C1bk', 'o5');
	}
	b.innerHTML = b_ins;
	f.value = Rnd(val_num, $Q['pay']['dec_auto'], 'txt');
	return r;
}
function MinerPaymentHistory(pge){
	pge = (pge > 1) ? pge : 1;
	document.getElementById('MinerPayments').className = 'OpenedBig';
	document.getElementById('PaymentHistory').innerHTML = '<div class="LR85"><div id="PaymentHistoryBtnClose" class="BtnElem C0'+mde+' txtmed C1bk C2bk_hov">Close Payment History</div>'+
		'<div id="MinerPaymentsTable" class="C3'+mde+'">'+$I['load']+'</div></div>'+
		'<input type="hidden" id="MinerPaymentsPage" value="'+pge+'">';
		
	api('pay', addr, pge).then(function(){
		Tbl('MinerPaymentsTable', 'pay', pge, 10);
	}).catch(function(err){console.log(err)});
}
//Other Pages
function dta_Blocks(pge){
	api('poolstats').then(function(){
		document.getElementById('PageTopL').innerHTML = Num($D['poolstats']['blocks'])+' Blocks Found with '+Num($D['poolstats']['hashes'])+' Hashes';
		api('netheight').then(function(){
			if(pge === 1 && numObj($D['block']) >= 25){
				$D['blockhistory'] = $D['block'];
				Tbl('PageBot', 'blockhistory', 1, 25);
			}else{
				document.getElementById('PageBot').innerHTML = $I['load'];
				api('blockhistory', pge, 25).then(function(){
					Tbl('PageBot', 'blockhistory', pge, 25);
				}).catch(function(err){console.log(err)});
			}
		}).catch(function(err){console.log(err)});
	}).catch(function(err){console.log(err)});
}
function dta_Payments(pge){
	document.getElementById('PageBot').innerHTML = $I['load'];
	api('poolstats').then(function(){
		document.getElementById('PageTopL').innerHTML = Num($D['poolstats']['payments'])+' Payments to '+Num($D['poolstats']['minerspaid'])+' Miners';
		api('poolpay', pge, 25).then(function(){
			Tbl('PageBot', 'poolpay', pge, 25);
		}).catch(function(err){console.log(err)});
	}).catch(function(err){console.log(err)});
}
function dta_Help(){
	document.getElementById('PageTopL').innerHTML = $$['hlp']['head'];
	document.getElementById('PageTopR').innerHTML = '<span class="txttny C2">Join Us on IRC<br>#monero-pools</span>';
	var ins = '<p>'+$$['hlp']['text']+'</p>'+
		'<div class="helpgroup">'+
			'<div class="helptitle txtbig">Step 1 - Install Wallet & Create Address<div class="btnback">'+$I['arrow']+'</div></div>'+
			'<div class="helpteaser">Start here if you need a Monero address and wallet.</div>'+
			'<div class="helpcontent hide">'+
				'<p>The <a href="https://www.getmonero.org/downloads/" target="_blank" class="C1 hov">Official Monero Wallet</a> is recommended. Monero Outreach\'s <a href="https://www.monerooutreach.org/stories/monero_wallet_quickstart.php" class="C1 hov" target="_blank">Wallet Guide</a> has a list of other wallet options including paper wallets.</p>'+
			'</div>'+
		'</div>'+
		'<div class="helpgroup">'+
			'<div class="helptitle txtbig">Step 2 - Install Mining Software<div class="btnback">'+$I['arrow']+'</div></div>'+
			'<div class="helpteaser">Install the software needed to mine Monero.</div>'+
			'<div class="helpcontent hide">'+
				'<p>Select the miner that best suits your hardware and follow their installation instructions. If you need help, visit #monero-pools.</p>'+
				'<p><table class="txtsmall C3'+mde+'"><tr>'+
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
			'<div class="helptitle txtbig">Step 3 - Configure Settings<div class="btnback">'+$I['arrow']+'</div></div>'+
			'<div class="helpteaser">Select a pool server and port and configure you miner.</div>'+
			'<div class="helpcontent hide">'+
				'<p>Each mining software will have it\'s own config, but they will all ask for the same information:</p>'+
				'<p><b>Your Monero Address</b><br>Often this will be labeled username, but check the instructions. You can specify a paymentID by using the following format: <i>address</i>.<i>paymentID</i></p>'+
				'<p><b>Pool Address</b><br>The miner will want a url and a port, like this: pool.supportxmr.com:3333</p>'+
				'<p><table class="txtsmall C3'+mde+'"><tr>'+
					'<td>'+
						'<p>Port descriptions:</p>'+
						'<ul><li>3333 Low-end CPU</li><li>5555 Fast/Multi CPU</li><li>7777 GPU rigs</li><li>9000 SSL/TLS</li></ul>'+
					'</td>'+
					'<td>'+
						'<p>If you can\'t get through firewall, try these:</p>'+
						'<ul><li>8080 Firewall bypass</li><li>80 Firewall bypass</li><li>443 Firewall bypass w/SSL/TLS</li></ul>'+
					'</td>'+
				'</tr></table></p>'+
				'<p><b>Optional Fields</b><br>You can also set worker names or fixed difficulty through the configuration.</p>'+
				'<p>Standard wallet address<br><i>(e.g. miner.exe -u 43T...sUW -p Steve)</i></p>'+
				'<p>Fixed difficulty of 3500 for the worker<br><i>(e.g. miner.exe -u 43T...sUW+3500 -p Steve)</i></p>'+
			'</div>'+
		'</div>'+
		'<div class="helpgroup">'+
			'<div class="helptitle txtbig">Step 4 - Start Mining<div class="btnback">'+$I['arrow']+'</div></div>'+
			'<div class="helpteaser">Launch the miner and learn more.</div>'+
			'<div class="helpcontent hide">'+
				'<p>This pool uses PPLNS to determine payouts. It helps to combat pool hopping and ensures a good payout for miners.</p>'+
				'<p>'+Perc('0.6')+' Pool Fee</p>'+
				'<p>0.1 XMR Default Payout</p>'+
				'<p>60 Block Confirmation Time</p>'+
			'</div>'+
		'</div>';
		
	document.getElementById('PageBot').innerHTML = ins;
}
//Data
var api = function(m, key, xid){
	now = Rnd((new Date()).getTime() / 1000);
	key = key || 0;
	xid = xid || '';
	
	var i = 0,
		url = '',
		start = now - (3600 * GraphLib_Duration());

	if(m === 'news' && now > ($U['news'] + 3600)){
		url = 'pool/motd';
	}else if(m === 'block'){
		url = 'pool/blocks?limit=100';
	}else if(m === 'blockhistory'){
		url = 'pool/blocks?page='+(key - 1)+'&limit='+xid;
	}else if(m === 'net' && now > ($U['net'] + 180)){
		url = 'network/chart/difficulty?timeScale=20';
	}else if(m === 'pool' && now > ($U['pool'] + 180)){
		url = 'pool/chart/hashrate?timeScale=20';
	}else if(m === 'netheight' && now > ($U['netheight'] + 180)){
		url = 'network/stats';
	}else if(m === 'poolpay'){
		url = 'pool/payments?page='+((key - 1) * xid)+'&limit='+xid;
	}else if(m === 'poolstats' && now > ($U['poolstats'] + 180)){
		url = 'pool/stats';
	}else if(m === 'account'){
		url = 'miner/'+addr+'/stats';
	}else if(m === 'pay'){
		url = 'miner/'+key+'/payments';
		if(xid){
			xid = (xid > 1) ? (xid - 1) * 10 : 0;
			url += '?page='+xid+'&limit=10';
		}
	}else if(m === 'workers' && (isEmpty($A[addr]['wrkrs']) || now > ($A[addr]['wrkrs_updt'] + 120))){
		url = 'miner/'+addr+'/identifiers';
	}else if(m === 'minershash'){
		url = 'miner/'+addr+'/chart/hashrate/';
	}else if(m === 'worker' && $A[addr] && $A[addr]['wrkrs'][key]){
		var kyup = ($A[addr]['wrkrs'][key] && $A[addr]['wrkrs'][key]['updt'] > 0) ? $A[addr]['wrkrs'][key]['updt'] : 0;
		if(isEmpty($A[addr]['wrkrs'][key]['stats']) || now > (kyup + 120)){
			url = 'miner/'+addr+'/chart/hashrate/'+xid;
		}
	}else if(m === 'workerdetail'){
		url = 'miner/'+addr+'/stats/'+xid;
	}else if(m === 'user' && addr){
		url = 'user/'+addr;
	}else if(m === 'updatethreshold'){
		url = 'user/updateThreshold';
	}else if(m === 'forcepayment'){
		url = 'user/forcePayment';
	}else if(m === 'toggleEmail'){
		url = 'user/toggleEmail';
	}

	return new Promise(function (resolve, reject){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if(xhr.readyState !== 4) return;
			if(xhr.status >= 200 && xhr.status < 300){
				var d = (xhr.responseText) ? JSON.parse(xhr.responseText) : '';
				if(d){
					var dcnt = numObj(d);
					//Update Data Times
					if(['net','netheight','pool','poolstats','news'].indexOf(m) >= 0) $U[m] = now;
					//Process Data
					if(m === 'news'){
						$D[m] = d;
					}else if(['block','blockhistory','net','pool','pay','poolpay'].indexOf(m) >= 0){
						$D[m] = {};
						for(i = 0; i < dcnt; i++){
							var v = d[i], tme = Rnd(v['ts'] / 1000);
							if(['block','blockhistory'].indexOf(m) >= 0){
								if(m === 'blockhistory' || tme >= start || i < $Q['graph']['blockmin']){
									var val = (v['valid'] == true) ? 't' : 'f';
									$D[m][i] = {
										'tme':tme,
										'hash':v['hash'],
										'height':v['height'],
										'reward':Rnd((v['value'] / 1000000000000), 8, 'txt'),
										'eff':Rnd(v['shares'] / v['diff'] * 100),
										'val':val
									};
								}
							}else if(m === 'net'){
								if(tme >= start) $D[m][i] = {'tme':tme, 'hash':Rnd(v['diff'] / 120)};
							}else if(m === 'pool'){
								if(tme >= start) $D[m][i] = {'tme':tme, 'hash':v['hs']};
							}else if(m === 'pay'){
								$D[m][i] = {
									'tme':v['ts'],
									'hash':v['txnHash'],
									'amnt':Rnd((v['amount'] / 1000000000000), 8)
								};
							}else if(m === 'poolpay'){
								$D[m][i] = {
									'tme':tme,
									'payees':v['payees'],
									'amnt':Rnd((v['value'] / 1000000000000), 8, 'txt'),
									'fee':Rnd((v['fee'] / 1000000000000), 8, 'txt')
								};
							}
						}
					}else if(m === 'netheight'){
						$D[m] = d['height'];
					}else if(m === 'poolstats'){
						$D[m] = {
							'blocks':d['pool_statistics']['totalBlocksFound'],
							'hashes':d['pool_statistics']['totalHashes'],
							'payments':d['pool_statistics']['totalPayments'],
							'minerspaid':d['pool_statistics']['totalMinersPaid']
						};
						$U['pool'] = now;
					}else if(m === 'account'){
						if(d && d['totalHashes'] && d['totalHashes'] > 0){
							$A[addr] = {
								'due':Rnd((d['amtDue'] / 1000000000000), 8),
								'paid':Rnd((d['amtPaid'] / 1000000000000), 8),
								'hashes':d['totalHashes'],
								'last':d['lastHash'],
								'shares':Num(d['validShares'])+' / '+Num(d['invalidShares']),
								'stats':{},
								'wrkrs':{},
								'wrkrs_updt':0,
								'email':'',
								'threshold':''
							}
						}
					}else if(m === 'workers'){
						$A[addr]['wrkrs'] = {};
						for(i = 0; i < dcnt; i++){
							$A[addr]['wrkrs'][i] = {};
							$A[addr]['wrkrs'][i]['name'] = d[i];
						}
						$A[addr]['wrkrs_updt'] = now;
					}else if(m === 'minershash'){
						$A[addr]['stats'] = api_GraphFormat(d, dcnt, start);
					}else if(m === 'worker'){
						$A[addr]['wrkrs'][key]['stats'] = api_GraphFormat(d, dcnt, start);
						$A[addr]['wrkrs'][key]['rate'] = ($A[addr]['wrkrs'][key]['stats'][0] && $A[addr]['wrkrs'][key]['stats'][0]['hsh']) ? $A[addr]['wrkrs'][key]['stats'][0]['hsh'] : 0;
						$A[addr]['wrkrs'][key]['updt'] = now;
					}else if(m === 'workerdetail'){
						$A[addr]['wrkrs'][key]['last'] = d['lts'];
						$A[addr]['wrkrs'][key]['hashes'] = d['totalHash'];
						$A[addr]['wrkrs'][key]['val'] = (d['validShares'] > 0) ? d['validShares'] : 0;
						$A[addr]['wrkrs'][key]['inv'] = (d['invalidShares'] > 0) ? d['invalidShares'] : 0;
					}else if(['user','updatethreshold','forcepayment','toggleEmail'].indexOf(m) >= 0){
						if(d && d['msg']){
							if(m === 'user'){
								$A[addr]['email'] = d['msg']['email_enabled'];
								$A[addr]['threshold'] = Rnd((d['msg']['payout_threshold'] / 1000000000000), 8);
							}else if(m === 'forcepayment'){
								key = d;
							}
						}
					}
					resolve(key);
				}else{
					reject('Data');
					console.log(xhr);
				}
			}else{
				reject('Connection');
				console.log(xhr);
			}
		};
		if(url){
			var method = 'GET', params = '';
			if(['updatethreshold','forcepayment','toggleEmail'].indexOf(m) >= 0){
				method = 'POST';
				if(m === 'updatethreshold'){
					params = {'username':addr, 'threshold':xid};
				}else if(m === 'toggleEmail'){
					params = {'address':addr};
				}else{
					params = {'username':addr};
				}
				params = JSON.stringify(params);
			}
			
			xhr.open(method, $Q['api']+url, true);
			xhr.setRequestHeader('Content-Type', 'application/json');
			
			if(method === 'POST'){
				xhr.send(params);
			}else{
				xhr.send();
			}
			//console.log('Lookup: '+m+':'+url+' '+method);
		}else{
			//console.log('Skipped: '+m+':'+url);
			resolve(key);
		}
	});
};
function api_GraphFormat(d, cnt, start){
	var interval = 300,
		r = {},
		r_key = 0,
		r_now = now,
		r_avg = 0,
		r_cnt = 0;
		
	for(var i = 0; i < cnt; i++){
		var tme = Rnd(d[i]['ts'] / 1000);
			hsh = (d[i] && d[i]['hs'] && d[i]['hs'] > 0) ? parseInt(d[i]['hs']) : 0;
			
		if(tme >= start){
			if(tme >= (r_now - interval)){
				r_cnt++
				r_avg = r_avg + hsh;
			}else{
				var avg = (r_cnt > 0 && r_avg > 0) ? Rnd((r_avg / r_cnt), 0) : 0;
				r[r_key] = {'tme':r_now, 'hsh':avg};
				
				r_avg = hsh;
				r_cnt = 1;				
				r_now = r_now - interval;
				r_key++;
			}
		}
	}
	var d_cnt = numObj(d),
		d_sum = 0,
		r_cnt = numObj(r),
		r_sum = 0;
		
	for(var i = 0; i < d_cnt; i++){
		d_sum = d_sum + d[i]['hs'];
	}
	for(var i = 0; i < r_cnt; i++){
		r_sum = r_sum + r[i]['hsh'];
	}
	return r;
}
//DataTable
function Tbl(tar, typ, pge, lim){
	var txt = (width > 900) ? 'txt' : 'txtsmall',
		row = 'ROW0',
		ins = '<div class="WingPanel"><table class="txt"><tr class="txttny">';
	
	for(var k in $$['tbl'][typ]){
		ins += '<td class="'+$$['tbl'][typ][k]['cls']+'">'+$$['tbl'][typ][k]['lbl']+'</td>';
	}
	ins += '</tr>';

	if($D[typ]){
		for(var i = 0; i < lim; i++){
			if($D[typ][i]){
				row = (i % 2 === 0) ? 'ROW1' : 'ROW0';
				ins += '<tr class="'+row+'">';
				for(var k in $$['tbl'][typ]){
					var val = '';
					if($D[typ] && $D[typ][i] && $D[typ][i][k]) val = $D[typ][i][k];
					if(k === 'tme'){
						val = Ago(val, 'y');
					}else if(k === 'height'){
						val = Num(val);
					}else if(k === 'eff'){
						var clr = (val > 100) ? 'C4' : 'C5';
						val = '<span class="'+clr+'">'+Perc(val)+'</span>';
					}else if(k === 'togo'){
						val = BlockToGo($D[typ][i]['height'], $D[typ][i]['val']);
					}else if(k === 'hash'){
						if($$['tbl'][typ]['hash'] && $$['tbl'][typ]['hash']['hsh'] === 'y'){
							val = '<div class="HashTrun" data-hash="'+val+'">'+val+'</div>';
						}
					}
					ins += '<td class="'+$$['tbl'][typ][k]['cls']+'">'+val+'</td>';
				}
				ins += '</tr>';
			}
		}
	}
	ins += '</table>'+
		'<div id="'+tar+'-WBL" class="WingBtnL rot180 o3 nopoint C2bk C0fl'+mde+'">'+$I['arrow']+'</div>'+
		'<div id="'+tar+'-WBR" class="WingBtnR o3 nopoint C2bk C0fl'+mde+'">'+$I['arrow']+'</div>'+
		'</div>';
		
	document.getElementById(tar).innerHTML = ins;
	if($D[typ]){
		var tr = (typ === 'pay') ? 'tx' : '';
		console.log(tr);
		HashTrun(tr);
		if(tar === 'PageBot'){
			var pgs = 0,
				tot = (typ === 'poolpay') ? $D['poolstats']['payments'] : $D['poolstats']['blocks'];
				
			pgs = Math.ceil(tot / 25);
			document.getElementById('PageTopR').innerHTML = '<span class="txtmed C3'+mde+'">Page</span><input id="TblPagBox" type="text" class="FrmElem txttny C1bk C0'+mde+'" value="'+pge+'" data-func="'+typ+'" autocomplete="off" data-tot="'+pgs+'"><span class="txtmed C3'+mde+'">of '+Num(pgs)+'</span>';
			PaginationBoxWidth();
		}
		if(i > 0){
			var BL = document.getElementById(tar+'-WBL'),
				BR = document.getElementById(tar+'-WBR');
			
			if(pge > 1){
				BL.className = 'WingBtnL PagBtn rot180 C1bk C0fl'+mde;
				BL.setAttribute('data-page', pge - 1);
				BL.setAttribute('data-func', typ);
			}
			if(i === lim){
				BR.className = 'WingBtnR PagBtn C1bk C0fl'+mde;
				BR.setAttribute('data-page', pge + 1);
				BR.setAttribute('data-func', typ);
			}
		}
	}
}
function PaginationBoxWidth(){
	var b = document.getElementById('TblPagBox'),
		val = b.value.replace(/\D/g,''),
		tot = parseInt(b.getAttribute('data-tot')),
		wid = 18;

	if(val > 999){
		wid = (val > 9999) ? 50 : 42;
		if(val > tot) val = tot;
		val = Num(val);
	}else if(val > 99){
		wid = 32;
	}else if(val > 9){
		wid = 24;
	}
	b.style.width = wid+'px';
	b.value = val;
}
//Graphing
function Graph_Net(){
	if($C['NetGraph'] != null && $D['net'][0] && $D['net'][0]['hash']){
		var min = 999999999999,
			max = 0,
			xratio = 0,
			i = 0,
			ncnt = numObj($D['net']),
			ncnt_pt = 0,
			pcnt = numObj($D['pool']),
			pcnt_pt = 0,
			bcnt = numObj($D['block']),
			$P = {'n':{},'p':{},'b':{}},
			pavg = 0,
			divheight = $C['NetGraph'].clientHeight,
			fullsize = (divheight > 75) ? 'y' : 'n',
			bottom = (fullsize === 'y') ? 24 : 0,
			height = divheight - bottom,
			blocksize = (fullsize === 'y') ? 6.5 : 4.5,
			linesize = (fullsize === 'y') ? 1.25 : .75,
			padR = (width > 900) ? 55 : 50,
			right_x = width - padR,
			graphhrs = GraphLib_Duration(),
			timestart = now - (3600 * graphhrs),
			firsthash = 0,
			hsh_net = HashConv($D['net'][0]['hash']),
			hsh_pool = HashConv($D['pool'][0]['hash']),
			currenteffort = 0,
			ins = '<svg viewBox="0 0 '+width+' '+height+'" class="chart">'+
			'<defs>'+
				'<linearGradient id="P"><stop offset="0%" stop-color="#'+$Q['clr']['main']+'" stop-opacity="0.99" /><stop offset="98%" stop-color="#'+$Q['clr']['main']+'" stop-opacity="0.05" /><stop offset="100%" stop-color="#'+$Q['clr']['main']+'" stop-opacity="0.00" /></linearGradient>'+
			'</defs>';
		
		i = pcnt;
		while(i--){
			pavg = pavg + $D['pool'][i]['hash'];
			if($D['pool'][i]['hash'] < min) min = $D['pool'][i]['hash'];
			if($D['pool'][i]['hash'] > 0 && firsthash === 0){
				firsthash = $D['pool'][i]['tme'];
			}
		}
		
		if(firsthash > timestart) timestart = firsthash;

		i = ncnt;
		while(i--){
			if($D['net'][i]['tme'] >= timestart){
				if($D['net'][i]['hash'] > max) max = $D['net'][i]['hash'];
			}
		}
		
		pavg = pavg / pcnt;
		xratio = right_x / (now - timestart);
		
		//Create Points
		for(i = 0; i < ncnt; i++){
			if($D['net'][i]['tme'] >= timestart){
				ncnt_pt++;
				$P['n'][i] = {
					'x':Rnd(right_x - (now - $D['net'][i]['tme']) * xratio, 1),
					'y':Rnd(height + 2 - ($D['net'][i]['hash'] - min) / (max - min) * height, 1)
				};
			}
		}
		for(i = 0; i < pcnt; i++){
			if($D['pool'][i]['tme'] >= timestart){
				pcnt_pt++;
				$P['p'][i] = {
					'x':Rnd(right_x - (now - $D['pool'][i]['tme']) * xratio, 1),
					'y':Rnd(height - 4 - ($D['pool'][i]['hash'] - min) / (max - min) * height, 1)
				};
			}
		}
	
		//NetHash Line
		ins += '<polyline class="C1st" stroke-width="'+linesize+'" fill="url(#P)" points="'+right_x+','+$P['n'][0]['y'];
		for(i = 0; i < ncnt_pt; i++){
			ins += ' '+$P['n'][i]['x']+','+$P['n'][i]['y'];
		}
		ins += ' -3,'+$P['n'][(ncnt_pt - 1)]['y']+' -3,'+$P['p'][(ncnt_pt - 1)]['y'];
		i = pcnt_pt;
		while(i--){
			ins += ' '+$P['p'][i]['x']+','+$P['p'][i]['y'];
		}
		ins += ' '+right_x+','+$P['p'][0]['y']+'" />';

		if($Q['graph']['pplns']){
			//PPLNS Window
			var pplns = 2 * ($D['net'][0]['hash'] * 120) / pavg * xratio,
				plft = 9999999999,
				pmid = 0;
				
			ins += '<polygon class="C1fl" opacity=".75" points="'+right_x+','+$P['n'][0]['y'];
			for(i = 0; i < ncnt_pt; i++){
				if($P['n'][i]['x'] > right_x - pplns) ins += ' '+$P['n'][i]['x']+','+$P['n'][i]['y'];
			}
			for(p = (pcnt_pt - 1); p >= 0; p--){
				if($P['p'][p]['x'] > right_x - pplns){
					ins += ' '+$P['p'][p]['x']+','+$P['p'][p]['y'];
					if($P['p'][p]['x'] < plft) plft = $P['p'][p]['x'];
				}
			}
			ins += ' '+right_x+','+$P['p'][0]['y']+'" />';
			if(fullsize === 'y'){
				pmid = (right_x + plft) / 2;
				ins += '<text x="'+pmid+'" y="'+($P['n'][0]['y'] + 14)+'" text-anchor="middle" class="C0fl'+mde+' txttny o9"><tspan x="'+pmid+'">PPLNS</tspan><tspan x="'+pmid+'" dy="10">Window</tspan></text>';
			}
		}
		
		//Grid Lines & Labels
		ins += GraphLib_Grid('line', 3, max, min, height, width, 'C0');
		ins += GraphLib_Grid('lbl', 3, max, min, height, width, 'C0');
		
		ins += '<text x="'+(right_x + 5)+'" y="'+($P['n'][0]['y'] + 14)+'" class="txtmed C1fl">'+Rnd(hsh_net['num'], 1, 'txt')+'</text>'+
			'<text x="'+(right_x + 5)+'" y="'+($P['p'][0]['y'] + 1)+'" class="txtmed C1fl">'+Rnd(hsh_pool['num'], 1, 'txt')+'</text>';
		
		if(fullsize === 'y'){
			ins += '<text x="'+(right_x + 5)+'" y="'+($P['n'][0]['y'] + 23)+'" class="txttny C2fl o8">'+hsh_net['unit']+' Net</text>'+
				'<text x="'+(right_x + 5)+'" y="'+($P['p'][0]['y'] - 17)+'" class="txttny C2fl o8">'+hsh_pool['unit']+' Pool</text>';
		}

		//Blocks
		if(bcnt > 0){
			var max_effort = 0,
				blockstart = timestart,
				avg_effort = 0,
				mod_bcnt = 0,
				win_bcnt = 0,
				bline = height + 5,
				right_x = width - padR;
				
			for(var j = 0; j < bcnt; j++){
				var ch = 'n';
				if($D['block'][j]['tme'] >= timestart){
					ch = 'y';
				}else{
					if(win_bcnt < 6){
						if($D['block'][j]['tme'] < blockstart) blockstart = $D['block'][j]['tme'];
						ch = 'y';
						win_bcnt++;
					}
				}
				if(ch === 'y'){
					mod_bcnt++;
					avg_effort = avg_effort + parseInt($D['block'][j]['eff']);
					if($D['block'][j]['eff'] > max_effort) max_effort = $D['block'][j]['eff'];
				}
			}
			avg_effort = Rnd(avg_effort / mod_bcnt);
			currenteffort = Rnd((now - $D['block'][0]['tme']) / ($D['net'][0]['hash'] / $D['pool'][0]['hash'] * 120) * 100);

			mod_bcnt = 0;
			for(i = 0; i < bcnt; i++){
				//$P['n'][i]['x']
				if($D['block'][i]['tme'] >= blockstart){
					var x = Rnd(right_x - (now - $D['block'][i]['tme']) * (right_x / (now - blockstart)), 1);
					if(x > 57){
						$P['b'][i] = {'x':x,'y':Rnd(height - 10 - ($D['block'][i]['eff'] * ((height - 25) / max_effort)), 1)};
						mod_bcnt++;
					}	
				}
			}
			bcnt = mod_bcnt;
			
			//Blocks  $Q['graph']['blockmin']
			for(i = 0; i < bcnt; i++){
				var clrclass = ($D['block'][i]['eff'] <= 100) ? 'C5fl' : 'C4fl',
					$c = {'0':{'cl':'C1fl','sz':1},'1':{'cl':'o7 C0fl'+mde,'sz':.92},'2':{'cl':'Dot '+clrclass,'sz':.71}};
				
				for(var j = 0; j <= 2; j++){
					var cls = '',
						dta = '';
						
					if(j === 2){
						cls = ' ToolTip blockgroup';
						dta = ' data-block="'+i+'" data-eff="'+$D['block'][i]['eff']+'" data-tme="'+$D['block'][i]['tme']+'"';
					}
					ins += '<circle cx="'+$P['b'][i]['x']+'" cy="'+$P['b'][i]['y']+'" r="'+(blocksize * $c[j]['sz'])+'" class="'+$c[j]['cl']+cls+'"'+dta+' />';
				}
			}	
		}

		//Blocks Bottom Details
		if(fullsize === 'y'){
			var text_y = bline + 4, 
				xL = 0,
				yL = 0,
				xR = right_x,
				yR = 0,
				tm = '';
				
			if(bcnt > 0){
				xL = $P['b'][(bcnt - 1)]['x'];
				yL = $P['b'][(bcnt - 1)]['y'];
				xR = $P['b'][0]['x'];
				yR = $P['b'][0]['y'];
				tm = Ago($D['block'][0]['tme'], 'y'),
				avgeff = Perc(avg_effort)+' '+$$['trn']['avgeff'],
				avgeff_w = avgeff.length * 5.5,
				lstfnd = 'Found '+tm,
				lstfnd_w = lstfnd.length * 5.7;

				ins += '<line x1="'+xR+'" y1="'+(yR + 3 + (blocksize / 2))+'" x2="'+xR+'" y2="'+bline+'" class="line C2st" />'+
					'<line x1="'+xR+'" y1="'+bline+'" x2="'+xL+'" y2="'+bline+'" class="line C2st" />'+
					'<line x1="'+xL+'" y1="'+(yL + 3 + (blocksize / 2))+'" x2="'+xL+'" y2="'+bline+'" class="line C2st" />'+
					//Effort
					'<rect x="'+(xL + 5)+'" y="'+height+'" width="'+avgeff_w +'" height="13" class="C0fl'+mde+'" />'+
					'<text x="'+(xL + (avgeff_w / 2) + 5)+'" y="'+text_y+'" text-anchor="middle" class="C2fl txttny">'+avgeff+'</text>'+
					//Last Found
					'<rect x="'+(xR - lstfnd_w - 5)+'" y="'+height+'" width="'+lstfnd_w+'" height="13" class="C0fl'+mde+'" />'+
					'<text x="'+(xR - (lstfnd_w / 2) - 5)+'" y="'+text_y+'" text-anchor="middle" class="C2fl txttny">'+lstfnd+'</text>'+
					'<rect x="'+(right_x - 9)+'" y="'+(text_y - 8)+'" width="14" height="9" class="C0fl'+mde+'" />'+
					'<text x="'+(right_x - 8)+'" y="'+text_y+'" class="C2fl txttny">'+Perc(currenteffort)+' '+$$['trn']['eff']+'</text>'+
					'<line x1="'+right_x+'" y1="'+($P['p'][0]['y'] + 1)+'" x2="'+right_x+'" y2="'+(text_y - 9)+'" class="line C2st" />'+
					'<line x1="'+xR+'" y1="'+bline+'" x2="'+(right_x - 10)+'" y2="'+bline+'" class="line C2st" />';
			}
			ins += '<text x="5" y="'+text_y+'" class="C2fl txttny">'+Ago($D['pool'][(pcnt_pt - 1)]['tme'], 'y')+'</text>';
		}
		
		//Current Block Dot
		ins += '<circle cx="'+right_x+'" cy="'+$P['p'][0]['y']+'" r="2" class="C1fl" />';
		
		//Block Tool Tip
		ins += GraphLib_ToolTipSetup();
		
		ins += '</svg><div id="GPop" class="pleft C0bk'+mde+' C1br hide"></div>';
		$C['NetGraph'].innerHTML = ins;
		if(netpop_open) Graph_NetPop(netpop_open);
		
		GraphLib_ToolTipListener();
	}
}
function Graph_NetPop(xid){
	var b = document.querySelector('.blockgroup[data-block="'+xid+'"]'),
		NetPop = document.getElementById('GPop'),
		clss = (b.getAttribute('cx') > (width / 2)) ? 'pleft' : 'pright',
		ins = '<table class="TDPadS txt C3'+mde+'"><tr>'+
			'<td><div class="txtmed">'+Ago($D['block'][xid]['tme'], 'y')+'</div><div class="pbar"></div><div class="txttny">'+$D['block'][xid]['eff']+' '+$$['tbl']['blockhistory']['eff']['lbl']+'</div></td>'+
			'<td><div class="txtmed">'+$D['block'][xid]['reward']+' '+$Q['cur']['sym']+'</div><div class="pbar"></div><div class="HashTrun txttny" data-hash="'+$D['block'][xid]['hash']+'"></div></td>'+
			'<td><div id="GPopConfirm" class="txtmed">--</div><div class="pbar"></div><div class="txttny">'+$$['tbl']['blockhistory']['height']['lbl']+' '+Num($D['block'][xid]['height'])+'</div></td>'+
		'</tr></table>'+
		'<div id="NetGraphClose" class="Btn16 Btn16Corner C1fl" data-block="'+xid+'">'+$I['x']+'</div>';

	NetPop.classList.remove('hide', 'pleft', 'pright');
	NetPop.classList.add(clss);
	NetPop.innerHTML = ins;
	HashTrun();
	
	api('netheight').then(function(){
		document.getElementById('GPopConfirm').innerHTML = BlockToGo($D['block'][xid]['height'], $D['block'][xid]['val']);
	}).catch(function(err){console.log(err)});
}
function Graph_Miner_init(){
	var m = document.getElementById('MinerGraph');
	if(m != null && addr && $A[addr]){
		m.innerHTML = $I['load'];
		if(isEmpty($A[addr]['stats'])){
			api('minershash').then(function(){
				Graph_Miner();
			}).catch(function(err){console.log(err)});
		}else{
			Graph_Miner();
		}
	}
}
function Graph_Miner(){
	var ins = '',
		height = 150,
		height_pad = 140,
		timefirst = 999999999999999,
		graphhrs = GraphLib_Duration(),
		timestart = now - (3600 * graphhrs),
		padR = 65,
		right_x = width - padR,
		$H = $A[addr]['stats'],
		i = 0,
		cnt = numObj($H),
		points = [],
		pts = '',
		avg = 0,
		max = 0,
		yL = 0,
		xR = right_x,
		yR = 0;

	i = cnt;
	while(i--){
		avg = avg + $H[i]['hsh'];
		if($H[i]['hsh'] > max) max = $H[i]['hsh'];
		if($H[i]['tme'] < timefirst) timefirst = $H[i]['tme'];
	}
	if(max > 0){
		if(timefirst >= timestart) timestart = timefirst;
		max = max * 1.2;
		avg = avg / cnt;
		
		//Create Points
		for(i = 0; i < cnt; i++){
			var x = Rnd(right_x - (now - $H[i]['tme']) * (right_x / (now - timestart)), 1),
				y = Rnd(height_pad - ($H[i]['hsh']) / max * height_pad, 1);
				
			points.push({'x':x, 'y':y, 'tme':$H[i]['tme'], 'hsh':$H[i]['hsh']});
			if(i === 0){
				yL = y;
			}else if(i === (cnt - 1)){
				yR = y;	
			}
		}	

		ins = '<svg viewBox="0 0 '+width+' '+height+'" class="chart">'+
			'<defs>'+
				'<linearGradient id="M"><stop offset="0%" stop-color="#'+$Q['clr']['secondary']+'" stop-opacity="0.2" /><stop offset="15%" stop-color="#'+$Q['clr']['secondary']+'" stop-opacity="0.3" /><stop offset="100%" stop-color="#'+$Q['clr']['secondary']+'" stop-opacity="1" /></linearGradient>'+
			'</defs>';
			
		//Grid Lines
		ins += GraphLib_Grid('line', 5, max, 0, height_pad, width, 'C2');
		
		//Miner Hash Line & Fill
		ins += '<path class="C0fl'+mde+'" stroke="url(#M)" stroke-width="2" d="M'+right_x+','+points[(cnt - 1)]['y']+' '+GraphLib_Bezier(points)+'M0,'+yR+' 0,'+(height + 3)+' '+(width + 3)+','+(height + 3)+' '+(width + 3)+','+yL+'" />';
		
		//Miner Hash Lables with Vertical Adjust
		var hsh = HashConv($H[0]['hsh']), hs_y = yL + 2, lb_y = yL + 11;
		if(yL > (height_pad * .8)){
			hs_y = yL;
			lb_y = yL - 17;
		}
		ins += '<text x="'+(right_x + 4)+'" y="'+hs_y+'" class="txtmed C3fl'+mde+'">'+Rnd(hsh['num'], 1, 'txt')+' '+hsh['unit']+'</text>'+
		'<text x="'+(right_x + 4)+'" y="'+lb_y+'" class="txttny C3fl'+mde+' o7">Your Hash</text>';
		
		//Miner Hash Dots
		for (var i = 0; i < points.length; i++){
			if(i !== 0 && points[i]['x'] > 50){
				ins += '<circle cx="'+points[i]['x']+'" cy="'+points[i]['y']+'" r="2" class="C2fl o8" />'+
					'<circle cx="'+points[i]['x']+'" cy="'+points[i]['y']+'" r="4" class="ToolTip C1fl_hov" data-tme="'+points[i]['tme']+'" data-hsh="'+points[i]['hsh']+'" />';
			}
		}

		//MinerHash Avg
		var avg_y = Rnd(height_pad - avg / max * height_pad, 2),
			avg_h = HashConv(avg),
			txt = avg_h['num']+' '+avg_h['unit']+' Avg '+Ago(timestart),
			txt_w = txt.length * 5.4;
			
		ins += '<line x1="55" y1="'+avg_y+'" x2="'+right_x+'" y2="'+avg_y+'" class="mineravgline C1st" />'+
			'<rect x="'+((width / 2) - (txt_w / 2))+'" y="'+(avg_y - 8)+'" width="'+txt_w+'" height="18" rx="3" class="line C0fl'+mde+' C1st" />'+
			'<text id="MinerGraphAvg" data-hsh="'+avg+'" x="'+(width / 2)+'" y="'+(avg_y + 4)+'" text-anchor="middle" class="C2fl txttny">'+txt+'</text>';

		//Grid Labels
		ins += GraphLib_Grid('lbl', 5, max, 0, height_pad, width, 'C2');
		ins += '<text x="5" y="'+height_pad+'" class="txttny C2fl o9">0</text>';
		
		//Block Tool Tip
		ins += GraphLib_ToolTipSetup();
		ins += '</svg>';
		document.getElementById('MinerGraph').innerHTML = ins;
		Dash_calc();
		GraphLib_ToolTipListener();
	}else{
		ErrAlert('MinerGraph', 'NoData');
		ins = '<div id="MinerGraphAlert" class="txtmed C2 o5">'+$$['msg']['addr_nodat']['head']+'</div>';
	}
}
function Graph_Worker(xid){
	var WorkerChart = document.querySelector('.WorkerChart[data-worker="'+xid+'"]'),
		width = WorkerChart.clientWidth,
		width3 = width + 3,
		height = 26,
		height3 = 29,
		i = 0,
		max = 0,
		$W = $A[addr]['wrkrs'][xid]['stats'],
		wcnt = numObj($W),
		points = [],
		yL = 0,
		yR = 0,
		mintime = 99999999999,
		ins = '<svg viewBox="0 0 '+width+' '+height+'" class="chart">'+
			'<defs>'+
				'<linearGradient id="F" gradientTransform="rotate(90)"><stop offset="0%" stop-color="#000" stop-opacity="0.07" /><stop offset="100%" stop-color="#000" stop-opacity="0.03" /></linearGradient>'+
			'</defs>';
		
	for(i = 0; i < wcnt; i++){
		if($W[i]['hsh'] > max) max = $W[i]['hsh'];
		if($W[i]['tme'] < mintime) mintime = $W[i]['tme'];
	}
	if(max > 0){
		for(i = 0; i < wcnt; i++){
			var x = Rnd(width - (now - $W[i]['tme']) * (width / (now - mintime)), 1),
				y = Rnd(height - $W[i]['hsh'] * (height / max), 1);
				
			points.push({'x':x, 'y':y});
			if(i === 0){
				yR = y;
			}else if(i === (wcnt - 1)){
				yL = y;
			}
		}
		ins += '<path fill="url(#F)" stroke-width="1.25" class="C2st" d="'+GraphLib_Bezier(points)+'M-3,'+yL+' -3,'+height3+' '+width3+','+height3+' '+width3+','+yR+'" />';		
	}
	WorkerChart.innerHTML = ins+'</svg>';
}
function GraphLib_Duration(){
	var h = $Q['graph']['hrs'];
	if(width < 600){
		h = h / 2.5;
	}else if(width < 800){
		h = h / 2;
	}else if(width < 1200){
		h = h / 1.5;
	}
	return h;
}
function GraphLib_Grid(m, num, max, min, h, w, cls){
	var r = '';
	if(max > 0){
		var yrt = (max - min) / num, clss = (cls === 'C2') ? '' : mde;
		for(var y = (num - 1); y >= 1; y--){
			var	ylc = Rnd(h - (yrt * y / ((max - min) / h)), 1);
			if(m === 'line'){
				r += '<line x1="50" y1="'+ylc+'" x2="'+w+'" y2="'+ylc+'" class="line '+cls+'st'+clss+' o8" />';
			}else if(m === 'lbl'){
				var yln = HashConv(yrt * y);
				r += '<text x="5" y="'+(ylc + 3)+'" class="'+cls+'fl'+clss+' txttny">'+yln['num']+' '+yln['unit']+'</text>';
			}
		}
	}
	return r;	
}
function GraphLib_ToolTip(el, sts){
	var svg = el.closest('svg.chart'),
		$R = {'Tip_Val':{'x':0, 'y':999, 'i':''}, 'Tip_Tme':{'x':0, 'y':999, 'i':''}, 'Tip_ValBx':{'x':0, 'y':999, 'w':''}, 'Tip_TmeBx':{'x':0, 'y':999}};
		t_x = parseFloat(el.getAttribute('cx')),
		t_y = parseFloat(el.getAttribute('cy')) + 2,
		tme = parseInt(el.getAttribute('data-tme')),
		t_v = '',
		offset = 0;
		
	if(sts === 'open'){
		if(el.getAttribute('data-eff')){
			t_v = el.getAttribute('data-eff')+'%';
			offset = 9;
		}else if(el.getAttribute('data-hsh')){
			var tv = HashConv(el.getAttribute('data-hsh'));
			t_v = tv['num']+' '+tv['unit'];
		}

		var tmeago = Ago(tme, 'y')+' '+Time(tme),
			v_wid = t_v.length * 6 + offset,
			t_wid = tmeago.length * 5.9 - 3;

		$R = {
			'Tip_Val':{'x':(t_x - (v_wid / 2) - 6), 'y':t_y, 'i':t_v},
			'Tip_ValBx':{'x':(t_x - v_wid - 6), 'y':(t_y - 11), 'w':v_wid},
			'Tip_Tme':{'x':(t_x + 7 + (t_wid / 2)), 'y':t_y, 'i':tmeago},
			'Tip_TmeBx':{'x':(t_x + 7), 'y':(t_y - 11), 'w':t_wid}
		};
	}
	for(var k in $R){
		var e = svg.querySelector('.'+k);

		if(e){
			e.setAttribute('x', $R[k]['x']);
			e.setAttribute('y', $R[k]['y']);
			
			if($R[k]['w']) e.setAttribute('width', $R[k]['w']);
			if($R[k]['i']) e.innerHTML = $R[k]['i'];
		}
	}
}
function GraphLib_ToolTipSetup(){
	return '<rect x="0" y="-999" width="9" height="15" rx="3" class="Tip_ValBx C1st C0fl'+mde+'" />'+
			'<text x="0" y="-999" text-anchor="middle" class="Tip_Val C2fl txttny"></text>'+
			'<rect x="0" y="-999" width="9" height="15" rx="3" class="Tip_TmeBx C1st C0fl'+mde+'" />'+
			'<text x="0" y="-999" text-anchor="middle" class="Tip_Tme C2fl txttny"></text>';
}
function GraphLib_ToolTipListener(){
	var b = document.getElementsByClassName('ToolTip');
	for(i = 0; i < b.length; i++){
		b[i].addEventListener('mouseenter', function(){
			GraphLib_ToolTip(this, 'open');
		}, false);
		b[i].addEventListener('mouseleave', function(){
			GraphLib_ToolTip(this, 'close');
		}, false);
	}
}
function GraphLib_Bezier(p){
	var h = '';
	if(p && p.length > 0){
		var r = [];
		h = 'M'+p[0].x+', '+p[0].y+' ';
		for (var i = 0; i < p.length - 1; i++) {
			var a = [], b = [];
			a.push({x:p[Math.max(i - 1, 0)].x, y:p[Math.max(i - 1, 0)].y});
			a.push({x:p[i].x, y:p[i].y});
			a.push({x:p[i + 1].x, y: p[i + 1].y});
			a.push({x:p[Math.min(i + 2, p.length - 1)].x, y:p[Math.min(i + 2, p.length - 1)].y});
			b.push({x:((-a[0].x + 6 * a[1].x + a[2].x) / 6), y:((-a[0].y + 6 * a[1].y + a[2].y) / 6)});
			b.push({x:((a[1].x + 6 * a[2].x - a[3].x) / 6), y:((a[1].y + 6 * a[2].y - a[3].y) / 6)});
			b.push({x:a[2].x, y:a[2].y});
			r.push(b);
		}
		for(var i = 0; i < r.length; i++){
			h += 'C'+Rnd(r[i][0].x, 1)+','+Rnd(r[i][0].y, 1)+' '+Rnd(r[i][1].x, 1)+','+Rnd(r[i][1].y, 1)+' '+Rnd(r[i][2].x, 1)+','+Rnd(r[i][2].y, 1)+' ';
		}	
	}
    return h;
}
//Helpers
function Localize(){
	var brwlng = window.navigator.userLanguage || window.navigator.language;
	if(brwlng){
		var b = brwlng.split('-');
		
		if(brwlng === 'fr-CA' || ['AL','AR','AT','BY','BE','BO','BR','BG','CL','CO','CR','CU','CY','CZ','DK','EC','EE','FI','FR','DE','GR','GL','HU','IS','ID','IT','LV','LB','LT','MA','NL','NO','PE','PL','PT','RO','RU','RS','SK','SI','ES','SE','CH','TR','UA','UY','VE','VN'].indexOf(b[1]) > -1){
			$L['dec'] = ',';
		}else if(['IE','MY','PH','SG','TW'].indexOf(b[1]) > -1){
			$L['dec'] = '·';
		}
		if(brwlng === 'fr-BE' || brwlng === 'fr-CA' || ['AL','AU','BG','CZ','EE','FI','FR','HU','LV','LT','NO','PE','PL','PT','RU','SK','ZA','SE','CH','UA','LK'].indexOf(b[1]) > -1){
			$L['thou'] = ' ';
		}else if(brwlng === 'de-BE' || ['AR','AT','BA','BR','CL','CO','CR','HR','DK','DE','GR','ID','IT','NL','RO','SI','ES','TR','VN'].indexOf(b[1]) > -1){
			$L['thou'] = '.';
		}
		if(b[0] === 'en' || b[0] === 'he' || ['CN','CZ','IT','RU'].indexOf(b[1]) > -1){
			$L['perc'] = '9%';
		}else if(b[1] === 'TR'){
			$L['perc'] = '%9';
		}
		if(b[0] === 'fr'){
			$L['tme'] = 'ghi';
		}else if(b[1] === 'DE'){
			$L['tme'] = 'g.i';
		}else if(brwlng === 'en-CA' || ['AU','BD','EG','IE','IN','MY','MT','MX','NZ','PK','PH','GB','US'].indexOf(b[1]) > -1){
			$L['tme'] = 'g:i A';
		}
	}
}
function isEmpty(o){
	return (o && Object.entries(o).length === 0 && o.constructor === Object) ? true : false;
}
function numObj(o){
    return (o && typeof o === 'object' && o !== null) ? Object.keys(o).length : 0;
}
function Ago(tme, lbl){
	var t = now - parseInt(tme), r = 0;
	if(t < 60){
		t = t+' Sec';
	}else if(t <= 3600){
		t = Rnd(t / 60)+' Min';
	}else if(t <= 86400){
		r = Rnd(t / 60 / 60);
		t = r+' Hr';
		if(r > 1) t += 's';
	}else{
		r = Rnd(t / 60 / 60 / 24);
		t = r+' Day';
		if(r > 1) t += 's';
	}
	if(lbl === 'y') t += ' Ago';
	return t;
}
function Time(tme){
	var r = '';
	if(tme > 1){
		r = $L['tme'];
		var date = new Date(tme * 1000),
			hr24 = date.getHours(),
			hr12 = hr24,
			min = '0'+date.getMinutes(),
			ap = 'am';
		
		if(hr12 >= 12){
			hr12 = hr12 - 12;
			ap = ' pm';
		}
		r = r.replace('g', hr12);
		r = r.replace('G', hr24);
		r = r.replace('i', min.substr(-2));
		r = r.replace('A', ap);
	}
	return r;
}
function Perc(n){
	return $L['perc'].replace('9', n);
}
function Num(n){
	n = n || 0;
	return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1'+$L['thou']);
}
function NumInput(n){
	n = n || 0;
	if(n.indexOf($L['dec']) !== -1){
		var na = n.split($L['dec']);
		n = na[0].replace(/[^\d]/g, '')+'.'+na[1].replace(/[^\d]/g, '');
	}else{
		n = n.replace(/[^\d]/g, '')+'.0';
	}
	return parseFloat(n);
}
function Rnd(n, dec, m){
	if(dec >= 1){
		var d = Math.pow(10, dec);
		n = Math.round(n * d) / d;
		if(m === 'txt'){
			n = n.toFixed(dec);
			if($L['dec'] !== '.') n = n.replace('.', $L['dec']);
		}
	}else{
		n = Math.round(n);
	}
	return n;
}
function HashTrun(typ){
	document.querySelectorAll('.HashTrun').forEach(function(h){
		var hsh = h.getAttribute('data-hash'),
			exp = (typ === 'tx') ? $Q['explorertx'] : $Q['explorer'],
			txt = hsh,
			fit = Math.floor(h.clientWidth / 7.02 / 2);
			
		if(hsh.length > (fit * 2)) txt = hsh.substring(0, (fit - 1))+'...'+hsh.slice((2 - fit));
		h.innerHTML = '<a href="'+exp+hsh+'" target="_blank" class="C1 hov">'+txt+'</a>';
	});
}
function HashConv(h){
	h = (h > 0) ? h : 0;
	var u = '/s';
	for(var k in $D['hashconv']){
		if(h >= $D['hashconv'][k]){
			h = h / $D['hashconv'][k];
			u = k+u;
			break;
		}
	}
	if(h === 0) u = 'H/s'
	return {'num':Rnd(h, 1), 'unit':u};
}
function BlockToGo(h, sts){
	if(sts === 'f'){
		return '<span class="C4">Invalid</span>';
	}else{
		var b = 60 - ($D['netheight'] - h);
		return (b <= 0) ? $$['trn']['conf'] : b+' To Go';
	}
}
function SynchTime(t){
	if(t > now) now = t + 3;
}
function Truncate(s, l){
	return (s && s.length > 0 && l > 0) ? s.length > l ? s.substring(0, l - 3)+ '...' : s : s;
}
function UrlVars(){
    var v = [], h, p = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < p.length; i++){
        h = p[i].split('=');
        v.push(h[0]);
        v[h[0]] = h[1];
    }
    return v;
}
function removeElement(id){
    var e = document.getElementById(id);
    if(e) return e.parentNode.removeChild(e);
}
function setCookie(n, v){
    var d = new Date();
	d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    document.cookie = cookieprefix+n+'='+(v || '')+'; expires='+d.toUTCString()+'; path=/';
}
function getCookie(n){
    var nEQ = cookieprefix+n+'=',
		ca = document.cookie.split(';');
		
    for(var i = 0; i < ca.length; i++){
        var c = ca[i];
        while(c.charAt(0)==' ') c = c.substring(1,c.length);
        if(c.indexOf(nEQ) == 0) return c.substring(nEQ.length,c.length);
    }
    return null;
}
function delCookie(n){   
    document.cookie = n+'=; Max-Age=-99999999;';  
}