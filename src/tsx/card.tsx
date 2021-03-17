
class CardComp extends React.Component{

    props:{
        card:Card
        onClick?
    }


    render(){
        return (
            <div style={{border:"1px solid black", padding:"10px", margin:"40px"}} onClick={this.props.onClick}>
                <div style={{display:"flex"}}>
                    <div>{this.props.card.rank}</div>
                    <div>{this.props.card.house}</div>
                </div>
            </div>
        )
    }
}