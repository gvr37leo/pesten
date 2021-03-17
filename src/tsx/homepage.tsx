
function renderHomepage(){
    var players = gamemanager.getPlayers()
    var currentplayer = gamemanager.getCurrentPlayer()
    var topcard = gamemanager.getTopCard()
    var currentplayercards = currentplayer._children(e => true)

    // currentplayercards.map(cpc => new CardComp())
    
    
    return (
        <div style={{display:"flex",flexDirection:"column"}}>
        <div style={{display:"flex"}}>
            <div>
                {players.map(p => <RenderPlayer key={p.id} player={p} />)}
            </div>
            <div><CardComp onClick={() => {
                console.log('topcard')
            }} card={topcard} /></div>
        </div>
        <div>
            {currentplayercards.map((c:Card) => <CardComp onClick={() => {
                gamemanager.eventQueue.addAndTrigger('playcard',c)
                console.log(c.rank)
            }} key={c.id} card={c} />)}
        </div>
    </div>
    )
}