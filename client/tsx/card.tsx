
class CardComp extends React.Component{

    props:{
        card:Card
        onClick?
    }


    render(){
        var card = this.props.card
        return (
            <div className="card" style={{borderRadius:"3px", border:"1px solid white", padding:"10px", margin:"40px", cursor:this.props.onClick != null ? 'pointer' : 'default'}} onClick={this.props.onClick}>
                <div>
                    <div style={{display:"flex", justifyContent:"center", margin:"10px"}}>
                        {(() => {
                            if(card.isJoker){
                                return <div>Joker</div>
                            }else{
                                return <React.Fragment>
                                    <div style={{marginRight:'20px'}}>{card.rank.name}</div>
                                    <div>{card.house.name}</div>
                                </React.Fragment>
                            }
                        })()}
                    </div>
                    <img style={{aspectRatio:'1/1.528'}} width="180px" src={card.url} />
                </div>
            </div>
        )
    }
}