const Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    Container = PIXI.Container;

const root = 'http://localhost:3000';
const location = 'IMSLab';

let app = new Application({width: 512, height: 512}); // app.view is a canvas
document.body.appendChild(app.view);

// layers
let tiles = new Container(); // base layer
let professor = new Container(); // 1st layer
let items = new Container(); // 2nd layer
// Add layers in stage
app.stage.addChild(tiles, professor, items);
// load pictures
loader
    .add('images/professor.png')
    .add('images/professorUp.png')
    .add('images/dialog.png')
    .add('images/wall.png')
    .add('images/ground.png')
    .add('images/crate.png')
    .add('images/itemRed.png')
    .add('images/itemRedUp.png')
    .add('images/coin.png')
    .add('images/coinUp.png')
    .add('images/messageBox.png')
    .add('images/certainBtn.png')
    .add('images/certainBtnUp.png')
    .load(setup);

function setup() {
    // Set tiles
    fetch(`${root}/map`)
    .then((res)=>{return res.json();})
    .then((json) => {
        tilemap(json['map'], json['mapImageUrl'], 64, 64);
    })

    // Set professor
    fetch(`${root}/professor/${location}`)
    .then((res) => {return res.json();})
    .then((json)=> {
        let proffesorImg = createBtn(null, json.image, json.position);
        professor.addChild(proffesorImg);
        // show dialog when professor is clicked
        proffesorImg.on('pointerdown', ()=> {
            createDialog(json.dialog);
        })
    })
    // Set items
    fetch(`${root}/item/all`)
    .then((res) => {return res.json();})
    .then((json)=> {
        setItems(json['items']);
    })
}

function createDialog(info) {
    lock();
    let dialog = new Container();
    dialog.interactive = true;
    dialog.position.set(0, 384);
    app.stage.addChild(dialog);

    let dialogImg = new Sprite(resources['images/dialog.png'].texture);
    let i=0, length = info.text.length;
    let dialogText = new Text(info.text[i]);
    dialogText.position.set(10,10);
    
    // Have a conversation whn dialog is clicked
    dialog.on('click', ()=> {
        if((++i) < length) {
            dialogText.text = info.text[i];
        }
        else {
            unlock();
            app.stage.removeChild(dialog);
            window.open(`${root}${info.link}`);
        }
    })
    dialog.addChild(dialogImg, dialogText);
}
function createMessageBox(text) {
    let messageBox = new Container();
    let messageBoxImg = new Sprite(resources['images/messageBox.png'].texture);
    // add certain button in message box
    let certainBtn = createBtn('確定',{'imageUrl':'images/certainBtn.png','imageUpUrl': 'images/certainBtnUp.png'}, {'x': 96,'y': 48})
    certainBtn.on('pointerdown', ()=> {
        app.stage.removeChild(messageBox);
        unlock();
    });
    // add text in message box
    let messageBoxText = new Text(text);
    messageBoxText.anchor.set(0.5);
    messageBoxText.position.set(messageBoxImg.width/2, 32);
    messageBox.position.set(128, 216);
    
    messageBox.addChild(messageBoxImg,messageBoxText,certainBtn);
    app.stage.addChild(messageBox);
}
function createBtn(text, img, position) {
    let btn = new Container();
    btn.interactive = true;
    btn.buttonMode = true;
    btn.position.set(position.x, position.y);

    let btnImg = new Sprite(resources[img.imageUrl].texture);
    
    // add text in button
    let btnText = new Text(text);
    btnText.anchor.set(0.5);
    btnText.position.set(btnImg.width/2,btnImg.height/2);

    btn.on('pointerover', ()=> {
        btnImg.texture = resources[img.imageUpUrl].texture;
    });
    btn.on('pointerout', ()=> {
        btnImg.texture = resources[img.imageUrl].texture;
    })

    btn.addChild(btnImg, btnText);
    return btn;
}

function setItems(itemsJson) {
    itemsJson.forEach(ele => {
        let item = new Sprite(resources[ele['imageUrl']].texture);
        item.position.set(ele['x'], ele['y']);
        item.width = ele['w'];
        item.height = ele['h'];
        item.interactive = true;
        item.buttonMode = true;
        item.on('pointerover', () => {
            item.texture = resources[ele['imageUpUrl']].texture;
        })
        item.on('pointerout', () => {
            item.texture = resources[ele['imageUrl']].texture;
        })
        // get item
        item.on('pointerdown', () => {
            fetch(`${root}/item/${location}/${ele['itemIdInLab']}`, {method:'POST'})
            .then((res) =>{return res.json();})
            .then((json) => {
                items.removeChild(item);
                // show message box
                createMessageBox(json.text);
                lock();
            })
        })
        items.addChild(item);
    });
}
// lock professsor and items
function lock(){
    professor.interactiveChildren = false;
    items.interactiveChildren = false;
}
// unlock professsor and items
function unlock(){
    professor.interactiveChildren = true;
    items.interactiveChildren = true;
}

function tilemap(map, res, width, height) {
    for(let i=0;i<map.length; i++) {
        for(let j=0; j<map[i].length; j++) {
            let tile = new Sprite(resources[res[map[i][j]]].texture);
            tile.position.set(j*width, i*height);
            tiles.addChild(tile);
        }
    }
}