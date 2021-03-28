class Helper{
    

    constructor(public store:Store<Entity>){
        this.store = store
    }

    getGame(){
        return this.store.list().find(e => e.parent == null) as Game
    }

    getTopCardDeck():Card{
        return last(this.getDeckCards()) as Card
    }

    getTopCardDiscardPile():Card{
        return last(this.getDiscardPile()._children(e => true)) as Card
    }

    getDeckContainer(){
        return this.getGame().child(e => e.name == 'deck')
    }

    getDeckCards(){
        return this.getDeckContainer()._children(e => true) as Card[]
    }

    getDiscardPile(){
        return this.getGame().child(e => e.name == 'discardpile')
    }

    getPlayersNode():Entity{
        return this.getGame().child(e => e.name == 'players')
    }

    getPlayers(){
        return this.getPlayersNode()._children(e => true) as Player[]
    }

    getCurrentPlayer():Player{
        var game = this.getGame()
        var players = this.getPlayers()
        return players[game.turnindex % players.length]
    }

    getClientPlayer(clientid):Player{
        return this.getPlayers().find(p => p.clientid == clientid)
    }
}