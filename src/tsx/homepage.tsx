
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
            <div><CardComp onClick={() => {console.log('hello')}} card={topcard} /></div>
        </div>
        <div>
            {currentplayercards.map(c => <CardComp key={c.id} card={c as Card} />)}
        </div>
    </div>
    )
}