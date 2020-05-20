var	mde = 'l',
	$Q = {
		'pool':{
			'nme':'MoneroOcean',										//also sets the cookie prefix
		},
		'clr':{
			'main':'196b6b',										//C1
			'secondary':'818181',									//C2
			'back-l':'196b6b',										//C0 - light
			'back-d':'313131'	   									//C0 - dark
		},
		'cur':{
			'nme':'Monero',						
			'sym':'XMR',
			'conf': 30,	// blocks needed to mature
			'port': 18081,
			'reg':/^[4|8]{1}([A-Za-z0-9]{105}|[A-Za-z0-9]{94})$/	//address regex
		},
		'api':'https://api.moneroocean.stream/',
		'fiat_name': 'usd',
		'fiat_symbol': '$',
		'news':false,												//enable news (motd) alerts on homepage
		'email':true,												//enable email notifications
		'timer':60,													//refresh timer in seconds
		'graph':{
			'hrs':72,												//max chart length in hours
			'pplns':false,											//show pplns window on chart
		},
		'pay':{
			'min_auto':0.003,										//minimum for automatic threshold
			'def_auto':0.3,											//minimum for automatic threshold
			'max_fee':0.0004,										//max fee (for min_auto)
			'zero_fee_pay':4,										//theshold that makes fee to be zero
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
		page_sizes: [15, 50, 100],
		'hlp':{
			'head':'Welcome to '+$Q.pool.nme,
			'text':'Getting started is easy and this pool has a large and friendly community that are happy to help you. The pool operator can be reached in the <a href="https://discordapp.com/invite/jXaR2kA" class="C1 hov">Discord</a>, <a href="https://twitter.com/MoneroOcean" class="C1 hov">Twitter</a> or at <a href="mailto:support@moneroocean.stream" class="C1 hov">support@moneroocean.stream</a>. Please be patient and someone will get back to you. Most of the time help can be found quicker in the chat. The pool has a quite stable and knowlegable community - you can join the chat and seek help and a friendly chat there :)'
		},
		'msg':{
			'addr_invalid':{'head':'Invalid '+$Q.cur.nme+' Address', 'text':'Double check that your address is complete.'},
			'addr_nodata':{'head':'No Data', 'text':''}
		},
		'nav':{
			'home':'Home',
			'coins':'Coins',
			'blocks':'Blocks',
			'payments':'Payments',
			'help':'Help'
		},
		'pay':{
			'DashPending':{'lbl':'<span id="PendingPay"></span> '+$Q.cur.sym+' Pending', 'var':'due'},
			'DashPaid':{'lbl':$Q.cur.sym+' Paid', 'var':'paid'}
		},
		'wm':{
			'on':  'Web minining: <span id="WebMinerHash">--</span>',
			'off': 'Run Web Miner',
		},
		'sts': function() { return {
			'MinerWorkerCount':	'<div id="WebMinerBtn" class="BtnElem C0'+mde+' txttny C1bk C2bk_hov"></div>',
			'MinerHashes':		'Your <select id="HashSelect"></select> Hashrate',
			'MinerShares':		'Shares (Hashes: <span id="TotalHashes">--</span>)',
			'MinerCalc': 		'<input type="text" id="MinerCalcHsh" size="3" /><select id="MinerCalcUnit"></select><select id="MinerCalcFld"></select>',
		}},
		'stsw': function() { return { // For worker
			'MinerHashes': 		'Total Hashes',
			'MinerShares': 		'Valid / Invalid Shares',
		}},
		'tbl':{
			'coins':[
				{'name':'name', 'lbl':'Name', 'cls':'min'},
				{'name':'algo', 'lbl':'Algo', 'cls':'min'},
				{'name':'profit', 'lbl':'Profit', 'tooltip':'Profit per hash in percent', 'cls':'min'},
				{'name':'eff', 'lbl':'Effort', 'tooltip':'Current block effort in percent', 'cls':'min'},
				{'name':'reward_perc', 'lbl':'Reward', 'tooltip':'Block reward in percent', 'cls':'min'},
				{'name':'accounts', 'lbl':'Accounts', 'tooltip':'Account (Wallet) Count', 'cls':'min'},
				{'name':'poolhashrate', 'lbl':'Hashrate', 'tooltip':'Pool hashrate', 'cls':'min'},
				{'name':'worldhashrate', 'lbl':'World Hash', 'tooltip':'Coin world hashrate', 'cls':'min'},
				{'name':'height', 'lbl':'Top Height', 'cls':'min'},
				{'name':'pplns', 'lbl':'PPLNS', 'tooltip':'Share in last block PPLNS window in percent', 'cls':'min'},
				{'name':'notes', 'lbl':'Notes', 'cls':'trunc'},
			],
			'blocks':[
				{'name':'num', 'lbl':'#', 'cls':'min'},
				{'name':'tme', 'lbl':'Found', 'cls':'min'},
				{'name':'coin', 'lbl':'Coin', 'cls':'min'},
				{'name':'eff', 'lbl':'Effort', 'cls':'min'},
				{'name':'reward', 'lbl':'Raw reward', 'tooltip':'Raw block reward in native coin units', 'cls':'min'},
				{'name':'payment', 'lbl':'Payment ('+$Q.cur.sym+')', 'cls':'min'},
				{'name':'height', 'lbl':'Height', 'cls':'min'},
				{'name':'hash', 'lbl':'Transaction', 'typ':'block', 'cls':'trunc'},
			],
			'poolpay':[
				{'name':'tme', 'lbl':'Payment Sent', 'cls':'min'},
				{'name':'payees', 'lbl':'Payees', 'cls':'min'},
				{'name':'amnt', 'lbl':'Amount ('+$Q.cur.sym+')', 'cls':'min'},
				{'name':'fee', 'lbl':'Fee ('+$Q.cur.sym+')', 'cls':'min'},
				{'name':'hash', 'lbl':'Transaction', 'typ':'tx', 'cls':'trunc'},
			],
			'pay':[
				{'name':'tme', 'lbl':'Payment Sent', 'cls':'min'},
				{'name':'amnt', 'lbl':'Amount ('+$Q.cur.sym+')', 'cls':'min'},
				{'name':'hash', 'lbl':'Transaction', 'typ':'tx', 'cls':'trunc'},
			]
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
			'set':'Update threshold',
			'updt':'Threshold updated',
			'vwpy':'Show Your Payments'
		}
	};

var COINS = {
	18081: {
		name: "XMR",
		divisor: 1000000000000,
		url: "https://xmrchain.net",
		time: 120,
	},
	18181: {
		name: "XMC",
		divisor: 1000000000000,
		url: "http://explorer.monero-classic.org",
		time: 120,
	},
	19734: {
		name: "SUMO",
		divisor: 1000000000,
		url: "https://explorer.sumokoin.com",
		time: 240,
	},
	12211: {
		name: "RYO",
		divisor: 1000000000,
		url: "https://explorer.ryo-currency.com",
		time: 240,
	},
	18981: {
		name: "GRFT",
		divisor: 10000000000,
		url: "https://blockexplorer.graft.network",
		time: 120,
	},
	38081: {
		name: "MSR",
		divisor: 1000000000000,
		url: "https://explorer.getmasari.org",
		time: 60,
	},
	48782: {	
		name: "LTHN",
		divisor: 100000000,
		url: "https://lethean.io/explorer",
		time: 120,
	},
	34568: {
		name: "WOW",
		divisor: 100000000000,
		url: "http://explore.wownero.com",
		time: 300,
	},
	19281: {
		name: "XMV",
		divisor: 100000000000,
		url: "https://explorer.monerov.online",
		time: 60,
		unit: "G",
		factor: 16,
	},
	19950: {
		name: "XWP",
		divisor: 1000000000000,
		url: "https://explorer.xwp.one",
		time: 15,
		unit: "G",
		factor: 32,
	},
	11181: {
		name: "AEON",
		divisor: 1000000000000,
		url: "https://aeonblockexplorer.com",
		time: 240,
	},
	17750: {
		name: "XHV",
		divisor: 1000000000000,
		url: "https://explorer.havenprotocol.org",
		time: 120,
	},
	20206: {
		name: "DERO",
		divisor: 1000000000000,
		url: "https://explorer.dero.io",
		time: 27,
	},
	13102: {
		name: "XTA",
		divisor: 1000000000000,
		url: "https://explorer.italo.network",
		time: 120,
	},
	24182: {
		name: "TUBE",
		divisor: 100000000,
		url: "https://explorer.ipbc.io",
		time: 120,
	},
	20189: {
		name: "XLA",
		divisor: 100,
		url: "https://explorer.scalaproject.io",
		time: 300,
	},
	22023: {
		name: "LOKI",
		divisor: 1000000000,
		url: "https://lokiblocks.com",
		time: 120,
	},
	33124: {
		name: "XTNC",
		divisor: 1000000000,
		url: "https://explorer.xtendcash.com",
		time: 120,
		unit: "G",
		factor: 32,
	},
	11898: {
		name: "TRTL",
		divisor: 100,
		url: "https://explorer.turtlecoin.lol",
		time: 30,
	},
	13007: {
		name: "IRD",
		divisor: 100000000,
		url: "https://explorer.ird.cash",
		time: 175,
	},
	19994: {
		name: "ARQ",
		divisor: 1000000000,
		url: "https://explorer.arqma.com",
		time: 120,
	},
};

/*--------------------------------------*/
/*-----End of Customization Section------- (You can customize the rest, but shouldn't need to) */
/*--------------------------------------*/

var addr = UrlVars().addr || '',
	pref = 'LNA',
	mport = $Q.cur.port, // shortcut
	cookieprefix = $Q.pool.nme.replace(/[ ,;]/g, ''),
	resizeTimer,
	updateTimer = $Q.timer,
	updateCounter,
	outoffocus = 0,
	now = Rnd((new Date()).getTime() / 1000),
	width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
	netpop_open = '',
	miner_setup_open = false,
	blocks_page_size	= 15,
	poolpay_page_size 	= 15,
	blocks_port		= mport,
	$WM = { 			//Web Miner
		'enabled': false,
		'addr': '',
		'prev_hashes': 0,
		'status_timer': false,
		'update_sec': 2,
	},
	$A = {},			//Account Memory
	$C = {				//Selector Cache
		'TogMode':'',
		'Timer':'',
		'NetStats':'',
		'Addr':'',
		'Stage':'',
		'DashPayBtn':'',
		'AddrField':'',
		'TimerPie':'',
		'TimerText':'',
		'TimerRefresh':''
	},
	$U = {				//Update Times
		'netstats':0,
		'poolstats':0,
		'news':0
	},
	$P = {},			//Promise cache
	$L ={				//Localization
		'perc':'9 %',
		'thou':',',
		'dec':'.',
		'tme':'G:i'
	},
	$D = {				//Data Digests
		'news':{},
		'coins':[[]],
		'blocks':[],
		'poolpay':[],
		'poolstats':{},
		'pay':{},
		'netstats':{},
		'hashconv':{
			'TH':1000000000000,
			'GH':1000000000,
			'MH':1000000,
			'KH':1000,
			'H':1
		},
		miner_hash_avg:0,	//Average miner graph number is stored here
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
	$I.load = '<div class="LoadCon C1fl o9 Loader">'+$I.loadico+'</div>';

//Event Binding
window.addEventListener('resize', function(){Resize()});

document.body.addEventListener('change', function(e){
	var id = [
		'#HeadMenu select', '#TblPagBox', '#AddrField', '#AddrRecent select', '#MinerCalcHsh', '#MinerCalcUnit', '#MinerCalcFld',
		'#HashSelect', '#PageSize', '#BlockType', '#AutoPayFld'
	];
	for(var i = 0; i < id.length; i++){
		var el = e.target.matches(id[i]);
		if(el){
			if(id[i] === '#HeadMenu select'){
				Navigate(document.querySelector(id[i]).value);
			}else if(id[i] === '#TblPagBox'){
				var pge = parseInt(e.target.value.replace(/\D/g,''));
				switch (e.target.getAttribute('data-func')) {
					case 'blocks':  dta_Blocks(pge);   break;
					case 'poolpay': dta_Payments(pge); break;
				}
			}else if(id[i] === '#AddrField' || id[i] === '#AddrRecent select'){	
				addr = document.querySelector(id[i]).value;
				SaveAddr(addr, 'add');
			}else if(id[i] === '#MinerCalcHsh' || id[i] === '#MinerCalcUnit' || id[i] === '#MinerCalcFld'){
				Dash_calc();
			}else if(id[i] === '#HashSelect'){
				Dash_load('refresh');
			}else if(id[i] === '#PageSize'){
				var ps = parseInt(document.querySelector(id[i]).value);
				switch (document.getElementById('TblPagBox').getAttribute('data-func')) {
					case 'blocks':  blocks_page_size  = ps; dta_Blocks(1);   break;
					case 'poolpay': poolpay_page_size = ps; dta_Payments(1); break;
				}
			}else if(id[i] === '#BlockType'){
				blocks_port = parseInt(document.querySelector(id[i]).value);
				dta_Blocks(1);
			}else if(id[i] === '#AutoPayFld'){
				AutoPayCheck();
			}
		}
	}
}, false);
document.body.addEventListener('click', function(e){
	var id = [
		'#TogMode','#Timer', '#DashPayBtn', '#NetGraphClose', '#NewsClose', '#AutoPayBtn', '#PaymentHistoryBtn', '#WebMinerBtn',
		'#PaymentHistoryBtnClose', '#EmailSubscribeBtn', '#AddrDelete', '#WorkerPopClose', '#WorkerSortName', '#WorkerSortRate',
		'#MinerSetupShowBtn', '#MinerSetupHideBtn', '#WinCmdTextArea', '#LinCmdTextArea',
		'.nav', '.PagBtn', '.Worker', '.blockgroup', '.helptitle'
	];
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
				setCookie('News', $D.news.created);
			}else if(id[i] === '#AutoPayBtn'){
				AutoPay();
			}else if(id[i] === '#PaymentHistoryBtn'){
				MinerPaymentHistory(1);
			}else if(id[i] === '#PaymentHistoryBtnClose'){
				MinerPayments('back');
			}else if(id[i] === '#EmailSubscribeBtn'){
				EmailSubscribe();
			}else if(id[i] === '#WebMinerBtn'){
				WebMiner();
			}else if(id[i] === '#MinerSetupShowBtn'){
				MinerSetupScriptsBtn(true);
			}else if(id[i] === '#MinerSetupHideBtn'){
				MinerSetupScriptsBtn(false);
			}else if(id[i] === '#WinCmdTextArea'){
				document.getElementById('WinCmdTextArea').select();
				document.execCommand("copy");
			}else if(id[i] === '#LinCmdTextArea'){
				document.getElementById('LinCmdTextArea').select();
				document.execCommand("copy");
			}else if(id[i] === '#AddrDelete'){
				SaveAddr($C.AddrField.value, 'del');
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
				var p = parseInt(el.getAttribute('data-page'));
				switch (el.getAttribute('data-func')) {
					case 'blocks':  dta_Blocks(p);  break;
					case 'poolpay': dta_Payments(p); break;
					case 'pay':     MinerPaymentHistory(p); break;
				}
			}else if(id[i] === '.Worker'){
				Workers_detail(el.getAttribute('data-key'));
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
	$C.TimerRefresh.classList.remove('hide');
};
document.getElementById('Timer').onmouseout = function(e){
	$C.TimerRefresh.classList.add('hide');
};

function init(){
	Localize();
	
	//Cache Selectors
	var k = Object.keys($C), i = k.length;
	while(i--){
		$C[k[i]] = document.getElementById(k[i]);
	}
	
	//Populate Icons
	$C.TogMode.innerHTML = $I.d;
	$C.TimerRefresh.innerHTML = $I.refresh;
	document.getElementById('TimerLoader').innerHTML = $I.load;
	document.querySelector('#HeadMenu .select-point').innerHTML = $I.arrow;
	document.getElementById('AddrDelete').innerHTML = $I.delete;
	document.querySelector('#AddrRecent .select-point').innerHTML = $I.arrow;
	document.getElementById('DashPendingLbl').innerHTML = $$.pay.DashPending.lbl;
	document.getElementById('DashPaidLbl').innerHTML = $$.pay.DashPaid.lbl;
	Dash_btn('loading');
	TimerLoading('on');

	//Load Menu
	var i = 0, mn = '', ft = '';
	for(var m in $$.nav){
		mn += '<option value="'+m+'">'+$$.nav[m]+'</option>';
		if(i !== 0) ft += ' &middot; ';
		ft += '<span class="nav" data-tar="'+m+'">'+$$.nav[m]+'</span>';
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
		$C.AddrField.value = addr;
		$C.AddrField.blur();
	}else{
		$C.AddrField.setAttribute('placeholder', 'Your '+$Q.cur.nme+' Address...');
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
		$C.TimerText.innerHTML = updateTimer;
		if(n != null) n.classList.remove('o3');
		if(m != null) m.classList.remove('o3');
		if(w != null) w.classList.remove('o3');
		if(a != null && a.parentNode != null) a.parentNode.removeChild(a);
	}else{
		var msg = '',
			iserr = 'C4',
			err_msg = 'Try refreshing, check your connection; otherwise we\'ll be back up soon.';
		
		if(tar === 'NetStats'){
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
			$C.TimerText.innerHTML = '<div class="C4fl">'+$I.x+'</div>';
			$C.TimerRefresh.classList.add('hide');
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
			var clr = (mde === 'd') ? $Q.clr['back-d'] : $Q.clr['back-l'],
				grd = 'linear-gradient('+(-90 + (360 * updateTimer / $Q.timer))+'deg, transparent 50%, #25abf0';
				
			if(updateTimer < ($Q.timer / 2)) grd = 'linear-gradient('+(90 + (360 * updateTimer / $Q.timer))+'deg, transparent 50%, #'+clr;
			$C.TimerPie.style.backgroundImage = grd+' 50%),linear-gradient(90deg, #'+clr+' 50%, transparent 50%)';
			$C.TimerText.innerHTML = updateTimer;
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
	switch (document.querySelector('#HeadMenu select').value) {
		case 'home': {
			var l = document.getElementById('MinerHashes');
			if (l) {
				var typ = (l.innerHTML !== '--') ? 'refresh' : '';
				Dash_load(typ);
			}
		} break;
		case 'coins':    dta_Coins(); break;
		case 'blocks':   dta_Blocks(parseInt(document.getElementById('TblPagBox').value.replace(/\D/g,''))); break;
		case 'payments': dta_Payments(parseInt(document.getElementById('TblPagBox').value.replace(/\D/g,''))); break;
	}

	api('netstats').then(function(){
		api('poolstats').then(function(){
			ErrAlert('X');
                        document.getElementById('WorldHash').innerHTML  = HashConvStr(difficultyToHashRate($D.netstats.difficulty, mport));
			document.getElementById('PoolHash').innerHTML   = '<span class="nav" data-tar="coins">' + HashConvStr($D.poolstats.hashRate) + '</span>';
			document.getElementById('CurrEffort').innerHTML =
				'<span title="' + $D.poolstats.roundHashes  + ' / ' + $D.netstats.difficulty + '" class="nav" data-tar="coins">' +
				Rnd(100 * $D.poolstats.roundHashes / $D.netstats.difficulty, 2, 'txt') + "%</span>";
			document.getElementById('BlockCount').innerHTML =
				'<span title="' + $D.poolstats.totalBlocksFound + ' ' + $Q.cur.nme + ' blocks and ' + $D.poolstats.totalAltBlocksFound + ' altcoin blocks" class="nav" data-tar="blocks">' +
				($D.poolstats.totalBlocksFound + $D.poolstats.totalAltBlocksFound) + '</span>';
			document.getElementById('AccountCount').innerHTML = $D.poolstats.miners;
			document.getElementById('PaymentsMade').innerHTML = '<span class="nav" data-tar="payments">' + $D.poolstats.totalPayments + '</span>';
			updateTimer = $Q.timer;
			$C.TimerText.innerHTML = updateTimer;
			LoadTimer();
		}).catch(function(err){ErrAlert('NetStats', '')});
	}).catch(function(err){ErrAlert('NetStats', '')});

	if($Q.news){
		var n = document.getElementById('News'), c = document.getElementById('NewsCard'), h = '';
		if(n != null && c.innerHTML === ''){
			api('news').then(function(){
				if($D.news && $D.news.created){
					if(getCookie('News') == $D.news.created){
						h = 'hide';
					}else{
						c.innerHTML = '<div class="txtmed">'+$D.news.subject+'<div id="NewsTime" class="txttny noselect">('+AgoTooltip($D.news.created, 'y')+')</div></div>'+
							'<div id="NewsBody" class="txt">'+$D.news.body.replace(/^(<br>)/,'')+'</div>'+
							'<div id="NewsClose" class="Btn32 Btn32Corner C1fl">'+$I.x+'</div>';
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
		Graph_Miner_init();
		Workers_init();
		var p = document.getElementById('MinerPaymentsPage');
		if(p != null) MinerPaymentHistory(p.value);
	}, 250);
}
function SwitchMode(){
	var $CL = ['C0','C0fl','C0bk','C0st','C3','C3fl','FLD'],
		$clr = {'l':{'f':'454545','b':'efefef'},'d':{'f':'b3b3b3','b':'3b3b3b'}},
		bt = (mde === 'd') ? 'l' : 'd',
		i = $CL.length;
		
	$C.TogMode.innerHTML = $I[bt];
	while(i--){
		document.querySelectorAll('.'+$CL[i]+bt).forEach(function(x){
			x.classList.add($CL[i]+mde);
			x.classList.remove($CL[i]+bt);
		});
	}
	document.querySelector('meta[name=theme-color]').setAttribute('content', '#'+$clr[mde].b);
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
	$C.AddrField.value = (m === 'del') ? fst : adr;
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
		ins = '<option value="">'+$$.trn.rcnt+'</option>';
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
	$C.Stage.className = '';
	document.querySelectorAll('.nav').forEach(function(x){
		x.classList.remove('o5');
	});
	setTimeout(function(){
		var n = '', m = 'StageFade', h = '', d = 'LR85 C3l';
		if(tar && ['coins','blocks','payments','help'].indexOf(tar) >= 0){
			n = 'short';
			m += ' short';
			if (tar != 'coins' && tar != 'help') {
				h += '<div class="LR85 clearfix"><div id="PageTopL" class="C3'+mde+' txtmed"></div><div id="PageTopR" class="right"></div></div>';
			} else {
				h += '<div class="LR85 clearfix"><div id="PageTopL" class="C3'+mde+' txtmed"></div></div>';
			}
			h += '<div class="pbar"></div><div id="PageBot" class="LR80 C3'+mde+' txt shim10">'+$I.load+'</div>';
			d += ' hide';
		}else{
			tar = 'home';
		}
		
		$C.Stage.className = m;
		$C.Stage.innerHTML = h;
		$C.Addr.className = d;

		switch (tar) {
			case 'coins':    dta_Coins();     break;
			case 'blocks':   dta_Blocks(1);   break;
			case 'payments': dta_Payments(1); break;
			case 'help':     dta_Help();      break;
			default:
				Dash_init();
				Dash_load();
		}

		document.querySelector('#HeadMenu select').value = tar;
		document.querySelector('#FootR .nav[data-tar="'+tar+'"]').classList.add('o5');
	}, 300);
}
//Dash
function Dash_init(){
	var $S = ['SplitL', 'SplitR'],
		ins = '<div id="News" class="hide"><div id="NewsCard" class="LR85 C0bk'+mde+' C3'+mde+' shimtop20"></div></div>'+
		'<div id="MinerPayments"></div>'+
		'<div id="MinerGraph" class="clearfix"></div>'+
		'<div id="MinerDash" class="LR85 txtbig C3'+mde+' hide"></div>'+
		'<div id="WorkerList" class="LR85 shimtop20 hide"></div>';

	miner_setup_open = false;

	$C.Stage.innerHTML = ins;
	
	ins = '';	
	for(var j = 0; j < 2; j++){
		ins += '<div class="'+$S[j]+'">';
		var i = 0;
		var sts = $$.sts();
		for(var k in sts){
			if((j === 0 && i < 2) || (j === 1 && i >= 2)){
				ins += '<div class="Spl">'+
					'<div id="'+k+'">--</div>'+
					'<div class="hbar shim4 o8"></div>'+
					'<div class="C2 txttny">'+sts[k]+'</div>'+
				'</div>';
			}
			i++;
		}
		ins += '</div>';
	}
	document.getElementById('MinerDash').innerHTML = ins;
	WebMinerSetBtn();
	var f = document.getElementById('MinerCalcFld'),
		h = document.getElementById('MinerCalcHsh'),
		u = document.getElementById('MinerCalcUnit'),
		hs = document.getElementById('HashSelect');
		
	ins = '';
	for(var k in $$.calc){
		ins += '<option value="'+k+'">'+$$.calc[k]+'</option>';
	}
	f.innerHTML = ins;
	f.className = 'FrmElem txttny C0'+mde+' C1bk';
	ins = '';
	for(var k in $D.hashconv){
		ins += '<option value="'+k+'">'+k+'/s</option>';
	}
	u.innerHTML = ins;
	u.value = 'H';
	u.className = 'FrmElem txttny C0'+mde+' C1bk';
	h.className = 'FrmElem txttny C0'+mde+' C1bk';
	hs.className = 'FrmElem txttny C0'+mde+' C1bk';
	hs.innerHTML = '<option value="pay">Pay</option><option value="raw">Raw</option>';
}
function Dash_load(typ){
	var m = document.getElementById('MinerGraph'),
		l = document.getElementById('WorkerList'),
		g = document.getElementById('MinerDash');
	
	if(addr){
		if($Q.cur.reg.test(addr)){
			$C.AddrField.classList.remove('C4');
			if(typ !== 'refresh'){
				Dash_btn('loading');
				l.innerHTML = $I.load;
			}
			api('account').then(function(){
				if (!is_home_page()) return;
				if($A[addr] && $A[addr].hashes){
					g.classList.remove('hide');
					for(var k in $$.pay){
						var val = $A[addr][$$.pay[k].var], dec = 8;
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
					document.getElementById('MinerHashes').innerHTML = (now - $A[addr].last) < 10*60
						? '<span title="' + Ago($A[addr].last, 'y') + '">' + HashConvStr($A[addr][document.getElementById('HashSelect').value == 'raw' ? 'hash' : 'hash2']) + '</span>'
						: AgoTooltip($A[addr].last, 'y');
					document.getElementById('MinerShares').innerHTML = '<span title="Invalid shares: ' + $A[addr].bad_shares + '">' + $A[addr].shares + '</span>';
					document.getElementById('TotalHashes').innerHTML = Num($A[addr].hashes);
					
					if(typ !== 'refresh') Dash_btn('loaded');
					Graph_Miner_init();
					MultipleAddress();
					
					api('workers', addr).then(function(){
						if (!is_home_page()) return;
						var wcn = ($A[addr].wrkrs && numObj($A[addr].wrkrs) > 0) ? numObj($A[addr].wrkrs) : 0,
							plr = (wcn === 1) ? '' : 's';
							
						document.getElementById('MinerWorkerCount').innerHTML = wcn+' Worker'+plr;
						l.classList.remove('hide');
						Workers_init();
					}).catch(function(err){console.log(err)});
				}else{
					Dash_reset();
					m.innerHTML =
						'<div class="MinerMsg C3'+mde+'"><div class="txtmed">Address Not Found</div><div class="LR80 txt shim10">' +
						'If you\'ve submitted your first share, be patient, it may take a minute or two to update. ' +
						'If your shares are being rejected, visit the <u class="nav C1" data-tar="help">help section.</u><br><br>' +
						'You can also try to run web miner in this browser using <div id="WebMinerBtn" class="BtnElem C0'+mde+' txttny C1bk C2bk_hov"></div> button but it will not give you full performance of standalone miner.<br><br>' +
						'You can also see generic CPU miner setup script that is good enough in most cases by pressing the button below.<div class="shim10"></div><div id="MinerSetupScripts" class="LR85"></div><br><br>' +
						'Standalone miner reference setup info:<br>' +
							'Pool: gulf.moneroocean.stream<br>' +
							'Port: 10128 or 20128 for SSL (128000 diff)<br>' + 
							'User: ' + addr + '<br><br>' +
							'For top profit algo switching mining use <a href="https://github.com/MoneroOcean/xmrig/releases" class="C1 hov" target="_blank">our version of XMRig miner</a> ' +
							'and <a href="https://github.com/MoneroOcean/xmr-node-proxy" class="C1 hov" target="_blank">algo switching mining proxy</a> if your have many miners.<br>' +
						'</div></div>';
					l.classList.add('hide');
					WebMinerSetBtn();
					MinerSetupScriptsBtn(miner_setup_open);
				}
			}).catch(function(err){console.log(err)});
		}else{
			Dash_reset();
			$C.AddrField.classList.add('C4');
			m.innerHTML = '<div class="MinerMsg C3'+mde+'"><div class="txtmed">'+$$.msg.addr_invalid.head+'</div><div class="LR80 txt shim10">'+$$.msg.addr_invalid.text+'</div></div>';
		}
	}else{
		Dash_reset();
		m.innerHTML =
			'<div class="MinerMsg C3'+mde+'"><div class="txtmed">Welcome to ' + $Q.pool.nme +'</div><div class="LR80 txt shim10">' +
			'Visit the <u class="nav C1" data-tar="help">help section</u> to get setup, then enter your '+$Q.cur.nme+' address above. ' +
			'After you\'ve submitted a share, your stats will appear here.<br><br>' +
			'Standalone miner reference setup info:<br>' +
				'Pool: gulf.moneroocean.stream<br>' +
				'Port: 10128 or 20128 for SSL (128000 diff)<br><br>' +
				'User: "Your XMR wallet address"<br><br>' +
				'For top profit algo switching mining use <a href="https://github.com/MoneroOcean/xmrig/releases" class="C1 hov" target="_blank">our version of XMRig miner</a> ' +
				'and <a href="https://github.com/MoneroOcean/xmr-node-proxy" class="C1 hov" target="_blank">algo switching mining proxy</a> if your have many miners.<br>' +
			'</div></div>';
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
		el.innerHTML = $R[id].v;
		if($R[id].r) el.classList.remove($R[id].r);
	}
	for(var k in $$.pay){
		var e = document.getElementById(k);
		if(e) e.innerHTML = $$.pay[k].def || '--';
	}
	for(var k in $$.sts()){
		var e = document.getElementById(k);
		if(e) e.innerHTML = '--';
	}

}
function Dash_btn(m){
	var b = $C.DashPayBtn, c = 'nopoint C2fl o5', h = $I.settings;
	if(m === 'loading'){
		c = 'nopoint';
		h = $I.load;	
	}else if(m === 'loaded'){
		c = 'C1fl hov';
	}else if(m === 'closer'){
		c = 'C1fl';
		h = '<div class="Closer hov">'+$I.x+'</div>';
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
		u_val = u.value || 'H';
		
	if(h_val && h_val > 0){
		h_raw = h_val * $D.hashconv[u_val];
	}else{
		h_raw = $D.miner_hash_avg;
	}
	
	var hs = HashConv(h_raw);
		
	h_val = hs.num;
	u_val = hs.unit.replace('/s', '');
	
	h.value = h_val;
	u.value = u_val;
	f.value = f_val;
	
	api('netstats').then(function(){
		api('poolstats').then(function(){
			var t = h_raw / difficultyToHashRate($D.netstats.difficulty, mport) * (24*60*60) / COINS[mport].time * $D.poolstats.minBlockRewards[mport] * f.value;
			var fiat = $Q.fiat_symbol + Rnd(t * $D.poolstats.price[$Q.fiat_name], 2, 'txt');
			document.getElementById('MinerCalc').innerHTML = Rnd(t, 4, 'txt')+' '+$Q.cur.sym + " (" + fiat + ")";
		});
	});
}
//Workers
function Workers_init(){		///check this, getting called alot
	var l = document.getElementById('WorkerList');
	if($A[addr] && $A[addr].wrkrs && l){
		var numwrk = numObj($A[addr].wrkrs),
			i = 0,
			d = '',
			ky = '',
			blkclss = '',
			ins = '<div id="WorkerSortGroup" class="hide txttny C2">'+
				'<div id="WorkerSortName" class="C2bk C0fl'+mde+'" title="Sort workers by their name" data-ord="D">'+$I.sort+'</div>'+
				'<div id="WorkerSortRate" class="C2bk C0fl'+mde+'" title="Sort workers by their hashrate" data-ord="D">'+$I.sort+'</div>'+
			'</div>'+
			'<div class="WingPanel">';
		
			srt = (pref.charAt(1) === 'R') ? 'rate' : 'name',
			ord = 'A',
			s = [];
			
		if(['A','D'].indexOf(pref.charAt(2)) >= 0) ord = pref.charAt(2);

		for(i = 0; i < numwrk; i++){
			s.push([i, $A[addr].wrkrs[i][srt]]);
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
		l.innerHTML = ins+'</div><div class="clear"></div><div class="hbar shim10"></div><div id="MinerSetupScripts" class="LR85 center"></div><div class="shim10"></div>';
		MinerSetupScriptsBtn(miner_setup_open);
		
		if(numwrk > 0){
			var bwid = document.getElementById('WName-0').clientWidth;
			for(i = 0; i < numwrk; i++){
				document.getElementById('WName-'+s[i][0]).innerHTML = Truncate($A[addr].wrkrs[s[i][0]].name, Rnd(bwid / 6.25));
			}
		}
		if(numwrk > 1){
			document.getElementById('WorkerSortGroup').classList.remove('hide');
			Workers_sort(srt, ord, 'n');
		}

		var cnt = 0;
		for(i = 0; i < s.length; i++){
			var 	k = s[i][0],
				d = $A[addr].wrkrs[k],
				hsh = (d && d.stats && d.stats[0] && d.stats[0].hsh) ? d.stats[0].hsh : 0;
			
			if(hsh > 0){
				document.getElementById('WRate-'+k).innerHTML = HashConvStr(hsh);
				if(d.stats) Graph_Worker(k);
			}else{
				document.querySelector('.Worker[data-key="'+k+'"]').classList.add('C4','C4br');
			}
			cnt++;
			if(numwrk > 1 && cnt === numwrk) Workers_sort(srt, ord, 'y');
		}
	}
}
function Workers_sort(srt, ord, sts){
	var n = document.getElementById('WorkerSortName'),
		n_cl = 'C2bk C0fl'+mde+' hov',
		n_in = $I.sort,
		r = document.getElementById('WorkerSortRate'),
		r_cl = 'C2bk C0fl'+mde+' hov',
		r_in = $I.load,
		ordV = (ord === 'D') ? 'A' : 'D',
		orot = (ord === 'D') ? 'rot90' : 'rot270';
		
	if(sts === 'y'){
		if(srt === 'rate'){
			r_cl = 'C1bk C0fl'+mde+' hov '+orot;
			r_in = $I.arrow;
		}else if(srt === 'name'){
			r_in = $I.sort;
		}
	}else{
		if(srt === 'rate') r_cl = 'C1bk C0fl'+mde+' nopoint';
	}
	if(srt === 'rate'){
		r.setAttribute('data-ord', ordV);
	}else if(srt === 'name'){
		n.setAttribute('data-ord', ordV);
		n_cl = 'C1bk C0fl'+mde+' hov '+orot;
		n_in = $I.arrow;
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

		var d = $A[addr].wrkrs[xid],
			p = document.getElementById('WorkerPop');
		
		p.innerHTML = $I.load;
		api('workerdetail', xid, d.name).then(function(){
			var avg = 0,
				havg = 0,
				maxtime = 99999999999999999,
				timestart = maxtime,
				cnt = numObj($A[addr].wrkrs[xid].stats),
				i = cnt;

			while(i--){
				avg = avg + parseInt($A[addr].wrkrs[xid].stats[i].hsh);
				SynchTime($A[addr].wrkrs[xid].stats[i].tme);
				if($A[addr].wrkrs[xid].stats[i].tme < timestart) timestart = $A[addr].wrkrs[xid].stats[i].tme;
			}
			p.innerHTML = '<div id="WorkerPopClose" class="C1fl Btn16 Btn16Corner">'+$I.x+'</div>'+
				'<div class="BoxL center">' + HashConvStr(Rnd(avg / cnt, 0)) + '</div>'+
				'<div class="BoxR center">'+AgoTooltip(d.last, 'y')+'</div>'+
				'<div class="pbar shim4"></div>'+
				'<div class="BoxL txttny C2 center">Avg '+(timestart == maxtime ? "n/a" : AgoTooltip(timestart))+'</div>'+
				'<div class="BoxR txttny C2 center">Last Share</div>'+
				'<div class="shim10"></div>'+
				'<div class="BoxL center">'+Num(d.hashes)+'</div>'+
				'<div class="BoxR center">'+Num(d.val)+' / '+Num(d.inv)+'</div>'+
				'<div class="pbar shim4"></div>'+
				'<div class="BoxL txttny C2 center">'+$$.stsw().MinerHashes+'</div>'+
				'<div class="BoxR txttny C2 center">'+$$.stsw().MinerShares+'</div>';
		}).catch(function(err){console.log(err)});
	}
}
//Miner Payments
function MinerPayments(typ){
	typ = typ || '';
	if(addr && $A[addr] && $A[addr].hashes && $A[addr].hashes > 0){
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
			m.innerHTML = '<div class="hbar"></div><div id="MinerPaymentsStage">'+$I.load+'</div>';
			Dash_btn('closer');
		}
	}else{
		return;
	}
	
	api('user').then(function(){
	   	var ins = '';
		ins +=	'<div class="LR50 shimtop20 C0'+mde+' txtmed center">'+
				'<table class="C3l noborder"><tr>'+
					'<td width="50%" class="center">'+
						'<input type="text" id="AutoPayFld" class="center txt C0bk'+mde+' C3'+mde+' C1br" autocomplete="off" placeholder="Auto Pay Amount...">'+
						'<div class="pbar"></div><span class="txttny C2 noselect">Auto pay ' + $Q.cur.sym + ' threshold</span>'+
					'</td>'+
					'<td width="50%" class="center">'+
						'<div id="AutoPayBtn" class="BtnElem txtmed C0'+mde+' C1bk C2bk_hov o5">'+$$.trn.set+'</div>'+
						'<div class="pbar"></div><span id="AutoPayFeeLbl" class="txttny C2 noselect">' + fee_txt($A[addr].threshold) + '</span>'+
					'</td>'+
				'</tr></table>'+
		                '<div class="hbar shim10"></div>'+
			'</div>';
		if ($Q.email) {
			var	email_enabled = $A[addr].email,
				check = $I[email_enabled ? 'check' : 'x'],
				lbl = $$.trn[email_enabled ? 'eml_on' : 'eml_off'];
			ins +=	'<div class="LR50 shimtop20 C0'+mde+' txtmed center">'+
				'<div class="Split3L">'+
					'<input type="text" id="EmailFROM" class="center txt C0bk'+mde+' C3'+mde+' C1br" placeholder="Change email FROM">'+
					'<div class="pbar"></div><span class="txttny C2 noselect">Change email FROM</span>'+
				'</div>'+
				'<div class="Split3R">'+
					'<input type="text" id="EmailTO" class="center txt C0bk'+mde+' C3'+mde+' C1br" placeholder="Change email TO">'+
					'<div class="pbar"></div><span class="txttny C2 noselect">Change email TO</span>'+
				'</div>'+
				'<div class="Split3">'+
					'<div id="EmailSubscribeBtn" class="BtnElem DiscMde C1bk C2bk_hov">'+
						'<div class="DiscIcon C0bk'+mde+' C1fl">'+check+'</div>'+
						'<span id="EmailSubscribeLbl" class="C0'+mde+' txtmed">'+lbl+'</span>'+
					'</div>'+
					'<div class="pbar"></div><span class="txttny C2 noselect">and change email</span>'+
				'</div>'+
				'<div class="hbar shim10"></div>'+
				'</div>';
		}
		ins +=	'<div id="PaymentHistory" class="center"><div class="LR50">'+
				'<div id="PaymentHistoryBtn" class="BtnElem C0'+mde+' txtmed C1bk C2bk_hov">'+$$.trn.vwpy+'</div>'+
			'</div></div>';
		
		document.getElementById('MinerPaymentsStage').innerHTML = ins;
		document.getElementById('AutoPayFld').value = Rnd($A[addr].threshold, $Q.pay.dec_auto, 'txt');
	});
}
function EmailSubscribe(){
	var	ic  = document.querySelector('#EmailSubscribeBtn .DiscIcon'),
		txt = document.getElementById('EmailSubscribeLbl');
	ic.classList.add('preload');
	ic.innerHTML = $I.load;
	var status = $A[addr].email;
	var new_status = status ? 0 : 1;
	api('subscribeEmail', {'username':addr, 'enabled':new_status, 'from':document.getElementById('EmailFROM').value, 'to':document.getElementById('EmailTO').value}).then(function(){
	        $A[addr].email = new_status;
		var 	ico = $I[new_status ? 'check' : 'x'],
			lbl = $$.trn[new_status ? 'eml_on' : 'eml_off'];
		ic.classList.remove('preload');
		ic.innerHTML = ico;
		txt.innerHTML = lbl;
	}).catch(function(err){
		if (err != "Connection") {
			ic.classList.remove('preload');
			ic.innerHTML = $I[status ? 'check' : 'x'];
			alert(err);
		}
	});
}
function AutoPay(s){
	var c = AutoPayCheck(),
		b = document.getElementById('AutoPayBtn');
	
	if(c === 'OK'){
		b.classList.remove('C1bk','C4bk','C5bk');
		b.innerHTML = $I.load;
		api('updateThreshold', {'username':addr, 'threshold':NumInput(document.getElementById('AutoPayFld').value)}).then(function(){
			b.classList.add('C5bk');
			b.innerHTML = $$.trn.updt;
		});
	}
}
function escapeHtml(unsafe) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}
function resize_texareas() {
	var textareaList = document.getElementsByTagName("textarea");
	for(var i = 0; i < textareaList.length; i++){
		var ta = textareaList[i];
		ta.style.height = (ta.scrollHeight + 2) + "px";
	}
}

function MinerSetupScriptsBtn(show){
	miner_setup_open = show;
	var s = document.getElementById('MinerSetupScripts');
	if (show) {
		var lin_cmd = escapeHtml("curl -s -L https://raw.githubusercontent.com/MoneroOcean/xmrig_setup/master/setup_moneroocean_miner.sh | bash -s " + addr);
		var lin_hlp = escapeHtml('Copy and execute under Linux shell. User with passwordless sudo access is recommended.');
		var win_cmd = escapeHtml("powershell -Command \"$wc = New-Object System.Net.WebClient; $tempfile = [System.IO.Path]::GetTempFileName(); $tempfile += '.bat'; $wc.DownloadFile('https://raw.githubusercontent.com/MoneroOcean/xmrig_setup/master/setup_moneroocean_miner.bat', $tempfile); & $tempfile " + addr + "; Remove-Item -Force $tempfile\"");
		var win_hlp = escapeHtml('Copy and execute under "Command Prompt". Run "Command Prompt" as Administrator is recommended if possible.');
		s.innerHTML =	'<div id="MinerSetupHideBtn" class="BtnElem C0'+mde+' txtmed C1bk C2bk_hov">Hide Miner Setup Scripts</div>' +
				'<div class="shim10"></div>' +
				'<div class="center"><textarea id="WinCmdTextArea" wrap="soft" class="W95 txt C0bkl C3l C1br" readonly>' + win_cmd + '</textarea>' +
				'<div class="pbar"></div><span class="txttny C2 noselect" title="' + win_hlp + '">Windows setup command</span></div>'+
				'<div class="shim10"></div>' +
				'<div class="center"><textarea id="LinCmdTextArea" wrap="soft" class="W95 txt C0bkl C3l C1br" readonly>' + lin_cmd + '</textarea>' +
				'<div class="pbar"></div><span class="txttny C2 noselect"title="' + lin_hlp + '">Linux setup command</span></div>';
		resize_texareas();
	} else {
		s.innerHTML = '<div id="MinerSetupShowBtn" class="BtnElem C0'+mde+' txtmed C1bk C2bk_hov">Show Miner Setup Scripts</div>';
	}
}
var web_miner_start = false; // one time check the first time web miner button is shown
function WebMinerSetBtn(){
	if (web_miner_start === false) {
		web_miner_start = true;
		if (addr && UrlVars().web_miner && $WM.enabled === false) {
			WebMiner();
			return;
		}
	}
	var w = document.getElementById('WebMinerBtn');
	if ($WM.enabled) {
		w.innerHTML = $$.wm.on;
		w.classList.add('glow');
	} else {
		w.innerHTML = $$.wm.off;
		w.classList.remove('glow');
	}

}
function WebMiner(){
	$WM.enabled = !$WM.enabled;
	WebMinerSetBtn();
	if ($WM.enabled && addr) {
		var threads = navigator.hardwareConcurrency || 4;
		console.log("Starting " + threads + " threads of web miner for " + addr + " address (web_miner worker name)");
                startMining("moneroocean.stream", addr, "web_miner", navigator.hardwareConcurrency || 4, "");
		$WM.addr = addr;
		$WM.status_timer = setInterval(function () {
			if (addr !== $WM.addr) {
				console.log("Removing web miner timer");
		                clearInterval($WM.status_timer);
		                $WM.status_timer = false;
				$WM.enabled = false;
				WebMinerSetBtn();
		                return;
		        }
		        // for the definition of sendStack/receiveStack, see miner.js
		        while (sendStack.length > 0) console.log(sendStack.pop());
		        while (receiveStack.length > 0) console.log(receiveStack.pop());
			var h = document.getElementById('WebMinerHash');
			if (h) h.innerHTML = HashConvStr((totalhashes - $WM.prev_hash) / $WM.update_sec);
		        $WM.prev_hash = totalhashes;
		        console.log("Calculated " + totalhashes + " hashes");
		}, $WM.update_sec * 1000);
	} else {
		stopMining();
		if ($WM.status_timer) {
			console.log("Removing web miner timer");
	                clearInterval($WM.status_timer);
	                $WM.status_timer = false;
		}
	}
}

function fee_txt(threshold) {
	var fee = Math.max(0, $Q.pay.max_fee - ( (threshold - $Q.pay.min_auto) * ($Q.pay.max_fee / ($Q.pay.zero_fee_pay - $Q.pay.min_auto))));
	var percent = 100 * (fee / threshold);
	return '+' + Rnd(fee, 4, 'txt') + ' (' + Rnd(percent, 2, 'txt') + '%) ' + $Q.cur.sym + ' tx fee';
}

function AutoPayCheck(){
	var b = document.getElementById('AutoPayBtn'),
		b_ins = $$.trn.set,
		f = document.getElementById('AutoPayFld'),
		val_num = NumInput(f.value),
		r = 'err';

	b.classList.remove('C1bk','C4bk','C5bk','o5');
	f.classList.remove('C4','C4br');
	if(val_num < $Q.pay.min_auto){
		b.classList.add('C4bk');
		b_ins = $Q.pay.min_auto+' '+$Q.cur.sym+' '+$$.trn.min;
		f.classList.add('C4', 'C4br');
	}else if(val_num >= $Q.pay.min_auto){
		b.classList.add('C1bk');
		r = 'OK';
		var l = document.getElementById('AutoPayFeeLbl');
                l.innerHTML = fee_txt(val_num);
	}else{
		b.classList.add('C1bk', 'o5');
	}
	b.innerHTML = b_ins;
	f.value = Rnd(val_num, $Q.pay.dec_auto, 'txt');
	return r;
}
function MinerPaymentHistory(pge){
	pge = (pge > 1) ? pge : 1;
	document.getElementById('MinerPayments').className = 'OpenedBig';
	document.getElementById('PaymentHistory').innerHTML = '<div class="LR85"><div id="PaymentHistoryBtnClose" class="BtnElem C0'+mde+' txtmed C1bk C2bk_hov">Close Payment History</div>'+
		'<div id="MinerPaymentsTable" class="C3'+mde+'">'+$I.load+'</div></div>'+
		'<input type="hidden" id="MinerPaymentsPage" value="'+pge+'">';
		
	api('pay', pge, 10).then(function(){
		Tbl('MinerPaymentsTable', 'pay', pge, 10);
	}).catch(function(err){console.log(err)});
}

//Other Pages

function dta_Coins(){
	api('poolstats').then(function(){ api('netstats').then(function(){
		$D.coins[0] = [];
		var active_ports = {};
		$D.poolstats.activePorts.forEach(function(port) { active_ports[port] = 1; });
		Object.keys(COINS).sort(function (a, b) { return (COINS[a].name < COINS[b].name) ? -1 : 1 }).forEach(function(port) {
			var coin = COINS[port];
			var port_hashrate = $D.poolstats.portHash[port] ? $D.poolstats.portHash[port] : 0;
			var hash_factor   = coin.factor ? coin.factor : 1;
			var table_coin = {
				'name':			coin.name,
				'algo':			$D.poolstats.portCoinAlgo[port],
				'profit':		Number.parseFloat($D.poolstats.coinProfit[port] / $D.poolstats.coinProfit[mport] * 100).toPrecision(3) + '%',
				'shares':		$D.poolstats.currentEfforts[port],
				'diff':			$D.netstats[port].difficulty,
				'reward_perc':		Rnd($D.poolstats.minBlockRewards[port] / $D.poolstats.minBlockRewards[mport] * 100, 2, 'txt') + '%',
				'accounts':		$D.poolstats.portMinerCount[port] ? $D.poolstats.portMinerCount[port] : 0,
				'poolhashrate':		'<span title="' + Rnd(port_hashrate / $D.netstats[port].difficulty * 100 * coin.time, 2, 'txt') +
							'% of coin world hashrate">' + HashConvStr(port_hashrate * hash_factor, coin.unit) + '</span>',
				'worldhashrate':	HashConvStr($D.netstats[port].difficulty / coin.time * hash_factor, coin.unit),
				'height':		'<a class="C1 hov" target="_blank" href="' + COINS[port].url + '">' + $D.netstats[port].height + '</a>',
				'pplns':		Rnd(($D.poolstats.pplnsPortShares[port] ? $D.poolstats.pplnsPortShares[port] : 0) * 100, 2, 'txt') + '%',
				'notes':		'<div class="C4" title="' + escapeHtml($D.poolstats.coinComment[port]) + '">' + escapeHtml($D.poolstats.coinComment[port]) + '</div>',
			};
			if (!active_ports[port]) ['name', 'algo', 'profit', 'reward_perc', 'accounts', 'poolhashrate', 'worldhashrate', 'pplns'].forEach(function(key) {
				table_coin[key] = '<span class="C4">' + table_coin[key] + '</span>';
			});
			$D.coins[0].push(table_coin);
		});
		document.getElementById('PageTopL').innerHTML = 'Current PPLNS window length: ' + Rnd($D.poolstats.pplnsWindowTime / 3600, 2, 'txt') + ' hours';
		Tbl('PageBot', 'coins', 0, 0);
	}).catch(function(err){console.log(err)}); }).catch(function(err){console.log(err)});
}

function dta_Blocks(pge){
	api('poolstats').then(function(){ api('netstats').then(function(){
			var bins = '<option value="0"' + (blocks_port == 0 ? " selected" : "") + '>Altcoins</option>';
			Object.keys(COINS).sort(function (a, b) { return (COINS[a].name < COINS[b].name) ? -1 : 1 }).forEach(function(port) {
				var coin = COINS[port];
				bins += '<option value="' + port + '"' + (port == blocks_port ? " selected" : "") + '>' + coin.name + '</option>';
			});
			var blocks_found = blocks_port ? $D.poolstats.altBlocksFound[blocks_port] : $D.poolstats.totalAltBlocksFound;
			document.getElementById('PageTopL').innerHTML = Num(blocks_found)+' <select id="BlockType" class="FrmElem txttny C0'+mde+' C1bk">' + bins + '</select> Blocks <span id="BlockEffort"></span>';
			document.getElementById('PageBot').innerHTML = $I.load;
			api('blocks', pge, blocks_page_size).then(function(){
				Tbl('PageBot', 'blocks', pge, blocks_page_size);
				var eff = 0, bnum = 0;
				if ($D.blocks[pge]) $D.blocks[pge].forEach(function(b) { eff += b.shares / b.diff; ++ bnum; });
				var eff_perc = bnum ? Rnd(eff / bnum * 100) : 0;
				document.getElementById('BlockEffort').innerHTML = '(<span class="'+(eff_perc > 100 ? 'C4' : 'C5')+'">'+Perc(eff_perc)+'</span> effort on this page)'
			}).catch(function(err){console.log(err)});
	}).catch(function(err){console.log(err)}); }).catch(function(err){console.log(err)});
}
function dta_Payments(pge){
	document.getElementById('PageBot').innerHTML = $I.load;
	api('poolstats').then(function(){
		document.getElementById('PageTopL').innerHTML = Num($D.poolstats.totalPayments)+' Payments to '+Num($D.poolstats.totalMinersPaid)+' Miners';
		api('poolpay', pge, poolpay_page_size).then(function(){
			Tbl('PageBot', 'poolpay', pge, poolpay_page_size);
		}).catch(function(err){console.log(err)});
	}).catch(function(err){console.log(err)});
}
function dta_Help(){
	document.getElementById('PageTopL').innerHTML = $$.hlp.head;
	var ins = '<p>'+$$.hlp.text+'</p>'+
		'<div class="helpgroup">'+
			'<div class="helptitle txtbig">Step 1 - Install Wallet & Create Address<div class="btnback">'+$I.arrow+'</div></div>'+
			'<div class="helpteaser">Start here if you need a Monero address and wallet.</div>'+
			'<div class="helpcontent hide">'+
				'<p>The <a href="https://www.getmonero.org/downloads/" target="_blank" class="C1 hov">Official Monero Wallet</a> is recommended. Monero Outreach\'s <a href="https://www.monerooutreach.org/stories/monero_wallet_quickstart.php" class="C1 hov" target="_blank">Wallet Guide</a> has a list of other wallet options including paper wallets.</p>'+
			'</div>'+
		'</div>'+
		'<div class="helpgroup">'+
			'<div class="helptitle txtbig">Step 2 - Install Mining Software<div class="btnback">'+$I.arrow+'</div></div>'+
			'<div class="helpteaser">Install the software needed to mine Monero.</div>'+
			'<div class="helpcontent hide">'+
				'<p>Select the miner that best suits your hardware and follow their installation instructions. If you need help, visit <a href="https://discordapp.com/invite/jXaR2kA" class="C1 hov">Discord</a>.</p>' +
					'&nbsp;<a href="https://github.com/MoneroOcean/xmrig/releases" class="C1 hov" target="_blank">MO XMRig</a>: for top profit algo switching mining on CPU and GPU (Nvidia, AMD)<br>' +
					'&nbsp;<a href="https://github.com/xmrig/xmrig/releases" class="C1 hov" target="_blank">XMRig</a>: for mining on CPU and GPU (Nvidia, AMD)<br>' +
					'&nbsp;<a href="https://github.com/fireice-uk/xmr-stak/releases" class="C1 hov" target="_blank">XMR-Stak/RX</a>: for mining on CPU<br>' +
					'&nbsp;<a href="https://github.com/MoneroOcean/meta-miner" class="C1 hov" target="_blank">mm.js</a>: for algo switching miner wrapper (advanced)<br><br>' +
				'<p>Use <a href="https://github.com/MoneroOcean/xmr-node-proxy" class="C1 hov" target="_blank">algo switching mining proxy</a> if you have many miners.</p>' +
			'</div>'+
		'</div>'+
		'<div class="helpgroup">'+
			'<div class="helptitle txtbig">Step 3 - Configure Settings<div class="btnback">'+$I.arrow+'</div></div>'+
			'<div class="helpteaser">Select a pool server and port and configure you miner.</div>'+
			'<div class="helpcontent hide">'+
				'<p>Each mining software will have it\'s own config, but they will all ask for the same information:</p>'+
				'<p><b>Your Monero Address</b><br>Often this will be labeled username, but check the instructions.</p>'+
				'<p><b>Pool Address</b><br>The miner will want a url and a port, like this: gulf.moneroocean.stream:10128</p>'+
				'<p><table class="txtsmall C3'+mde+'"><tr>'+
					'<td>'+
						'<p>Port descriptions:</p>'+
						'<ul><li>10032: Old CPU/GPU</li><li>10128: Modern CPU/GPU</li><li>11024: CPU/GPU farm</li><li>20128: SSL/TLS</li><li>10001: Very old CPU (1000 diff)</li></ul>'+
					'</td>'+
					'<td>'+
						'<p>If you can\'t get through firewall, try these (specify +128000 difficulty after your Monero Address):</p>'+
						'<ul><li>80: Firewall bypass</li><li>443: Firewall bypass w/SSL/TLS</li></ul>'+
					'</td>'+
				'</tr></table></p>'+
				'<p><b>Optional Fields</b><br>You can also set worker names or fixed difficulty through the configuration.</p>'+
				'<p>Standard wallet address<br><i>(e.g. xmrig.exe -u 43T...sUW -p worker1)</i></p>'+
				'<p>Fixed difficulty of 128000 for the worker<br><i>(e.g. xmrig.exe -u 43T...sUW+128000 -p worker1)</i></p>'+
			'</div>'+
		'</div>'+
		'<div class="helpgroup">'+
			'<div class="helptitle txtbig">Step 4 - Start Mining<div class="btnback">'+$I.arrow+'</div></div>'+
			'<div class="helpteaser">Launch the miner and learn more.</div>'+
			'<div class="helpcontent hide">'+
				'<p>This pool uses PPLNS to determine payouts. It helps to combat pool hopping and ensures a good payout for miners.</p>'+
				'<p>'+Perc('0.0')+' (yes, Zero!) Pool Fee</p>'+
				'<p>' + $Q.pay.min_auto + ' XMR Minimum Payout</p>'+
				'<p>' + $Q.cur.conf +' Block Confirmation Time</p>'+
				'<br><p><i>Powered by:</i> <a href="https://github.com/MoneroOcean/nodejs-pool" target="_blank" class="C3l hov">nodejs-pool</a> &amp; <a href="https://github.com/MoneroOcean/moneroocean-gui" target="_blank" class="C3l hov">moneroocean-gui</a></p>' +
			'</div>'+
		'</div>';
		
	document.getElementById('PageBot').innerHTML = ins;
}
//Data
var api = function(m, key, xid){
	now = Rnd((new Date()).getTime() / 1000);
	key = key || 0;
	xid = xid || '';
	
	var 	i = 0,
		url = '',
		start = now - (3600 * GraphLib_Duration());

	if(m === 'news' && now > ($U[m] + 3600)){
		url = 'pool/motd';
	}else if(m === 'blocks'){
		if (blocks_port == mport) {
			url = 'pool/blocks?page='+(key - 1)+'&limit='+xid;
		} else if (blocks_port) {
			url = 'pool/coin_altblocks/' + blocks_port + '?page='+(key - 1)+'&limit='+xid;
		} else {
			url = 'pool/altblocks?page='+(key - 1)+'&limit='+xid;
		}
	}else if(m === 'netstats' && now > ($U[m] + 180)){
		url = 'network/stats';
	}else if(m === 'poolpay'){
		url = 'pool/payments?page='+((key - 1) * xid)+'&limit='+xid;
	}else if(m === 'poolstats' && now > ($U[m] + 180)){
		url = 'pool/stats';
	}else if(m === 'account'){
		url = 'miner/'+addr+'/stats';
	}else if(m === 'pay'){
		url = 'miner/'+addr+'/payments?page='+(key - 1)+'&limit='+xid;
	}else if(m === 'workers' && (isEmpty($A[addr].wrkrs) || now > ($A[addr].wrkrs_updt + 120))){
		url = 'miner/'+addr+'/chart/hashrate/allWorkers';
	}else if(m === 'workerdetail'){
		url = 'miner/'+addr+'/stats/'+xid;
	}else if(m === 'user' && addr){
		url = 'user/'+addr;
	}else if(m === 'updateThreshold'){
		url = 'user/updateThreshold';
	}else if(m === 'subscribeEmail'){
		url = 'user/subscribeEmail';
	}

	var method = 'GET', params = '';
	if (['updateThreshold','subscribeEmail'].indexOf(m) >= 0){
		method = 'POST';
		params = JSON.stringify(key);
	}

	if (url) {
		if (typeof $P[url] !== 'undefined') return $P[url];
		if (typeof $U[url] !== 'undefined' && method != "POST" && now < $U[url] + 10) url = '';
	}

	return $P[url] = new Promise(function (resolve, reject){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if(xhr.readyState !== 4) return;
			if(xhr.status >= 200 && xhr.status < 300){
				var d = (xhr.responseText) ? JSON.parse(xhr.responseText) : '';
				if(d){
					var dcnt = numObj(d);
					//Update Data Times
					if(['netstats','poolstats','news'].indexOf(m) >= 0) $U[m] = now;
					//Process Data
					if(m === 'news'){
						$D[m] = d;
					}else if(['blocks','pay','poolpay'].indexOf(m) >= 0){
						$D[m][key] = [];
						for(i = 0; i < dcnt; i++){
							var v = d[i];
							if(m === 'blocks'){
								$D[m][key][i] = {
									'ts':v.ts,
									'valid':v.valid,
									'unlocked':v.unlocked,
									'hash':v.hash,
									'port':v.port,
									'height':v.height,
									'value':v.value,
									'pay_value':v.pay_value,
									'pay_stage':v.pay_stage,
									'pay_status':v.pay_status,
									'shares':v.shares,
									'diff':v.diff
								};
							}else if(m === 'pay'){
								$D[m][key][i] = {
									'ts':v.ts * 1000,
									'hash':v.txnHash,
									'amnt':Rnd((v.amount / COINS[mport].divisor), 8)
								};
							}else if(m === 'poolpay'){
								$D[m][key][i] = {
									'ts':v.ts,
									'hash':v.hash,
									'payees':v.payees,
									'amnt':Rnd((v.value / COINS[mport].divisor), 8, 'txt'),
									'fee':Rnd((v.fee / COINS[mport].divisor), 8, 'txt')
								};
							}
						}
					}else if(m === 'netstats'){
						$D[m] = d;
					}else if(m === 'poolstats'){
						$D[m] = d.pool_statistics;
						// unify processing of altBlocksFound later
						$D[m].altBlocksFound[mport] = d.pool_statistics.totalBlocksFound;
					}else if(m === 'account'){
						if(d && d.totalHashes && d.totalHashes > 0){
							if (!$A[addr] || !$A[addr].wrkrs) $A[addr] = {
								'stats':{},
								'wrkrs':{},
								'wrkrs_updt':0,
								'email':0,
								'threshold':''
							};
							$A[addr].due    = Rnd((d.amtDue / COINS[mport].divisor), 8);
							$A[addr].paid   = Rnd((d.amtPaid / COINS[mport].divisor), 8);
							$A[addr].hashes = d.totalHashes;
							$A[addr].hash   = d.hash;
							$A[addr].hash2  = d.hash2;
							$A[addr].last   = d.lastHash;
							$A[addr].shares = Num(d.validShares);
							$A[addr].bad_shares = Num(d.invalidShares);
						}
					}else if(m === 'workers'){
						$A[addr].wrkrs = {};
						var i = 0;
						for (var wname in d) {
							if (wname === 'global') {
								$A[addr].stats = api_GraphFormat(d[wname], numObj(d[wname]), start);
								continue;
							}
							$A[addr].wrkrs[i] = {};
							$A[addr].wrkrs[i].name = wname;
							$A[addr].wrkrs[i].stats = api_GraphFormat(d[wname], numObj(d[wname]), start);
							var stats0 = $A[addr].wrkrs[i].stats[0];
							$A[addr].wrkrs[i].rate = (stats0 && stats0.hsh) ? stats0.hsh : 0;
							++ i;
						}
						$A[addr].wrkrs_updt = now;
					}else if(m === 'workerdetail'){
						$A[addr].wrkrs[key].last = d.lts;
						$A[addr].wrkrs[key].hashes = d.totalHash;
						$A[addr].wrkrs[key].val = (d.validShares > 0) ? d.validShares : 0;
						$A[addr].wrkrs[key].inv = (d.invalidShares > 0) ? d.invalidShares : 0;
					}else if(m === 'user' && d){
						$A[addr].email = d.email_enabled ? 1 : 0;
						var threshold = d.payout_threshold;
						$A[addr].threshold = Rnd(threshold ? threshold / COINS[mport].divisor : $Q.pay.def_auto, 8);
					}
					delete $P[url];
					$U[url] = now;
					resolve(key);
				}else{
					delete $P[url];
					reject('Data');
					console.log(xhr);
				}
			}else{
				delete $P[url];
				var msg;
				if (xhr.responseText) try {
					var json = JSON.parse(xhr.responseText);
					if (json.error) msg = json.error;
				} catch(err) {}
				reject(msg ? msg : 'Connection');
				console.log(xhr);
			}
		};
		if(url){
			xhr.open(method, $Q.api+url, true);
			xhr.setRequestHeader('Content-Type', 'application/json');
			
			if(method === 'POST'){
				xhr.send(params);
			}else{
				xhr.send();
			}
			//console.log('Lookup: '+m+':'+url+' '+method);
		}else{
			//console.log('Skipped: '+m+':'+url);
			delete $P[url];
			resolve(key);
		}
	});
};
function api_GraphFormat(d, cnt, start){
	var interval = 15*60,
		r = {},
		r_key = 0,
		r_now = now,
		r_avg = 0,
		r_avg2 = 0,
		r_cnt = 0;
	var prev_tme  = now;
	var prev_tme2 = now;
	for (var i = 0; i < cnt; i++) {
		var tme = Rnd(d[i].ts / 1000);
		if (tme < start) break;
		if (i < 200 && prev_tme - tme > interval) {
			r[r_key++] = {'tme':prev_tme-1, 'hsh':0, 'hsh2':0};
			r[r_key++] = {'tme':tme+1, 'hsh':0, 'hsh2':0};
		}
		var hsh  = (d[i] && d[i].hs && d[i].hs > 0) ? parseInt(d[i].hs) : 0;
		var hsh2 = (d[i] && d[i].hs2 && d[i].hs2 > 0) ? parseInt(d[i].hs2) : 0;
		if (prev_tme2 - tme < interval) {
			r_avg  += hsh;
			r_avg2 += hsh2;
			++ r_cnt;
		} else {
			r[r_key++] = {'tme':tme, 'hsh': r_cnt ? r_avg / r_cnt : hsh, 'hsh2': r_cnt ? r_avg2 / r_cnt : hsh2};
			r_avg  = 0;
			r_avg2 = 0;
			r_cnt = 0;
			prev_tme2 = tme;
		}
		prev_tme = tme;
	}
        for (var i = 0; i < r_key; i++) {
		if (r[i].hsh == 0) continue;
		var r_avg  = 0;
		var r_avg2 = 0;
		var r_cnt  = 0;
	        for (var j = -10; j <= 10; j++) {
			if (i+j < 0 || i+j >= r_key) continue;
			r_avg  += r[i+j].hsh;
			r_avg2 += r[i+j].hsh2;
			++ r_cnt;
		}
		r[i].hsh  = r_avg / r_cnt;
		r[i].hsh2 = r_avg2 / r_cnt;
	}
	return r;
}
//DataTable
function Tbl(tar, typ, pge, lim){
	var 	txt = (width > 900) ? 'txt' : 'txtsmall',
		row = 'ROW0',
		ins = (lim ? '<div class="WingPanel">' : '') + '<table class="txt C3'+mde+' scroll"><tr class="txttny">',
		rows = 0;

	var blocks_count;
	if (typ === 'blocks') blocks_count = blocks_port ? $D.poolstats.altBlocksFound[blocks_port] : $D.poolstats.totalAltBlocksFound;

	var skip_col_names = [];
	if (typ === 'blocks') {
		if (blocks_port == mport) skip_col_names = ['coin', 'reward'];
		else if (blocks_port) skip_col_names = ['coin'];
	}
	
	$$.tbl[typ].forEach(function(t) {
		if (skip_col_names.indexOf(t.name) != -1) return;
		ins += '<td class="' + t.cls + '"' + (t.tooltip ? ' title="' + escapeHtml(t.tooltip) + '"' : '')  + '>' + t.lbl + '</td>';
	});
	ins += '</tr>';

	if ($D[typ][pge]) $D[typ][pge].forEach(function(d) {
		row = (rows % 2 === 0) ? 'ROW1' : 'ROW0';
		ins += '<tr class="'+row+'">';
		$$.tbl[typ].forEach(function(t) {
			var n = t.name;
			if (skip_col_names.indexOf(n) >= 0) return;
			var val;
			switch (n) {
				case 'num':	val = blocks_count - ((pge-1)*lim + rows); break
				case 'tme':	val = AgoTooltip(d.ts / 1000, 'y'); break;
				case 'coin':	val = COINS[d.port].name; break;
				case 'eff': 	{
					var eff = Rnd(d.shares / d.diff * 100);
					val = '<span class="'+(eff > 100 ? 'C4' : 'C5')+'" title="'+d.shares+' / '+d.diff+'">'+Perc(eff)+'</span>';
					break;
				}
				case 'reward':	val = d.valid ? Rnd(d.value / COINS[d.port].divisor, 6, 'txt') : InvalidBlock(); break;
				case 'payment':	{
					if (d.valid) {
						var port = d.port ? d.port : mport;
						var is_main_port = (port == mport);
						var coin = COINS[port];
						var payment = (is_main_port ? d.value : d.pay_value) / COINS[mport].divisor;
						var payment_txt = Rnd(payment, 6, 'txt');
						if (d.unlocked && payment) {
							val = payment_txt;
						} else {
							if (is_main_port) {
								var b = $Q.cur.conf - ($D.netstats.height - d.height);
								if (b > 0) {
									val = (b * coin.time / 60) + " Mins Left";
								} else if (b > -10) {
									val = "Soon";
								} else {
									val = "Delayed";
								}
							} else {
								val = escapeHtml(d.pay_stage);
								if (!payment) val = '<span title="' + escapeHtml(d.pay_status) + '">' + val + '</span>';
							}
							if (payment) val = '<span title="Pending ' + payment_txt + ' ' + $Q.cur.sym + '">' + val + '</span>';
						}
						if (d.unlocked) val = '<span class="C5">' + val + '</span>';
					} else {
						val = InvalidBlock();
					}
					break;
				}
				case 'height':	val = Num(d[n]); break;
				case 'hash':	val = hashToLink(d[n], d.port ? d.port : mport, t.typ); break;
				default:	val = d[n];
			}
			ins += '<td class="'+t.cls+'">'+val+'</td>';
		});
		ins += '</tr>';
		++ rows;
	});
	ins += '</table>';
	if (lim) ins +=
		'<div id="'+tar+'-WBL" class="WingBtnL rot180 o3 nopoint C2bk C0fl'+mde+'">'+$I.arrow+'</div>'+
		'<div id="'+tar+'-WBR" class="WingBtnR o3 nopoint C2bk C0fl'+mde+'">'+$I.arrow+'</div>'+
		'</div>';
		
	document.getElementById(tar).innerHTML = ins;
	if (!$D[typ][pge] || !lim) return;
	var pgs = 0;
	if(tar === 'PageBot'){
		var size, page_size;
		if (typ === 'poolpay') {
			size = $D.poolstats.totalPayments;
			page_size = poolpay_page_size;
		} else if (typ === 'blocks') {
			size = blocks_count;
			page_size = blocks_page_size;
		}
		var ps_ins = "";
		$$.page_sizes.forEach(function(ps){
			ps_ins += '<option value="' + ps + '"' + (ps == page_size ? " selected" : "") + '>' + ps + '</option>';
		});
		pgs = Math.ceil(size / page_size);
		document.getElementById('PageTopR').innerHTML =
			'<span class="txtmed C3'+mde+'">Page</span>'+
			'<input id="TblPagBox" type="text" class="FrmElem txttny C1bk C0'+mde+'" value="'+pge+'" data-func="'+typ+'" autocomplete="off" data-tot="'+pgs+'">'+
			'<span class="txtmed C3'+mde+'">of '+Num(pgs)+'</span> '+
			'<span class="txtmed C3'+mde+'">(<select id="PageSize" class="FrmElem txttny C0'+mde+' C1bk">' + ps_ins + '</select> per page)</span>';
		PaginationBoxWidth();
	}
	if(rows > 0){
		var	BL = document.getElementById(tar+'-WBL'),
			BR = document.getElementById(tar+'-WBR');
		
		if(pge > 1){
			BL.className = 'WingBtnL PagBtn rot180 C1bk C0fl'+mde;
			BL.setAttribute('data-page', pge - 1);
			BL.setAttribute('data-func', typ);
		}
		if((pgs && pge < pgs) || (!pgs && rows == lim)){
			BR.className = 'WingBtnR PagBtn C1bk C0fl'+mde;
			BR.setAttribute('data-page', pge + 1);
			BR.setAttribute('data-func', typ);
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
function is_home_page() {
	return document.querySelector('#HeadMenu select').value == 'home';
}
function Graph_Miner_init(){
	var m = document.getElementById('MinerGraph');
	if(m != null && addr && $A[addr] && $A[addr].hashes){
		m.innerHTML = $I.load;
		if(isEmpty($A[addr].stats)){
			var addr2 = addr;
			api('workers').then(function(){
				if (is_home_page() && addr === addr2) Graph_Miner();
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
		$H = $A[addr].stats,
		i = 0,
		cnt = numObj($H),
		points = [],
		pts = '',
		avg = 0,
		max = 0,
		yL = 0,
		xR = right_x,
		yR = 0;

	var hshx = document.getElementById('HashSelect').value == 'raw' ? "hsh" : "hsh2";

	i = cnt;
	while(i--){
		avg = avg + $H[i][hshx];
		if($H[i][hshx] > max) max = $H[i][hshx];
		if($H[i].tme < timefirst) timefirst = $H[i].tme;
	}
	if(max > 0){
		if(timefirst >= timestart) timestart = timefirst;
		max = max * 1.2;
		avg = avg / cnt;
		
		//Create Points
		for(i = 0; i < cnt; i++){
			var x = Rnd(right_x - (now - $H[i].tme) * (right_x / (now - timestart)), 1),
				y = Rnd(height_pad - ($H[i][hshx]) / max * height_pad, 1);
				
			points.push({'x':x, 'y':y, 'tme':$H[i].tme, 'hsh':$H[i][hshx]});
			if(i === 0){
				yL = y;
			}else if(i === (cnt - 1)){
				yR = y;	
			}
		}	

		ins = '<svg viewBox="0 0 '+width+' '+height+'" class="chart mchart">'+
			'<defs>'+
				'<linearGradient id="M"><stop offset="0%" stop-color="#'+$Q.clr.secondary+'" stop-opacity="0.2" /><stop offset="15%" stop-color="#'+$Q.clr.secondary+'" stop-opacity="0.3" /><stop offset="100%" stop-color="#'+$Q.clr.secondary+'" stop-opacity="1" /></linearGradient>'+
			'</defs>';
			
		//Grid Lines
		ins += GraphLib_Grid('line', 5, max, 0, height_pad, width, 'C2');
		
		//Miner Hash Line & Fill
		ins += '<path class="C0fl'+mde+'" stroke="url(#M)" stroke-width="2" d="M'+right_x+','+points[(cnt - 1)].y+' '+GraphLib_Bezier(points)+'M0,'+yR+' 0,'+(height + 3)+' '+(width + 3)+','+(height + 3)+' '+(width + 3)+','+yL+'" />';
		
		//Miner Hash Lables with Vertical Adjust
		var hsh = HashConv($H[0][hshx]), hs_y = yL + 2, lb_y = yL + 11;
		if(yL > (height_pad * .8)){
			hs_y = yL;
			lb_y = yL - 17;
		}
		ins += '<text x="'+(right_x + 4)+'" y="'+hs_y+'" class="txtmed C3fl'+mde+'">'+Rnd(hsh.num, 1, 'txt')+' '+hsh.unit+'</text>'+
		'<text x="'+(right_x + 4)+'" y="'+lb_y+'" class="txttny C3fl'+mde+' o7">Your Hash</text>';
		
		//Miner Hash Dots
		for (var i = 0; i < points.length; i++){
			if(i !== 0 && points[i].x > 50){
				ins += '<circle cx="'+points[i].x+'" cy="'+points[i].y+'" r="2" class="C2fl o8" />'+
					'<circle cx="'+points[i].x+'" cy="'+points[i].y+'" r="4" class="ToolTip C1fl_hov" data-tme="'+points[i].tme+'" data-hsh="'+points[i].hsh+'" />';
			}
		}

		//MinerHash Avg
		var	avg_y = Rnd(height_pad - avg / max * height_pad, 2),
			txt = HashConvStr(avg) + ' Avg ' + Ago(timestart),
			txt_w = txt.length * 5.4;
		if (hshx === "hsh2") $D.miner_hash_avg = avg;
			
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
		api('poolstats').then(function(){
			document.getElementById('PendingPay').innerHTML = Rnd($D.poolstats.pending * $D.miner_hash_avg / $D.poolstats.hashRate, 6, 'txt');
		});
		GraphLib_ToolTipListener();
	}else{
		ErrAlert('MinerGraph', 'NoData');
		ins = '<div id="MinerGraphAlert" class="txtmed C2 o5">'+$$.msg.addr_nodata.head+'</div>';
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
		$W = $A[addr].wrkrs[xid].stats,
		wcnt = numObj($W),
		points = [],
		yL = 0,
		yR = 0,
		mintime = 99999999999,
		ins = '<svg viewBox="0 0 '+width+' '+height+'" class="chart">'+
			'<defs>'+
				'<linearGradient id="F" gradientTransform="rotate(90)"><stop offset="0%" stop-color="#000" stop-opacity="0.07" /><stop offset="100%" stop-color="#000" stop-opacity="0.03" /></linearGradient>'+
			'</defs>';

	var hshx = document.getElementById('HashSelect').value == 'raw' ? "hsh" : "hsh2";
		
	for(i = 0; i < wcnt; i++){
		if($W[i][hshx] > max) max = $W[i][hshx];
		if($W[i].tme < mintime) mintime = $W[i].tme;
	}
	if(max > 0){
		for(i = 0; i < wcnt; i++){
			var x = Rnd(width - (now - $W[i].tme) * (width / (now - mintime)), 1),
				y = Rnd(height - $W[i][hshx] * (height / max), 1);
				
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
	var h = $Q.graph.hrs;
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
				r += '<text x="5" y="'+(ylc + 3)+'" class="'+cls+'fl'+clss+' txttny">' + HashConvStr(yrt * y) + '</text>';
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
			t_v = HashConvStr(el.getAttribute('data-hsh'));
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
			e.setAttribute('x', $R[k].x);
			e.setAttribute('y', $R[k].y);
			
			if($R[k].w) e.setAttribute('width', $R[k].w);
			if($R[k].i) e.innerHTML = $R[k].i;
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
			$L.dec = ',';
		}else if(['IE','MY','PH','SG','TW'].indexOf(b[1]) > -1){
			$L.dec = '·';
		}
		if(brwlng === 'fr-BE' || brwlng === 'fr-CA' || ['AL','AU','BG','CZ','EE','FI','FR','HU','LV','LT','NO','PE','PL','PT','RU','SK','ZA','SE','CH','UA','LK'].indexOf(b[1]) > -1){
			$L.thou = ' ';
		}else if(brwlng === 'de-BE' || ['AR','AT','BA','BR','CL','CO','CR','HR','DK','DE','GR','ID','IT','NL','RO','SI','ES','TR','VN'].indexOf(b[1]) > -1){
			$L.thou = '.';
		}
		if(b[0] === 'en' || b[0] === 'he' || ['CN','CZ','IT','RU'].indexOf(b[1]) > -1){
			$L.perc = '9%';
		}else if(b[1] === 'TR'){
			$L.perc = '%9';
		}
		if(b[0] === 'fr'){
			$L.tme = 'ghi';
		}else if(b[1] === 'DE'){
			$L.tme = 'g.i';
		}else if(brwlng === 'en-CA' || ['AU','BD','EG','IE','IN','MY','MT','MX','NZ','PK','PH','GB','US'].indexOf(b[1]) > -1){
			$L.tme = 'g:i A';
		}
	}
	var tz = new Date().getTimezoneOffset();
	if (tz >= -120 && tz <= 0) {
		$Q.fiat_name = "eur";
		$Q.fiat_symbol = "&euro;"; // EUR symbol
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
	if(tme <= 1) return r;
	r = $L.tme;
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
	return [date.getFullYear(), date.getMonth()+1, date.getDate()].join('/')+' '+r;
}
function AgoTooltip(tme, lbl){
	return '<span title="'+Time(tme)+'">'+Ago(tme, lbl)+'</span>';
}
function Perc(n){
	return $L.perc.replace('9', n);
}
function Num(n){
	n = n || 0;
	return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1'+$L.thou);
}
function NumInput(n){
	n = n || 0;
	if(n.indexOf($L.dec) !== -1){
		var na = n.split($L.dec);
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
			if($L.dec !== '.') n = n.replace('.', $L.dec);
		}
	}else{
		n = Math.round(n);
	}
	return n;
}
function hashToLink(hash, port, type) {
	if (hash == undefined) return 'none';
	var url = port in COINS ? COINS[port].url : "";
	if (port == 11898) {
		return '<a class="C1 hov" target="_blank" href="' + url + '/block.html?hash=' + hash + '">' + hash + '</a>';
	} else {
		return '<a class="C1 hov" target="_blank" href="' + url + '/' + type + '/' + hash + '">' + hash + '</a>';
	}
};
function difficultyToHashRate(hashrate, port) {
	return Math.floor(port in COINS ? hashrate / COINS[port].time : 0);
};
function HashConv(h){
	h = (h > 0) ? h : 0;
	var u = '/s';
	for(var k in $D.hashconv){
		if(h >= $D.hashconv[k]){
			h = h / $D.hashconv[k];
			u = k+u;
			break;
		}
	}
	if(h === 0) u = 'H/s'
	return {'num':Rnd(h, 2), 'unit':u};
}
function HashConvStr(h, unit){
	var h = HashConv(h);
	return h.num + ' ' + (unit ? h.unit.replace(/H\//, unit + '/') : h.unit);
}
function InvalidBlock(){
	return '<span class="C4" title="This is orphan block so there will be no payment for it. It can happen sometimes naturally.">Invalid</span>';
}
function SynchTime(t){
	if(t > now) now = t + 3;
}
function Truncate(s, l){
	return (s && s.length > 0 && l > 0) ? s.length > l ? s.substring(0, l - 3)+ '...' : s : s;
}
function UrlVars(){
    var v = {}, h, p = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < p.length; i++){
        h = p[i].split('=');
        v[h[0]] = h[1] ? h[1] : true;
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