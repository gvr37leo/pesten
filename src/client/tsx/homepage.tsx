
function renderHomepage(){
    var game = gamemanager.getGame()
    var players = gamemanager.getPlayers()
    var currentplayer = gamemanager.getCurrentPlayer()
    var topcard = gamemanager.getTopCardDiscardPile()
    var currentplayercards = game.shownPlayer._children(e => true)
    
    // currentplayercards.map(cpc => new CardComp())
    
    
    return (
        <React.Fragment>
            <div style={{display:"flex",flexDirection:"column", minHeight:"100vh", justifyContent:"space-between"}}>
                <div style={{display:"flex", flexGrow: '1' ,alignItems: 'center'}}>
                    <div style={{marginLeft:'40px'}}>
                        {players.map(p => <RenderPlayer onClick={() => {
                            gamemanager.getGame().shownPlayer = p
                            updateHtml()
                        }} key={p.id} player={p} />)}
                    </div>
                    <div style={{flexGrow:'1',display:'flex',justifyContent:'center', alignItems:"center"}}>

                        {(() => {
                            if(game.bullycounter > 0){
                                return <div style={{cursor:'pointer', border:'1px solid white', margin:'40px', padding:'10px'}} onClick={() => {
                                    gamemanager.eventQueue.addAndTrigger('acceptcards', null)
                                }}>accept cards {game.bullycounter}</div>
                            }else{
                                return null
                            }
                        })()}

                        <div style={{cursor:'pointer', border:'1px solid white', margin:'40px', padding:'10px'}} onClick={() => {
                            gamemanager.eventQueue.addAndTrigger('pass',null)
                        }}>
                            <div>draw a card and pass</div>
                            <div>{gamemanager.getDeckCards().length} remaining</div>
                        </div>
                        <CardComp card={topcard} />
                    </div>
                </div>
                <div style={{display:"flex", justifyContent:"start", overflow:"auto", margin:"20px", border:"1px solid white"}}>
                    {currentplayercards.map((c:Card) => <CardComp onClick={() => {
                        gamemanager.eventQueue.addAndTrigger('playcard',c)
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