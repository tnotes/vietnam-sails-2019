const FILTER_KEY = require('./validate/keysearch');
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

module.exports = async ({keyword, one}) => {
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
    try {
      let option = {
        method: 'GET',
        url: 'https://www.lazada.vn/catalog/?_keyori=ss&ajax=true&from=input&page=' + page + '&q=' + encodeURIComponent(keyword) + '&spm=a2o4n.searchlist.search.go.30ba4104kn4ysg',
        headers: {
          'accept': 'application/json, text/plain, */*',
          'cookie': 'lzd_cid=63d123ae-f716-47be-dea6-1c0a22e1c4f2; t_uid=63d123ae-f716-47be-dea6-1c0a22e1c4f2; hng=VN|vi|VND|704; userLanguageML=vi; _bl_uid=Uwknq3tIn57rIw8pIa10eOsraydq; t_fv=1575250088046; cna=qFZrFu0lCDsCASpy6tbWpOrb; cto_lwid=46fb589b-f95c-418a-8d21-65ff12f6058a; _fbp=fb.1.1575250090180.1832363621; _ga=GA1.2.1492101843.1575250104; _gid=GA1.2.2084598412.1575250104; lzd_sid=1d9df10d841371b75fc07c2eb476be94; _tb_token_=e6d978bbebbe8; t_sid=dCHbZrWOLVCAIi5wM9O9HUV2vZZJimNG; utm_channel=NA; _m_h5_tk=e7c82bece2376796a79780faf4ac5c72_1575357823100; _m_h5_tk_enc=bb3a977900aa2b8d32699af626987045; Hm_lvt_7cd4710f721b473263eed1f0840391b4=1575350627; Hm_lpvt_7cd4710f721b473263eed1f0840391b4=1575350640; x5sec=7b22617365727665722d6c617a6164613b32223a226432373230383830613132646530626365303463336266386664636466363036434f37696c2b3846454f6e45786f4b5539634f663251453d227d; l=dB_B0rfrq5MEr052BOCZhurza779IIRx1uPzaNbMi_5Q668qAbbOk3MJzFJ6DAWfGiLB4yMnk_e9-etXZaqT9E2J1zKJVxDc.; isg=BBgYtGm-8R5_Lt2balDAGbOg6UCqAXyL3gdPfFIJZtMO7bjX-hIwGQHPIH34CjRj; useragent=TW96aWxsYS81LjAgKE1hY2ludG9zaDsgSW50ZWwgTWFjIE9TIFggMTBfMTVfMSkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzc4LjAuMzkwNC4xMDggU2FmYXJpLzUzNy4zNg%3D%3D; ',
          'pragma': 'no-cache',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
          'x-csrf-token': '73e09e7767991',
          'x-requested-with': 'XMLHttpRequest',
          'x-ua': '120#bX1bSwNfikvVY6jUgbYr9TTfbEt9snA4zZbvJS+X1/L9oN+e2LQUXShX1UMVKhG1sZUd71URBZcT5tXbIGEvzuA0+LrC5BefpYU26yuxjuUrdwZX+OGhlnp0EpMW0TLZDPvDNOXeN7pCLf+YqiCyfXAnOlrcIvUtHhDkM/tNVYm8rPaonPp9xJvr7YIqrWxccsm41IBOprDYbI/VI2cozwi7gMTFxdeBWj/lYig/y15jTuNbNlICbbxpbU+VyYIOb5DW7qMryTn07UyyNWc/JvbW7eMPPXISb5GsF/+CNv8b8ZFAb1G74JiugngQ+WKm9/2F5ffRahMbKYjyKE8AXbcA5jsCEhFRS/oafk2YS8jTtQC4F/iZxUnpq/uY7nOcZvYPyTTwHv9APgrNOF7wP5Ua/rNUBFouRSI1vzy6jVM0jGE5tg7d6OLl4kV2GDsJtExrbWkuSNg/y3FJElhdlUWBRk6xlX3lRnGjlUt1jyeyzJ2yHhy+bJLeUYvdGqmn90vvGqf13FyojQBOGlGDWGBGUKVZAM8l8AXE5zioV2XcWKZYUD8704WcGncFMFGqahd/k7oxK3760LA4e+xiUVibELwn3wDTIIUPQ97ZMxv5+wtosGHFRljcNRjESkYx1nRdQIg1tiL6RAGz125r51D2nIFntXgCXksd+qb0+prms46R3/YHTFYni9usqbl11gOl5k+ZCY08q/NuIv==',
          'x-umidtoken': 'T15AF34A05F52802ACB8F143C71D5B88B2EB68AEB69F016C190CBDC5EAC'
        }
      };
      let body = await request(option);
      let {mainInfo: {totalResults}, mods} = JSON.parse(body);

      if ((parseInt(totalResults) > 500) && !one) {
        throw 'Có khoảng ' + totalResults + ' kết quả.Từ khóa ' + keyword + ' quá phổ cập.Quý khách vui lòng sửa lại nội dung từ khóa chi tiết để tìm kiếm chính xác hơn. CẤU TRÚC TỪ KHÓA : Tên Thương Hiệu + Model';
      }

      if (!mods) {
        return {lazada: result};
      }

      let priceMap = mods['listItems'];

      if (!priceMap) {
        return {lazada: result};
      }

      priceMap = priceMap.map(e => {
        return {
          id: e.itemId,
          shopKey: e.sellerId,
          shopName: e.sellerName,
          price: parseInt(e.price),
          name: e.name,
          link: 'https:' + e.productUrl
        };
      });
      let data = await FILTER_KEY(keyword, priceMap);
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
    } catch (e) {
      console.log('lazada:' + e);

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
    let option = {
      method: 'GET',
      url: 'https://tiki.vn/api/v2/products?q='+encodeURIComponent(keyword)+'&limit=48&order=price%2Casc&page=1&include=badges,product_links,brand,category,stock_item&aggregations=1',
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
      }
    };
    let body = await request(option);

    let {paging: {total}, data} = JSON.parse(body);
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


  let list = [
    lazadaMIN(),
    shopeeMIN(),
    sendoMIN(),
    tikiMIN(),
    adayroiMIN()
  ];
  let result = await Promise.all(list);
  return Object.assign(...result);

};

