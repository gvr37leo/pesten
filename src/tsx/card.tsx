
class CardComp extends React.Component{

    props:{
        card:Card
        onClick?
    }


    render(){
        var card = this.props.card
        return (
            <div className="card" style={{border:"1px solid black", padding:"10px", margin:"40px", cursor:'pointer'}} onClick={this.props.onClick}>
                <div style={{display:"flex"}}>
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
            </div>
        )
    }
}