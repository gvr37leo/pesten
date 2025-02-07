class GameManager{

    eventQueue = new EventQueue()
    entityStore = new Store<Entity>()
    helper: Helper
    broadcastEvent = new EventSystem<{type:string,data}>()
    sendEvent = new EventSystem<{sessionid:number,type:string,data}>()
    rng = new RNG(Math.floor(Math.random() * 100000))

    constructor(){
        
    }

    setupListeners(){

        this.eventQueue.onRuleBroken.listen(e => {
            this.sendEvent.trigger({type:'error',sessionid:e.event.data.sessionid,data:e.error})
        })

        this.eventQueue.listen('init',() => {
            this.entityStore = new Store<Entity>()
            this.helper = new Helper(this.entityStore)
            Entity.globalEntityStore = this.entityStore
            

            var game = this.entityStore.add(new Game()) as Game
            var discardPile = new Entity({name:'discardpile'}).inject(game)
            var players = new Entity({name:'players'}).inject(game)
            var deck = new Entity({name:'deck'}).inject(game)
            game.status = 'prestart'
            this.eventQueue.add('gamestart',null)
        })

        this.eventQueue.listen('playerjoin', (e) => {
            var player = this.helper.getSessionPlayer(e.sessionid)
            player.name = e.data.name
            this.drawCards(player,5)
        })
        
        this.eventQueue.listen('gamestart',() => {
            var game = this.helper.getGame()
            game.status = 'started'
            game.bullycounter = 0
            game.turnindex = 0
            
            var deck = this.helper.getDeckContainer()
            var discardPile = this.helper.getDiscardPile()
            var players = this.helper.getPlayers()

            deck.removeChildren()
            discardPile.removeChildren()
            players.forEach(p => p.removeChildren())

            
            
            for(var house of Object.values(houseMap)){
                for(var rank of Object.values(rankMap)){
                    new Card({
                        rank:rank,
                        house:house,
                        url:`./resources/${rank.abbr+house.abbr}.jpg`
                    }).inject(deck)
                }   
            }

            new Card({isJoker:true,url:`./resources/joker.jpg`}).inject(deck)
            new Card({isJoker:true,url:`./resources/joker.jpg`}).inject(deck)

            shuffle(this.helper.getDeckContainer().children,this.rng)
            var shuffleddeck = this.helper.getDeckCards()
            for(var player of players){
                this.drawCards(player,5)
            }
            shuffleddeck.splice(0,1)[0].setParent(discardPile)
            this.helper.getGame().currentHouse = this.helper.getTopCardDiscardPile().house
            this.entityStore.flag(game.id)
        })
        
        // this.eventQueue.addRule('playcard','card is not in your hand',(data) => {
        //     var card = data.card
        //     return this.helper.getCurrentPlayer().id == card.getParent().id
        // })

        this.eventQueue.addRule('playcard',`it's not your turn`,(data) => {
            return data.sessionid == this.helper.getCurrentPlayer().sessionid
        })

        this.eventQueue.addRule('playcard',`you're being bullied, either parry with a 2 or joker or accept the bullied cards`,(data) => {
            var card = this.helper.store.get(data.data) as Card
            if(this.helper.getGame().bullycounter > 0){
                return card.isJoker || card.rank.name == 'two'
            }else{
                return true
            }
        })

        this.eventQueue.addRule('playcard','cards house or rank needs to match or the top card has to be a jack or joker',(data) => {
            var card = this.helper.store.get(data.data) as Card
            var topcard = this.helper.getTopCardDiscardPile()
            
            if(topcard == null){
                return true
            }
            
            return this.helper.getGame().currentHouse.name == card.house.name ||
            topcard.rank.name == card.rank.name ||
            card.rank.name == 'jack' ||
            card.isJoker || topcard.isJoker 
        })

        this.eventQueue.addRule('playcard','final card may not be a special card',(data) => {
            var card = this.helper.store.get(data.data) as Card
            var topcard = this.helper.getTopCardDiscardPile()
            if(topcard == null){
                return true
            }
            var currentplayer = this.helper.getCurrentPlayer()
            var hand = currentplayer.descendants(e => e.type == 'card') as Card[]
            if(hand.length == 1){
                var lastcard = hand[0]
                var isSpecialcard = ['two','seven','eight','jack'].indexOf(lastcard.rank.name) != -1 || lastcard.isJoker
                return isSpecialcard == false
            }
            
            return true
        })

        

        this.eventQueue.listen('playcard',(data) => {

            var card = this.helper.store.get(data.data) as Card
            var game = this.helper.getGame()
            var currentplayer = this.helper.getCurrentPlayer()
            card.setParent(this.helper.getDiscardPile())
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
                        this.helper.getGame().currentHouse = house
                        this.incrementTurn(1)
                    })
                }else{
                    this.incrementTurn(1)
                }
            }
            this.entityStore.flag(game.id)
            
        })

        this.eventQueue.addRule('acceptcards',`it's not your turn`,(data) => {
            return data.sessionid == this.helper.getCurrentPlayer().sessionid
        })
        this.eventQueue.listen('acceptcards',() => {
            var currentplayer = this.helper.getCurrentPlayer()
            var topcard = this.helper.getTopCardDiscardPile()
            var game = this.helper.getGame()

            if(topcard.isJoker){
                this.drawCards(currentplayer, game.bullycounter)
                //dont have to choose a house, any card may be put on top of a joker
            }else if(topcard.rank.name == 'two'){
                this.drawCards(currentplayer, game.bullycounter)
                this.incrementTurn(1)
            }
            game.bullycounter = 0
            this.entityStore.flag(game.id)
        })



        this.eventQueue.listen('turnstart',(playerid) => {
            this.broadcastEvent.trigger({type:'turnstart',data:playerid})
        })



        this.eventQueue.addRule('pass',`it's not your turn`,(data) => {
            return data.sessionid == this.helper.getCurrentPlayer().sessionid
        })
        this.eventQueue.addRule('pass',`you're being bullied, either parry with a 2 or joker or accept the bullied cards`,() => {
            return this.helper.getGame().bullycounter == 0
        })
        this.eventQueue.listen('pass',() => {
            this.drawCards(this.helper.getCurrentPlayer(),1)
            this.incrementTurn(1)
        })

        this.eventQueue.listenDiscovery('discoverhouse',(data,id) => {
            data.discoverid = id
        })

        this.eventQueue.listen('gamewon',() => {
            var game = this.helper.getGame()
            game.status = 'finished'

            for(var player of this.helper.getPlayers()){
                if(player._children(e => true).length == 0){

                    console.log(`${player.name} won the game`)
                    game.winnerplayerid = player.id
                }
            }
            this.entityStore.flag(game.id)
        })

        this.eventQueue.listen('debugfinishgame',() => {
            var game = this.helper.getGame()
            game.status = 'finished'
            var firstplayer = this.helper.getPlayers()[0]
            game.winnerplayerid = firstplayer.id
            this.entityStore.flag(game.id)
        })

        this.eventQueue.listen('requestfullupdate',(data) => {
            this.entityStore.list()
            this.sendEvent.trigger({sessionid:data.sessionid,type:'update',data:{
                version:this.entityStore.versionnumber,
                data:this.entityStore.list()
            }})
        })
    }

    drawCards(player:Player,count:number){
        var deckcontainer = this.helper.getDeckContainer()
        for(var i = 0; i < count;i++){
            var topcard = this.helper.getTopCardDeck()
            if(topcard == null){
                var discardcards = this.helper.getDiscardPile()._children(e => true)
                var exceptlast = discardcards.slice(0,discardcards.length - 1)
                shuffle(exceptlast,this.rng).forEach(c => c.setParent(deckcontainer))
                var topcard = this.helper.getTopCardDeck()
                if(topcard != null){
                    topcard.setParent(player)
                }
            }else{
                topcard.setParent(player)
            }
            
        }
    }

    incrementTurn(count){
        var game = this.helper.getGame()
        game.turnindex = (game.turnindex + count) % this.helper.getPlayers().length

        this.eventQueue.add('turnstart',this.helper.getCurrentPlayer().id)
        this.entityStore.flag(game.id)
    }
    
    chooseHouse(player:Player,cb:(house:House) => void){
        
        player.isDiscoveringHouse = true
        player.discoverHouseOptions = Object.values(houseMap)
        this.entityStore.flag(player.id)

        this.eventQueue.startDiscovery('discoverhouse',player,(data) => {
            player.isDiscoveringHouse = false
            player.discoverHouseOptions = []
            this.entityStore.flag(player.id)
            cb(data)
        })
    }

    


}



function Enum2Array(en:any){
    return Object.values(en).filter(val => typeof val  == "number")
}