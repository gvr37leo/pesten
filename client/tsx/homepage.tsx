
function RenderHomepage(props:{client:Client}){
    var game = props.client.helper.getGame()
    var players = props.client.helper.getPlayers()
    var topcard = props.client.helper.getTopCardDiscardPile()
    var clientplayer = props.client.helper.getSessionPlayer(props.client.sessionid)
    var clientplayercards = clientplayer._children(() => true)
    var currentplayer = props.client.helper.getCurrentPlayer()

    return (
        <React.Fragment>
            <div style={{display:"flex",flexDirection:"column", minHeight:"100vh", justifyContent:"space-between"}}>
                <div style={{display:"flex", flexGrow: '1' ,alignItems: 'center'}}>
                    <div style={{marginLeft:'40px'}}>
                        {players.map(p => <RenderPlayer client={props.client} onClick={() => {
                        
                        }} key={p.id} player={p} />)}
                    </div>
                    <div style={{flexGrow:'1',display:'flex', flexWrap:'wrap', justifyContent:'center', alignItems:"center"}}>

                        {(() => {
                            if(game.bullycounter > 0 && clientplayer.id == currentplayer.id){
                                return <div style={{cursor:'pointer', border:'1px solid white', margin:'40px', padding:'10px'}} onClick={() => {
                                    props.client.output.trigger({type:'acceptcards',data:null})
                                }}>accept cards {game.bullycounter}</div>
                            }else{
                                return null
                            }
                        })()}

                        <div style={{cursor:'pointer', border:'1px solid white', margin:'40px', padding:'10px'}} onClick={() => {
                            props.client.output.trigger({type:'pass',data:null})
                        }}>
                            <div>draw a card and pass</div>
                            <div>{props.client.helper.getDeckCards().length} remaining</div>
                        </div>
                        <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                            {(() => {
                                if(topcard.rank.name == 'jack'){
                                    return <img width="40" style={{background:'white',borderRadius:'3px'}} src={game.currentHouse.iconuri}/>
                                }
                            })()}
                            <CardComp card={topcard} />
                        </div>
                    </div>
                </div>
                <div style={{display:"flex", justifyContent:"center", flexWrap:"wrap", overflow:"auto", margin:"20px", border:"1px solid white"}}>
                    {clientplayercards.map((c:Card) => <CardComp onClick={() => {
                        props.client.output.trigger({type:'playcard',data:c.id})
                    }} key={c.id} card={c} />)}
                </div>
            </div>
            <Modal visible={clientplayer.isDiscoveringHouse}>
                <div style={{padding:"20px", display:"flex", justifyContent:"center", flexWrap:"wrap"}}>
                    {clientplayer.discoverHouseOptions.map((house,i) => {
                        return <img key={i} width="180px" style={{cursor:"pointer", margin:"20px"}} src={`./resources/K${house.abbr}.jpg`}  onClick={() => {
                            props.client.output.trigger({type:'completediscovery',data:{data:house,id:clientplayer.discoverid}})
                        }}></img>
                    })}
                </div>
            </Modal>
        </React.Fragment>
    )
}