const FILTER_KEY = require('./validate/keysearch');
const cheerio = require('cheerio');
const request = require('request-promise');

let waitTime = function (time) {
	return new Promise(resolve => {
		setTimeout(function () {
			return resolve(time);
		}, time);
	});
};
let dynamicSort = function (property) {
	let sortOrder = 1;
	if (property[0] === '-') {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function (a, b) {
		let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
		return result * sortOrder;
	};
};

module.exports = async ({keyword, one},userId) => {
  /*
  const request = (option)=>{
      return new Promise(resolve=>{
          socket.emit('request',option,function (data) {
              return resolve(data)
          })
      })
  };
  */

  let getPriceInItemShopee = async (shopId, itemID) => {
  	let data = {
  		id: null,
  		price: 0,
  		name: null
  	};
  	try {
  		let options = {
  			url: 'https://shopee.vn/api/v2/item/get?itemid=' + itemID + '&shopid=' + shopId,
  			method: 'GET',
  			headers: {
  				'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36'
  			}
  		};
  		let body = await request(options);
  		let {item: {name, price_min, itemid}} = JSON.parse(body);
  		return {
  			id: itemID.toString(),
  			shopKey: shopId.toString(),
  			shopId,
  			name,
  			price: parseInt(price_min.toString().slice(0, -5)),
  			link: 'https://shopee.vn/product/' + shopId + '/' + itemid
  		};
  	} catch (e) {
  		if (!e.response) {
  			return await getPriceInItemShopee(shopId, itemID);
  		}
  	}
  	return data;
  };
  let getNameOfShop = async (shopId)=>{
  	let options = {
  		url:'https://shopee.vn/api/v2/shop/get?shopid='+shopId,
  		method:'GET',
  		headers:{
  			'x-api-source': 'pc',
  			'x-requested-with': 'XMLHttpRequest',
  			'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'
  		}
  	};
  	let responseText = await request(options);
  	let {data:{name}} = JSON.parse(responseText);
  	return name;
  };
  let tikiMIN_products = async id => {
  	let options = {
  		url: 'https://tiki.vn/api/v2/products/' + id + '?include=tag,images,gallery,promotions,badges,stock_item,variants,product_links,discount_tag',
  		method: 'GET',
  		headers: {
  			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36'
  		}
  	};
  	let responseText = await request(options);
  	let {name, url_key, current_seller, other_sellers} = JSON.parse(responseText);
  	if (!current_seller) {
  		return [];
  	}
  	(other_sellers || []).push(current_seller);
  	return other_sellers.map(e => {
  		return {
  			id: e.product_id,
  			shopKey: e.store_id,
  			shopName: e.name,
  			price: parseInt(e.price),
  			name,
  			link: 'https://tiki.vn/' + url_key + '.html?spid=' + e.product_id
  		};
  	});

  };


// --------------------------------------------------------


let shopeeMIN = async ({newest = 0, result = []} = {}) => {
	let option = {
		method: 'GET',
		url: 'https://shopee.vn/api/v2/search_items/?by=relevancy&keyword=' + encodeURIComponent(keyword) + '&limit=50&newest=' + newest + '&order=desc&page_type=search',
		headers: {
			'sec-fetch-mode': 'cors',
			'sec-fetch-site': 'same-origin',
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
			'x-api-source': 'pc',
			'x-requested-with': 'XMLHttpRequest'
		}
	};
	let body = await request(option);
	let {items, total_count} = JSON.parse(body);

	if ((parseInt(total_count) > 500) && (!one) ) {
		throw 'Có khoảng ' + total_count + ' kết quả.Từ khóa ' + keyword + ' quá phổ cập.Quý khách vui lòng sửa lại nội dung từ khóa chi tiết để tìm kiếm chính xác hơn. CẤU TRÚC TỪ KHÓA : Tên Thương Hiệu + Model';
	}

	items = [...new Map(items.map(item => [item.itemid, item])).values()];

	let priceMap = items.map(e => getPriceInItemShopee(e.shopid, e.itemid));
	let priceMapAction = await Promise.all(priceMap);

	let data = await FILTER_KEY(keyword, priceMapAction);
	if (data.length > 0) {
		data = data.map((e, index) => {
			e.level = {};
			e.level.page = parseInt(newest) % 20 + 1;
			e.level.position = index + 1;
			return e;
		});
		result = result.concat(data);
		if (!one && parseInt(total_count) > ((newest / 20) + 1) * 50) {
			return await shopeeMIN({
				newest: newest += 20,
				result
			});
		}
	}

	let sort = result.sort(dynamicSort('price'));
	let TopItemName = sort.slice(0, 6);
	let TopItemNotName = sort.slice(6);
	let ItemName_MAP = TopItemName.map(async e => {
		e.shopName = await getNameOfShop(e.shopId);
		return e;
	});
	let ItemName = await Promise.all(ItemName_MAP);

	result = ItemName.concat(TopItemNotName);
	return {shopee: result};

};

let lazadaMIN = async ({page = 1, result = []} = {}) => {
	let cookie_obj = await Cookie.find({ecom_name:'lazada',userId});
	let cookie = (cookie_obj.length > 0)?cookie_obj[0].cookie:'';
	let option = {
		method: 'GET',
		url: 'https://www.lazada.vn/catalog/?_keyori=ss&ajax=true&from=input&page=' + page + '&q=' + encodeURIComponent(keyword) + '&spm=a2o4n.searchlist.search.go.30ba4104kn4ysg',
		headers: {
			'accept': 'application/json, text/plain, */*',
			cookie,
			'pragma': 'no-cache',
			'sec-fetch-mode': 'cors',
			'sec-fetch-site': 'same-origin',
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
		}
	};
	let body = await request(option);
	if(!JSON.parse(body).mods) {
		await Cookie.destroy({ecom_name:'lazada',userId});
		throw 1006;
	}
	let {mainInfo: {totalResults}, mods:{listItems}} = JSON.parse(body);

	if ((parseInt(totalResults) > 500) && !one) {
		throw 'Có khoảng ' + totalResults + ' kết quả.Từ khóa ' + keyword + ' quá phổ cập.Quý khách vui lòng sửa lại nội dung từ khóa chi tiết để tìm kiếm chính xác hơn. CẤU TRÚC TỪ KHÓA : Tên Thương Hiệu + Model';
	}
	if(!listItems) return {lazada:result};

	listItems = listItems.map(e => {
		return {
			id: e.itemId,
			shopKey: e.sellerId,
			shopName: e.sellerName,
			price: parseInt(e.price),
			name: e.name,
			link: 'https:' + e.productUrl
		};
	});
	let data = await FILTER_KEY(keyword, listItems);
	if (data.length > 0) {
		data = data.map((e, index) => {
			e.level = {};
			e.level.page = page;
			e.level.position = index + 1;
			return e;
		});
		result = result.concat(data);
		if (!one && parseInt(totalResults) > page * 40) {
			await waitTime(5000);
			return await lazadaMIN({page: page += 1, result});
		}
	}
	return {lazada: result};
};

let sendoMIN = async ({p = 1, result = []} = {}) => {
	let option = {
		method: 'GET',
		url: 'https://www.sendo.vn/m/wap_v2/search/product?p=' + p + '&q=' + encodeURIComponent(keyword) + '&s=60&search_algo=algo5&sortType=rank',
		headers: {
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
		}
	};
	let body = await request(option);
	let {result: {data, meta_data: {total_count}}} = JSON.parse(body);

	if ((parseInt(total_count) > 500) && !one) {
		throw 'Có khoảng ' + total_count + ' kết quả.Từ khóa ' + keyword + ' quá phổ cập.Quý khách vui lòng sửa lại nội dung từ khóa chi tiết để tìm kiếm chính xác hơn. CẤU TRÚC TỪ KHÓA : Tên Thương Hiệu + Model';
	}

	let priceMap = data.map(e => {
		return {
			id: e.product_id.toString(),
			shopKey: e.shop_info.shop_name,
			shopName: e.shop_info.shop_name,
			price: e.final_price,
			name: e.name,
			link: 'https://sendo.vn/' + e.cat_path
		};
	});

	let dataALL = await FILTER_KEY(keyword, priceMap);
	if (dataALL.length > 0) {
		dataALL = dataALL.map((e, index) => {
			e.level = {};
			e.level.page = p;
			e.level.position = index + 1;
			return e;
		});
		result = result.concat(dataALL);
		if (!one && parseInt(total_count) > p * 60) {
			return await sendoMIN({p: p += 1, result});
		}
	}
	return {sendo: result};
};

let tikiMIN = async ({page = 1, result = []} = {}) => {
	let options = {
		url:'https://tiki.vn/search?q='+encodeURIComponent(keyword)+'&order=price%2Casc',
		method:'GET'
	};
	let responseHTML = await request(options);
	let $ = cheerio.load(responseHTML);
	let data = [];
	$("div.product-item").each(function(){
		let name = $(this).attr('data-title');
		let price = parseInt($(this).attr('data-price'));
		let id = $(this).attr('data-id');
		if(price) data.push({name,price,id})
	});
	let start_slice_total = responseHTML.indexOf('totalResults:')+'totalResults:'.length;
	let end_slice_total = responseHTML.indexOf('}',start_slice_total);
	let total = parseInt(responseHTML.slice(start_slice_total,end_slice_total));
	if ((parseInt(total) > 500) && !one) {
		throw 'Có khoảng ' + total + ' kết quả.Từ khóa ' + keyword + ' quá phổ cập.Quý khách vui lòng sửa lại nội dung từ khóa chi tiết để tìm kiếm chính xác hơn. CẤU TRÚC TỪ KHÓA : Tên Thương Hiệu + Model';
	}

	let priceMap = await FILTER_KEY(keyword, data);

	if (priceMap.length > 0) {
		let list_id = priceMap.map(({id}) => id);
		let dataALL = [];
		for (let id of list_id) {
			let arr_min = await tikiMIN_products(id);
			dataALL = dataALL.concat(arr_min);
		}
		dataALL = dataALL.map((e, index) => {
			e.level = {};
			e.level.page = page;
			e.level.position = index + 1;
			return e;
		});
		result = result.concat(dataALL);
		if (!one && parseInt(total) > page * 48) {
			return await tikiMIN({page: page += 1, result});
		}
	}
	return {tiki: result};
};

let adayroiMIN = async () => {
	let options = {
		url:'https://rest.adayroi.com/cxapi/v2/adayroi/suggestions?term='+encodeURIComponent(keyword)+'&maxProducts=1000000000',
		method:'GET'
	};
	let responseText = await request(options);
	let {productDatas} = JSON.parse(responseText);
	let data = (productDatas || []).map(({code,name,offerPrice:{value},url})=>({
		id:code.split('_')[0],
		name,
		price:value,
		link:'https://adayroi.com'+url,
		shopKey:code.split('_')[1],
	}));

	return {adayroi:await FILTER_KEY(keyword, data)};

};

try{
	let list = [
	lazadaMIN(),
	shopeeMIN(),
	sendoMIN(),
	tikiMIN(),
	adayroiMIN()
	];
	let result = await Promise.all(list);
	return {data:Object.assign(...result)};


}catch(errorCode){
	return {errorCode};
}
};

