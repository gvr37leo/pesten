class GameManager{

    eventQueue = new EventQueue()
    entityStore = new Store<Entity>()
    root:Entity

    constructor(){
        
    }

    setupListeners(){
        
        this.eventQueue.listen('gamestart',() => {
            this.entityStore = new Store<Entity>()
            globalEntityStore = this.entityStore
            var add = storeAdd(this.entityStore)

            var game = add(new Game(),null)
            this.root = game
            var discardPile = add(new Entity({name:'discardpile'}),game)
            var players = add(new Entity({name:'players'}),game)
            add(new Player({name:'amy'}),players)
            add(new Player({name:'bob'}),players)
            add(new Player({name:'carl'}),players)
            add(new Player({name:'dante'}),players)

            var deck = add(new Entity({name:'deck'}), game)
            for(var house of Object.values(houseMap)){
                for(var rank of Object.values(rankMap)){
                    add(new Card({
                        rank:rank,
                        house:house,
                    }), deck)
                }   
            }

            add(new Card({isJoker:true}), deck)
            add(new Card({isJoker:true}), deck)

            shuffle(this.getDeckCards()).forEach((card,i) => card.sortorder = i)
            var shuffleddeck = this.getDeckCards()
            for(var player of this.getPlayers()){
                shuffleddeck.splice(0,5).forEach(card => card.setParent(player))
            }
            shuffleddeck.splice(0,1)[0].setParent(discardPile)
        })
        
        this.eventQueue.addRule('playcard','cards house or rank need to match or the card has to be a jack or joker',(card:Card) => {

            var topcard = this.getTopCard()
            if(topcard == null){
                return true
            }
            
            return topcard.house == card.house ||
            topcard.rank.name == card.rank.name ||
            topcard.rank.name == 'jack' ||
            topcard.isJoker
        })

        this.eventQueue.addRule('playcard','final card may not be a special card',(card:Card) => {

            var topcard = this.getTopCard()
            if(topcard == null){
                return true
            }
            var currentplayer = this.getCurrentPlayer()
            var hand = currentplayer.descendants(e => e.type == 'card') as Card[]
            if(hand.length == 1){
                var lastcard = hand[0]
                var isSpecialcard = ['two','seven','eight','jack'].indexOf(lastcard.rank.name) != -1 || lastcard.isJoker
                return isSpecialcard == false
            }
            
            return true
        })

        
        this.eventQueue.listen('playcard',(card:Card) => {
            
            var currentplayer = this.getCurrentPlayer()
            card.setParent(this.getDiscardPile())
            this.getGame().currentHouse = card.house
            if(currentplayer._children(e => true).length == 0){
                this.eventQueue.addAndTrigger('gamewon', null)
            }else{
                if(card.rank.name == 'seven'){
                    //nothing happens besides moving card to discard pile, just play again
                }else if(card.rank.name == 'eight'){
                    this.incrementTurn(2)
                }else if(card.rank.name == 'jack'){
                    //show 4 housoptions
                    this.chooseHouse(currentplayer, house => {
                        this.getGame().currentHouse = house
                        this.incrementTurn(1)
                    })
                }
            }

            
        })

        this.eventQueue.listen('acceptcards',() => {
            var game = this.root as Game
            var currentplayer = this.getCurrentPlayer()
            var discardpile = null;
            var topcard:Card = null

            if(topcard.isJoker){
                this.drawCard(currentplayer,5)
                this.chooseHouse(currentplayer, house => {
                    this.getGame().currentHouse = house
                })

            }else if(topcard.rank.name == 'two'){
                this.drawCard(currentplayer,2)
                this.incrementTurn(1)
            }
        })

        this.eventQueue.listen('pass',(card) => {
            this.drawCard(this.getCurrentPlayer(),1)
            this.incrementTurn(1)
        })

        this.eventQueue.listen('gamewon',() => {
            for(var player of this.getPlayers()){
                if(player._children(e => true).length == 0){
                    console.log(player.name)
                }
            }
        })
    }

    drawCard(player:Player,count:number){
        var deckcards = this.root.descendant(e => e.name == 'deck').descendants(e => e.type == 'card')
        deckcards.slice(0,count).forEach(e => e.setParent(player))
    }

    getCurrentPlayer():Player{
        var game = this.getGame()
        var players = this.getPlayers()
        return players[game.turnindex % players.length]
    }

    getTopCard():Card{
        return last(this.getDiscardPile()._children(e => true)) as Card
    }

    incrementTurn(count){
        this.getGame().turnindex = (this.getGame().turnindex + count) % this.getPlayers().length
    }
    
    chooseHouse(player:Player,cb:(house:House) => void){
        this.eventQueue.startDiscovery('discoverhouse',Object.values(House),(data) => {
            cb(data)
        })
    }


    getGame(){
        return this.root as Game
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

}

function Enum2Array(en:any){
    return Object.values(en).filter(val => typeof val  == "number")
}