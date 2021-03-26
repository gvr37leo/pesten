
function renderHomepage(client:Client){
    var game = client.helper.getGame()
    if(game.status == 'prestart'){
        return <div>game hasnt started yet</div>
    }

    var players = client.helper.getPlayers()
    if(game.status == 'finished'){
        var winningplayer = players.find(p => p.id == game.winnerplayerid)
        return <div>{winningplayer.name} has won the game</div>
    }
    
    var currentplayer = client.helper.getCurrentPlayer()
    var topcard = client.helper.getTopCardDiscardPile()
    var clientplayer = players.find(p => p.clientid == client.id)
    var currentplayercards = clientplayer._children(() => true)
    
    return (
        <React.Fragment>
            <div>clientid:{client.id}</div>
            <div style={{display:"flex",flexDirection:"column", minHeight:"100vh", justifyContent:"space-between"}}>
                <div style={{display:"flex", flexGrow: '1' ,alignItems: 'center'}}>
                    <div style={{marginLeft:'40px'}}>
                        {players.map(p => <RenderPlayer client={client} onClick={() => {
                        
                        }} key={p.id} player={p} />)}
                    </div>
                    <div style={{flexGrow:'1',display:'flex',justifyContent:'center', alignItems:"center"}}>

                        {(() => {
                            if(game.bullycounter > 0){
                                return <div style={{cursor:'pointer', border:'1px solid white', margin:'40px', padding:'10px'}} onClick={() => {
                                    client.output.trigger({type:'acceptcards',data:null})
                                }}>accept cards {game.bullycounter}</div>
                            }else{
                                return null
                            }
                        })()}

                        <div style={{cursor:'pointer', border:'1px solid white', margin:'40px', padding:'10px'}} onClick={() => {
                            client.output.trigger({type:'pass',data:null})
                        }}>
                            <div>draw a card and pass</div>
                            <div>{client.helper.getDeckCards().length} remaining</div>
                        </div>
                        <CardComp card={topcard} />
                    </div>
                </div>
                <div style={{display:"flex", justifyContent:"start", overflow:"auto", margin:"20px", border:"1px solid white"}}>
                    {currentplayercards.map((c:Card) => <CardComp onClick={() => {
                        client.output.trigger({type:'playcard',data:c})
                    }} key={c.id} card={c} />)}
                </div>
            </div>
            <Modal visible={clientplayer.isDiscoveringHouse}>
                <div style={{padding:"20px", display:"flex", justifyContent:"center", flexWrap:"wrap"}}>
                    {clientplayer.discoverHouseOptions.map((house,i) => {
                        return <img key={i} width="180px" style={{cursor:"pointer", margin:"20px"}} src={`./resources/K${house.abbr}.jpg`}  onClick={() => {
                            client.output.trigger({type:'completediscovery',data:{data:house,id:clientplayer.discoverid}})
                        }}></img>
                    })}
                </div>
            </Modal>
            
        </React.Fragment>
    )
}