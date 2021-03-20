function Modal(props:{visible?:boolean,children?:any}){

    return (
        <div style={{display:props.visible ? "" : "none",borderRadius:"3px",position:"absolute", top: "100px",left: "30%",right: "30%",bottom: "100px",border: "1px solid white", background:"white", boxShadow:"0px 6px 5px 5px rgba(0,0,0,0.5)"}}>
            <div></div>
            <div>
                {...props.children}
            </div>
        </div>
    )
}