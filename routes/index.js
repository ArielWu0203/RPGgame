var express = require('express');
var router = express.Router();

const map = [
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1],
];

const professorInfo = {
  'IMSLab': {
    'name': '蔡孟勳',
    'image':{
      'imageUrl': 'images/professor.png',
      'imageUpUrl': 'images/professorUp.png',
    },
    'position': {'x':128, 'y':128, 'w':64, 'h':64},
    'dialog': {
      'text': ['歡迎來到IMSLsb!','(介紹...)','來寫作業吧!'],
      'link': '/problem'
    }
  }
}
const itemsInfo = {
  0:{
      'name': 'Red item',
      'nameCh': '紅色物品',
      'imageUrl': 'images/itemRed.png',
      'imageUpUrl': 'images/itemRedUp.png',
      'descirbe': '描述紅色物品...',
  },
  1:{
      'name': 'Coin',
      'nameCh': '錢幣',
      'imageUrl': 'images/coin.png',
      'imageUpUrl': 'images/coinUp.png',
      'descirbe': '描述錢幣...',
  }
}

const itemsPosition = {
  // Store items' position, size and information (in the lab)
  'IMSLab':{
    // the key is itemIdLab (item Id in IMSLab)
    0:{
        'itemInfoId': 0,
        'x': 128,
        'y': 256,
        'w': 64,
        'h': 64,
    },
    1:{
        'itemInfoId': 1,
        'x': 128,
        'y': 320,
        'w': 64,
        'h': 64,
    },
    2:{
        'itemInfoId': 1,
        'x': 128,
        'y': 384,
        'w': 128,
        'h': 128,
    }
  }
}

let itemsInLab = {
  'IMSLab':[0,1,2] // the number is itemsPosition's key (in the lab)
};
// Store items by itemInfoId
let packet = {};

// User is in IMSLab
const location = 'IMSLab';

const mapImageUrl = ['images/wall.png', 'images/ground.png'];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Game' });
});

router.get('/map', (req,res) => {
  res.json({map, mapImageUrl});
})

/* GET professor */
router.get('/professor/:lab', (req, res)=> {
  let lab = req.params.lab;
  res.json(professorInfo[lab]);

})
/* GET all items in IMSLab */
router.get('/item/all', (req, res) => {
  let items = [];
  itemsInLab[location].forEach(itemIdInLab => {
      let itemInfoId = itemsPosition[location][itemIdInLab]['itemInfoId'];
      items.push(
          {
              'itemIdInLab': itemIdInLab,
              ...itemsPosition[location][itemIdInLab],
              'imageUrl': itemsInfo[itemInfoId]['imageUrl'],
              'imageUpUrl': itemsInfo[itemInfoId]['imageUpUrl'],
          }
      );
  });
  res.json({items});
})

/* Update items in Lab */
router.post('/item/:lab/:itemId', (req, res) => {
  let lab = req.params.lab;
  let itemIdLab = req.params.itemId;
  let itemInfoId = itemsPosition[lab][itemIdLab]['itemInfoId'];
  // Delete item from lab
  itemsInLab[lab] = itemsInLab[lab].filter((value)=> {
      return value != itemIdLab;
  });
  // Add item in packet
  let text=`獲得了${itemsInfo[itemInfoId].nameCh}`;
  if(itemInfoId in packet) {
    packet[itemInfoId]++;
  }else {
    packet[itemInfoId] = 1;
  }
  console.log('packet',packet);
  res.send({text});
})

module.exports = router;
