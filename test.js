const { load, cut } = require('@node-rs/jieba')

load()

const result = cut(
  '今天纽约的天气真好啊，京华大酒店的张尧经理吃了一只北京烤鸭。后天纽约的天气不好，昨天纽约的天气也不好，北京烤鸭真好吃',
  true
)

console.log('result', result);


// ["北京烤鸭", "纽约", "天气"]