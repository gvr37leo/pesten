var shown = false

function MainApp(props:{client:Client}){
    var game = props.client.helper.getGame()
    var players = props.client.helper.getPlayers()
    var sessionplayer = props.client.helper.getSessionPlayer(props.client.sessionid)
    var discardpile = props.client.helper.getDiscardPile()
    var deck = props.client.helper.getDeckContainer()


    return (
        <React.Fragment>
            <div>
                {(() => {
                    return props.client.helper.store.list().filter(e => e.type == 'card').map((c:any,i) => {
                        return <img key={i} style={{display:"none"}} src={c.url}></img>
                    })
                })()}
            </div>
            {(() => {
                //check if clientplayer has a name
                if(sessionplayer.name == ''){
                    return <StartScreen client={props.client} />
                }
                if(game.status == 'started'){
                    return <RenderHomepage client={props.client} />
                }
                if(game.status == 'finished'){
                    return <GameWonScreen client={props.client} />
                }
                
            })()}
            <div style={{position:"absolute", border:"1px solid black", borderRadius:"3px", color:"black", top:"10px", left:"10px", padding:"20px", background:"white"}}>
                <div>debug panel</div>
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
                                }}>end game</button>
                            </div>
                            <div style={{marginBottom:"10px"}}>
                                <button onClick={() => {
                                    props.client.updateHtml()
                                }}>rerender</button>
                            </div>
                            <div style={{marginBottom:"10px"}}>
                                <button onClick={() => {
                                    props.client.output.trigger({type:'requestfullupdate',data:{}})
                                }}>request full update</button>
                            </div>
                            <div>clientid:{props.client.id}</div>
                            <div>sessionid:{props.client.sessionid}</div>
                            <div>dbversion:{props.client.lastprocessedversion}</div>
                            <div>discardpile:{discardpile.children.length}</div>
                            <div>deck:{deck.children.length}</div>
                        </React.Fragment>
                    }
                })()}
            </div>
        </React.Fragment>
        
    )
}