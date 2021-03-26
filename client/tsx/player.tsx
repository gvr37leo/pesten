
function RenderPlayer(props:{player:Player, client:Client, onClick?}){
    var currentplayer = props.client.helper.getCurrentPlayer()
    var bordercolor = 'white'
    if(currentplayer.id == props.player.id){
        bordercolor = 'red'
    }

    
    var highlightcolor = 'black'
    if(props.player.clientid == props.client.id){
        highlightcolor = 'blue'
    }

    var cardchildren = props.player._children(e => true)
    return (<div onClick={props.onClick} className="player" style={{margin:'10px', border:`3px solid ${highlightcolor}`}}>
        <div style={{padding:'10px', border:`1px solid ${bordercolor}`}}>
            <div>{props.player.name} {props.player.clientid == props.client.id ? "(yourself)" : ""}</div>
            <div>{cardchildren.length}</div>
        </div>
    </div>)
}