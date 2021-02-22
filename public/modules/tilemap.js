let resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Container = PIXI.Container;

export function tilemap(map, res, width, height) {
    let tiles = new Container();
    for(let i=0;i<map.length; i++) {
        for(let j=0; j<map[i].length; j++) {
            let tile = new Sprite(resources[res[map[i][j]]].texture);
            tile.position.set(j*width, i*height);
            tiles.addChild(tile);
        }
    }
    return tiles;
}