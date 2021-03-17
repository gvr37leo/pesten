function RenderCard(props:{card:Card}){
    

    return (
        <div>
            <img src="" alt=""/>
            <div>
                <div>{props.card.rank}</div>
                <div>{props.card.house}</div>
            </div>
        </div>
    )
}

class CardComp extends React.Component{

    props:{
        card:Card
    }

    constructor(props){
        super(props)
    }

    render(){
        return (
            <div>
                <img src="" alt=""/>
                <div>
                    <div>{this.props.card.rank}</div>
                    <div>{this.props.card.house}</div>
                </div>
            </div>
        )
    }
}