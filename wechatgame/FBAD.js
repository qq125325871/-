class FBAD {
	static getInstance() {return FBAD.instance;}

	constructor(ids){
		let t = this;
		try {
			FBAD.instance = t;

			// console.log('FBAD constructor 1');
			t.ids = ids;
			t.ads = [
				{item:null,loaded:false},
				{item:null,loaded:false},
				{item:null,loaded:false},
				{item:null,loaded:false},
				{item:null,loaded:false},
				{item:null,loaded:false}
			];

			// console.log('FBAD constructor 2');
			t.inter = {
				showTime:0,
				support:true,
			};
			// console.log('FBAD constructor 3');
			t.video = {
				showTime:0,
				support:true,
			};

			t.loadAd(0, true);
			setTimeout(function() { t.loadAd(1); }, 5e3);
			setTimeout(function() { t.loadAd(2); }, 10e3);
			t.loadAd(3);
			setTimeout(function() { t.loadAd(4); }, 15e3);
			setTimeout(function() { t.loadAd(5); }, 20e3);
		} catch (err) {
			t.logEvent('FBAD2_con_Err');
			// console.log('FBAD constructor err:' + err.message);
		}
	}

	loadAd(idx, show) {
		let t = this;
		let info = (idx < 3 ? t.inter : t.video);
		try {
			// console.log('FBAD loadAd() start:' + idx);
			if (!info.support) {
				return;
			}

			let ad = t.ads[idx];

			if(ad.loaded)
				return;

			if(ad.item) {
				t._realLoad(idx, show);
			} else {
				if(idx < 3) {
					FBInstant.getInterstitialAdAsync(t.ids[idx]).then(function (inter) {
						// console.log('FBAD loadAd() getAsync:' + idx + ' success');
						ad.item = inter;
						return t._realLoad(idx, show);
					}).catch(function(e){
						// console.log('FBAD loadAd() getAsync:' + idx + ' catch:' + e.code + e.message);
						if(e.code == 'CLIENT_UNSUPPORTED_OPERATION') {
							info.support = false;
						} else {
							if(e.code == 'UNKNOWN') {
								t.logEvent('FBAD2_get_Unknown', {'type':idx});
							} else {
								t.logEvent('FBAD2_get_Err', {'type':idx,'code':e.code});
							}
							setTimeout(function() { t.loadAd(idx, show); }, 5e3);
						}
					});
				} else {
					FBInstant.getRewardedVideoAsync(t.ids[idx]).then(function (inter) {
						// console.log('FBAD loadAd() getAsync:' + idx + ' success');
						ad.item = inter;
						return t._realLoad(idx, show);
					}).catch(function(e){
						// console.log('FBAD loadAd() getAsync:' + idx + ' catch:' + e.code + e.message);
						if(e.code == 'CLIENT_UNSUPPORTED_OPERATION') {
							info.support = false;
						} else {
							if(e.code == 'UNKNOWN') {
								t.logEvent('FBAD2_get_Unknown', {'type':idx});
							} else {
								t.logEvent('FBAD2_get_Err', {'type':idx,'code':e.code});
							}
							setTimeout(function() { t.loadAd(idx, show); }, 5e3);
						}
					});	
				}
			}
		} catch (err) {
			// console.log('FBAD_loadAd_try_Err:' + idx + ', err:' + err.message);
			t.logEvent('FBAD2_load_try_Err', {'type':idx,'msg':err.message});
		}
	}

	_realLoad(idx, show) {
		// console.log('FBAD _realLoad() start:' + idx);
		let t = this;
		let info = (idx < 3 ? t.inter : t.video);
		let ad = t.ads[idx];
		
		ad.item.loadAsync().then(function () {
			// console.log('FBAD _realLoad():' + idx + ' success');
			ad.loaded = true;
			if(show)
				t.showAd(idx < 3 ? 'inter' : 'video');
		}).catch(function (e) {
			// console.log('FBAD _realLoad() ' + idx + ' catch: ' + e.code + ', ' + e.message);
			if(e.code == 'CLIENT_UNSUPPORTED_OPERATION') {
				info.support = false;
			} else {
				let next = 5e3;
				switch(e.code) {
					case 'ADS_NO_FILL':
						t.logEvent('FBAD2_load_NoFill', {'type':idx});
						next = 3e4;
						break;
					case 'NETWORK_FAILURE':
						t.logEvent('FBAD2_load_NetFail', {'type':idx});
						break;
					case 'ADS_FREQUENT_LOAD':
						t.logEvent('FBAD2_load_Frequent', {'type':idx});
						next = 3e4;
						break;
					case 'UNKNOWN':
						t.logEvent('FBAD2_load_Unknown', {'type':idx});
						break;
					case 'INVALID_PARAM':
						t.logEvent('FBAD2_load_Invalid', {'type':idx});
						break;
					default:
						t.logEvent('FBAD2_load_Err', {'type':idx,'code':e.code});
				}
				setTimeout(function() { t.loadAd(idx, show); }, next);
			}
		});
	}

	canShowInter() {
		let now = new Date().getTime();		
		if(now - this.inter.showTime > 3e4)
			for(let i = 0; i < 3; i++)
				if(this.ads[i].loaded)
					return true;
		return false;
	}

	canShowVideo() {
		for(let i = 3; i < 6; i++)
			if(this.ads[i].loaded)
				return true;
		return false;
	}

	showAd(place, cb) {
		let t = this;
		try {
			// console.log('FBAD showAd() start:' + place);
			if(place == 'video' && !t.video.support)
				place = 'inter';

			let info = null;
			let start = 0;
			if(place == 'inter') {
				info = t.inter;
				let now = new Date().getTime();
				if (!info.support || (now - info.showTime <= 3e4)) {
					// console.log('FBAD showAd() interval too small: ' + (now - info.showTime));
					cb && cb(false);
					return;
				}
			} else {
				info = t.video;
				start = 3;
			}

			let idx = -1;
			for(let i = start; i < start + 3; i++) {
				if(t.ads[i].loaded && !t.ads[i].showing) {
					idx = i;
					break;
				}
			}
			
			if(idx < 0) {
				cb && cb(false);
				return;
			}

			// console.log('FBAD showAd() idx:' + idx);

			let ad = t.ads[idx];
			ad.showing = true;
			if(ad.item) {
				ad.item.showAsync().then(function () {
					// console.log('FBAD showAd() showAsync:' + idx + ' success');
					cb && cb(true);
					ad.loaded = false;
					ad.showing = false;
					ad.item = null;
					info.showTime = new Date().getTime();
					t.loadAd(idx);
				}).catch(function (e) {
					// console.log('FBAD showAd() ' + idx + ' catch:' + e.code + ', ' + e.message);
					cb && cb(false);
					ad.showing = false;
					t.logEvent('FBAD2_show_Err', {'type':idx,'code':e.code});
					if(e.code == 'RATE_LIMITED') {
					} else if(e.code == 'PENDING_REQUEST') {
					} else if(e.code == 'INVALID_PARAM' || e.code == 'UNKNOWN') {
						ad.loaded = false;
						ad.item = null;
						t.loadAd(idx);
					} else {
					}
				});
			} else {
				cb && cb(false);
			}
		} catch (err) {
			// console.log('FBAD showAd ' + place + ' err:' + err.message);
			t.logEvent('FBAD2_show_try_Err', {'type':place,'msg':err.message});
			cb && cb(false);
		}
	}

    logEvent(name, param) {
		FBInstant.logEvent(name, 1, param);
    }
}