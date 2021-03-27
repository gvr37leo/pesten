var shown = true

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
                <div style={{marginBottom:"10px"}}>
                    <button onClick={() => {
                        shown = !shown
                        client.updateHtml()
                    }}>{shown ? "hide" : "show"}</button>
                </div>

                {(() => {
                    if(shown){
                        return <React.Fragment>
                            <div style={{marginBottom:"10px"}}>
                                <button onClick={() => {
                                    props.client.output.trigger({type:'gamestart',data:{}})
                                }}>start new game</button>
                            </div>
                            <div style={{marginBottom:"10px"}}>
                                <button onClick={() => {
                                    props.client.output.trigger({type:'debugfinishgame',data:{}})
                                }}>debug end game</button>
                            </div>
                        </React.Fragment>
                    }
                })()}
                


            </div>
        </React.Fragment>
        
    )
}