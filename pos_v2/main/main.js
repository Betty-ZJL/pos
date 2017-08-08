'use strict';

function printTime() {
  const dateDigitToString = num => (num < 10 ? `0${num}` : num);
  const currentDate = new Date(),
    year = dateDigitToString(currentDate.getFullYear()),
    month = dateDigitToString(currentDate.getMonth() + 1),
    date = dateDigitToString(currentDate.getDate()),
    hour = dateDigitToString(currentDate.getHours()),
    minute = dateDigitToString(currentDate.getMinutes()),
    second = dateDigitToString(currentDate.getSeconds()),
    formattedDateString = `${year}年${month}月${date}日 ${hour}:${minute}:${second}`;
  return formattedDateString;
}

class Tag {

  constructor(barcode, count) {
    this.barcode = barcode;
    this.count = count;
  }

  //转换标签格式 Tag {{barcode,count},
  static newTag(tag) {
    let count = 1;
    if (tag.includes('-')) {
      count = parseFloat(tag.substring(tag.indexOf('-') + 1));
      tag = tag.substring(0, tag.indexOf('-'));
    }
    return new Tag(tag, count);
  }

  //计算数量
  static counts(tagsInfo) {
    let result = [];
    for (let tag of tagsInfo) {
      let flag = 1;
      for (let res of result) {
        if (res.barcode === tag.barcode) {
          res.count += tag.count;
          flag = 0;
          break;
        }
      }
      if (flag)
        result.push(tag);
    }
    return result;
  }

  //计算小计并转换标签格式 Tag{barcode,count,name,unit,price,sum}
  static calSum(tag) {
    const allItems = Item.all();
    const promotios = Promotion.all()[0].barcodes;
    for (let item of allItems) {
      if (tag.barcode === item.barcode) {
        tag.name = item.name;
        tag.unit = item.unit;
        tag.price = item.price;
        break;
      }
    }
    if (promotios.includes(tag.barcode))
      tag.sum = (tag.count - 1) * tag.price;
    else
      tag.sum = tag.count * tag.price;
    return tag;
  }

  //计算总计和节省
  static calSummary(tagsInfo) {
    let summary = {sum: 0, save: 0};
    for (let tag of tagsInfo) {
      summary.sum += tag.sum;
      summary.save += tag.count * tag.price - tag.sum;
    }
    return summary;
  }

  //转换成收据形式
  static toReceipt(tagsInfo, summary) {
    let formattedDateString = printTime();
    let receipt = `***<没钱赚商店>收据***\n打印时间：${formattedDateString}\n----------------------\n`;
    for (let tag of tagsInfo) {
      receipt += `名称：${tag.name}，数量：${tag.count}${tag.unit}，单价：${tag.price.toFixed(2)}(元)，小计：${tag.sum.toFixed(2)}(元)\n`
    }
    receipt += `----------------------\n总计：${summary.sum.toFixed(2)}(元)\n节省：${summary.save.toFixed(2)}(元)\n**********************`;
    console.log(receipt);
  }

}

function printReceipt(tags) {
  let tagsInfo = [];
  for (let tag of tags) {  //转换标签格式
    tag = Tag.newTag(tag);
    tagsInfo.push(tag);
  }
  tagsInfo = Tag.counts(tagsInfo);  //计算数量
  for (let tag of tagsInfo)  //计算小计
    tag = Tag.calSum(tag);
  let summary = Tag.calSummary(tagsInfo);  //计算总计和节省
  Tag.toReceipt(tagsInfo, summary)//输出清单
}


