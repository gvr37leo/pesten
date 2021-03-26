function GameWonScreen(props:{client:Client}){
    var game = props.client.helper.getGame()
    var players = props.client.helper.getPlayers()
    var winningplayer = players.find(p => p.id == game.winnerplayerid)
    return <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100vh"}}>
        <div>{winningplayer?.name} has won the game</div>
    </div>
}