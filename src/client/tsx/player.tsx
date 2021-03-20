
function RenderPlayer(props:{player:Player, onClick?}){
    var currentplayer = gamemanager.getCurrentPlayer()
    
    var bordercolor = 'white'
    if(currentplayer.id == props.player.id){
        bordercolor = 'red'
    }

    
    var highlightcolor = 'black'
    if(props.player.id == gamemanager.getGame().shownPlayer.id){
        highlightcolor = 'blue'
    }

    var cardchildren = props.player._children(e => true)
    return (<div onClick={props.onClick} className="player" style={{margin:'10px', cursor:'pointer', border:`3px solid ${highlightcolor}`}}>
        <div style={{padding:'10px', border:`1px solid ${bordercolor}`}}>
            <div>{props.player.name}</div>
            <div>{cardchildren.length}</div>
        </div>
    </div>)
}