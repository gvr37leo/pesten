
function RenderPlayer(props:{player:Player}){
    var currentplayer = gamemanager.getCurrentPlayer()
    
    var bordercolor = 'black'
    if(currentplayer.id == props.player.id){
        bordercolor = 'gold'
    }

    // var highlightcolor = 'black'
    // if(currentplayer.id == gamemanager.game.shownPlayer.id){
    //     highlightcolor = 'blue'
    // }

    var cardchildren = props.player._children(e => true)
    return (<div className="player" style={{border:`1px solid ${bordercolor}`, margin:'10px', padding:'10px', cursor:'pointer'}}>
        <div>{props.player.name}</div>
        <div>{cardchildren.length}</div>
    </div>)
}