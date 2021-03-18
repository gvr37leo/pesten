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

            var game = add(new Game(),null) as Game
            this.root = game
            var discardPile = add(new Entity({name:'discardpile'}),game)
            var players = add(new Entity({name:'players'}),game)
            add(new Player({name:'amy'}),players)
            add(new Player({name:'bob'}),players)
            add(new Player({name:'carl'}),players)
            add(new Player({name:'dante'}),players)
            game.shownPlayer = this.getCurrentPlayer()

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
        
        this.eventQueue.addRule('playcard','its not your turn',(card:Card) => {
            return this.getCurrentPlayer().id == card.getParent().id
        })

        this.eventQueue.addRule('playcard',`you're being bullied, either parry with a 2 or joker or accept the bullied cards`,(card:Card) => {
            if(this.getGame().bullycounter > 0){
                return card.isJoker || card.rank.name == 'two'
            }else{
                return true
            }
        })

        this.eventQueue.addRule('playcard','cards house or rank needs to match the top card or the card has to be a jack or joker',(card:Card) => {

            var topcard = this.getTopCardDiscardPile()
            if(topcard == null){
                return true
            }
            
            return topcard.house.name == card.house.name ||
            topcard.rank.name == card.rank.name ||
            card.rank.name == 'jack' ||
            card.isJoker
        })

        this.eventQueue.addRule('playcard','final card may not be a special card',(card:Card) => {

            var topcard = this.getTopCardDiscardPile()
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
            var game = this.getGame()
            var currentplayer = this.getCurrentPlayer()
            card.setParent(this.getDiscardPile())
            game.currentHouse = card.house
            if(currentplayer._children(e => true).length == 0){
                this.eventQueue.addAndTrigger('gamewon', null)
            }else{
                if(card.isJoker){
                    game.bullycounter += 5
                    this.incrementTurn(1)
                }else if(card.rank.name == 'two'){
                    game.bullycounter += 2
                    this.incrementTurn(1)
                }else if(card.rank.name == 'seven'){
                    //nothing happens besides moving card to discard pile, just play again
                }else if(card.rank.name == 'eight'){
                    this.incrementTurn(2)
                }else if(card.rank.name == 'jack'){
                    //show 4 housoptions
                    this.chooseHouse(currentplayer, house => {
                        this.getGame().currentHouse = house
                        this.incrementTurn(1)
                    })
                }else{
                    this.incrementTurn(1)
                }
            }

            
        })

        this.eventQueue.listen('acceptcards',() => {
            var currentplayer = this.getCurrentPlayer()
            var topcard = this.getTopCardDiscardPile()
            var game = this.getGame()

            if(topcard.isJoker){
                this.drawCards(currentplayer, game.bullycounter)
                this.chooseHouse(currentplayer, house => {
                    topcard.house = house
                })

            }else if(topcard.rank.name == 'two'){
                this.drawCards(currentplayer, game.bullycounter)
                this.incrementTurn(1)
            }
            game.bullycounter = 0
        })

        this.eventQueue.listen('pass',() => {
            this.drawCards(this.getCurrentPlayer(),1)
            this.incrementTurn(1)
        })

        this.eventQueue.listenDiscovery('discoverhouse',(data,cb) => {
            var game = this.getGame()
            // game.modal.options = data
        })

        this.eventQueue.listen('gamewon',() => {
            for(var player of this.getPlayers()){
                if(player._children(e => true).length == 0){
                    console.log(player.name)
                }
            }
        })
    }

    drawCards(player:Player,count:number){
        var deckcontainer = this.getDeckContainer()
        for(var i = 0; i < count;i++){
            var topcard = this.getTopCardDeck()
            if(topcard == null){
                var discardcards = this.getDiscardPile()._children(e => true)
                var exceptlast = discardcards.slice(0,discardcards.length - 1)
                shuffle(exceptlast).forEach(c => c.setParent(deckcontainer))
                var topcard = this.getTopCardDeck()
                if(topcard != null){
                    topcard.setParent(player)
                }
            }else{
                topcard.setParent(player)
            }
            
        }
    }

    getCurrentPlayer():Player{
        var game = this.getGame()
        var players = this.getPlayers()
        return players[game.turnindex % players.length]
    }

    getTopCardDeck():Card{
        return last(this.getDeckCards()) as Card
    }

    getTopCardDiscardPile():Card{
        return last(this.getDiscardPile()._children(e => true)) as Card
    }

    incrementTurn(count){
        var game = this.getGame()
        game.turnindex = (game.turnindex + count) % this.getPlayers().length
        game.shownPlayer = this.getCurrentPlayer()
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