
function renderHomepage(){
    var players = gamemanager.getPlayers()
    var currentplayer = gamemanager.getCurrentPlayer()
    var topcard = gamemanager.getTopCard()
    var currentplayercards = currentplayer._children(e => true)

    // currentplayercards.map(cpc => new CardComp())
    
    
    return (
        <div style={{display:"flex",flexDirection:"column", minHeight:"100vh", justifyContent:"space-between"}}>
            <div style={{display:"flex", flexGrow: '1' ,alignItems: 'center'}}>
                <div style={{marginLeft:'40px'}}>
                    {players.map(p => <RenderPlayer key={p.id} player={p} />)}
                </div>
                <div style={{flexGrow:'1',display:'flex',justifyContent:'center'}}>
                    <CardComp onClick={() => {
                        console.log('topcard')
                    }} card={topcard} />
                </div>
            </div>
            <div style={{display:"flex", justifyContent:"center"}}>
                {currentplayercards.map((c:Card) => <CardComp onClick={() => {
                    gamemanager.eventQueue.addAndTrigger('playcard',c)
                    console.log(c.rank)
                }} key={c.id} card={c} />)}
            </div>
        </div>
    )
}