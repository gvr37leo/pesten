
function RenderPlayer(props:{player:Player, client:Client, onClick?}){
    var currentplayer = props.client.helper.getCurrentPlayer()
    var sessionplayer = props.client.helper.getSessionPlayer(props.client.sessionid)
    var bordercolor = 'white'
    if(currentplayer.id == props.player.id){
        bordercolor = 'red'
    }

    var cardchildren = props.player._children(e => true)
    return (<div style={{margin:'10px', padding:'10px', border:`1px solid ${bordercolor}`}}>
        <div>{props.player.name} {sessionplayer.id == props.player.id ? "(yourself)" : ""} {props.player.disconnected ? "(disconnected)" : ""}</div>
        <div>{cardchildren.length}</div>
    </div>)
}