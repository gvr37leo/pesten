
function renderHomepage(client:Client){
    var game = client.helper.getGame()
    var players = client.helper.getPlayers()
    var currentplayer = client.helper.getCurrentPlayer()
    var topcard = client.helper.getTopCardDiscardPile()
    var currentplayercards = client.entityStore.get(game.shownPlayerid)._children(() => true)
    
    return (
        <React.Fragment>
            <div style={{display:"flex",flexDirection:"column", minHeight:"100vh", justifyContent:"space-between"}}>
                <div style={{display:"flex", flexGrow: '1' ,alignItems: 'center'}}>
                    <div style={{marginLeft:'40px'}}>
                        {players.map(p => <RenderPlayer client={client} onClick={() => {
                            client.helper.getGame().shownPlayerid = p.id
                            client.updateHtml()
                        }} key={p.id} player={p} />)}
                    </div>
                    <div style={{flexGrow:'1',display:'flex',justifyContent:'center', alignItems:"center"}}>

                        {(() => {
                            if(game.bullycounter > 0){
                                return <div style={{cursor:'pointer', border:'1px solid white', margin:'40px', padding:'10px'}} onClick={() => {
                                    // gamemanager.eventQueue.addAndTrigger('acceptcards', null)
                                    client.output.trigger({type:'acceptcards',data:null})
                                }}>accept cards {game.bullycounter}</div>
                            }else{
                                return null
                            }
                        })()}

                        <div style={{cursor:'pointer', border:'1px solid white', margin:'40px', padding:'10px'}} onClick={() => {
                            client.output.trigger({type:'pass',data:null})
                            // gamemanager.eventQueue.addAndTrigger('pass',null)
                        }}>
                            <div>draw a card and pass</div>
                            <div>{client.helper.getDeckCards().length} remaining</div>
                        </div>
                        <CardComp card={topcard} />
                    </div>
                </div>
                <div style={{display:"flex", justifyContent:"start", overflow:"auto", margin:"20px", border:"1px solid white"}}>
                    {currentplayercards.map((c:Card) => <CardComp onClick={() => {
                        // gamemanager.eventQueue.addAndTrigger('playcard',c)
                        client.output.trigger({type:'playcard',data:c})
                    }} key={c.id} card={c} />)}
                </div>
            </div>
            <Modal visible={currentplayer.isDiscoveringHouse}>
                <div style={{padding:"20px", display:"flex", justifyContent:"center", flexWrap:"wrap"}}>
                    {currentplayer.houseOptions.map((house,i) => {
                        return <img key={i} width="180px" style={{cursor:"pointer", margin:"20px"}} src={`./resources/K${house.abbr}.jpg`}  onClick={() => {
                            currentplayer.discoverCb(house)
                            currentplayer.isDiscoveringHouse = false
                            updateHtml()
                        }}></img>
                    })}
                </div>
            </Modal>
            
        </React.Fragment>
    )
}