'use strict';

// 转换标签格式
function tagsFormat(tags) {
  let n;
  let tagsInfo = [];
  for (let tag of tags) {
    if (tag.includes('-')) {
      n = parseFloat(tag.substring(tag.indexOf('-') + 1));
      tag = tag.substring(0, tag.indexOf('-'))
    }
    else n = 1;
    tagsInfo.push({barcode: tag, count: n});
  }
  return tagsInfo;
}

//计算数量
function itemsCount(tagsInfo) {
  let itemsPurchaseInfo = [];
  for (let tag of tagsInfo) {
    let flag = 1;
    for (let item of itemsPurchaseInfo) {
      if (item.barcode == tag.barcode) {
        item.count += tag.count;
        flag = 0;
        break;
      }
    }
    if (flag)
      itemsPurchaseInfo.push(tag);
  }
  return itemsPurchaseInfo;
}

//转换购买商品格式
function itemsFormat(itemsPurchaseInfo) {
  let allItems = loadAllItems();
  for (let item of itemsPurchaseInfo) {
    for (let aitem of allItems) {
      while (item.barcode == aitem.barcode) {
        item.name = aitem.name;
        item.unit = aitem.unit;
        item.price = aitem.price;
        break;
      }
    }
  }
  return itemsPurchaseInfo;
}

// 计算小计
function itemsTotalCount(itemPurchaseInfo) {
  let Promotion = loadPromotions();
  for (let item of itemPurchaseInfo) {
    if (Promotion[0].barcodes.includes(item.barcode) && item.count >= 2)
      item.totalPro = item.price * (item.count - 1);
    else
      item.totalPro = item.price * item.count;
  }
  return itemPurchaseInfo;
}

// 计算总计，节省
function itemsSummary(itemPurchaseInfo) {
  let summary = {totalPro: 0, totalSave: 0};
  for (let item of itemPurchaseInfo) {
    summary.totalPro += item.totalPro;
    summary.totalSave += item.count * item.price - item.totalPro;
  }
  return summary;
}

//转换成收据格式
function toReceipt(itemsPurchaseInfo, summary) {
  let receipt = '***<没钱赚商店>收据***\n';
  for (let item of itemsPurchaseInfo) {
    receipt += `名称：${item.name}，数量：${item.count}${item.unit}，单价：${item.price.toFixed(2)}(元)，小计：${item.totalPro.toFixed(2)}(元)\n`;
  }
  receipt = receipt + `----------------------\n总计：${summary.totalPro.toFixed(2)}(元)\n节省：${summary.totalSave.toFixed(2)}(元)\n**********************`;
  return receipt;
}

function printReceipt(tags) {
  let tagsInfo = tagsFormat(tags);
  let itemsPurchaseInfo = itemsCount(tagsInfo);
  itemsPurchaseInfo = itemsFormat(itemsPurchaseInfo);
  itemsPurchaseInfo = itemsTotalCount(itemsPurchaseInfo);
  let summary = itemsSummary(itemsPurchaseInfo);
  let receipt = toReceipt(itemsPurchaseInfo, summary);
  console.log(receipt);
}

