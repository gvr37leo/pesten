class Client{

    root:JSX.Element

    constructor(){

    }

    listenmsg(msgtype,data){

    }

    send(msgtype,data){

    }

    connect(server:Server){
        server.onConnect(this)
    }

    render(){

        

        return  renderHomepage()
    }
}