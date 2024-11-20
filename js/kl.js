var bgColor = "#1f212d";//背景
var upColor="#F9293E";//涨颜色
var downColor="#00aa3b";//跌颜色

// ma  颜色
var ma5Color = "#39afe6";
var ma10Color = "#da6ee8";
var ma20Color = "#ffab42";
var ma30Color = "#00940b";

/**
 * 15:20 时:分 格式时间增加num分钟
 * @param {Object} time 起始时间
 * @param {Object} num
 */
function addTimeStr(time,num){ 
	var hour=time.split(':')[0];
	var mins=Number(time.split(':')[1]);
	var mins_un=parseInt((mins+num)/60);
	var hour_un=parseInt((Number(hour)+mins_un)/24);
	if(mins_un>0){
		if(hour_un>0){
			var tmpVal=((Number(hour)+mins_un)%24)+"";
			hour=tmpVal.length>1? tmpVal:'0'+tmpVal;//判断是否是一位
		}else{
			var tmpVal=Number(hour)+mins_un+"";
			hour=tmpVal.length>1? tmpVal:'0'+tmpVal;
		}
		var tmpMinsVal=((mins+num)%60)+"";
		mins=tmpMinsVal.length>1? tmpMinsVal:0+tmpMinsVal;//分钟数为 取余60的数
	}else{
		var tmpMinsVal=mins+num+"";
		mins=tmpMinsVal.length>1? tmpMinsVal:'0'+tmpMinsVal;//不大于整除60
	} 
	return hour+":"+mins;
}

//获取增加指定分钟数的 数组  如 09:30增加2分钟  结果为 ['09:31','09:32'] 
function getNextTime(startTime, endTIme, offset, resultArr) {
	var result = addTimeStr(startTime, offset);
	resultArr.push(result);
	if (result == endTIme) {
		return resultArr;
	} else {
		return getNextTime(result, endTIme, offset, resultArr);
	}
}


/**
 * 不同类型的股票的交易时间会不同  
 * @param {Object} type   hs=沪深  us=美股  hk=港股
 */
// var time_arr = function(type) {
// 	if(type.indexOf('us')!=-1){//生成美股时间段
// 		var timeArr = new Array();
// 		timeArr.push('09:30')
// 		return getNextTime('09:30', '16:00', 1, timeArr);
// 	}
// 	if(type.indexOf('hs')!=-1){//生成沪深时间段
// 		var timeArr = new Array();
// 			timeArr.push('09:30');
// 			timeArr.concat(getNextTime('09:30', '11:29', 1, timeArr));
// 			timeArr.push('13:00');
// 			timeArr.concat(getNextTime('13:00', '15:00', 1, timeArr));
// 		return timeArr;
// 	}
// 	if(type.indexOf('hk')!=-1){//生成港股时间段
// 		var timeArr = new Array();
// 			timeArr.push('09:30');
// 			timeArr.concat(getNextTime('09:30', '11:59', 1, timeArr));
// 			timeArr.push('13:00');
// 			timeArr.concat(getNextTime('13:00', '16:00', 1, timeArr));
// 		return timeArr;
// 	}
//
// }


var get_m_data = function(m_data) {
	var priceArr = new Array();
	var avgPrice = new Array();
	var vol = new Array();
	var times = new Array();
	// var times = time_arr(type);
	$.each(m_data.data, function(i, v) {
		times.push(v[0])
		priceArr.push(v[1]);
		avgPrice.push(v[2]);
		vol.push(v[3]); 
	})
	return {
		priceArr: priceArr,
		avgPrice: avgPrice,
		vol: vol,
		times: times
	}
}



//==========================================分时表 option

/**
 * 生成分时option 
 * @param {Object} m_data 分时数据
 * @param {Object} type 股票类型  us-美股  hs-沪深  hk-港股
 */
function initMOption(m_data){
	var m_datas = get_m_data(m_data);
	return {
		tooltip: { //弹框指示器
			trigger: 'axis',
			axisPointer: {
				type: 'cross'
			},
			formatter: function(params, ticket, callback) {
				var i = params[0].dataIndex;
	
				var color;
				if (m_datas.priceArr[i] > m_data.yestclose) {
					color ='style="color:#ff4242"';
				} else {
					color ='style="color:#26bf66"'; 
				}
	
				var html = '<div class="commColor" style="width:100px;"><div>当前价 <span  '+color+' >' + m_datas.priceArr[i] + '</span></div>';
				html += '<div>均价 <span  '+color+' >' + m_datas.avgPrice[i] + '</span></div>';
				html += '<div>涨幅 <span  '+color+' >' + ratioCalculate(m_datas.priceArr[i],m_data.yestclose)+ '%</span></div>';
				html += '<div>成交量 <span  '+color+' >' + m_datas.vol[i] + '</span></div></div>'
				return html;
			}
		},
		legend: { //图例控件,点击图例控制哪些系列不显示
			icon: 'rect',
			type: 'scroll',
			itemWidth: 14,
			itemHeight: 2,
			left: 0,
			top: '-1%',
			textStyle: {
				fontSize: 12,
				color: '#0e99e2'
			}
		},
		axisPointer: {
			show: true
		},
		color: [ma5Color, ma10Color],
		grid: [{
				id: 'gd1',
				left: '0%',
				right: '1%',
				height: '67.5%', //主K线的高度,
				top: '5%'
			},
			{
				id: 'gd2',
				left: '0%',
				right: '1%',
				height: '67.5%', //主K线的高度,
				top: '5%'
			}, {
				id: 'gd3',
				left: '0%',
				right: '1%',
				top: '75%',
				height: '19%' //交易量图的高度
			}
		],
		xAxis: [ //==== x轴
			{ //主图 
				gridIndex: 0,
				data: m_datas.times,
				axisLabel: { //label文字设置
					show: false
				},
				splitLine: {
					show: false,
				}
			},
			{
				show:false,
				gridIndex: 1,
				data: m_datas.times,
				axisLabel: { //label文字设置
					show: false
				},
				splitLine: {
					show: false,
				}
			}, { //交易量图
				splitNumber: 2,
				type: 'category',
				gridIndex: 2,
				data: m_datas.times,
				axisLabel: { //label文字设置
					color: '#9b9da9',
					fontSize: 10
				},
			}
		],
		yAxis: [ //y轴
			{
				gridIndex: 0,
				scale: true, 
				splitNumber: 3,  
				axisLabel: { //label文字设置 
					inside: true, //label文字朝内对齐 
					fontWeight:'bold',
					color:function(val){ 
						if(val==m_data.yestclose){
							return '#aaa'
						}
						return val>m_data.yestclose? upColor:downColor;
					}
				},z:4,splitLine: { //分割线设置
					show: false,
					lineStyle: {
						color: '#181a23'
					}
				},  
			}, { 
				scale: true,  gridIndex: 1, splitNumber: 3,  
				position: 'right', z:4,
				axisLabel: { //label文字设置
					color:function(val){ 
						if(val==m_data.yestclose){
							return '#aaa'
						}
						return val>m_data.yestclose? upColor:downColor; 
					},
					inside: true, //label文字朝内对齐 
					fontWeight:'bold',
					formatter:function(val){
						var resul=ratioCalculate(val,m_data.yestclose);
						return  Number(resul).toFixed(2)+' %'}
				},
				splitLine: { //分割线设置
					show: false,
					lineStyle: {
						color: '#181a23'
					}
				},
				axisPointer:{show:true,
					label:{
						formatter:function(params){ //计算右边Y轴对应的当前价的涨幅比例
							return  ratioCalculate(params.value,m_data.yestclose)+'%';
						}
					}
				}
			}, { //交易图
				gridIndex: 2,z:4,
				splitNumber: 3,
				axisLine: {
					onZero: false
				},
				axisTick: {
					show: false
				},
				splitLine: {
					show: false
				},
				axisLabel: { //label文字设置
					color: '#c7c7c7',
					inside: true, //label文字朝内对齐 
					fontSize: 8
				},
			}
		],
		dataZoom: [
	
		],
		//animation:false,//禁止动画效果
		backgroundColor: bgColor,
		blendMode: 'source-over',
		series: [{
				name: '当前价',
				type: 'line',
				data: m_datas.priceArr,
				smooth: true,
				symbol: "circle", //中时有小圆点 
				lineStyle: {
					normal: {
						opacity: 0.8,
						color: '#39afe6',
						width: 1
					}
				},
				areaStyle: {
					normal: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: 'rgba(0, 136, 212, 0.7)'
						}, {
							offset: 0.8,
							color: 'rgba(0, 136, 212, 0.02)'
						}], false),
						shadowColor: 'rgba(0, 0, 0, 0.1)',
						shadowBlur: 10
					}
				}
			},
			{
				name: '均价',
				type: 'line',
				data: m_datas.avgPrice,
				smooth: true,
				symbol: "circle",
				lineStyle: { //标线的样式
					normal: {
						opacity: 0.8,
						color: '#da6ee8',
						width: 1
					}
				}
			},{  
				type: 'line', 
				data: m_datas.priceArr,
				smooth: true,
				symbol: "none",
				gridIndex: 1,
				xAxisIndex: 1,
				yAxisIndex: 1,
				lineStyle: { //标线的样式 
					normal: { 
						width: 0
					}
				}
			},
			{
				name: 'Volumn',
				type: 'bar',
				gridIndex: 2,
				xAxisIndex: 2,
				yAxisIndex: 2,
				data: m_datas.vol,
				barWidth: '60%',
				itemStyle: {
					normal: {
						color: function(params) {
							var colorList;
							if (m_datas.priceArr[params.dataIndex] > m_datas.priceArr[params.dataIndex-1]) {
								colorList = upColor;
							} else {
								colorList = downColor;
							}
							return colorList;
						},
					}
				}
			}
		]
	};
}



/**
 * 计算价格涨跌幅百分比
 * @param {Object} price 当前价
 * @param {Object} yclose 昨收价
 */
function ratioCalculate(price,yclose){
	return ((price-yclose)/yclose*100).toFixed(3);
}









//数组处理
function splitData(rawData) {
	var datas = []; var times = [];var vols = []; 
	for (var i = 0; i < rawData.length; i++) {
		datas.push(rawData[i]);
		times.push(rawData[i].splice(0, 1)[0]);
		vols.push(rawData[i][4]); 
	}
	return {datas:datas,times:times,vols:vols};
}


//================================MA计算公式
function calculateMA(dayCount,data) {
	var result = [];
	for (var i = 0, len = data.times.length; i < len; i++) {
		if (i < dayCount) {
			result.push('-');
			continue;
		}
		var sum = 0;
		for (var j = 0; j < dayCount; j++) {
			sum += data.datas[i - j][1];
		}
		result.push((sum / dayCount).toFixed(2));
	}
	return result;
}


//=================================================MADC计算公式

var calcEMA,calcSMA,calcSTD,calcDIF,calcDEA,calcMACD,calcRSI,calcOBV,calcMAOBV,calcKDJ,calcBOLL,calcWR;

/*
 * 计算EMA指数平滑移动平均线，用于MACD
 * @param {number} n 时间窗口
 * @param {array} data 输入数据
 * @param {string} field 计算字段配置
 */
calcEMA=function(n,data,field){
    var i,l,ema,a;
    a=2/(n+1);
    if(field){
        //二维数组
        ema=[data[0][field]];  
        for(i=1,l=data.length;i<l;i++){
            ema.push((a*data[i][field]+(1-a)*ema[i-1]).toFixed(2));
        }
    }else{
        //普通一维数组
        ema=[data[0]];
        for(i=1,l=data.length;i<l;i++){
            ema.push((a*data[i]+(1-a)*ema[i-1]).toFixed(3) );
        }
    } 
    return ema;
};

/**
 * 计算SMA简单移动平均线
 * @param {number} n 时间窗口
 * @param {array} data 输入数据
 * @param {string} [field] 计算字段配置，可选，用于二维数组
 * @return {array} SMA数组
 */
calcSMA = function (n, data, field) {
	var i, l, sma, sum;
	var result = [];

	if (field) {
		// 二维数组处理
		for (i = 0, l = data.length; i < l; i++) {
			if (i < n - 1) {
				result.push(null); // 数据不足n个时，SMA为null
				continue;
			}
			sum = 0;
			for (var j = i - n + 1; j <= i; j++) {
				sum += parseFloat(data[j][field]);
			}
			sma = sum / n;
			result.push(sma.toFixed(2)); // 保留两位小数
		}
	} else {
		// 一维数组处理
		for (i = 0, l = data.length; i < l; i++) {
			if (i < n - 1) {
				result.push(null); // 数据不足n个时，SMA为null
				continue;
			}
			sum = 0;
			for (var j = i - n + 1; j <= i; j++) {
				sum += parseFloat(data[j]);
			}
			sma = sum / n;
			result.push(sma.toFixed(3)); // 保留三位小数
		}
	}

	return result;
}

/**
 * 计算标准差
 * @param {number[]} data 输入数据
 * @param {number} n 时间窗口
 * @return {number} 标准差
 */
calcSTD = function (data, n) {
	if (data.length < n) {
		throw new Error('数据不足n个');
	}

	var mean = 0;
	for (var i = 0; i < data.length; i++) {
		mean += data[i];
	}
	mean /= n;

	var sum = 0;
	for (var i = 0; i < data.length; i++) {
		sum += Math.pow(data[i] - mean, 2);
	}
	var std = Math.sqrt(sum / n);

	return std;
}

/**
 * 计算Bollinger Bands
 * @param {number[]} data 输入数据
 * @param {number} n 时间窗口
 * @param {number} k 标准偏差系数，默认为2
 * @return {array} Bollinger Bands数组，包含三部分：移动平均线、上界、下界
 */
calcBOLL = function (data, n, k = 2) {
	if (data.length < n) {
		throw new Error('数据不足n个');
	}

	var ma = [];
	var upper = [];
	var lower = [];

	// 计算移动平均线
	ma = calcSMA(n, data);

	// 计算标准偏差
	var std = calcSTD(data.slice(n - 1), n);

	// 计算BOLL的上界和下界
	for (var i = 0; i < data.length; i++) {
		upper.push(ma[i] + k * std);
		lower.push(ma[i] - k * std);
	}

	return [ma, upper, lower];
}

/**
 * 计算RSI相对强弱指数
 * @param {number} n 时间窗口
 * @param {array} data 输入数据，应为包含价格（如收盘价）的一维数组
 */
calcRSI = function(n, data) {
	var i, l, avgGain, avgLoss, rs, rsi;
	var gains = []; // 存储上涨幅度
	var losses = []; // 存储下跌幅度
	var delta; // 当前价格与前一天价格的差

	// 初始化gains和losses数组，并计算每个时间点的上涨或下跌幅度
	for (i = 1, l = data.length; i < l; i++) {
		delta = data[i] - data[i - 1];
		if (delta > 0) {
			gains.push(delta);
			losses.push(0);
		} else {
			gains.push(0);
			losses.push(-delta);
		}
	}

	// 使用EMA函数计算平均上涨幅度和平均下跌幅度
	avgGain = calcEMA(n, gains)[n - 1]; // 取EMA数组的第n个元素作为平均上涨幅度
	avgLoss = calcEMA(n, losses)[n - 1]; // 取EMA数组的第n个元素作为平均下跌幅度

	// 避免除以0的情况
	if (avgLoss === 0) {
		return 100; // 如果平均下跌幅度为0，则RSI为100
	}

	// 计算RS（相对强度）和RSI（相对强弱指数）
	rs = avgGain / avgLoss;
	rsi = 100 - (100 / (1 + rs));

	return rsi.toFixed(2); // 返回保留两位小数的RSI值
};

// 假设data是一个包含价格和交易量的二维数组，例如：[[price1, volume1], [price2, volume2], ...]
calcOBV = function (data) {
	var obv = [0]; // 初始化OBV数组，第一个值为0
	var previousPrice = data[0][0]; // 记录上一个价格

	for (var i = 1; i < data.length; i++) {
		var currentPrice = data[i][0];
		var volume = data[i][1];
		var sign = currentPrice > previousPrice ? 1 : (currentPrice < previousPrice ? -1 : 0);

		// 计算当前OBV值
		obv.push(obv[i - 1] + sign * volume);

		// 更新上一个价格
		previousPrice = currentPrice;
	}

	return obv;
}

// 使用calcEMA函数来计算MAOBV
calcMAOBV = function (obv, n) {
	return calcEMA(n, obv, null); // OBV是一维数组，所以field参数为null
}

/*
 * 计算DIF快线，用于MACD
 * @param {number} short 快速EMA时间窗口
 * @param {number} long 慢速EMA时间窗口
 * @param {array} data 输入数据
 * @param {string} field 计算字段配置
 */
calcDIF=function(short,long,data,field){
    var i,l,dif,emaShort,emaLong;
    dif=[];
    emaShort=calcEMA(short,data,field);
    emaLong=calcEMA(long,data,field);
    for(i=0,l=data.length;i<l;i++){
        dif.push((emaShort[i]-emaLong[i]).toFixed(3));
    }
    return dif;
};

/*
 * 计算DEA慢线，用于MACD
 * @param {number} mid 对dif的时间窗口
 * @param {array} dif 输入数据
 */
calcDEA=function(mid,dif){
    return calcEMA(mid,dif);
};

/*
 * 计算MACD
 * @param {number} short 快速EMA时间窗口
 * @param {number} long 慢速EMA时间窗口
 * @param {number} mid dea时间窗口
 * @param {array} data 输入数据
 * @param {string} field 计算字段配置
 */
calcMACD=function(short,long,mid,data,field){
    var i,l,dif,dea,macd,result;
    result={};
    macd=[];
    dif=calcDIF(short,long,data,field);
    dea=calcDEA(mid,dif);
    for(i=0,l=data.length;i<l;i++){
        macd.push(((dif[i]-dea[i])*2).toFixed(3));
    }
    result.dif=dif;
    result.dea=dea;
    result.macd=macd;
    return result;
};

/**
 * 计算KDJ指标
 * @param {number} n RSV计算周期，通常为9
 * @param {number[]} high 最高价数组
 * @param {number[]} low 最低价数组
 * @param {number[]} close 收盘价数组
 * @return {{K: number[], D: number[], J: number[]}} 包含K、D、J值的对象
 */
calcKDJ = function (n, high, low, close) {
	var i, l, rsv, k, d, j, kPrev = 50, dPrev = 50;
	var K = [], D = [], J = [];

	for (i = 0, l = n-1; i < l; i++) {
		K.push(null);
		D.push(null);
		J.push(null);
	}

	// 计算RSV数组
	var rsvArray = [];
	for (i = 0, l = close.length; i < l; i++) {
		if (i < n - 1) {
			// rsvArray.push(null); // 前n-1天数据不足，设为null
			continue;
		}
		var highMax = Math.max(...high.slice(i - n + 1, i + 1));
		var lowMin = Math.min(...low.slice(i - n + 1, i + 1));
		rsv = (close[i] - lowMin) / (highMax - lowMin) * 100;
		rsvArray.push(rsv);
	}

	// 计算K、D、J值
	for (i = 0, l = rsvArray.length; i < l; i++) {
		if (i === 0) {
			K.push(50); // 初始值设为50
			D.push(50); // 初始值设为50
		} else {
			k = (2 / 3) * kPrev + (1 / 3) * rsvArray[i];
			K.push(k);
			d = (2 / 3) * dPrev + (1 / 3) * k;
			D.push(d);
			kPrev = k;
			dPrev = d;
		}
		j = 3 * K[i] - 2 * D[i];
		J.push(j);
	}

	return { K: K, D: D, J: J };
}

/**
 * 计算威廉指标WR
 * @param {number[]} high 最高价数组
 * @param {number[]} low 最低价数组
 * @param {number[]} close 收盘价数组
 * @param {number} n 时间窗口
 * @return {array} WR数组
 */
calcWR = function (high, low, close, n) {
	var i, l, range, wr, result = [];

	if (high.length !== low.length || low.length !== close.length) {
		throw new Error('数据长度不一致');
	}

	if (high.length < n) {
		throw new Error('数据不足n个');
	}

	for (i = 0, l = high.length; i < l; i++) {
		if (i < n - 1) {
			result.push(null); // 数据不足n个时，WR为null
			continue;
		}

		range = Math.max(...high.slice(i - n + 1, i + 1)) - Math.min(...low.slice(i - n + 1, i + 1));
		wr = (close[i] - Math.max(...high.slice(i - n + 1, i + 1))) / range * 100;
		result.push(wr.toFixed(2)); // 保留两位小数
	}

	return result;
}

/**
 * 计算ROC指标
 * @param {number[]} prices 股票价格数组
 * @param {number} n 时间窗口
 * @return {number} ROC值
 */
calcROC=function (prices, n) {
	if (prices.length < n + 1) {
		throw new Error('数据不足n+1个');
	}

	var roc = [];

	for (var i = n; i < prices.length; i++) {
		var change = (prices[i] - prices[i - n]) / prices[i - n];
		roc.push(change);
	}

	// 如果需要，可以计算平均值、中位数、标准差等统计量
	// 例如：
	// var mean = calcSTD(roc, roc.length);

	return roc;
}

calcMAROC = function (roc, n) {
	return calcSMA(n, roc);
}
 
 //=================================================MADC计算公式 end


function initKOption(cdata){
	var data = splitData(cdata.kl);
	// var data = cdata.kl15;
	// var macd=calcMACD(12,26,9,data.datas,1);
	// var kdj=calcKDJ(data.datas,9,3,3);
	return {
			tooltip: { //弹框指示器
				trigger: 'axis',
				axisPointer: {
					type: 'cross'
				}
			},
			legend: { //图例控件,点击图例控制哪些系列不显示
				icon: 'rect', 
				type:'scroll',
				itemWidth: 14,
				itemHeight: 2,
				left: 0,
				top: '-1%',  
				animation:true,
				textStyle: {
					fontSize: 12,
					color: '#0e99e2'
				},
				pageIconColor:'#0e99e2'
			},
			axisPointer: {
				show: true
			},
			color: [ma5Color, ma10Color, ma20Color, ma30Color],
			grid: [{
				id: 'gd1',
				left: '0%',
				right: '1%',
				height: '30%', //0.主K线的高度,
				top: '1%'
			}, {
				left: '0%',
				right: '1%',
				top: '30%',
				height: '10%' //1.交易量图的高度
			}, {
				left: '0%',
				right: '1%',
				top: '40%', //2.MACD 指标
				height: '10%'
			}, {
				left: '0%',
				right: '1%',
				top: '50%', //3.KDJ 指标
				height: '10%'
			}, {
				left: '0%',
				right: '1%',
				top: '60%', //4.OBV 指标
				height: '10%'
			}, {
				left: '0%',
				right: '1%',
				top: '70%', //5.RSI 指标
				height: '10%'
			}, {
				left: '0%',
				right: '1%',
				top: '80%', //6.WR 指标
				height: '10%'
			}, {
				left: '0%',
				right: '1%',
				top: '90%', //7.WR 指标
				height: '9%'
			}],
			xAxis: [ //==== x轴
				{ //主图
					type: 'category',
					data: data.times,
					scale: true,
					boundaryGap: false,
					axisLine: {
						onZero: false
					},
					axisLabel: { //label文字设置
						show: false
					},
					splitLine: {
						show: false,
						lineStyle: {
							color: '#3a3a3e'
						}
					},
					splitNumber: 20,
					min: 'dataMin',
					max: 'dataMax'
				}, { //交易量图
					type: 'category',
					gridIndex: 1,
					data: data.times,
					axisLabel: { //label文字设置
						color: '#9b9da9',
						fontSize: 10
					},
				}, { //幅图
					type: 'category',
					gridIndex: 2,
					data: data.times,
					axisLabel: {
						show: false
					}
				}, { //幅图
					type: 'category',
					gridIndex: 3,
					data: data.times,
					axisLabel: {
						show: false
					}
				}, { //KDJ
					type: 'category',
					gridIndex: 4,
					data: data.times,
					axisLabel: {
						show: false
					}
				}, { //幅图
					type: 'category',
					gridIndex: 5,
					data: data.times,
					axisLabel: {
						show: false
					}
				}, { //幅图
					type: 'category',
					gridIndex: 6,
					data: data.times,
					axisLabel: {
						show: false
					}
				}, { //幅图
					type: 'category',
					gridIndex: 7,
					data: data.times,
					axisLabel: {
						show: false
					}
				}
			],
			yAxis: [ //y轴
				{ //==主图
					scale: true,
					z:4,
					axisLabel: { //label文字设置
						color: '#c7c7c7',
						inside: true, //label文字朝内对齐
					},
					splitLine: { //分割线设置
						show: false,
						lineStyle: {
							color: '#181a23'
						}
					},
				}, { //交易图
					gridIndex: 1, splitNumber: 3, z:4,
					axisLine: {
						onZero: false
					},
					axisTick: {
						show: false
					},
					splitLine: {
						show: false
					},
					axisLabel: { //label文字设置
						color: '#c7c7c7',
						inside: true, //label文字朝内对齐 
						fontSize: 8
					},
				}, { //幅图
					z:4, gridIndex: 2,splitNumber: 4,
					axisLine: {
						onZero: false
					},
					axisTick: {
						show: false
					},
					splitLine: {
						show: false
					},
					axisLabel: { //label文字设置
						color: '#c7c7c7',
						inside: true, //label文字朝内对齐 
						fontSize: 8
					},
				}, { //幅图
					z:4, gridIndex: 3,splitNumber: 4,
					axisLine: {
						onZero: false
					},
					axisTick: {
						show: false
					},
					splitLine: {
						show: false
					},
					axisLabel: { //label文字设置
						color: '#c7c7c7',
						inside: true, //label文字朝内对齐
						fontSize: 8
					},
				}, { //幅图
					z:4, gridIndex: 4,splitNumber: 4,
					axisLine: {
						onZero: false
					},
					axisTick: {
						show: false
					},
					splitLine: {
						show: false
					},
					axisLabel: { //label文字设置
						color: '#c7c7c7',
						inside: true, //label文字朝内对齐
						fontSize: 8
					},
				}, { //幅图
					z:4, gridIndex: 5,splitNumber: 4,
					min: 'dataMin',
					max: 'dataMax',
					axisLine: {
						onZero: false
					},
					axisTick: {
						show: false
					},
					splitLine: {
						show: false
					},
					axisLabel: { //label文字设置
						color: '#c7c7c7',
						inside: true, //label文字朝内对齐
						fontSize: 8
					},
				}, { //幅图
					z:4, gridIndex: 6,splitNumber: 4,
					axisLine: {
						onZero: false
					},
					axisTick: {
						show: false
					},
					splitLine: {
						show: false
					},
					axisLabel: { //label文字设置
						color: '#c7c7c7',
						inside: true, //label文字朝内对齐
						fontSize: 8
					},
				}, { //幅图
					z:4, gridIndex: 7,splitNumber: 4,
					axisLine: {
						onZero: false
					},
					axisTick: {
						show: false
					},
					splitLine: {
						show: false
					},
					axisLabel: { //label文字设置
						color: '#c7c7c7',
						inside: true, //label文字朝内对齐
						fontSize: 8
					},
				}
			],
			dataZoom: [{
					type: 'slider',
					xAxisIndex: [0, 1, 2, 3, 4, 5, 6, 7], //控件联动
					start: 100,
					end: 80,
					throttle: 10,
					top: '99%',
					height: '1%',
					borderColor: '#696969',
					textStyle: {
						color: '#dcdcdc'
					},
					handleSize: '90%', //滑块图标
					handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
					dataBackground: {
						lineStyle: {
							color: '#fff'
						}, //数据边界线样式
						areaStyle: {
							color: '#696969'
						} //数据域填充样式
					}
				},
				// 		{
				// 			type: 'inside',
				// 			xAxisIndex: [0,1,2],//控件联动
				// 		},
			],
			animation: false, //禁止动画效果
			backgroundColor: bgColor,
			blendMode: 'source-over',
			series: [{
					name: 'K线周期图表',
					type: 'candlestick',
					data: data.datas,
					barWidth: '55%',
					large: true,
					largeThreshold: 100,
					itemStyle: {
						normal: {
							color: upColor, //fd2e2e  ff4242
							color0: downColor,
							borderColor: upColor,
							borderColor0: downColor,
		
							//opacity:0.8
						}
					},
		
				}, {
					name: 'MA5',
					type: 'line',
					data: calculateMA(5,data),
					smooth: true,
					symbol: "none", //隐藏选中时有小圆点
					lineStyle: {
						normal: {
							opacity: 0.8,
							color: '#39afe6',
							width: 1
						}
					},
				},
				{
					name: 'MA10',
					type: 'line',
					data: calculateMA(10,data),
					smooth: true,
					symbol: "none",
					lineStyle: { //标线的样式
						normal: {
							opacity: 0.8,
							color: '#da6ee8',
							width: 1
						}
					}
				},
				{
					name: 'MA20',
					type: 'line',
					data: calculateMA(20,data),
					smooth: true,
					symbol: "none",
					lineStyle: {
						opacity: 0.8,
						width: 1,
						color: ma20Color
					}
				},
				{
					name: 'MA30',
					type: 'line',
					data: calculateMA(30,data),
					smooth: true,
					symbol: "none",
					lineStyle: {
						normal: {
							opacity: 0.8,
							width: 1,
							color: ma30Color
						}
					}
				}, {
					name: 'Volumn',
					type: 'bar',
					xAxisIndex: 1,
					yAxisIndex: 1,
					data: data.vols,
					barWidth: '60%',
					itemStyle: {
						normal: {
							color: function(params) {
								var colorList;
								if (data.datas[params.dataIndex][1] > data.datas[params.dataIndex][0]) {
									colorList = upColor;
								} else {
									colorList = downColor;
								}
								return colorList;
							},
						}
					}
				}, {
					name: 'Vol-MA5',
					type: 'line',
					xAxisIndex: 1,
					yAxisIndex: 1,
					data: cdata.mavol1,
					smooth: false,
					symbol: "none",
					lineStyle: {
						normal: {
							opacity: 0.8,
							width: 1,
							color: ma5Color
						}
					}
				}, {
					name: 'Vol-MA10',
					type: 'line',
					xAxisIndex: 1,
					yAxisIndex: 1,
					data: cdata.mavol2,
					smooth: false,
					symbol: "none",
					lineStyle: {
						normal: {
							opacity: 0.8,
							width: 1,
							color: ma10Color
						}
					}
				}, {
					name: 'Vol-MA50',
					type: 'line',
					xAxisIndex: 1,
					yAxisIndex: 1,
					data: cdata.mavol3,
					smooth: false,
					symbol: "none",
					lineStyle: {
						normal: {
							opacity: 0.8,
							width: 1,
							color: ma30Color
						}
					}
				}, {
					name: 'MACD',
					type: 'bar',
					xAxisIndex: 2,
					yAxisIndex: 2,
					data: cdata.macd,
					barWidth: '40%',
					itemStyle: {
						normal: {
							color: function(params) {
								var colorList;
								if (params.data >= 0) {
									colorList = upColor;
								} else {
									colorList = downColor;
								}
								return colorList;
							},
						}
					}
				}, {
					name: 'DIF',
					type: 'line',
					symbol: "none",
					xAxisIndex: 2,
					yAxisIndex: 2,
					data: cdata.dif,
					lineStyle: {
						normal: {
							color: '#da6ee8',
							width: 1
						}
					}
				}, {
					name: 'DEA',
					type: 'line',
					symbol: "none",
					xAxisIndex: 2,
					yAxisIndex: 2,
					data: cdata.dea,
					lineStyle: {
						normal: {
							opacity: 0.8,
							color: '#39afe6',
							width: 1
						}
					}
				}, {
					name: 'KDJ-K',
					type: 'line',
					symbol: "none",
					xAxisIndex: 3,
					yAxisIndex: 3,
					data: cdata.k,
					lineStyle: {
						normal: {
							opacity: 0.8,
							color: '#000000',
							width: 1
						}
					}
				}, {
					name: 'KDJ-D',
					type: 'line',
					symbol: "none",
					xAxisIndex: 3,
					yAxisIndex: 3,
					data: cdata.d,
					lineStyle: {
						normal: {
							opacity: 0.8,
							color: '#f1cd1d',
							width: 1
						}
					}
				}, {
					name: 'KDJ-J',
					type: 'line',
					symbol: "none",
					xAxisIndex: 3,
					yAxisIndex: 3,
					data: cdata.j,
					lineStyle: {
						normal: {
							opacity: 0.8,
							color: '#9839e6',
							width: 1
						}
					}
				}, {
					name: 'OBV',
					type: 'line',
					symbol: "none",
					xAxisIndex: 4,
					yAxisIndex: 4,
					data: cdata.obv,
					lineStyle: {
						normal: {
							opacity: 0.8,
							color: '#39e656',
							width: 1
						}
					}
				}, {
					name: 'MAOBV',
					type: 'line',
					symbol: "none",
					xAxisIndex: 4,
					yAxisIndex: 4,
					data: cdata.maobv,
					lineStyle: {
						normal: {
							opacity: 0.8,
							color: '#9839e6',
							width: 1
						}
					}
				}, {
					name: 'BOLL-UP',
					type: 'line',
					symbol: "none",
					xAxisIndex: 5,
					yAxisIndex: 5,
					data: cdata.boll_up,
					lineStyle: {
						normal: {
							opacity: 0.8,
							color: '#2066c0',
							width: 1
						}
					}
				}, {
					name: 'BOLL-MD',
					type: 'line',
					symbol: "none",
					xAxisIndex: 5,
					yAxisIndex: 5,
					data: cdata.boll_md,
					lineStyle: {
						normal: {
							opacity: 0.8,
							color: '#a420ad',
							width: 1
						}
					}
				}, {
					name: 'BOLL-DN',
					type: 'line',
					symbol: "none",
					xAxisIndex: 5,
					yAxisIndex: 5,
					data: cdata.boll_dn,
					lineStyle: {
						normal: {
							opacity: 0.8,
							color: '#ad8020',
							width: 1
						}
					}
				}, {
					name: 'RSI-1',
					type: 'line',
					symbol: "none",
					xAxisIndex: 6,
					yAxisIndex: 6,
					data: cdata.rsi_1,
					lineStyle: {
						normal: {
							opacity: 0.8,
							color: '#2066c0',
							width: 1
						}
					}
				}, {
					name: 'RSI-2',
					type: 'line',
					symbol: "none",
					xAxisIndex: 6,
					yAxisIndex: 6,
					data: cdata.rsi_2,
					lineStyle: {
						normal: {
							opacity: 0.8,
							color: '#ad8020',
							width: 1
						}
					}
				}, {
					name: 'RSI-3',
					type: 'line',
					symbol: "none",
					xAxisIndex: 6,
					yAxisIndex: 6,
					data: cdata.rsi_3,
					lineStyle: {
						normal: {
							opacity: 0.8,
							color: '#8d0f74',
							width: 1
						}
					}
				}, {
					name: 'WR-5',
					type: 'line',
					symbol: "none",
					xAxisIndex: 7,
					yAxisIndex: 7,
					data: cdata.wr1,
					lineStyle: {
						normal: {
							opacity: 0.8,
							color: '#ad8020',
							width: 1
						}
					}
				}, {
					name: 'WR-10',
					type: 'line',
					symbol: "none",
					xAxisIndex: 7,
					yAxisIndex: 7,
					data: cdata.wr2,
					lineStyle: {
						normal: {
							opacity: 0.8,
							color: '#0f5d8d',
							width: 1
						}
					}
				}
			]
		};
		
		
}
 


 