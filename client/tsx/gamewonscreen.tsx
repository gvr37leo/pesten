function GameWonScreen(props:{client:Client}){
    var game = props.client.helper.getGame()
    var players = props.client.helper.getPlayers()
    var winningplayer = players.find(p => p.id == game.winnerplayerid)
    return <div style={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", height:"100vh"}}>
        <div>{winningplayer?.name} has won the game</div>
        <button style={{marginTop:"50px"}} onClick={() => {
            props.client.output.trigger({type:'gamestart',data:{}})
        }}>start new game</button>
    </div>
}