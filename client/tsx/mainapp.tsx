function MainApp(props:{client:Client}){
    var game = client.helper.getGame()
    var players = props.client.helper.getPlayers()
    var clientplayer = players.find(p => p.clientid == props.client.id)

    return (
        <React.Fragment>
            
            {(() => {
                //check if clientplayer has a name
                if(clientplayer.name == ''){
                    return <StartScreen client={props.client} />
                }
                if(game.status == 'started'){
                    return <RenderHomepage client={props.client} />
                }
                if(game.status == 'finished'){
                    return <GameWonScreen client={props.client} />
                }
                
            })()}
            <div style={{position:"absolute",color:"black", top:"10px", right:"10px", padding:"20px", background:"white", borderRadius:"3px"}}>
                <div>clientid:{props.client.id}</div>
                <div>
                    <button>hide</button>
                    <button>show</button>
                </div>
                <button onClick={() => {
                    props.client.output.trigger({type:'gamestart',data:{}})
                }}>start new game</button>
            </div>
        </React.Fragment>
        
    )
}