
function renderHomepage(){
    var game = gamemanager.getGame()
    var players = gamemanager.getPlayers()
    var currentplayer = gamemanager.getCurrentPlayer()
    var topcard = gamemanager.getTopCardDiscardPile()
    var currentplayercards = game.shownPlayer._children(e => true)
    
    // currentplayercards.map(cpc => new CardComp())
    
    
    return (
        <div style={{display:"flex",flexDirection:"column", minHeight:"100vh", justifyContent:"space-between"}}>
            <div style={{display:"flex", flexGrow: '1' ,alignItems: 'center'}}>
                <div style={{marginLeft:'40px'}}>
                    {players.map(p => <RenderPlayer onClick={() => {
                        gamemanager.getGame().shownPlayer = p
                        updateHtml()
                    }} key={p.id} player={p} />)}
                </div>
                <div style={{flexGrow:'1',display:'flex',justifyContent:'center'}}>

                    {(() => {
                        if(game.bullycounter > 0){
                            return <div style={{cursor:'pointer', border:'1px solid black', margin:'40px', padding:'10px'}} onClick={() => {
                                gamemanager.eventQueue.addAndTrigger('acceptcards', null)
                            }}>accept cards</div>
                        }else{
                            return null
                        }
                    })()}

                    <div style={{cursor:'pointer', border:'1px solid black', margin:'40px', padding:'10px'}} onClick={() => {
                        gamemanager.eventQueue.addAndTrigger('pass',null)
                    }}>
                        <div>draw a card and pass</div>
                        <div>{gamemanager.getDeckCards().length} remaining</div>
                    </div>
                    <CardComp card={topcard} />
                </div>
            </div>
            <div style={{display:"flex", justifyContent:"center"}}>
                
                {currentplayercards.map((c:Card) => <CardComp onClick={() => {
                    gamemanager.eventQueue.addAndTrigger('playcard',c)
                }} key={c.id} card={c} />)}
            </div>
        </div>
    )
}