
function RenderPlayer(props:{player:Player}){
    var cardchildren = props.player._children(e => true)
    return (<div>
        <div>{props.player.name}</div>
        <div>{cardchildren.length}</div>
    </div>)
}