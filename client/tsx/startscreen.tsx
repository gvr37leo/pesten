function StartScreen(props:{client:Client}){
    return <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100vh"}} >
        <div>
            <input placeholder="Name" id="name" style={{marginRight:"20px", padding:"10px"}}/>
            <button style={{padding:"10px 20px"}} onClick={() => {
                var name = (document.querySelector('#name') as HTMLInputElement).value
                props.client.output.trigger({type:'playerjoin',data:{name:name}})
            }}>join</button>
        </div>
    </div>
}